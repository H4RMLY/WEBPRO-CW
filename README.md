# Web Programming Coursework - High Intensity Training Web App 🏃
# Grade: 1st Class
## Description
This is a HIT workout web application that allows you to create your own workout or choose from a selection of preset sessions.

## Installation
1. CD into WEBPRO-CW if not already.
2. Type 'npm i' into your console to install dependencies.
3. Type 'npm start' into console to run the application.
4. In your browser type localhost:8080 to access the app.

## How to use
When the page has loaded you should be shown the workout builder with two buttons allowing you to show either preset workouts or individual exercises that you can add to your workout. If you are logged into an account this will allow you to save your selected workout and access it as if it is a preset. Once you select at least four individual exercises or one preset then you can click start to change the screen to the workout controller. 

You can navigate through the workout using the arrow buttons and start the timer for each exercise using the play button. You can press the play button again to pause the timer. In order to navigate through the workout the timer must be paused. If needed you can cancel the workout which will clear it and bring you back to the builder. Currently when you finish your workout it will just change the text within the cancel button to make it clear that the workout has ended and that is how you return home. 

## Feature Plans
- Make the ability to remove workouts from the users account.
- Possibly let the user add custom exercises to the button panel if they are logged in.
- Allow users to select colour pallets.
- Find a better way to show exercise instructions in the custom workout button panel as the user has to scroll to the bottom of the page to see.

## Known issues
- Im not sure how to reliably re-create this issue but occasionally when selecting an exercise in the custom button panel it will change to styling to be selected but will not add it to the workout. This is fixed by de-selecting and selecting it again.

## Key features

### Workout Creation
This feature allows you to create a workout comprised of at least four exercises or one preset workout.

This is quite easy to operate, all you need to do is select whether you want to view the individual exercises or the preset workouts then just click on each exercise you would like to add. If you need to deselect anything you can just click on the exercise again or click the clear button under the custom workout which will deselect all exercises.

### Exercise Description
Under the exercise selection buttons there is a box that will show a description of how to perform one repetition of each exercise. On desktop/laptop to see each description you just have to hover your mouse over each button and on mobile/touch screen devices just press and hold each button and the description should appear. 

### Workout Control
This is the second main feature of the app and allows the user to navigate through their created workout out. Also included is a built in timer which tracks seconds and milliseconds that can be started and paused at any time. The Exercise description is still present here and will automatically show how to do the current excercise in the workout. 

### Logins
This is an extra feature that allows the user to switch between preset accounts. When a user logs into an account if they have any saved workouts they will be added to the preset workout button panel in the workout builder and a save button at the top of the screen will appear. 

### Save workout
This is another extra feature that's tied to the account system. When a user logs into an account a save button will appear in the top right of the screen allowing the user to save the current selected workout. If this is clicked before a workout has been created/selected then the text fields will be blank and the save button will be unclickable. Once at least four exercises are in the selected workout and the user named the workout and given is a description it can then be saved to the account and will appear under the preset buttons. This is also available when the user is performing their workout as well.

## AI
Currently the only usage of AI within this project has been to gain ideas for which exercises to implement and to create the descriptions for each.

These are the prompts that helped me determine the excercises and instructions for them for the build your workout feature:

####  Prompt 1: Write a short description of an arm workout for a training app

#### Response:
Title: Sculpted Arms Workout

Description:
Get ready to tone and strengthen your arms with this intense workout designed to target all the major muscle groups in your upper body. This arm-focused routine incorporates a variety of exercises to challenge your biceps, triceps, shoulders, and forearms, leaving you with sculpted, defined arms.

Warm-Up:
Start with a quick warm-up to prepare your muscles for the workout ahead. Perform arm circles, shoulder rolls, and gentle stretches to loosen up.

Main Workout:

    Bicep Curls: Grab a pair of dumbbells and perform 3 sets of 12 reps of bicep curls, focusing on controlled movements and squeezing at the top of each repetition to engage the biceps.

    Tricep Dips: Find a stable surface like a bench or chair and perform 3 sets of 10-12 reps of tricep dips, lowering your body down until your arms form a 90-degree angle and then pushing back up.

    Shoulder Press: Hold dumbbells at shoulder height and press them overhead, extending your arms fully. Complete 3 sets of 10 reps, maintaining proper form and control throughout.

    Hammer Curls: Switch up your grip by performing hammer curls, keeping your palms facing each other throughout the movement. Complete 3 sets of 12 reps to target the brachialis and forearms.

    Lateral Raises: Grab a lighter pair of dumbbells and perform lateral raises to target the deltoid muscles. Complete 3 sets of 12 reps, lifting the weights out to the sides while keeping a slight bend in your elbows.

    Push-Ups: Finish strong with a set of push-ups to target the chest, shoulders, and triceps. Aim for 3 sets of 10-15 reps, maintaining a straight line from head to heels and lowering your chest towards the ground with control.

Cool Down:
Take time to stretch your arms and shoulders to help prevent soreness and promote flexibility. Focus on gentle stretches like tricep stretches, shoulder stretches, and wrist stretches to relax your muscles and improve recovery.

Remember to listen to your body and adjust the weights and reps as needed to suit your fitness level. Consistency is key, so make sure to incorporate this arm workout into your routine regularly to see results and build strength over time.

#### Utilisation:
I didnt end up using the descriptions or extra information from this response as it didnt provide the information I felt I needed however this did identify the excersises I have used in the selection.

####  Prompt 2: Describe a bicep curl to someone who is just starting to work out

#### Response:
Sure! A bicep curl is a fundamental exercise for strengthening the muscles in the front of your upper arms, called the biceps. Here's a simple description of how to do a bicep curl:

    Stand up straight with your feet shoulder-width apart. Hold a dumbbell in each hand, palms facing forward. Your arms should be fully extended down by your sides, with the dumbbells hanging at arm's length.

    Keep your upper arms stationary and exhale as you slowly curl the dumbbells towards your shoulders, bending your elbows. Focus on keeping your elbows close to your body throughout the movement.

    As you curl the weights upward, contract your biceps and squeeze them at the top of the movement. Your palms should naturally turn slightly upward as you lift the weights.

    Inhale as you lower the dumbbells back down to the starting position in a controlled manner, resisting the urge to let them drop. Keep your wrists straight throughout the exercise.

    Repeat for the desired number of repetitions, aiming for around 8 to 12 reps to start with.

Remember to start with a lighter weight to get the form right and gradually increase the weight as you get stronger. It's important to perform the exercise with proper technique to prevent injury and effectively target the bicep muscles. If you're unsure about your form, consider seeking guidance from a fitness professional.

#### Utilisation: 
This provided me with the instructions in how to do the excersise which is used in the instructions box however I only used the first four steps and none of the extra information as i felt it was unnecessary.

#### Prompt 3: Describe a tricep dip to someone who has just started working out

#### Response:
Of course! Tricep dips are a great exercise for targeting the muscles on the back of your upper arms, known as the triceps. Here's a simple description of how to do a tricep dip:

    Find a stable surface to perform the exercise on, such as a bench, chair, or even the edge of a sturdy table. Sit on the edge of the surface with your hands placed next to your hips, fingers gripping the edge, and your palms facing downwards. Your knees should be bent and feet flat on the floor, hip-width apart.

    Slide your bottom off the edge of the surface, supporting your body weight with your arms. Walk your feet forward slightly, so your knees are bent at about a 90-degree angle. Your arms should be straight, but your elbows shouldn't be locked.

    Inhale as you slowly lower your body by bending your elbows, keeping them close to your body and pointing straight back. Lower yourself until your elbows are bent to about 90 degrees, or until you feel a stretch in your triceps.

    Exhale as you push through your palms and straighten your arms to lift your body back up to the starting position, fully extending your elbows without locking them.

    Repeat for the desired number of repetitions, aiming for around 8 to 12 reps to start with.

Remember to keep your shoulders down and back throughout the movement, and avoid shrugging or letting them hunch up towards your ears. Also, focus on engaging your core muscles to help stabilize your body throughout the exercise. If you find this version too challenging, you can modify by keeping your knees bent at a lesser angle or performing the exercise on a higher surface. As you get stronger, you can gradually increase the challenge by lowering yourself further or straightening your legs for a more advanced version.

#### Utilisation:
Like the last response I used this for the instructions for the tricep dip excersise. Again I only used the first four steps and none of the extra description as I felt it wasnt relevant.
