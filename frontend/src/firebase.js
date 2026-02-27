

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1AaeB_ot9RvO0SZ_ITpbh-otF4Nr0p90",
  authDomain: "wanderhome-431f9.firebaseapp.com",
  projectId: "wanderhome-431f9",
  storageBucket: "wanderhome-431f9.firebasestorage.app",
  messagingSenderId: "609731053399",
  appId: "1:609731053399:web:4546888fe1bb56e55e6012",
  measurementId: "G-5H8LY4TZEM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();