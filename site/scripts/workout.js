const elements = {};
const workoutsList = [];

function main() {
    handles();
    getWorkouts();
    showWorkouts(0)

}

function handles() {
    elements.currentWorkoutText = document.querySelector('.current-workout');
    elements.nextWorkoutText = document.querySelector('.next-workout-text');
    elements.timer = document.querySelector('.timer');
}

async function getWorkouts() {
    const response = await fetch('getSelectedWorkouts');
    if (response.ok) {
        retreivedWorkouts = await response.json();
    }
    for (let workout of retreivedWorkouts) {
        workoutsList.push(workout);
    }
}

async function timer(startTime) {
    setInterval(function () {
        if (startTime > 0) {
            startTime -= 1;
        } else {
            nextWorkout();
        }
        elements.timer.textContent = startTime;
    }, 1000);
}

async function timer(startTime) {
    // startTime at 1000 == 10 Seconds
    setInterval(function () {
        if (startTime > 0) {
            startTime -= 1;
        } else {
            nextWorkout();
        }
        const seconds = startTime.toString().slice(0, 2);
        const milliseconds = startTime.toString().slice(2, 4);
        elements.timer.textContent = seconds + ':' + milliseconds;
    }, 10);
}

function showWorkouts(currentIndex) {
    console.log(workoutsList);
    console.log(workoutsList[currentIndex]);
    // elements.currentWorkoutText.textContent = workoutsList[currentIndex];
    // if ((currentIndex + 1) > workoutsList.length) {
    //     elements.nextWorkoutText.textContent = 'Finish';
    // } else {
    //     elements.nextWorkoutText.textContent = workoutsList[currentIndex + 1].name;
    // }
}
function showNextWorkout(nextWorkout) {
    elements.nextWorkoutText.textContent = nextWorkout.name;

}

function nextWorkout(startingIndex) {
    const nextIndex = startingIndex + 1;
    return nextIndex;
}

main();