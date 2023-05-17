import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {Box, Stack, Button, Typography, CircularProgress} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {Bike} from "@interfaces/Bike";
import {bikeResource} from "@resources/bikeResource";
import {useAccount} from "@contexts/AuthContext";
import ModalAddBike from "@components/bike/ModalAddBike";
import useBikeTypes from "@hooks/useBikeTypes";
import {appointmentResource} from "@resources/appointmentResource";

export const AutoDiagTunnelBikeSelection = (): JSX.Element => {
    const {appointment, setTunnelStep} = useContext(AutodiagContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [pendingUpdateBike, setPendingUpdateBike] = useState<boolean>(false);
    const [pendingUpdateBikeType, setPendingUpdateBikeType] = useState<boolean>(false);
    const bikeTypes = useBikeTypes();
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [bikeSelected, setBikeSelected] = useState<string|null>(null);
    const [bikeTypeSelected, setBikeTypeSelected] = useState<string|null>(null);
    const {user} = useAccount({redirectIfNotFound: '/login'});
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleOpenModal = () => setOpenModal(true);

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
            'order[id]' : 'DESC'
        });
        setBikes(bikesFetched['hydra:member']);
        if (bikesFetched["hydra:member"].length > 0) {
            setBikeSelected(bikesFetched["hydra:member"][0]['@id'])
        }
        setLoading(false);
    }

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

    const handleClickNext = async() => {
        if (!appointment || !bikeSelected) {
            return;
        }
        setPendingUpdateBike(true);
        await appointmentResource.put(appointment['@id'], {
            bike: bikeSelected
        });
        setPendingUpdateBike(false);
        setTunnelStep('choice');
    }

    const handleClickContinueNoRegister = async() => {
        if (!appointment || !bikeTypeSelected) {
            return;
        }
        setPendingUpdateBikeType(true);
        await appointmentResource.put(appointment['@id'], {
            bikeType: bikeTypeSelected
        });
        setPendingUpdateBikeType(false);
        setTunnelStep('choice');
    }

    return (
        <Stack
            spacing={4}
            display="flex"
            flexDirection="column"
            alignItems="center">
            <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
                Préciser le type de vélo
            </Typography>
            <Box>
                {loading && <CircularProgress />}
                {!loading && bikes.length > 0 &&
                    <FormControl>
                        <RadioGroup
                            name="select_my_bike"
                            value={bikeSelected}
                            onChange={handleChangeBike}
                        >
                            {bikes.map(bike => {
                                return <FormControlLabel key={bike.id} value={bike['@id']} control={<Radio />} label={bike.name} />
                            })}
                            <FormControlLabel key="other_bike" value="other_bike" control={<Radio />} label="Pour un autre vélo" />
                        </RadioGroup>
                    </FormControl>
                }
            </Box>
            {!loading && bikeSelected !== 'other_bike' &&
                <Box>
                    <Button variant="outlined" onClick={handleClickNext}>
                        {pendingUpdateBike ? <CircularProgress /> : 'Suivant'}
                    </Button>
                </Box>
            }
            {
                (bikeSelected === 'other_bike' || (!loading && bikes.length === 0)) &&
                <Box sx={{textAlign: 'center'}}>
                    <FormControl>
                        <FormLabel>
                            Précisez le type de vélo
                        </FormLabel>
                        <RadioGroup
                            name="select_my_bike_type"
                            value={bikeTypeSelected}
                            onChange={handleChangeBikeType}
                        >
                            {
                                bikeTypes.map(bikeType => {
                                    return <FormControlLabel key={bikeType.id} value={bikeType['@id']} control={<Radio />} label={bikeType.name} />
                                })
                            }
                        </RadioGroup>
                    </FormControl>
                    <Box sx={{marginTop: '30px'}}>
                        <Button variant="contained" onClick={handleOpenModal}>
                            Enregistrer ce vélo
                        </Button>
                        <Button variant="outlined" onClick={handleClickContinueNoRegister}>
                            {pendingUpdateBikeType ? <CircularProgress /> : 'Continuer sans enregistrer'}
                        </Button>
                    </Box>
                </Box>
            }

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
