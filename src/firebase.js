// src/firebase.js

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPBTRLo5vSoxnaV2hwqe31m9gqU2LlwjQ",
  authDomain: "bazario-1.firebaseapp.com",
  projectId: "bazario-1",
  storageBucket: "bazario-1.firebasestorage.app",
  messagingSenderId: "271893489797",
  appId: "1:271893489797:web:4680aaab52f61c68b821ec",
  measurementId: "G-W24G9LSQZX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;