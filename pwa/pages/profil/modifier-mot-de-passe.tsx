import {NextPageWithLayout} from '../_app';
import ChangePassword from "@components/profile/ChangePassword";
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";

const UserChangePassword = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>Modifier mot de passe</title>
            </Head>
            <WebsiteLayout>
                <ChangePassword/>
            </WebsiteLayout>
        </>
    );
};

export default UserChangePassword
