import {NextPageWithLayout} from 'pages/_app';
import React, {
    useState,
    useEffect,
} from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {
    CircularProgress,
    Container,
    Box,
} from '@mui/material';
import {repairerResource} from '@resources/repairerResource';
import {Repairer} from "@interfaces/Repairer";
import Grid2 from "@mui/material/Unstable_Grid2";
import {RepairerCard} from "@components/repairers/RepairerCard";

const RepairersList: NextPageWithLayout = () => {
    const [repairers, setRepairers] = useState<Repairer[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const fetchRepairers = async(): Promise<void> => {
        setIsLoading(true);
        let params = {
            paginatinon: 'false',
            sort: 'random',
            enabled: 'true'
        };
        const response = await repairerResource.getAll(false, params);
        setRepairers(response['hydra:member']);
        setIsLoading(false);
    }

    useEffect(() => {
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

                        {isLoading && <CircularProgress />}
                        {!isLoading && <Grid2 container spacing={4}>
                            {repairers.map((repairer) => {
                                return (
                                    <Grid2
                                        id={repairer.id}
                                        key={repairer.id}
                                        xs={6}
                                        pt="198px"
                                        mt="-198px">
                                        <RepairerCard repairer={repairer} />
                                    </Grid2>
                                );
                            })}
                        </Grid2>}
                    </Container>
                </Box>
            </WebsiteLayout>
        </>
    );
};

export default RepairersList;
