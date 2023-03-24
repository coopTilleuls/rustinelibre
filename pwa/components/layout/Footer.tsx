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
    <footer className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 bg-gray-800 text-white p-4 absolute bottom-0 w-full">
        <div className="px-4 py-2">Accueil</div>
        <div className="px-4 py-2">Rendez-Vous</div>
        <div className="px-4 py-2">Mes vélos</div>
        <div className="px-4 py-2">Messages</div>
        <div className="px-4 py-2">{logged ?'Mon profil' : 'Connexion'}</div>
    </footer>
);
