import Link from 'next/link';
import Head from 'next/head';
import React from "react";

interface FooterProps {
    logged: boolean;
    role?: 'user';
}

export const Footer = ({
                           logged,
                           role,
                       }: FooterProps): JSX.Element => (

   <footer className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 bg-white border-gray-200 text-white dark:bg-gray-900 p-4 absolute bottom-0 w-full">
        <div className="px-4 py-2">
            <Link href="/">
                <p className="text-sm">
                    Accueil
                </p>
            </Link>
        </div>
        <div className="px-4 py-2">
            {/*<Link href="">*/}
                <p className="text-sm">
                    Rendez-vous
                </p>
            {/*</Link>*/}
        </div>
        <div className="px-4 py-2">
            {/*<Link href="/">*/}
                <p className="text-sm">
                    Mes vélos
                </p>
            {/*</Link>*/}
        </div>
        <div className="px-4 py-2">
            {/*<Link href="/">*/}
                <p className="text-sm">
                    Messages
                </p>
            {/*</Link>*/}
        </div>
        <div className="px-4 py-2">
            <Link href="/">
                <p className="text-sm">
                    {logged ?'Mon profil' : 'Connexion'}
                </p>
            </Link>
        </div>
    </footer>
);
