import React, {useState, useEffect, ChangeEvent} from 'react';
import Box from '@mui/material/Box';
import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import {useRouter} from 'next/router';
import {RepairerType} from '@interfaces/RepairerType';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {errorRegex} from '@utils/errorRegex';

type RepairerTypeFormProps = {
  repairerType: RepairerType | null;
};

const RepairerTypeForm = ({
  repairerType,
}: RepairerTypeFormProps): JSX.Element => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (repairerType) {
      setName(repairerType.name);
    }
  }, [repairerType]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPending(true);

    try {
      if (repairerType) {
        await repairerTypeResource.put(repairerType['@id'], {
          name: name,
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        await repairerTypeResource.post({
          name: name,
        });
        router.push('/admin/parametres');
      }
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }

    setPending(false);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Nom"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        inputProps={{maxLength: 180}}
        onChange={handleChangeName}
      />

      <Box display="flex" flexDirection="column" alignItems="center">
        <Button type="submit" variant="contained" sx={{my: 2}}>
          {pending && <CircularProgress sx={{color: 'white'}} />}
          {!pending && repairerType && 'Modifier le nom'}
          {!pending && !repairerType && 'Ajouter ce type de réparateur'}
        </Button>
        {errorMessage && (
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}
      </Box>

      {success && (
        <Alert sx={{marginTop: '10px'}} severity="success">
          Type de réparateur mis à jour
        </Alert>
      )}
    </Box>
  );
};

export default RepairerTypeForm;
