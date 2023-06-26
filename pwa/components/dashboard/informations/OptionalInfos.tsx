import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {InputLabel, Box, Button, CircularProgress, Typography, Alert} from '@mui/material';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});
import {Repairer} from '@interfaces/Repairer';
import {RequestBody} from "@interfaces/Resource";

interface OptionnalInfosProps {
  repairer: Repairer | null;
  updateRepairer: (iri : string, body : RequestBody) => Promise<void>;
}

export const OptionalInfos = ({repairer, updateRepairer}: OptionnalInfosProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    optionalPage,
    errorMessage,
    success,
    pendingRegistration,
    setOptionalPage
  } = useContext(RepairerFormContext);

  useEffect(() => {
    if (repairer) {
      setOptionalPage(repairer.optionalPage ?? '');
    }
  }, [repairer, setOptionalPage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!repairer) return;
    const requestBody: RequestBody = {};

    if (optionalPage) requestBody['optionalPage'] = optionalPage;

    await updateRepairer(repairer['@id'], requestBody)
  };

  return (
      <form onSubmit={handleSubmit}>
        <Box sx={{marginTop: 3}}>
          <InputLabel sx={{mt: 4, mb: -2, ml: 1}}>
            Informations complémentaires (page visible avant la prise de rendez
            vous)
          </InputLabel>
          <Editor content={optionalPage} setContent={setOptionalPage} />

          {!loading && (
              <div>
                <Button type="submit" variant="contained" sx={{my: 2}}>
                  {!pendingRegistration ? (
                      'Enregistrer mes informations'
                  ) : (
                      <CircularProgress size={20} sx={{color: 'white'}} />
                  )}
                </Button>
              </div>
          )}

          {!loading && errorMessage && (
              <Typography variant="body1" color="error">
                {errorMessage}
              </Typography>
          )}

          {success && (
              <Alert severity="success">
                Informations mises à jour
              </Alert>
          )}
        </Box>
      </form>
  );
};

export default OptionalInfos;
