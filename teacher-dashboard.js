import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUZmbjsWOGgs8chdBOIVfoY8RNAeGwk7s",
    authDomain: "studentscores-c9ad1.firebaseapp.com",
    projectId: "studentscores-c9ad1",
    storageBucket: "studentscores-c9ad1.firebasestorage.app",
    messagingSenderId: "627785600117",
    appId: "1:627785600117:web:eaa750b8583929dda0fc3c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Get elements
const studentIDInput = document.getElementById("studentID");
const studentName = document.getElementById("studentName");

const AP = document.getElementById("AP");
const FIL = document.getElementById("FIL");
const HELE = document.getElementById("HELE");
const MUSICandArts = document.getElementById("MUSICandArts");
const PEandHealth = document.getElementById("PEandHealth");
const English = document.getElementById("English");
const Mathematics = document.getElementById("Mathematics");
const Science = document.getElementById("Science");
const GMRC = document.getElementById("GMRC");
const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");

const newStudentID = document.getElementById("newStudentID");
const newStudentName = document.getElementById("newStudentName");
const newStudentPassword = document.getElementById("newStudentPassword");

const addStudentBtn = document.getElementById("addStudentBtn");


// LOAD STUDENT
loadBtn.addEventListener("click", async () => {

    const studentID = studentIDInput.value.trim();

    if (!studentID) {
        alert("Please enter a student ID.");
        return;
    }

    try {

        const docRef = doc(db, "students", studentID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const data = docSnap.data();

            studentName.textContent = data.name || "No name";

            AP.value = data.AP || 0;
            FIL.value = data.FIL || 0;
            HELE.value = data.HELE || 0;
            MUSICandArts.value = data.MUSICandArts || 0;
            PEandHealth.value = data.PEandHealth || 0;
            English.value = data.English || 0;
            Mathematics.value = data.Mathematics || 0;
            Science.value = data.Science || 0;
            GMRC.value = data.GMRC || 0;
        } else {

            alert("Student not found.");

        }

    } catch (error) {

        console.error(error);
        alert("Error loading student: " + error.message);

    }

});


// SAVE SCORES
saveBtn.addEventListener("click", async () => {

    const studentID = studentIDInput.value.trim();

    if (!studentID) {
        alert("Please load a student first.");
        return;
    }

    try {

        const docRef = doc(db, "students", studentID);

        await updateDoc(docRef, {

            AP: Number(AP.value),
            FIL: Number(FIL.value),
            HELE: Number(HELE.value),
            MUSICandArts: Number(MUSICandArts.value),
            PEandHealth: Number(PEandHealth.value)
            English: Number(English.value),
            Mathematics: Number(Mathematics.value),
            Science: Number(Science.value),
            GMRC: Number(GMRC.value)
        });

        alert("Scores saved successfully!");

    } catch (error) {

        console.error(error);
        alert("Error saving scores: " + error.message);

    }

});


// ADD NEW STUDENT
addStudentBtn.addEventListener("click", async () => {

    const id = newStudentID.value.trim();
    const name = newStudentName.value.trim();
    const password = newStudentPassword.value.trim();

    if (!id || !name || !password) {

        alert("Please enter Student ID, Name, and Password.");
        return;

    }

    try {

        const studentRef = doc(db, "students", id);

        const existingStudent = await getDoc(studentRef);

        if (existingStudent.exists()) {

            alert("That Student ID already exists.");
            return;

        }

        await setDoc(studentRef, {

            name: name,
            password: password,
            AP: 0,
            FIL: 0,
            HELE: 0,
            MUSICandArts: 0,
            PEandHealth: 0,
            English: 0,
            Mathematics: 0,
            Science: 0,
            GMRC: 0
        });

        alert("Student added successfully!");

        newStudentID.value = "";
        newStudentName.value = "";
        newStudentPassword.value = "";

    } catch (error) {

        console.error(error);
        alert("Error adding student: " + error.message);

    }

});
