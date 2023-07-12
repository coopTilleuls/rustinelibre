import React, {useState} from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Image from 'next/image';

const questions = [
  {
    id: 1,
    title: 'Quel doit être le niveau de détails techniques de la réservation ?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
  },
  {
    id: 2,
    title: 'Comment être bien sûr que ma réservation a été prise en compte ?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
  },
  {
    id: 3,
    title: 'Comment être bien sûr que ma réservation a été prise en compte ?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.',
  },
];

const Faq = () => {
  const [current, setCurrent] = useState<number>(0);

  return (
    <Box display="flex" flexDirection="row" bgcolor="lightsecondary.main">
      <Box flex={1}>
        <Box
          minHeight="500px"
          maxWidth="430px"
          mx="auto"
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          py={1}
          px={6}>
          <Typography variant="h4" component="p" color="secondary.main">
            Une question&nbsp;?
            <br />
            Rustine libre a la réponse&nbsp;!
          </Typography>
          <Box
            my={3}
            display="flex"
            flexDirection="column"
            justifyContent="center">
            {questions.map((question) => (
              <Accordion
                disableGutters
                elevation={0}
                sx={{
                  position: 'relative',
                  transition: 'all ease 0.5s',
                  bgcolor: 'transparent',
                  mx: 0,
                  my: current === question.id ? 2 : 0,
                  '&::before': {
                    content: 'none',
                  },
                }}
                key={question.id}
                expanded={current === question.id}
                onChange={() => {
                  current === question.id
                    ? setCurrent(0)
                    : setCurrent(question.id);
                }}>
                <AccordionSummary
                  sx={{
                    bgcolor: 'transparent',
                    px: 0,
                    zIndex: 1,
                    '& .MuiAccordionSummary-content': {my: 1},
                  }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={
                      current === question.id
                        ? 'secondary.light'
                        : 'text.primary'
                    }
                    sx={{display: 'flex', justifyContent: 'space-between'}}>
                    {question.title}
                    {current === question.id ? (
                      <ExpandLessIcon color="secondary" />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{p: 0, zIndex: 1}}>
                  <Typography variant="body2" color="text.secondary">
                    {question.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Link href="/faq">
            <Button variant="contained" color="secondary" size="large">
              D&apos;autres questions ?
            </Button>
          </Link>
        </Box>
      </Box>
      <Box width="50%" position="relative">
        <Image alt="" fill src="/img/faq.jpeg" style={{objectFit: 'cover'}} />
      </Box>
    </Box>
  );
};

export default Faq;
