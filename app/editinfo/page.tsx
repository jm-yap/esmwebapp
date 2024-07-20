"use server";
import React from "react";
import { auth } from "../../firebase";
import Form from "./form";
import styles from "./styles.module.css";

async function EditInfo() {
  return <Form />;
}

export default EditInfo;
