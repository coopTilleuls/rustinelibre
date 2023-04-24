import React, { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@components/layout/Navbar'));
const Footer = dynamic(() => import('@components/layout/Footer'));
import { useAccount } from '@contexts/AuthContext';

const WebsiteLayout = ({ children }: PropsWithChildren): JSX.Element => {
  const user = useAccount({});

  return (
    <div>
      <Navbar user={user ?? undefined} />
      <Footer user={user ?? undefined} />
    </div>
  );
};

export default WebsiteLayout;
