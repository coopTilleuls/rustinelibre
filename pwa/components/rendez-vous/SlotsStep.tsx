import React, {useState} from 'react';
import useMediaQuery from '@hooks/useMediaQuery';
import {Box, Typography, Button, Stack, Collapse, Divider} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const slots = [
  {
    id: 1,
    day: '2023-05-05',
    slots: [
      {
        id: 1,
        slot: '10:00',
      },
      {
        id: 2,
        slot: '10:30',
      },
      {
        id: 3,
        slot: '11:00',
      },
    ],
  },
  {
    id: 2,
    day: '2023-05-06',
    slots: [
      {
        id: 1,
        slot: '09:00',
      },
      {
        id: 2,
        slot: '10:30',
      },
    ],
  },
  {
    id: 3,
    day: '2023-05-07',
    slots: [
      {
        id: 1,
        slot: '08:00',
      },
      {
        id: 2,
        slot: '08:30',
      },
      {
        id: 3,
        slot: '13:00',
      },
      {
        id: 4,
        slot: '14:00',
      },
      {
        id: 5,
        slot: '15:30',
      },
      {
        id: 6,
        slot: '16:00',
      },
    ],
  },
];

interface SlotsStepProps {
  handleSelectSlot: () => void;
}

const SlotsStep = ({handleSelectSlot}: SlotsStepProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const toggleExpand = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <Box
      width={isMobile ? '100%' : '60%'}
      display="flex"
      flexDirection="column"
      alignItems="start">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        Choisissez votre créneau :
      </Typography>
      <Stack spacing={4} width={'100%'}>
        {slots.map(({id, day, slots}, index) => {
          const date = new Date(day).toLocaleString('fr-FR', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });
          return (
            <Box key={id} sx={{backgroundColor: 'primary.light'}}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  width: '100%',
                  px: 2,
                  py: 1,
                }}
                onClick={() => toggleExpand(index)}>
                <Typography
                  fontSize={{xs: 16, md: 20}}
                  fontWeight={600}
                  color="white"
                  textTransform="capitalize">
                  {date}
                </Typography>
                <ExpandMoreIcon
                  color="primary"
                  fontSize="large"
                  sx={{
                    transform: openIndex === index ? 'rotate(180deg)' : '',
                  }}
                />
              </Box>
              <Collapse in={openIndex === index}>
                <Divider />
                <Box sx={{p: 2}}>
                  <Grid2
                    px={{md: 8}}
                    py={{xs: 1, md: 2}}
                    container
                    spacing={{xs: 1, md: 6}}
                    direction="row"
                    justifyContent="start"
                    alignItems="center">
                    {slots.map(({id, slot}) => (
                      <Grid2 key={id} xs={4} textAlign="center">
                        <Button
                          onClick={handleSelectSlot}
                          variant="contained"
                          sx={{
                            color: 'primary.main',
                            backgroundColor: 'white',
                            '&:hover': {
                              backgroundColor: 'grey.300',
                            },
                          }}>
                          {slot}
                        </Button>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default SlotsStep;
