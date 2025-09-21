import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let initializationError: Error | null = null;

try {
  // Check for the presence of the API key before initializing
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "VITE_FIREBASE_API_KEY is not set. Please ensure you have a .env file in the project root with your Firebase credentials and have restarted the Vite server. Refer to README.md for details."
    );
  }
  
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

} catch (e: any) {
  console.error("Firebase Initialization Failed:", e);
  initializationError = e;
  // Set services to undefined so the rest of the app knows initialization failed
  db = undefined;
  auth = undefined;
}

// Export the services and the error state.
// Other files should handle cases where db or auth might be undefined.
export { db, auth, initializationError };
