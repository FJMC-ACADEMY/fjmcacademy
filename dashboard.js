/* =========================================================
   FJMC ACADEMY - STUDENT DASHBOARD
   FIREBASE + MAXIMUM 2 DEVICES
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
    deleteDoc,
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
                url: "./real-analysis-lecture-3.mp4"
            },

            {
                type: "pdf",
                title: "Lecture 1 PDF",
                url: "./321581555.PDF"
            },

            {
                type: "pdf",
                title: "Lecture 2 PDF",
                url: "./ch03.pdf"
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
                url: "./pdf/linear-algebra-notes.pdf"
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
                url: "./ch03.pdf"
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
   SETTINGS
   ========================================================= */

const MAX_DEVICES = 2;

/*
   Device 24 hours tak inactive na ho
   to active maana jayega.
*/

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
   GLOBAL DEVICE STATE
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
   FIREBASE AUTH CHECK
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
            (
                user.email || ""
            ).toLowerCase();


        if (!STUDENTS[email]) {

            await signOut(auth);

            window.location.href =
                "login.html";

            return;
        }


        /*
           Check / register device
        */

        const allowed =
            await registerDevice(user);


        if (!allowed) {

            return;
        }


        /*
           Save login information
        */

        sessionStorage.setItem(
            "loggedInStudent",
            email
        );

        sessionStorage.setItem(
            "firebaseUID",
            user.uid
        );


        /*
           Show student dashboard
        */

        const student =
            STUDENTS[email];


        if (studentName) {

            studentName.textContent =
                "Welcome, " +
                student.name;

        }


        showStudentCourses(
            student
        );


        /*
           Start heartbeat
        */

        startDeviceHeartbeat();

    }
);


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
   FIXED VERSION
   ========================================================= */

async function registerDevice(user) {

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


        /* =================================================
           CHECK CURRENT DEVICE
        ================================================= */

        const currentDeviceSnapshot =
            await getDoc(
                deviceRef
            );


        /*
           Agar ye device pehle se registered hai,
           to sirf lastSeen update karo.
        */

        if (
            currentDeviceSnapshot.exists()
        ) {

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


        /* =================================================
           GET ALL DEVICES
           IMPORTANT:
           Ye transaction ke bahar hai.
        ================================================= */

        const devicesSnapshot =
            await getDocs(
                devicesCollection(user)
            );


        let activeDevices = [];


        devicesSnapshot.forEach(
            function (deviceDoc) {

                /*
                   Apne current device ko count
                   karne ki zarurat nahi.
                */

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
                        data.lastSeen || 0
                    );


                const recentlyActive =
                    data.active === true &&
                    (now - lastSeen) <
                    DEVICE_TIMEOUT;


                if (
                    recentlyActive
                ) {

                    activeDevices.push(
                        deviceDoc.id
                    );

                }

            }
        );


        /* =================================================
           MAXIMUM 2 DEVICES
        ================================================= */

        if (
            activeDevices.length >=
            MAX_DEVICES
        ) {

            showDeviceLimitMessage();

            return false;
        }


        /* =================================================
           REGISTER NEW DEVICE
        ================================================= */

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
            "Unable to verify this device. Please try again."
        );


        /*
           IMPORTANT:
           Error hone par user ko forcibly logout
           nahi kar rahe. Isse dashboard blank/loading
           state me atakne se bachenge.
        */

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
        "Maximum 2 devices are already active for this account.\n\nPlease logout from another device first."
    );

}


/* =========================================================
   HEARTBEAT
   ========================================================= */

function startDeviceHeartbeat() {

    /*
       Purana heartbeat ho to pehle stop
    */

    if (deviceHeartbeat) {

        clearInterval(
            deviceHeartbeat
        );

    }


    /*
       Update immediately
    */

    updateDeviceHeartbeat();


    /*
       Every 2 minutes
    */

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
                lastSeen: Date.now(),
                active: true
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

function showStudentCourses(student) {

    if (!coursesContainer) {

        console.error(
            "coursesContainer not found in dashboard.html"
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

                <h3>No Course Assigned</h3>

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


                    /* ================= VIDEO ================= */

                    if (
                        content.type ===
                        "video"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button video-button"
                                onclick="openYouTubeVideo(
                                    '${escapeAttribute(content.url)}',
                                    '${escapeAttribute(content.title)}'
                                )">

                                ▶ ${content.title}

                            </button>

                        `;

                    }


                    /* ================= LOCAL VIDEO ================= */

                    else if (
                        content.type ===
                        "local-video"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button video-button"
                                onclick="openLocalVideo(
                                    '${escapeAttribute(content.url)}',
                                    '${escapeAttribute(content.title)}'
                                )">

                                ▶ ${content.title}

                            </button>

                        `;

                    }


                    /* ================= PDF ================= */

                    else if (
                        content.type ===
                        "pdf"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button pdf-button"
                                onclick="openPDFViewer(
                                    '${escapeAttribute(content.url)}',
                                    '${escapeAttribute(content.title)}'
                                )">

                                📄 ${content.title}

                            </button>

                        `;

                    }


                    /* ================= LIVE ================= */

                    else if (
                        content.type ===
                        "live"
                    ) {

                        contentHTML += `

                            <button
                                class="content-button live-button"
                                onclick="openLiveClass(
                                    '${escapeAttribute(content.url)}'
                                )">

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

}


/* =========================================================
   ESCAPE ATTRIBUTE
   ========================================================= */

function escapeAttribute(text) {

    return String(text)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        )

        .replace(
            /"/g,
            "&quot;"
        );

}


/* =========================================================
   YOUTUBE VIDEO
   ========================================================= */

function openYouTubeVideo(
    url,
    title
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "video-overlay";


    overlay.innerHTML = `

        <div class="video-window">

            <div class="video-header">

                <span>
                    ${title}
                </span>

                <button
                    class="close-video"
                    onclick="
                        this.closest('.video-overlay').remove();
                        document.body.classList.remove('viewer-open');
                    ">

                    ✕

                </button>

            </div>


            <div class="video-player-container">

                <iframe

                    src="${url}"

                    title="${title}"

                    allow="
                        accelerometer;
                        autoplay;
                        clipboard-write;
                        encrypted-media;
                        gyroscope;
                        picture-in-picture;
                        fullscreen
                    "

                    allowfullscreen>

                </iframe>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    document.body.classList.add(
        "viewer-open"
    );

}


/* =========================================================
   LOCAL VIDEO
   ========================================================= */

function openLocalVideo(
    url,
    title
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "video-overlay";


    overlay.innerHTML = `

        <div class="video-window">

            <div class="video-header">

                <span>
                    ${title}
                </span>

                <button
                    class="close-video"
                    onclick="
                        this.closest('.video-overlay').remove();
                        document.body.classList.remove('viewer-open');
                    ">

                    ✕

                </button>

            </div>


            <div class="video-player-container">

                <video

                    controls

                    controlsList="nodownload"

                    disablePictureInPicture

                    playsinline

                    preload="metadata">

                    <source
                        src="${url}"
                        type="video/mp4">

                    Your browser does not support video.

                </video>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    document.body.classList.add(
        "viewer-open"
    );

}


/* =========================================================
   LIVE CLASS
   ========================================================= */

function openLiveClass(url) {

    if (
        !url ||
        url === "#"
    ) {

        alert(
            "Live class link will be available here."
        );

        return;
    }


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   PDF.js WORKER
   ========================================================= */

if (
    typeof pdfjsLib !==
    "undefined"
) {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}


/* =========================================================
   PDF VIEWER
   ========================================================= */

async function openPDFViewer(
    pdfURL,
    title
) {

    if (
        typeof pdfjsLib ===
        "undefined"
    ) {

        alert(
            "PDF viewer could not load. Please refresh the page."
        );

        return;
    }


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "pdfFullscreen";


    overlay.innerHTML = `

        <div class="pdf-header">

            <div class="pdf-title">
                ${title}
            </div>

            <button id="closePDF">
                ✕ Close
            </button>

        </div>


        <div class="pdf-screen-watermark">

            <div>
                FJMC Academy
            </div>

            <div>
                ${currentUser?.email || ""}
            </div>

        </div>


        <div
            id="pdfScrollArea"
            class="pdf-scroll-area">

            <div
                id="pdfLoading"
                class="pdf-loading">

                Loading PDF...

            </div>


            <div
                id="pdfPages"
                class="pdf-pages">

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    document.body.classList.add(
        "viewer-open"
    );


    document
        .getElementById("closePDF")
        .addEventListener(
            "click",
            closePDFViewer
        );


    try {

        const loadingTask =
            pdfjsLib.getDocument({
                url: pdfURL
            });


        const pdf =
            await loadingTask.promise;


        const pagesContainer =
            document.getElementById(
                "pdfPages"
            );


        const loadingMessage =
            document.getElementById(
                "pdfLoading"
            );


        if (loadingMessage) {

            loadingMessage.remove();

        }


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            await renderPDFPage(
                pdf,
                pageNumber,
                pagesContainer
            );

        }


    } catch (error) {

        console.error(
            "PDF Error:",
            error
        );


        const loadingMessage =
            document.getElementById(
                "pdfLoading"
            );


        if (loadingMessage) {

            loadingMessage.innerHTML = `

                <div class="pdf-error">

                    <h3>
                        PDF could not be opened
                    </h3>

                    <p>
                        Please check the PDF file path.
                    </p>

                </div>

            `;

        }

    }

}


/* =========================================================
   RENDER PDF PAGE
   ========================================================= */

async function renderPDFPage(
    pdf,
    pageNumber,
    container
) {

    const page =
        await pdf.getPage(
            pageNumber
        );


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "pdf-page-wrapper";


    wrapper.style.position =
        "relative";


    wrapper.style.width =
        "100%";


    wrapper.style.display =
        "flex";


    wrapper.style.justifyContent =
        "center";


    wrapper.style.alignItems =
        "flex-start";


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.className =
        "pdf-page";


    canvas.style.display =
        "block";


    canvas.style.margin =
        "0 auto";


    wrapper.appendChild(
        canvas
    );


    container.appendChild(
        wrapper
    );


    const originalViewport =
        page.getViewport({
            scale: 1
        });


    const screenWidth =
        window.innerWidth;


    let availableWidth;


    if (
        screenWidth <= 600
    ) {

        availableWidth =
            screenWidth - 20;

    } else {

        availableWidth =
            Math.min(
                screenWidth - 30,
                1000
            );

    }


    const scale =
        availableWidth /
        originalViewport.width;


    const viewport =
        page.getViewport({
            scale: scale
        });


    const devicePixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.round(
            viewport.width *
            devicePixelRatio
        );


    canvas.height =
        Math.round(
            viewport.height *
            devicePixelRatio
        );


    canvas.style.width =
        Math.round(
            viewport.width
        ) + "px";


    canvas.style.height =
        Math.round(
            viewport.height
        ) + "px";


    const context =
        canvas.getContext(
            "2d"
        );


    const renderContext = {

        canvasContext:
            context,

        viewport:
            viewport,

        transform:
            devicePixelRatio !== 1
                ? [
                    devicePixelRatio,
                    0,
                    0,
                    devicePixelRatio,
                    0,
                    0
                ]
                : null

    };


    await page
        .render(renderContext)
        .promise;

}


/* =========================================================
   CLOSE PDF
   ========================================================= */

function closePDFViewer() {

    const pdfViewer =
        document.getElementById(
            "pdfFullscreen"
        );


    if (pdfViewer) {

        pdfViewer.remove();

    }


    document.body.classList.remove(
        "viewer-open"
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            /*
               Button ko double click se bachao
            */

            logoutBtn.disabled =
                true;


            try {

                /*
                   Heartbeat pehle stop
                */

                if (deviceHeartbeat) {

                    clearInterval(
                        deviceHeartbeat
                    );

                    deviceHeartbeat =
                        null;

                }


                /*
                   Device ko inactive karo
                */

                if (currentUser) {

                    const deviceRef =
                        doc(
                            db,
                            "users",
                            currentUser.uid,
                            "devices",
                            deviceId
                        );


                    try {

                        await updateDoc(
                            deviceRef,
                            {
                                active: false,
                                lastSeen:
                                    Date.now()
                            }
                        );

                    } catch (deviceError) {

                        console.error(
                            "Device update error:",
                            deviceError
                        );

                    }

                }


                /*
                   Session clear
                */

                sessionStorage.removeItem(
                    "loggedInStudent"
                );


                sessionStorage.removeItem(
                    "firebaseUID"
                );


                /*
                   Firebase logout
                */

                await signOut(
                    auth
                );


                /*
                   Login page
                */

                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                /*
                   Logout ko fail mat hone do
                */

                try {

                    await signOut(
                        auth
                    );

                } catch (signOutError) {

                    console.error(
                        signOutError
                    );

                }


                sessionStorage.removeItem(
                    "loggedInStudent"
                );


                sessionStorage.removeItem(
                    "firebaseUID"
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =========================================================
   BASIC PROTECTION
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

        /*
           Ctrl + S
        */

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

        }


        /*
           Ctrl + P
        */

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === "p"
        ) {

            event.preventDefault();

        }


        /*
           Ctrl + U
        */

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === "u"
        ) {

            event.preventDefault();

        }


        /*
           Ctrl + C
        */

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === "c"
        ) {

            event.preventDefault();

        }

    }
);
