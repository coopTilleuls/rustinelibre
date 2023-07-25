import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {useAccount} from '@contexts/AuthContext';
import {ENTRYPOINT} from '@config/entrypoint';
import {discussionMessageResource} from '@resources/discussionMessageResource';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';
import {DiscussionMessage} from '@interfaces/DiscussionMessage';
import {discussionResource} from '@resources/discussionResource';
import {Send} from '@mui/icons-material';

type CustomerMessagesContentProps = {
  discussion: Discussion;
  loading: Boolean;
};

const CustomerMessagesContent = ({
  discussion,
  loading,
}: CustomerMessagesContentProps): JSX.Element => {
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
    if (!user) return;
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
  }, [discussion]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMessages();
  }, [currentPage, discussion]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      bgcolor="grey.100"
      height={{xs: 'inherit', md: '100%'}}>
      {user && (
        <>
          <Box
            sx={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
            ref={messagesContainerRef}>
            {!loading && (
              <Box
                width="100%"
                maxWidth={{xs: '100%', md: '800px'}}
                px={{xs: 2, md: 4}}
                py={2}
                display="flex"
                flexDirection="column"
                gap={1}>
                {messages.length === 0 ? (
                  <Typography
                    variant="body1"
                    sx={{mt: 4}}
                    color="text.secondary">{`Vous n'avez encore envoyé aucun message à ${
                    discussion.customer.id === user.id
                      ? `"${discussion.repairer.name}"`
                      : `${discussion.customer.firstName} ${discussion.customer.lastName}`
                  }`}</Typography>
                ) : null}
                {messages
                  .sort((a, b) => a.id - b.id)
                  .map(({sender, content, createdAt}, index) => {
                    const isUser = sender.id === user.id;
                    return (
                      <Box
                        key={index}
                        px={2}
                        py={0.75}
                        borderRadius={2}
                        textAlign={isUser ? 'right' : 'left'}
                        color={isUser ? 'white' : 'black'}
                        ml={isUser ? 'auto' : '0'}
                        mr={!isUser ? 'auto' : '0'}
                        sx={{
                          maxWidth: {xs: '90%', md: '70%'},
                          backgroundColor: isUser ? 'primary.main' : 'white',
                        }}>
                        <>
                          <Typography variant="body1">{content}</Typography>
                          <Typography
                            variant="caption"
                            fontStyle="italic"
                            color={
                              isUser ? 'rgba(255,255,255,0.7)' : 'grey.500'
                            }
                            pt={1}>
                            {formatDate(createdAt)}
                          </Typography>
                        </>
                      </Box>
                    );
                  })}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: '100%',
              borderTop: '1px solid',
              borderColor: 'grey.300',
              bgcolor: 'white',
            }}>
            <Box
              width="100%"
              maxWidth={{xs: '100%', md: '800px'}}
              px={4}
              py={2}
              display="flex"
              gap={2}>
              <TextField
                label="Écrire un message"
                fullWidth
                multiline
                rows={2}
                value={messageToSend}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSendMessage}>
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomerMessagesContent;
