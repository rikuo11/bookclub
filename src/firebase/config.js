import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getMessaging } from "firebase/messaging";
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_riukF7zesz15Z6uycqK8bvKcbDDc8G8",
  authDomain: "bookclub-e4ca9.firebaseapp.com",
  projectId: "bookclub-e4ca9",
  storageBucket: "bookclub-e4ca9.appspot.com",
  messagingSenderId: "156534187660",
  appId: "1:156534187660:web:f980cafd1ff2d0518abda9",
  measurementId: "G-BZRK3BJQ4R"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDBIlhVX0oSRNIVALniljklduffToPGdsQ",
//   authDomain: "fir-app-cefab.firebaseapp.com",
//   projectId: "fir-app-cefab",
//   storageBucket: "fir-app-cefab.firebasestorage.app",
//   messagingSenderId: "1032032343819",
//   appId: "1:1032032343819:web:3a08ac70033d86613f340e"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage()
const functions = getFunctions(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);


export { app, db, auth, provider, storage, functions }