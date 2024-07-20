"use server";
import React, { FormEvent } from "react";
import Form from "./form";
import styles from "./styles.module.css";

async function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.centerBox}>
        <div className={styles.dividers}>
          <div className={styles.title}>
            <p>Sagot</p>
            <p className={styles.titleOrange}>Kita</p>
            <p>.</p>
          </div>
          <p className={styles.subtitle}>Sign In</p>
        </div>
        <div className={styles.dividers}></div>
        <div className={styles.dividers}>
          <Form />
        </div>
      </div>
    </div>
  );
}

export default Login;
