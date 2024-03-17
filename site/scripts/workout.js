const elements = {};

function main() {
    handles();
    getWorkout();
    timer(60)
}

function handles() {
    elements.currentWorkoutText = document.querySelector('.current-workout');
    elements.nextWorkoutText = document.querySelector('.next-workout-text');
    elements.timer = document.querySelector('.timer');
}

async function getWorkout() {
    const response = await fetch('getSelectedWorkouts');
    if (response.ok) {
        workout = await response.json();
    }
    showWorkout(workout, 0);
}

async function timer(timerLength) {

    setInterval(function () {
        const currentDate = new Date();
        timeLeft = timerLength - currentDate.getTime
    }, 100);
}

function showWorkout(workout, currentWorkoutIndex) {
    const currentWorkout = workout[currentWorkoutIndex];
    const nextWorkout = workout[currentWorkoutIndex + 1];

    elements.currentWorkoutText.textContent = currentWorkout.name;
    if (nextWorkout == undefined) {
        elements.nextWorkoutText.textContent = "Finish";
    } else {
        elements.nextWorkoutText.textContent = nextWorkout.name;
    }
}

function nextWorkout(startingIndex) {
    const nextIndex = startingIndex + 1;
    return nextIndex;
}

function startWorkout() {
    let startPoint = 0;
}
main();