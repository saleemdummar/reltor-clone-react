// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1uvRiMJ9oslDZFoy0Zgtt45AWTQBwtBI",
  authDomain: "realtor-clone-react-5cd02.firebaseapp.com",
  projectId: "realtor-clone-react-5cd02",
  storageBucket: "realtor-clone-react-5cd02.appspot.com",
  messagingSenderId: "696917577654",
  appId: "1:696917577654:web:eb8062d180d2ad93b57b17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
