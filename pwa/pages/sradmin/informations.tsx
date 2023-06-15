import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {GetStaticProps} from 'next';
import {NextPageWithLayout} from '../_app';
import {ENTRYPOINT} from '@config/entrypoint';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {RepairerType} from '@interfaces/RepairerType';
import {BikeType} from '@interfaces/BikeType';
import InformationsContainer from "@components/dashboard/informations/InformationsContainer";
import {Repairer} from "@interfaces/Repairer";
import {repairerResource} from "@resources/repairerResource";
import {useAccount} from "@contexts/AuthContext";
import {CircularProgress} from "@mui/material";

type RepairerInformationsProps = {
  bikeTypesFetched: BikeType[];
  repairerTypesFetched: RepairerType[];
};

const RepairerInformations: NextPageWithLayout<RepairerInformationsProps> = ({bikeTypesFetched = [], repairerTypesFetched = []}) => {

  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>(repairerTypesFetched);
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
      const repairerFetch: Repairer = await repairerResource.get(user.repairer['@id']);
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
        {!loading && repairer && <InformationsContainer bikeTypes={bikeTypes} repairerTypes={repairerTypes} repairerFetch={repairer} fetchRepairer={fetchRepairer} />}
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
