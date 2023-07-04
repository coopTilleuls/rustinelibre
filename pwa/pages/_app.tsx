import Layout from '@components/common/Layout';
import type {AppProps} from 'next/app';
import type {DehydratedState} from 'react-query';
import Head from 'next/head';
import {NextPage} from 'next';
import type {ReactElement, ReactNode} from 'react';
import {AuthProvider} from '@contexts/AuthContext';
import {SearchRepairerProvider} from '@contexts/SearchRepairerContext';
import {RepairerFormProvider} from '@contexts/RepairerFormContext';
import {UserFormProvider} from '@contexts/UserFormContext';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import {NotificationProvider} from "@components/notifications/NotificationContext";
import dynamic from 'next/dynamic';
const Notification = dynamic(() => import('@components/notifications/Notification'), {
  ssr: false,
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

function MyApp({
  Component,
  pageProps,
}: AppProps<{dehydratedState: DehydratedState}>) {
  return (
    <AuthProvider>
      <SearchRepairerProvider>
        <RepairerFormProvider>
          <NotificationProvider>
            <UserFormProvider>
              <>
                <Head>
                  <meta
                    name="viewport"
                    charSet="utf-8"
                    content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"></meta>
                </Head>
                <ThemeProvider theme={theme}>
                  <Notification />
                  <CssBaseline>
                    <Layout dehydratedState={pageProps.dehydratedState}>
                      <Component {...pageProps} />
                    </Layout>
                  </CssBaseline>
                </ThemeProvider>
              </>
            </UserFormProvider>
          </NotificationProvider>
        </RepairerFormProvider>
      </SearchRepairerProvider>
    </AuthProvider>
  );
}

export default MyApp;
