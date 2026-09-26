// ============================================================
// FJMC ACADEMY - ADMIN PANEL
// ============================================================

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


// ============================================================
// ADMIN EMAIL
// ============================================================
//
// YAHAN APNA ADMIN EMAIL DALO
//
// Example:
// const ADMIN_EMAIL = "admin@gmail.com";
//
// ============================================================

const ADMIN_EMAIL =
    "YOUR_ADMIN_EMAIL@gmail.com";


// ============================================================
// STATE
// ============================================================

let currentUser = null;

let selectedStudentUid = null;

let selectedCourseId = null;

let allCourses = [];


// ============================================================
// DOM
// ============================================================

const studentUid =
    document.getElementById(
        "studentUid"
    );

const studentName =
    document.getElementById(
        "studentName"
    );

const studentEmail =
    document.getElementById(
        "studentEmail"
    );

const studentCourses =
    document.getElementById(
        "studentCourses"
    );

const studentsList =
    document.getElementById(
        "studentsList"
    );

const courseId =
    document.getElementById(
        "courseId"
    );

const courseTitle =
    document.getElementById(
        "courseTitle"
    );

const courseDescription =
    document.getElementById(
        "courseDescription"
    );

const coursesList =
    document.getElementById(
        "coursesList"
    );

const contentType =
    document.getElementById(
        "contentType"
    );

const contentTitle =
    document.getElementById(
        "contentTitle"
    );

const contentUrl =
    document.getElementById(
        "contentUrl"
    );

const contentList =
    document.getElementById(
        "contentList"
    );

const selectedCourseText =
    document.getElementById(
        "selectedCourseText"
    );


// ============================================================
// ADMIN CHECK
// ============================================================

function isAdmin(user) {

    if (!user || !user.email) {
        return false;
    }

    return (
        user.email.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
    );
}


// ============================================================
// AUTH
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        if (!isAdmin(user)) {

            alert(
                "Access denied. Admin only."
            );

            await signOut(auth);

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            user;


        await loadCourses();

        await loadStudents();

    }
);


// ============================================================
// LOAD COURSES
// ============================================================

async function loadCourses() {

    coursesList.innerHTML =
        "Loading courses...";

    studentCourses.innerHTML = "";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "courses"
                )
            );


        allCourses = [];


        snapshot.forEach(
            courseDoc => {

                allCourses.push({

                    id:
                        courseDoc.id,

                    ...courseDoc.data()

                });

            }
        );


        renderCourses();

        renderCourseCheckboxes();

    } catch (error) {

        console.error(
            error
        );

        coursesList.innerHTML =
            "Courses load nahi ho paye.";
    }
}


// ============================================================
// RENDER COURSE CHECKBOXES
// ============================================================

function renderCourseCheckboxes(
    selected = []
) {

    studentCourses.innerHTML = "";


    if (
        allCourses.length === 0
    ) {

        studentCourses.innerHTML =
            "<p>No courses available.</p>";

        return;
    }


    allCourses.forEach(
        course => {

            const wrapper =
                document.createElement(
                    "label"
                );

            wrapper.className =
                "checkbox-item";


            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";

            checkbox.value =
                course.id;

            checkbox.checked =
                selected.includes(
                    course.id
                );


            const text =
                document.createTextNode(
                    " " +
                    (
                        course.title ||
                        course.id
                    )
                );


            wrapper.appendChild(
                checkbox
            );

            wrapper.appendChild(
                text
            );


            studentCourses.appendChild(
                wrapper
            );
        }
    );
}


// ============================================================
// RENDER COURSES
// ============================================================

function renderCourses() {

    coursesList.innerHTML = "";


    if (
        allCourses.length === 0
    ) {

        coursesList.innerHTML =
            "<p>No courses created.</p>";

        return;
    }


    allCourses.forEach(
        course => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "data-item";


            item.innerHTML = `

                <div class="data-info">

                    <strong>
                        ${escapeHTML(
                            course.title ||
                            course.id
                        )}
                    </strong>

                    <small>
                        ID: ${escapeHTML(
                            course.id
                        )}
                    </small>

                </div>

                <div>

                    <button
                        class="edit-btn"
                        data-course-edit="${escapeHTML(course.id)}"
                    >
                        Edit
                    </button>

                    <button
                        class="danger-btn"
                        data-course-delete="${escapeHTML(course.id)}"
                    >
                        Delete
                    </button>

                </div>

            `;


            coursesList.appendChild(
                item
            );
        }
    );
}


// ============================================================
// COURSE LIST EVENTS
// ============================================================

coursesList.addEventListener(
    "click",
    async event => {

        const editId =
            event.target.dataset.courseEdit;

        const deleteId =
            event.target.dataset.courseDelete;


        if (editId) {

            await editCourse(
                editId
            );
        }


        if (deleteId) {

            await deleteCourse(
                deleteId
            );
        }

    }
);


// ============================================================
// SAVE COURSE
// ============================================================

document
    .getElementById("saveCourseBtn")
    .addEventListener(
        "click",
        async () => {

            const id =
                courseId.value.trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");

            const title =
                courseTitle.value.trim();

            const description =
                courseDescription.value.trim();


            if (!id || !title) {

                alert(
                    "Course ID aur Course Title required hai."
                );

                return;
            }


            try {

                const courseRef =
                    doc(
                        db,
                        "courses",
                        id
                    );


                const existing =
                    await getDoc(
                        courseRef
                    );


                let contents = [];


                if (
                    existing.exists()
                ) {

                    const data =
                        existing.data();

                    contents =
                        Array.isArray(
                            data.contents
                        )
                            ? data.contents
                            : [];
                }


                await setDoc(
                    courseRef,
                    {

                        title,

                        description,

                        contents,

                        updatedAt:
                            serverTimestamp()

                    },
                    {
                        merge: true
                    }
                );


                alert(
                    "Course saved successfully."
                );


                clearCourseForm();

                await loadCourses();

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Course save nahi hua."
                );
            }

        }
    );


// ============================================================
// EDIT COURSE
// ============================================================

async function editCourse(id) {

    const course =
        allCourses.find(
            c => c.id === id
        );


    if (!course) {
        return;
    }


    courseId.value =
        course.id;

    courseTitle.value =
        course.title || "";

    courseDescription.value =
        course.description || "";


    selectedCourseId =
        course.id;


    selectedCourseText.textContent =
        "Selected Course: " +
        (
            course.title ||
            course.id
        );


    renderContent(
        Array.isArray(
            course.contents
        )
            ? course.contents
            : []
    );
}


// ============================================================
// DELETE COURSE
// ============================================================

async function deleteCourse(id) {

    const course =
        allCourses.find(
            c => c.id === id
        );


    const name =
        course?.title ||
        id;


    const confirmDelete =
        confirm(
            `Delete course "${name}"?`
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "courses",
                id
            )
        );


        // Remove this course from students
        const usersSnapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        for (
            const userDoc of
            usersSnapshot.docs
        ) {

            const data =
                userDoc.data();


            if (
                Array.isArray(
                    data.courses
                ) &&
                data.courses.includes(id)
            ) {

                const updatedCourses =
                    data.courses.filter(
                        c => c !== id
                    );


                await updateDoc(
                    userDoc.ref,
                    {
                        courses:
                            updatedCourses,

                        updatedAt:
                            serverTimestamp()
                    }
                );
            }
        }


        if (
            selectedCourseId === id
        ) {

            selectedCourseId =
                null;

            selectedCourseText.textContent =
                "Select a course first.";

            contentList.innerHTML =
                "";
        }


        alert(
            "Course deleted."
        );


        await loadCourses();

        await loadStudents();

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Course delete nahi hua."
        );
    }
}


// ============================================================
// ADD CONTENT
// ============================================================

document
    .getElementById("addContentBtn")
    .addEventListener(
        "click",
        async () => {

            if (!selectedCourseId) {

                alert(
                    "Pehle course select karo."
                );

                return;
            }


            const type =
                contentType.value;

            const title =
                contentTitle.value.trim();

            const url =
                contentUrl.value.trim();


            if (!title || !url) {

                alert(
                    "Content title aur URL required hai."
                );

                return;
            }


            try {

                const courseRef =
                    doc(
                        db,
                        "courses",
                        selectedCourseId
                    );


                const snap =
                    await getDoc(
                        courseRef
                    );


                if (!snap.exists()) {

                    alert(
                        "Course nahi mila."
                    );

                    return;
                }


                const data =
                    snap.data();


                const contents =
                    Array.isArray(
                        data.contents
                    )
                        ? [...data.contents]
                        : [];


                contents.push({

                    type,

                    title,

                    url

                });


                await updateDoc(
                    courseRef,
                    {

                        contents,

                        updatedAt:
                            serverTimestamp()

                    }
                );


                alert(
                    "Content added."
                );


                clearContentForm();

                await loadCourses();


                const updatedCourse =
                    allCourses.find(
                        c =>
                            c.id ===
                            selectedCourseId
                    );


                renderContent(
                    updatedCourse?.contents ||
                    []
                );

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Content add nahi hua."
                );
            }

        }
    );


// ============================================================
// RENDER CONTENT
// ============================================================

function renderContent(
    contents
) {

    contentList.innerHTML = "";


    if (
        !Array.isArray(contents) ||
        contents.length === 0
    ) {

        contentList.innerHTML =
            "<p>No content added.</p>";

        return;
    }


    contents.forEach(
        (content, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "content-item";


            item.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            content.title
                        )}
                    </strong>

                    <div class="content-type">
                        ${escapeHTML(
                            content.type
                        )}
                    </div>

                    <small>
                        ${escapeHTML(
                            content.url
                        )}
                    </small>

                </div>


                <button
                    class="danger-btn"
                    data-content-delete="${index}"
                >
                    Delete
                </button>

            `;


            contentList.appendChild(
                item
            );

        }
    );
}


// ============================================================
// DELETE CONTENT
// ============================================================

contentList.addEventListener(
    "click",
    async event => {

        const index =
            event.target.dataset.contentDelete;


        if (
            index === undefined
        ) {
            return;
        }


        if (!selectedCourseId) {
            return;
        }


        try {

            const courseRef =
                doc(
                    db,
                    "courses",
                    selectedCourseId
                );


            const snap =
                await getDoc(
                    courseRef
                );


            if (!snap.exists()) {
                return;
            }


            const data =
                snap.data();


            const contents =
                Array.isArray(
                    data.contents
                )
                    ? [...data.contents]
                    : [];


            contents.splice(
                Number(index),
                1
            );


            await updateDoc(
                courseRef,
                {

                    contents,

                    updatedAt:
                        serverTimestamp()

                }
            );


            await loadCourses();


            const updatedCourse =
                allCourses.find(
                    c =>
                        c.id ===
                        selectedCourseId
                );


            renderContent(
                updatedCourse?.contents ||
                []
            );

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Content delete nahi hua."
            );
        }

    }
);


// ============================================================
// LOAD STUDENTS
// ============================================================

async function loadStudents() {

    studentsList.innerHTML =
        "Loading students...";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        studentsList.innerHTML =
            "";


        let found =
            false;


        snapshot.forEach(
            userDoc => {

                const data =
                    userDoc.data();


                if (
                    data.role &&
                    data.role !==
                    "student"
                ) {
                    return;
                }


                found = true;


                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "data-item";


                const courses =
                    Array.isArray(
                        data.courses
                    )
                        ? data.courses
                        : [];


                item.innerHTML = `

                    <div class="data-info">

                        <strong>
                            ${escapeHTML(
                                data.name ||
                                "Student"
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                data.email ||
                                ""
                            )}
                        </small>

                        <small>
                            Courses:
                            ${
                                courses.length
                            }
                        </small>

                    </div>


                    <button
                        class="edit-btn"
                        data-student-edit="${escapeHTML(userDoc.id)}"
                    >
                        Edit
                    </button>

                `;


                studentsList.appendChild(
                    item
                );
            }
        );


        if (!found) {

            studentsList.innerHTML =
                "<p>No students found.</p>";
        }

    } catch (error) {

        console.error(
            error
        );

        studentsList.innerHTML =
            "Students load nahi ho paye.";
    }
}


// ============================================================
// STUDENT LIST EVENTS
// ============================================================

studentsList.addEventListener(
    "click",
    async event => {

        const uid =
            event.target.dataset.studentEdit;


        if (uid) {

            await editStudent(
                uid
            );
        }

    }
);


// ============================================================
// EDIT STUDENT
// ============================================================

async function editStudent(uid) {

    try {

        const userRef =
            doc(
                db,
                "users",
                uid
            );


        const snap =
            await getDoc(
                userRef
            );


        if (!snap.exists()) {
            return;
        }


        const data =
            snap.data();


        selectedStudentUid =
            uid;


        studentUid.value =
            uid;

        studentName.value =
            data.name || "";

        studentEmail.value =
            data.email || "";


        renderCourseCheckboxes(
            Array.isArray(
                data.courses
            )
                ? data.courses
                : []
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(
            error
        );
    }
}


// ============================================================
// SAVE STUDENT
// ============================================================

document
    .getElementById("saveStudentBtn")
    .addEventListener(
        "click",
        async () => {

            const uid =
                studentUid.value.trim();

            const name =
                studentName.value.trim();

            const email =
                studentEmail.value.trim();


            if (!uid || !name) {

                alert(
                    "Student UID aur Name required hai."
                );

                return;
            }


            const selectedCourses =
                Array.from(
                    studentCourses.querySelectorAll(
                        "input[type='checkbox']:checked"
                    )
                ).map(
                    checkbox =>
                        checkbox.value
                );


            try {

                await setDoc(
                    doc(
                        db,
                        "users",
                        uid
                    ),
                    {

                        name,

                        email,

                        role:
                            "student",

                        courses:
                            selectedCourses,

                        updatedAt:
                            serverTimestamp()

                    },
                    {
                        merge: true
                    }
                );


                alert(
                    "Student saved successfully."
                );


                clearStudentForm();

                await loadStudents();

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "Student save nahi hua."
                );
            }

        }
    );


// ============================================================
// CLEAR STUDENT
// ============================================================

document
    .getElementById("clearStudentBtn")
    .addEventListener(
        "click",
        clearStudentForm
    );


function clearStudentForm() {

    selectedStudentUid =
        null;

    studentUid.value =
        "";

    studentName.value =
        "";

    studentEmail.value =
        "";

    renderCourseCheckboxes();
}


// ============================================================
// CLEAR COURSE
// ============================================================

document
    .getElementById("clearCourseBtn")
    .addEventListener(
        "click",
        clearCourseForm
    );


function clearCourseForm() {

    courseId.value =
        "";

    courseTitle.value =
        "";

    courseDescription.value =
        "";

    selectedCourseId =
        null;

    selectedCourseText.textContent =
        "Select a course first.";

    contentList.innerHTML =
        "";
}


// ============================================================
// CLEAR CONTENT
// ============================================================

document
    .getElementById("clearContentBtn")
    .addEventListener(
        "click",
        clearContentForm
    );


function clearContentForm() {

    contentTitle.value =
        "";

    contentUrl.value =
        "";

    contentType.value =
        "youtube";
}


// ============================================================
// COURSE CLICK = SELECT FOR CONTENT
// ============================================================

coursesList.addEventListener(
    "dblclick",
    async event => {

        const item =
            event.target.closest(
                ".data-item"
            );


        if (!item) {
            return;
        }


        const editButton =
            item.querySelector(
                "[data-course-edit]"
            );


        if (!editButton) {
            return;
        }


        const id =
            editButton.dataset.courseEdit;


        selectedCourseId =
            id;


        const course =
            allCourses.find(
                c => c.id === id
            );


        selectedCourseText.textContent =
            "Selected Course: " +
            (
                course?.title ||
                id
            );


        renderContent(
            course?.contents ||
            []
        );

    }
);


// ============================================================
// LOGOUT
// ============================================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        async () => {

            await signOut(
                auth
            );

            window.location.href =
                "login.html";
        }
    );


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
                            }
