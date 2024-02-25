const elements = {};

function main(){
    handles();
    armInstructionEvents();
    addClickEvents();
}

function handles(){
    elements.armWorkouts = document.querySelectorAll('.arms');
    elements.legWorkouts = document.querySelectorAll('.legs');
    elements.chestWorkouts = document.querySelectorAll('.chest');
    elements.enduranceWorkouts = document.querySelectorAll('.endurance');
    elements.instructionText = document.querySelector('#instruction-text');
    elements.instructionTitle = document.querySelector('#instruction-header');
}

function armInstructionEvents(){
    for (let workout of elements.armWorkouts){
        workout.addEventListener('mouseover', fetchInstructions);
    }
}

async function fetchInstructions(e){
    const response = await fetch('instructions');
    let instructionContent;
    if (response.ok){
        instructionContent = await response.json();
    } else {
        console.log('Error fetching content');
    }

    for (let instruction of instructionContent){
        if (instruction.id == e.target.id){
            elements.instructionTitle.textContent = instruction.name;
            elements.instructionText.textContent = instruction.content;
        }
    }
}

function addClickEvents(){
    let allExercises = [];
    allExercises.push(elements.armWorkouts, elements.legWorkouts, elements.chestWorkouts, elements.enduranceWorkouts);
    for (let workout of allExercises){
            console.log(workout)
            for (let exercise of workout){
                console.log(exercise.id)
                exercise.addEventListener('click', addToWorkout);    
            }    
        }
    }

function addToWorkout(e){
        e.target.classList.toggle("selected");
}
main();