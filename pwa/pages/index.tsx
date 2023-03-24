import Head from "next/head";
import {Header} from '@components/layout/Header';
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
      <div className="relative flex-1 pb-20">
          <Header
              title="Je suis un test"
          />
      </div>
  </div>
);
export default Home;
