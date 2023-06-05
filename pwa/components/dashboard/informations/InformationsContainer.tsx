import React, {useContext, useEffect, useState} from 'react';
import {repairerResource} from '@resources/repairerResource';
import {useAccount} from '@contexts/AuthContext';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Container,
} from '@mui/material';
import ContactDetails from '@components/dashboard/informations/ContactDetails';
import Description from '@components/dashboard/informations/Description';
import OptionalInfos from '@components/dashboard/informations/OptionalInfos';
import DashboardInfosPhotos from '@components/dashboard/informations/Photos';
import {RequestBody} from '@interfaces/Resource';
import {RepairerType} from '@interfaces/RepairerType';
import {Repairer} from '@interfaces/Repairer';
import {BikeType} from '@interfaces/BikeType';
import OpeningHours from '@components/dashboard/informations/OpeningHours';
import dynamic from 'next/dynamic';
const MapPosition = dynamic(
    () => import('@components/dashboard/informations/MapPosition'),
    {
        ssr: false,
    }
);

type InformationsContainerProps = {
    bikeTypes: BikeType[];
    repairerTypes: RepairerType[];
    repairerFetch: Repairer;
    fetchRepairer: () => Promise<void>
};

const InformationsContainer = ({bikeTypes , repairerTypes, repairerFetch, fetchRepairer}: InformationsContainerProps) => {

    const [repairer, setRepairer] = useState<Repairer>(repairerFetch);
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<boolean>(false);
    const [tabValue, setTabValue] = React.useState<number>(0);
    const {user} = useAccount({});

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const {
        name,
        setName,
        setDescription,
        street,
        setStreet,
        cityInput,
        setCityInput,
        city,
        pendingRegistration,
        setPendingRegistration,
        errorMessage,
        setErrorMessage,
        selectedBikeTypes,
        setOptionalPage,
        description,
        openingHours,
        optionalPage,
        mobilePhone,
        setOpeningHours,
        repairerTypeSelected,
        setRepairerTypeSelected,
        setSelectedBikeTypes,
        setMobilePhone,
    } = useContext(RepairerFormContext);


    useEffect(() => {
        if (repairer) {
            setLoading(false);
            setName(repairer.name ? repairer.name : '');
            setMobilePhone(repairer.mobilePhone ? repairer.mobilePhone : '');
            setDescription(repairer.description ? repairer.description : '');
            setStreet(repairer.street ? repairer.street : '');
            setCityInput(repairer.city ? repairer.city : '');
            setOptionalPage(repairer.optionalPage ? repairer.optionalPage : '');
            setOpeningHours(repairer.openingHours ? repairer.openingHours : '');
            setRepairerTypeSelected(
                repairer.repairerType ? repairer.repairerType : null
            );

            const bikeTypesSupported: string[] = [];
            repairer.bikeTypesSupported.map((bikeTypeSupported) => {
                bikeTypesSupported.push(bikeTypeSupported.name);
            });
            setSelectedBikeTypes(bikeTypesSupported);
        }
    }, [
        repairer,
        setDescription,
        setLoading,
        setName,
        setMobilePhone,
        setSelectedBikeTypes,
        setRepairerTypeSelected,
        setOpeningHours,
        setOptionalPage,
        setCityInput,
        setStreet,
    ]);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        if (!repairer) return;

        const selectedBikeTypeIRIs: string[] = bikeTypes
            .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
            .map((bikeType) => bikeType['@id']);

        const bodyRequest: RequestBody = {};

        if (mobilePhone) {
            bodyRequest['mobilePhone'] = mobilePhone;
        }

        if (name && name !== '') {
            bodyRequest['name'] = name;
        }

        if (street && street !== '') {
            bodyRequest['street'] = street;
        }

        if (description && description !== '') {
            bodyRequest['description'] = description;
        }

        if (repairerTypeSelected) {
            bodyRequest['repairerType'] = repairerTypeSelected['@id'];
        }

        if (selectedBikeTypeIRIs.length > 0) {
            bodyRequest['bikeTypesSupported'] = selectedBikeTypeIRIs;
        }

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

        await uploadRepairer(bodyRequest);
    };

    const uploadRepairer = async (bodyRequest: RequestBody) => {
        if (!repairer) {
            return;
        }
        setErrorMessage(null);
        setPendingRegistration(true);
        try {
            await repairerResource.put(repairer['@id'], bodyRequest);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            const repairerFetch: Repairer = await repairerResource.get(
                user!.repairer
            );
            setRepairer(repairerFetch);
        } catch (e) {
            setErrorMessage('Mise à jour impossible');
        }
        setPendingRegistration(false);
    };

    return (
        <Container component="main" sx={{ml: 0}}>
            <form onSubmit={handleSubmit}>
                <Tabs value={tabValue} onChange={handleChangeTab}>
                    <Tab label="Coordonnées" />
                    <Tab label="Description" />
                    <Tab label="Photos" />
                    <Tab label="Horaires" />
                    <Tab label="Informations complémentaires" />
                    <Tab label={`Position sur la carte`} />
                </Tabs>

                <Box sx={{marginTop: 3}}>
                    {loading && <CircularProgress />}
                    {!loading && !repairer && (
                        <Typography>
                            Vous ne gérez pas de solution de réparation
                        </Typography>
                    )}
                    {!loading && tabValue === 0 && (
                        <ContactDetails repairer={repairer} />
                    )}
                    {!loading && tabValue === 1 && (
                        <Description
                            repairer={repairer}
                            bikeTypes={bikeTypes}
                            repairerTypes={repairerTypes}
                        />
                    )}
                    {!loading && tabValue === 2 && (
                        <DashboardInfosPhotos
                            repairer={repairer}
                            fetchRepairer={fetchRepairer}
                        />
                    )}
                    {!loading && tabValue === 3 && (
                        <OpeningHours repairer={repairer} />
                    )}
                    {!loading && tabValue === 4 && (
                        <OptionalInfos repairer={repairer} />
                    )}
                    {!loading && tabValue === 5 && repairer && (
                        <MapPosition
                            repairer={repairer}
                            uploadRepairer={uploadRepairer}
                        />
                    )}
                </Box>

                {!loading && tabValue !== 2 && tabValue !== 5 && (
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
                    <Alert sx={{marginTop: '65px'}} severity="success">
                        Informations mises à jour
                    </Alert>
                )}
            </form>
        </Container>
    );
};

export default InformationsContainer;
