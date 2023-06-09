import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {CircularProgress, Container} from '@mui/material';
import {discussionResource} from "@resources/discussionResource";
import {Discussion} from "@interfaces/Discussion";
import MessagesContent from "@components/messagerie/MessagesContent";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {formatDate} from "@helpers/dateHelper";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import {useAccount} from "@contexts/AuthContext";
import {ENTRYPOINT} from "@config/entrypoint";

const Messagerie: NextPageWithLayout = () => {

    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [discussionSelected, setDiscussionSelected] = useState<Discussion | null>(null);
    const {user} = useAccount({});

    const subscribeMercureDiscussions = async(): Promise<void> => {
        const hubUrl = `${ENTRYPOINT}/.well-known/mercure`
        const hub = new URL(hubUrl);
        discussions.map(discussion => {
            hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
        })

        const eventSource = new EventSource(hub);
        eventSource.onmessage = event => {
            fetchDiscussions()
        };
    }

    const fetchDiscussions = async() => {
        if (!user) {
            return;
        }

        setLoading(true);
        const response = await discussionResource.getAll(true, {
            'order[lastMessage]': 'DESC',
            customer: user['@id']
        });
        setDiscussions(response['hydra:member']);
        if (response['hydra:member'].length > 0) {
            setDiscussionSelected(response['hydra:member'][0])
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchDiscussions();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (discussions.length > 0) {
            subscribeMercureDiscussions();
        }
    }, [discussions]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Messagerie</title>
            </Head>
            <WebsiteLayout>
                <Container sx={{marginLeft: 0}}>
                    <Box component="main" sx={{marginRight: '5%', marginTop: '100px'}}>

                        {loading && <CircularProgress />}

                        <Grid container spacing={4}>
                            <Grid item md={3}>
                                <Paper elevation={4}>
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

                                        {!loading && discussions.length === 0 && <Box sx={{margin: '10px'}}>
                                            Pas de conversation engagées pour le moment
                                        </Box>}

                                        {discussions.length > 0 && discussions.map(discussion => {
                                            return <ListItem key={discussion['@id']} onClick={() => setDiscussionSelected(discussion)} sx={{cursor: 'pointer'}}>
                                                <ListItemText primary={discussion.repairer.name} secondary={formatDate(discussion.lastMessage, true)} />
                                            </ListItem>
                                        })}
                                    </List>
                                </Paper>
                            </Grid>

                            <Grid item md={8}>
                                <Box sx={{position: 'relative', bottom: '100px'}}>
                                    {discussionSelected && <MessagesContent discussion={discussionSelected} bottomPosition={80} />}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </WebsiteLayout>
        </>
    );
};

export default Messagerie;
