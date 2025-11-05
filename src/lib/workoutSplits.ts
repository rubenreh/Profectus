export type WorkoutSplit = {
  id: string;
  name: string;
  days: {
    name: string;
    exercises: string[];
  }[];
};

export const WORKOUT_SPLITS: WorkoutSplit[] = [
  {
    id: "ppl",
    name: "Push/Pull/Legs (PPL)",
    days: [
      {
        name: "Push Day",
        exercises: [
          "Barbell Bench Press",
          "Overhead Press",
          "Incline Dumbbell Press",
          "Lateral Raises",
          "Tricep Pushdowns",
          "Overhead Tricep Extension",
          "Cable Flyes",
        ],
      },
      {
        name: "Pull Day",
        exercises: [
          "Deadlifts",
          "Barbell Rows",
          "Pull-ups / Lat Pulldowns",
          "Cable Rows",
          "Face Pulls",
          "Barbell Curls",
          "Hammer Curls",
        ],
      },
      {
        name: "Leg Day",
        exercises: [
          "Squats",
          "Romanian Deadlifts",
          "Leg Press",
          "Leg Curls",
          "Leg Extensions",
          "Calf Raises",
          "Hip Thrusts",
        ],
      },
    ],
  },
  {
    id: "arnold",
    name: "Arnold Split",
    days: [
      {
        name: "Chest & Back",
        exercises: [
          "Barbell Bench Press",
          "Incline Dumbbell Press",
          "Barbell Rows",
          "T-Bar Rows",
          "Cable Flyes",
          "Pull-ups",
        ],
      },
      {
        name: "Shoulders & Arms",
        exercises: [
          "Overhead Press",
          "Lateral Raises",
          "Rear Delt Flyes",
          "Barbell Curls",
          "Tricep Pushdowns",
          "Hammer Curls",
          "Overhead Tricep Extension",
        ],
      },
      {
        name: "Legs",
        exercises: [
          "Squats",
          "Leg Press",
          "Romanian Deadlifts",
          "Leg Curls",
          "Leg Extensions",
          "Calf Raises",
        ],
      },
    ],
  },
  {
    id: "chest-back-arms-legs",
    name: "Chest / Back / Arms / Legs",
    days: [
      {
        name: "Chest Day",
        exercises: [
          "Barbell Bench Press",
          "Incline Dumbbell Press",
          "Dumbbell Flyes",
          "Cable Flyes",
          "Push-ups",
          "Dips",
        ],
      },
      {
        name: "Back Day",
        exercises: [
          "Deadlifts",
          "Barbell Rows",
          "Pull-ups",
          "T-Bar Rows",
          "Cable Rows",
          "Face Pulls",
        ],
      },
      {
        name: "Arms Day",
        exercises: [
          "Barbell Curls",
          "Hammer Curls",
          "Tricep Pushdowns",
          "Overhead Tricep Extension",
          "Cable Curls",
          "Skull Crushers",
        ],
      },
      {
        name: "Legs Day",
        exercises: [
          "Squats",
          "Leg Press",
          "Romanian Deadlifts",
          "Leg Curls",
          "Leg Extensions",
          "Calf Raises",
          "Hip Thrusts",
        ],
      },
      {
        name: "Rest Day",
        exercises: [],
      },
    ],
  },
  {
    id: "upper-lower",
    name: "Upper / Lower",
    days: [
      {
        name: "Upper Body",
        exercises: [
          "Barbell Bench Press",
          "Overhead Press",
          "Barbell Rows",
          "Pull-ups",
          "Barbell Curls",
          "Tricep Pushdowns",
          "Lateral Raises",
        ],
      },
      {
        name: "Lower Body",
        exercises: [
          "Squats",
          "Romanian Deadlifts",
          "Leg Press",
          "Leg Curls",
          "Leg Extensions",
          "Calf Raises",
        ],
      },
    ],
  },
  {
    id: "bro-split",
    name: "Bro Split",
    days: [
      {
        name: "Chest",
        exercises: [
          "Barbell Bench Press",
          "Incline Dumbbell Press",
          "Dumbbell Flyes",
          "Cable Flyes",
          "Dips",
        ],
      },
      {
        name: "Back",
        exercises: [
          "Deadlifts",
          "Barbell Rows",
          "Pull-ups",
          "T-Bar Rows",
          "Cable Rows",
        ],
      },
      {
        name: "Shoulders",
        exercises: [
          "Overhead Press",
          "Lateral Raises",
          "Rear Delt Flyes",
          "Front Raises",
          "Shrugs",
        ],
      },
      {
        name: "Arms",
        exercises: [
          "Barbell Curls",
          "Hammer Curls",
          "Tricep Pushdowns",
          "Overhead Tricep Extension",
          "Cable Curls",
        ],
      },
      {
        name: "Legs",
        exercises: [
          "Squats",
          "Leg Press",
          "Romanian Deadlifts",
          "Leg Curls",
          "Leg Extensions",
          "Calf Raises",
        ],
      },
      {
        name: "Rest",
        exercises: [],
      },
    ],
  },
];

