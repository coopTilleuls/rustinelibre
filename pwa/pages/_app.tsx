import Layout from '@components/common/Layout';
import type {AppProps} from 'next/app';
import type {DehydratedState} from 'react-query';
import Head from 'next/head';
import {NextPage} from 'next';
import type {ReactElement, ReactNode} from 'react';
import {AuthProvider, useAccount} from '@contexts/AuthContext';
import {SearchRepairerProvider} from '@contexts/SearchRepairerContext';
import {RepairerFormProvider} from '@contexts/RepairerFormContext';
import {UserFormProvider} from '@contexts/UserFormContext';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import {A2HS} from '@components/banner/A2HS';
import {A2HSIOS} from '@components/banner/A2HSIOS';

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
          <UserFormProvider>
            <>
              <Head>
                <meta
                  name="viewport"
                  charSet="utf-8"
                  content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"></meta>
                <meta name="apple-mobile-web-app-capable" content="yes"></meta>
                <link
                  rel="manifest"
                  href="/manifest.json"
                  crossOrigin="use-credentials"></link>
              </Head>
              <ThemeProvider theme={theme}>
                <CssBaseline>
                  <A2HS></A2HS>
                  <A2HSIOS></A2HSIOS>
                  <Layout dehydratedState={pageProps.dehydratedState}>
                    <Component {...pageProps} />
                  </Layout>
                </CssBaseline>
              </ThemeProvider>
            </>
          </UserFormProvider>
        </RepairerFormProvider>
      </SearchRepairerProvider>
    </AuthProvider>
  );
}

export default MyApp;
