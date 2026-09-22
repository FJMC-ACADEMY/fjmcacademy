/* =========================================================
   FJMC ACADEMY - STUDENT DASHBOARD
   FIREBASE + MAXIMUM 2 DEVICES
   24-HOUR DEVICE TIMEOUT
   ========================================================= */

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


/* =========================================================
   STUDENT DATA
   ========================================================= */

const STUDENTS = {

    "fjmcacademy1008@gmail.com": {
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
   COURSE DATA
   ========================================================= */

const COURSES = {

    "real-analysis": {

        title: "Real Analysis",

        description: "Complete Real Analysis Course",

        contents: [

            {
                type: "video",
                title: "Lecture 1",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                type: "video",
                title: "Lecture 2",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                type: "local-video",
                title: "Lecture 3",
                url: "real-analysis-lecture-3.mp4"
            },

            {
                type: "pdf",
                title: "Lecture 1 PDF",
                url: "321581555.PDF"
            },

            {
                type: "pdf",
                title: "Lecture 2 PDF",
                url: "ch03.pdf"
            },

            {
                type: "live",
                title: "Live Class",
                url: "#"
            }

        ]
    },


    "linear-algebra": {

        title: "Linear Algebra",

        description: "Complete Linear Algebra Course",

        contents: [

            {
                type: "video",
                title: "Lecture 1",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                type: "pdf",
                title: "Linear Algebra Notes",
                url: "pdf/linear-algebra-notes.pdf"
            },

            {
                type: "live",
                title: "Live Class",
                url: "#"
            }

        ]
    },


    "calculus": {

        title: "Calculus",

        description: "Complete Calculus Course",

        contents: [

            {
                type: "video",
                title: "Lecture 1",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
            },

            {
                type: "local-video",
                title: "Lecture 2",
                url: "./videos/calculus-lecture-2.mp4"
            },

            {
                type: "pdf",
                title: "Chapter 3 PDF",
                url: "ch03.pdf"
            },

            {
                type: "live",
                title: "Live Class",
                url: "#"
            }

        ]
    }

};


/* =========================================================
   DEVICE SETTINGS
   ========================================================= */

const MAX_DEVICES = 2;

const DEVICE_TIMEOUT =
    24 * 60 * 60 * 1000;


/* =========================================================
   DEVICE ID
   ========================================================= */

function getDeviceId() {

    let deviceId =
        localStorage.getItem("fjmcDeviceId");


    if (!deviceId) {

        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {

            deviceId =
                "device-" +
                crypto.randomUUID();

        } else {

            deviceId =
                "device-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2);

        }


        localStorage.setItem(
            "fjmcDeviceId",
            deviceId
        );

    }


    return deviceId;
}


const deviceId =
    getDeviceId();


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;

let deviceHeartbeat = null;


/* =========================================================
   HTML ELEMENTS
   ========================================================= */

const coursesContainer =
    document.getElementById(
        "coursesContainer"
    );


const studentName =
    document.getElementById(
        "studentName"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================================
   FIREBASE AUTH
   ========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            user;


        const email =
            (user.email || "")
                .trim()
                .toLowerCase();


        console.log(
            "Logged in email:",
            email
        );


        /* ================================================
           CHECK STUDENT
           ================================================ */

        const student =
            STUDENTS[email];


        if (!student) {

            console.error(
                "Student not found:",
                email
            );


            await signOut(
                auth
            );


            window.location.href =
                "login.html";


            return;
        }


        /* ================================================
           REGISTER / CHECK DEVICE
           ================================================ */

        const allowed =
            await registerDevice(
                user
            );


        console.log(
            "Device allowed:",
            allowed
        );


        if (!allowed) {

            try {

                await signOut(
                    auth
                );

            } catch (error) {

                console.error(
                    "Sign out error:",
                    error
                );

            }


            return;
        }


        /* ================================================
           SESSION
           ================================================ */

        sessionStorage.setItem(
            "loggedInStudent",
            email
        );


        sessionStorage.setItem(
            "firebaseUID",
            user.uid
        );


        /* ================================================
           WELCOME
           ================================================ */

        if (studentName) {

            studentName.textContent =
                "Welcome, " +
                student.name;

        }


        /* ================================================
           SHOW COURSES
           ================================================ */

        showStudentCourses(
            student
        );


        /* ================================================
           START HEARTBEAT
           ================================================ */

        startDeviceHeartbeat();

    }
);


/* =========================================================
   DEVICES COLLECTION
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
   ========================================================= */

async function registerDevice(
    user
) {

    try {

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


        /* ================================================
           CHECK CURRENT DEVICE
           ================================================ */

        const currentDeviceSnapshot =
            await getDoc(
                deviceRef
            );


        if (
            currentDeviceSnapshot.exists()
        ) {

            await setDoc(
                deviceRef,
                {
                    email:
                        user.email,

                    lastSeen:
                        now,

                    active:
                        true
                },
                {
                    merge:
                        true
                }
            );


            return true;
        }


        /* ================================================
           GET ALL DEVICES
           ================================================ */

        const devicesSnapshot =
            await getDocs(
                devicesCollection(
                    user
                )
            );


        let activeDevices =
            0;


        devicesSnapshot.forEach(
            function (deviceDoc) {

                if (
                    deviceDoc.id ===
                    deviceId
                ) {

                    return;
                }


                const data =
                    deviceDoc.data();


                const lastSeen =
                    Number(
                        data.lastSeen ||
                        0
                    );


                const recentlyActive =
                    data.active === true &&
                    (
                        now -
                        lastSeen
                    ) <
                    DEVICE_TIMEOUT;


                if (
                    recentlyActive
                ) {

                    activeDevices++;

                }

            }
        );


        /* ================================================
           MAXIMUM 2 DEVICES
           ================================================ */

        if (
            activeDevices >=
            MAX_DEVICES
        ) {

            showDeviceLimitMessage();

            return false;
        }


        /* ================================================
           CREATE DEVICE
           ================================================ */

        await setDoc(
            deviceRef,
            {
                email:
                    user.email,

                lastSeen:
                    now,

                active:
                    true,

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
            "Firebase Error:\n\n" +
            (
                error.code ||
                "Unknown error"
            ) +
            "\n\n" +
            (
                error.message ||
                "Unknown Firebase error"
            )
        );


        return false;
    }

}


/* =========================================================
   DEVICE LIMIT MESSAGE
   ========================================================= */

function showDeviceLimitMessage() {

    const message =
        document.getElementById(
            "deviceLimitMessage"
        );


    if (message) {

        message.textContent =
            "Maximum 2 devices are already active for this account. Please logout from another device first.";

        return;
    }


    alert(
        "Maximum 2 devices are already active for this account.\n\n" +
        "Please logout from another device first."
    );

}


/* =========================================================
   HEARTBEAT
   ========================================================= */

function startDeviceHeartbeat() {

    if (deviceHeartbeat) {

        clearInterval(
            deviceHeartbeat
        );

    }


    updateDeviceHeartbeat();


    deviceHeartbeat =
        setInterval(
            updateDeviceHeartbeat,
            2 * 60 * 1000
        );

}


/* =========================================================
   UPDATE DEVICE
   ========================================================= */

async function updateDeviceHeartbeat() {

    if (!currentUser) {

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

                active:
                    true
            }
        );


    } catch (error) {

        console.error(
            "Heartbeat error:",
            error
        );

    }

}


/* =========================================================
   SHOW STUDENT COURSES
   ========================================================= */

function showStudentCourses(
    student
) {

    console.log(
        "STUDENT DATA:",
        student
    );


    if (!coursesContainer) {

        console.error(
            "coursesContainer not found"
        );

        return;
    }


    coursesContainer.innerHTML =
        "";


    if (
        !student.courses ||
        student.courses.length === 0
    ) {

        coursesContainer.innerHTML = `

            <div class="no-course">

                <h3>
                    No Course Assigned
                </h3>

                <p>
                    Please contact FJMC Academy.
                </p>

            </div>

        `;

        return;
    }


    student.courses.forEach(
        function (courseId) {

            const course =
                COURSES[courseId];


            if (!course) {

                console.error(
                    "Course not found:",
                    courseId
                );

                return;
            }


            const courseCard =
                document.createElement(
                    "div"
                );


            courseCard.className =
                "course-card";


            let contentHTML =
                "";


            course.contents.forEach(
                function (content) {


                    /* ======================================
                       YOUTUBE VIDEO
                       ====================================== */

                    if (
                        content.type ===
                        "video"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button video-button"
                                data-type="youtube"
                                data-url="${encodeURIComponent(content.url)}"
                                data-title="${encodeURIComponent(content.title)}">

                                ▶ ${content.title}

                            </button>

                        `;

                    }


                    /* ======================================
                       LOCAL VIDEO
                       ====================================== */

                    else if (
                        content.type ===
                        "local-video"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button video-button"
                                data-type="local"
                                data-url="${encodeURIComponent(content.url)}"
                                data-title="${encodeURIComponent(content.title)}">

                                ▶ ${content.title}

                            </button>

                        `;

                    }


                    /* ======================================
                       PDF
                       ====================================== */

                    else if (
                        content.type ===
                        "pdf"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button pdf-button"
                                data-type="pdf"
                                data-url="${encodeURIComponent(content.url)}"
                                data-title="${encodeURIComponent(content.title)}">

                                📄 ${content.title}

                            </button>

                        `;

                    }


                    /* ======================================
                       LIVE
                       ====================================== */

                    else if (
                        content.type ===
                        "live"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button live-button"
                                data-type="live"
                                data-url="${encodeURIComponent(content.url)}">

                                🔴 ${content.title}

                            </button>

                        `;

                    }

                }
            );


            courseCard.innerHTML = `

                <div class="course-title">

                    <h3>
                        ${course.title}
                    </h3>

                    <p>
                        ${course.description}
                    </p>

                </div>


                <div class="course-content">

                    ${contentHTML}

                </div>

            `;


            coursesContainer.appendChild(
                courseCard
            );

        }
    );


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    const buttons =
        coursesContainer.querySelectorAll(
            ".content-button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const type =
                        button.dataset.type;


                    const url =
                        decodeURIComponent(
                            button.dataset.url
                        );


                    const title =
                        button.dataset.title
                            ? decodeURIComponent(
                                button.dataset.title
                            )
                            : "";


                    if (
                        type ===
                        "youtube"
                    ) {

                        openYouTubeVideo(
                            url,
                            title
                        );

                    }


                    else if (
                        type ===
                        "local"
                    ) {

                        openLocalVideo(
                            url,
                            title
                        );

                    }


                    else if (
                        type ===
                        "pdf"
                    ) {

                        openPDFViewer(
                            url,
                            title
                        );

                    }
