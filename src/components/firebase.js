// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCGPLA6TNovCK7YMFVDSSSs31_JxBnZjPQ",
    authDomain: "loginsignupta-prototype.firebaseapp.com",
    databaseURL: "https://loginsignupta-prototype-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "loginsignupta-prototype",
    storageBucket: "loginsignupta-prototype.appspot.com",
    messagingSenderId: "286340514293",
    appId: "1:286340514293:web:a6cec0f10ad5042986e0bc",
    measurementId: "G-99S1DBFCSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
