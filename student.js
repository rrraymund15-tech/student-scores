import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const loginButton = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginButton.addEventListener("click", async () => {

    message.innerHTML = "";

    const studentID = document.getElementById("studentID").value.trim();
    const password = document.getElementById("password").value.trim();

    if(studentID === "" || password === ""){
        message.innerHTML = "Please enter Student ID and Password.";
        return;
    }

    try{

        const studentRef = doc(db,"students",studentID);
        const studentSnap = await getDoc(studentRef);

        if(!studentSnap.exists()){
            message.innerHTML = "Student not found.";
            return;
        }

        const student = studentSnap.data();

        if(student.password !== password){
            message.innerHTML = "Incorrect password.";
            return;
        }

        // Login Successful
        document.body.innerHTML = `

        <div class="container">

        <h1>${student.name}</h1>

        <table border="1" width="100%" cellpadding="10">

        <tr>
        <th>Subject</th>
        <th>Score</th>
        </tr>

        <tr>
        <td>AP</td>
        <td>${student.AP}</td>
        </tr>

        <tr>
        <td>FIL</td>
        <td>${student.FIL}</td>
        </tr>

        <tr>
        <td>HELE</td>
        <td>${student.HELE}</td>
        </tr>

        <tr>
        <td>MUSIC / ARTS</td>
        <td>${student.MUSICandArts}</td>
        </tr>

        <tr>
        <td>PE / HEALTH</td>
        <td>${student.PEandHealth}</td>
        </tr>

        </table>

        <br>

        <button onclick="location.reload()">
        Logout
        </button>

        </div>

        `;

    }

    catch(error){

        console.error(error);

        message.innerHTML="Error connecting to Firebase.";

    }

});