import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import AdminLayout from '@components/admin/AdminLayout';
import {Contact} from '@interfaces/Contact';
import {contactResource} from '@resources/ContactResource';
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const Contact = (): JSX.Element => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchContacts = async () => {
    setLoading(true);
    const contactFetched = await contactResource.getAll(true, {
      'order[createdAt]': 'DESC',
    });
    setContacts(contactFetched['hydra:member']);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteClick = async (contact: Contact) => {
    setLoading(true);
    await contactResource.delete(contact['@id']);
    await fetchContacts();
  };

  return (
    <>
      <Head>
        <title>Messages reçus</title>
      </Head>
      <AdminLayout>
        <Box component="main">
          <TableContainer
            elevation={4}
            component={Paper}
            sx={{marginTop: '10px'}}>
            <Table aria-label="employees">
              <TableHead
                sx={{
                  '& th': {
                    fontWeight: 'bold',
                    color: 'primary.main',
                  },
                }}>
                <TableRow>
                  <TableCell align="left">Nom</TableCell>
                  <TableCell align="center">Prénom</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Contenu</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && <CircularProgress sx={{ml: 5, mt: 5}} />}
                {!loading &&
                  contacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      sx={{
                        '&:last-child td, &:last-child th': {border: 0},
                        backgroundColor: contact.alreadyRead
                          ? 'lightgrey'
                          : 'white',
                      }}>
                      <TableCell align="left" component="th" scope="row">
                        {contact.lastName}
                      </TableCell>
                      <TableCell align="center">{contact.firstName}</TableCell>
                      <TableCell align="center">{contact.email}</TableCell>
                      <TableCell align="center">
                        {contact.content.substring(0, 20)} ...
                      </TableCell>
                      <TableCell align="right">
                        {formatDate(contact.createdAt, true)}
                      </TableCell>
                      <TableCell align="right">
                        <Link href={`/admin/contact/${contact.id}`}>
                          <RemoveRedEyeIcon
                            sx={{
                              color: '#8c83ba',
                              fontSize: '2em',
                              cursor: 'pointer',
                            }}
                          />
                        </Link>
                        <DeleteIcon
                          onClick={() => handleDeleteClick(contact)}
                          sx={{
                            color: '#8c83ba',
                            fontSize: '2em',
                            cursor: 'pointer',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </AdminLayout>
    </>
  );
};

export default Contact;
