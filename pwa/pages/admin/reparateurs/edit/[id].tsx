import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress} from '@mui/material';
import AdminLayout from "@components/admin/AdminLayout";
import {BikeType} from "@interfaces/BikeType";
import {RepairerType} from "@interfaces/RepairerType";
import {repairerTypeResource} from "@resources/repairerTypeResource";
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {repairerResource} from "@resources/repairerResource";
import {Repairer} from "@interfaces/Repairer";
import InformationsContainer from "@components/dashboard/informations/InformationsContainer";

const EditRepairer: NextPageWithLayout = () => {

    const router = useRouter();
    const {id} = router.query;
    const [repairer, setRepairer] = useState<Repairer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
    const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);

    const fetchRepairerTypes = async () => {
        const responseRepairerTypes = await repairerTypeResource.getAll(false);
        setRepairerTypes(responseRepairerTypes['hydra:member']);
    };

    const fetchBikeTypes = async () => {
        const responseBikeTypes = await bikeTypeResource.getAll(false);
        setBikeTypes(responseBikeTypes['hydra:member']);
    };

    useEffect(() => {
        fetchRepairerTypes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchBikeTypes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchRepairer = async () => {
        if (typeof id === 'string' && id.length > 0) {
            setLoading(true);
            const repairerFetch: Repairer = await repairerResource.getById(id);
            setRepairer(repairerFetch);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRepairer();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Éditer un utilisateur</title>
            </Head>
            <AdminLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%'}}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <InformationsContainer repairerTypes={repairerTypes} bikeTypes={bikeTypes} repairerFetch={repairer} fetchRepairer={fetchRepairer} />
                )}
            </Box>
        </>
    );
};

export default EditRepairer;
