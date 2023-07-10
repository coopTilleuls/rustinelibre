import React, {PropsWithChildren, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@components/layout/Navbar'));
const Footer = dynamic(() => import('@components/layout/Footer'));
import {useAccount} from '@contexts/AuthContext';
import LegalNoticesFooter from './LegaNoticesFooter';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {Discussion} from "@interfaces/Discussion";
import {ENTRYPOINT} from "@config/entrypoint";
import {discussionResource} from "@resources/discussionResource";

const WebsiteLayout = ({children}: PropsWithChildren): JSX.Element => {
  const {user} = useAccount({});
  const router = useRouter();
  const next = Array.isArray(router.query.next)
    ? router.query.next.join('')
    : router.query.next || '/';
  const isAdmin = next.includes('admin');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

    const subscribeMercureDiscussions = async (): Promise<void> => {
        const hubUrl = `${ENTRYPOINT}/.well-known/mercure`;
        const hub = new URL(hubUrl);
        discussions.map((discussion) => {
            hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
        });

        const eventSource = new EventSource(hub);
        eventSource.onmessage = (event) => {
            countUnread();
        };
    };

    const countUnread = async () => {
        if (!user) {
            return;
        }
        const countUnread = await discussionResource.countUnread({});
        console.log(countUnread);
    };

    const fetchDiscussions = async () => {
        if (!user) {
            return;
        }
        const response = await discussionResource.getAll(true, {
            customer: user.id,
        });
        setDiscussions(response['hydra:member']);
    };

    useEffect(() => {
        fetchDiscussions();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (discussions.length > 0) {
            subscribeMercureDiscussions();
        }
    }, [discussions]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box height="100vh" overflow="auto" id="websitelayout">
      {!isAdmin && <Navbar user={user ?? undefined} />}
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        pt={{xs: '56px', sm: '64px', md: '80px'}}
        pb={{xs: '56px', md: '72px'}}>
        <Box flex={1}>{children}</Box>
        {!isAdmin && <LegalNoticesFooter />}
      </Box>
      {!isAdmin && <Footer user={user ?? undefined} />}
    </Box>
  );
};

export default WebsiteLayout;
