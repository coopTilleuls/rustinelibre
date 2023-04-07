import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";

const JoinGroup: NextPageWithLayout = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Rejoindre le collectif</title>
            </Head>
            <WebsiteLayout/>
        </div>
    );
};

export default JoinGroup;
