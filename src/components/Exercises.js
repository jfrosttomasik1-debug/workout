import React, {useEffect, useState} from 'react';
import Pagination  from "@mui/material/Pagination";
import { Box, Stack, Typography } from '@mui/material';

import { fetchAllExercises } from '../utils/fetchData';
import { scrollToElement } from '../utils/scrollUtils';
import ExerciseCard from './ExerciseCard';
import Loader from './Loader';


const Exercises = ({exercises, setExercises, bodyPart}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(6);
  const [error, setError] = useState('');


  //pagination
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise)

  const paginate = (e, value) => {
    setCurrentPage(value);
    scrollToElement('exercises', 100);
  }

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        let exercisesData = [];
        const allExercises = await fetchAllExercises();

        if(bodyPart === 'all') {
          exercisesData = allExercises;
        } else {
          exercisesData = allExercises.filter(exercise => exercise.bodyPart === bodyPart);
        }

        setExercises(exercisesData);
        setError('');
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises. Please try again.');
        setExercises([]);
      }
    };

    fetchExercisesData();

  }, [bodyPart, setExercises]);

  if(error) {
    return (
      <Box id="exercises" sx={{mt: {lg: '110px' }}} mt='50px' p='20px'>
        <Typography color='error' variant='h5' textAlign='center'>
          {error}
        </Typography>
      </Box>
    );
  }

  if(!currentExercises.length) return <Loader />

  return (
    <Box id="exercises"
      sx={{mt: {lg: '110px' }}}
      mt='50px'
      p='20px'
    >
      <Typography variant='h3' marginBottom='46px'>
        Showing Results
      </Typography>

      <Stack direction='row' sx={{gap: {lg: '107px', xs: '50px'}}}
      flexWrap='wrap' justify='center'>
        {currentExercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} /> 
        ))}
      </Stack>

      <Stack mt='100px' alignItems='center'>
        {exercises.length > 9 && (
          <Pagination 
            color='standard'
            shape='rounded'
            defaultPage={1}
            count={Math.ceil(exercises.length / exercisesPerPage)}
            page={currentPage}
            onChange={paginate}
            size='large'
          />
        )}
      </Stack>
    </Box>
  )
}

export default Exercises