const elements = {};

function main() {
    handles();
    getWorkouts();
    buttonEvents();
}

function handles() {
    elements.currentExerciseText = document.querySelector('.current-workout');
    elements.nextExerciseText = document.querySelector('.next-workout-text');
    elements.timer = document.querySelector('.timer');
    elements.startButton = document.querySelector('.start');
    elements.pauseButton = document.querySelector('.pause');
    elements.backButton = document.querySelector('.previous');
    elements.nextButton = document.querySelector('.next');
}

async function getWorkouts() {
    const response = await fetch('getSelectedWorkouts');
    if (response.ok) {
        retreivedWorkouts = await response.json();
    }
    let workoutList = [];
    for (let workout of retreivedWorkouts) {
        workoutList.push(workout.name);
    }
    showExercises(workoutList, 0);
}

async function getExercise(index) {
    const response = await fetch('getExercise/'+ index);
    let retreivedExercise;
    if (response.ok) {
        retreivedExercise = await response.json();
        return retreivedExercise;
    }

}

async function timer(startTime) {
    // startTime at 100 == 1 Second
    setInterval(function () {
        if (startTime > 0) {
            startTime -= 1;
        } else {
            console.log('end')
        }
        const seconds = startTime.toString().slice(0, 2);
        const milliseconds = startTime.toString().slice(2, 4);
        elements.timer.textContent = seconds + ':' + milliseconds;
    }, 10);
}

function showExercises(workoutList, startIndex) {
    elements.currentExerciseText.textContent = workoutList[startIndex];
    elements.nextExerciseText.textContent = workoutList[startIndex+1];
}

function buttonEvents(){
    elements.startButton.addEventListener('click', startTimer);
}

async function startTimer(){
    let exercise = elements.currentExerciseText.textContent;
    const response = await fetch('exerciseTime/'+ exercise);
    if (response.ok){
        let startTime = response.json();
        timer(startTime);
    }
}

main();