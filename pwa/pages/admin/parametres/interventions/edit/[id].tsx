import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress, Container, Link, Paper} from '@mui/material';
import AdminLayout from "@components/admin/AdminLayout";
import {Intervention} from "@interfaces/Intervention";
import {interventionResource} from "@resources/interventionResource";
import InterventionForm from "@components/admin/parameters/interventions/InterventionForm";

const EditIntervention: NextPageWithLayout = () => {

    const router = useRouter();
    const {id} = router.query;
    const [intervention, setIntervention] = useState<Intervention | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchIntervention = async () => {
        if (typeof id === 'string' && id.length > 0) {
            setLoading(true);
            const response: Intervention = await interventionResource.getById(id);
            setIntervention(response);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchIntervention();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Éditer une intervention</title>
            </Head>
            <AdminLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%'}}>

                {loading && <CircularProgress />}

                <Container sx={{width: {xs: '100%', md: '50%'}}}>
                    <Paper elevation={4} sx={{maxWidth: 400, p: 4, mt: 4, mx: 'auto'}}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <InterventionForm intervention={intervention} />
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default EditIntervention;
