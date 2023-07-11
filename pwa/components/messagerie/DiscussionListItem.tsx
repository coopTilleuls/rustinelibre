import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {discussionResource} from '@resources/discussionResource';
import {useAccount} from '@contexts/AuthContext';
import {ENTRYPOINT} from '@config/entrypoint';
import {Box, CircularProgress, Paper, Typography} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';
import {BikeType} from "@interfaces/BikeType";

type DiscussionListItemProps = {
    discussion: Discussion;
    isCustomer: boolean;
};

const DiscussionListItem = ({discussion, isCustomer}: DiscussionListItemProps): JSX.Element => {

    const router = useRouter();

    console.log(discussion);
    console.log(isCustomer);

    // const subscribeMercureDiscussions = async (): Promise<void> => {
    //     const hubUrl = `${ENTRYPOINT}/.well-known/mercure`;
    //     const hub = new URL(hubUrl);
    //     discussions.map((discussion) => {
    //         hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
    //     });
    //
    //     const eventSource = new EventSource(hub);
    //     eventSource.onmessage = (event) => {
    //         fetchDiscussions();
    //     };
    // };

    //
    // useEffect(() => {
    //     fetchDiscussions();
    // }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
    //
    // useEffect(() => {
    //     if (discussions.length > 0) {
    //         subscribeMercureDiscussions();
    //     }
    // }, [discussions]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Link
            key={discussion.id}
            href={isCustomer ? `/messagerie/${discussion.id}` : `/sradmin/messagerie/${discussion.id}`}
            style={{textDecoration: 'none'}}>
            <Paper
                elevation={4}
                sx={{
                    cursor: 'pointer',
                    width: '100%',
                    backgroundColor:
                        +router.query.id! === +discussion.id ? 'primary.main' : '',
                    mb: 2,
                }}>
                <Box px={2} py={1}>
                    <Typography
                        color={+router.query.id! === +discussion.id ? 'white' : 'black'}>
                        {isCustomer ? discussion.repairer.name : discussion.customer.lastName}
                    </Typography>

                    <Typography
                        color={+router.query.id! === +discussion.id ? 'white' : 'grey'}
                        fontSize={12}
                        fontStyle="italic">
                        {discussion.lastMessage
                            ? `Dernier message : ${formatDate(discussion.lastMessage, true)}`
                            : 'Pas encore de message'}
                    </Typography>
                </Box>
            </Paper>
        </Link>
    );
};

export default DiscussionListItem;
