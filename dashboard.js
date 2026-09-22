/* =========================================================
   FJMC ACADEMY - STUDENT DASHBOARD
   Firebase Authentication + Firestore
   Maximum 2 Devices
   Device Timeout = 24 Hours
========================================================= */

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
    deleteDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


/* =========================================================
   STUDENTS
========================================================= */

const STUDENTS = {

    "rahul@gmail.com": {
        name: "Rahul",
        courses: ["real-analysis"]
    },

    "amit@gmail.com": {
        name: "Amit",
        courses: ["linear-algebra", "calculus"]
    },

    "fogatjagmohan@gmail.com": {
        name: "Neha",
        courses: ["real-analysis", "calculus"]
    }

};


/* =========================================================
   COURSES
========================================================= */

const COURSES = {

    "real-analysis": {

        title: "Real Analysis",

        description:
            "Complete Real Analysis course with lectures, notes and live classes.",

        lessons: [

            {
                title: "Lecture 1",
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                title: "Lecture 2",
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                title: "Lecture 3",
                type: "video",
                url: "./real-analysis-lecture-3.mp4"
            },

            {
                title: "Lecture 4 Notes",
                type: "pdf",
                url: "./321581555.PDF"
            },

            {
                title: "Chapter 3 Notes",
                type: "pdf",
                url: "./ch03.pdf"
            },

            {
                title: "Live Class",
                type: "live",
                url: "#"
            }

        ]

    },


    "linear-algebra": {

        title: "Linear Algebra",

        description:
            "Linear Algebra lectures, notes and live classes.",

        lessons: [

            {
                title: "Lecture 1",
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                title: "Lecture 2",
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                title: "Linear Algebra Notes",
                type: "pdf",
                url: "./pdf/linear-algebra-notes.pdf"
            },

            {
                title: "Live Class",
                type: "live",
                url: "#"
            }

        ]

    },


    "calculus": {

        title: "Calculus",

        description:
            "Calculus lectures, notes and live classes.",

        lessons: [

            {
                title: "Lecture 1",
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                title: "Lecture 2",
                type: "video",
                url: "./videos/calculus-lecture-2.mp4"
            },

            {
                title: "Chapter 3 Notes",
                type: "pdf",
                url: "./ch03.pdf"
            },

            {
                title: "Live Class",
                type: "live",
                url: "#"
            }

        ]

    }

};


/* =========================================================
   DEVICE SETTINGS
========================================================= */

const MAX_DEVICES = 2;

/*
   Device ko 24 hours tak active maana jayega.
*/

const DEVICE_TIMEOUT =
    24 * 60 * 60 * 1000;


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentUser = null;
let currentStudent = null;
let deviceId = null;
let heartbeatInterval = null;


/* =========================================================
   GET DEVICE ID
========================================================= */

function getDeviceId() {

    let id =
        localStorage.getItem("fjmcDeviceId");

    if (!id) {

        if (
            typeof crypto !== "undefined" &&
            crypto.randomUUID
        ) {

            id =
                "device-" +
                crypto.randomUUID();

        } else {

            id =
                "device-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2);

        }

        localStorage.setItem(
            "fjmcDeviceId",
            id
        );
    }

    return id;
}

deviceId = getDeviceId();


/* =========================================================
   DEVICE COLLECTION
========================================================= */

function devicesCollection(user) {

    return collection(
        db,
        "users",
        user.uid,
        "devices"
    );

}


/* =========================================================
   REGISTER DEVICE
   IMPORTANT:
   getDocs() transaction ke andar nahi hai.
========================================================= */

async function registerDevice(user) {

    try {

        const devicesRef =
            devicesCollection(user);

        const deviceRef =
            doc(
                db,
                "users",
                user.uid,
                "devices",
                deviceId
            );

        const now =
            Date.now();


        /* -------------------------------------------------
           CURRENT DEVICE ALREADY REGISTERED
        ------------------------------------------------- */

        const currentDeviceSnap =
            await getDoc(deviceRef);


        if (currentDeviceSnap.exists()) {

            await setDoc(
                deviceRef,
                {
                    email: user.email,
                    lastSeen: now,
                    active: true
                },
                {
                    merge: true
                }
            );

            return true;
        }


        /* -------------------------------------------------
           GET ALL DEVICES
           Transaction ke bahar
        ------------------------------------------------- */

        const devicesSnapshot =
            await getDocs(devicesRef);


        let activeDevices = [];


        devicesSnapshot.forEach(
            function (deviceDoc) {

                const data =
                    deviceDoc.data();

                const lastSeen =
                    Number(
                        data.lastSeen || 0
                    );


                const recentlyActive =
                    data.active === true &&
                    (now - lastSeen)
                    < DEVICE_TIMEOUT;


                if (recentlyActive) {

                    activeDevices.push(
                        deviceDoc.id
                    );

                }

            }
        );


        /* -------------------------------------------------
           MAXIMUM 2 ACTIVE DEVICES
        ------------------------------------------------- */

        if (
            activeDevices.length >=
            MAX_DEVICES
        ) {

            showDeviceLimitMessage();

            return false;
        }


        /* -------------------------------------------------
           REGISTER NEW DEVICE
        ------------------------------------------------- */

        await setDoc(
            deviceRef,
            {
                email: user.email,
                lastSeen: now,
                active: true,
                createdAt:
                    serverTimestamp()
            }
        );


        return true;


    } catch (error) {

        console.error(
            "Device registration error:",
            error
        );


        alert(
            "Unable to verify this device. Please refresh and try again."
        );


        return false;
    }

}


/* =========================================================
   DEVICE LIMIT MESSAGE
========================================================= */

function showDeviceLimitMessage() {

    const message =
        "This account is already active on 2 devices.\n\n" +
        "Please logout from one of your other devices and try again.";

    alert(message);

}


/* =========================================================
   HEARTBEAT
   Har 2 minute me lastSeen update
========================================================= */

function startHeartbeat() {

    stopHeartbeat();


    heartbeatInterval =
        setInterval(
            async function () {

                if (
                    !currentUser ||
                    !deviceId
                ) {
                    return;
                }


                try {

                    const deviceRef =
                        doc(
                            db,
                            "users",
                            currentUser.uid,
                            "devices",
                            deviceId
                        );


                    await updateDoc(
                        deviceRef,
                        {
                            lastSeen:
                                Date.now(),
                            active: true
                        }
                    );


                } catch (error) {

                    console.error(
                        "Heartbeat error:",
                        error
                    );

                }

            },
            2 * 60 * 1000
        );

}


/* =========================================================
   STOP HEARTBEAT
========================================================= */

function stopHeartbeat() {

    if (heartbeatInterval) {

        clearInterval(
            heartbeatInterval
        );

        heartbeatInterval = null;
    }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        try {

            /* ---------------------------------------------
               USER NOT LOGGED IN
            --------------------------------------------- */

            if (!user) {

                window.location.href =
                    "login.html";

                return;
            }


            currentUser = user;


            const email =
                (
                    user.email || ""
                ).toLowerCase();


            /* ---------------------------------------------
               CHECK STUDENT
            --------------------------------------------- */

            const student =
                STUDENTS[email];


            if (!student) {

                alert(
                    "Your account is not assigned to any course."
                );

                await signOut(auth);

                window.location.href =
                    "login.html";

                return;
            }


            currentStudent =
                student;


            /* ---------------------------------------------
               DEVICE CHECK
            --------------------------------------------- */

            const deviceAllowed =
                await registerDevice(user);


            if (!deviceAllowed) {

                stopHeartbeat();

                await signOut(auth);

                return;
            }


            /* ---------------------------------------------
               SAVE SESSION
            --------------------------------------------- */

            sessionStorage.setItem(
                "loggedInStudent",
                email
            );

            sessionStorage.setItem(
                "firebaseUID",
                user.uid
            );


            /* ---------------------------------------------
               SHOW NAME
            --------------------------------------------- */

            const studentName =
                document.getElementById(
                    "studentName"
                );


            if (studentName) {

                studentName.textContent =
                    student.name;

            }


            /* ---------------------------------------------
               SHOW COURSES
            --------------------------------------------- */

            showStudentCourses(
                student
            );


            /* ---------------------------------------------
               START HEARTBEAT
            --------------------------------------------- */

            startHeartbeat();


        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );


            const container =
                document.getElementById(
                    "coursesContainer"
                );


            if (container) {

                container.innerHTML =
                    `
                    <div style="
                        padding:30px;
                        text-align:center;
                        color:#c62828;
                        background:#fff;
                        border-radius:12px;
                        margin:20px;
                    ">
                        <h3>Unable to load courses</h3>

                        <p>
                            Please refresh the page
                            and try again.
                        </p>

                        <p style="
                            font-size:12px;
                            color:#777;
                        ">
                            ${error.message || ""}
                        </p>
                    </div>
                    `;

            }

        }

    }
);


/* =========================================================
   SHOW STUDENT COURSES
========================================================= */

function showStudentCourses(student) {

    const container =
        document.getElementById(
            "coursesContainer"
        );


    if (!container) {

        console.error(
            "coursesContainer not found."
        );

        return;
    }


    container.innerHTML = "";


    if (
        !student.courses ||
        student.courses.length === 0
    ) {

        container.innerHTML =
            `
            <div style="
                text-align:center;
                padding:30px;
            ">
                No courses assigned.
            </div>
            `;

        return;
    }


    student.courses.forEach(
        function (courseId) {

            const course =
                COURSES[courseId];


            if (!course) {

                console.warn(
                    "Course not found:",
                    courseId
                );

                return;
            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "course-card";


            card.innerHTML =
                `
                <div class="course-card-inner">

                    <h2>
                        ${course.title}
                    </h2>

                    <p>
                        ${course.description}
                    </p>

                    <button
                        class="open-course-btn"
                        type="button"
                    >
                        Open Course
                    </button>

                </div>
                `;


            const button =
                card.querySelector(
                    ".open-course-btn"
                );


            button.addEventListener(
                "click",
                function () {

                    openCourse(
                        courseId,
                        course
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   OPEN COURSE
========================================================= */

function openCourse(
    courseId,
    course
) {

    const container =
        document.getElementById(
            "coursesContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        `
        <div class="course-view">

            <button
                id="backToCourses"
                type="button"
                style="
                    margin-bottom:20px;
                    padding:10px 18px;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                "
            >
                ← Back to Courses
            </button>


            <h1>
                ${course.title}
            </h1>


            <p>
                ${course.description}
            </p>


            <div
                id="lessonContainer"
                style="
                    margin-top:25px;
                "
            ></div>

        </div>
        `;


    const backButton =
        document.getElementById(
            "backToCourses"
        );


    backButton.addEventListener(
        "click",
        function () {

            showStudentCourses(
                currentStudent
            );

        }
    );


    const lessonContainer =
        document.getElementById(
            "lessonContainer"
        );


    course.lessons.forEach(
        function (lesson, index) {

            const lessonBox =
                document.createElement(
                    "div"
                );


            lessonBox.style.marginBottom =
                "18px";


            lessonBox.style.padding =
                "18px";


            lessonBox.style.borderRadius =
                "12px";


            lessonBox.style.background =
                "#f5f7fb";


            lessonBox.innerHTML =
                `
                <h3>
                    ${index + 1}. ${lesson.title}
                </h3>

                <div
                    class="lesson-content"
                    style="margin-top:12px;"
                ></div>
                `;


            const content =
                lessonBox.querySelector(
                    ".lesson-content"
                );


            createLessonContent(
                lesson,
                content
            );


            lessonContainer.appendChild(
                lessonBox
            );

        }
    );

}


/* =========================================================
   CREATE LESSON CONTENT
========================================================= */

function createLessonContent(
    lesson,
    container
) {


    /* =====================================================
       YOUTUBE
    ===================================================== */

    if (
        lesson.type ===
        "youtube"
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            lesson.url;


        iframe.width =
            "100%";


        iframe.height =
            "400";


        iframe.frameBorder =
            "0";


        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


        iframe.allowFullscreen =
            true;


        iframe.style.borderRadius =
            "12px";


        iframe.style.maxWidth =
            "900px";


        container.appendChild(
            iframe
        );

        return;
    }


    /* =====================================================
       LOCAL VIDEO
    ===================================================== */

    if (
        lesson.type ===
        "video"
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            lesson.url;


        video.controls =
            true;


        video.controlsList =
            "nodownload";


        video.disablePictureInPicture =
            true;


        video.playsInline =
            true;


        video.style.width =
            "100%";


        video.style.maxWidth =
            "900px";


        video.style.borderRadius =
            "12px";


        video.addEventListener(
            "contextmenu",
            function (e) {

                e.preventDefault();

            }
        );


        container.appendChild(
            video
        );

        return;
    }


    /* =====================================================
       PDF
    ===================================================== */

    if (
        lesson.type ===
        "pdf"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "📄 Open Notes";


        button.style.padding =
            "12px 20px";


        button.style.border =
            "none";


        button.style.borderRadius =
            "8px";


        button.style.cursor =
            "pointer";


        button.addEventListener(
            "click",
            function () {

                openPDF(
                    lesson.url
                );

            }
        );


        container.appendChild(
            button
        );

        return;
    }


    /* =====================================================
       LIVE CLASS
    ===================================================== */

    if (
        lesson.type ===
        "live"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "🔴 Join Live Class";


        button.style.padding =
            "12px 20px";


        button.style.border =
            "none";


        button.style.borderRadius =
            "8px";


        button.style.cursor =
            "pointer";


        button.addEventListener(
            "click",
            function () {

                if (
                    !lesson.url ||
                    lesson.url === "#"
                ) {

                    alert(
                        "Live class link will be available here."
                    );

                    return;
                }


                window.location.href =
                    lesson.url;

            }
        );


        container.appendChild(
            button
        );

    }

}


/* =========================================================
   PDF VIEWER
========================================================= */

function openPDF(url) {

    const viewer =
        document.createElement(
            "div"
        );


    viewer.style.position =
        "fixed";


    viewer.style.inset =
        "0";


    viewer.style.background =
        "#111";


    viewer.style.zIndex =
        "99999";


    viewer.innerHTML =
        `
        <div style="
            height:60px;
            background:#182033;
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:0 15px;
            color:white;
        ">

            <strong>
                FJMC Academy Notes
            </strong>

            <button
                id="closePdfViewer"
                style="
                    padding:8px 15px;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                "
            >
                ✕ Close
            </button>

        </div>


        <iframe
            src="${url}"
            style="
                width:100%;
                height:calc(100% - 60px);
                border:none;
                background:white;
            "
        ></iframe>
        `;


    document.body.appendChild(
        viewer
    );


    document
        .getElementById(
            "closePdfViewer"
        )
        .addEventListener(
            "click",
            function () {

                viewer.remove();

            }
        );

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                if (
                    currentUser &&
                    deviceId
                ) {

                    const deviceRef =
                        doc(
                            db,
                            "users",
                            currentUser.uid,
                            "devices",
                            deviceId
                        );


                    await updateDoc(
                        deviceRef,
                        {
                            active: false,
                            lastSeen:
                                Date.now()
                        }
                    );

                }


            } catch (error) {

                console.error(
                    "Logout device update error:",
                    error
                );

            }


            stopHeartbeat();


            sessionStorage.removeItem(
                "loggedInStudent"
            );


            sessionStorage.removeItem(
                "firebaseUID"
            );


            await signOut(auth);


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   BASIC PAGE PROTECTION
========================================================= */

document.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "copy",
    function (event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "cut",
    function (event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "selectstart",
    function (event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key.toLowerCase();


        /* Ctrl + S */

        if (
            event.ctrlKey &&
            key === "s"
        ) {

            event.preventDefault();

        }


        /* Ctrl + U */

        if (
            event.ctrlKey &&
            key === "u"
        ) {

            event.preventDefault();

        }


        /* Ctrl + P */

        if (
            event.ctrlKey &&
            key === "p"
        ) {

            event.preventDefault();

        }


        /* Ctrl + C */

        if (
            event.ctrlKey &&
            key === "c"
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   PDF.JS WORKER
========================================================= */

if (
    window.pdfjsLib &&
    window.pdfjsLib.GlobalWorkerOptions
) {

    window.pdfjsLib
        .GlobalWorkerOptions
        .workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

}
