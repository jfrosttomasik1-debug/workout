// Free Exercise DB endpoint
const FREE_EXERCISE_DB_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const FREE_EXERCISE_DB_IMAGE_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// localStorage cache keys and TTL (24 hours)
const CACHE_KEY = 'exercises_cache_data';
const CACHE_TIMESTAMP_KEY = 'exercises_cache_timestamp';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Read from localStorage cache if not expired
const readCache = () => {
    try {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (!timestamp) return null;
        if (Date.now() - Number(timestamp) > CACHE_TTL_MS) return null;
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

// Write to localStorage cache
const writeCache = (data) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
    } catch (e) {
        console.warn('Failed to write exercise cache to localStorage:', e);
    }
};

// Clear the exercise cache (exported for external use)
export const clearExerciseCache = () => {
    try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch {
        // ignore
    }
};

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
        // Return cached data if available and not expired
        const cached = readCache();
        if (cached) {
            return cached;
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

        // Cache the data in localStorage
        writeCache(transformedExercises);

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