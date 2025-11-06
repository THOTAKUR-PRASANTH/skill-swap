// import admin from "firebase-admin";
// import { getFirestore } from "firebase-admin/firestore";
// import { getDatabase } from "firebase-admin/database";
// // This imports your secret key.
// // Make sure 'service-account-key.json' is in your 'src/lib' folder
// import serviceAccountKey from "./service-account-key.json";

// if (!admin.apps.length) {
//   try {
//     admin.initializeApp({
//       // Use 'as' to cast the imported JSON to the correct type
//       credential: admin.credential.cert(
//         serviceAccountKey as admin.ServiceAccount
//       ),
//       // This URL must match the one in your client config
//       databaseURL: "https://skillswap-ba99b-default-rtdb.asia-southeast1.firebasedatabase.app/",
//     });
//     console.log("Firebase Admin SDK Initialized.");
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     console.error("Firebase Admin initialization error:", message);
//   }
// }

// // These are the powerful, server-side admin services
// const adminDb = getFirestore();
// const adminRtdb = getDatabase();

// export { admin, adminDb, adminRtdb };


import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";

// We no longer import the JSON file directly
// import serviceAccountKey from "./service-account-key.json";

if (!admin.apps.length) {
  try {
    // 1. Get the base64-encoded string from environment variables
    const serviceAccountBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;

    // 2. Check if the variable is actually set
    if (!serviceAccountBase64) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_BASE64 environment variable is not set."
      );
    }

    // 3. Decode the base64 string back into the original JSON string
    const serviceAccountJson = Buffer.from(
      serviceAccountBase64,
      "base64"
    ).toString("utf8");

    // 4. Parse the JSON string into a usable object
    const serviceAccount = JSON.parse(serviceAccountJson);

    // 5. Initialize the app with the parsed service account object
    admin.initializeApp({
      credential: admin.credential.cert(
        serviceAccount as admin.ServiceAccount
      ),
      databaseURL:
        "https://skillswap-ba99b-default-rtdb.asia-southeast1.firebasedatabase.app/",
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