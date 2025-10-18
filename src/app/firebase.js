// src/firebase.js
"use client";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNHXOoNOkYfJ0Ndf49zWBCmT1cpehXNVs",
  authDomain: "sacredsearch-33f73.firebaseapp.com",
  projectId: "sacredsearch-33f73",
  storageBucket: "sacredsearch-33f73.firebasestorage.app",
  messagingSenderId: "961396635969",
  appId: "1:961396635969:web:cc2908b17c042b57a189c0",
  measurementId: "G-7H0VQM38JF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
