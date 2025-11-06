import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// This config is public and safe to be on the client
const firebaseConfig = {
  apiKey: "AIzaSyCc1qw06jEUqViVCbRid9g_mnN83PXSRuc",
  authDomain: "skillswap-ba99b.firebaseapp.com",
  projectId: "skillswap-ba99b",
  storageBucket: "skillswap-ba99b.firebasestorage.app",
  messagingSenderId: "490543079667",
  appId: "1:490543079667:web:b2a9d99ab6dceb9e271786",
  measurementId: "G-S0Q4414MFY",
  databaseURL: "https://skillswap-ba99b-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// These are CLIENT-SIDE services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); 

export { app, auth, db, rtdb };

