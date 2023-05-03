import Head from 'next/head';
import React, {useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {NextPageWithLayout} from '../_app';
import {Repairer} from '@interfaces/Repairer';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Alert, CircularProgress} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {repairerResource} from '@resources/repairerResource';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ContactDetails from '@components/dashboard/informations/ContactDetails';
import Description from '@components/dashboard/informations/Description';
import {useAccount} from '@contexts/AuthContext';
import {RequestBody} from '@interfaces/Resource';
import OptionalInfos from '@components/dashboard/informations/OptionalInfos';
import DashboardInfosPhotos from '@components/dashboard/informations/Photos';
import {GetStaticProps} from 'next';
import {ENTRYPOINT} from '@config/entrypoint';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {BikeType} from '@interfaces/BikeType';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {RepairerType} from '@interfaces/RepairerType';

type RepairerInformationsProps = {
  bikeTypesFetched: BikeType[];
  repairerTypesFetched: RepairerType[];
};

const RepairerInformations: NextPageWithLayout<RepairerInformationsProps> = ({
  bikeTypesFetched = [],
  repairerTypesFetched = [],
}) => {
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const {user} = useAccount({});
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>(repairerTypesFetched);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  async function fetchRepairerTypes() {
    const responseRepairerTypes = await repairerTypeResource.getAll(false);
    setRepairerTypes(responseRepairerTypes['hydra:member']);
  }

  useEffect(() => {
    if (repairerTypes.length == 0) {
      fetchRepairerTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchBikeTypes() {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  }

  useEffect(() => {
    if (bikeTypes.length == 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    async function fetchRepairer() {
      if (user && user.repairer) {
        setLoading(true);
        const repairerFetch: Repairer = await repairerResource.get(
          user.repairer
        );
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
    if (
      !repairer ||
      !name ||
      !selectedBikeTypes ||
      !repairerTypeSelected ||
      !street ||
      Object.keys(selectedBikeTypes).length === 0
    ) {
      return;
    }

    setErrorMessage(null);
    setPendingRegistration(true);

    try {
      const selectedBikeTypeIRIs: string[] = bikeTypes
        .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
        .map((bikeType) => bikeType['@id']);

      const bodyRequest: RequestBody = {
        mobilePhone: mobilePhone,
        name: name,
        street: street,
        description: description,
        bikeTypesSupported: selectedBikeTypeIRIs,
        repairerType: repairerTypeSelected ? repairerTypeSelected['@id'] : null,
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

      await repairerResource.put(repairer['@id'], bodyRequest);
    } catch (e) {
      setErrorMessage('Mise à jour impossible');
    } finally {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }

    setPendingRegistration(false);
  };

  return (
    <>
      <Head>
        <title>Informations</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          <Container component="main" maxWidth="md">
            <CssBaseline />
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  marginTop: 8,
                }}>
                <Tabs
                  value={tabValue}
                  onChange={handleChangeTab}
                  aria-label="basic tabs example">
                  <Tab label="Coordonnées" />
                  <Tab label="Description" />
                  <Tab label="Photos" />
                  <Tab label="Horaires" />
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
                    <DashboardInfosPhotos repairer={repairer} />
                  )}
                  {!loading && tabValue === 3 && (
                    <OptionalInfos repairer={repairer} />
                  )}
                </Box>

                {!loading && tabValue !== 2 && (
                  <div>
                    <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      sx={{mt: 1, mb: 2}}>
                      {!pendingRegistration ? (
                        'Enregistrer mes informations'
                      ) : (
                        <CircularProgress size={20} />
                      )}
                    </Button>
                    {errorMessage && (
                      <Typography variant="body1" color="error">
                        {errorMessage}
                      </Typography>
                    )}
                  </div>
                )}
                {success && (
                  <Alert severity="success">Informations mises à jour</Alert>
                )}
              </Box>
            </form>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  if (!ENTRYPOINT) {
    return {
      props: {},
    };
  }

  const bikeTypesCollection = await bikeTypeResource.getAll(false);
  const bikeTypesFetched = bikeTypesCollection['hydra:member'];

  const repairerTypesCollection = await repairerTypeResource.getAll(false);
  const repairerTypesFetched = repairerTypesCollection['hydra:member'];

  return {
    props: {
      bikeTypesFetched,
      repairerTypesFetched,
    },
    revalidate: 10,
  };
};

export default RepairerInformations;
