"use server";
import React from "react";
import { auth } from "../../firebase";
import Form from "./form";
import styles from "./styles.module.css";

async function EditAccInfo() {
  return (
    <div className={styles.container}>
      <div className={styles.centerBox}>
        <div className={styles.divider1}>
          <div className={styles.title}>
            <p>Sagot</p>
            <p className={styles.titleOrange}>Kita</p>
            <p>.</p>
          </div>
          <p className={styles.subtitle}>Edit account</p>
          <p className={styles.subtitle}>profile</p>
        </div>
        <div className={styles.divider2}>
          <Form />
        </div>
      </div>
    </div>
  );
}

export default EditAccInfo;
