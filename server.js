import express from 'express';

const webRoot = 'webpages';
const app = express();
app.use(express.static(webRoot));



const workoutInstructions = [{
    id : "bicep-curl",
    name: "Bicep Curl",
    content : "Stand up straight with your feet shoulder-width apart. Hold a dumbbell in each hand, palms facing forward. Your arms should be fully extended down by your sides, with the dumbbells hanging at arm's length. Keep your upper arms stationary and exhale as you slowly curl the dumbbells towards your shoulders, bending your elbows. Focus on keeping your elbows close to your body throughout the movement. As you curl the weights upward, contract your biceps and squeeze them at the top of the movement. Your palms should naturally turn slightly upward as you lift the weights. Inhale as you lower the dumbbells back down to the starting position in a controlled manner."
},
{
    id : "tricep-dip",
    name : "Tricep Dip",
    content : "Find a stable surface to perform the exercise on, such as a bench, chair, or even the edge of a sturdy table. Sit on the edge of the surface with your hands placed next to your hips, fingers gripping the edge, and your palms facing downwards. Your knees should be bent and feet flat on the floor, hip-width apart. Slide your bottom off the edge of the surface, supporting your body weight with your arms. Walk your feet forward slightly, so your knees are bent at about a 90-degree angle. Your arms should be straight, but your elbows shouldn't be locked. Inhale as you slowly lower your body by bending your elbows, keeping them close to your body and pointing straight back. Lower yourself until your elbows are bent to about 90 degrees, or until you feel a stretch in your triceps. Exhale as you push through your palms and straighten your arms to lift your body back up to the starting position, fully extending your elbows without locking them."
},
{
    id : "push-up",
    name : "Push Up",
    content : "Start by lying face down on the floor.Place your hands flat on the ground, slightly wider than shoulder-width apart, with your fingers pointing forward. Push yourself up off the ground using your arms, while keeping your body straight from your head to your heels. Lower yourself back down until your chest nearly touches the ground. Push yourself back up to the starting position."
},
]

function getInstructions(req, res) {
    res.json(workoutInstructions);
}
  
app.get('/instructions', getInstructions);
  

app.listen(8080);