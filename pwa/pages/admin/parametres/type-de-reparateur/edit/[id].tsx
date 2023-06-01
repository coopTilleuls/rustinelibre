import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress, Container, Link, Paper} from '@mui/material';
import AdminLayout from "@components/admin/AdminLayout";
import {RepairerType} from "@interfaces/RepairerType";
import {repairerTypeResource} from "@resources/repairerTypeResource";
import RepairerTypeForm from "@components/admin/parameters/repairerType/RepairerTypeForm";

const EditRepairerType: NextPageWithLayout = () => {

    const router = useRouter();
    const {id} = router.query;
    const [repairerType, setRepairerType] = useState<RepairerType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRepairerType = async () => {
        if (typeof id === 'string' && id.length > 0) {
            setLoading(true);
            const repairerTypeFetch: RepairerType = await repairerTypeResource.getById(id);
            setRepairerType(repairerTypeFetch);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRepairerType();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Éditer un type de réparateur</title>
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
                            <RepairerTypeForm repairerType={repairerType} />
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </>
    );
};

export default EditRepairerType;
