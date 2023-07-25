import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {
  InputLabel,
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import {RequestBody} from '@interfaces/Resource';
import {errorRegex} from '@utils/errorRegex';
const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});

interface OptionnalInfosProps {
  repairer: Repairer | null;
  // eslint-disable-next-line no-unused-vars
  updateRepairer: (iri: string, bodyRequest: RequestBody) => Promise<void>;
}

export const OptionalInfos = ({
  repairer,
  updateRepairer,
}: OptionnalInfosProps): JSX.Element => {
  const [optionalPage, setOptionalPage] = useState<string>('');
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (repairer) {
      setOptionalPage(repairer.optionalPage ?? '');
    }
  }, [repairer, setOptionalPage]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!repairer) return;
    try {
      setPendingRegistration(true);
      await updateRepairer(repairer['@id'], {
        optionalPage: optionalPage,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e: any) {
      setErrorMessage(
        `Mise à jour impossible : ${e.message?.replace(errorRegex, '$2')}`
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setPendingRegistration(false);
  };

  return (
    <Box sx={{marginTop: 3}} component="form" onSubmit={handleSubmit}>
      <InputLabel sx={{mt: 4, mb: -2, ml: 1}}>
        Informations complémentaires (page visible avant la prise de rendez
        vous)
      </InputLabel>
      <Editor content={optionalPage} setContent={setOptionalPage} />
      <Button type="submit" variant="contained" sx={{my: 2}}>
        {!pendingRegistration ? (
          'Enregistrer les informations'
        ) : (
          <CircularProgress size={20} sx={{color: 'white'}} />
        )}
      </Button>

      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      {success && <Alert severity="success">Informations mises à jour</Alert>}
    </Box>
  );
};

export default OptionalInfos;
