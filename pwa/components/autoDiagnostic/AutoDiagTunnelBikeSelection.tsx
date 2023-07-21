import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {bikeResource} from '@resources/bikeResource';
import {appointmentResource} from '@resources/appointmentResource';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {useAccount} from '@contexts/AuthContext';
import {
  Box,
  Stack,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import ModalAddBike from '@components/bike/ModalAddBike';
import useBikeTypes from '@hooks/useBikeTypes';
import {Bike} from '@interfaces/Bike';

export const AutoDiagTunnelBikeSelection = (): JSX.Element => {
  const {appointment, setTunnelStep} = useContext(AutodiagContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingUpdateBike, setPendingUpdateBike] = useState<boolean>(false);
  const [pendingUpdateBikeType, setPendingUpdateBikeType] =
    useState<boolean>(false);
  const bikeTypes = useBikeTypes();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [bikeSelected, setBikeSelected] = useState<string | null>(null);
  const [bikeTypeSelected, setBikeTypeSelected] = useState<string | null>(null);
  const {user} = useAccount({redirectIfNotFound: '/login'});
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchBikes();
  };
  const fetchBikes = async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    const bikesFetched = await bikeResource.getAll(true, {
      owner: user.id,
      'order[id]': 'DESC',
    });
    setBikes(bikesFetched['hydra:member']);
    if (bikesFetched['hydra:member'].length > 0) {
      setBikeSelected(bikesFetched['hydra:member'][0]['@id']);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBikes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (bikeTypes.length > 0) {
      setBikeTypeSelected(bikeTypes[0]['@id']);
    }
  }, [bikeTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeBike = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeSelected(event.target.value);
  };

  const handleChangeBikeType = (event: ChangeEvent<HTMLInputElement>) => {
    setBikeTypeSelected(event.target.value);
  };

  const handleClickNext = async () => {
    if (!appointment || !bikeSelected) {
      return;
    }
    setPendingUpdateBike(true);
    await appointmentResource.put(appointment['@id'], {
      bike: bikeSelected,
    });
    setPendingUpdateBike(false);
    setTunnelStep('choice');
  };

  const handleClickContinueNoRegister = async () => {
    if (!appointment || !bikeTypeSelected) {
      return;
    }
    setPendingUpdateBikeType(true);
    await appointmentResource.put(appointment['@id'], {
      bikeType: bikeTypeSelected,
    });
    setPendingUpdateBikeType(false);
    setTunnelStep('choice');
  };

  return (
    <Stack
      width={{xs: '100%', sm: '65%', md: '50%'}}
      py={2}
      mx="auto"
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems={'center'}>
      {loading && <CircularProgress />}
      {!loading && bikes.length > 0 && (
        <Box sx={{width: '100%'}}>
          <FormControl fullWidth>
            <FormLabel sx={{textAlign: 'center'}}>
              <strong>Pour quel vélo souhaitez-vous prendre rdv ?</strong>
            </FormLabel>
            <RadioGroup
              sx={{pl: 1, mt: 4}}
              name="select_my_bike"
              value={bikeSelected}
              onChange={handleChangeBike}>
              {bikes.map((bike) => {
                return (
                  <FormControlLabel
                    key={bike.id}
                    value={bike['@id']}
                    control={<Radio />}
                    label={bike.name}
                    sx={{
                      mb: 1,
                      mr: 0,
                      border: (theme) => `2px solid ${theme.palette.grey[300]}`,
                      borderRadius: 1,
                    }}
                  />
                );
              })}
              <FormControlLabel
                key="other_bike"
                value="other_bike"
                control={<Radio />}
                label="Pour un autre vélo"
                sx={{
                  mb: 1,
                  mr: 0,
                  border: (theme) => `2px solid ${theme.palette.grey[300]}`,
                  borderRadius: 1,
                }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      )}
      {!loading && bikeSelected !== 'other_bike' && (
        <Box>
          <Button
            variant="contained"
            onClick={handleClickNext}
            sx={{textTransform: 'capitalize'}}>
            {pendingUpdateBike ? <CircularProgress /> : 'Suivant'}
          </Button>
        </Box>
      )}
      {(bikeSelected === 'other_bike' || (!loading && bikes.length === 0)) && (
        <>
          <Box sx={{width: '100%'}}>
            <FormControl fullWidth>
              <FormLabel>Précisez le type de vélo</FormLabel>
              <RadioGroup
                sx={{width: '100%', pl: 1}}
                name="select_my_bike_type"
                value={bikeTypeSelected}
                onChange={handleChangeBikeType}>
                {bikeTypes.map((bikeType) => {
                  return (
                    <FormControlLabel
                      key={bikeType.id}
                      value={bikeType['@id']}
                      control={<Radio />}
                      label={bikeType.name}
                      sx={{
                        mb: 1,
                        mr: 0,
                        border: (theme) =>
                          `2px solid ${theme.palette.grey[300]}`,
                        borderRadius: 1,
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Box>
          <Box mt={3} width="100%">
            <FormLabel>Souhaitez-vous enregistrer ce vélo ?</FormLabel>
            <Box display="flex" justifyContent="center" pl={1}>
              <FormControlLabel
                onClick={() => setOpenModal(true)}
                control={<Radio />}
                label="Oui"
                sx={{
                  width: '50%',
                  mb: 1,
                  border: (theme) => `2px solid ${theme.palette.grey[300]}`,
                  borderRadius: 1,
                }}
              />
              <FormControlLabel
                onClick={handleClickContinueNoRegister}
                control={<Radio />}
                label="Non"
                sx={{
                  width: '50%',
                  mb: 1,
                  mr: 0,
                  border: (theme) => `2px solid ${theme.palette.grey[300]}`,
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        </>
      )}
      <ModalAddBike
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        bikeTypes={[]}
        bikeTypeSelectedProps={bikeTypeSelected}
      />
    </Stack>
  );
};

export default AutoDiagTunnelBikeSelection;
