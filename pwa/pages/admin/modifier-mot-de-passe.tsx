import {NextPageWithLayout} from '../_app';
import ChangePassword from '@components/profile/ChangePassword';
import AdminLayout from '@components/admin/AdminLayout';
import Head from 'next/head';

const AdminChangePassword = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Modifier mot de passe | Rustine Libre</title>
      </Head>
      <AdminLayout>
        <ChangePassword />
      </AdminLayout>
    </>
  );
};

export default AdminChangePassword;
