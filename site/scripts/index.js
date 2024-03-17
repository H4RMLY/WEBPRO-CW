const elements = {};

function main(){
    console.log('page loaded');
}

function dayCompleted() {
    
}

function currentDay() {
    let now = new Date();
    let today = now.getDay();

    let days = document.querySelector('daysExercised').children;
    let currentDay = days[today];
    currentDay.className = 'today';
}

function handles(){
    elements.today = document.querySelector('#today');
}
main();