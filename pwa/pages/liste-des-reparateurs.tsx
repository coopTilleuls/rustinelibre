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
        <Box
          height={{xs: 'calc(100vh - 55px)', md: 'calc(100vh - 70px)'}}
          display="flex"
          flexDirection="column"
          overflow="auto">
          <Container sx={{mt: 10}}>
            <Typography variant="h3" sx={{mb: 5, textAlign: 'center'}}>
              Liste des réparateurs
            </Typography>
            <Typography variant="body1" sx={{mb: 5}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec est
              magna, finibus in suscipit sit amet, tempor non leo. Aliquam
              placerat lacinia maximus.
            </Typography>
            {isLoading && <CircularProgress />}
            {!isLoading && (
              <Grid2 container spacing={4}>
                {repairers.map((repairer) => {
                  return (
                    <Grid2
                      id={repairer.id}
                      key={repairer.id}
                      xs={6}
                      pt="198px"
                      mt="-198px">
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
        </Box>
      </WebsiteLayout>
    </>
  );
};

export default RepairersList;
