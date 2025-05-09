const elements = {};
const templates = {};
let workoutControl = {current : undefined, previous : undefined, next : undefined};
let timerOn = false;
let paused = true;
let timerState = '00000';
let presetSelected = false;
let currentLoggedIn = undefined;
let currentPanel = undefined;

// Above are the global variables used to keep track of the state of the application

window.addEventListener('load', main);

function main() {
    templatesAndPanels();
    buildAll();
    elementHandles();
    showPanel('workoutBuilder');
    clearWorkout();
}

function buildAll(){
    buildLogin();
    buildShowWorkout();
    buildWorkoutControl();
    buildCustomButtons();
    buildPresetButtons();
    buildSaveWorkout();
}

// Grabs handles for all panels and templates
function templatesAndPanels(){
    templates.userWorkout = document.querySelector('#saved-button-template');
    templates.presetButton = document.querySelector('#preset-button-template');
    templates.showWorkout = document.querySelector('#show-workout-template');
    templates.workoutControl = document.querySelector('#workout-control-template');
    templates.customButton = document.querySelector('#custom-button-template');
    templates.saveWorkout = document.querySelector('#save-workout-template');
    templates.accountButton = document.querySelector('#account-button-template');

    elements.controlPanel = document.querySelector('#control-panel');
    elements.workoutBuilder = document.querySelector('#workout-builder');
    elements.customButtonPanel = document.querySelector('#custom-button-panel');
    elements.presetButtonPanel = document.querySelector('#preset-button-panel');
    elements.saveWorkoutPanel = document.querySelector('#save-workout-panel');
    elements.loginPanel = document.querySelector('#login-panel');
    elements.panels = {};
}

// Grabs handles for important elements and puts them into the elements object
function elementHandles() {
    elements.customContainer = document.querySelector('.custom-button-container');
    elements.presetContainer = document.querySelector('.preset-button-container');
    elements.loginContainer = document.querySelector('.login-container');
    elements.instructionHeader = document.querySelector('#instruction-header');
    elements.instructionText = document.querySelector('#instruction-text');
    elements.loginButton = document.querySelector('#login');
    elements.selectedExercisesText =  document.querySelector('#selected-workouts-text');
    elements.playButton = document.querySelector('#play-button');
    elements.loggedInAs = document.querySelector('#logged-in-as');
    elements.instructionsPanel = document.querySelector('.instructions');
    elements.cancelButton = document.querySelector('#cancel-button');
}

// Grabs important handles on the workout controller that couldnt be before the start button clicked
function controlHandles(){
    elements.timerBody = document.querySelector('#timer');
    elements.currentWorkoutText = document.querySelector('#current-workout-text');
    elements.nextWorkoutText = document.querySelector('#next-workout-text');
}

// ------------------ All Panel and Button Builders ------------------ //

// Builds the workout builder panel from the template
function buildShowWorkout(){
    const template = templates.showWorkout;

    const panel = template.content.cloneNode(true);
    elements.workoutBuilder.append(panel);

    const startButton = document.querySelector('#start-workout');
    const clearButton = document.querySelector('#clear-workout');
    const customButton = document.querySelector('#custom');
    const presetButton = document.querySelector('#preset');

    // Adds events for buttons in this panel
    startButton.addEventListener('click', startWorkout);
    customButton.addEventListener('click', showCustomButtons);
    presetButton.addEventListener('click', showPresetButtons);
    clearButton.addEventListener('click', clearWorkout);

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
    const nextButton = document.querySelector('#next-button');
    const cancelButton = document.querySelector('#cancel-button');

    playButton.addEventListener('click', timerControl);
    cancelButton.addEventListener('click', cancelWorkout);
    nextButton.addEventListener('click', nextExercise);
    backButton.addEventListener('click', previousExercise); 

    elements.panels['workoutControl'] = elements.controlPanel;
}

// Builds the save workout panel
function buildSaveWorkout(){
    const template = templates.saveWorkout;
    
    const panel = template.content.cloneNode(true);
    elements.saveWorkoutPanel.append(panel);

    const saveButton = document.querySelector('#save-button');
    const showPanelButton = document.querySelector('#save-workout');
    const exitButton = document.querySelector('#close-save-workout');

    saveButton.addEventListener('click', saveWorkoutButton); 
    showPanelButton.addEventListener('click', showSaveWorkoutPanel);
    exitButton.addEventListener('click', closeSaveWorkoutPanel);

    elements.panels['saveWorkout'] = elements.saveWorkoutPanel;
}

// Builds the login panel
async function buildLogin(){
    elements.panels['login'] = elements.loginPanel;
    const response = await fetch('accounts');

    const createUserButton = document.querySelector('#create-user-button');
    createUserButton.addEventListener('click', createUser);

    let accounts;
    if(response.ok){ accounts = await response.json(); }

    for(const account of accounts){ buildAccountButton(account); }

    const backButton = document.querySelector('#hide-login');
    const loginButton = document.querySelector('#login'); 
    const saveButton = document.querySelector('#save-workout');
    backButton.addEventListener('click', loginBackButton);
    loginButton.addEventListener('click', loginButtonFunction);
    saveButton.addEventListener('click', saveWorkoutButton);
}

// This is for creating the buttons for each acccount on the login panel
function buildAccountButton(account){
    const buttonTemplate = templates.accountButton;
    const button = buttonTemplate.content.cloneNode(true);
    const name = button.querySelector('.account-name');
    const username = button.querySelector('.account-username');
    const body = button.querySelector('.account-button');
    name.textContent = account.name;
    username.textContent = account.username;

    body.dataset.username = account.username;
    body.addEventListener('click', loginAsUser);

    elements.loginContainer.append(button);
}

// Builds the custom workout buttons within the buttons panel from the custom button template
async function buildCustomButtons(){
    // Fetches exercises stored within the server
    const response = await fetch('/instructions');

    let exercises;
    if(response.ok){ exercises = await response.json(); }

    // Creates a button for every exercise stored in the server with its name and time to complete
    const buttonTemplate = templates.customButton;
    for (const exercise of exercises){
        const button = buttonTemplate.content.cloneNode(true);  
        const name = button.querySelector('.exercise-name');
        const time = button.querySelector('.exercise-time');
        const body = button.querySelector('.exercise-button');

        name.textContent = exercise.name;
        time.textContent = exercise.time / 100 + ' seconds';
        
        body.dataset.name = exercise.name;
        body.dataset.time = exercise.time; 

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
    if(response.ok){ presets = await response.json(); }
    
    const buttonTemplate = templates.presetButton;
    for (const preset of presets){
        const button = buttonTemplate.content.cloneNode(true);
        const difficulty = button.querySelector('.difficulty');
        const description = button.querySelector('.preset-description');
        const included = button.querySelector('.included-exercises');
        const time = button.querySelector('.preset-time');
        const body = button.querySelector('.preset-button');

        let includedExercises = 'Included: ';
        for (const exercise of preset.includes){ includedExercises += exercise + ', '; }
        // Trims the last comma off of the string to make it neater
        includedExercises = includedExercises.substring(0, includedExercises.length - 2);

        difficulty.textContent = preset.difficulty;
        description.textContent = preset.description;
        included.textContent = includedExercises;
        time.textContent = preset.time;

        body.dataset.id = preset.id;

        body.addEventListener('click', addPreset);

        elements.presetContainer.append(button);
    }
}

// Builds a button from the users saved workouts and adds it to the preset panel
async function addUserWorkouts(username){
    const response = await fetch('savedExercises/' + username);

    let savedWorkouts;
    if(response.ok){ savedWorkouts = await response.json(); }
    if (savedWorkouts.length > 0){
        const buttonTemplate = templates.userWorkout;
        for(const workout of savedWorkouts){
            const button = buttonTemplate.content.cloneNode(true);
            const body = button.querySelector('.saved-button');
            const name = button.querySelector('.saved-name');
            const description = button.querySelector('.saved-description');
            const included = button.querySelector('.saved-exercises');

            name.textContent = workout.name;
            description.textContent = workout.description;

            let includedExercises = 'Included: ';
            for (const exercise of workout.includes){ includedExercises += exercise + ', '; }
            includedExercises = includedExercises.substring(0, includedExercises.length - 2);
            included.textContent = includedExercises;
            
            body.dataset.name = workout.name;
            body.dataset.user = username;

            body.addEventListener('click', addSavedWorkout);

            elements.presetContainer.append(button);
        }
    }
}

// ------------------ All Functions for event listeners ------------------ //

// Creates a new user from the inputted name and username on the login panel
async function createUser(){
    const usernameInput = document.querySelector('#create-user-username');
    const nameInput = document.querySelector('#create-user-name');

    const payload = { name: nameInput.value, user: usernameInput.value };
    const response = await fetch('/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        const newAccount = await response.json(); 
        buildAccountButton(newAccount); 
    }
}
// Event handler for the start workout button on the build workout panel
async function startWorkout(){
    const workout = await getWorkout();

    // Checks if the workout has at least four exercises in it
    if (workout.length < 4) {
        let oldText = await elements.selectedExercisesText.textContent;
        elements.selectedExercisesText.textContent = 'Please select at least four workouts or one preset workout.';
        setTimeout(function () {
            elements.selectedExercisesText.textContent = oldText;
        }, 1200);
    // If the workout has at least four exercises in it then the panel will switch to the workout control panel
    } else {
        controlHandles();
        paused = true;
        elements.timerBody.style.fontSize = "8em";
        elements.loginButton.classList.add('hidden');
        bumpBoxes();
        hideAllButtons();
        hidePanel('workoutBuilder');
        showPanel('workoutControl');
        resetInstructions();
        populateWorkoutControl(workout);
        showCurrentWorkout();
        showInstructionsPanel();
    }
}

function showCustomButtons(){
    elements.customButtonPanel.classList.remove('hidden');
    hidePresetButtons();
    resetInstructions();
    clearWorkout();
    showInstructionsPanel();
}

function showPresetButtons(){
    elements.presetButtonPanel.classList.remove('hidden');
    hideInstructionsPanel();
    hideCustomButtons();
    resetInstructions();
    clearWorkout();
}

// Code for clearing all exercises from the custom workout
async function clearWorkout(){
    const response = await fetch('clear');
    let updatedWorkoutList;
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    clearSelection();
    showSelectedWorkout(updatedWorkoutList);
}

// Event handler for the pause button on the workout control panel
function timerControl(){
    paused = !paused;
    if (paused) {
        elements.playButton.textContent = "⯈";   
    } else {
        elements.playButton.textContent = "ǁ";
        timer(timerState);
    }
}

// Event handler for the cancel button on the workout control panel
function cancelWorkout(){
    paused = true;
    elements.loginButton.classList.remove('hidden');
    bumpBoxes();
    hidePanel('workoutControl');
    showPanel('workoutBuilder');
    resetInstructions();
    clearWorkout();
}

// Allows navigation to the next exercise using the previous button
async function nextExercise(){
    if(timerOn === false){
        const workout = await getWorkout();
        // Shifts all exercises in the workoutControl object back by one
        workoutControl.current = workoutControl.next;
        if (workout[workoutControl.next.index + 1] === undefined){
            workoutControl.next = {name: "Finished", time: "00000", index: "0"};
        } else {
            workoutControl.next = workout[workoutControl.next.index + 1];
        }
        workoutControl.previous = workout[workoutControl.current.index - 1];
        showCurrentWorkout();
    }
}

// Allows navigation to the previous exercise using the previous button
async function previousExercise(){
    if (workoutControl.previous !== undefined && timerOn !== true) {
        const workout = await getWorkout();
        // Shifts all exercises in the workoutControl object back by one
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

function loginAsUser(e){
    if (currentLoggedIn === undefined){
        elements.loginButton.textContent = 'Sign out';
        currentLoggedIn = e.target.dataset.username;
        elements.loggedInAs.textContent = 'Logged in as: ' + currentLoggedIn; 
        addUserWorkouts(e.target.dataset.username);
        showHideSaveButton();
        loginBackButton();
    }
}

const loginBackButton = () => { hidePanel('login'); showPanel('workoutBuilder'); }

function loginButtonFunction(){  
    if (elements.loginButton.textContent === 'Sign out'){
        signOut();
        return;
    }
    showPanel('login');
    hideAllButtons();
    hidePanel('workoutBuilder');
}

function signOut(){
    currentLoggedIn = undefined;
    elements.loggedInAs.textContent = 'Not currently logged in';
    elements.loginButton.textContent = 'Log in';
    removeUserButtons();
    clearWorkout();
    showHideSaveButton();
}

// Event for adding a selected exercise to the custom workout
function addToWorkout(e){
    let selectedExercise = e.target.dataset.name;
    let selectedExerciseTime = e.target.dataset.time;
    e.target.classList.toggle("clicked");
    const clicked = (e.target.classList.contains("clicked")) ? postWorkout(selectedExercise, selectedExerciseTime, '0') : removeExercise(selectedExercise);
}

// Event for showing the exercise instructions on hover/button hold
async function showInstructions(e) {
    // This just fetches the targeted exercises instruction and displays it in the instructions box
    const response = await fetch('instructions/' + e.target.dataset.name);
    if (response.ok) {
        const instruction = await response.json();
        elements.instructionHeader.textContent = instruction.name;
        elements.instructionText.textContent = instruction.content;
    }
}

// Event handler for adding a preset workout to the custom workout
async function addPreset(e){
    e.target.classList.toggle("clicked");
    // Checks if a preset is already selected
    if (e.target.classList.contains("clicked")) {
        if(presetSelected === false){
            presetSelected = true;
            let includedExercises;
            // Fetches preset data from the server based off of the id in the buttons dataset
            const response = await fetch('addPreset/' + e.target.dataset.id);
            if (response.ok) {
                includedExercises = await response.json();
                /* Iterates through all the exercises included within the preset and adds them individually to the workout
                   as if the user had clicked them in the custom workout panel */
                for (const exerciseName of includedExercises){
                    const exerciseObj = await getCurrentInstruction(exerciseName);
                    postWorkout(exerciseObj.name, exerciseObj.time, '0');
                }
            }
        // If preset has already been selected this code blocks you from adding another one
        } else {
            e.target.classList.toggle("clicked");
            let oldText = elements.selectedExercisesText.textContent;
            elements.selectedExercisesText.textContent = 'You can only select one preset';
            setTimeout(function () {
                elements.selectedExercisesText.textContent = oldText;
            }, 1200);
        }
    // Allows you to deselect a selected preset by selecting it again like with the custom buttons
    } else {
        presetSelected = false;
        clearWorkout();
    }
}


/* This function is for adding the exercises in a users saved workout to the selected exercises.
   Functionally it is almost exactly the same as the addPreset fuction with minor differences.*/
   async function addSavedWorkout(e){
    e.target.classList.toggle("clicked");
    if (e.target.classList.contains("clicked")) {
        if(presetSelected === false){
            presetSelected = true;
            // This is the main difference as it requires a post request instead of a regular get to pass multiple params through
            let includedExercises;
            const payload = { name: e.target.dataset.name, user: e.target.dataset.user };
            const response = await fetch('addSaved', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                includedExercises = await response.json();
                for (const exerciseName of includedExercises){
                    const exerciseObj = await getCurrentInstruction(exerciseName);
                    postWorkout(exerciseObj.name, exerciseObj.time, '0');
                }
            }
        } else {
            e.target.classList.toggle("clicked");
            let oldText = await elements.selectedExercisesText.textContent;
            elements.selectedExercisesText.textContent = 'You can only select one preset';
            setTimeout(function () {
                elements.selectedExercisesText.textContent = oldText;
            }, 1200);
        }
    } else {
        presetSelected = false;
        clearWorkout();
    }
}

async function saveWorkoutButton(){
    const workout = await getWorkout();
    const nameInput = document.querySelector('#save-workout-name');
    const descInput = document.querySelector('#save-workout-desc');
    workoutName = nameInput.value;
    workoutDesc = descInput.value;
    if (workout.length >= 4 && nameInput.value && descInput.value){
        workoutName = nameInput.value;
        workoutDesc = descInput.value;
        nameInput.value = "";
        descInput.value = "";
        let exerciseNames = [];
        for(exercise of workout){
            exerciseNames.push(exercise.name);
        }
        saveWorkout(workoutName, workoutDesc, exerciseNames);
        hidePanel('saveWorkout');
        showPanel('workoutBuilder');
        hideAllButtons();
        addUserWorkouts(currentLoggedIn);
    }
}

async function clearSavedWorkouts(user){
    const response = await fetch('clearSaved/' + user);
    if (response.ok){
        console.log(await response.json());
    }
}

async function showSaveWorkoutPanel(){
    const workout = await getWorkout();
    hideAllButtons();
    hidePanel(currentPanel);
    showPanel('saveWorkout');
    if (workout.length >= 4){
        const nameInput = document.querySelector('#save-workout-name');
        const descInput = document.querySelector('#save-workout-desc');
        const saveButton = document.querySelector('#save-button');
        nameInput.removeAttribute('disabled');
        descInput.removeAttribute('disabled');
        saveButton.textContent = "Save";
    }
}

function closeSaveWorkoutPanel(){
    hidePanel('saveWorkout');
    showPanel('workoutBuilder');
    elements.loginButton.classList.remove('hidden');
}
// ------------------ All Functions used outside buttons ------------------ //

function hideInstructionsPanel(){
    elements.instructionsPanel.classList.add('hidden');
}

function showInstructionsPanel(){
    elements.instructionsPanel.classList.remove('hidden');
}

async function showHideSaveButton(){
    const workout = await getWorkout();
    if (workout.length >= 4 && currentLoggedIn != undefined);{
        const button = document.querySelector('#save-workout');
        button.classList.toggle('hidden');
    }
}
// This posts the workout the user wants to save to the server
async function saveWorkout(workoutName, workoutDesc, workout){
    const payload = { name: workoutName, description: workoutDesc, includes: workout, user: currentLoggedIn};
    const response = await fetch('saveWorkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (response.ok) {console.log('Workout Saved');}
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

const showPanel = (panelName) => { elements.panels[panelName].classList.remove('hidden');  currentPanel = panelName;}

const hidePanel = (panelName) => { elements.panels[panelName].classList.add('hidden'); }

const hideCustomButtons = () => { const hide = (!elements.customButtonPanel.classList.contains('hidden')) ? elements.customButtonPanel.classList.add('hidden') : "Already Hidden";}

const hidePresetButtons = () => { const hide = (!elements.presetButtonPanel.classList.contains('hidden')) ? elements.presetButtonPanel.classList.add('hidden') : "Already Hidden";}

function removeUserButtons(){
    const buttons = document.querySelectorAll('.saved-button');
    for (const button of buttons){ button.remove(); }
}

const hideAllButtons = () =>{ hideCustomButtons(); hidePresetButtons();}

/* Populates the workout control object with the first two exercises
 The workoutControl object keeps track of the current next and previous exercises globally */
 function populateWorkoutControl(workout){
    workoutControl.current = workout[0];
    workoutControl.next = workout[1];
}

/* Posts selected exercise to server so it can be added to the custom workout with its time and filler index
   (Index is handled server side) */
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

// Code for showing the current contents of the custom workout
function showSelectedWorkout(content) {
    let selectedExercises = 'Currently Selected: ';
    // This handles the formatting depending on if the custom workout is empty or not
    if (content.length > 0) {
        for (const exercise of content) {
            selectedExercises += exercise.name + ', ';
        }
        elements.selectedExercises = selectedExercises.substring(0, selectedExercises.length - 2);
        elements.selectedExercisesText.textContent = selectedExercises;
    } else {
        elements.selectedExercisesText.textContent = 'Your selected workouts will appear here!';
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

// This just resets all styling for selected buttons back to default
function clearSelection(){
    let selected = document.querySelectorAll('.clicked');
    presetSelected = false;
    for (let button of selected){
        button.classList.toggle("clicked");
    }
}

// This is the timer for each exercise which is updated every 10th of a second
async function timer() {
    // timerState at 100 = 1 Second
    // Having a timer on variable means when the timer is running the user cannot change the exercise unless it is stopped
    timerOn = true;
        const timer = setInterval(function () {
            if (paused !== true){
                // Timer state is a global variable so the timer can be resumed at the time it was paused at
                if (timerState > 0) {
                    timerState -= 1;
                } else {
                    timerOn = false;
                    nextExercise();
                    clearInterval(timer);
                }
                // This is the formatting for splitting the seconds and milliseconds
                const seconds = timerState.toString().slice(0, 2);
                const milliseconds = timerState.toString().slice(2, 4);
                elements.timerBody.textContent = seconds + "." + milliseconds;
        } else {
            timerOn = false;
            clearInterval(timer);
        }
    }, 10);
}

/* Formatting for the workout control panel which handles the name of the current and next exercise,
 the timer before it has started and the instructions bellow the control panel */
async function showCurrentWorkout(){
    timerState = workoutControl.current.time;
    elements.currentWorkoutText.textContent = workoutControl.current.name;
    elements.nextWorkoutText.textContent = workoutControl.next.name;
    if (workoutControl.current.name === "Finished"){
        endWorkout();
    } else {
        elements.timerBody.textContent = workoutControl.current.time / 100;
    }
    
    const instruction = await getCurrentInstruction(workoutControl.current.name);
    elements.instructionText.textContent = instruction.content;
}

// Fetches the custom workout from the server
async function getWorkout(){
    const response = await fetch('getWorkout');
    let workout;
    if (response.ok) {
        workout = await response.json();
    }
    return workout;
}

// Fetches the specified exercise by name from the server with all its content
async function getCurrentInstruction(exerciseName){
    const response = await fetch('instructions/'+ exerciseName);
    let currentInstruction;
    if (response.ok) {
        currentInstruction = await response.json();
        return currentInstruction;
    }
}

function endWorkout() {
    elements.timerBody.style.fontSize = "3em";
    elements.timerBody.textContent = "Congratulations on completing your workout!";
    elements.cancelButton.textContent = "Back to Home";
}

