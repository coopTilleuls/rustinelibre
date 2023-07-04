import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {CircularProgress, Container, Box, Typography} from '@mui/material';
import {repairerResource} from '@resources/repairerResource';
import {Repairer} from '@interfaces/Repairer';
import Grid2 from '@mui/material/Unstable_Grid2';
import {RepairerCard} from '@components/repairers/RepairerCard';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import router from 'next/router';

const RepairersList: NextPageWithLayout = () => {
  const [repairers, setRepairers] = useState<Repairer[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const {setSelectedRepairer} = useContext(SearchRepairerContext);

  const fetchRepairers = async (): Promise<void> => {
    setIsLoading(true);
    let params = {
      paginatinon: 'false',
      sort: 'random',
      enabled: 'true',
    };
    const response = await repairerResource.getAll(false, params);
    setRepairers(response['hydra:member']);
    setIsLoading(false);
  };

  useEffect(() => {
    setSelectedRepairer('');
    fetchRepairers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Liste des réparateurs</title>
      </Head>
      <WebsiteLayout>
        <Container
          sx={{
            mt: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography variant="h1" textAlign="center" mb={5} color="primary">
            Liste des réparateurs
          </Typography>
          <Typography variant="body1" mb={5} textAlign="center" maxWidth="md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec est
            magna, finibus in suscipit sit amet, tempor non leo. Aliquam
            placerat lacinia maximus.
          </Typography>
          {isLoading && <CircularProgress />}
          {!isLoading && (
            <Grid2 container spacing={4}>
              {repairers.map((repairer) => {
                return (
                  <Grid2 id={repairer.id} key={repairer.id} xs={12} sm={6}>
                    <RepairerCard
                      repairer={repairer}
                      onClick={() =>
                        router.push({
                          pathname: `/reparateur/${repairer.id}`,
                          query: {repairerList: 1},
                        })
                      }
                    />
                  </Grid2>
                );
              })}
            </Grid2>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default RepairersList;
