import express from 'express';
import { promises as fs } from 'fs';

const webRoot = './';
const app = express();
app.use(express.static(webRoot));

let workouts;
let accounts;

await readWorkouts()
await readAccounts()

async function readWorkouts(){
    await fs.readFile("./external-content/workouts.json")
    .then(function (data) {
        workouts = JSON.parse(data);
    })
}

async function readAccounts(){
    await fs.readFile("./external-content/accounts.json")
    .then(function (data) {
        accounts = JSON.parse(data);
    });  
}

async function writeWorkouts(){
    const json = JSON.stringify(accounts)
    await fs.writeFile("./external-content/workouts.json", json);
}

async function writeAccounts(){
    const json = JSON.stringify(accounts)
    await fs.writeFile("./external-content/accounts.json", json);
}

let selectedWorkouts = [];

function assignIndexes(){
    for (const exercise of selectedWorkouts){
        exercise.index = selectedWorkouts.indexOf(exercise);
    }
}

function postSelectedWorkout(req, res) {
    const newWorkout = {
        name: req.body.name,
        time: req.body.time,
        index: req.body.index,
    };
    selectedWorkouts.push(newWorkout);
    assignIndexes();
    res.json(selectedWorkouts);
}

function getInstructions(req, res) {
    res.json(workouts.exercises);
}

function getInstruction(req, res) {
    for (const exercise of workouts.exercises) {
        if (exercise.name === req.params.name) {
            res.json(exercise);
        }
    }
}

function removeExercise(req, res) {
    for (const exercise of selectedWorkouts) {
        if (req.params.exercise === exercise.name) {
            let index = selectedWorkouts.indexOf(exercise);
            selectedWorkouts.splice(index, 1);
        }
    }
    res.json(selectedWorkouts);
}

function clearWorkout(req, res){
    selectedWorkouts = [];
    res.json(selectedWorkouts);
}

function getPresets(req, res){
    res.json(workouts.presets);
}

function getWorkout(req, res){
    res.json(selectedWorkouts);
}

function populateWorkoutWithPreset(req, res){
    for (const preset of workouts.presets) {
        if (preset.id === req.params.id) {
            res.json(preset.includes);
        }
    }
}

function getAccounts(req, res) {
    res.json(accounts.users);
}

function getSavedExercises(req, res) {
    for (const user of accounts.users) {
        if (user.username === req.params.user){
            res.json(user.savedWorkouts);
        }
    }
}

function addSaved(req, res) {
    for (const user of accounts.users){
        if(user.username === req.body.user){
            for (const workout of user.savedWorkouts){
                if (workout.name === req.body.name){
                    res.json(workout.includes);
                }
            }
        }
    }
}

async function saveWorkout(req, res){
    const newWorkout = {
        name : req.body.name,
        description : req.body.description,
        includes : req.body.includes
    }

    for (const user of accounts.users){
        if(user.username === req.body.user){
            user.savedWorkouts.push(newWorkout);
            await writeAccounts();
            await readAccounts();
            res.json(user.savedWorkouts);
        }
    }
}

async function clearSavedWorkouts(req, res){
    for (const user of accounts.users){
        if(user.username === req.params.user){
            user.savedWorkouts = [];
            await writeAccounts();
            await readAccounts();
            res.json("Workouts Cleared");
        }
    }
}

async function createUser(req, res){
    const newUser = {
        username: req.body.user,
        name: req.body.name,
        savedWorkouts: []
    };
    accounts.users.push(newUser);
    await writeAccounts();
    await readAccounts();
    res.json(newUser);
}

app.post('/selectedExercise', express.json(), postSelectedWorkout);
app.post('/addSaved', express.json(), addSaved);
app.post('/saveWorkout', express.json(), saveWorkout);
app.post('/createUser', express.json(), createUser);

app.get('/clearSaved/:user', clearSavedWorkouts);
app.get('/addPreset/:id', populateWorkoutWithPreset);
app.get('/getWorkout', getWorkout);
app.get('/instructions', getInstructions);
app.get('/presets', getPresets);
app.get('/remove/:exercise', removeExercise);
app.get('/instructions/:name', getInstruction);
app.get('/clear', clearWorkout);
app.get('/accounts', getAccounts);
app.get('/savedExercises/:user', getSavedExercises);

app.listen(8080);