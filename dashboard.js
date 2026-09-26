import { auth, db } from "./firebase.js";

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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   SETTINGS
========================================================= */

const MAX_DEVICES = 2;

const RESERVATION_DAYS = 3;

const HEARTBEAT_INTERVAL =
    2 * 60 * 1000;


/* =========================================================
   VARIABLES
========================================================= */

let currentUser = null;

let currentStudent = null;

let currentDeviceId = null;

let currentDeviceType = null;

let heartbeatTimer = null;


/* =========================================================
   DEVICE ID
========================================================= */

function getDeviceId() {

    let deviceId =
        localStorage.getItem(
            "fjmcDeviceId"
        );


    if (!deviceId) {

        deviceId =
            "device_" +
            crypto.randomUUID();


        localStorage.setItem(
            "fjmcDeviceId",
            deviceId
        );

    }


    return deviceId;
}


/* =========================================================
   DEVICE TYPE
========================================================= */

function getDeviceType() {

    const ua =
        navigator.userAgent.toLowerCase();


    const mobile =
        /android|iphone|ipad|ipod|mobile/i
            .test(ua);


    return mobile
        ? "mobile"
        : "desktop";
}


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;
        }


        currentUser = user;


        currentDeviceId =
            getDeviceId();


        currentDeviceType =
            getDeviceType();


        try {

            currentStudent =
                await loadStudentProfile(
                    user
                );


            if (!currentStudent) {

                alert(
                    "Student profile not found."
                );

                await signOut(auth);

                return;
            }


            sessionStorage.setItem(
                "studentEmail",
                currentStudent.email
            );


            sessionStorage.setItem(
                "studentUid",
                currentStudent.uid
            );


            document.getElementById(
                "studentName"
            ).textContent =
                `Welcome, ${currentStudent.name || "Student"}`;


            const allowed =
                await registerDevice();


            if (!allowed) {

                return;
            }


            await showStudentCourses();


            startHeartbeat();


        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );


            alert(
                "Dashboard load nahi ho raha."
            );

        }

    }
);


/* =========================================================
   LOAD STUDENT
========================================================= */

async function loadStudentProfile(user) {

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const userSnap =
        await getDoc(userRef);


    if (!userSnap.exists()) {

        return null;
    }


    const data =
        userSnap.data();


    return {

        uid: user.uid,

        email:
            data.email ||
            user.email ||
            "",

        name:
            data.name ||
            "Student",

        role:
            data.role ||
            "student",

        courses:
            Array.isArray(data.courses)
                ? data.courses
                : []

    };

}


/* =========================================================
   DEVICE REGISTRATION
========================================================= */

async function registerDevice() {

    const uid =
        currentUser.uid;


    const devicesRef =
        collection(
            db,
            "users",
            uid,
            "devices"
        );


    const currentDeviceRef =
        doc(
            devicesRef,
            currentDeviceId
        );


    const currentSnap =
        await getDoc(
            currentDeviceRef
        );


    const now =
        Date.now();


    /* -----------------------------------------
       CURRENT DEVICE ALREADY REGISTERED
    ----------------------------------------- */

    if (currentSnap.exists()) {

        const currentData =
            currentSnap.data();


        const expiresAt =
            getMillis(
                currentData.expiresAt
            );


        if (
            expiresAt &&
            expiresAt > now
        ) {

            await updateDoc(
                currentDeviceRef,
                {
                    lastSeen:
                        serverTimestamp()
                }
            );


            return true;
        }


        /* Expired current device */

        await updateDoc(
            currentDeviceRef,
            {

                active: false,

                lastSeen:
                    serverTimestamp()

            }
        );

    }


    /* -----------------------------------------
       LOAD ALL DEVICES
    ----------------------------------------- */

    const snapshot =
        await getDocs(
            devicesRef
        );


    const activeDevices = [];


    snapshot.forEach(
        (deviceDoc) => {

            const data =
                deviceDoc.data();


            const expiresAt =
                getMillis(
                    data.expiresAt
                );


            if (
                data.active === true &&
                expiresAt &&
                expiresAt > now
            ) {

                activeDevices.push({

                    id:
                        deviceDoc.id,

                    ...data

                });

            }

        }
    );


    /* -----------------------------------------
       CHECK SAME DEVICE TYPE
    ----------------------------------------- */

    const sameType =
        activeDevices.some(
            device =>
                device.deviceType ===
                currentDeviceType
        );


    if (sameType) {

        alert(
            currentDeviceType === "mobile"

                ? "Ek mobile device already active hai."

                : "Ek desktop/laptop device already active hai."
        );

        return false;
    }


    /* -----------------------------------------
       MAX TWO DEVICES
    ----------------------------------------- */

    if (
        activeDevices.length >=
        MAX_DEVICES
    ) {

        alert(
            "Maximum 2 devices already active hain."
        );

        return false;
    }


    /* -----------------------------------------
       CREATE NEW RESERVATION
    ----------------------------------------- */

    const expiresAt =
        new Date(
            now +
            RESERVATION_DAYS *
            24 *
            60 *
            60 *
            1000
        );


    await setDoc(

        currentDeviceRef,

        {

            deviceType:
                currentDeviceType,

            active:
                true,

            createdAt:
                serverTimestamp(),

            lastSeen:
                serverTimestamp(),

            expiresAt:
                expiresAt

        },

        {
            merge: true
        }

    );


    return true;
}


/* =========================================================
   HEARTBEAT
========================================================= */

function startHeartbeat() {

    if (heartbeatTimer) {

        clearInterval(
            heartbeatTimer
        );

    }


    heartbeatTimer =
        setInterval(
            heartbeat,
            HEARTBEAT_INTERVAL
        );

}


async function heartbeat() {

    if (
        !currentUser ||
        !currentDeviceId
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
                currentDeviceId
            );


        const snap =
            await getDoc(
                deviceRef
            );


        if (!snap.exists()) {

            await forceLogout();

            return;
        }


        const data =
            snap.data();


        const expiresAt =
            getMillis(
                data.expiresAt
            );


        if (
            !expiresAt ||
            expiresAt <= Date.now()
        ) {

            await updateDoc(
                deviceRef,
                {
                    active: false
                }
            );


            await forceLogout();

            return;
        }


        await updateDoc(

            deviceRef,

            {
                lastSeen:
                    serverTimestamp()
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
   FORCE LOGOUT
========================================================= */

async function forceLogout() {

    if (heartbeatTimer) {

        clearInterval(
            heartbeatTimer
        );

    }


    alert(
        "Your device reservation has expired."
    );


    await signOut(auth);


    window.location.href =
        "index.html";
}


/* =========================================================
   LOAD COURSES
========================================================= */

async function showStudentCourses() {

    const container =
        document.getElementById(
            "coursesContainer"
        );


    container.innerHTML = "";


    const courseIds =
        currentStudent.courses || [];


    if (
        courseIds.length === 0
    ) {

        container.innerHTML = `

            <div class="no-courses">

                <h3>
                    No courses assigned
                </h3>

                <p>
                    Please contact the academy.
                </p>

            </div>

        `;

        return;
    }


    for (
        const courseId
        of courseIds
    ) {

        try {

            const course =
                await loadCourse(
                    courseId
                );


            if (!course) {

                continue;
            }


            const card =
                createCourseCard(
                    course
                );


            container.appendChild(
                card
            );


        } catch (error) {

            console.error(
                "Course error:",
                courseId,
                error
            );

        }

    }


    if (
        container.children.length === 0
    ) {

        container.innerHTML = `

            <div class="no-courses">

                <h3>
                    No courses available
                </h3>

            </div>

        `;

    }

}


/* =========================================================
   LOAD COURSE
========================================================= */

async function loadCourse(
    courseId
) {

    const courseRef =
        doc(
            db,
            "courses",
            courseId
        );


    const courseSnap =
        await getDoc(
            courseRef
        );


    if (!courseSnap.exists()) {

        return null;
    }


    return {

        id:
            courseSnap.id,

        ...courseSnap.data()

    };

}


/* =========================================================
   CREATE COURSE CARD
========================================================= */

function createCourseCard(
    course
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "course-card";


    const title =
        course.title ||
        course.id;


    const description =
        course.description ||
        "";


    card.innerHTML = `

        <div class="course-card-header">

            <h3>
                ${escapeHTML(title)}
            </h3>

            ${
                description
                    ? `
                    <p>
                        ${escapeHTML(
                            description
                        )}
                    </p>
                    `
                    : ""
            }

        </div>


        <div class="course-content">

        </div>


        <div class="course-actions">

        </div>

    `;


    const contentContainer =
        card.querySelector(
            ".course-content"
        );


    const actionsContainer =
        card.querySelector(
            ".course-actions"
        );


    const contents =
        Array.isArray(course.contents)
            ? course.contents
            : [];


    contents.forEach(
        (content) => {

            const item =
                createContentItem(
                    content
                );


            if (item) {

                contentContainer
                    .appendChild(item);

            }

        }
    );


    /* -----------------------------------------
       TAKE TEST
    ----------------------------------------- */

    const testButton =
        document.createElement(
            "button"
        );


    testButton.textContent =
        "Take Test";


    testButton.className =
        "course-button test-button";


    testButton.addEventListener(
        "click",
        () => {

            window.location.href =
                `test.html?test=${encodeURIComponent(course.id)}`;

        }
    );


    actionsContainer.appendChild(
        testButton
    );


    /* -----------------------------------------
       LEADERBOARD
    ----------------------------------------- */

    const leaderboardButton =
        document.createElement(
            "button"
        );


    leaderboardButton.textContent =
        "Leaderboard";


    leaderboardButton.className =
        "course-button leaderboard-button";


    leaderboardButton.addEventListener(
        "click",
        () => {

            window.location.href =
                `leaderboard.html?test=${encodeURIComponent(course.id)}`;

        }
    );


    actionsContainer.appendChild(
        leaderboardButton
    );


    return card;
}


/* =========================================================
   CONTENT ITEM
========================================================= */

function createContentItem(
    content
) {

    if (!content) {

        return null;
    }


    const type =
        String(
            content.type || ""
        ).toLowerCase();


    const title =
        content.title ||
        "Content";


    const url =
        content.url ||
        "";


    /* -----------------------------------------
       YOUTUBE
    ----------------------------------------- */

    if (
        type === "youtube"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "course-button";


        button.textContent =
            title;


        button.addEventListener(
            "click",
            () => {

                const youtubeId =
                    getYouTubeId(
                        url
                    );


                if (!youtubeId) {

                    alert(
                        "Invalid YouTube URL."
                    );

                    return;
                }


                openVideoModal(
                    title,
                    `https://www.youtube.com/embed/${youtubeId}`
                );

            }
        );


        return button;
    }


    /* -----------------------------------------
       LOCAL VIDEO
    ----------------------------------------- */

    if (
        type === "local-video" ||
        type === "video" ||
        type === "mp4" ||
        type === "local"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "course-button";


        button.textContent =
            title;


        button.addEventListener(
            "click",
            () => {

                openLocalVideoModal(
                    title,
                    url
                );

            }
        );


        return button;
    }


    /* -----------------------------------------
       PDF
    ----------------------------------------- */

    if (
        type === "pdf"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "course-button";


        button.textContent =
            title;


        button.addEventListener(
            "click",
            () => {

                openPdfModal(
                    title,
                    url
                );

            }
        );


        return button;
    }


    /* -----------------------------------------
       LIVE
    ----------------------------------------- */

    if (
        type === "live"
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "course-button live-button";


        button.textContent =
            title;


        button.addEventListener(
            "click",
            () => {

                if (!url) {

                    alert(
                        "Live class link not available."
                    );

                    return;
                }


                window.open(
                    url,
                    "_blank"
                );

            }
        );


        return button;
    }


    return null;
}


/* =========================================================
   YOUTUBE ID
========================================================= */

function getYouTubeId(
    url
) {

    try {

        const parsed =
            new URL(url);


        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            return parsed.pathname
                .replace("/", "")
                .split("?")[0];

        }


        if (
            parsed.hostname.includes(
                "youtube.com"
            )
        ) {

            return parsed.searchParams
                .get("v");

        }


        return null;

    } catch {

        return null;

    }

}


/* =========================================================
   VIDEO MODAL
========================================================= */

function openVideoModal(
    title,
    videoUrl
) {

    const modal =
        createModal();


    modal.innerHTML = `

        <div class="modal-box">

            <div class="modal-header">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <button class="close-modal">
                    ×
                </button>

            </div>


            <div class="video-wrapper">

                <iframe
                    src="${escapeAttribute(videoUrl)}"
                    allowfullscreen
                    allow="
                        autoplay;
                        encrypted-media;
                        picture-in-picture
                    "
                ></iframe>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".close-modal"
        )
        .onclick = () => {

            modal.remove();

        };

}


/* =========================================================
   LOCAL VIDEO MODAL
========================================================= */

function openLocalVideoModal(
    title,
    url
) {

    const modal =
        createModal();


    modal.innerHTML = `

        <div class="modal-box">

            <div class="modal-header">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <button class="close-modal">
                    ×
                </button>

            </div>


            <video
                class="local-video"
                controls
                controlsList="nodownload"
                autoplay
            >

                <source
                    src="${escapeAttribute(url)}"
                    type="video/mp4"
                >

                Your browser does not support video.

            </video>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".close-modal"
        )
        .onclick = () => {

            modal.remove();

        };

}


/* =========================================================
   PDF MODAL
========================================================= */

async function openPdfModal(
    title,
    url
) {

    const modal =
        createModal();


    modal.innerHTML = `

        <div class="modal-box pdf-modal-box">

            <div class="modal-header">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <button class="close-modal">
                    ×
                </button>

            </div>


            <div
                id="pdfContainer"
                class="pdf-container"
            >

                Loading PDF...

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".close-modal"
        )
        .onclick = () => {

            modal.remove();

        };


    try {

        const pdf =
            await window.pdfjsLib
                .getDocument(url)
                .promise;


        const container =
            modal.querySelector(
                "#pdfContainer"
            );


        container.innerHTML = "";


        for (
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ) {

            const page =
                await pdf.getPage(
                    pageNumber
                );


            const viewport =
                page.getViewport({
                    scale: 1.3
                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                viewport.width;


            canvas.height =
                viewport.height;


            canvas.className =
                "pdf-page";


            container.appendChild(
                canvas
            );


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

    } catch (error) {

        console.error(
            "PDF error:",
            error
        );


        modal.querySelector(
            "#pdfContainer"
        ).innerHTML = `

            <p>
                PDF load nahi ho paya.
            </p>

        `;

    }

}


/* =========================================================
   CREATE MODAL
========================================================= */

function createModal() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "fjmc-modal";


    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


    return modal;
}


/* =========================================================
   LOGOUT
========================================================= */

document
    .getElementById(
        "logoutBtn"
    )
    ?.addEventListener(
        "click",
        async () => {

            try {

                if (heartbeatTimer) {

                    clearInterval(
                        heartbeatTimer
                    );

                }


                /*
                 * IMPORTANT:
                 * Logout device slot free nahi karta.
                 */

                await signOut(auth);


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    error
                );

            }

        }
    );


/* =========================================================
   DATE / FIRESTORE TIMESTAMP
========================================================= */

function getMillis(value) {

    if (!value) {

        return 0;
    }


    if (
        typeof value.toMillis ===
        "function"
    ) {

        return value.toMillis();

    }


    if (
        value instanceof Date
    ) {

        return value.getTime();

    }


    if (
        typeof value === "number"
    ) {

        return value;

    }


    return 0;
}


/* =========================================================
   ESCAPE HTML
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


function escapeAttribute(
    value
) {

    return escapeHTML(value);

}


/* =========================================================
   BASIC PROTECTION
========================================================= */

document.addEventListener(
    "contextmenu",
    (event) => {

        event.preventDefault();

    }
);


document.addEventListener(
    "selectstart",
    (event) => {

        event.preventDefault();

    }
);


document.addEventListener(
    "copy",
    (event) => {

        event.preventDefault();

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            (event.ctrlKey ||
             event.metaKey) &&
            [
                "s",
                "p",
                "u"
            ].includes(
                event.key.toLowerCase()
            )
        ) {

            event.preventDefault();

        }

    }
);
