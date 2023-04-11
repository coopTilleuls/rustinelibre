import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";

const CreateMaintenanceBook: NextPageWithLayout = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Mon carnet d’entretien</title>
            </Head>
            <WebsiteLayout />
        </div>
    );
};

export default CreateMaintenanceBook;
