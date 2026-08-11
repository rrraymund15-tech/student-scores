import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { db } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


// ======================================================
// TEACHER AUTHENTICATION
// ======================================================

const auth = getAuth();

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "teacher.html";
        return;
    }

    console.log("Teacher logged in:", user.email);

});


// ======================================================
// GET HTML ELEMENTS
// ======================================================

const studentIDInput = document.getElementById("studentID");
const studentName = document.getElementById("studentName");

const AP = document.getElementById("AP");
const FIL = document.getElementById("FIL");
const HELE = document.getElementById("HELE");
const MAPEH = document.getElementById("MAPEH");
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

const passwordStudentID = document.getElementById("passwordStudentID");
const changeNewPassword = document.getElementById("changeNewPassword");
const changePasswordBtn = document.getElementById("changePasswordBtn");


// ======================================================
// SUBJECTS
// ======================================================

const subjects = {
    AP: AP,
    FIL: FIL,
    HELE: HELE,
    MAPEH: MAPEH,
    English: English,
    Mathematics: Mathematics,
    Science: Science,
    GMRC: GMRC
};


// ======================================================
// GET SELECTED TERM
// ======================================================

function getSelectedTerm() {

    if (!termSelect) {
        return "term1";
    }

    return termSelect.value || "term1";
}


// ======================================================
// CLEAR SCORES
// ======================================================

function clearScores() {

    Object.values(subjects).forEach((input) => {

        if (input) {
            input.value = "";
        }

    });

}


// ======================================================
// DISPLAY STUDENTS
// ======================================================

function displayStudents(students) {

    if (!studentList) {
        return;
    }

    studentList.innerHTML = "";

    if (students.length === 0) {

        studentList.innerHTML = "<p>No students found.</p>";

        return;
    }


    students.forEach((student) => {

        const row = document.createElement("div");

        row.className = "student-row";

        row.innerHTML = `
            <span>
                <strong>${student.id}</strong>
                - ${student.name}
            </span>

            <button
                class="load-student-btn"
                data-id="${student.id}">
                Load
            </button>

            <button
                class="delete-student-btn"
                data-id="${student.id}">
                Delete
            </button>
        `;

        studentList.appendChild(row);

    });


    // LOAD BUTTONS

    document
        .querySelectorAll(".load-student-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const id = button.dataset.id;

                if (studentIDInput) {
                    studentIDInput.value = id;
                }

                if (loadBtn) {
                    loadBtn.click();
                }

            });

        });


    // DELETE BUTTONS

    document
        .querySelectorAll(".delete-student-btn")
        .forEach((button) => {

            button.addEventListener("click", async () => {

                const studentID = button.dataset.id;

                const studentNameValue =
                    button.parentElement
                        .querySelector("span")
                        .textContent;


                const confirmed = confirm(
                    `Are you sure you want to delete ${studentNameValue}?\n\nThis will permanently delete the student's record and scores.`
                );


                if (!confirmed) {
                    return;
                }


                try {

                    const studentRef =
                        doc(db, "students", studentID);

                    await deleteDoc(studentRef);

                    alert("Student deleted successfully.");

                    clearScores();

                    if (studentIDInput) {
                        studentIDInput.value = "";
                    }

                    if (studentName) {
                        studentName.textContent = "";
                    }

                    await loadStudentList();

                } catch (error) {

                    console.error(
                        "Error deleting student:",
                        error
                    );

                    alert(
                        "Error deleting student: " +
                        error.message
                    );

                }

            });

        });

}


// ======================================================
// LOAD ALL STUDENTS
// ======================================================

async function loadStudentList() {

    try {

        const studentsRef =
            collection(db, "students");

        const snapshot =
            await getDocs(studentsRef);

        const allStudents = [];


        snapshot.forEach((studentDoc) => {

            const data = studentDoc.data();

            allStudents.push({

                id: studentDoc.id,

                name: data.name || "No name"

            });

        });


        allStudents.sort((a, b) =>
            a.id.localeCompare(b.id)
        );


        displayStudents(allStudents);


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        if (studentList) {

            studentList.innerHTML =
                "<p>Error loading students.</p>";

        }

    }

}


// ======================================================
// SEARCH STUDENTS
// ======================================================

if (studentSearch) {

    studentSearch.addEventListener(
        "input",
        async () => {

            const searchText =
                studentSearch.value
                    .trim()
                    .toLowerCase();


            try {

                const studentsRef =
                    collection(db, "students");

                const snapshot =
                    await getDocs(studentsRef);

                const allStudents = [];


                snapshot.forEach((studentDoc) => {

                    const data = studentDoc.data();

                    allStudents.push({

                        id: studentDoc.id,

                        name: data.name || "No name"

                    });

                });


                const filteredStudents =
                    allStudents.filter((student) => {

                        return (
                            student.id
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            student.name
                                .toLowerCase()
                                .includes(searchText)
                        );

                    });


                displayStudents(filteredStudents);


            } catch (error) {

                console.error(
                    "Search error:",
                    error
                );

            }

        }
    );

}


// ======================================================
// LOAD STUDENT
// ======================================================

if (loadBtn) {

    loadBtn.addEventListener(
        "click",
        async () => {

            const studentID =
                studentIDInput.value.trim();


            if (!studentID) {

                alert(
                    "Please enter a Student ID."
                );

                return;

            }


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        studentID
                    );


                const studentSnap =
                    await getDoc(studentRef);


                if (!studentSnap.exists()) {

                    alert("Student not found.");

                    clearScores();

                    if (studentName) {
                        studentName.textContent = "";
                    }

                    return;

                }


                const data =
                    studentSnap.data();


                // DISPLAY STUDENT NAME

                if (studentName) {

                    studentName.textContent =
                        data.name || "No name";

                }


                // GET SELECTED TERM

                const selectedTerm =
                    getSelectedTerm();


                let termScores = {};


                /*
                    Supports both:

                    term1: {
                        AP: 90,
                        FIL: 91
                    }

                    and older documents where scores
                    were stored directly.
                */

                if (
                    data[selectedTerm] &&
                    typeof data[selectedTerm] === "object"
                ) {

                    termScores =
                        data[selectedTerm];

                } else if (
                    data.termScores &&
                    data.termScores[selectedTerm]
                ) {

                    termScores =
                        data.termScores[selectedTerm];

                } else {

                    termScores = data;

                }


                // LOAD SUBJECT SCORES

                AP.value =
                    termScores.AP ?? "";

                FIL.value =
                    termScores.FIL ?? "";

                HELE.value =
                    termScores.HELE ?? "";

                MAPEH.value =
                    termScores.MAPEH ?? "";

                English.value =
                    termScores.English ?? "";

                Mathematics.value =
                    termScores.Mathematics ?? "";

                Science.value =
                    termScores.Science ?? "";

                GMRC.value =
                    termScores.GMRC ?? "";


                console.log(
                    "Student loaded:",
                    studentID
                );


            } catch (error) {

                console.error(
                    "Error loading student:",
                    error
                );


                alert(
                    "Error connecting to Firebase: " +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// SAVE SCORES
// ======================================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async () => {

            const studentID =
                studentIDInput.value.trim();


            if (!studentID) {

                alert(
                    "Please load a student first."
                );

                return;

            }


            const selectedTerm =
                getSelectedTerm();


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        studentID
                    );


                const studentSnap =
                    await getDoc(studentRef);


                if (!studentSnap.exists()) {

                    alert("Student not found.");

                    return;

                }


                const scores = {

                    AP: AP.value,

                    FIL: FIL.value,

                    HELE: HELE.value,

                    MAPEH: MAPEH.value,

                    English: English.value,

                    Mathematics: Mathematics.value,

                    Science: Science.value,

                    GMRC: GMRC.value

                };


                await setDoc(
                    studentRef,
                    {
                        [selectedTerm]: scores
                    },
                    {
                        merge: true
                    }
                );


                alert(
                    `${selectedTerm.toUpperCase()} scores saved successfully!`
                );


                console.log(
                    "Scores saved:",
                    scores
                );


            } catch (error) {

                console.error(
                    "Error saving scores:",
                    error
                );


                alert(
                    "Error saving scores: " +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// CHANGE STUDENT PASSWORD
// ======================================================

if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        async () => {

            const studentID =
                passwordStudentID.value.trim();

            const newPassword =
                changeNewPassword.value.trim();


            if (!studentID) {

                alert(
                    "Please enter the Student ID."
                );

                return;

            }


            if (!newPassword) {

                alert(
                    "Please enter a new password."
                );

                return;

            }


            if (newPassword.length < 4) {

                alert(
                    "Password must be at least 4 characters."
                );

                return;

            }


            const confirmed = confirm(
                `Change the password for student ${studentID}?`
            );


            if (!confirmed) {
                return;
            }


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        studentID
                    );


                const studentSnap =
                    await getDoc(studentRef);


                if (!studentSnap.exists()) {

                    alert(
                        "Student ID not found."
                    );

                    return;

                }


                await updateDoc(
                    studentRef,
                    {
                        password: newPassword
                    }
                );


                alert(
                    "Student password changed successfully!"
                );


                passwordStudentID.value = "";

                changeNewPassword.value = "";


            } catch (error) {

                console.error(
                    "Error changing password:",
                    error
                );


                alert(
                    "Error changing password: " +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// ADD NEW STUDENT
// ======================================================

if (addStudentBtn) {

    addStudentBtn.addEventListener(
        "click",
        async () => {

            const studentID =
                newStudentID.value.trim();

            const name =
                newStudentName.value.trim();

            const password =
                newStudentPassword.value.trim();


            if (!studentID) {

                alert(
                    "Please enter a Student ID."
                );

                return;

            }


            if (!name) {

                alert(
                    "Please enter the student's name."
                );

                return;

            }


            if (!password) {

                alert(
                    "Please enter a password."
                );

                return;

            }


            if (password.length < 4) {

                alert(
                    "Password must be at least 4 characters."
                );

                return;

            }


            try {

                const studentRef =
                    doc(
                        db,
                        "students",
                        studentID
                    );


                const existingStudent =
                    await getDoc(studentRef);


                if (existingStudent.exists()) {

                    alert(
                        "That Student ID already exists."
                    );

                    return;

                }


                await setDoc(
                    studentRef,
                    {

                        name: name,

                        password: password

                    }
                );


                alert(
                    "Student added successfully!"
                );


                newStudentID.value = "";

                newStudentName.value = "";

                newStudentPassword.value = "";


                await loadStudentList();


            } catch (error) {

                console.error(
                    "Error adding student:",
                    error
                );


                alert(
                    "Error adding student: " +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// CHANGE TERM
// ======================================================

if (termSelect) {

    termSelect.addEventListener(
        "change",
        async () => {

            const studentID =
                studentIDInput.value.trim();


            if (!studentID) {
                return;
            }


            // Automatically reload the
            // currently selected student

            if (loadBtn) {
                loadBtn.click();
            }

        }
    );

}


// ======================================================
// INITIAL LOAD
// ======================================================

loadStudentList();

console.log(
    "Teacher Dashboard loaded successfully."
);
