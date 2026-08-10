import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    collection,
    getDocs,
    deleteDoc
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
const studentList = document.getElementById("studentList");
const studentSearch = document.getElementById("studentSearch");
const termSelect = document.getElementById("termSelect");
const passwordStudentID =
    document.getElementById("passwordStudentID");

const changeNewPassword =
    document.getElementById("changeNewPassword");

const changePasswordBtn =
    document.getElementById("changePasswordBtn");
// LOAD ALL STUDENTS
// LOAD ALL STUDENTS
let allStudents = [];

async function loadStudentList() {

    try {

        const studentsRef = collection(db, "students");
        const snapshot = await getDocs(studentsRef);

        allStudents = [];

        snapshot.forEach((studentDoc) => {

            const data = studentDoc.data();

            allStudents.push({
                id: studentDoc.id,
                name: data.name || "No name"
            });

        });

        displayStudents(allStudents);

    } catch (error) {

        console.error(error);

        studentList.innerHTML = `
            <tr>
                <td colspan="3">
                    Error loading students.
                </td>
            </tr>
        `;

    }

}


// DISPLAY STUDENTS
function displayStudents(students) {

    studentList.innerHTML = "";

    if (students.length === 0) {

        studentList.innerHTML = `
            <tr>
                <td colspan="3">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }

    students.forEach((student) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>

    <button
        class="load-student-btn"
        data-id="${student.id}">
        Load
    </button>

    <button
        class="delete-student-btn"
        data-id="${student.id}"
        data-name="${student.name}">
        Delete
    </button>

</td>
        `;

        studentList.appendChild(row);

    });


    document.querySelectorAll(".load-student-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                studentIDInput.value = button.dataset.id;

                loadBtn.click();

            });

        });
// DELETE STUDENT
document.querySelectorAll(".delete-student-btn")
    .forEach(button => {

        button.addEventListener("click", async () => {

            const studentID = button.dataset.id;
            const studentName = button.dataset.name;

            const confirmed = confirm(
                `Are you sure you want to delete ${studentName} (${studentID})?\n\nThis will permanently delete the student's record and all scores.`
            );

            if (!confirmed) {
                return;
            }

            try {

                const studentRef = doc(
                    db,
                    "students",
                    studentID
                );

                await deleteDoc(studentRef);

                alert("Student deleted successfully.");

                loadStudentList();

            } catch (error) {

                console.error(error);

                alert(
                    "Error deleting student: " +
                    error.message
                );

            }

        });

    });
}


// SEARCH STUDENTS
studentSearch.addEventListener("input", () => {

    const searchText =
        studentSearch.value.trim().toLowerCase();

    const filteredStudents = allStudents.filter(student =>

        student.id.toLowerCase().includes(searchText) ||

        student.name.toLowerCase().includes(searchText)

    );

    displayStudents(filteredStudents);

});


loadStudentList();
// CHANGE STUDENT PASSWORD
changePasswordBtn.addEventListener("click", async () => {

    const studentID = passwordStudentID.value.trim();
    const newPassword = changeNewPassword.value.trim();

    if (!studentID || !newPassword) {
        alert("Please enter the Student ID and new password.");
        return;
    }

    if (newPassword.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
    }

    const confirmed = confirm(
        `Change the password for student ${studentID}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const studentRef = doc(
            db,
            "students",
            studentID
        );

        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {

            alert("Student ID not found.");

            return;
        }

        await updateDoc(studentRef, {
            password: newPassword
        });

        alert("Student password changed successfully.");

        passwordStudentID.value = "";
        changeNewPassword.value = "";

    } catch (error) {

        console.error(error);

        alert(
            "Error changing password: " +
            error.message
        );

    }

});
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

            const selectedTerm = termSelect.value;

let termScores;

if (selectedTerm === "term1") {

 termScores = data.term1 || data;
} else {

    termScores = data[selectedTerm] || {};

}
}

AP.value = termScores.AP || 0;
FIL.value = termScores.FIL || 0;
HELE.value = termScores.HELE || 0;
MUSICandArts.value = termScores.MUSICandArts || 0;
PEandHealth.value = termScores.PEandHealth || 0;
English.value = termScores.English || 0;
Mathematics.value = termScores.Mathematics || 0;
Science.value = termScores.Science || 0;
GMRC.value = termScores.GMRC || 0;

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

        const selectedTerm = termSelect.value;

        const scoresToSave = {

            AP: Number(AP.value),
            FIL: Number(FIL.value),
            HELE: Number(HELE.value),
            MUSICandArts: Number(MUSICandArts.value),
            PEandHealth: Number(PEandHealth.value),
            English: Number(English.value),
            Mathematics: Number(Mathematics.value),
            Science: Number(Science.value),
            GMRC: Number(GMRC.value)

        };

        await updateDoc(docRef, {

            [selectedTerm]: scoresToSave

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
