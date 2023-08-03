import React, {useState} from 'react';
import {Box, Typography, Button, Stack, Collapse, Divider} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface OpeningsObjectType {
  [key: string]: string[];
}

interface SlotsStepProps {
  handleSelectSlot: (day: string, time: string) => void;
  openingHours: OpeningsObjectType | [];
}

const SlotsStep = ({handleSelectSlot, openingHours}: SlotsStepProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(7);

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
        {Object.entries(openingHours).length
          ? 'Choisissez votre créneau'
          : "Votre réparateur n'a pas actuellement de créneau disponible. Veuillez prendre contact avec lui directement par téléphone."}
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
                                color: 'white',
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

        {displayCount < Object.entries(openingHours).length && (
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
