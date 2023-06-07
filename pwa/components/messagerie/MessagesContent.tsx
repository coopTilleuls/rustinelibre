import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import Box from '@mui/material/Box';
import {Maintenance} from "@interfaces/Maintenance";
import {maintenanceResource} from "@resources/MaintenanceResource";
import {Bike} from "@interfaces/Bike";
import {Discussion} from "@interfaces/Discussion";
import {DiscussionMessage} from "@interfaces/DiscussionMessage";
import {discussionMessageResource} from "@resources/discussionMessageResource";
import {Container, Paper, TextField, Button, CircularProgress} from '@mui/material';
import {useAccount} from "@contexts/AuthContext";

type MessagesContentProps = {
    discussion: Discussion;
    bottomPosition?: number;
};

const MessagesContent = ({discussion, bottomPosition = 5}: MessagesContentProps): JSX.Element => {

    const messagesEndRef = useRef(null);
    const {user} = useAccount({});
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<DiscussionMessage[]>([]);
    const [messageToSend, setMessageToSend] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessageToSend(event.target.value);
    };

    const handleSendMessage = async(): Promise<void> => {
        if (!messageToSend) {
            return;
        }

        setCurrentPage(1);
        await discussionMessageResource.post({
            content: messageToSend,
            discussion: discussion['@id'],
        })
        await fetchMessages();
        setMessageToSend('');
    };

    const handleKeyDown = (event: any) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const fetchMessages = async () => {
        const response = await discussionMessageResource.getAll(true, {
            discussion: discussion['@id'],
            page: currentPage
        });

        if (currentPage === 1) {
            setMessages(response['hydra:member']);
        } else {
            const messagesToDisplay: DiscussionMessage[] = messages;
            response['hydra:member'].map(oldMessage => {
                messagesToDisplay.push(oldMessage);
            })
            setMessages(messagesToDisplay);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchMessages();
        setLoading(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchMessages();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box sx={{maxWidth: '100%'}}>

            {loading && <CircularProgress />}

            {!loading && user && <Box sx={{
                position: 'fixed',
                right: 50,
                top: 100,
                height: 'calc(100vh - 350px)',
                // height: '200px',
                overflowY: 'scroll'
            }}>
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            marginBottom: '0.5rem',
                            textAlign: msg.sender.id === user.id ? 'right' : 'left',
                            float: msg.sender.id === user.id ? 'right' : 'left',
                            color: msg.sender.id === user.id ? 'white' : 'black',
                            backgroundColor: msg.sender.id === user.id ? 'primary.main' : 'lightgrey',
                            padding: '10px',
                            minWidth: '60%',
                            borderRadius: '10px',
                            // position: 'relative',
                            // bottom: '10px'
                        }}
                    >
                        {msg.content}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>}

            <Box>
                <Paper sx={{
                    padding: '1rem',
                    position: 'fixed',
                    right: 5,
                    bottom: bottomPosition,
                    width: '80%',
                    zIndex: 10,
                }}>
                    <TextField
                        label="Message"
                        fullWidth
                        multiline
                        rows={4}
                        value={messageToSend}
                        onChange={handleMessageChange}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: '1rem' }}
                        onClick={handleSendMessage}
                    >
                        Envoyer
                    </Button>
                </Paper>
            </Box>

        </Box>
    )
}

export default MessagesContent;
