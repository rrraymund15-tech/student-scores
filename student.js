import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


// =====================================
// LOGIN ELEMENTS
// =====================================

const loginButton =
    document.getElementById("loginBtn");

const message =
    document.getElementById("message");

const auth =
    getAuth();


// =====================================
// STUDENT LOGIN
// =====================================

loginButton.addEventListener(
    "click",
    async () => {

        message.innerHTML = "";

        const studentID =
            document
                .getElementById("studentID")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value
                .trim();


        // =====================================
        // CHECK LOGIN FIELDS
        // =====================================

        if (
            studentID === "" ||
            password === ""
        ) {

            message.innerHTML =
                "Please enter Student ID and Password.";

            return;
        }


        try {

            // =====================================
            // CREATE FIREBASE EMAIL
            // =====================================

            const studentEmail =
                studentID + "@studentscores.local";


            // =====================================
            // LOGIN
            // =====================================

            await signInWithEmailAndPassword(
                auth,
                studentEmail,
                password
            );


            // =====================================
            // GET STUDENT DOCUMENT
            // =====================================

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


            // =====================================
            // CHECK IF STUDENT EXISTS
            // =====================================

            if (
                !studentSnap.exists()
            ) {

                message.innerHTML =
                    "Incorrect Student ID or Password.";

                return;
            }


            const student =
                studentSnap.data();


         


            // =====================================
            // GET TERMS
            // =====================================

            const term1 =
                student.term1 || {};

            const term2 =
                student.term2 || {};

            const term3 =
                student.term3 || {};


            // =====================================
            // DISPLAY STUDENT DASHBOARD
            // =====================================

            document.body.innerHTML = `

                <div class="student-dashboard">

                    <div class="student-header">

                        <div class="school-info">

                            <h2>
                                SHILOH CHRISTIAN SCHOOL
                            </h2>

                            <p>
                                Student Score Portal
                            </p>

                            <p>
                                School Year: 2026–2027
                            </p>

                        </div>


                        <h1>
                            Student Scores
                        </h1>


                        <h2>
                            ${student.name || "Student"}
                        </h2>


                        <p>
                            Student ID:
                            <strong>
                                ${studentID}
                            </strong>
                        </p>

                    </div>


                    <div class="score-card">

                        <h2>
                            My Scores
                        </h2>


                        <label for="studentTerm">
                            Select Term:
                        </label>


                        <select id="studentTerm">

                            <option value="term1">
                                Term 1
                            </option>

                            <option value="term2">
                                Term 2
                            </option>

                            <option value="term3">
                                Term 3
                            </option>

                        </select>


                        <div id="scoresContainer"></div>


                        <button
                            id="logoutButton"
                            type="button"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            `;


            // =====================================
            // GET ELEMENTS
            // =====================================

            const termSelect =
                document.getElementById(
                    "studentTerm"
                );


            const scoresContainer =
                document.getElementById(
                    "scoresContainer"
                );


            const logoutButton =
                document.getElementById(
                    "logoutButton"
                );


            // =====================================
            // DISPLAY SCORES
            // =====================================

            function displayScores(termScores) {

                // =================================
                // REGULAR SUBJECT SCORES
                // =================================

                const AP =
                    Number(termScores.AP) || 0;

                const FIL =
                    Number(termScores.FIL) || 0;

                const HELE =
                    Number(termScores.HELE) || 0;

                const MAPEH =
                    Number(termScores.MAPEH) || 0;

                const English =
                    Number(termScores.English) || 0;

                const Mathematics =
                    Number(termScores.Mathematics) || 0;

                const Science =
                    Number(termScores.Science) || 0;

                const GMRC =
                    Number(termScores.GMRC) || 0;


                // =================================
                // EXAM DATA
                // =================================

                const exams =
                    termScores.exams || {};


                // =================================
                // GET EXAM DISPLAY
                // =================================

                function getExamData(subject) {

                    const exam =
                        exams[subject];


                    if (
                        !exam ||
                        exam.rawScore === undefined ||
                        exam.totalScore === undefined
                    ) {

                        return {
                            score: "—",
                            equivalent: "—"
                        };

                    }


                    const raw =
                        Number(exam.rawScore);

                    const total =
                        Number(exam.totalScore);


                    if (
                        !Number.isFinite(raw) ||
                        !Number.isFinite(total) ||
                        total <= 0
                    ) {

                        return {
                            score: "—",
                            equivalent: "—"
                        };

                    }


                    let equivalent;


                    if (
                        exam.equivalent !== undefined &&
                        Number.isFinite(
                            Number(exam.equivalent)
                        )
                    ) {

                        equivalent =
                            Number(exam.equivalent);

                    } else {

                        equivalent =
                            (raw / total) * 100;

                    }


                    return {

                        score:
                            `${raw} / ${total}`,

                        equivalent:
                            equivalent.toFixed(2)

                    };

                }


                // =================================
                // GET EACH EXAM
                // =================================

                const APExam =
                    getExamData("AP");

                const FILExam =
                    getExamData("FIL");

                const HELEExam =
                    getExamData("HELE");

               const MusicArtsExam =
    getExamData("MusicArts");

const PEHealthExam =
    getExamData("PEHealth");
                const EnglishExam =
                    getExamData("English");

                const MathematicsExam =
                    getExamData("Mathematics");

                const ScienceExam =
                    getExamData("Science");

                const GMRCExam =
                    getExamData("GMRC");


                // =================================
                // GENERAL AVERAGE
                // =================================

                const scores = [

                    AP,
                    FIL,
                    HELE,
                    MAPEH,
                    English,
                    Mathematics,
                    Science,
                    GMRC

                ];


                const total =
                    scores.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    );


                const average =
                    total / scores.length;


                // =================================
                // DISPLAY TABLE
                // =================================

                scoresContainer.innerHTML = `

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Subject
                                </th>

                                <th>
                                    Score
                                </th>

                                <th>
                                    Exam
                                </th>

                                <th>
                                    Equivalent
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            <tr>

                                <td>
                                    Araling Panlipunan
                                </td>

                                <td>
                                    ${AP}
                                </td>

                                <td>
                                    ${APExam.score}
                                </td>

                                <td>
                                    ${APExam.equivalent}
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    Filipino
                                </td>

                                <td>
                                    ${FIL}
                                </td>

                                <td>
                                    ${FILExam.score}
                                </td>

                                <td>
                                    ${FILExam.equivalent}
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    HELE
                                </td>

                                <td>
                                    ${HELE}
                                </td>

                                <td>
                                    ${HELEExam.score}
                                </td>

                                <td>
                                    ${HELEExam.equivalent}
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    MAPEH
                                </td>

                                <td>
                                    ${MAPEH}
                                </td>

                                <td>
                               <td>
    <div>
        <strong>M/A:</strong>
        ${MusicArtsExam.score}
    </div>
    <div>
        <strong>PE/H:</strong>
        ${PEHealthExam.score}
    </div>
</td>

<td>
    <div>
        <strong>M/A:</strong>
        ${MusicArtsExam.equivalent}
    </div>
    <div>
        <strong>PE/H:</strong>
        ${PEHealthExam.equivalent}
    </div>
</td>

                            </tr>


                            <tr>

                                <td>
                                    English
                                </td>

                                <td>
                                    ${English}
                                </td>

                                <td>
                                    ${EnglishExam.score}
                                </td>

                                <td>
                                    ${EnglishExam.equivalent}
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    Mathematics
                                </td>

                                <td>
                                    ${Mathematics}
                                </td>

                                <td>
                                    ${MathematicsExam.score}
                                </td>

                                <td>
                                    ${MathematicsExam.equivalent}
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    Science
                                </td>

                                <td>
                                    ${Science}
                                </td>

                                <td>
                                    ${ScienceExam.score}
                                </td>

                                <td>
                                    ${ScienceExam.equivalent}
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    GMRC
                                </td>

                                <td>
                                    ${GMRC}
                                </td>

                                <td>
                                    ${GMRCExam.score}
                                </td>

                                <td>
                                    ${GMRCExam.equivalent}
                                </td>

                            </tr>


                        </tbody>

                    </table>


                    <div class="average">

                        <strong>
                            General Average:
                        </strong>

                        <span>
                            ${average.toFixed(2)}
                        </span>

                    </div>

                `;

            }


            // =====================================
            // SHOW TERM 1 FIRST
            // =====================================

            displayScores(term1);


            // =====================================
            // CHANGE TERM
            // =====================================

            termSelect.addEventListener(
                "change",
                () => {

                    if (
                        termSelect.value === "term1"
                    ) {

                        displayScores(term1);

                    }

                    else if (
                        termSelect.value === "term2"
                    ) {

                        displayScores(term2);

                    }

                    else {

                        displayScores(term3);

                    }

                }
            );


            // =====================================
            // LOGOUT
            // =====================================

            logoutButton.addEventListener(
                "click",
                () => {

                    location.reload();

                }
            );


        }


        // =====================================
        // ERROR HANDLING
        // =====================================

        catch (error) {

            console.error(
                "FIREBASE ERROR:",
                error
            );


            message.innerHTML =
                "Incorrect Student ID or Password.";

        }

    }
);
