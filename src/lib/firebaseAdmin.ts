import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
// This imports your secret key.
// Make sure 'service-account-key.json' is in your 'src/lib' folder
import serviceAccountKey from "./service-account-key.json";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // Use 'as' to cast the imported JSON to the correct type
      credential: admin.credential.cert(
        serviceAccountKey as admin.ServiceAccount
      ),
      // This URL must match the one in your client config
      databaseURL: "https://skillswap-ba99b-default-rtdb.asia-southeast1.firebasedatabase.app/",
    });
    console.log("Firebase Admin SDK Initialized.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Firebase Admin initialization error:", message);
  }
}

// These are the powerful, server-side admin services
const adminDb = getFirestore();
const adminRtdb = getDatabase();

export { admin, adminDb, adminRtdb };

