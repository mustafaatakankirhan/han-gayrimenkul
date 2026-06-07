import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS7MvN214pOaiVkvbEhwAqrK4CmA10kOg",
  authDomain: "han-web-fe09d.firebaseapp.com",
  projectId: "han-web-fe09d",
  storageBucket: "han-web-fe09d.firebasestorage.app",
  messagingSenderId: "860079702102",
  appId: "1:860079702102:web:cce2e3fac0a8053ea1bbf7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);