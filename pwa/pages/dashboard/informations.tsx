import Head from "next/head";
import React, {useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import DashboardLayout from "@components/dashboard/DashboardLayout";
import {NextPageWithLayout} from "../_app";
import {Repairer} from "@interfaces/Repairer";
import {RepairerFormContext} from "@contexts/RepairerFormContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Alert, CircularProgress} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {repairerResource} from "@resources/repairerResource";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ContactDetails from "@components/dashboard/informations/ContactDetails";
import Description from "@components/dashboard/informations/Description";
import {useAccount} from "@contexts/AuthContext";
import {RequestBody} from "@interfaces/Resource";
import OptionalInfos from "@components/dashboard/informations/OptionalInfos";
import DashboardInfosPhotos from "@components/dashboard/informations/Photos";


const RepairerInformations: NextPageWithLayout = () => {

    const [repairer, setRepairer] = useState<Repairer|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<boolean>(false);
    const [tabValue, setTabValue] = React.useState<number>(0);
    const user = useAccount({});

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const {name, setName, setDescription,street, setStreet, cityInput, setCityInput, city,
        pendingRegistration, setPendingRegistration, errorMessage, setErrorMessage, bikeTypes, selectedBikeTypes,
        setOptionalPage, description, openingHours, optionalPage, mobilePhone, setOpeningHours, repairerTypeSelected, setRepairerTypeSelected, setSelectedBikeTypes, setMobilePhone} = useContext(RepairerFormContext);


    useEffect(() => {
        async function fetchRepairer() {
            if (user && user.repairer) {
                setLoading(true);
                const repairerFetch: Repairer = await repairerResource.get(user.repairer);
                setRepairer(repairerFetch);
            }
        }
        if (user) {
            fetchRepairer();
        }
    }, [user]);

    useEffect(() => {

        if (repairer) {
            setLoading(false);
            setName(repairer.name ? repairer.name : '');
            setMobilePhone(repairer.mobilePhone ? repairer.mobilePhone : '');
            setDescription(repairer.description ? repairer.description : '');
            setStreet(repairer.street ? repairer.street :'');
            setCityInput(repairer.city ? repairer.city : '');
            setOptionalPage(repairer.optionalPage ? repairer.optionalPage : '');
            setOpeningHours(repairer.openingHours ? repairer.openingHours : '');
            setRepairerTypeSelected(repairer.repairerType ? repairer.repairerType : null);

            const bikeTypesSupported: string[] = [];
            repairer.bikeTypesSupported.map(bikeTypeSupported => {
                bikeTypesSupported.push(bikeTypeSupported.name);
            })
            setSelectedBikeTypes(bikeTypesSupported);
        }
    }, [repairer, setDescription, setLoading, setName, setMobilePhone, setSelectedBikeTypes, setRepairerTypeSelected, setOpeningHours, setOptionalPage, setCityInput, setStreet]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!repairer || !name || !selectedBikeTypes || !repairerTypeSelected || !street || Object.keys(selectedBikeTypes).length === 0) {
            return;
        }

        setErrorMessage(null);
        setPendingRegistration(true);

        try {
            const selectedBikeTypeIRIs: string[] = bikeTypes
                .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
                .map((bikeType) => bikeType['@id']);

            const bodyRequest: RequestBody = {
                'mobilePhone': mobilePhone,
                'name': name,
                'street': street,
                'description': description,
                'bikeTypesSupported': selectedBikeTypeIRIs,
                'repairerType': repairerTypeSelected ? repairerTypeSelected['@id'] : null,
            };

            if (city) {
                bodyRequest['city'] = city.name;
                bodyRequest['postcode'] = city.postcode;
                bodyRequest['latitude'] = city.lat.toString();
                bodyRequest['longitude'] = city.lon.toString();
            }

            if (optionalPage && optionalPage !== '') {
                bodyRequest['optionalPage'] = optionalPage;
            }
            if (openingHours && openingHours !== '') {
                bodyRequest['openingHours'] = openingHours;
            }
            if (mobilePhone && mobilePhone !== '') {
                bodyRequest['mobilePhone'] = mobilePhone;
            }

            await repairerResource.put(repairer['@id'], bodyRequest)
        } catch (e) {
            setErrorMessage('Mise à jour impossible');
        } finally {
            setSuccess(true);
            setTimeout(() => {setSuccess(false);}, 2000);
        }

        setPendingRegistration(false);
    };

    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Informations</title>
            </Head>
            <DashboardLayout />
            <Box component="main" sx={{ marginLeft: '20%', marginTop: '100px' }}>
                <Container component="main" maxWidth="md">
                    <CssBaseline />
                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                marginTop: 8,
                            }}
                        >
                            <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                                <Tab label="Coordonnées" />
                                <Tab label="Description" />
                                <Tab label="Photos"  />
                                <Tab label="Horaires"  />
                            </Tabs>

                            <Box sx={{marginTop: 3}}>
                                {
                                    loading && <CircularProgress />
                                }
                                {
                                    !loading && !repairer && <Typography>Vous ne gérez pas de solution de réparation</Typography>
                                }
                                {
                                    !loading && tabValue === 0 && <ContactDetails repairer={repairer} />
                                }
                                {
                                    !loading && tabValue === 1 && <Description repairer={repairer} />
                                }
                                {
                                    !loading && tabValue === 2 && <DashboardInfosPhotos repairer={repairer} />
                                }
                                {
                                    !loading && tabValue === 3 && <OptionalInfos repairer={repairer} />
                                }
                            </Box>

                            {
                                !loading && tabValue !== 2 &&  <div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mt: 1, mb: 2 }}
                                    >
                                        {!pendingRegistration ? 'Enregistrer mes informations' : <CircularProgress size={20} />}
                                    </Button>
                                    {errorMessage && (
                                        <Typography variant="body1" color="error">
                                            {errorMessage}
                                        </Typography>
                                    )}
                                </div>
                            }

                            {success && <Alert severity="success">Informations mises à jour</Alert>}
                        </Box>
                    </form>
                </Container>
            </Box>
        </div>
    )
};

export default RepairerInformations;
