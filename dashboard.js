// ============================================================
// FJMC ACADEMY - STUDENT DASHBOARD
// Courses / student details are controlled from ADMIN PANEL
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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


// ============================================================
// SETTINGS
// ============================================================

const MAX_DEVICES = 2;
const RESERVATION_DAYS = 3;
const HEARTBEAT_INTERVAL = 2 * 60 * 1000;

const DEVICE_STORAGE_KEY = "fjmcDeviceId";


// ============================================================
// DOM
// ============================================================

const studentNameEl =
    document.getElementById("studentName");

const coursesContainer =
    document.getElementById("coursesContainer");

const logoutBtn =
    document.getElementById("logoutBtn");


// ============================================================
// GLOBAL STATE
// ============================================================

let currentUser = null;
let currentStudent = null;
let heartbeatTimer = null;


// ============================================================
// DEVICE ID
// ============================================================

function getDeviceId() {

    let deviceId =
        localStorage.getItem(DEVICE_STORAGE_KEY);

    if (!deviceId) {

        if (
            typeof crypto !== "undefined" &&
            crypto.randomUUID
        ) {
            deviceId = crypto.randomUUID();
        } else {

            deviceId =
                "device-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 12);
        }

        localStorage.setItem(
            DEVICE_STORAGE_KEY,
            deviceId
        );
    }

    return deviceId;
}


// ============================================================
// DEVICE TYPE
// ============================================================

function getDeviceType() {

    const ua =
        navigator.userAgent.toLowerCase();

    const isMobile =
        /android|iphone|ipad|ipod|mobile|tablet/.test(ua);

    return isMobile
        ? "mobile"
        : "desktop";
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// DATE HELPERS
// ============================================================

function getExpiryDate() {

    const date = new Date();

    date.setDate(
        date.getDate() + RESERVATION_DAYS
    );

    return date;
}


function timestampToDate(timestamp) {

    if (!timestamp) {
        return null;
    }

    if (
        typeof timestamp.toDate === "function"
    ) {
        return timestamp.toDate();
    }

    if (timestamp instanceof Date) {
        return timestamp;
    }

    return null;
}


// ============================================================
// LOAD STUDENT PROFILE FROM FIRESTORE
// ============================================================
//
// Admin Panel should create/update:
//
// users/{uid}
//
// Example:
//
// {
//    name: "Rahul",
//    email: "rahul@gmail.com",
//    role: "student",
//    courses: ["real-analysis", "calculus"]
// }
//
// ============================================================

async function loadStudentProfile(user) {

    const userRef =
        doc(db, "users", user.uid);

    const snap =
        await getDoc(userRef);

    if (!snap.exists()) {

        console.error(
            "Student profile not found:",
            user.uid
        );

        return null;
    }

    const data = snap.data();

    return {

        uid: user.uid,

        email:
            data.email ||
            user.email ||
            "",

        name:
            data.name ||
            user.displayName ||
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


// ============================================================
// LOAD COURSE FROM FIRESTORE
// ============================================================
//
// Admin Panel should create:
//
// courses/{courseId}
//
// Example:
//
// {
//    title: "Real Analysis",
//    description: "Real Analysis Course",
//    contents: [
//       {
//          type: "youtube",
//          title: "Lecture 1",
//          url: "..."
//       }
//    ]
// }
//
// ============================================================

async function loadCourse(courseId) {

    try {

        const courseRef =
            doc(db, "courses", courseId);

        const snap =
            await getDoc(courseRef);

        if (!snap.exists()) {

            console.warn(
                "Course not found:",
                courseId
            );

            return null;
        }

        return {

            id: courseId,

            ...snap.data()
        };

    } catch (error) {

        console.error(
            "Course loading error:",
            courseId,
            error
        );

        return null;
    }
}


// ============================================================
// LOAD ALL ASSIGNED COURSES
// ============================================================

async function loadStudentCourses(courseIds) {

    if (!Array.isArray(courseIds)) {
        return [];
    }

    const validIds =
        courseIds.filter(
            id =>
                typeof id === "string" &&
                id.trim() !== ""
        );

    const courses =
        await Promise.all(
            validIds.map(
                courseId =>
                    loadCourse(courseId)
            )
        );

    return courses.filter(Boolean);
}


// ============================================================
// DEVICE COLLECTION
// ============================================================

function getDevicesCollection(user) {

    return collection(
        db,
        "users",
        user.uid,
        "devices"
    );
}


// ============================================================
// GET ACTIVE DEVICES
// ============================================================

async function getActiveDevices(user) {

    const devicesRef =
        getDevicesCollection(user);

    const snapshot =
        await getDocs(devicesRef);

    const now =
        new Date();

    const activeDevices = [];

    snapshot.forEach(deviceDoc => {

        const data =
            deviceDoc.data();

        const expiresAt =
            timestampToDate(
                data.expiresAt
            );

        if (
            data.active === true &&
            expiresAt &&
            expiresAt > now
        ) {

            activeDevices.push({

                id: deviceDoc.id,

                ...data,

                expiresDate: expiresAt
            });
        }
    });

    return activeDevices;
}


// ============================================================
// REGISTER DEVICE
// ============================================================

async function registerDevice(user) {

    const deviceId =
        getDeviceId();

    const deviceType =
        getDeviceType();

    const deviceRef =
        doc(
            db,
            "users",
            user.uid,
            "devices",
            deviceId
        );

    const deviceSnap =
        await getDoc(deviceRef);


    // --------------------------------------------------------
    // CURRENT DEVICE ALREADY EXISTS
    // --------------------------------------------------------

    if (deviceSnap.exists()) {

        const data =
            deviceSnap.data();

        const expiresAt =
            timestampToDate(
                data.expiresAt
            );

        // Current reservation still valid
        if (
            data.active === true &&
            expiresAt &&
            expiresAt > new Date()
        ) {

            await updateDoc(
                deviceRef,
                {
                    lastSeen:
                        serverTimestamp()
                }
            );

            return true;
        }
    }


    // --------------------------------------------------------
    // CHECK OTHER DEVICES
    // --------------------------------------------------------

    const activeDevices =
        await getActiveDevices(user);


    const otherDevices =
        activeDevices.filter(
            device =>
                device.id !== deviceId
        );


    // --------------------------------------------------------
    // SAME DEVICE TYPE CHECK
    // --------------------------------------------------------

    const sameTypeDevice =
        otherDevices.find(
            device =>
                device.deviceType === deviceType
        );


    if (sameTypeDevice) {

        alert(
            "You already have an active " +
            deviceType +
            " device.\n\n" +
            "Maximum allowed:\n" +
            "1 Mobile + 1 Desktop/Laptop."
        );

        return false;
    }


    // --------------------------------------------------------
    // MAXIMUM TWO DEVICES
    // --------------------------------------------------------

    if (otherDevices.length >= MAX_DEVICES) {

        alert(
            "Maximum 2 devices are already active.\n\n" +
            "Allowed:\n" +
            "1 Mobile + 1 Desktop/Laptop."
        );

        return false;
    }


    // --------------------------------------------------------
    // CREATE / RENEW DEVICE
    // --------------------------------------------------------

    await setDoc(
        deviceRef,
        {

            deviceType:

                deviceSnap.exists()
                    ? (
                        deviceSnap.data().deviceType ||
                        deviceType
                    )
                    : deviceType,

            active: true,

            createdAt:
                deviceSnap.exists()
                    ? (
                        deviceSnap.data().createdAt ||
                        serverTimestamp()
                    )
                    : serverTimestamp(),

            lastSeen:
                serverTimestamp(),

            expiresAt:
                getExpiryDate()
        },
        {
            merge: true
        }
    );

    return true;
}


// ============================================================
// HEARTBEAT
// ============================================================

async function heartbeat() {

    if (!currentUser) {
        return;
    }

    try {

        const deviceId =
            getDeviceId();

        const deviceRef =
            doc(
                db,
                "users",
                currentUser.uid,
                "devices",
                deviceId
            );

        const snap =
            await getDoc(deviceRef);

        if (!snap.exists()) {

            await forceLogout();
            return;
        }

        const data =
            snap.data();

        const expiresAt =
            timestampToDate(
                data.expiresAt
            );


        // Reservation expired
        if (
            !expiresAt ||
            expiresAt <= new Date()
        ) {

            alert(
                "Your device reservation has expired. Please login again."
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


// ============================================================
// START HEARTBEAT
// ============================================================

function startHeartbeat() {

    stopHeartbeat();

    heartbeatTimer =
        setInterval(
            heartbeat,
            HEARTBEAT_INTERVAL
        );
}


// ============================================================
// STOP HEARTBEAT
// ============================================================

function stopHeartbeat() {

    if (heartbeatTimer) {

        clearInterval(
            heartbeatTimer
        );

        heartbeatTimer = null;
    }
}


// ============================================================
// FORCE LOGOUT
// ============================================================

async function forceLogout() {

    stopHeartbeat();

    sessionStorage.removeItem(
        "fjmcStudentEmail"
    );

    sessionStorage.removeItem(
        "fjmcStudentUid"
    );

    try {

        await signOut(auth);

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );
    }

    window.location.href =
        "login.html";
}


// ============================================================
// COURSE CARD
// ============================================================

function createCourseCard(course) {

    const card =
        document.createElement("div");

    card.className =
        "course-card";


    const title =
        escapeHTML(
            course.title ||
            course.name ||
            course.id
        );


    const description =
        escapeHTML(
            course.description ||
            ""
        );


    card.innerHTML = `

        <div class="course-card-content">

            <h3>
                ${title}
            </h3>

            ${
                description
                    ? `<p>${description}</p>`
                    : ""
            }

            <div class="course-buttons">
            </div>

        </div>
    `;


    const buttonsContainer =
        card.querySelector(
            ".course-buttons"
        );


    const contents =
        Array.isArray(course.contents)
            ? course.contents
            : [];


    // --------------------------------------------------------
    // CONTENT BUTTONS
    // --------------------------------------------------------

    contents.forEach(
        (content, index) => {

            if (!content) {
                return;
            }

            const type =
                String(
                    content.type || ""
                ).toLowerCase();

            const contentTitle =
                content.title ||
                `Lecture ${index + 1}`;


            // ------------------------------------------------
            // YOUTUBE
            // ------------------------------------------------

            if (
                type === "youtube" ||
                type === "video"
            ) {

                const btn =
                    document.createElement(
                        "button"
                    );

                btn.className =
                    "course-btn";

                btn.textContent =
                    contentTitle;

                btn.addEventListener(
                    "click",
                    () => {

                        openYouTubeModal(
                            content.url,
                            contentTitle
                        );
                    }
                );

                buttonsContainer.appendChild(
                    btn
                );

                return;
            }


            // ------------------------------------------------
            // LOCAL VIDEO
            // ------------------------------------------------

            if (
                type === "local-video" ||
                type === "mp4" ||
                type === "local"
            ) {

                const btn =
                    document.createElement(
                        "button"
                    );

                btn.className =
                    "course-btn";

                btn.textContent =
                    contentTitle;

                btn.addEventListener(
                    "click",
                    () => {

                        openVideoModal(
                            content.url,
                            contentTitle
                        );
                    }
                );

                buttonsContainer.appendChild(
                    btn
                );

                return;
            }


            // ------------------------------------------------
            // PDF
            // ------------------------------------------------

            if (type === "pdf") {

                const btn =
                    document.createElement(
                        "button"
                    );

                btn.className =
                    "course-btn";

                btn.textContent =
                    contentTitle;

                btn.addEventListener(
                    "click",
                    () => {

                        openPDFModal(
                            content.url,
                            contentTitle
                        );
                    }
                );

                buttonsContainer.appendChild(
                    btn
                );

                return;
            }


            // ------------------------------------------------
            // LIVE CLASS
            // ------------------------------------------------

            if (
                type === "live" ||
                type === "live-class"
            ) {

                const btn =
                    document.createElement(
                        "button"
                    );

                btn.className =
                    "course-btn";

                btn.textContent =
                    contentTitle;

                btn.addEventListener(
                    "click",
                    () => {

                        if (
                            content.url
                        ) {

                            window.open(
                                content.url,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }
                    }
                );

                buttonsContainer.appendChild(
                    btn
                );

                return;
            }

        }
    );


    // --------------------------------------------------------
    // TEST BUTTON
    // --------------------------------------------------------

    const testBtn =
        document.createElement(
            "button"
        );

    testBtn.className =
        "course-btn test-btn";

    testBtn.textContent =
        "Take Test";

    testBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                `test.html?course=${encodeURIComponent(course.id)}`;
        }
    );

    buttonsContainer.appendChild(
        testBtn
    );


    return card;
}


// ============================================================
// SHOW STUDENT COURSES
// ============================================================

async function showStudentCourses(student) {

    coursesContainer.innerHTML = "";

    const courseIds =
        Array.isArray(student.courses)
            ? student.courses
            : [];


    if (courseIds.length === 0) {

        coursesContainer.innerHTML = `

            <div class="no-courses">

                <h3>
                    No courses assigned
                </h3>

                <p>
                    Your courses will appear here
                    after they are assigned by the admin.
                </p>

            </div>

        `;

        return;
    }


    const courses =
        await loadStudentCourses(
            courseIds
        );


    if (courses.length === 0) {

        coursesContainer.innerHTML = `

            <div class="no-courses">

                <h3>
                    No courses available
                </h3>

                <p>
                    Please contact the academy administrator.
                </p>

            </div>

        `;

        return;
    }


    courses.forEach(
        course => {

            const card =
                createCourseCard(course);

            coursesContainer.appendChild(
                card
            );
        }
    );
}


// ============================================================
// MODAL
// ============================================================

function createModal() {

    let modal =
        document.getElementById(
            "fjmcContentModal"
        );

    if (modal) {
        return modal;
    }


    modal =
        document.createElement(
            "div"
        );

    modal.id =
        "fjmcContentModal";

    modal.innerHTML = `

        <div class="fjmc-modal-overlay">

            <div class="fjmc-modal">

                <button
                    class="fjmc-modal-close"
                    type="button"
                >
                    ×
                </button>

                <h2
                    class="fjmc-modal-title"
                ></h2>

                <div
                    class="fjmc-modal-body"
                ></div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const closeBtn =
        modal.querySelector(
            ".fjmc-modal-close"
        );


    const overlay =
        modal.querySelector(
            ".fjmc-modal-overlay"
        );


    closeBtn.addEventListener(
        "click",
        closeModal
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeModal();
            }
        }
    );


    return modal;
}


// ============================================================
// OPEN MODAL
// ============================================================

function openModal(
    title,
    content
) {

    const modal =
        createModal();


    modal.querySelector(
        ".fjmc-modal-title"
    ).textContent =
        title || "";


    const body =
        modal.querySelector(
            ".fjmc-modal-body"
        );


    body.innerHTML = "";

    body.appendChild(
        content
    );


    modal.style.display =
        "block";


    document.body.style.overflow =
        "hidden";
}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeModal() {

    const modal =
        document.getElementById(
            "fjmcContentModal"
        );

    if (!modal) {
        return;
    }


    const body =
        modal.querySelector(
            ".fjmc-modal-body"
        );


    body.innerHTML = "";

    modal.style.display =
        "none";


    document.body.style.overflow =
        "";
}


// ============================================================
// YOUTUBE MODAL
// ============================================================

function openYouTubeModal(
    url,
    title
) {

    if (!url) {
        return;
    }


    let videoId = "";


    try {

        const parsed =
            new URL(url);


        if (
            parsed.hostname.includes(
                "youtu.be"
            )
        ) {

            videoId =
                parsed.pathname.substring(1);

        } else {

            videoId =
                parsed.searchParams.get(
                    "v"
                ) || "";
        }

    } catch {

        videoId =
            url;
    }


    if (!videoId) {

        alert(
            "Invalid YouTube URL."
        );

        return;
    }


    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.src =
        `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;

    iframe.width =
        "100%";

    iframe.height =
        "500";

    iframe.frameBorder =
        "0";

    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    iframe.allowFullscreen =
        true;


    openModal(
        title,
        iframe
    );
}


// ============================================================
// LOCAL VIDEO MODAL
// ============================================================

function openVideoModal(
    url,
    title
) {

    if (!url) {
        return;
    }


    const video =
        document.createElement(
            "video"
        );


    video.src =
        url;

    video.controls =
        true;

    video.autoplay =
        true;

    video.controlsList =
        "nodownload";

    video.disablePictureInPicture =
        true;

    video.style.width =
        "100%";

    video.style.maxHeight =
        "75vh";


    openModal(
        title,
        video
    );
}


// ============================================================
// PDF MODAL
// ============================================================

async function openPDFModal(
    url,
    title
) {

    if (!url) {
        return;
    }


    const container =
        document.createElement(
            "div"
        );

    container.style.width =
        "100%";

    container.style.maxHeight =
        "75vh";

    container.style.overflow =
        "auto";


    openModal(
        title,
        container
    );


    try {

        if (
            typeof pdfjsLib ===
            "undefined"
        ) {

            throw new Error(
                "PDF.js not loaded."
            );
        }


        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


        const pdf =
            await pdfjsLib.getDocument(
                url
            ).promise;


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
                    scale: 1.5
                });


            const canvas =
                document.createElement(
                    "canvas"
                );


            const context =
                canvas.getContext(
                    "2d"
                );


            canvas.width =
                viewport.width;

            canvas.height =
                viewport.height;


            canvas.style.display =
                "block";

            canvas.style.width =
                "100%";

            canvas.style.height =
                "auto";

            canvas.style.marginBottom =
                "15px";


            container.appendChild(
                canvas
            );


            await page.render({
                canvasContext:
                    context,

                viewport:
                    viewport
            }).promise;


            // Watermark
            const watermark =
                document.createElement(
                    "div"
                );

            watermark.textContent =
                "FJMC ACADEMY";

            watermark.style.position =
                "absolute";

            watermark.style.opacity =
                "0.18";

            watermark.style.pointerEvents =
                "none";

            watermark.style.fontSize =
                "28px";

            watermark.style.fontWeight =
                "bold";


            // Keep watermark simple
            // without affecting PDF rendering.
        }

    } catch (error) {

        console.error(
            "PDF error:",
            error
        );


        container.innerHTML = `

            <p style="padding:20px;text-align:center;">
                PDF could not be loaded.
            </p>

        `;
    }
}


// ============================================================
// LOGOUT BUTTON
// ============================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await forceLogout();

        }
    );
}


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            user;


        try {

            // ------------------------------------------------
            // LOAD STUDENT PROFILE
            // ------------------------------------------------

            const student =
                await loadStudentProfile(
                    user
                );


            if (!student) {

                alert(
                    "Student profile not found. Please contact the admin."
                );

                await forceLogout();

                return;
            }


            currentStudent =
                student;


            // ------------------------------------------------
            // SAVE SESSION INFO
            // ------------------------------------------------

            sessionStorage.setItem(
                "fjmcStudentEmail",
                student.email
            );

            sessionStorage.setItem(
                "fjmcStudentUid",
                user.uid
            );


            // ------------------------------------------------
            // WELCOME
            // ------------------------------------------------

            if (studentNameEl) {

                studentNameEl.textContent =
                    `Welcome, ${student.name}`;
            }


            // ------------------------------------------------
            // DEVICE CHECK
            // ------------------------------------------------

            const allowed =
                await registerDevice(
                    user
                );


            if (!allowed) {

                await forceLogout();

                return;
            }


            // ------------------------------------------------
            // LOAD COURSES
            // ------------------------------------------------

            await showStudentCourses(
                student
            );


            // ------------------------------------------------
            // HEARTBEAT
            // ------------------------------------------------

            startHeartbeat();


        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );


            alert(
                "Dashboard load nahi ho saka. Please try again."
            );

            await forceLogout();
        }

    }
);


// ============================================================
// BASIC CONTENT PROTECTION
// ============================================================

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();
    }
);


document.addEventListener(
    "copy",
    event => {

        event.preventDefault();
    }
);


document.addEventListener(
    "cut",
    event => {

        event.preventDefault();
    }
);


document.addEventListener(
    "selectstart",
    event => {

        // Don't block selection inside inputs
        // if any are added later.

        const tag =
            event.target.tagName;

        if (
            tag !== "INPUT" &&
            tag !== "TEXTAREA"
        ) {

            event.preventDefault();
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            (event.ctrlKey ||
                event.metaKey) &&
            (
                key === "s" ||
                key === "p" ||
                key === "u"
            )
        ) {

            event.preventDefault();
        }

    }
);


// ============================================================
// CLEANUP
// ============================================================

window.addEventListener(
    "beforeunload",
    () => {

        stopHeartbeat();
    }
);
