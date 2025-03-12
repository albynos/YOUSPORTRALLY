// Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
