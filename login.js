const STUDENTS = {

    "rahul@gmail.com": {
        password: "Rahul@123",
        name: "Rahul",
        courses: ["real-analysis"]
    },

    "amit@gmail.com": {
        password: "Amit@456",
        name: "Amit",
        courses: ["linear-algebra", "calculus"]
    },

    "neha@gmail.com": {
        password: "Neha@789",
        name: "Neha",
        courses: ["real-analysis", "calculus"]
    }

};


const loginForm = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");


loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    const student = STUDENTS[email];


    if (!student) {

        message.textContent = "Email not found.";
        return;

    }


    if (student.password !== password) {

        message.textContent = "Incorrect password.";
        return;

    }


    sessionStorage.setItem("loggedInStudent", email);

    window.location.href = "dashboard.html";

});