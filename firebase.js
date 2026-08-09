import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUZmbjsWOGgs8chdBOIVfoY8RNAeGwk7s",
    authDomain: "studentscores-c9ad1.firebaseapp.com",
    projectId: "studentscores-c9ad1",
    storageBucket: "studentscores-c9ad1.firebasestorage.app",
    messagingSenderId: "627785600117",
    appId: "1:627785600117:web:eaa750b8583929dda0fc3c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
