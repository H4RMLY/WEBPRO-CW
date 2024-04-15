const elements = {};
const templates = {};
let workoutControl = {current : undefined, previous : undefined, next : undefined};
let timerOn = false;
let paused = false;
let timerState = '00000';

function main() {
    mainHandles();
    buildShowWorkout();
    buildWorkoutControl();
    showPanel('workoutBuilder');
    buildCustomButtons();
    buildPresetButtons();
    clearWorkout()
}

// Grabs handles for important elements/templates and puts them into an object called respective of their type for later reference
function mainHandles() {
    elements.controlPanel = document.querySelector('#control-panel');
    elements.workoutBuilder = document.querySelector('#workout-builder');
    elements.customButtonPanel = document.querySelector('#custom-button-panel');
    elements.presetButtonPanel = document.querySelector('#preset-button-panel');
    elements.customContainer = document.querySelector('.custom-button-container');
    elements.presetContainer = document.querySelector('.preset-button-container');
    elements.instructionHeader = document.querySelector('#instruction-header');
    elements.instructionText = document.querySelector('#instruction-text');
    elements.panels = {};
    elements.buttons = [];
    
    templates.showWorkout = document.querySelector('#show-workout-template');
    templates.workoutControl = document.querySelector('#workout-control-template');
    templates.customButton = document.querySelector('#custom-button-template');
}

function controlHandles(){
    elements.timerBody = document.querySelector('#timer');
    elements.currentWorkoutText = document.querySelector('#current-workout-text');
    elements.nextWorkoutText = document.querySelector('#next-workout-text');
}

// Builds the workout builder panel from the template
function buildShowWorkout(){
    const template = templates.showWorkout;

    const panel = template.content.cloneNode(true);
    elements.workoutBuilder.append(panel);

    const startButton = document.querySelector('#start-workout');
    const customButton = document.querySelector('#custom');
    const presetButton = document.querySelector('#preset');

    // Adds events for buttons in this panel
    startButton.addEventListener('click', startWorkout);
    customButton.addEventListener('click', showCustomButtons);
    presetButton.addEventListener('click', showPresetButtons);
    
    // Adds the panel to the panels object in elements for later reference
    elements.panels['workoutBuilder'] = elements.workoutBuilder;
}

// Builds the workout control panel from its template
function buildWorkoutControl(){
    const template = templates.workoutControl;
    
    const panel = template.content.cloneNode(true);
    elements.controlPanel.append(panel);

    const backButton = document.querySelector('#back-button');
    const playButton = document.querySelector('#play-button');
    const pauseButton = document.querySelector('#pause-button');
    const nextButton = document.querySelector('#next-button');
    const cancelButton = document.querySelector('#cancel-button');

    playButton.addEventListener('click', startExercise);
    cancelButton.addEventListener('click', cancelWorkout);
    nextButton.addEventListener('click', nextExercise);
    backButton.addEventListener('click', previousExercise);
    pauseButton.addEventListener('click', pauseExercise);  

    // Adds the panel to the panels object in elements for later reference
    elements.panels['workoutControl'] = elements.controlPanel;
}

// Builds the custom workout buttons within the buttons panel from the custom button template
async function buildCustomButtons(){
    // Fetches exercises stored within the server
    const response = await fetch('/instructions');

    let exercises;
    if(response.ok){
        exercises = await response.json();
    }

    // Creates a button for every exercise stored in the server with its name and time to complete
    const buttonTemplate = document.querySelector('#custom-button-template')
    for (const exercise of exercises){
        const button = buttonTemplate.content.cloneNode(true);  
        const name = button.querySelector('.exercise-name');
        const time = button.querySelector('.exercise-time');
        const body = button.querySelector('.exercise-button');

        name.textContent = exercise.name;
        time.textContent = exercise.time / 100 + ' seconds';
        
        body.dataset.name = exercise.name;
        body.dataset.time = exercise.time; 

        // Adds each button to an array called buttons in the elements object for later reference
        elements.buttons[exercise.name] = body;

        // Adds events to each button
        body.addEventListener('click', addToWorkout);
        body.addEventListener('mouseover', showInstructions);
        body.addEventListener('touchstart', showInstructions);

        elements.customContainer.append(button);
        }
}

// Builds the preset workout buttons within the buttons panel from the preset button template
async function buildPresetButtons(){
    const response = await fetch('/presets');

    let presets;
    if(response.ok){
        presets = await response.json();
    }
    
    const buttonTemplate = document.querySelector('#preset-button-template')
    for (const preset of presets){
        const button = buttonTemplate.content.cloneNode(true);
        const difficulty = button.querySelector('.difficulty');
        const description = button.querySelector('.preset-description');
        const included = button.querySelector('.included-exercises');
        const time = button.querySelector('.preset-time');
        const body = button.querySelector('.preset-button');

        let includedExercises = 'Included: ';
        for (const exercise of preset.includes){
            includedExercises += exercise + ', ';
        }
        // Trims the last comma off of the string to make it neater
        includedExercises = includedExercises.substring(0, includedExercises.length - 2);

        difficulty.textContent = preset.difficulty;
        description.textContent = preset.description;
        included.textContent = includedExercises;
        time.textContent = preset.time;

        body.dataset.id = preset.id;

        body.addEventListener('click', addPreset);

        elements.buttons[preset.id] = body;

        elements.presetContainer.append(button);
    }
}

function showPanel(panel){
    elements.panels[panel].classList.remove('hidden');
}

function hidePanel(panel){
    elements.panels[panel].classList.add('hidden');
}

function hideCustomButtons(){
    if (!elements.customButtonPanel.classList.contains('hidden')){
        elements.customButtonPanel.classList.add('hidden');
    }
}

function hidePresetButtons(){
    if (!elements.presetButtonPanel.classList.contains('hidden')){
        elements.presetButtonPanel.classList.add('hidden');
    }
}

function hideAllButtons(){
    if (!elements.presetButtonPanel.classList.contains('hidden') || !elements.customButtonPanel.classList.contains('hidden')){
        elements.presetButtonPanel.classList.add('hidden');
        elements.customButtonPanel.classList.add('hidden');
    }
}

function showCustomButtons(){
    elements.customButtonPanel.classList.remove('hidden');
    hidePresetButtons();
    resetInstructions();
    clearWorkout();
}

function showPresetButtons(){
    elements.presetButtonPanel.classList.remove('hidden');
    hideCustomButtons();
    resetInstructions();
    clearWorkout();
}

async function startWorkout(){
    const workout = await getWorkout();

    let selectedExercisesText = document.querySelector('#selected-workouts-text')

    if (workout.length < 4) {
        let oldText = selectedExercisesText.textContent;
        selectedExercisesText.textContent = 'Please select at least four workouts or one preset workout.';
        setTimeout(function () {
            selectedExercisesText.textContent = oldText;
        }, 1200);
    } else {
        paused = false;
        bumpBoxes();
        hideAllButtons();
        hidePanel('workoutBuilder');
        showPanel('workoutControl');
        resetInstructions();
        controlHandles();
        populateWorkoutControl(workout)
        showCurrentWorkout()
    }
}

function startExercise(){
    paused = false;
    timer()
}

function cancelWorkout(){
    pauseExercise()
    bumpBoxes()
    hidePanel('workoutControl');
    showPanel('workoutBuilder');
    resetInstructions()
    clearWorkout()
}

function pauseExercise(){
    paused = true;
}

// Animation timing for boxes at the top of the screen
async function bumpBoxes(){
    const boxes = document.querySelectorAll('.colour-pallete');
    for (let box of boxes){
       const x = await awaitThis(box, 10);
    }
}

// Continued animation timing for boxes
function awaitThis(box, x){
    return new Promise((resolve) => {
        setTimeout(() => {box.classList.add('up'); resolve(x);}, 150);
        box.classList.remove('up');
    });
}

// Event for adding a clicked exercise to the custom workout
function addToWorkout(e){
    let selectedExercise = e.target.dataset.name;
    let selectedExerciseTime = e.target.dataset.time;
    e.target.classList.toggle("clicked");
    if (e.target.classList.contains("clicked")) {
        postWorkout(selectedExercise, selectedExerciseTime, '0');
    } else {
        removeExercise(selectedExercise);
    }
}

// Posts clicked exercise to server so it can be added to the custom workout with its time (time is handled server side)
async function postWorkout(exerciseName, exerciseTime, exerciseIndex) {
    const payload = { name: exerciseName, time: exerciseTime, index: exerciseIndex };

    const response = await fetch('selectedExercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // Fetches an updated version of the custom workout to show within the panel
    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    showSelectedWorkout(updatedWorkoutList);
}

async function addPreset(e){
    e.target.classList.toggle("clicked");
    let updatedWorkoutList;
    if (e.target.classList.contains("clicked")) {
        const response = await fetch('addPreset/' + e.target.dataset.id);
        if (response.ok) {
            updatedWorkoutList = await response.json();
            showSelectedWorkout(updatedWorkoutList);
        }
    } else {
        clearWorkout();
    }
}

// Code for showing the current contents of the custom workout
function showSelectedWorkout(content) {
    let selectedExercisesText = document.querySelector('#selected-workouts-text')
    let selectedExercises = 'Current Selected: ';
    // This handles the formatting depending on if the custom workout is empty or not
    if (content.length > 0) {
        for (const exercise of content) {
            selectedExercises += exercise.name + ', ';
        }
        selectedExercises = selectedExercises.substring(0, selectedExercises.length - 2);
        selectedExercisesText.textContent = selectedExercises;
    } else {
        selectedExercisesText.textContent = 'Your selected workouts will appear here!';
    }
}

// Code for showing the exercise instructions on hover/button hold
async function showInstructions(e) {
    // This just fetches the targeted exercises instruction and displays it in the instructions box
    const response = await fetch('instructions/' + e.target.dataset.name);
    if (response.ok) {
        const instruction = await response.json();
        elements.instructionHeader.textContent = instruction.name;
        elements.instructionText.textContent = instruction.content;
    }
}

// Resets instructions box back to default text
function resetInstructions(){
    elements.instructionHeader.textContent = 'Need Help?';
    elements.instructionText.textContent = 'Hover over or press and hold an excerise and instructions will appear here on how to do it.';
}

// Code for removing exercises from the custom workout
async function removeExercise(exercise) {
    // This just sends a fetch request with the exercise to be removed and returns with an updated version of the custom workout
    const response = await fetch('remove/' + exercise);
    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    showSelectedWorkout(updatedWorkoutList);
}

// Code for clearing all exercises from the custom workout
async function clearWorkout(){
    const response = await fetch('clear');
    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    clearSelection()
    showSelectedWorkout(updatedWorkoutList);
}

// This just resets all styling for selected buttons back to default
function clearSelection(){
    let selected = document.querySelectorAll('.clicked');
    for (let button of selected){
        button.classList.toggle("clicked");
    }
}

async function timer() {
    // startTime at 100 == 1 Second
    timerOn = true;
        const timer = setInterval(function () {
            if (paused !== true){
                if (timerState > 0) {
                    timerState -= 1;
                } else {
                    timerOn = false;
                    nextExercise();
                    clearInterval(timer);
                }
                const seconds = timerState.toString().slice(0, 2);
                const milliseconds = timerState.toString().slice(2, 4);
                elements.timerBody.textContent = seconds + "." + milliseconds;
        } else {
            timerOn = false;
            clearInterval(timer);
        }
    }, 10);
}

function populateWorkoutControl(workout){
    workoutControl.current = workout[0]
    workoutControl.next = workout[1]
}

function showCurrentWorkout(){
    timerState = workoutControl.current.time
    elements.currentWorkoutText.textContent = workoutControl.current.name;
    elements.nextWorkoutText.textContent = workoutControl.next.name;

    getCurrentInstruction(workoutControl.current.name);

    elements.timerBody.textContent = workoutControl.current.time / 100;
}

async function getWorkout(){
    const response = await fetch('getWorkout');
    let workout;
    if (response.ok) {
        workout = await response.json();
    }
    return workout;
}

async function getCurrentInstruction(exerciseName){
    const response = await fetch('instructions/'+ exerciseName);
    
    let currentInstruction;
    if (response.ok) {
        currentInstruction = await response.json();
    }
    elements.instructionText.textContent = currentInstruction.content;
}

async function previousExercise(){
    if (workoutControl.previous !== undefined && timerOn !== true) {
        const workout = await getWorkout();
    
        workoutControl.next = workoutControl.current;
    
        workoutControl.current = workoutControl.previous;
    
        if (workout[workoutControl.current.index - 1] === undefined){
            workoutControl.previous = undefined;
        } else {
            workoutControl.previous = workout[workoutControl.current.index - 1];
        }
    }

    showCurrentWorkout();
}

async function nextExercise(){
    if(timerOn === false){
        const workout = await getWorkout();
    
        workoutControl.current = workoutControl.next;
        if (workout[workoutControl.next.index + 1] === undefined){
            workoutControl.next = {name: "Finished", time: "00000", index: "0"};
        } else {
            workoutControl.next = workout[workoutControl.next.index + 1]
        }
        workoutControl.previous = workout[workoutControl.current.index - 1];

        showCurrentWorkout();
    }
}

//instead of traversing the workout just remove the first exercise in the array after its been completed 
//(possibly add it to a completed workout array so it can be refered to later)

main();