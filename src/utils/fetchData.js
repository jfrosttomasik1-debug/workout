// Free Exercise DB endpoint
const FREE_EXERCISE_DB_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const FREE_EXERCISE_DB_IMAGE_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Cache for exercises data to avoid repeated fetches
let exercisesCache = null;

export const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

export const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Fetch all exercises from Free Exercise DB
export const fetchAllExercises = async () => {
    try {
        // Return cached data if available
        if (exercisesCache) {
            return exercisesCache;
        }

        const response = await fetch(FREE_EXERCISE_DB_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch exercises: ${response.status} ${response.statusText}`);
        }

        const exercises = await response.json();

        // Transform exercises to match expected format
        const transformedExercises = exercises.map(exercise => ({
            ...exercise,
            id: exercise.id,
            name: exercise.name,
            target: exercise.primaryMuscles?.[0] || 'general',
            bodyPart: extractBodyPart(exercise),
            equipment: exercise.equipment || 'bodyweight',
            gifUrl: exercise.images?.[0] ? `${FREE_EXERCISE_DB_IMAGE_BASE}/${exercise.images[0]}` : '',
            images: exercise.images || []
        }));

        // Cache the data
        exercisesCache = transformedExercises;

        return transformedExercises;
    } catch (error) {
        console.error('Error fetching exercises from Free Exercise DB:', error);
        throw error;
    }
}

// Extract body part from exercise data
const extractBodyPart = (exercise) => {
    // Map of primary muscles to body parts
    const muscleToBodyPart = {
        'chest': 'chest',
        'back': 'back',
        'biceps': 'arms',
        'triceps': 'arms',
        'forearms': 'arms',
        'shoulders': 'shoulders',
        'neck': 'neck',
        'traps': 'back',
        'lats': 'back',
        'quads': 'legs',
        'hamstrings': 'legs',
        'glutes': 'glutes',
        'calves': 'legs',
        'abs': 'waist',
        'obliques': 'waist',
        'adductors': 'legs',
        'abductors': 'legs'
    };

    const primaryMuscle = exercise.primaryMuscles?.[0]?.toLowerCase() || '';
    return muscleToBodyPart[primaryMuscle] || 'general';
}

export const youtubeOptions = {
  method: 'GET',
  url: 'https://youtube-search-and-download.p.rapidapi.com/channel/about',
  params: {id: 'UCE_M8A5yxnLfW0KghEeajjw'},
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
  }
}