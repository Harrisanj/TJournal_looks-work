import type { NextPage } from 'next';
import Head from 'next/head';
import Header from "../components/header";

interface ILayoutDefault {
  title: string,
};

const LayoutDefault: NextPage<ILayoutDefault> = ({title, children}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,400i,500,700&subset=cyrillic,cyrillic-ext,latin-ext"/>
      </Head>
      <header>
        <Header/>
      </header>
      <main id="main">
        <div className="container">{children}</div>
      </main>
      <footer id="footer"></footer>
    </>
  )
};

export default LayoutDefault;