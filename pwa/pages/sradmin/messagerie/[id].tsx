import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from 'next/head';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress} from '@mui/material';
import {discussionResource} from "@resources/discussionResource";
import {Discussion} from "@interfaces/Discussion";
import MessagesContent from "@components/messagerie/MessagesContent";

const SrAdminMessagerie: NextPageWithLayout = () => {
    const router = useRouter();
    const {id} = router.query;
    const [discussion, setDiscussion] = useState<Discussion | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchDiscussion = async(id: string) => {
        setLoading(true);
        const response: Discussion = await discussionResource.getById(id);
        setDiscussion(response);
        setLoading(false);
    }

    useEffect(() => {
        if (id) {
            fetchDiscussion(id as string);
        }
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Messagerie</title>
            </Head>
            <DashboardLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%', marginTop: '100px'}}>

                {loading && <CircularProgress />}
                {!loading && discussion && <MessagesContent discussion={discussion} />}
            </Box>
        </>
    );
};

export default SrAdminMessagerie;
