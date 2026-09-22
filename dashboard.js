/* =========================================================
   FJMC ACADEMY - STUDENT DASHBOARD
   FAST LOAD + MAXIMUM 2 DEVICES
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

    let id = localStorage.getItem("fjmcDeviceId");

    if (!id) {

        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {

            id = "device-" + crypto.randomUUID();

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


const deviceId = getDeviceId();


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentUser = null;
let deviceHeartbeat = null;


/* =========================================================
   HTML ELEMENTS
   ========================================================= */

const coursesContainer =
    document.getElementById("coursesContainer");

const studentName =
    document.getElementById("studentName");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================================
   FAST FIREBASE AUTH
   ========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser = user;


        const email =
            (user.email || "")
                .trim()
                .toLowerCase();


        console.log(
            "Logged in:",
            email
        );


        const student =
            STUDENTS[email];


        /* =================================================
           STUDENT CHECK
           ================================================= */

        if (!student) {

            console.error(
                "Student not found:",
                email
            );

            await signOut(auth);

            window.location.href =
                "login.html";

            return;
        }


        /* =================================================
           SAVE SESSION
           ================================================= */

        sessionStorage.setItem(
            "loggedInStudent",
            email
        );

        sessionStorage.setItem(
            "firebaseUID",
            user.uid
        );


        /* =================================================
           SHOW WELCOME IMMEDIATELY
           ================================================= */

        if (studentName) {

            studentName.textContent =
                "Welcome, " +
                student.name;
        }


        /* =================================================
           SHOW COURSES IMMEDIATELY
           ================================================= */

        showStudentCourses(student);


        /* =================================================
           DEVICE CHECK
           BACKGROUND
           ================================================= */

        registerDevice(user)
            .then(function (allowed) {

                console.log(
                    "Device allowed:",
                    allowed
                );

                if (!allowed) {

                    signOut(auth);

                    return;
                }

                startDeviceHeartbeat();

            })
            .catch(function (error) {

                console.error(
                    "Background device error:",
                    error
                );

            });

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
   REGISTER / CHECK DEVICE
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


        const now = Date.now();


        /* =================================================
           CURRENT DEVICE
           ================================================= */

        const currentDevice =
            await getDoc(deviceRef);


        if (currentDevice.exists()) {

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
           CHECK OTHER DEVICES
           ================================================= */

        const devices =
            await getDocs(
                devicesCollection(user)
            );


        let activeDevices = 0;


        devices.forEach(function (deviceDoc) {

            if (deviceDoc.id === deviceId) {
                return;
            }


            const data =
                deviceDoc.data();


            const lastSeen =
                Number(
                    data.lastSeen || 0
                );


            const active =
                data.active === true &&
                (
                    now - lastSeen
                ) < DEVICE_TIMEOUT;


            if (active) {
                activeDevices++;
            }

        });


        /* =================================================
           MAXIMUM 2
           ================================================= */

        if (activeDevices >= MAX_DEVICES) {

            showDeviceLimitMessage();

            return false;
        }


        /* =================================================
           CREATE DEVICE
           ================================================= */

        await setDoc(
            deviceRef,
            {
                email: user.email,
                lastSeen: now,
                active: true,
                createdAt: serverTimestamp()
            }
        );


        return true;

    } catch (error) {

        console.error(
            "Device registration error:",
            error
        );


        /*
           IMPORTANT:
           Dashboard already loaded.
           Do not freeze the courses.
        */

        console.error(
            "Firebase device check failed:",
            error.code,
            error.message
        );


        return true;
    }
}


/* =========================================================
   DEVICE LIMIT
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
            "coursesContainer not found"
        );

        return;
    }


    coursesContainer.innerHTML = "";


    if (
        !student.courses ||
        student.courses.length === 0
    ) {

        coursesContainer.innerHTML = `
            <div class="no-course">
                <h3>No Course Assigned</h3>
                <p>Please contact FJMC Academy.</p>
            </div>
        `;

        return;
    }


    student.courses.forEach(function (courseId) {

        const course =
            COURSES[courseId];


        if (!course) {
            return;
        }


        const courseCard =
            document.createElement("div");


        courseCard.className =
            "course-card";


        let contentHTML = "";


        course.contents.forEach(
            function (content) {

                if (content.type === "video") {

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


                else if (
                    content.type === "local-video"
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


                else if (
                    content.type === "pdf"
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


                else if (
                    content.type === "live"
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

    });


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    const buttons =
        coursesContainer.querySelectorAll(
            ".content-button"
        );


    buttons.forEach(function (button) {

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


                if (type === "youtube") {

                    openYouTubeVideo(
                        url,
                        title
                    );
                }


                else if (type === "local") {

                    openLocalVideo(
                        url,
                        title
                    );
                }


                else if (type === "pdf") {

                    openPDFViewer(
                        url,
                        title
                    );
                }


                else if (type === "live") {

                    openLiveClass(url);

                }

            }
        );

    });

}


/* =========================================================
   CREATE MODAL
   ========================================================= */

function createModal() {

    let modal =
        document.getElementById(
            "fjmcContentModal"
        );


    if (modal) {
        return modal;
    }


    modal =
        document.createElement("div");


    modal.id =
        "fjmcContentModal";


    modal.innerHTML = `

        <div
            id="fjmcModalOverlay"
            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.85);
                z-index:999999;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:15px;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:1100px;
                    max-height:95vh;
                    background:#111;
                    border-radius:12px;
                    overflow:hidden;
                    position:relative;
                    display:flex;
                    flex-direction:column;
                "
            >

                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        padding:10px 15px;
                        background:#182033;
                        color:white;
                    "
                >

                    <strong
                        id="fjmcModalTitle">
                    </strong>

                    <button
                        id="fjmcModalClose"
                        style="
                            border:0;
                            background:#e63946;
                            color:white;
                            width:38px;
                            height:38px;
                            border-radius:50%;
                            font-size:20px;
                            cursor:pointer;
                        "
                    >
                        ×
                    </button>

                </div>


                <div
                    id="fjmcModalBody"
                    style="
                        flex:1;
                        overflow:auto;
                        background:#111;
                    "
                >
                </div>

            </div>

        </div>
    `;


    document.body.appendChild(modal);


    document
        .getElementById("fjmcModalClose")
        .addEventListener(
            "click",
            closeModal
        );


    document
        .getElementById("fjmcModalOverlay")
        .addEventListener(
            "click",
            function (event) {

                if (
                    event.target.id ===
                    "fjmcModalOverlay"
                ) {

                    closeModal();

                }

            }
        );


    return modal;
}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "fjmcContentModal"
        );


    if (modal) {

        modal.remove();

    }

}


/* =========================================================
   YOUTUBE VIDEO
   ========================================================= */

function openYouTubeVideo(
    url,
    title
) {

    const modal =
        createModal();


    const modalTitle =
        document.getElementById(
            "fjmcModalTitle"
        );


    const body =
        document.getElementById(
            "fjmcModalBody"
        );


    modalTitle.textContent =
        title;


    body.innerHTML = `

        <div
            style="
                width:100%;
                aspect-ratio:16/9;
                background:#000;
            "
        >

            <iframe
                src="${url}"
                title="${title}"
                style="
                    width:100%;
                    height:100%;
                    border:0;
                "
                allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                    web-share
                "
                allowfullscreen>
            </iframe>

        </div>
    `;

}


/* =========================================================
   LOCAL VIDEO
   ========================================================= */

function openLocalVideo(
    url,
    title
) {

    const modal =
        createModal();


    const modalTitle =
        document.getElementById(
            "fjmcModalTitle"
        );


    const body =
        document.getElementById(
            "fjmcModalBody"
        );


    modalTitle.textContent =
        title;


    body.innerHTML = `

        <video
            controls
            controlsList="nodownload"
            disablePictureInPicture
            playsinline
            style="
                width:100%;
                max-height:80vh;
                display:block;
                background:#000;
            "
        >

            <source
                src="${url}"
                type="video/mp4"
            >

            Your browser does not support video.

        </video>
    `;

}


/* =========================================================
   LIVE CLASS
   ========================================================= */

function openLiveClass(url) {

    if (!url || url === "#") {

        alert(
            "Live class link is not available yet."
        );

        return;
    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}

/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    /* ============================================
       REMOVE FIXED SCREEN WATERMARK
       ============================================ */

    const watermark =
        document.getElementById(
            "fjmcFloatingWatermark"
        );

    if (watermark) {
        watermark.remove();
    }


    /* ============================================
       REMOVE PDF MODAL
       ============================================ */

    const modal =
        document.getElementById(
            "fjmcContentModal"
        );

    if (modal) {
        modal.remove();
    }

}


/* =========================================================
   PDF VIEWER
   FIXED CENTER WATERMARK
   ========================================================= */

async function openPDFViewer(
    url,
    title
) {

    /* ============================================
       CREATE MODAL
       ============================================ */

    const modal =
        createModal();


    const modalTitle =
        document.getElementById(
            "fjmcModalTitle"
        );


    const body =
        document.getElementById(
            "fjmcModalBody"
        );


    modalTitle.textContent =
        title;


    /* ============================================
       PDF AREA
       ============================================ */

    body.innerHTML = `

        <div
            id="pdfLoading"
            style="
                color:white;
                text-align:center;
                padding:30px;
                font-size:16px;
            "
        >
            Loading PDF...
        </div>

        <div
            id="pdfPages"
            style="
                padding:15px;
                text-align:center;
                user-select:none;
                -webkit-user-select:none;
                -webkit-touch-callout:none;
            "
        >
        </div>

    `;


    try {

        /* ========================================
           CHECK PDF.JS
           ======================================== */

        if (
            typeof pdfjsLib ===
            "undefined"
        ) {

            throw new Error(
                "PDF.js is not loaded."
            );

        }


        /* ========================================
           PDF WORKER
           ======================================== */

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


        /* ========================================
           LOAD PDF
           ======================================== */

        const pdf =
            await pdfjsLib
                .getDocument(url)
                .promise;


        const pages =
            document.getElementById(
                "pdfPages"
            );


        const loading =
            document.getElementById(
                "pdfLoading"
            );


        if (loading) {
            loading.remove();
        }


        /* ========================================
           CREATE FIXED SCREEN WATERMARK
           ======================================== */

        const oldWatermark =
            document.getElementById(
                "fjmcFloatingWatermark"
            );


        if (oldWatermark) {
            oldWatermark.remove();
        }


        const watermark =
            document.createElement(
                "div"
            );


        watermark.id =
            "fjmcFloatingWatermark";


        watermark.textContent =
            "FJMC ACADEMY";


        /* ========================================
           FIXED POSITION
           ======================================== */

        watermark.style.position =
            "fixed";


        watermark.style.left =
            "50%";


        watermark.style.top =
            "50%";


        watermark.style.transform =
            "translate(-50%, -50%) rotate(-30deg)";


        /* ========================================
           BLACK / DARK WATERMARK
           ======================================== */

        watermark.style.color =
            "rgba(0, 0, 0, 0.32)";


        watermark.style.fontSize =
            "34px";


        watermark.style.fontWeight =
            "800";


        watermark.style.letterSpacing =
            "2px";


        watermark.style.whiteSpace =
            "nowrap";


        /* ========================================
           IMPORTANT
           WATERMARK PDF PAGE KA PART NAHI HAI
           ======================================== */

        watermark.style.pointerEvents =
            "none";


        watermark.style.userSelect =
            "none";


        watermark.style.webkitUserSelect =
            "none";


        watermark.style.webkitTouchCallout =
            "none";


        /* ========================================
           ALWAYS ABOVE PDF
           ======================================== */

        watermark.style.zIndex =
            "1000000";


        document.body.appendChild(
            watermark
        );


        /* ========================================
           RENDER ALL PDF PAGES
           ======================================== */

        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(
                    pageNumber
                );


            /* ====================================
               PAGE SIZE
               ==================================== */

            const viewport =
                page.getViewport({
                    scale: 1.4
                });


            /* ====================================
               PAGE WRAPPER
               ==================================== */

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.style.position =
                "relative";


            wrapper.style.display =
                "inline-block";


            wrapper.style.margin =
                "0 auto 25px auto";


            wrapper.style.maxWidth =
                "100%";


            wrapper.style.background =
                "#ffffff";


            wrapper.style.overflow =
                "hidden";


            /* ====================================
               CANVAS
               ==================================== */

            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                viewport.width;


            canvas.height =
                viewport.height;


            canvas.style.width =
                "100%";


            canvas.style.height =
                "auto";


            canvas.style.display =
                "block";


            canvas.style.userSelect =
                "none";


            canvas.style.webkitUserSelect =
                "none";


            canvas.style.webkitTouchCallout =
                "none";


            wrapper.appendChild(
                canvas
            );


            pages.appendChild(
                wrapper
            );


            /* ====================================
               RENDER PAGE
               ==================================== */

            const context =
                canvas.getContext(
                    "2d"
                );


            await page.render({

                canvasContext:
                    context,

                viewport:
                    viewport

            }).promise;

        }


        /* ========================================
           PDF TEXT SELECTION OFF
           ======================================== */

        pages.style.userSelect =
            "none";


        pages.style.webkitUserSelect =
            "none";


        pages.style.webkitTouchCallout =
            "none";


    } catch (error) {

        console.error(
            "PDF error:",
            error
        );


        /* ========================================
           REMOVE WATERMARK IF PDF FAILS
           ======================================== */

        const watermark =
            document.getElementById(
                "fjmcFloatingWatermark"
            );


        if (watermark) {
            watermark.remove();
        }


        /* ========================================
           ERROR MESSAGE
           ======================================== */

        body.innerHTML = `

            <div
                style="
                    color:white;
                    padding:30px;
                    text-align:center;
                "
            >

                <h3>
                    PDF could not be opened
                </h3>

                <p>
                    ${error.message || ""}
                </p>

            </div>

        `;

    }

}
/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                if (currentUser) {

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
                            lastSeen: Date.now()
                        }
                    );
                }

            } catch (error) {

                console.error(
                    "Logout device update:",
                    error
                );

            }


            if (deviceHeartbeat) {

                clearInterval(
                    deviceHeartbeat
                );

                deviceHeartbeat =
                    null;
            }


            sessionStorage.removeItem(
                "loggedInStudent"
            );

            sessionStorage.removeItem(
                "firebaseUID"
            );


            try {

                await signOut(auth);

            } catch (error) {

                console.error(
                    "Sign out:",
                    error
                );

            }


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   BASIC CONTENT PROTECTION
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


        if (
            (event.ctrlKey || event.metaKey) &&
            (
                key === "s" ||
                key === "p" ||
                key === "u" ||
                key === "c"
            )
        ) {

            event.preventDefault();

        }

    }
);
