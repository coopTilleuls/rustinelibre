import Head from "next/head";
import {Footer} from '@components/layout/Footer';
import {Navbar} from '@components/layout/Navbar';
import {CardNeedRepairer} from '@components/home/CardNeedRepairer';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

const Home = () => (
  <div className="w-full overflow-x-hidden">
    <Head>
      <title>Bienvenue sur la page d'accueil!</title>
    </Head>
      <Navbar/>
      <CardNeedRepairer />
      <Footer logged={true} />
  </div>
);
export default Home;
