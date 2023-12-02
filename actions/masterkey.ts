'use server';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDoc,
  QuerySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

export async function fetchMasterKey() {
    return (await getDoc(doc(db, 'MasterKey', 'Xl6FTYysaFaApEnjF7dG'))).data();
}