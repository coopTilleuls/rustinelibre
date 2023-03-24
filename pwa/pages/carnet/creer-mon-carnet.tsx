import {NextPageWithLayout} from 'pages/_app';
import React, {useState} from 'react';
import Head from "next/head";
import {Footer} from '@components/layout/Footer';
import {Navbar} from '@components/layout/Navbar';

const CreateMaintenanceBook: NextPageWithLayout = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Mon carnet d'entretien</title>
            </Head>
            <Navbar/>
            <p>
                HELLO
            </p>
            <Footer logged={true} />
        </div>
    );
};

export default CreateMaintenanceBook;
