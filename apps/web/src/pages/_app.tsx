import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

import { ApolloProvider } from '@apollo/client'
import useApollo from '../hooks/useApollo';

import './styles.css';
import './_app.css';

function MyApp({ Component, pageProps }: AppProps) {

  const client = useApollo(pageProps)

  return (
    <ApolloProvider client={client}>
      <>
        <Head>
          <title>Welcome to POS syste,!</title>
        </Head>
        <main className="app">
          <header className="app-header flex flex-row justify-between items-center border-b border-solid border-b-stone-300">
            <h1 className="app-header-title text-xl">POS System</h1>
            <Link href="/">
              <button
                className="app-header-hoemBtn text-xs middle none center rounded-lg bg-blue-500 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
              >
                Back to Tables
              </button>
            </Link>
          </header>
          <section className="app-content">
            <Component {...pageProps} />
          </section>
        </main>
      </>
    </ApolloProvider>
  );
}

export default MyApp;
