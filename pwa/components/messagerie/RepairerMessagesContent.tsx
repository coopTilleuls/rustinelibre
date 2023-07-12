import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {useAccount} from '@contexts/AuthContext';
import {ENTRYPOINT} from '@config/entrypoint';
import {discussionMessageResource} from '@resources/discussionMessageResource';
import {
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';
import {DiscussionMessage} from '@interfaces/DiscussionMessage';
import {discussionResource} from "@resources/discussionResource";

type MessagesContentProps = {
  discussion: Discussion;
  loading: Boolean;
};

const RepairerMessagesContent = ({
  discussion,
  loading
}: MessagesContentProps): JSX.Element => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {user} = useAccount({});
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageToSend(event.target.value);
  };

  const subscribeMercureDiscussion = async (): Promise<void> => {
    const hubUrl = `${ENTRYPOINT}/.well-known/mercure`;
    const hub = new URL(hubUrl);
    hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
    const eventSource = new EventSource(hub);
    eventSource.onmessage = (event) => {
      fetchMessages();
    };
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!messageToSend) {
      return;
    }
    setCurrentPage(1);
    setMessageToSend('');
    await discussionMessageResource.post({
      content: messageToSend,
      discussion: discussion['@id'],
    });
  };

  const handleKeyDown = (event: any): void => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const fetchMessages = async () => {
    const response = await discussionMessageResource.getAll(true, {
      discussion: discussion['@id'],
      page: currentPage,
    });

    if (currentPage === 1) {
      setMessages(response['hydra:member']);
      await discussionResource.discussionRead(discussion.id.toString(), {});
    } else {
      const messagesToDisplay = messages as DiscussionMessage[];
      response['hydra:member'].map((oldMessage) => {
        messagesToDisplay.push(oldMessage);
      });
      setMessages(messagesToDisplay);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      const messagesContainer = messagesContainerRef.current;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMessages();
    subscribeMercureDiscussion();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMessages();
  }, [currentPage, discussion]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width="100%">
      {loading && <CircularProgress />}
      {!loading && user && (
        <>
          <Box
            sx={{
              top: 100,
              pr: 2,
              pb: 5,
              height: '50vh',
              overflowY: 'scroll',
            }}
            ref={messagesContainerRef}>
            {messages
              .sort((a, b) => a.id - b.id)
              .map(({sender, content, createdAt}, index) => (
                <Box
                  key={index}
                  width="70%"
                  px={2}
                  py={1}
                  mb={2}
                  borderRadius={2}
                  textAlign={sender.id === user.id ? 'right' : 'left'}
                  color={sender.id === user.id ? 'white' : 'black'}
                  sx={{
                    float: sender.id === user.id ? 'right' : 'left',
                    backgroundColor:
                      sender.id === user.id ? 'primary.main' : 'grey.200',
                    wordBreak: 'break-all',
                  }}>
                  <>
                    <Typography>{content}</Typography>
                    <Typography fontSize={11} fontStyle="italic" pt={1}>
                      {formatDate(createdAt)}
                    </Typography>
                  </>
                </Box>
              ))}
          </Box>
          <Box width="100%" mt={2}>
            <Paper
              elevation={4}
              sx={{
                padding: '1rem',
                right: 5,
              }}>
              <TextField
                label="Écrire un message"
                fullWidth
                multiline
                rows={3}
                value={messageToSend}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{marginTop: '1rem', textTransform: 'capitalize'}}
                onClick={handleSendMessage}>
                Envoyer
              </Button>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default RepairerMessagesContent;
