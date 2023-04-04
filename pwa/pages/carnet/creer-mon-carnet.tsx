import {NextPageWithLayout} from 'pages/_app';
import React, {useState} from 'react';
import Head from "next/head";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";

const CreateMaintenanceBook: NextPageWithLayout = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Mon carnet d'entretien</title>
            </Head>
            <Navbar />
            <Footer />
        </div>
    );
};

export default CreateMaintenanceBook;
