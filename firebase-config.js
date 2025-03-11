// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDr8SIWOMC9HjPzb4iR6vCFc5ONxUa4dGQ",
    authDomain: "yousport-rally.firebaseapp.com",
    projectId: "yousport-rally",
    storageBucket: "yousport-rally.firebasestorage.app",
    messagingSenderId: "1080944459276",
    appId: "YOUR_APP_ID",
    measurementId: "1:1080944459276:web:4a1b509238b5e40f8f7829"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
