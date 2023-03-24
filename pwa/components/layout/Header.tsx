import Link from 'next/link';
import Head from 'next/head';
import React from "react";

interface HeaderProps {
  title: string;
  subtitleColor?: 'white' | 'black';
  titleColor?: 'primary' | 'white';
}

export const Header = ({
  title,
  subtitleColor = 'black',
  titleColor = 'primary',
}: HeaderProps): JSX.Element => (
  <header className="relative flex flex-row mb-2 | sm:mb-6 sm:flex-col">
    <Head>
      <title>
        {title}
      </title>
    </Head>
  </header>
);
