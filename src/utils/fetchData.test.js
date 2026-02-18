import { fetchAllExercises, clearExerciseCache } from './fetchData';

const CACHE_KEY = 'exercises_cache_data';
const CACHE_TIMESTAMP_KEY = 'exercises_cache_timestamp';

const mockExercises = [
  {
    id: 'ex1',
    name: 'Push Up',
    primaryMuscles: ['chest'],
    equipment: 'body only',
    images: ['pushup/0.jpg'],
  },
  {
    id: 'ex2',
    name: 'Squat',
    primaryMuscles: ['quads'],
    equipment: 'barbell',
    images: [],
  },
];

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
  jest.restoreAllMocks();
});

afterEach(() => {
  delete global.fetch;
});

describe('fetchAllExercises', () => {
  test('fetches from network when no cache', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockExercises,
    });

    const result = await fetchAllExercises();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('ex1');
    expect(result[0].target).toBe('chest');
    expect(result[0].bodyPart).toBe('chest');
    // Should have written to cache
    expect(localStorage.getItem(CACHE_KEY)).toBeTruthy();
    expect(localStorage.getItem(CACHE_TIMESTAMP_KEY)).toBeTruthy();
  });

  test('returns cached data when cache is fresh', async () => {
    const transformed = [
      { id: 'ex1', name: 'Push Up', target: 'chest', bodyPart: 'chest' },
    ];
    localStorage.setItem(CACHE_KEY, JSON.stringify(transformed));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));

    const result = await fetchAllExercises();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toEqual(transformed);
  });

  test('refetches when cache is expired', async () => {
    const transformed = [
      { id: 'old', name: 'Old', target: 'chest', bodyPart: 'chest' },
    ];
    localStorage.setItem(CACHE_KEY, JSON.stringify(transformed));
    // Set timestamp to 25 hours ago (expired)
    const expiredTimestamp = Date.now() - 25 * 60 * 60 * 1000;
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(expiredTimestamp));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockExercises,
    });

    const result = await fetchAllExercises();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('ex1');
  });
});

describe('clearExerciseCache', () => {
  test('removes localStorage entries', () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify([{ id: '1' }]));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));

    clearExerciseCache();

    expect(localStorage.getItem(CACHE_KEY)).toBeNull();
    expect(localStorage.getItem(CACHE_TIMESTAMP_KEY)).toBeNull();
  });
});

