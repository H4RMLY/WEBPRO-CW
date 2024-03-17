import express from 'express';

const webRoot = 'site';
const app = express();
app.use(express.static(webRoot));

const workoutInstructions = [
    {
        id: "tricep-dips",
        name: "Tricep Dips",
        content: "Find a stable surface to perform the exercise on, such as a bench, chair, or even the edge of a sturdy table. Sit on the edge of the surface with your hands placed next to your hips, fingers gripping the edge, and your palms facing downwards. Your knees should be bent and feet flat on the floor, hip-width apart. Slide your bottom off the edge of the surface, supporting your body weight with your arms. Walk your feet forward slightly, so your knees are bent at about a 90-degree angle. Your arms should be straight, but your elbows shouldn't be locked. Inhale as you slowly lower your body by bending your elbows, keeping them close to your body and pointing straight back. Lower yourself until your elbows are bent to about 90 degrees, or until you feel a stretch in your triceps. Exhale as you push through your palms and straighten your arms to lift your body back up to the starting position, fully extending your elbows without locking them."
    },
    {
        id: "bicep-curl",
        name: "Bicep Curls",
        content: "Stand up straight with your feet shoulder-width apart. Hold a dumbbell in each hand, palms facing forward. Your arms should be fully extended down by your sides, with the dumbbells hanging at arm's length. Keep your upper arms stationary and exhale as you slowly curl the dumbbells towards your shoulders, bending your elbows. Focus on keeping your elbows close to your body throughout the movement. As you curl the weights upward, contract your biceps and squeeze them at the top of the movement. Your palms should naturally turn slightly upward as you lift the weights. Inhale as you lower the dumbbells back down to the starting position in a controlled manner."
    },
    {
        id: "push-ups",
        name: "Push Ups",
        content: "Start by lying face down on the floor.Place your hands flat on the ground, slightly wider than shoulder-width apart, with your fingers pointing forward. Push yourself up off the ground using your arms, while keeping your body straight from your head to your heels. Lower yourself back down until your chest nearly touches the ground. Push yourself back up to the starting position."
    },
    {
        id: "squats",
        name: "Squats",
        content: "Stand with your feet about shoulder-width apart. Keep your feet flat on the ground. Stretch your arms straight out in front of you for balance, or you can place your hands on your hips. Begin to lower your body by bending your knees. Imagine sitting back into an imaginary chair. Keep your back straight and chest up as you lower yourself down. Make sure your knees are in line with your toes and don't go past your toes. Lower yourself down until your thighs are about parallel to the ground, or as far down as you can comfortably go. Pause for a moment at the bottom of the squat. Push through your heels to slowly rise back up to the starting position, straightening your legs as you go."
    },
    {
        id: "lunges",
        name: "Lunges",
        content: "Stand up straight with your feet together and your arms relaxed at your sides. Take a step forward with one foot. Your front foot should be flat on the ground, and your knee should be directly above your ankle. Lower your body straight down by bending both knees. Your back knee should bend and almost touch the ground, but don't let it touch. Keep your torso upright and your chest lifted throughout the movement. Your front thigh should be parallel to the ground, or as close as you can comfortably go. Push through your front heel to return to the starting position. Bring your back foot forward to meet your front foot. Repeat the movement on the opposite side by stepping forward with the other foot"
    },
    {
        id: "step-ups",
        name: "Step Ups",
        content: "Find a sturdy platform or step that's about knee height or slightly lower. Stand in front of the step with your feet about hip-width apart. Place one foot flat on the step, making sure your entire foot is supported. Press through your heel and lift your body up onto the step, using the strength of your leg. Straighten your body as you step up, making sure to keep your back straight and your chest lifted. Bring your other foot up onto the step so that both feet are now on the step. Pause briefly once you're fully on the step, making sure you're balanced and stable. Step back down with the same foot you stepped up with, lowering yourself back to the starting position. Repeat the movement, alternating the foot you use to step up each time."
    },
    {
        id: "floor-press",
        name: "Floor Presses",
        content: "Lie down on your back on the floor or a mat. Bend your knees and place your feet flat on the ground. Hold a weight in each hand, with your palms facing away from you. Your arms should be extended straight up toward the ceiling. Lower the weights slowly until your upper arms touch the floor. Your elbows should be at about a 90-degree angle. Pause for a moment, then press the weights back up to the starting position by straightening your arms."
    },
    {
        id: "chest-dips",
        name: "Chest Dips",
        content: "Find a set of parallel bars or dip bars that are sturdy and at a height that allows you to comfortably grip them while standing. Stand between the bars and grip each bar firmly with your hands, palms facing inward. Jump or step up slightly to lift yourself off the ground, supporting your body weight with your arms. Keep your elbows slightly bent and your shoulders down and back to engage your chest and triceps. Lower your body down by bending your elbows, while keeping your chest up and your torso upright. Lower yourself until your upper arms are about parallel to the ground or as far as is comfortable for you. Pause for a moment at the bottom of the movement, then push through your palms to straighten your arms and lift your body back up to the starting position. Exhale as you push yourself up, keeping your core engaged to help stabilize your body."
    },
    {
        id: "lat-raises",
        name: "Lat Raises",
        content: "Stand up straight with your feet shoulder-width apart and your arms relaxed at your sides. Hold a dumbbell in each hand, with your palms facing your thighs. You can start with light weights if you're a beginner. Keep your back straight and your core engaged throughout the exercise to maintain stability. With a slight bend in your elbows, lift both arms out to the sides until they are parallel to the ground. Imagine you are making a T shape with your body. Keep your elbows slightly bent throughout the movement to avoid putting strain on your joints. Focus on using your shoulder muscles to lift the weights, rather than using momentum or swinging your arms. Hold the raised position for a brief moment to feel the contraction in your shoulders. Slowly lower the weights back down to your sides in a controlled manner, resisting gravity as you go."
    },
    {
        id: "star-jumps",
        name: "Star Jumps",
        content: "Start by standing up straight with your feet together and your arms relaxed at your sides. Jump up slightly while simultaneously spreading your legs apart to about shoulder-width distance. At the same time, raise your arms out to the sides and above your head until your hands almost touch. Your body should form the shape of an 'X' at the top of the jump, with your legs wide and your arms stretched out. Quickly reverse the movement by jumping back to the starting position. Bring your feet back together and lower your arms back down to your sides."
    },
    {
        id: "high-knees",
        name: "High Knees",
        content: "Stand up straight with your feet about hip-width apart and your arms relaxed at your sides. Lift one knee up towards your chest as high as you can, while also raising the opposite arm up towards the sky. As you lower that leg back down, quickly switch and lift the other knee towards your chest while raising the opposite arm. Continue alternating legs, moving as quickly as you can while maintaining balance and control. Engage your core muscles to help lift your knees and maintain stability. Aim to bring your knees up to at least hip level with each lift. Keep your upper body tall and your shoulders relaxed throughout the exercise."
    },
    {
        id: "burpees",
        name: "Burpees",
        content: "Start by standing with your feet shoulder-width apart and your arms at your sides. Lower your body into a squat position by bending your knees and placing your hands on the ground in front of you. Your hands should be shoulder-width apart. Kick your feet back so that you're in a push-up position. Your body should form a straight line from your head to your heels. Lower your chest to the ground by bending your elbows. Keep your core engaged and your back flat. Push yourself back up into the push-up position. Jump your feet back towards your hands so you're back in the squat position. From the squat position, explode upwards into a jump, reaching your arms overhead. Land softly on your feet and immediately lower back down into the next repetition."
    },];

let selectedWorkouts = [];

let daysExercised = [];

function getDaysExercised(req, res) {
    res.json(daysExercised)
}

function addDay(req, res) {
    const day = req.body;
    daysExercised.push(day);
    res.json(daysExercised);
}

function postSelectedWorkout(req, res) {
    const newWorkout = {
        name: req.body.name,
    };
    selectedWorkouts.push(newWorkout);
    res.json(selectedWorkouts);
}

function getInstructions(req, res) {
    res.json(workoutInstructions);
}

function clearWorkouts(req, res) {
    selectedWorkouts = [];
    res.json('cleared');
}

async function getInstruction(req, res) {
    for (const instruction of workoutInstructions) {
        if (instruction.id === req.params.id) {
            res.json(instruction);
            return
        }
    }
}

async function removeWorkout(req, res) {
    for (const workout of selectedWorkouts) {
        if (req.params.workout === workout.name) {
            let index = selectedWorkouts.indexOf(workout);
            selectedWorkouts.splice(index, 1);
        }
    }
    res.json(selectedWorkouts);
}

function getSelectedWorkouts(req, res) {
    res.json(selectedWorkouts);
}

app.get('/clear', clearWorkouts);
app.post('/selectedWorkouts', express.json(), postSelectedWorkout);
app.get('/instructions', getInstructions);
app.get('/remove/:workout', removeWorkout);
app.get('/instructions/:id', getInstruction);
app.get('/daysExersised', getDaysExercised);
app.post('/addDay', express.json(), addDay);
app.get('/getSelectedWorkouts', getSelectedWorkouts);


app.listen(8080);