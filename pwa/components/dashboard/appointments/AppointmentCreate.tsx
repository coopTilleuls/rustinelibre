import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    TextField, Autocomplete, FormControl, InputLabel, MenuItem, Button, Stack, Typography, Alert,
} from '@mui/material';
import {customerResource} from "@resources/customerResource";
import Box from "@mui/material/Box";

import {Customer} from "@interfaces/Customer";

import {User} from "@interfaces/User";
import {Bike} from "@interfaces/Bike";
import {bikeResource} from "@resources/bikeResource";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import SlotsStep from "@components/rendez-vous/SlotsStep";
import {appointmentResource} from "@resources/appointmentResource";
import {useAccount} from "@contexts/AuthContext";
import {RequestBody} from "@interfaces/Resource";
import {Repairer} from "@interfaces/Repairer";
import {RepairerEmployee} from "@interfaces/RepairerEmployee";
import {formatDate} from "@helpers/dateHelper";


export const AppointmentCreate = (): JSX.Element => {

    const {user} = useAccount({});
    const [repairerEmployee, setRepairerEmployee] = useState<RepairerEmployee | null>(null)
    const [repairer, setRepairer] = useState<Repairer>()
    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerInput, setCustomerInput] = useState<string>('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [customerBikes, setCustomerBikes] = useState<Bike[]> ([])
    const [selectedBike, setSelectedBike] = useState<Bike | null>(null)
    const [tunnelStep, setTunnelStep] = useState<string>('');
    const [slotSelected, setSlotSelected] = useState<string | null>(null);
    const [date, setDate] = useState<string>('');

    const fetchCustomers = async () => {
        setLoadingList(true);
        const response = await customerResource.getAll(true, {
            userSearch: customerInput
        });
        setCustomers(response['hydra:member']);
        setLoadingList(false);
    };

    useEffect(() => {
        if (user) {
            if(user === repairerEmployee?.employee  ){
                setRepairer(repairerEmployee.repairer)
            }
            setRepairer(user.repairer)
        }
    }
        , [user, setRepairer]);

    useEffect(() => {
        if (customerInput.length >= 2) {
            fetchCustomers();
        }
    }, [customerInput]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCustomerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerInput(event.target.value);
    };

    const handleCustomerChange = async (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): Promise<void> => {
        setTunnelStep('')
        setCustomerInput(event.target.value);
    };

    const handleSelectCustomer = async (customer: Customer) =>{
        setSelectedCustomer(customer);
        await handleGetCustomerBikes(customer);
        setTunnelStep('bikes');
    }

    const handleGetCustomerBikes = async (customer : Customer)=>{
            const response = await bikeResource.getAll(true, {
                owner: customer.id,
            });
            if(response['hydra:member'].length === 0){
                setTunnelStep('slots')
            }
            setCustomerBikes(response['hydra:member'])
    }

    const handleSelectBike = async (event: SelectChangeEvent) =>{
        const selectedBike = customerBikes?.find(
            (b) => b.name === event.target.value
        );
        setSelectedBike(selectedBike ? selectedBike : null);
        setTunnelStep('slots')
    }

    const handleSelectSlot = (day: string, time: string): void => {
        setSlotSelected(day + 'T' + time + ':00.000Z');
        if (!slotSelected) {
            console.log('here')
            return;
        }
        setDate(new Date(slotSelected).toLocaleString('fr-FR', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }));
        setTunnelStep('confirm');
    };

    console.log(formatDate(slotSelected));

    const handleConfirmAppointment = async () => {
        if (!user || !repairer || !selectedCustomer || !slotSelected) {
            return;
        }
        console.log(tunnelStep);

        const requestBody: RequestBody = {
            repairer: repairer['@id'],
            slotTime: slotSelected,
            customer: selectedCustomer['@id']
        };

        if (selectedBike) {
            requestBody['bike'] = selectedBike['@id']
        }

        const newAppointment = await appointmentResource.post(requestBody);

        if (newAppointment) {
            await appointmentResource.updateAppointmentStatus(newAppointment.id, {
                'transition': 'validated_by_repairer'
            })
            setTunnelStep('success')
        }
        setTimeout(()=>{
            setTunnelStep('')
        }, 5000)
    };

    return (
        <><Box>
            <Box>
            <Autocomplete
                sx={{mt: 2, mb: 1}}
                freeSolo
                value={customerInput}
                options={customers}
                getOptionLabel={(customer) =>
                    typeof customer === 'string'
                        ? customer
                        : `${customer.firstName} ${customer.lastName} (${customer.email})`
                }
                onChange={(event, value) => handleSelectCustomer(value as User)}
                renderInput={(params) => (
                    <TextField
                        label="Client"
                        required
                        {...params}
                        value={customerInput}
                        onChange={(e) => handleCustomerChange(e)}
                    />
                )}
            />
            </Box>

            {selectedCustomer && customerBikes.length > 0 && (tunnelStep == 'bikes') &&
                <Box width={{xs: '100%', md: '50%'}}>
                    <FormControl required fullWidth size="small">
                        <InputLabel id="bikeType-label">Vélo concerné par la réparation</InputLabel>
                        <Select
                            label="Vélo concerné"
                            value={selectedBike? selectedBike.name : ''}
                            onChange={handleSelectBike}>
                            {customerBikes?.map((bike) => (
                                <MenuItem key={bike.id} value={bike.name}>
                                    {bike.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            }

            {user && repairer && (tunnelStep == 'slots') &&(
                <SlotsStep
                    handleSelectSlot={handleSelectSlot}
                    repairer={repairer}
                />
            )}

            {user && tunnelStep == 'confirm' && selectedCustomer && (
                <Stack
                    spacing={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center">
                    <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
                        Récapitulatif
                    </Typography>
                    <Typography align="justify" sx={{mt: 2}}>
                        {`Rendez-vous le ${date} avec ${selectedCustomer.firstName} ${selectedCustomer.lastName} `}
                    </Typography>

                    <Box>
                        <Button onClick={handleConfirmAppointment} variant="contained">
                            Confirmer le rendez-vous
                        </Button>
                    </Box>
                </Stack>
            )}

            {tunnelStep == 'success' && (
                <Alert sx={{width: '100%'}} severity="success" >
                    Rendez-vous créé avec succès
                </Alert>
            )}

        </Box></>
);
};

export default AppointmentCreate;
