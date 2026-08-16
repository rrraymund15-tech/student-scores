import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


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


// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyCUZmbjsWOGgs8chdBOIVfoY8RNAeGwk7s",

    authDomain:
        "studentscores-c9ad1.firebaseapp.com",

    projectId:
        "studentscores-c9ad1",

    storageBucket:
        "studentscores-c9ad1.firebasestorage.app",

    messagingSenderId:
        "627785600117",

    appId:
        "1:627785600117:web:eaa750b8583929dda0fc3c"

};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


// ========================================
// CHECK TEACHER LOGIN
// ========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "teacher.html";

        }

    }
);


// ========================================
// GET HTML ELEMENTS
// ========================================

const studentIDInput =
    document.getElementById(
        "studentID"
    );


const studentName =
    document.getElementById(
        "studentName"
    );


const AP =
    document.getElementById(
        "AP"
    );


const FIL =
    document.getElementById(
        "FIL"
    );


const HELE =
    document.getElementById(
        "HELE"
    );


const MAPEH =
    document.getElementById(
        "MAPEH"
    );


const English =
    document.getElementById(
        "English"
    );


const Mathematics =
    document.getElementById(
        "Mathematics"
    );


const Science =
    document.getElementById(
        "Science"
    );


const GMRC =
    document.getElementById(
        "GMRC"
    );


const loadBtn =
    document.getElementById(
        "loadBtn"
    );


const saveBtn =
    document.getElementById(
        "saveBtn"
    );


const newStudentID =
    document.getElementById(
        "newStudentID"
    );


const newStudentName =
    document.getElementById(
        "newStudentName"
    );


const newStudentPassword =
    document.getElementById(
        "newStudentPassword"
    );


const addStudentBtn =
    document.getElementById(
        "addStudentBtn"
    );


const studentList =
    document.getElementById(
        "studentList"
    );


const studentSearch =
    document.getElementById(
        "studentSearch"
    );


const termSelect =
    document.getElementById(
        "termSelect"
    );


const passwordStudentID =
    document.getElementById(
        "passwordStudentID"
    );


const changeNewPassword =
    document.getElementById(
        "changeNewPassword"
    );


const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );


const averageValue =
    document.getElementById(
        "averageValue"
    );


// ========================================
// EXAM INPUTS
// ========================================

const examFields = {

    AP: {
        raw: document.getElementById("examAPRaw"),
        total: document.getElementById("examAPTotal"),
        equivalent: document.getElementById("examAPEquivalent")
    },

    FIL: {
        raw: document.getElementById("examFILRaw"),
        total: document.getElementById("examFILTotal"),
        equivalent: document.getElementById("examFILEquivalent")
    },

    Computer: {
        raw: document.getElementById("examComputerRaw"),
        total: document.getElementById("examComputerTotal"),
        equivalent: document.getElementById("examComputerEquivalent")
    },

    HELE: {
        raw: document.getElementById("examHELERaw"),
        total: document.getElementById("examHELETotal"),
        equivalent: document.getElementById("examHELEEquivalent")
    },

    MusicArts: {
        raw: document.getElementById("examMusicArtsRaw"),
        total: document.getElementById("examMusicArtsTotal"),
        equivalent: document.getElementById("examMusicArtsEquivalent")
    },

    PEHealth: {
        raw: document.getElementById("examPEHealthRaw"),
        total: document.getElementById("examPEHealthTotal"),
        equivalent: document.getElementById("examPEHealthEquivalent")
    },

    Mathematics: {
        raw: document.getElementById("examMathematicsRaw"),
        total: document.getElementById("examMathematicsTotal"),
        equivalent: document.getElementById("examMathematicsEquivalent")
    },

    Science: {
        raw: document.getElementById("examScienceRaw"),
        total: document.getElementById("examScienceTotal"),
        equivalent: document.getElementById("examScienceEquivalent")
    },

    English: {
        raw: document.getElementById("examEnglishRaw"),
        total: document.getElementById("examEnglishTotal"),
        equivalent: document.getElementById("examEnglishEquivalent")
    },

    GMRC: {
        raw: document.getElementById("examGMRCRaw"),
        total: document.getElementById("examGMRCTotal"),
        equivalent: document.getElementById("examGMRCEquivalent")
    }

};


function calculateExamEquivalent(field) {

    const raw = Number(field.raw.value);
    const total = Number(field.total.value);

    if (
        !Number.isFinite(raw) ||
        !Number.isFinite(total) ||
        total <= 0 ||
        raw < 0
    ) {

        field.equivalent.textContent = "—";
        return null;

    }

    const equivalent = (raw / total) * 100;

    field.equivalent.textContent =
        equivalent.toFixed(2);

    return equivalent;

}


function updateAllExamEquivalents() {

    Object.values(examFields).forEach(
        (field) => calculateExamEquivalent(field)
    );

}


function clearExamFields() {

    Object.values(examFields).forEach(
        (field) => {

            field.raw.value = "";
            field.total.value = "";
            field.equivalent.textContent = "—";

        }
    );

}


function loadExamFields(exams = {}) {

    Object.entries(examFields).forEach(
        ([key, field]) => {

            const saved =
                exams[key] || {};

            field.raw.value =
                saved.rawScore ?? "";

            field.total.value =
                saved.totalScore ?? "";

            calculateExamEquivalent(field);

        }
    );

}


function getExamScores() {

    const exams = {};

    Object.entries(examFields).forEach(
        ([key, field]) => {

            const rawText =
                field.raw.value.trim();

            const totalText =
                field.total.value.trim();

            if (
                rawText === "" &&
                totalText === ""
            ) {

                return;

            }

            const rawScore =
                Number(rawText);

            const totalScore =
                Number(totalText);

            if (
                !Number.isFinite(rawScore) ||
                !Number.isFinite(totalScore) ||
                totalScore <= 0 ||
                rawScore < 0
            ) {

                throw new Error(
                    `${key} exam: please enter a valid raw score and total score.`
                );

            }

            if (rawScore > totalScore) {

                throw new Error(
                    `${key} exam: raw score cannot be greater than total score.`
                );

            }

            exams[key] = {

                rawScore: rawScore,

                totalScore: totalScore,

                equivalent:
                    Number(
                        ((rawScore / totalScore) * 100)
                            .toFixed(2)
                    )

            };

        }
    );

    return exams;

}


Object.values(examFields).forEach(
    (field) => {

        field.raw.addEventListener(
            "input",
            () => calculateExamEquivalent(field)
        );

        field.total.addEventListener(
            "input",
            () => calculateExamEquivalent(field)
        );

    }
);



// ========================================
// SUBJECT INPUTS
// ========================================

const subjectInputs = [

    AP,

    FIL,

    HELE,

    MAPEH,

    English,

    Mathematics,

    Science,

    GMRC

];


// ========================================
// CALCULATE AVERAGE
// ========================================

function calculateAverage() {

    const scores = [
        Number(AP.value),
        Number(FIL.value),
        Number(HELE.value),
        Number(MAPEH.value),
        Number(English.value),
        Number(Mathematics.value),
        Number(Science.value),
        Number(GMRC.value)
    ];

    const validScores = scores.filter(
        (score) => Number.isFinite(score)
    );

    if (validScores.length === 0) {

        averageValue.textContent = "0.00";
        return;

    }

    const total =
        validScores.reduce(
            (sum, score) => sum + score,
            0
        );

    const average =
        total / validScores.length;

    averageValue.textContent =
        average.toFixed(2);

}

// ========================================
// UPDATE AVERAGE WHEN SCORE CHANGES
// ========================================

subjectInputs.forEach(
    (input) => {

        input.addEventListener(
            "input",
            calculateAverage
        );

    }
);


// ========================================
// CHECK REQUIRED ELEMENTS
// ========================================

if (

    !studentIDInput ||

    !studentName ||

    !AP ||

    !FIL ||

    !HELE ||

    !MAPEH ||

    !English ||

    !Mathematics ||

    !Science ||

    !GMRC ||

    !loadBtn ||

    !saveBtn ||

    !newStudentID ||

    !newStudentName ||

    !newStudentPassword ||

    !addStudentBtn ||

    !studentList ||

    !studentSearch ||

    !termSelect ||

    !passwordStudentID ||

    !changeNewPassword ||

    !changePasswordBtn ||

    !averageValue ||

    Object.values(examFields).some(
        (field) =>
            !field.raw ||
            !field.total ||
            !field.equivalent
    )

) {

    console.error(
        "Teacher Dashboard: One or more HTML elements are missing."
    );

}


// ========================================
// LOAD ALL STUDENTS
// ========================================

let allStudents = [];


async function loadStudentList() {

    try {

        const studentsRef =
            collection(
                db,
                "students"
            );


        const snapshot =
            await getDocs(
                studentsRef
            );


        allStudents = [];


        snapshot.forEach(
            (studentDoc) => {

                const data =
                    studentDoc.data();


                allStudents.push({

                    id:
                        studentDoc.id,

                    name:
                        data.name ||
                        "No name"

                });

            }
        );


        displayStudents(
            allStudents
        );


    } catch (error) {

        console.error(
            "Error loading students:",
            error
        );


        studentList.innerHTML = `
            <tr>
                <td colspan="3">
                    Error loading students.
                </td>
            </tr>
        `;

    }

}


// ========================================
// DISPLAY STUDENTS
// ========================================

function displayStudents(
    students
) {

    studentList.innerHTML =
        "";


    if (
        students.length === 0
    ) {

        studentList.innerHTML = `
            <tr>
                <td colspan="3">
                    No students found.
                </td>
            </tr>
        `;

        return;

    }


    students.forEach(
        (student) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${student.id}
                </td>

                <td>
                    ${student.name}
                </td>

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


            studentList.appendChild(
                row
            );

        }
    );


    // ====================================
    // LOAD BUTTONS
    // ====================================

    document
        .querySelectorAll(
            ".load-student-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        studentIDInput.value =
                            button.dataset.id;


                        loadBtn.click();

                    }
                );

            }
        );


    // ====================================
    // DELETE BUTTONS
    // ====================================

    document
        .querySelectorAll(
            ".delete-student-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const studentID =
                            button.dataset.id;


                        const studentNameValue =
                            button.dataset.name;


                        const confirmed =
                            confirm(
                                `Are you sure you want to delete ${studentNameValue} (${studentID})?\n\nThis will permanently delete the student's record and all scores.`
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


                            await deleteDoc(
                                studentRef
                            );


                            alert(
                                "Student deleted successfully."
                            );


                            await loadStudentList();


                        } catch (error) {

                            console.error(
                                error
                            );


                            alert(
                                "Error deleting student: " +
                                error.message
                            );

                        }

                    }
                );

            }
        );

}


// ========================================
// SEARCH STUDENTS
// ========================================

studentSearch.addEventListener(
    "input",
    () => {

        const searchText =
            studentSearch.value
                .trim()
                .toLowerCase();


        const filteredStudents =
            allStudents.filter(
                (student) => {

                    return (

                        student.id
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        student.name
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                    );

                }
            );


        displayStudents(
            filteredStudents
        );

    }
);


// ========================================
// INITIAL STUDENT LIST
// ========================================

loadStudentList();


// ========================================
// CHANGE STUDENT PASSWORD
// ========================================

changePasswordBtn.addEventListener(
    "click",
    async () => {

        const studentID =
            passwordStudentID.value.trim();


        const newPassword =
            changeNewPassword.value.trim();


        if (
            !studentID ||
            !newPassword
        ) {

            alert(
                "Please enter the Student ID and new password."
            );

            return;

        }


        if (
            newPassword.length < 4
        ) {

            alert(
                "Password must be at least 4 characters."
            );

            return;

        }


        const confirmed =
            confirm(
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
                await getDoc(
                    studentRef
                );


            if (
                !studentSnap.exists()
            ) {

                alert(
                    "Student ID not found."
                );

                return;

            }


            await updateDoc(
                studentRef,
                {

                    password:
                        newPassword

                }
            );


            alert(
                "Student password changed successfully."
            );


            passwordStudentID.value =
                "";


            changeNewPassword.value =
                "";


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Error changing password: " +
                error.message
            );

        }

    }
);


// ========================================
// LOAD STUDENT
// ========================================

loadBtn.addEventListener(
    "click",
    async () => {

        const studentID =
            studentIDInput.value.trim();


        if (!studentID) {

            alert(
                "Please enter a student ID."
            );

            return;

        }


        try {

            const docRef =
                doc(
                    db,
                    "students",
                    studentID
                );


            const docSnap =
                await getDoc(
                    docRef
                );


            if (
                !docSnap.exists()
            ) {

                alert(
                    "Student not found."
                );

                return;

            }


            const data =
                docSnap.data();


            studentName.textContent =
                data.name ||
                "No name";


            const selectedTerm =
                termSelect.value;


            let termScores = {};


            if (
                selectedTerm === "term1"
            ) {

                termScores =
                    data.term1 ||
                    data;

            } else {

                termScores =
                    data[selectedTerm] ||
                    {};

            }


            // =================================
            // LOAD SUBJECT SCORES
            // =================================

            AP.value =
                termScores.AP ?? 0;


            FIL.value =
                termScores.FIL ?? 0;


            HELE.value =
                termScores.HELE ?? 0;


            MAPEH.value =
                termScores.MAPEH ?? 0;


            English.value =
                termScores.English ?? 0;


            Mathematics.value =
                termScores.Mathematics ?? 0;


            Science.value =
                termScores.Science ?? 0;


            GMRC.value =
                termScores.GMRC ?? 0;


            // =================================
            // LOAD EXAM SCORES
            // =================================

            loadExamFields(
                termScores.exams || {}
            );


            // =================================
            // CALCULATE AVERAGE
            // =================================

            calculateAverage();


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Error loading student: " +
                error.message
            );

        }

    }
);


// ========================================
// SAVE SCORES
// ========================================

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


        try {

            const docRef =
                doc(
                    db,
                    "students",
                    studentID
                );


            const selectedTerm =
                termSelect.value;


            const scoresToSave = {

                AP:
                    Number(
                        AP.value
                    ) || 0,

                FIL:
                    Number(
                        FIL.value
                    ) || 0,

                HELE:
                    Number(
                        HELE.value
                    ) || 0,

                MAPEH:
                    Number(
                        MAPEH.value
                    ) || 0,

                English:
                    Number(
                        English.value
                    ) || 0,

                Mathematics:
                    Number(
                        Mathematics.value
                    ) || 0,

                Science:
                    Number(
                        Science.value
                    ) || 0,

                GMRC:
                    Number(
                        GMRC.value
                    ) || 0

            };


            let examsToSave;

            try {

                examsToSave =
                    getExamScores();

            } catch (examError) {

                alert(examError.message);
                return;

            }


            // Preserve the existing term structure and
            // add exams separately. Existing grades are
            // never replaced by exam scores.

            const existingSnap =
                await getDoc(docRef);

            const existingData =
                existingSnap.exists()
                    ? existingSnap.data()
                    : {};

            const existingTerm =
                existingData[selectedTerm] || {};


            await updateDoc(
                docRef,
                {

                    [selectedTerm]: {
                        ...existingTerm,
                        ...scoresToSave,
                        exams: examsToSave
                    }

                }
            );


            // =================================
            // UPDATE AVERAGE
            // =================================

            calculateAverage();


            if (
                selectedTerm === "term1"
            ) {

                alert(
                    "Term 1 scores saved successfully!"
                );

            }

            else if (
                selectedTerm === "term2"
            ) {

                alert(
                    "Term 2 scores saved successfully!"
                );

            }

            else if (
                selectedTerm === "term3"
            ) {

                alert(
                    "Term 3 scores saved successfully!"
                );

            }

            else {

                alert(
                    "Scores saved successfully!"
                );

            }


        } catch (error) {

            console.error(
                "ERROR SAVING SCORES:",
                error
            );


            alert(
                "Error saving scores: " +
                error.message
            );

        }

    }
);


// ========================================
// ADD NEW STUDENT
// ========================================

addStudentBtn.addEventListener(
    "click",
    async () => {

        const id =
            newStudentID.value.trim();


        const name =
            newStudentName.value.trim();


        const password =
            newStudentPassword.value.trim();


        if (
            !id ||
            !name ||
            !password
        ) {

            alert(
                "Please enter Student ID, Name, and Password."
            );

            return;

        }


        try {

            const studentRef =
                doc(
                    db,
                    "students",
                    id
                );


            const existingStudent =
                await getDoc(
                    studentRef
                );


            if (
                existingStudent.exists()
            ) {

                alert(
                    "That Student ID already exists."
                );

                return;

            }


            // =================================
            // CREATE STUDENT
            // =================================

            await setDoc(
                studentRef,
                {

                    name:
                        name,

                    password:
                        password,


                    term1: {

                        AP: 0,

                        FIL: 0,

                        HELE: 0,

                        MAPEH: 0,

                        English: 0,

                        Mathematics: 0,

                        Science: 0,

                        GMRC: 0,

                        exams: {}

                    },


                    term2: {

                        AP: 0,

                        FIL: 0,

                        HELE: 0,

                        MAPEH: 0,

                        English: 0,

                        Mathematics: 0,

                        Science: 0,

                        GMRC: 0,

                        exams: {}

                    },


                    term3: {

                        AP: 0,

                        FIL: 0,

                        HELE: 0,

                        MAPEH: 0,

                        English: 0,

                        Mathematics: 0,

                        Science: 0,

                        GMRC: 0

                    }

                }
            );


            alert(
                "Student added successfully!"
            );


            newStudentID.value =
                "";


            newStudentName.value =
                "";


            newStudentPassword.value =
                "";


            await loadStudentList();


        } catch (error) {

            console.error(
                error
            );


            alert(
                "Error adding student: " +
                error.message
            );

        }

    }
);
