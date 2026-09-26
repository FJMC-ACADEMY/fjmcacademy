import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


/* =========================================================
   COURSES
========================================================= */

const COURSES = {

    "real-analysis": {
        title: "Real Analysis",
        description: "Complete Real Analysis Course"
    },

    "linear-algebra": {
        title: "Linear Algebra",
        description: "Complete Linear Algebra Course"
    },

    "calculus": {
        title: "Calculus",
        description: "Complete Calculus Course"
    }

};


/* =========================================================
   ADMIN UID
=========================================================

   IMPORTANT:

   Yahan apne Firebase Authentication
   wale ADMIN user ka UID paste karna hai.

========================================================= */

const ADMIN_UID = "PASTE_YOUR_ADMIN_UID_HERE";


/* =========================================================
   HTML
========================================================= */

const adminEmail =
    document.getElementById("adminEmail");

const totalStudents =
    document.getElementById("totalStudents");

const totalCourses =
    document.getElementById("totalCourses");

const studentsTableBody =
    document.getElementById("studentsTableBody");

const coursesList =
    document.getElementById("coursesList");

const studentSearch =
    document.getElementById("studentSearch");

const courseModal =
    document.getElementById("courseModal");

const closeModal =
    document.getElementById("closeModal");

const modalStudentName =
    document.getElementById("modalStudentName");

const modalStudentEmail =
    document.getElementById("modalStudentEmail");

const courseCheckboxes =
    document.getElementById("courseCheckboxes");

const saveCoursesBtn =
    document.getElementById("saveCoursesBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================================
   STATE
========================================================= */

let students = [];

let selectedStudent = null;


/* =========================================================
   AUTH CHECK
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        /*
           ADMIN UID CHECK
        */

        if (
            ADMIN_UID !== "PASTE_YOUR_ADMIN_UID_HERE" &&
            user.uid !== ADMIN_UID
        ) {

            alert(
                "You are not authorized to access Admin Panel."
            );

            await signOut(auth);

            window.location.href =
                "login.html";

            return;
        }


        /*
           TEMPORARY DEVELOPMENT MODE

           Jab tak UID set nahi kiya hai,
           panel open hoga.

           UID set karne ke baad
           proper admin protection active ho jayega.
        */


        if (adminEmail) {

            adminEmail.textContent =
                user.email || "";
        }


        await loadStudents();

        loadCourses();

        updateDashboard();

    }
);


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        students = [];


        snapshot.forEach(
            (studentDoc) => {

                const data =
                    studentDoc.data();


                students.push({

                    uid:
                        studentDoc.id,

                    name:
                        data.name ||
                        "Unnamed Student",

                    email:
                        data.email ||
                        "",

                    courses:
                        Array.isArray(
                            data.courses
                        )
                            ? data.courses
                            : [],

                    role:
                        data.role ||
                        "student"

                });

            }
        );


        renderStudents(
            students
        );


    } catch (error) {

        console.error(
            "Load students:",
            error
        );

        alert(
            "Students could not be loaded."
        );

    }

}


/* =========================================================
   RENDER STUDENTS
========================================================= */

function renderStudents(
    list
) {

    studentsTableBody.innerHTML =
        "";


    const studentList =
        list.filter(
            student =>
                student.role !==
                "admin"
        );


    if (
        studentList.length === 0
    ) {

        studentsTableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center"
                >
                    No students found
                </td>

            </tr>

        `;

        return;
    }


    studentList.forEach(
        student => {

            const row =
                document.createElement(
                    "tr"
                );


            const courseCount =
                student.courses.length;


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        student.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.email
                    )}
                </td>

                <td>
                    ${courseCount}
                </td>

                <td>

                    <button
                        class="manage-btn"
                        data-uid="${student.uid}"
                    >
                        Manage
                    </button>

                </td>

            `;


            studentsTableBody.appendChild(
                row
            );


            const manageButton =
                row.querySelector(
                    ".manage-btn"
                );


            manageButton.addEventListener(
                "click",
                () => {

                    openCourseManager(
                        student
                    );

                }
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (studentSearch) {

    studentSearch.addEventListener(
        "input",
        () => {

            const search =
                studentSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                students.filter(
                    student => {

                        return (

                            student.name
                                .toLowerCase()
                                .includes(
                                    search
                                )

                            ||

                            student.email
                                .toLowerCase()
                                .includes(
                                    search
                                )

                        );

                    }
                );


            renderStudents(
                filtered
            );

        }
    );

}


/* =========================================================
   OPEN COURSE MANAGER
========================================================= */

function openCourseManager(
    student
) {

    selectedStudent =
        student;


    modalStudentName.textContent =
        student.name;


    modalStudentEmail.textContent =
        student.email;


    courseCheckboxes.innerHTML =
        "";


    Object.entries(
        COURSES
    ).forEach(
        ([courseId, course]) => {

            const checked =
                student.courses.includes(
                    courseId
                );


            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "course-checkbox";


            label.innerHTML = `

                <input
                    type="checkbox"
                    value="${courseId}"
                    ${checked ? "checked" : ""}
                >

                <span>
                    ${escapeHTML(
                        course.title
                    )}
                </span>

            `;


            courseCheckboxes.appendChild(
                label
            );

        }
    );


    courseModal.classList.add(
        "show"
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            courseModal.classList.remove(
                "show"
            );

        }
    );

}


courseModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            courseModal
        ) {

            courseModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   SAVE COURSES
========================================================= */

if (saveCoursesBtn) {

    saveCoursesBtn.addEventListener(
        "click",
        async () => {

            if (!selectedStudent) {
                return;
            }


            const selectedCourses =
                Array.from(
                    courseCheckboxes.querySelectorAll(
                        "input[type='checkbox']:checked"
                    )
                ).map(
                    checkbox =>
                        checkbox.value
                );


            saveCoursesBtn.disabled =
                true;


            saveCoursesBtn.textContent =
                "Saving...";


            try {

                await setDoc(

                    doc(
                        db,
                        "users",
                        selectedStudent.uid
                    ),

                    {
                        name:
                            selectedStudent.name,

                        email:
                            selectedStudent.email,

                        role:
                            selectedStudent.role,

                        courses:
                            selectedCourses
                    },

                    {
                        merge: true
                    }

                );


                /*
                   Local state update
                */

                selectedStudent.courses =
                    selectedCourses;


                const index =
                    students.findIndex(
                        student =>
                            student.uid ===
                            selectedStudent.uid
                    );


                if (index !== -1) {

                    students[index].courses =
                        selectedCourses;

                }


                renderStudents(
                    students
                );


                courseModal.classList.remove(
                    "show"
                );


                alert(
                    "Courses saved successfully."
                );


            } catch (error) {

                console.error(
                    "Save courses:",
                    error
                );


                alert(
                    "Could not save courses.\n\n" +
                    error.message
                );

            }


            saveCoursesBtn.disabled =
                false;


            saveCoursesBtn.textContent =
                "Save Courses";

        }
    );

}


/* =========================================================
   LOAD COURSES
========================================================= */

function loadCourses() {

    coursesList.innerHTML =
        "";


    Object.entries(
        COURSES
    ).forEach(
        ([id, course]) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "course-admin-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        course.title
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        course.description
                    )}
                </p>

                <small>
                    ID: ${id}
                </small>

            `;


            coursesList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   DASHBOARD COUNTS
========================================================= */

function updateDashboard() {

    const studentCount =
        students.filter(
            student =>
                student.role !==
                "admin"
        ).length;


    if (totalStudents) {

        totalStudents.textContent =
            studentCount;

    }


    if (totalCourses) {

        totalCourses.textContent =
            Object.keys(
                COURSES
            ).length;

    }

}


/* =========================================================
   MENU
========================================================= */

document
    .querySelectorAll(
        ".menu-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".menu-btn"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    document
                        .querySelectorAll(
                            ".admin-section"
                        )
                        .forEach(
                            section =>
                                section.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    const section =
                        document.getElementById(
                            button.dataset.section
                        );


                    if (section) {

                        section.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await signOut(
                auth
            );

            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

                      }
