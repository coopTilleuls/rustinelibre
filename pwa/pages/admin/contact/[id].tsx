import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress, Typography} from '@mui/material';
import AdminLayout from "@components/admin/AdminLayout";
import {contactResource} from "@resources/ContactResource";
import {Contact} from "@interfaces/Contact";
import {formatDate} from "@helpers/dateHelper";

const ContactDetail: NextPageWithLayout = () => {

    const router = useRouter();
    const {id} = router.query;
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchContact = async () => {
        if (typeof id === 'string' && id.length > 0) {
            setLoading(true);
            const contactFetch: Contact = await contactResource.getById(id);
            setContact(contactFetch);
            setLoading(false);

            if (!contactFetch.alreadyRead) {
                await contactResource.put(contactFetch['@id'], {
                    alreadyRead: true
                });
            }
        }
    }

    useEffect(() => {
        fetchContact();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Consulter message</title>
            </Head>
            <AdminLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%'}}>
                {loading && <CircularProgress />}

                {contact && !loading &&
                    <Box>
                        Auteur : <strong>{contact.firstName} {contact.lastName}</strong><br />
                        Email : <strong>{contact.email}</strong><br />
                        Date : <strong>{formatDate(contact.createdAt, true)}</strong><br />
                        <Typography variant="body1" sx={{mt: 5}}>
                            {contact.content}
                        </Typography>
                </Box>}
            </Box>
        </>
    );
};

export default ContactDetail;
