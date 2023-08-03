import React, {useEffect, useState} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Box,
  Typography,
  Button,
  Stack,
  Collapse,
  Divider,
  CircularProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {openingHoursResource} from '@resources/openingHours';
import {Repairer} from '@interfaces/Repairer';
import {useTheme} from '@mui/material/styles';

interface OpeningsObjectType {
  [key: string]: string[];
}

interface SlotsStepProps {
  handleSelectSlot: (day: string, time: string) => void;
  repairer: Repairer;
}

const SlotsStep = ({handleSelectSlot, repairer}: SlotsStepProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState<boolean>(true);
  const [openingHours, setOpeningHours] = useState<OpeningsObjectType | []>([]);
  const [displayCount, setDisplayCount] = useState<number>(7);

  const fetchOpeningHours = async () => {
    setLoading(true);
    const openingHoursFetch =
      await openingHoursResource.getRepairerSlotsAvailable(repairer.id);
    setOpeningHours(filterDates(openingHoursFetch));
    setLoading(false);
  };

  const filterDates = (
    data: Record<string, string[]>
  ): Record<string, string[]> => {
    // Get current date as a string
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];

    // If current date is in our data
    if (currentDateStr in data) {
      const [year, month, day] = currentDateStr.split('-');
      const currentHours = data[currentDateStr];
      const filteredHours = currentHours.filter((hour) => {
        const [hours, minutes] = hour.split(':');
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
        return date >= currentDate;
      });

      if (filteredHours.length === 0) {
        delete data[currentDateStr];
      } else {
        data[currentDateStr] = filteredHours;
      }
    }

    return data;
  };

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
    <Box width="100%" display="flex" flexDirection="column" alignItems="start">
      <Typography variant="h5" mb={2}>
        {loading ? (
          <CircularProgress />
        ) : openingHours.length !== 0 ? (
          'Choisissez votre créneau'
        ) : (
          "Votre réparateur n'a pas actuellement de créneau disponible. Veuillez prendre contact avec lui directement par téléphone."
        )}
      </Typography>
      <Stack spacing={2} width={'100%'}>
        {openingHours &&
          Object.entries(openingHours)
            .slice(0, displayCount)
            .map(([day, hours], index) => {
              const date: string = new Date(day).toLocaleString('fr-FR', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              });

              if (hours.length === 0) {
                return;
              }

              return (
                <Box
                  key={day}
                  sx={{
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    boxShadow: 1,
                    borderRadius: 5,
                  }}>
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
                      variant="h6"
                      textTransform="capitalize"
                      color={
                        openIndex === index ? 'primary.main' : 'text.secondary'
                      }>
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
                    <Box py={3} px={2}>
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        flexDirection="row"
                        gap={2}>
                        {hours.map((hour) => (
                          <Button
                            key={hour}
                            onClick={() => handleSelectSlot(day, hour)}
                            variant="contained"
                            sx={{
                              color: 'text.secondary',
                              backgroundColor: 'white',
                              border: '1px solid',
                              borderColor: 'grey.300',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white'
                              },
                            }}>
                            {hour}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              );
            })}

        {openingHours && displayCount < Object.entries(openingHours).length && (
          <Button
            variant="outlined"
            size="large"
            onClick={() => setDisplayCount(displayCount + 7)}>
            Voir plus de disponibilités
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default SlotsStep;
