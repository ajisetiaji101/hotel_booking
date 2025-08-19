// src/lib/firebase.ts

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { addDoc, collection, getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { browser } from "$app/environment"; // Import 'browser' dari SvelteKit

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyCeUvqtdA5LCqobW969BV32NpPjsVL9VjQ",
  authDomain: "demotel-22303.firebaseapp.com",
  projectId: "demotel-22303",
  storageBucket: "demotel-22303.firebasestorage.app",
  messagingSenderId: "92353227196",
  appId: "1:92353227196:web:cbad5fd8081b228b1223b9",
  measurementId: "G-RM2MVR2VJF"
};

// Inisialisasi Firebase dengan tipe yang eksplisit
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inisialisasi Analytics hanya jika kode berjalan di browser
let analytics;
if (browser) {
  analytics = getAnalytics(app);
}

// Ekspor layanan dengan tipe yang jelas
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
