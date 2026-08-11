import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const loginButton = document.getElementById("loginBtn");
const message = document.getElementById("message");
const auth = getAuth();


loginButton.addEventListener("click", async () => {

    message.innerHTML = "";

    const studentID =
        document.getElementById("studentID").value.trim();

    const password =
        document.getElementById("password").value.trim();


    // CHECK LOGIN FIELDS

    if (studentID === "" || password === "") {

        message.innerHTML =
            "Please enter Student ID and Password.";

        return;
    }


    try {

        // CREATE FIREBASE EMAIL

        const studentEmail =
            studentID + "@studentscores.local";


        // LOGIN

        await signInWithEmailAndPassword(
            auth,
            studentEmail,
            password
        );


        // GET STUDENT DOCUMENT

        const studentRef =
            doc(db, "students", studentID);


        const studentSnap =
            await getDoc(studentRef);


        // CHECK IF STUDENT EXISTS

        if (!studentSnap.exists()) {

            message.innerHTML =
                "Incorrect Student ID or Password.";

            return;
        }


        const student =
            studentSnap.data();


        // CHECK PASSWORD

        if (student.password !== password) {

            message.innerHTML =
                "Incorrect Student ID or Password.";

            return;
        }


        // =====================================
        // GET TERM 1 FROM FIRESTORE MAP
        // =====================================

        const term1 =
            student.term1 || {};


        // =====================================
        // GET TERM 2 FROM FIRESTORE MAP
        // =====================================

        const term2 =
            student.term2 || {};


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


        // GET ELEMENTS

        const termSelect =
            document.getElementById("studentTerm");


        const scoresContainer =
            document.getElementById("scoresContainer");


        const logoutButton =
            document.getElementById("logoutButton");


        // =====================================
        // DISPLAY SCORES
        // =====================================

        function displayScores(termScores) {

            const AP =
                Number(termScores.AP) || 0;

            const FIL =
                Number(termScores.FIL) || 0;

            const HELE =
                Number(termScores.HELE) || 0;

            const MUSICandArts =
                Number(termScores.MUSICandArts) || 0;

            const PEandHealth =
                Number(termScores.PEandHealth) || 0;

            const English =
                Number(termScores.English) || 0;

            const Mathematics =
                Number(termScores.Mathematics) || 0;

            const Science =
                Number(termScores.Science) || 0;

            const GMRC =
                Number(termScores.GMRC) || 0;


            // CALCULATE GENERAL AVERAGE

            const average =
                (
                    AP +
                    FIL +
                    HELE +
                    MUSICandArts +
                    PEandHealth +
                    English +
                    Mathematics +
                    Science +
                    GMRC
                ) / 9;


            // DISPLAY SCORES

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

                        </tr>


                        <tr>

                            <td>
                                Filipino
                            </td>

                            <td>
                                ${FIL}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                HELE
                            </td>

                            <td>
                                ${HELE}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Music & Arts
                            </td>

                            <td>
                                ${MUSICandArts}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                PE & Health
                            </td>

                            <td>
                                ${PEandHealth}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                English
                            </td>

                            <td>
                                ${English}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Mathematics
                            </td>

                            <td>
                                ${Mathematics}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Science
                            </td>

                            <td>
                                ${Science}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                GMRC
                            </td>

                            <td>
                                ${GMRC}
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

                } else {

                    displayScores(term2);

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

});
