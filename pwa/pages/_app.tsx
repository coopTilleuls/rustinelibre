import "styles/globals.css"
import Layout from "@components/common/Layout"
import type { AppProps } from "next/app"
import type { DehydratedState } from "react-query"
import Head from 'next/head';
import {NextPage} from 'next';
import type { ReactElement, ReactNode } from 'react'
import {AuthProvider} from "@contexts/AuthContext";
import {SearchRepairerProvider} from "@contexts/SearchRepairerContext";
import {RepairerFormProvider} from "@contexts/RepairerFormContext";
import {UserFormProvider} from "@contexts/UserFormContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppProps<{dehydratedState: DehydratedState}>) {
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
                    </Head>
                    <Layout dehydratedState={pageProps.dehydratedState}>
                      <Component {...pageProps} />
                    </Layout>
                  </>
                </UserFormProvider>
            </RepairerFormProvider>
        </SearchRepairerProvider>
      </AuthProvider>
  )
}

export default MyApp
