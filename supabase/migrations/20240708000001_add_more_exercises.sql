-- Add more exercises to the exercises table
INSERT INTO exercises (name, muscle_group, category, equipment, difficulty, instructions)
VALUES
-- Chest
('Bench Press', 'Chest', 'Strength', 'Barbell', 'Intermediate', 'Lie on a flat bench with feet on the ground. Grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press back up to starting position.'),
('Incline Bench Press', 'Chest', 'Strength', 'Barbell', 'Intermediate', 'Lie on an incline bench set to 30-45 degrees. Grip the barbell slightly wider than shoulder-width. Lower the bar to your upper chest, then press back up.'),
('Decline Bench Press', 'Chest', 'Strength', 'Barbell', 'Intermediate', 'Lie on a decline bench with feet secured. Grip the barbell slightly wider than shoulder-width. Lower the bar to your lower chest, then press back up.'),
('Dumbbell Fly', 'Chest', 'Strength', 'Dumbbells', 'Beginner', 'Lie on a flat bench holding dumbbells above your chest with palms facing each other. Lower the weights out to the sides in an arc motion, then bring them back together.'),
('Push-Up', 'Chest', 'Bodyweight', 'None', 'Beginner', 'Start in a plank position with hands slightly wider than shoulder-width. Lower your body until your chest nearly touches the floor, then push back up.'),
('Cable Crossover', 'Chest', 'Strength', 'Cable Machine', 'Intermediate', 'Stand between two cable stations with handles attached at shoulder height. Grab handles and step forward. With a slight bend in elbows, bring handles together in front of you.'),

-- Back
('Pull-Up', 'Back', 'Bodyweight', 'Pull-up Bar', 'Intermediate', 'Hang from a pull-up bar with palms facing away from you. Pull your body up until your chin is over the bar, then lower back down with control.'),
('Chin-Up', 'Back', 'Bodyweight', 'Pull-up Bar', 'Intermediate', 'Hang from a pull-up bar with palms facing toward you. Pull your body up until your chin is over the bar, then lower back down with control.'),
('Bent-Over Row', 'Back', 'Strength', 'Barbell', 'Intermediate', 'Bend at the hips with a slight knee bend, holding a barbell with hands shoulder-width apart. Pull the bar to your lower chest, then lower it back down.'),
('Seated Cable Row', 'Back', 'Strength', 'Cable Machine', 'Beginner', 'Sit at a cable row station with feet on the platform and knees slightly bent. Pull the handle to your lower chest, then extend arms back out.'),
('Lat Pulldown', 'Back', 'Strength', 'Cable Machine', 'Beginner', 'Sit at a lat pulldown machine with thighs secured. Grab the bar with a wide grip and pull it down to your upper chest, then slowly release back up.'),
('Deadlift', 'Back', 'Strength', 'Barbell', 'Advanced', 'Stand with feet hip-width apart, barbell over midfoot. Bend at hips and knees to grip the bar, then stand up by driving through heels and extending hips and knees.'),

-- Shoulders
('Overhead Press', 'Shoulders', 'Strength', 'Barbell', 'Intermediate', 'Stand with feet shoulder-width apart, holding a barbell at shoulder height. Press the bar overhead until arms are fully extended, then lower back to shoulders.'),
('Lateral Raise', 'Shoulders', 'Strength', 'Dumbbells', 'Beginner', 'Stand with dumbbells at your sides. Raise arms out to the sides until they are parallel to the floor, then lower back down with control.'),
('Front Raise', 'Shoulders', 'Strength', 'Dumbbells', 'Beginner', 'Stand holding dumbbells in front of thighs. Raise one arm straight in front to shoulder height, then lower and repeat with the other arm.'),
('Reverse Fly', 'Shoulders', 'Strength', 'Dumbbells', 'Beginner', 'Bend at the hips with a slight knee bend, holding dumbbells. Raise arms out to the sides, squeezing shoulder blades together, then lower back down.'),
('Face Pull', 'Shoulders', 'Strength', 'Cable Machine', 'Intermediate', 'Stand facing a cable machine with rope attachment at head height. Pull the rope toward your face, separating the ends as you pull, then return to start.'),
('Shrug', 'Shoulders', 'Strength', 'Dumbbells', 'Beginner', 'Stand holding dumbbells at your sides. Lift your shoulders up toward your ears, hold briefly, then lower back down.'),

-- Arms (Biceps)
('Bicep Curl', 'Biceps', 'Strength', 'Dumbbells', 'Beginner', 'Stand holding dumbbells at your sides with palms facing forward. Curl the weights up to your shoulders, then lower back down.'),
('Hammer Curl', 'Biceps', 'Strength', 'Dumbbells', 'Beginner', 'Stand holding dumbbells at your sides with palms facing your body. Curl the weights up to your shoulders, then lower back down.'),
('Preacher Curl', 'Biceps', 'Strength', 'Barbell', 'Intermediate', 'Sit at a preacher bench with arms extended over the pad. Curl the barbell up toward your shoulders, then lower back down with control.'),
('Concentration Curl', 'Biceps', 'Strength', 'Dumbbell', 'Beginner', 'Sit on a bench with legs spread, holding a dumbbell in one hand. Rest your elbow against your inner thigh and curl the weight up, then lower back down.'),
('Cable Curl', 'Biceps', 'Strength', 'Cable Machine', 'Beginner', 'Stand facing a cable machine with a straight bar attachment at the lowest setting. Curl the bar up toward your shoulders, then lower back down.'),

-- Arms (Triceps)
('Tricep Pushdown', 'Triceps', 'Strength', 'Cable Machine', 'Beginner', 'Stand facing a cable machine with a straight bar or rope attachment at the highest setting. Push the bar down until arms are fully extended, then return to start.'),
('Tricep Dip', 'Triceps', 'Bodyweight', 'Dip Bars', 'Intermediate', 'Support yourself on parallel bars with arms extended. Lower your body by bending your elbows until upper arms are parallel to the floor, then push back up.'),
('Skull Crusher', 'Triceps', 'Strength', 'Barbell', 'Intermediate', 'Lie on a bench holding a barbell with arms extended above your chest. Bend elbows to lower the bar toward your forehead, then extend arms back up.'),
('Overhead Tricep Extension', 'Triceps', 'Strength', 'Dumbbell', 'Beginner', 'Stand or sit holding a dumbbell with both hands above your head. Lower the weight behind your head by bending elbows, then extend arms back up.'),
('Close-Grip Bench Press', 'Triceps', 'Strength', 'Barbell', 'Intermediate', 'Lie on a bench with hands on the barbell shoulder-width apart or closer. Lower the bar to your chest, then press back up.'),

-- Legs (Quadriceps)
('Squat', 'Quadriceps', 'Strength', 'Barbell', 'Intermediate', 'Stand with feet shoulder-width apart, barbell across upper back. Bend knees and hips to lower your body until thighs are parallel to the floor, then stand back up.'),
('Leg Press', 'Quadriceps', 'Strength', 'Machine', 'Beginner', 'Sit in a leg press machine with feet on the platform shoulder-width apart. Push the platform away by extending your knees, then lower back with control.'),
('Leg Extension', 'Quadriceps', 'Strength', 'Machine', 'Beginner', 'Sit in a leg extension machine with ankles against the pad. Extend your knees to lift the weight, then lower back down with control.'),
('Front Squat', 'Quadriceps', 'Strength', 'Barbell', 'Advanced', 'Stand with feet shoulder-width apart, barbell across front of shoulders. Bend knees and hips to lower your body, then stand back up.'),
('Lunge', 'Quadriceps', 'Strength', 'Dumbbells', 'Beginner', 'Stand with feet together, holding dumbbells at your sides. Step forward with one leg and lower your body until both knees are bent at 90 degrees, then push back to start.'),

-- Legs (Hamstrings)
('Romanian Deadlift', 'Hamstrings', 'Strength', 'Barbell', 'Intermediate', 'Stand holding a barbell in front of your thighs. Hinge at the hips to lower the bar along your legs while keeping them nearly straight, then return to standing.'),
('Leg Curl', 'Hamstrings', 'Strength', 'Machine', 'Beginner', 'Lie face down on a leg curl machine with ankles under the pad. Curl your legs up by bending your knees, then lower back down with control.'),
('Good Morning', 'Hamstrings', 'Strength', 'Barbell', 'Intermediate', 'Stand with feet shoulder-width apart, barbell across upper back. Bend at the hips to lower your torso until nearly parallel to the floor, then stand back up.'),
('Glute-Ham Raise', 'Hamstrings', 'Strength', 'Machine', 'Advanced', 'Position yourself in a glute-ham developer with feet secured. Lower your torso toward the floor by bending at the hips, then raise back up using your hamstrings.'),

-- Legs (Calves)
('Standing Calf Raise', 'Calves', 'Strength', 'Machine', 'Beginner', 'Stand on a calf raise machine with shoulders under the pads. Raise your heels as high as possible, then lower them below the level of the platform.'),
('Seated Calf Raise', 'Calves', 'Strength', 'Machine', 'Beginner', 'Sit at a seated calf raise machine with knees bent at 90 degrees. Raise your heels as high as possible, then lower them below the level of the platform.'),

-- Core
('Crunch', 'Core', 'Bodyweight', 'None', 'Beginner', 'Lie on your back with knees bent and feet flat on the floor. Place hands behind your head and lift your shoulders off the floor, then lower back down.'),
('Plank', 'Core', 'Bodyweight', 'None', 'Beginner', 'Start in a push-up position, then lower onto your forearms. Hold your body in a straight line from head to heels.'),
('Russian Twist', 'Core', 'Bodyweight', 'None', 'Beginner', 'Sit on the floor with knees bent and feet elevated. Lean back slightly and twist your torso to the right, then to the left.'),
('Leg Raise', 'Core', 'Bodyweight', 'None', 'Intermediate', 'Lie on your back with legs extended and hands at your sides or under your lower back. Raise your legs to a 90-degree angle, then lower them back down without touching the floor.'),
('Mountain Climber', 'Core', 'Bodyweight', 'None', 'Beginner', 'Start in a push-up position. Bring one knee toward your chest, then quickly switch legs in a running motion.'),
('Ab Wheel Rollout', 'Core', 'Strength', 'Ab Wheel', 'Advanced', 'Kneel on the floor holding an ab wheel in front of you. Roll the wheel forward, extending your body as far as possible, then use your abs to roll back to the starting position.');