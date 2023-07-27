import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {Alert, Button, CircularProgress, Typography} from '@mui/material';
import {User} from '@interfaces/User';
import {userResource} from '@resources/userResource';
import AdminLayout from '@components/admin/AdminLayout';
import {RequestBody} from '@interfaces/Resource';
import {UserFormContext} from '@contexts/UserFormContext';
import UserForm from '@components/form/UserForm';
import {errorRegex} from '@utils/errorRegex';
import {isAdmin} from '@helpers/rolesHelpers';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

const EditUser: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roleAdmin, setRoleAdmin] = useState<boolean>(false);
  const {firstName, lastName, passwordError, city, street} =
    useContext(UserFormContext);

  useEffect(() => {
    async function fetchUser() {
      if (typeof id === 'string' && id.length > 0) {
        setLoading(true);
        const userFetch: User = await userResource.getById(id);
        setUser(userFetch);
        setRoleAdmin(isAdmin(userFetch));
        setLoading(false);
      }
    }
    if (id) {
      fetchUser();
    }
  }, [id]);

  const updateUser = async (): Promise<void> => {
    if (!firstName || !lastName || !user) {
      return;
    }

    setErrorMessage(null);
    setPendingUpdate(true);

    try {
      const bodyRequest: RequestBody = {
        firstName: firstName,
        lastName: lastName,
        city: city,
        street: street,
      };

      if (roleAdmin) {
        bodyRequest.roles = ['ROLE_ADMIN'];
      } else {
        bodyRequest.roles = ['ROLE_USER'];
      }

      await userResource.putById(user.id, bodyRequest);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }

    setPendingUpdate(false);
  };

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleAdmin(event.target.checked);
  };

  return (
    <>
      <Head>
        <title>Éditer un utilisateur</title>
      </Head>
      <AdminLayout />
      <Box component="main" sx={{marginLeft: '20%', marginRight: '5%'}}>
        {loading ? <CircularProgress /> : <UserForm user={user} />}

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={roleAdmin}
                onChange={handleChangeRole}
                inputProps={{'aria-label': 'controlled'}}
              />
            }
            label="SUPER ADMIN (va remplacer tous les autres rôles)"
          />
        </FormGroup>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          onClick={updateUser}
          fullWidth
          variant="contained"
          sx={{mt: 3, mb: 2, width: '50%'}}>
          {!pendingUpdate ? (
            'Enregistrer'
          ) : (
            <CircularProgress size={20} sx={{color: 'white'}} />
          )}
        </Button>

        {errorMessage && (
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}
        {success && (
          <Alert sx={{width: '50%', marginLeft: '5%'}} severity="success">
            Utilisateur mis à jour
          </Alert>
        )}
      </Box>
    </>
  );
};

export default EditUser;
