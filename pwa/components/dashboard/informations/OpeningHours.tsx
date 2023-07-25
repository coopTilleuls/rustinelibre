import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {Repairer} from '@interfaces/Repairer';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  Typography,
} from '@mui/material';
import {RequestBody} from '@interfaces/Resource';
import {errorRegex} from '@utils/errorRegex';
const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});

interface OpeningHoursProps {
  repairer: Repairer | null;
  // eslint-disable-next-line no-unused-vars
  updateRepairer: (iri: string, bodyRequest: RequestBody) => Promise<void>;
}

export const OpeningHours = ({
  repairer,
  updateRepairer,
}: OpeningHoursProps): JSX.Element => {
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [openingHours, setOpeningHours] = useState<string>('');

  useEffect(() => {
    if (repairer) {
      setOpeningHours(repairer.openingHours ?? '');
    }
  }, [repairer, setOpeningHours]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!repairer) return;
    try {
      setPendingRegistration(true);
      const iri = repairer['@id'];
      const body = {openingHours: openingHours};
      await updateRepairer(iri, body);
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
    <Box mt={3} component="form" onSubmit={handleSubmit}>
      {repairer && (
        <>
          <InputLabel sx={{mb: -2, ml: 1}}>
            Horaires d&apos;ouverture
          </InputLabel>
          <Editor content={openingHours} setContent={setOpeningHours} />
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

          {success && (
            <Alert severity="success">Informations mises à jour</Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default OpeningHours;
