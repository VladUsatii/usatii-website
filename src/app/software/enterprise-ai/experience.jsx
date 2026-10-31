'use client';
import Link from 'next/link';
import styles from './enterprise-ai.module.css';
import { InfiniteArchive } from './data-scenes';
import ComputerZoom from './computer-zoom';
import PlatformArticle from './platform-article';

export default function Experience() {
  return <main className={styles.root}>
    <h1 className={styles.srOnly}>USATII Enterprise AI. Put AI to work inside your operations.</h1>
    <ComputerZoom />
    <InfiniteArchive />
    <PlatformArticle />
    <section className={styles.bootcampOnly} aria-labelledby='bootcamp-title'>
      <div className={styles.ctaCopy}>
        <h2 id='bootcamp-title'>Giving your company control over your data.</h2>
        <Link className={styles.primaryButton} href='/documentation/bootcamp'>Start an AI bootcamp <span aria-hidden='true'>↗</span></Link>
      </div>
      <figure className={styles.ctaImage}>
        <img src='/enterprise-ai/team-installation.webp' width='1536' height='1024' alt='AI-generated scene of three engineers in white USATII sweatshirts installing data-center equipment' loading='lazy' />
      </figure>
    </section>
  </main>;
}
