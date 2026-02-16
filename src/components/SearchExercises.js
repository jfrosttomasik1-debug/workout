import React, {useEffect, useState} from 'react';
import {Box, Button, Stack, TextField, Typography} from '@mui/material'

import { fetchAllExercises } from '../utils/fetchData';
import { scrollToElement } from '../utils/scrollUtils';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({setExercises, bodyPart, setBodyPart}) => {
  const [search, setSearch] = useState('');

  const [bodyParts, setBodyParts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const allExercises = await fetchAllExercises();

        // Extract unique body parts from exercises
        const uniqueBodyParts = [...new Set(allExercises.map(ex => ex.bodyPart))];
        const sortedBodyParts = uniqueBodyParts.sort();

        setBodyParts(['all', ...sortedBodyParts])
        setError('');
      } catch (err) {
        console.error('Error fetching body parts:', err);
        setError('Failed to load body parts. Please refresh the page.');
        setBodyParts(['all']);
      }
    }

    fetchExercisesData();
  }, [])
  
  const handleSearch = async () => {
    if(search) {
      try {
        const allExercises = await fetchAllExercises();

        const searchedExercises = allExercises.filter(
          (exercise) => exercise.name.toLowerCase().includes(search)
          || exercise.target.toLowerCase().includes(search)
          || exercise.equipment.toLowerCase().includes(search)
          || exercise.bodyPart.toLowerCase().includes(search)
        )

        setSearch('');
        setExercises(searchedExercises);
        setError('');
        scrollToElement('exercises', 100);
      } catch (err) {
        console.error('Error searching exercises:', err);
        setError('Failed to search exercises. Please try again.');
      }
    }
  }

  return (
    <Stack alignItems="center" mt='37px' justify="center" p="20px">
        
        <Typography fontWeight={700} sx={{
            fontSize: {lg: '44px', xs: '30px'}}}
            mb="50px" textAlign="center">
            Awesome Exercises You <br/> 
            Should Know
        </Typography>

        <Box position="relative" mb='72px'>

          <TextField 
          sx={{
            input: {fontWeight: '700',
          border: 'none', 
          borderRadius: '4px'},
          width: {lg: '800px', xs: '350px'},
          backgroundColor: '#fff', borderRadius: '40px'
          }}
          height='76px'
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search Exercises"
          type='text'

          />

          <Button className='search-btn'
          sx={{
            bgColor: '#FF2625',
            textTransform: 'none',
            width: { lg: '175px', xs: '80px'},
            fontSize: {lg: '20px', xs: '14px'},
            height: '56px',
            psotion:'absolute',
            right: '0'
          }}
          onClick={handleSearch}
          >
            Search
          </Button>
        </Box>

        {error && (
          <Typography color='error' sx={{ mb: '20px', textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <Box sx={{position: 'relative', width: '100%', p: '20px'}}>
          <Typography variant="h4" sx={{alignItems: "center"}}> Scroll Right and Left with Two Finger Drag or Mouse to View More Clickable Options</Typography>
          <HorizontalScrollbar data={bodyParts} bodyPart={bodyPart} setBodyPart={setBodyPart} isBodyParts/>
        </Box>
    </Stack>
  )
}

export default SearchExercises