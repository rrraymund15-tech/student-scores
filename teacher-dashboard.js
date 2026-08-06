// Import Firebase
import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Get elements
const studentIDInput = document.getElementById("studentID");
const studentName = document.getElementById("studentName");

const AP = document.getElementById("AP");
const FIL = document.getElementById("FIL");
const HELE = document.getElementById("HELE");
const MUSICandArts = document.getElementById("MUSICandArts");
const PEandHealth = document.getElementById("PEandHealth");

const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");

// Load student from Firestore
loadBtn.addEventListener("click", async () => {

  const studentID = studentIDInput.value.trim();

  if (!studentID) {
    alert("Please enter a student ID");
    return;
  }

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

  } else {

    alert("Student not found");

  }

});

// Save changes to Firestore
saveBtn.addEventListener("click", async () => {

  const studentID = studentIDInput.value.trim();

  if (!studentID) {
    alert("Please load a student first");
    return;
  }

  const docRef = doc(db, "students", studentID);

  await updateDoc(docRef, {
    AP: Number(AP.value),
    FIL: Number(FIL.value),
    HELE: Number(HELE.value),
    MUSICandArts: Number(MUSICandArts.value),
    PEandHealth: Number(PEandHealth.value)
  });

  alert("Scores saved successfully!");

});
