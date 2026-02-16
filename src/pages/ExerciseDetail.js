import React, { useEffect, useState} from 'react'
import {useParams } from 'react-router-dom';
import { Box, Typography} from '@mui/material';
import { exerciseOptions, fetchData, youtubeOptions } from '../utils/fetchData';
import { scrollToTop } from '../utils/scrollUtils';
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setexerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const exerciseDbUrl = "https://exercisedb.p.rapidapi.com";
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';

        const exerciseDetailData = await fetchData(`${exerciseDbUrl}/exercises/exercise/${id}`,
        exerciseOptions);

        setExerciseDetail(exerciseDetailData);

        try {
          const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name}`, youtubeOptions)
          setexerciseVideos(exerciseVideosData.contents || [])
        } catch (err) {
          console.error('Error fetching videos:', err);
          setexerciseVideos([]);
        }

        try {
          const targetMuscleExercisesData = await fetchData(`${exerciseDbUrl}/exercises/target/${exerciseDetailData.target}`, exerciseOptions);
          setTargetMuscleExercises(targetMuscleExercisesData);
        } catch (err) {
          console.error('Error fetching target muscle exercises:', err);
          setTargetMuscleExercises([]);
        }

        try {
          const equipmentExercisesData = await fetchData(`${exerciseDbUrl}/exercises/equipment/${exerciseDetailData.equipment}`, exerciseOptions)
          setEquipmentExercises(equipmentExercisesData);
        } catch (err) {
          console.error('Error fetching equipment exercises:', err);
          setEquipmentExercises([]);
        }

        setError('');
      } catch (err) {
        console.error('Error fetching exercise detail:', err);
        setError('Failed to load exercise details. Please try again.');
      }
    }

    fetchExercisesData();
    scrollToTop();
  }, [id]);

  return (
    <Box>
      {error && (
        <Typography color='error' variant='h5' sx={{ p: '20px', textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      <Detail exerciseDetail={exerciseDetail}/>
      <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name}/>
      <SimilarExercises targetMuscleExercises={targetMuscleExercises} equipmentExercises={equipmentExercises} />
    </Box>
  )
}

export default ExerciseDetail