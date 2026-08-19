import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
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

                const ComputerExam =
                    getExamData("Computer");

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
                // SUMMATIVE TEST DATA
                // =================================

                /*
                    The system supports these structures:

                    summativeTest1
                    summativeTest2

                    OR

                    summative1
                    summative2

                    OR older/nested structures such as:

                    summative.test1
                    summative.test2

                    This makes the student portal
                    more tolerant of the data already
                    stored in Firestore.
                */


              function getSummativeTest1Data() {

    // =================================
    // NEW STRUCTURE
    // summativeTests.test1
    // =================================

    if (
        termScores.summativeTests &&
        termScores.summativeTests.test1 &&
        typeof termScores.summativeTests.test1 === "object"
    ) {

        return termScores.summativeTests.test1;

    }


    // =================================
    // OTHER POSSIBLE STRUCTURES
    // =================================

    if (
        termScores.summativeTest1 &&
        typeof termScores.summativeTest1 === "object"
    ) {

        return termScores.summativeTest1;

    }


    if (
        termScores.summative1 &&
        typeof termScores.summative1 === "object"
    ) {

        return termScores.summative1;

    }


    if (
        termScores.summative &&
        termScores.summative.test1 &&
        typeof termScores.summative.test1 === "object"
    ) {

        return termScores.summative.test1;

    }


    if (
        termScores.summative &&
        termScores.summative.summativeTest1 &&
        typeof termScores.summative.summativeTest1 === "object"
    ) {

        return termScores.summative.summativeTest1;

    }


    // =================================
    // OLD STRUCTURE
    // summative = Test 1
    // =================================

    if (
        termScores.summative &&
        typeof termScores.summative === "object"
    ) {

        return termScores.summative;

    }


    return {};

}


function getSummativeTest2Data() {

    // =================================
    // NEW STRUCTURE
    // summativeTests.test2
    // =================================

    if (
        termScores.summativeTests &&
        termScores.summativeTests.test2 &&
        typeof termScores.summativeTests.test2 === "object"
    ) {

        return termScores.summativeTests.test2;

    }


    // =================================
    // OTHER POSSIBLE STRUCTURES
    // =================================

    if (
        termScores.summativeTest2 &&
        typeof termScores.summativeTest2 === "object"
    ) {

        return termScores.summativeTest2;

    }


    if (
        termScores.summative2 &&
        typeof termScores.summative2 === "object"
    ) {

        return termScores.summative2;

    }


    if (
        termScores.summative &&
        termScores.summative.test2 &&
        typeof termScores.summative.test2 === "object"
    ) {

        return termScores.summative.test2;

    }


    if (
        termScores.summative &&
        termScores.summative.summativeTest2 &&
        typeof termScores.summative.summativeTest2 === "object"
    ) {

        return termScores.summative.summativeTest2;

    }


    return {};

}


const summativeTest1 =
    getSummativeTest1Data();


const summativeTest2 =
    getSummativeTest2Data();

                // =================================
                // GET SUMMATIVE DISPLAY
                // =================================

                function getSummativeData(
                    summativeData,
                    subject
                ) {

                    const test =
                        summativeData[subject];


                    if (
                        !test ||
                        test.rawScore === undefined ||
                        test.totalScore === undefined
                    ) {

                        return {

                            score: "—",

                            equivalent: "—"

                        };

                    }


                    const raw =
                        Number(test.rawScore);

                    const total =
                        Number(test.totalScore);


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
                        test.equivalent !== undefined &&
                        Number.isFinite(
                            Number(test.equivalent)
                        )
                    ) {

                        equivalent =
                            Number(test.equivalent);

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
                // SUMMATIVE TEST 1
                // =================================

                const APTest1 =
                    getSummativeData(
                        summativeTest1,
                        "AP"
                    );

                const FILTest1 =
                    getSummativeData(
                        summativeTest1,
                        "FIL"
                    );

                const ComputerTest1 =
                    getSummativeData(
                        summativeTest1,
                        "Computer"
                    );

                const HELETest1 =
                    getSummativeData(
                        summativeTest1,
                        "HELE"
                    );

                const MusicArtsTest1 =
                    getSummativeData(
                        summativeTest1,
                        "MusicArts"
                    );

                const PEHealthTest1 =
                    getSummativeData(
                        summativeTest1,
                        "PEHealth"
                    );

                const MathematicsTest1 =
                    getSummativeData(
                        summativeTest1,
                        "Mathematics"
                    );

                const ScienceTest1 =
                    getSummativeData(
                        summativeTest1,
                        "Science"
                    );

                const EnglishTest1 =
                    getSummativeData(
                        summativeTest1,
                        "English"
                    );

                const GMRCtest1 =
                    getSummativeData(
                        summativeTest1,
                        "GMRC"
                    );


                // =================================
                // SUMMATIVE TEST 2
                // =================================

                const APTest2 =
                    getSummativeData(
                        summativeTest2,
                        "AP"
                    );

                const FILTest2 =
                    getSummativeData(
                        summativeTest2,
                        "FIL"
                    );

                const ComputerTest2 =
                    getSummativeData(
                        summativeTest2,
                        "Computer"
                    );

                const HELETest2 =
                    getSummativeData(
                        summativeTest2,
                        "HELE"
                    );

                const MusicArtsTest2 =
                    getSummativeData(
                        summativeTest2,
                        "MusicArts"
                    );

                const PEHealthTest2 =
                    getSummativeData(
                        summativeTest2,
                        "PEHealth"
                    );

                const MathematicsTest2 =
                    getSummativeData(
                        summativeTest2,
                        "Mathematics"
                    );

                const ScienceTest2 =
                    getSummativeData(
                        summativeTest2,
                        "Science"
                    );

                const EnglishTest2 =
                    getSummativeData(
                        summativeTest2,
                        "English"
                    );

                const GMRCtest2 =
                    getSummativeData(
                        summativeTest2,
                        "GMRC"
                    );


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
                // DISPLAY EVERYTHING
                // =================================

                scoresContainer.innerHTML = `

                    <!-- =================================
                         REGULAR SUBJECT SCORES
                    ================================== -->

                    <h3>
                        Subject Scores
                    </h3>


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

                                    <div>
                                        <strong>
                                            M/A:
                                        </strong>

                                        ${MusicArtsExam.score}
                                    </div>

                                    <div>
                                        <strong>
                                            PE/H:
                                        </strong>

                                        ${PEHealthExam.score}
                                    </div>

                                </td>

                                <td>

                                    <div>
                                        <strong>
                                            M/A:
                                        </strong>

                                        ${MusicArtsExam.equivalent}
                                    </div>

                                    <div>
                                        <strong>
                                            PE/H:
                                        </strong>

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


                    <!-- =================================
                         SUMMATIVE TEST 1
                    ================================== -->

                    <h3 style="margin-top: 30px;">
                        Summative Test 1 Scores
                    </h3>


                    <p>
                        Summative Test 1 scores are
                        displayed for viewing only.
                    </p>


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
                                    Equivalent
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            <tr>
                                <td>Araling Panlipunan</td>
                                <td>${APTest1.score}</td>
                                <td>${APTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Filipino</td>
                                <td>${FILTest1.score}</td>
                                <td>${FILTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Computer</td>
                                <td>${ComputerTest1.score}</td>
                                <td>${ComputerTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>HELE</td>
                                <td>${HELETest1.score}</td>
                                <td>${HELETest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Music/Arts</td>
                                <td>${MusicArtsTest1.score}</td>
                                <td>${MusicArtsTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>PE/Health</td>
                                <td>${PEHealthTest1.score}</td>
                                <td>${PEHealthTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Mathematics</td>
                                <td>${MathematicsTest1.score}</td>
                                <td>${MathematicsTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Science</td>
                                <td>${ScienceTest1.score}</td>
                                <td>${ScienceTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>English</td>
                                <td>${EnglishTest1.score}</td>
                                <td>${EnglishTest1.equivalent}</td>
                            </tr>


                            <tr>
                                <td>GMRC</td>
                                <td>${GMRCtest1.score}</td>
                                <td>${GMRCtest1.equivalent}</td>
                            </tr>


                        </tbody>

                    </table>


                    <!-- =================================
                         SUMMATIVE TEST 2
                    ================================== -->

                    <h3 style="margin-top: 30px;">
                        Summative Test 2 Scores
                    </h3>


                    <p>
                        Summative Test 2 scores are
                        displayed for viewing only.
                    </p>


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
                                    Equivalent
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            <tr>
                                <td>Araling Panlipunan</td>
                                <td>${APTest2.score}</td>
                                <td>${APTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Filipino</td>
                                <td>${FILTest2.score}</td>
                                <td>${FILTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Computer</td>
                                <td>${ComputerTest2.score}</td>
                                <td>${ComputerTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>HELE</td>
                                <td>${HELETest2.score}</td>
                                <td>${HELETest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Music/Arts</td>
                                <td>${MusicArtsTest2.score}</td>
                                <td>${MusicArtsTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>PE/Health</td>
                                <td>${PEHealthTest2.score}</td>
                                <td>${PEHealthTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Mathematics</td>
                                <td>${MathematicsTest2.score}</td>
                                <td>${MathematicsTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>Science</td>
                                <td>${ScienceTest2.score}</td>
                                <td>${ScienceTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>English</td>
                                <td>${EnglishTest2.score}</td>
                                <td>${EnglishTest2.equivalent}</td>
                            </tr>


                            <tr>
                                <td>GMRC</td>
                                <td>${GMRCtest2.score}</td>
                                <td>${GMRCtest2.equivalent}</td>
                            </tr>


                        </tbody>

                    </table>

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
                async () => {

                    try {

                        await signOut(auth);

                        location.reload();

                    } catch (error) {

                        console.error(
                            "LOGOUT ERROR:",
                            error
                        );

                        location.reload();

                    }

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
