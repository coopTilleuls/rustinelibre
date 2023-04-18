import Head from "next/head";
import React, {ChangeEvent, SyntheticEvent, useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import DashboardLayout from "@components/dashboard/DashboardLayout";
import {useRouter} from "next/router";
import {NextPageWithLayout} from "../_app";
import {Repairer} from "@interfaces/Repairer";
import {RepairerFormContext} from "@contexts/RepairerFormContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import dynamic from 'next/dynamic';
import {repairerResource} from "@resources/repairerResource";
const Editor = dynamic(() => import("@components/form/Editor"), {
    ssr: false
});
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ContactDetails from "@components/dashboard/informations/ContactDetails";
import Description from "@components/dashboard/informations/Description";

const RepairerInformations: NextPageWithLayout = () => {

    const router = useRouter();
    const { id } = router.query;
    const [repairer, setRepairer] = useState<Repairer|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [tabValue, setTabValue] = React.useState<number>(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const {name, setName, description, setDescription,street, setStreet, cityInput, setCityInput, city, setCity, citiesList, setCitiesList,
        timeoutId, setTimeoutId, pendingRegistration, setPendingRegistration, errorMessage, setErrorMessage,
        repairerTypes, bikeTypes, selectedBikeTypes, setSelectedBikeTypes, optionalPage,
        setOptionalPage, openingHours, setOpeningHours, repairerTypeSelected, setRepairerTypeSelected} = useContext(RepairerFormContext);

    useEffect(() => {
        if (repairer) {
            setName(repairer.name ? repairer.name : '');
            setDescription(repairer.description ? repairer.description : '');
            setStreet(repairer.street ? repairer.street :'');
            setCityInput(repairer.city ? repairer.city : '');
            setOptionalPage(repairer.optionalPage ? repairer.optionalPage : '');
            setOpeningHours(repairer.openingHours ? repairer.openingHours : '');
        }
    }, [repairer]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        if (!repairer || !repairerTypeSelected || !street || !city || Object.keys(selectedBikeTypes).length === 0) {
            return;
        }

        setErrorMessage(null);
        setPendingRegistration(true);

        // Create a new repairer and an user
        try {
            const selectedBikeTypeIRIs: string[] = bikeTypes
                .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
                .map((bikeType) => bikeType['@id']);

            await repairerResource.put(repairer['@id'],{
                'name': name,
                'street': street,
                'city': city.name,
                'postcode': city?.postcode,
                'bikeTypesSupported': selectedBikeTypeIRIs,
                'repairerType': repairerTypeSelected ? repairerTypeSelected['@id'] : null,
            })
        } catch (e) {
            setErrorMessage('Inscription impossible');
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


                        {
                            tabValue === 0 && <ContactDetails repairer={repairer} />
                        }

                        {
                            tabValue === 1 && <Description repairer={repairer} />
                        }

                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {!pendingRegistration ? 'Enregistrer mes informations' : <CircularProgress size={20} />}
                        </Button>
                        {errorMessage && (
                            <Typography variant="body1" color="error">
                                {errorMessage}
                            </Typography>
                        )}
                    </Box>
                </Container>
            </Box>
        </div>
    )
};

export default RepairerInformations;
