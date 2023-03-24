import React, { ReactNode } from "react";
import Head from "next/head";
import {Header} from '@components/layout/Header';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header
                title="Je suis un test"
            />
        </>
    );
}
