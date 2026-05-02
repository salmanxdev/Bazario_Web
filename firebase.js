// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPBTRLo5vSoxnaV2hwqe31m9gqU2LlwjQ",
  authDomain: "bazario-1.firebaseapp.com",
  projectId: "bazario-1",
  storageBucket: "bazario-1.firebasestorage.app",
  messagingSenderId: "271893489797",
  appId: "1:271893489797:web:4680aaab52f61c68b821ec",
  measurementId: "G-W24G9LSQZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);