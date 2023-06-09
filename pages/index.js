import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Clubs Fing</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <div className='p-5'>
        <div className=' flex'>
          <div className='w-1/3'>
            <img src='./banner-insc.jpeg'/>
          </div>
          <div>
            <h2>Inscribete aquí</h2>
            <p>Incididunt occaecat labore tempor cillum dolor consequat ullamco.</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}
