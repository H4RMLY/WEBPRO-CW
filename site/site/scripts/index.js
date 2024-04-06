const elements = {};
const templates = {};

function main() {
    handles();
    buildShowWorkout();
    buildWorkoutControl();
    showPanel('workoutBuilder');
    buildCustomButtons();
    clearWorkout()
}

function handles() {
    elements.controlPanel = document.querySelector('#control-panel');
    elements.workoutBuilder = document.querySelector('#workout-builder');
    elements.customButtonPanel = document.querySelector('#custom-button-panel');
    elements.presetButtonPanel = document.querySelector('#preset-button-panel');
    elements.buttonContainer = document.querySelector('.button-container');
    elements.panels = {};
    elements.buttons = [];
    
    templates.showWorkout = document.querySelector('#show-workout-template');
    templates.workoutControl = document.querySelector('#workout-control-template');
    templates.customButton = document.querySelector('#custom-button-template');
}

function buildShowWorkout(){
    const template = templates.showWorkout;

    const panel = template.content.cloneNode(true);
    elements.controlPanel.append(panel);

    const section = document.querySelector('#workout-and-nav');
    const startButton = document.querySelector('#start-workout');
    const customButton = document.querySelector('#custom');
    const presetButton = document.querySelector('#preset');

    elements.panels['workoutBuilder'] = section;

    startButton.addEventListener('click', startWorkout);
    customButton.addEventListener('click', showCustomButtons);
    presetButton.addEventListener('click', showPresetButtons);
}

function buildWorkoutControl(){
    const template = templates.workoutControl;
    
    const panel = template.content.cloneNode(true);
    elements.controlPanel.append(panel);

    const currentWorkoutText = document.querySelector('#current-workout-text')
    const timer = document.querySelector('.timer')
    const backButton = document.querySelector('.previous')
    const playButton = document.querySelector('.play')
    const pauseButton = document.querySelector('.pause')
    const nextButton = document.querySelector('.next')
    const section = document.querySelector('#workout-control-container');

    elements.panels['workoutControl'] = section;
}

async function buildCustomButtons(){
    const response = await fetch('/instructions');
    let exercises;

    if(response.ok){
        exercises = await response.json();
    }

    const buttonTemplate = document.querySelector('#custom-button-template')
    for (const exercise of exercises){
        const button = buttonTemplate.content.cloneNode(true);  
        const name = button.querySelector('.exercise-name');
        const time = button.querySelector('.exercise-time');
        const body = button.querySelector('.exercise-button');

        name.textContent = exercise.name;
        time.textContent = exercise.time / 100 + ' seconds';
        body.dataset.id = exercise.id;
        body.dataset.name = exercise.name;  

        elements.buttons[exercise.name] = body;

        body.addEventListener('click', addToWorkout);
        elements.buttonContainer.append(button);
        }
}
    

function showPanel(panel){
    showElement(elements.panels[panel]);
}

function showElement(elem){
    elem.classList.remove('hidden');
}

function hidePanel(panel){
    hideElement(elements.panels[panel]);
}

function hideElement(elem){
    elem.classList.add('hidden');
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

function showCustomButtons(){
    elements.customButtonPanel.classList.remove('hidden');
    hidePresetButtons();
    clearWorkout()
}

function showPresetButtons(){
    elements.presetButtonPanel.classList.remove('hidden');
    hideCustomButtons();
    clearWorkout()
}

function startWorkout(){
    console.log("start test");
    bumpBoxes()
}

async function bumpBoxes(){
    const boxes = document.querySelectorAll('.colour-pallete');
    for (let box of boxes){
       const x = await awaitThis(box, 10);
    }
}

function awaitThis(box, x){
    return new Promise((resolve) => {
        setTimeout(() => {box.classList.add('up'); resolve(x);}, 150)
        box.classList.remove('up')
    });
}

function addToWorkout(e){
    let selectedExercise = e.target.dataset.name;
    e.target.classList.toggle("clicked");
    if (e.target.classList.contains("clicked")) {
        postWorkout(selectedExercise);
    } else {
        removeExercise(selectedExercise);
    }
}

async function postWorkout(exerciseName) {
    const payload = { name: exerciseName, time: '00000'};

    const response = await fetch('selectedExercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    } else {
        updatedWorkoutList = ('Error receiving workout at client');
    }
    showSelectedWorkout(updatedWorkoutList);
}

function showSelectedWorkout(content) {
    let selectedExercisesText = document.querySelector('#selected-workouts-text')
    let selectedExercises = 'Current Selected:';
    if (content.length > 0) {
        for (const exercise of content) {
            selectedExercises += ' ' + exercise.name;
        }
        selectedExercisesText.textContent = selectedExercises;
    } else {
        selectedExercisesText.textContent = 'Your selected workouts will appear here!';
    }
}

async function removeExercise(exercise) {
    const response = await fetch('remove/' + exercise);
    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    showSelectedWorkout(updatedWorkoutList);
}

async function clearWorkout(){
    const response = await fetch('clear');
    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    clearSelection()
    showSelectedWorkout(updatedWorkoutList);
}

function clearSelection(){
    let selected = document.querySelectorAll('.clicked');
    for (let button of selected){
        button.classList.toggle("clicked");
    }
}

main();