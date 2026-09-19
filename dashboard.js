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


// ================= COURSE DATA =================

const COURSES = {

    "real-analysis": {
        title: "Real Analysis",
        description: "Complete Real Analysis Course",

        lessons: [

            {
                title: "Lecture 1 - Introduction",
                type: "video",
                url: "https://www.youtube.com/embed/hhjuLjGMxgw?rel=0"
            },

            {
                title: "Lecture 2 - Sequences",
                type: "video",
                url: "https://www.youtube.com/embed/rkKZIMPecRA"
            },

            {
                title: "Lecture 3 - Local Video",
                type: "mp4",
                url: "real-analysis-lecture-3.mp4"
            },

            {
                title: "Real Analysis Notes",
                type: "pdf",
                url: "/fjmcacademy/321581555.PDF"
            },

            {
                title: "Lecture 2",
                type: "pdf",
                url: "/fjmcacademy/ch03.pdf"
            },

            {
                title: "Live Class - Real Analysis",
                type: "live",
                url: "https://meet.google.com/YOUR-LIVE-CLASS-LINK"
            }
        ]
    },


    "linear-algebra": {
        title: "Linear Algebra",
        description: "Complete Linear Algebra Course",

        lessons: [

            {
                title: "Lecture 1",
                type: "video",
                url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
            },

            {
                title: "Linear Algebra Notes",
                type: "pdf",
                url: "pdf/linear-algebra-notes.pdf"
            },

            {
                title: "Live Class - Linear Algebra",
                type: "live",
                url: "https://meet.google.com/YOUR-LIVE-CLASS-LINK"
            }
        ]
    },


    "calculus": {
        title: "Calculus",
        description: "Complete Calculus Course",

        lessons: [

            {
                title: "Lecture 1",
                type: "video",
                url: "https://youtube.com/shorts/m7BFuuMqP4I?si=P3wroZUVHHmmuj-8"
            },

            {
                title: "Lecture 2 - Local Video",
                type: "mp4",
                url: "videos/calculus-lecture-2.mp4"
            },

            {
                title: "Calculus Notes",
                type: "pdf",
                url: "./ch03.pdf"
            },

            {
                title: "Calculus Notes",
                type: "pdf",
                url: "https://drive.google.com/file/d/1MZNN3vbH7e8x7vupmGMHevUhbx7FlDzq/view?usp=drive_link"
            },

            {
                title: "Live Class - Calculus",
                type: "live",
                url: "https://meet.google.com/YOUR-LIVE-CLASS-LINK"
            }
        ]
    }
};


// ================= CHECK LOGIN =================

const loggedInStudent =
    sessionStorage.getItem("loggedInStudent");

if (!loggedInStudent) {
    window.location.href = "login.html";
}

const student = STUDENTS[loggedInStudent];

if (!student) {

    sessionStorage.removeItem("loggedInStudent");

    window.location.href = "login.html";
}


// ================= STUDENT NAME =================

document.getElementById("studentName").textContent =
    "Welcome, " + student.name;


// ================= COURSE CONTAINER =================

const container =
    document.getElementById("coursesContainer");


// =====================================================
// BASIC PROTECTION
// =====================================================

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
});

document.addEventListener("copy", function(e) {
    e.preventDefault();
});

document.addEventListener("cut", function(e) {
    e.preventDefault();
});

document.addEventListener("selectstart", function(e) {
    e.preventDefault();
});


// Keyboard shortcuts
document.addEventListener("keydown", function(e) {

    if (
        e.ctrlKey &&
        (
            e.key.toLowerCase() === "s" ||
            e.key.toLowerCase() === "p" ||
            e.key.toLowerCase() === "u" ||
            e.key.toLowerCase() === "c"
        )
    ) {
        e.preventDefault();
    }

});


// =====================================================
// LOCAL VIDEO PREVIEW
// =====================================================

function previewLocalVideo(screen) {

    const video =
        screen.querySelector(".local-video");

    if (!video) return;

    video.muted = true;

    video.play().catch(function() {});
}


// =====================================================
// STOP PREVIEW
// =====================================================

function stopLocalPreview(screen) {

    const video =
        screen.querySelector(".local-video");

    if (!video) return;

    video.pause();

    video.currentTime = 0;
}


// =====================================================
// OPEN LOCAL VIDEO
// =====================================================

function openLocalVideo(screen) {

    const video =
        screen.querySelector(".local-video");

    if (!video) return;

    screen.classList.add("local-video-open");

    video.muted = false;

    video.controls = true;

    video.play().catch(function() {});
}


// =====================================================
// LOCAL MP4 VIDEO
// =====================================================

function createLocalVideo(videoURL, title) {

    return `
        <div class="local-video-player">

            <div
                class="local-video-screen"

                onmouseenter="previewLocalVideo(this)"

                onmouseleave="stopLocalPreview(this)"

                onclick="openLocalVideo(this)"
            >

                <video
                    class="local-video"

                    preload="metadata"

                    muted

                    playsinline

                    controls

                    controlsList="nodownload noplaybackrate"

                    disablePictureInPicture

                    oncontextmenu="return false;"
                >

                    <source
                        src="${videoURL}"
                        type="video/mp4"
                    >

                    Your browser does not support MP4 video.

                </video>

                <div class="local-video-play">
                    ▶
                </div>

            </div>

            <h4 class="local-video-title">
                🎥 ${title}
            </h4>

        </div>
    `;
}


// =====================================================
// LOAD PDF.JS
// =====================================================

let pdfJSLoaded = false;

function loadPDFJS() {

    return new Promise(function(resolve, reject) {

        if (pdfJSLoaded && window.pdfjsLib) {
            resolve();
            return;
        }

        if (window.pdfjsLib) {

            pdfJSLoaded = true;

            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            resolve();

            return;
        }


        const script =
            document.createElement("script");

        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

        script.onload = function() {

            pdfJSLoaded = true;

            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            resolve();

        };

        script.onerror = function() {

            reject(
                new Error("PDF viewer could not be loaded.")
            );

        };

        document.head.appendChild(script);

    });
}


// =====================================================
// PDF BUTTON
// =====================================================

function createProtectedPDF(pdfURL, title) {

    return `
        <div class="protected-pdf">

            <h4>
                📕 ${title}
            </h4>

            <button
                class="pdf-open-btn"
                onclick="openPDFViewer(
                    '${pdfURL}',
                    '${title.replace(/'/g, "\\'")}'
                )">

                📄 Open PDF

            </button>

        </div>
    `;
}


// =====================================================
// OPEN PDF VIEWER
// =====================================================

async function openPDFViewer(pdfURL, title) {

    const oldViewer =
        document.getElementById("pdfFullscreen");

    if (oldViewer) {
        oldViewer.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "pdfFullscreen";


    overlay.innerHTML = `

        <div class="pdf-header">

            <div class="pdf-title">
                📕 ${title}
            </div>

            <div class="pdf-controls">

                <button
                    onclick="togglePDFFullscreen()"
                    class="pdf-fullscreen-btn">

                    ⛶ Full Screen

                </button>

                <button
                    onclick="closePDFViewer()"
                    class="pdf-close-btn">

                    ✕ Close

                </button>

            </div>

        </div>


        <div
            id="pdfPages"
            class="pdf-pages">

            <div class="pdf-loading">
                Loading PDF...
            </div>

        </div>

    `;


    document.body.appendChild(overlay);


    try {

        await loadPDFJS();

        const loadingTask =
            window.pdfjsLib.getDocument({
                url: pdfURL,
                disableAutoFetch: false,
                disableStream: false
            });


        const pdf =
            await loadingTask.promise;


        const pagesContainer =
            document.getElementById("pdfPages");


        pagesContainer.innerHTML = "";


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

    }

    catch (error) {

        console.error(error);


        const pagesContainer =
            document.getElementById("pdfPages");


        if (pagesContainer) {

            pagesContainer.innerHTML = `

                <div class="pdf-error">

                    <h3>
                        PDF could not be opened
                    </h3>

                    <p>
                        Please check the PDF URL.
                    </p>

                </div>

            `;

        }

    }

}


// =====================================================
// RENDER ONE PDF PAGE
// =====================================================

async function renderPDFPage(
    pdf,
    pageNumber,
    container
) {

    const page =
        await pdf.getPage(pageNumber);


    const originalViewport =
        page.getViewport({
            scale: 1
        });


    const availableWidth =
        Math.min(
            window.innerWidth - 20,
            1000
        );


    const scale =
        availableWidth /
        originalViewport.width;


    const viewport =
        page.getViewport({
            scale: Math.max(scale, 0.5)
        });


    const pageBox =
        document.createElement("div");

    pageBox.className =
        "pdf-page";


    const canvas =
        document.createElement("canvas");


    const context =
        canvas.getContext("2d");


    canvas.width =
        viewport.width;


    canvas.height =
        viewport.height;


    canvas.style.width =
        viewport.width + "px";


    canvas.style.height =
        viewport.height + "px";


    canvas.setAttribute(
        "draggable",
        "false"
    );


    pageBox.appendChild(canvas);

    container.appendChild(pageBox);


    await page.render({

        canvasContext: context,

        viewport: viewport

    }).promise;

}


// =====================================================
// FULL SCREEN
// =====================================================

function togglePDFFullscreen() {

    const viewer =
        document.getElementById("pdfFullscreen");


    if (!viewer) return;


    if (!document.fullscreenElement) {

        if (viewer.requestFullscreen) {

            viewer.requestFullscreen()
                .catch(function() {});

        }

    }

    else {

        if (document.exitFullscreen) {

            document.exitFullscreen()
                .catch(function() {});

        }

    }

}


// =====================================================
// CLOSE PDF
// =====================================================

function closePDFViewer() {

    const viewer =
        document.getElementById("pdfFullscreen");


    if (document.fullscreenElement) {

        document.exitFullscreen()
            .catch(function() {});

    }


    if (viewer) {

        viewer.remove();

    }

}


// =====================================================
// ESCAPE / FULLSCREEN CHANGE
// =====================================================

document.addEventListener(
    "fullscreenchange",
    function() {

        const viewer =
            document.getElementById("pdfFullscreen");


        if (
            viewer &&
            !document.fullscreenElement
        ) {

            // Do not close viewer automatically.
            // User can continue reading.

        }

    }
);


// =====================================================
// SHOW ASSIGNED COURSES
// =====================================================

student.courses.forEach(function(courseId) {

    const course =
        COURSES[courseId];

    if (!course) return;


    const card =
        document.createElement("div");

    card.className =
        "course-card";


    let lessonsHTML = "";


    // ================= LESSONS =================

    course.lessons.forEach(function(lesson) {


        // =================================================
        // YOUTUBE VIDEO
        // =================================================

        if (lesson.type === "video") {

            lessonsHTML += `

                <div class="lesson">

                    <h4>
                        🎥 ${lesson.title}
                    </h4>

                    <div class="video-box">

                        <iframe

                            src="${lesson.url}"

                            title="${lesson.title}"

                            allow="
                                accelerometer;
                                autoplay;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture
                            "

                            allowfullscreen>

                        </iframe>

                    </div>

                </div>

            `;
        }


        // =================================================
        // LOCAL MP4 VIDEO
        // =================================================

        else if (lesson.type === "mp4") {

            lessonsHTML += `

                <div class="lesson">

                    ${createLocalVideo(
                        lesson.url,
                        lesson.title
                    )}

                </div>

            `;
        }


        // =================================================
        // PDF
        // =================================================

        else if (lesson.type === "pdf") {

            lessonsHTML += `

                <div class="lesson">

                    ${createProtectedPDF(
                        lesson.url,
                        lesson.title
                    )}

                </div>

            `;
        }


        // =================================================
        // LIVE CLASS
        // =================================================

        else if (lesson.type === "live") {

            lessonsHTML += `

                <div class="lesson">

                    <h4>
                        🔴 ${lesson.title}
                    </h4>

                    <a

                        href="${lesson.url}"

                        target="_blank"

                        rel="noopener noreferrer"

                        class="live-btn">

                        🔴 Join Live Class

                    </a>

                </div>

            `;
        }

    });


    // ================= COURSE CARD =================

    card.innerHTML = `

        <div class="course-content">

            <h3>
                ${course.title}
            </h3>

            <p>
                ${course.description}
            </p>

            ${lessonsHTML}

        </div>

    `;


    container.appendChild(card);

});


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "loggedInStudent"
            );

            window.location.href =
                "login.html";

        }
    );
