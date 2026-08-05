// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUZmbjsWOGgs8chdBOIVfoY8RNAeGwk7s",
  authDomain: "studentscores-c9ad1.firebaseapp.com",
  projectId: "studentscores-c9ad1",
  storageBucket: "studentscores-c9ad1.firebasestorage.app",
  messagingSenderId: "627785600117",
  appId: "1:627785600117:web:eaa750b8583929dda0fc3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore so student.js can use it
export { db };