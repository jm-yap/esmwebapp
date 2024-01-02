// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

import { getDatabase, ref, get } from "firebase/database";

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNgGIW74VyqwKmnTm6WMXDjgLq4ivQs3E",
  authDomain: "esm-app-f0711.firebaseapp.com",
  projectId: "esm-app-f0711",
  storageBucket: "esm-app-f0711.appspot.com",
  messagingSenderId: "383934678773",
  appId: "1:383934678773:web:99c916c945713950cea7bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const auth = getAuth(app);

export { database };
export const db = getFirestore(app);
