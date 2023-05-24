import React from 'react';
import Head from 'next/head';
import Script from 'next/script'


const HeadApp = () => {
  return(
    <>
    <Head>
      <title>Clubs Fing</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="stylesheet" href="/styles/style.css"/>
      
    </Head>
      <Script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></Script>
    </>
  )
}
export default HeadApp;