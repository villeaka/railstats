import React from "react";
import Head from "next/head";

import styles from "../styles/Main.module.scss";

export default function Main() {
  return (
    <div className={styles.container}>
      <Head>
        <title />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} />

      <footer className={styles.footer} />
    </div>
  );
}
