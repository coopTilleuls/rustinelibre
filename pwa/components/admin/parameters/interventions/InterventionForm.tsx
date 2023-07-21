import React, {useState, useEffect, useContext, ChangeEvent} from 'react';
import Box from '@mui/material/Box';
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {useRouter} from 'next/router';
import {Intervention} from '@interfaces/Intervention';
import {interventionResource} from '@resources/interventionResource';
import {errorRegex} from '@utils/errorRegex';

type InterventionFormProps = {
  intervention: Intervention | null;
};

const InterventionForm = ({
  intervention,
}: InterventionFormProps): JSX.Element => {
  const router = useRouter();
  const [description, setDescription] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (intervention) {
      setDescription(intervention.description);
    }
  }, [intervention]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPending(true);

    try {
      if (intervention) {
        await interventionResource.put(intervention['@id'], {
          description: description,
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        await interventionResource.post({
          description: description,
          isAdmin: true,
        });
        router.push('/admin/parametres');
      }
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }

    setPending(false);
  };

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="description"
        label="Description"
        name="description"
        autoComplete="description"
        autoFocus
        value={description}
        inputProps={{maxLength: 180}}
        onChange={handleChangeDescription}
      />

      <Box display="flex" flexDirection="column" alignItems="center">
        <Button type="submit" variant="contained" sx={{my: 2}}>
          {pending && <CircularProgress sx={{color: 'white'}} />}
          {!pending && intervention && 'Modifier cette intervention'}
          {!pending && !intervention && 'Ajouter cette intervention'}
        </Button>
        {errorMessage && (
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}
      </Box>

      {success && (
        <Alert sx={{marginTop: '10px'}} severity="success">
          Intervention mis à jour
        </Alert>
      )}
    </Box>
  );
};

export default InterventionForm;
