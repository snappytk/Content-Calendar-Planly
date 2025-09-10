// src/firebase.ts
import { initializeApp } from "firebase/app";

let getAnalytics;
if (typeof window !== "undefined") {
  getAnalytics = require("firebase/analytics").getAnalytics;
}

const firebaseConfig = {
  apiKey: "AIzaSyD4mTQ8gdn7ocwfpMBI0u9uhk9JjevzAVE",
  authDomain: "content-panner-planly.firebaseapp.com",
  projectId: "content-panner-planly",
  storageBucket: "content-panner-planly.appspot.com",
  messagingSenderId: "583452649157",
  appId: "1:583452649157:web:f612a977927f8a282632ac",
  measurementId: "G-VQYG5FFGDV"
};

const app = initializeApp(firebaseConfig);

let analytics;
if (getAnalytics) {
  analytics = getAnalytics(app);
}

export { app, analytics };