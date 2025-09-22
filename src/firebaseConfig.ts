// FIX: The original named import from 'firebase/app' was causing module resolution errors.
// By changing to a namespace import (`import * as firebaseApp from 'firebase/app'`),
// we can work around potential issues with how named exports are resolved in the project's TypeScript configuration.
import * as firebaseApp from 'firebase/app';
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

let app: firebaseApp.FirebaseApp | undefined;
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
  
  app = firebaseApp.initializeApp(firebaseConfig);
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
