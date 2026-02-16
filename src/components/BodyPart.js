import React from 'react'
import {Typography, Button} from '@mui/material';

import Icon from '../assets/icons/gym.png'
import { scrollToElement } from '../utils/scrollUtils';

const BodyPart = ({item, setBodyPart, bodyPart}) => {
  return (
    <Button
        component='button'
        className='bodyPart-card'
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: bodyPart === item ? '4px solid #ff2625' : '2px solid transparent',
            backgroundColor: '#fff',
            borderBottomLeftRadius: '20px',
            width: '270px',
            height: '280px',
            cursor: 'pointer',
            padding: '5px',
            gap: '47px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            },
            '&:focus': {
              outline: '2px solid #FF2625',
              outlineOffset: '2px'
            }
        }}
        onClick={() => {
            setBodyPart(item);
            scrollToElement('exercises', 100);
        }}
        aria-pressed={bodyPart === item}
        aria-label={`Select ${item} exercises`}
    >
        <img src={Icon} alt='' style={{width: '40px', height: '40px'}} />

        <Typography fontSize='24px' fontWeight='bold' color='#3A1212' textTransform='capitalize'>{item}</Typography>
    </Button>
  )
}

export default BodyPart