import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Box } from "@mui/material"
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TrackingLog from './pages/TrackingLog';
import WorkoutBuilder from './pages/WorkoutBuilder';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { TrackingProvider } from './contexts/TrackingContext';
import { WorkoutProvider } from './contexts/WorkoutContext';

import './App.css';

const App = () => {
  return (
    <HistoryProvider>
      <FavoritesProvider>
        <TrackingProvider>
          <WorkoutProvider>
            <Box width='400px' sx={{ width: {xl: '1488px'}}} m="auto">
                <Navbar/>
                <Routes>
                    <Route path='/' element={ <Home/>} />
                    <Route path='/exercise/:id' element={<ExerciseDetail />}/>
                    <Route path='/favorites' element={<Favorites />}/>
                    <Route path='/history' element={<History />}/>
                    <Route path='/tracking' element={<TrackingLog />}/>
                    <Route path='/workout' element={<WorkoutBuilder />}/>
                </Routes>

                <Footer />

            </Box>
          </WorkoutProvider>
        </TrackingProvider>
      </FavoritesProvider>
    </HistoryProvider>
  )
}

export default App