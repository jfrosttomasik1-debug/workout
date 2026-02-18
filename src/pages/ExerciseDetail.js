import React, { useEffect, useState} from 'react'
import {useParams } from 'react-router-dom';
import { Box, Typography, Button} from '@mui/material';
import { fetchAllExercises, fetchData, youtubeOptions } from '../utils/fetchData';
import { scrollToTop } from '../utils/scrollUtils';
import { useHistory } from '../contexts/HistoryContext';
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';
import TrackingForm from '../components/TrackingForm';
import FavoriteButton from '../components/FavoriteButton';

const ExerciseDetail = () => {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setexerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const [error, setError] = useState('');
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const { id } = useParams();
  const { addToHistory } = useHistory();

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';

        // Fetch all exercises and find the one matching the ID
        const allExercises = await fetchAllExercises();
        const exerciseDetailData = allExercises.find(ex => ex.id === id);

        if (!exerciseDetailData) {
          throw new Error('Exercise not found');
        }

        setExerciseDetail(exerciseDetailData);
        addToHistory(exerciseDetailData);

        try {
          const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name}`, youtubeOptions)
          setexerciseVideos(exerciseVideosData.contents || [])
        } catch (err) {
          console.error('Error fetching videos:', err);
          setexerciseVideos([]);
        }

        try {
          // Find exercises that target the same muscle
          const targetMuscleExercisesData = allExercises.filter(
            ex => ex.target === exerciseDetailData.target && ex.id !== id
          );
          setTargetMuscleExercises(targetMuscleExercisesData);
        } catch (err) {
          console.error('Error fetching target muscle exercises:', err);
          setTargetMuscleExercises([]);
        }

        try {
          // Find exercises that use the same equipment
          const equipmentExercisesData = allExercises.filter(
            ex => ex.equipment === exerciseDetailData.equipment && ex.id !== id
          );
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
  }, [id, addToHistory]);

  return (
    <Box>
      {error && (
        <Typography color='error' variant='h5' sx={{ p: '20px', textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      {exerciseDetail.id && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: { sm: '100px', xs: '20px' }, pt: '20px' }}>
          <FavoriteButton exercise={exerciseDetail} sx={{ fontSize: '32px' }} />
        </Box>
      )}
      <Detail exerciseDetail={exerciseDetail}/>
      {exerciseDetail.id && (
        <Box sx={{ px: { sm: '100px', xs: '20px' }, mb: '20px' }}>
          <Button
            variant="contained"
            onClick={() => setShowTrackingForm((prev) => !prev)}
            sx={{ bgcolor: '#FF2625', '&:hover': { bgcolor: '#e02020' } }}
          >
            {showTrackingForm ? 'Cancel Log' : 'Log Exercise'}
          </Button>
          {showTrackingForm && (
            <TrackingForm
              exercise={exerciseDetail}
              onClose={() => setShowTrackingForm(false)}
            />
          )}
        </Box>
      )}
      <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name}/>
      <SimilarExercises targetMuscleExercises={targetMuscleExercises} equipmentExercises={equipmentExercises} />
    </Box>
  )
}

export default ExerciseDetail