// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4mTQ8gdn7ocwfpMBI0u9uhk9JjevzAVE",
  authDomain: "content-panner-planly.firebaseapp.com",
  projectId: "content-panner-planly",
  storageBucket: "content-panner-planly.firebasestorage.app",
  messagingSenderId: "583452649157",
  appId: "1:583452649157:web:f612a977927f8a282632ac",
  measurementId: "G-VQYG5FFGDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth (for Google Sign-In)
export const auth = getAuth(app);

// Export Analytics (optional — only works on web with HTTPS)
export const analytics = getAnalytics(app);