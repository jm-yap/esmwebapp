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

export async function getAdditionalUserInfo(clientID: string) {
  return (await getDoc(doc(db, "Client", clientID))).data();
}