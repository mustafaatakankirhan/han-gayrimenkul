import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS7MvN214p0aiVkvbEhwAqrK4CmA10kOg",
  authDomain: "han-web-fe09d.firebaseapp.com",
  projectId: "han-web-fe09d",
  storageBucket: "han-web-fe09d.appspot.com",
  messagingSenderId: "860079702102",
  appId: "1:860079702102:web:b81b2c2ab03a36bba1bbf7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);