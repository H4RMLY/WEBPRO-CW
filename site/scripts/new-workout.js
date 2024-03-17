const elements = {};

function main() {
    handles();
    addEvents();
    clearWorkout();
}

function handles() {
    elements.armWorkouts = document.querySelectorAll('.arms');
    elements.legWorkouts = document.querySelectorAll('.legs');
    elements.chestWorkouts = document.querySelectorAll('.chest');
    elements.enduranceWorkouts = document.querySelectorAll('.endurance');
    elements.instructionText = document.querySelector('#instruction-text');
    elements.instructionTitle = document.querySelector('#instruction-header');
    elements.presetWorkouts = document.querySelectorAll('.preset-button')
    elements.selectedWorkoutsContent = document.querySelector('.selected-workouts-text');
    elements.startButton = document.querySelector('.start-workout');
}

async function showInstructions(e) {
    const response = await fetch('instructions/' + e.target.id);
    if (response.ok) {
        const instruction = await response.json();
        elements.instructionTitle.textContent = instruction.name;
        elements.instructionText.textContent = instruction.content;
    }
}

function startWorkoutEvent() {
    elements.startButton.addEventListener('click', startWorkout);
}

async function startWorkout() {
    elements.startButton.textContent = 'Lets GO!'
    elements.startButton.classList.toggle('clicked')
    setTimeout(function () {
        elements.startButton.classList.toggle('clicked')
        elements.startButton.textContent = 'Start'
    }, 600);

    const response = await fetch('getSelectedWorkouts');
    let selectedWorkoutList;
    if (response.ok) {
        selectedWorkoutList = await response.json();
    }

    if (selectedWorkoutList.length < 4) {
        let oldText = elements.selectedWorkoutsContent.textContent;
        elements.selectedWorkoutsContent.textContent = 'Please select at least four workouts or one preset workout';
        setTimeout(function () {
            elements.selectedWorkoutsContent.textContent = oldText;
        }, 1200);
    } else {
        window.location.href = "workout.html";
    }
}

function addEvents() {
    let allExercises = [];
    allExercises.push(elements.armWorkouts, elements.legWorkouts, elements.chestWorkouts, elements.enduranceWorkouts, elements.presetWorkouts);
    for (let workout of allExercises) {
        for (let exercise of workout) {
            exercise.addEventListener('click', addToWorkout);
            exercise.addEventListener('touchstart', showInstructions);
            exercise.addEventListener('mouseover', showInstructions);
        }
    }
    startWorkoutEvent()
}

function addToWorkout(e) {
    let selectedWokout = e.target.dataset.name;
    e.target.classList.toggle("clicked");
    if (e.target.classList.contains("clicked")) {
        postWorkout(selectedWokout);
    } else {
        removeWorkout(selectedWokout);
    }
}

async function postWorkout(workoutName) {
    const payload = { name: workoutName };
    console.log('Payload', payload);

    const response = await fetch('selectedWorkouts', {
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
    showSelectedWorkouts(updatedWorkoutList);
}

function showSelectedWorkouts(content) {
    let selectedWorkouts = 'Current Selected:';
    console.log(content);
    if (content.length > 0) {
        for (const workout of content) {
            selectedWorkouts += ' ' + workout.name;
        }
        elements.selectedWorkoutsContent.textContent = selectedWorkouts;
    } else {
        elements.selectedWorkoutsContent.textContent = 'Your selected workouts will appear here';
    }
}

async function clearWorkout() {
    const response = await fetch('clear');
}

async function removeWorkout(workout) {
    const response = await fetch('remove/' + workout);
    if (response.ok) {
        updatedWorkoutList = await response.json();
    }
    showSelectedWorkouts(updatedWorkoutList);
}
main();