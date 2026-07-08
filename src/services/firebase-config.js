import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Koleksiyon referansları
const userCollectionRef = collection(db, "user");
const postCollectionRef = collection(db, "post");
const messageCollectionRef = collection(db, "messages");
const priceCollectionRef = collection(db, "prices");
const priceHistoryCollectionRef = collection(db, "price_history");

export {
  app, // Firebase app
  auth, // Firebase auth
  db, // Firestore database
  storage, // Firebase storage
  userCollectionRef, // User collection references
  postCollectionRef, // Post collection references
  messageCollectionRef, // Message collection references
  priceCollectionRef, // Price collection references
  priceHistoryCollectionRef, // Price history collection references
};
