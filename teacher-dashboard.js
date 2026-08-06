
import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const scoreElement = document.getElementById("score");

// Load Cleve's score from Firebase
async function loadScore() {
    const docRef = doc(db, "students", "Cleve");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        scoreElement.innerHTML = docSnap.data().score;
    }
}

// Edit and save the score
window.editScore = async function () {
    const newScore = prompt("Enter new score:");

    if (newScore === null) return;

    const docRef = doc(db, "students", "Cleve");

    await updateDoc(docRef, {
        score: Number(newScore)
    });

    scoreElement.innerHTML = newScore;

    alert("Score saved successfully!");
};

// Load the score when the page opens
loadScore();

window.logout = function () {
    window.location.href = "teacher.html";
};
