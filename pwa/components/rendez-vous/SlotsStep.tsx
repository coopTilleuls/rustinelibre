import React, {useEffect, useState} from 'react';
import useMediaQuery from '@hooks/useMediaQuery';
import {Box, Typography, Button, Stack, Collapse, Divider, CircularProgress} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {openingHoursResource} from "@resources/openingHours";
import {Repairer} from "@interfaces/Repairer";

interface OpeningsObjectType {
  [key: string]: string[];
}

interface SlotsStepProps {
  handleSelectSlot: (day: string, time: string) => void;
  repairer: Repairer;
}

const SlotsStep = ({handleSelectSlot, repairer}: SlotsStepProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [loading, setLoading] = useState<boolean>(true);
  const [openingHours, setOpeningHours] = useState<OpeningsObjectType|[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(7);

  const fetchOpeningHours = async () => {
    setLoading(true);
    const openingHoursFetch = await openingHoursResource.getRepairerSlotsAvailable(repairer.id);
    setOpeningHours(filterDates(openingHoursFetch));
    setLoading(false);
  }

  const filterDates = (data: Record<string, string[]>): Record<string, string[]> => {

    // Get current date as a string
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];

    // If current date is in our data
    if (currentDateStr in data) {
      const [year, month, day] = currentDateStr.split("-");
      const currentHours = data[currentDateStr];
      const filteredHours = currentHours.filter(hour => {
        const [hours, minutes] = hour.split(":");
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
        return date >= currentDate;
      });

      if (filteredHours.length === 0) {
        delete data[currentDateStr];
      } else {
        data[currentDateStr] = filteredHours;
      }
    }

    return data;
  }


  useEffect(() => {
    fetchOpeningHours();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        {loading && <CircularProgress />}
        {!loading && openingHours.length === 0 && "Votre réparateur n'a pas actuellement de créneau disponible. Veuillez prendre contact avec lui directement par téléphone." }
        {!loading && openingHours.length > 0 && "Choisissez votre créneau :"}
      </Typography>
      <Stack spacing={4} width={'100%'}>


        {openingHours && Object.entries(openingHours).slice(0, displayCount).map(([day, hours], index) => {

          const date: string = new Date(day).toLocaleString('fr-FR', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });

          return (
            <Box key={day} sx={{backgroundColor: 'primary.light'}}>
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
                    {hours.map(hour => (
                      <Grid2 key={hour} xs={4} textAlign="center">
                        <Button
                          onClick={() => handleSelectSlot(day, hour)}
                          variant="contained"
                          sx={{
                            color: 'primary.main',
                            backgroundColor: 'white',
                            '&:hover': {
                              backgroundColor: 'grey.300',
                            },
                          }}>
                          {hour}
                        </Button>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              </Collapse>
            </Box>
          );
        })}

        {openingHours && displayCount < Object.entries(openingHours).length && (
            <Button variant="outlined" onClick={() => setDisplayCount(displayCount + 7)}>Voir plus de disponibilités</Button>
        )}
      </Stack>
    </Box>
  );
};

export default SlotsStep;
