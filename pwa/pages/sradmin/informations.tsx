import {NextPageWithLayout} from '../_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {repairerResource} from '@resources/repairerResource';
import {useAccount} from '@contexts/AuthContext';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import InformationsContainer from '@components/dashboard/informations/InformationsContainer';
import {CircularProgress} from '@mui/material';
import {RepairerType} from '@interfaces/RepairerType';
import {BikeType} from '@interfaces/BikeType';
import {Repairer} from '@interfaces/Repairer';

type RepairerInformationsProps = {
  bikeTypesFetched: BikeType[];
  repairerTypesFetched: RepairerType[];
};

const RepairerInformations: NextPageWithLayout<RepairerInformationsProps> = ({
  bikeTypesFetched = [],
  repairerTypesFetched = [],
}) => {
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [repairerTypes, setRepairerTypes] =
    useState<RepairerType[]>(repairerTypesFetched);
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useAccount({});

  const fetchRepairerTypes = async () => {
    const responseRepairerTypes = await repairerTypeResource.getAll(false);
    setRepairerTypes(responseRepairerTypes['hydra:member']);
  };

  useEffect(() => {
    if (repairerTypes.length === 0) {
      fetchRepairerTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBikeTypes = async () => {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  };

  useEffect(() => {
    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRepairer = async () => {
    if (user && user.repairer) {
      setLoading(true);
      const repairerFetch: Repairer = await repairerResource.get(
        user.repairer['@id']
      );
      setRepairer(repairerFetch);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.repairer) {
      setRepairer(user.repairer);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Informations</title>
      </Head>
      <DashboardLayout>
        {loading && <CircularProgress />}
        {!loading && repairer && (
          <InformationsContainer
            bikeTypes={bikeTypes}
            repairerTypes={repairerTypes}
            repairerFetch={repairer}
            fetchRepairer={fetchRepairer}
          />
        )}
      </DashboardLayout>
    </>
  );
};

export default RepairerInformations;
