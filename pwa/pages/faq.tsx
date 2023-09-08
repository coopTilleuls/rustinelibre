import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Paper, Avatar, Box} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {questions} from '@data/faq-questions';

const Faq: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>FAQ</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            py={4}
            gap={8}>
            <Typography variant="h1" color="primary">
              Les questions les plus posées
            </Typography>
            <Box>
              {questions.map(({id, question, answer}) => {
                return (
                  <Accordion key={id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${id}-content`}
                      id={`panel-${id}-header`}>
                      <Typography>{question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{answer}</Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Faq;
