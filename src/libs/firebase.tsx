import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAtn3HnuRAMtmhoEP-sB3_Nu8V2pKR1QRI",
    authDomain: "cloud-59e74.firebaseapp.com",
    projectId: "cloud-59e74",
    storageBucket: "cloud-59e74.firebasestorage.app",
    messagingSenderId: "32513738547",
    appId: "1:32513738547:web:cb25a1c50cc12b52192046",
    measurementId: "G-N8T7VNP9WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

//   API environment variable
// CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@deo5ex1zo


// API Key
// 812315141563513

// API Secret
// NqxjOcXN2jGixdMXz2L7ZVG3wzI