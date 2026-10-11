let students = [
    {
        name: "John Banda",
        regNumber: "DAE001",
        email: "john@example.com",
        programme: "ICT",
        gender: "Male"
    },
    {
        name: "Mary Phiri",
        regNumber: "DAE002",
        email: "mary@example.com",
        programme: "Business",
        gender: "Female"
    },
    {
        name: "Peter Zulu",
        regNumber: "DAE003",
        email: "peter@example.com",
        programme: "ICT",
        gender: "Male"
    },
    {
        name: "Grace Moyo",
        regNumber: "DAE004",
        email: "grace@example.com",
        programme: "Accounting",
        gender: "Female"
    },
    {
        name: "David Chirwa",
        regNumber: "DAE005",
        email: "david@example.com",
        programme: "ICT",
        gender: "Male"
    }
];

const studentStorageKey = "studentPortal.students";

try {
    const savedStudents = JSON.parse(localStorage.getItem(studentStorageKey));
    if (Array.isArray(savedStudents) && savedStudents.every(function(student) {
        return student &&
            typeof student.name === "string" &&
            typeof student.regNumber === "string" &&
            typeof student.email === "string" &&
            typeof student.programme === "string" &&
            typeof student.gender === "string";
    })) {
        students = savedStudents;
    }
} catch (error) {
    // Keep the starter records if saved browser data is unavailable or invalid.
}

const studentTable = document.getElementById("studentTable");
const studentForm = document.getElementById("studentForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const cancelEditButton = document.getElementById("cancelEditButton");
let editingRegNumber = null;
let selectedRegNumber = null;

function saveStudents() {
    try {
        localStorage.setItem(studentStorageKey, JSON.stringify(students));
    } catch (error) {
        message.textContent = "Could not save student changes in this browser.";
    }
}

function showStudentInformation(student) {
    selectedRegNumber = student.regNumber;
    document.getElementById("infoName").textContent = student.name;
    document.getElementById("infoRegNumber").textContent = student.regNumber;
    document.getElementById("infoEmail").textContent = student.email;
    document.getElementById("infoProgramme").textContent = student.programme;
    document.getElementById("infoGender").textContent = student.gender;
}

function clearStudentInformation() {
    selectedRegNumber = null;
    document.getElementById("infoName").textContent = "Select a student name";
    document.getElementById("infoRegNumber").textContent = "-";
    document.getElementById("infoEmail").textContent = "-";
    document.getElementById("infoProgramme").textContent = "-";
    document.getElementById("infoGender").textContent = "-";
}

function startEditing(student) {
    editingRegNumber = student.regNumber;
    document.getElementById("name").value = student.name;
    document.getElementById("regNumber").value = student.regNumber;
    document.getElementById("email").value = student.email;
    document.getElementById("programme").value = student.programme;
    document.getElementById("gender").value = student.gender;
    submitButton.textContent = "Save Changes";
    cancelEditButton.hidden = false;
    message.textContent = "Editing " + student.name;
    document.getElementById("register").scrollIntoView({ behavior: "smooth" });
}

function resetEditMode() {
    editingRegNumber = null;
    studentForm.reset();
    submitButton.textContent = "Register Student";
    cancelEditButton.hidden = true;
}

function displayStudents() {
    studentTable.replaceChildren();

    students.forEach(function(student) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const nameButton = document.createElement("button");
        nameButton.type = "button";
        nameButton.className = "student-name-button";
        nameButton.textContent = student.name;
        nameButton.setAttribute("aria-label", "Show information for " + student.name);
        nameButton.addEventListener("click", function() {
            showStudentInformation(student);
        });
        nameCell.appendChild(nameButton);
        row.appendChild(nameCell);

        [
            student.regNumber,
            student.email,
            student.programme,
            student.gender
        ].forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionsCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function() {
            startEditing(student);
        });
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function() {
            students.splice(students.indexOf(student), 1);
            saveStudents();
            if (selectedRegNumber === student.regNumber) {
                clearStudentInformation();
            }
            if (editingRegNumber === student.regNumber) {
                resetEditMode();
                message.textContent = "Student deleted.";
            }
            displayStudents();
        });
        actionsCell.append(editButton, deleteButton);
        row.appendChild(actionsCell);

        studentTable.appendChild(row);
    });
}

studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const regNumber = document.getElementById("regNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const programme = document.getElementById("programme").value;
    const gender = document.getElementById("gender").value;

    const exists = students.some(function(student) {
        return student.regNumber.toLowerCase() === regNumber.toLowerCase() &&
               student.regNumber !== editingRegNumber;
    });

    if (exists) {
        message.textContent =
            "Error: Registration number already exists.";
        return;
    }

    const updatedStudent = {
        name: name,
        regNumber: regNumber,
        email: email,
        programme: programme,
        gender: gender
    };

    if (editingRegNumber) {
        const studentIndex = students.findIndex(function(student) {
            return student.regNumber === editingRegNumber;
        });
        students[studentIndex] = updatedStudent;
        showStudentInformation(updatedStudent);
        message.textContent = "Student details updated successfully!";
        resetEditMode();
    } else {
        students.push(updatedStudent);
        message.textContent = "Student registered successfully!";
        studentForm.reset();
    }

    saveStudents();
    displayStudents();
});

cancelEditButton.addEventListener("click", function() {
    resetEditMode();
    message.textContent = "Edit cancelled.";
});

displayStudents();
