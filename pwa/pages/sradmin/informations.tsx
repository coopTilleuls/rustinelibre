import {NextPageWithLayout} from '../_app';
import Head from 'next/head';
import {useAccount} from '@contexts/AuthContext';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import InformationsContainer from '@components/dashboard/informations/InformationsContainer';

const RepairerInformations: NextPageWithLayout = () => {
  const user = useAccount({
    redirectIfNotFound: '/login',
    redirectIfMailNotConfirm: '/login',
  });

  return (
    <>
      <Head>
        <title>Informations | Rustine Libre</title>
      </Head>
      <DashboardLayout>{user && <InformationsContainer />}</DashboardLayout>
    </>
  );
};

export default RepairerInformations;
