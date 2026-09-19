/* =========================================================
   FJMC ACADEMY - STUDENT DASHBOARD
   ========================================================= */


/* =========================================================
   STUDENT DATA
   ========================================================= */

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
   CHECK LOGIN
   ========================================================= */

const loggedInEmail = sessionStorage.getItem("loggedInStudent");

const coursesContainer = document.getElementById("coursesContainer");
const studentName = document.getElementById("studentName");
const logoutBtn = document.getElementById("logoutBtn");


if (!loggedInEmail || !STUDENTS[loggedInEmail]) {

    window.location.href = "login.html";

} else {

    const student = STUDENTS[loggedInEmail];

    studentName.textContent = "Welcome, " + student.name;

    showStudentCourses(student);

}


/* =========================================================
   SHOW STUDENT COURSES
   ========================================================= */

function showStudentCourses(student) {

    coursesContainer.innerHTML = "";

    if (!student.courses || student.courses.length === 0) {

        coursesContainer.innerHTML = `
            <div class="no-course">
                <h3>No Course Assigned</h3>
                <p>Please contact FJMC Academy.</p>
            </div>
        `;

        return;
    }


    student.courses.forEach(courseId => {

        const course = COURSES[courseId];

        if (!course) return;


        const courseCard = document.createElement("div");

        courseCard.className = "course-card";


        let contentHTML = "";


        course.contents.forEach((content, index) => {

            /* ================= VIDEO ================= */

            if (content.type === "video") {

                contentHTML += `
                    <button
                        class="content-button video-button"
                        onclick="openYouTubeVideo('${escapeAttribute(content.url)}', '${escapeAttribute(content.title)}')">
                        ▶ ${content.title}
                    </button>
                `;
            }


            /* ================= LOCAL VIDEO ================= */

            else if (content.type === "local-video") {

                contentHTML += `
                    <button
                        class="content-button video-button"
                        onclick="openLocalVideo('${escapeAttribute(content.url)}', '${escapeAttribute(content.title)}')">
                        ▶ ${content.title}
                    </button>
                `;
            }


            /* ================= PDF ================= */

            else if (content.type === "pdf") {

                contentHTML += `
                    <button
                        class="content-button pdf-button"
                        onclick="openPDFViewer('${escapeAttribute(content.url)}', '${escapeAttribute(content.title)}')">
                        📄 ${content.title}
                    </button>
                `;
            }


            /* ================= LIVE CLASS ================= */

            else if (content.type === "live") {

                contentHTML += `
                    <button
                        class="content-button live-button"
                        onclick="openLiveClass('${escapeAttribute(content.url)}')">
                        🔴 ${content.title}
                    </button>
                `;
            }

        });


        courseCard.innerHTML = `

            <div class="course-title">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
            </div>

            <div class="course-content">
                ${contentHTML}
            </div>

        `;


        coursesContainer.appendChild(courseCard);

    });

}


/* =========================================================
   SAFE ATTRIBUTE TEXT
   ========================================================= */

function escapeAttribute(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

}


/* =========================================================
   YOUTUBE VIDEO
   ========================================================= */

function openYouTubeVideo(url, title) {

    const overlay = document.createElement("div");

    overlay.className = "video-overlay";


    overlay.innerHTML = `

        <div class="video-window">

            <div class="video-header">

                <span>${title}</span>

                <button class="close-video"
                        onclick="this.closest('.video-overlay').remove(); document.body.classList.remove('viewer-open');">
                    ✕
                </button>

            </div>


            <div class="video-player-container">

                <iframe
                    src="${url}"
                    title="${title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowfullscreen>
                </iframe>

            </div>

        </div>

    `;


    document.body.appendChild(overlay);

    document.body.classList.add("viewer-open");

}


/* =========================================================
   LOCAL VIDEO
   ========================================================= */

function openLocalVideo(url, title) {

    const overlay = document.createElement("div");

    overlay.className = "video-overlay";


    overlay.innerHTML = `

        <div class="video-window">

            <div class="video-header">

                <span>${title}</span>

                <button class="close-video"
                        onclick="this.closest('.video-overlay').remove(); document.body.classList.remove('viewer-open');">
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

                    <source src="${url}" type="video/mp4">

                    Your browser does not support video.

                </video>

            </div>

        </div>

    `;


    document.body.appendChild(overlay);

    document.body.classList.add("viewer-open");

}


/* =========================================================
   LIVE CLASS
   ========================================================= */

function openLiveClass(url) {

    if (!url || url === "#") {

        alert("Live class link will be available here.");

        return;
    }

    window.open(url, "_blank");

}


/* =========================================================
   PDF.js WORKER
   ========================================================= */

if (typeof pdfjsLib !== "undefined") {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}


/* =========================================================
   PROTECTED PDF VIEWER
   ========================================================= */

async function openPDFViewer(pdfURL, title) {

    if (typeof pdfjsLib === "undefined") {

        alert("PDF viewer could not load. Please refresh the page.");

        return;
    }


    /* Create overlay */

    const overlay = document.createElement("div");

    overlay.id = "pdfFullscreen";


    overlay.innerHTML = `

        <div class="pdf-header">

            <div class="pdf-title">
                ${title}
            </div>

            <button id="closePDF">
                ✕ Close
            </button>

        </div>

        <div class="pdf-watermark">
    <span>FJMC Academy</span>
    <span>${loggedInEmail}</span>
</div>

        <div id="pdfScrollArea" class="pdf-scroll-area">

            <div id="pdfLoading" class="pdf-loading">
                Loading PDF...
            </div>

            <div id="pdfPages" class="pdf-pages"></div>

        </div>

    `;


    document.body.appendChild(overlay);

    document.body.classList.add("viewer-open");


    /* Close PDF */

    document.getElementById("closePDF").addEventListener("click", closePDFViewer);


    try {

        const loadingTask = pdfjsLib.getDocument({
            url: pdfURL
        });


        const pdf = await loadingTask.promise;


        const pagesContainer = document.getElementById("pdfPages");

        const loadingMessage = document.getElementById("pdfLoading");

        if (loadingMessage) {
            loadingMessage.remove();
        }


        /* Render every page */

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

            await renderPDFPage(
                pdf,
                pageNumber,
                pagesContainer
            );

        }

    } catch (error) {

        console.error("PDF Error:", error);


        const loadingMessage = document.getElementById("pdfLoading");

        if (loadingMessage) {

            loadingMessage.innerHTML = `
                <div class="pdf-error">
                    <h3>PDF could not be opened</h3>
                    <p>Please check the PDF file path.</p>
                </div>
            `;

        }

    }

}


/* =========================================================
   RENDER ONE PDF PAGE
   ========================================================= */

async function renderPDFPage(pdf, pageNumber, container) {

    const page = await pdf.getPage(pageNumber);


    const wrapper = document.createElement("div");

    wrapper.className = "pdf-page-wrapper";


    const canvas = document.createElement("canvas");

    canvas.className = "pdf-page";


    wrapper.appendChild(canvas);

    container.appendChild(wrapper);


    const viewportOriginal = page.getViewport({
        scale: 1
    });


    const availableWidth =
        Math.min(
            window.innerWidth - 20,
            1000
        );


    let scale =
        availableWidth / viewportOriginal.width;


    /* Good quality on mobile/laptop */

    const devicePixelRatio =
        Math.min(window.devicePixelRatio || 1, 2);


    const viewport = page.getViewport({
        scale: scale
    });


    canvas.width =
        Math.floor(viewport.width * devicePixelRatio);

    canvas.height =
        Math.floor(viewport.height * devicePixelRatio);


    canvas.style.width =
        Math.floor(viewport.width) + "px";

    canvas.style.height =
        Math.floor(viewport.height) + "px";


    const context = canvas.getContext("2d");


    const renderContext = {

        canvasContext: context,

        viewport: viewport,

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


    await page.render(renderContext).promise;

}


/* =========================================================
   CLOSE PDF
   ========================================================= */

function closePDFViewer() {

    const pdfViewer =
        document.getElementById("pdfFullscreen");


    if (pdfViewer) {

        pdfViewer.remove();

    }


    document.body.classList.remove("viewer-open");

}


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem("loggedInStudent");

        window.location.href = "login.html";

    });

}


/* =========================================================
   BASIC PROTECTION
   ========================================================= */

document.addEventListener("contextmenu", function (event) {

    event.preventDefault();

});


document.addEventListener("copy", function (event) {

    event.preventDefault();

});


document.addEventListener("cut", function (event) {

    event.preventDefault();

});


document.addEventListener("selectstart", function (event) {

    event.preventDefault();

});


document.addEventListener("keydown", function (event) {

    /* Ctrl + S */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "s"
    ) {

        event.preventDefault();

    }


    /* Ctrl + P */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "p"
    ) {

        event.preventDefault();

    }


    /* Ctrl + U */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "u"
    ) {

        event.preventDefault();

    }


    /* Ctrl + C */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "c"
    ) {

        event.preventDefault();

    }

});
