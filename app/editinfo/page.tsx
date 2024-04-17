"use server";
import React from "react";
import Form from "./form";
import { auth } from "../../firebase";
import styles from "./styles.module.css";

async function EditInfo() {
  return <Form/>;
}

export default EditInfo;
