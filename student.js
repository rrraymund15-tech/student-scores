import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const loginButton = document.getElementById("loginBtn");
const message = document.getElementById("message");


loginButton.addEventListener("click", async () => {

    message.innerHTML = "";

    const studentID = document.getElementById("studentID").value.trim();
    const password = document.getElementById("password").value.trim();


    if (studentID === "" || password === "") {

        message.innerHTML = "Please enter Student ID and Password.";

        return;
    }


    try {

        const studentRef = doc(db, "students", studentID);
        const studentSnap = await getDoc(studentRef);


        if (!studentSnap.exists()) {

            message.innerHTML = "Student not found.";

            return;
        }


        const student = studentSnap.data();


        if (student.password !== password) {

            message.innerHTML = "Incorrect password.";

            return;
        }


        // Get scores

        const AP = Number(student.AP) || 0;
        const FIL = Number(student.FIL) || 0;
        const HELE = Number(student.HELE) || 0;
        const MUSICandArts = Number(student.MUSICandArts) || 0;
        const PEandHealth = Number(student.PEandHealth) || 0;
        const English = Number(student.English) || 0;
        const Mathematics = Number(student.Mathematics) || 0;
        const Science = Number(student.Science) || 0;
        const GMRC = Number(student.GMRC) || 0;

        // Calculate average

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


        // Display student dashboard

        document.body.innerHTML = `

        <div class="student-dashboard">

           <div class="student-header">

    <div class="school-info">

        <h2>SHILOH CHRISTIAN SCHOOL</h2>

        <p>Student Score Portal</p>

        <p>School Year: 2026–2027</p>

    </div>

    <h1>Student Scores</h1>

                <h2>${student.name}</h2>

                <p>
                    Student ID: <strong>${studentID}</strong>
                </p>

            </div>


            <div class="score-card">

                <h2>My Scores</h2>

                <table>

                    <tr>
                        <th>Subject</th>
                        <th>Score</th>
                    </tr>

                    <tr>
                        <td>Araling Panlipunan</td>
                        <td>${AP}</td>
                    </tr>

                    <tr>
                        <td>Filipino</td>
                        <td>${FIL}</td>
                    </tr>

                    <tr>
                        <td>HELE</td>
                        <td>${HELE}</td>
                    </tr>

                    <tr>
                        <td>Music & Arts</td>
                        <td>${MUSICandArts}</td>
                    </tr>

                    <tr>
                        <td>PE & Health</td>
                        <td>${PEandHealth}</td>
                    </tr>
                    <tr>
    <td>English</td>
    <td>${English}</td>
</tr>

<tr>
    <td>Mathematics</td>
    <td>${Mathematics}</td>
</tr>

<tr>
    <td>Science</td>
    <td>${Science}</td>
</tr>

<tr>
    <td>GMRC</td>
    <td>${GMRC}</td>
</tr>
                </table>


                <div class="average">

                    <strong>General Average:</strong>

                    <span>${average.toFixed(2)}</span>

                </div>


                <button onclick="location.reload()">
                    Logout
                </button>

            </div>

        </div>

        `;

    }


    catch (error) {

        console.error(error);

        message.innerHTML =
            "Error connecting to Firebase.";

    }

});
