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

    if (e.key === "PrintScreen") {
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
// PROTECTED PDF VIEWER - PDF.JS
// WEBSITE ONLY / NO NATIVE PDF VIEWER
// =====================================================

let pdfViewerLoaded = false;
let pdfjsLibGlobal = null;


// =====================================================
// LOAD PDF.JS
// =====================================================

async function loadPDFJS() {

    if (pdfViewerLoaded && pdfjsLibGlobal) {
        return pdfjsLibGlobal;
    }

    if (!window.pdfjsLib) {

        await new Promise(function(resolve, reject) {

            const script = document.createElement("script");

            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

            script.type = "module";

            script.onload = resolve;

            script.onerror = reject;

            document.head.appendChild(script);

        });

    }

    pdfjsLibGlobal = window.pdfjsLib;

    if (!pdfjsLibGlobal) {

        throw new Error(
            "PDF viewer could not be loaded."
        );

    }

    pdfjsLibGlobal.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

    pdfViewerLoaded = true;

    return pdfjsLibGlobal;
}


// =====================================================
// PDF BUTTON
// =====================================================

function createProtectedPDF(pdfURL, title) {

    const safeURL =
        encodeURIComponent(pdfURL);

    const safeTitle =
        encodeURIComponent(title);

    return `

        <div class="protected-pdf">

            <h4>
                📕 ${title}
            </h4>

            <button
                class="pdf-open-btn"
                onclick="openPDFViewer(
                    decodeURIComponent('${safeURL}'),
                    decodeURIComponent('${safeTitle}')
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

    // Remove old viewer
    const oldViewer =
        document.getElementById("pdfFullscreen");

    if (oldViewer) {
        oldViewer.remove();
    }


    // Prevent body scrolling
    document.body.classList.add("pdf-viewer-open");


    // Create viewer
    const overlay =
        document.createElement("div");

    overlay.id =
        "pdfFullscreen";


    overlay.innerHTML = `

        <div class="pdf-header">

            <span class="pdf-title">
                📕 ${title}
            </span>

            <button
                class="pdf-close-btn"
                id="pdfCloseButton">

                ✕ Close

            </button>

        </div>


        <div
            class="pdf-scroll-area"
            id="pdfScrollArea"
        >

            <div
                class="pdf-loading"
                id="pdfLoading"
            >

                Loading PDF...

            </div>

            <div
                class="pdf-pages"
                id="pdfPages"
            ></div>

        </div>

    `;


    document.body.appendChild(overlay);


    // Close button
    document
        .getElementById("pdfCloseButton")
        .addEventListener(
            "click",
            closePDFViewer
        );


    // Disable right click inside PDF
    overlay.addEventListener(
        "contextmenu",
        function(e) {
            e.preventDefault();
        }
    );


    // Disable copy
    overlay.addEventListener(
        "copy",
        function(e) {
            e.preventDefault();
        }
    );


    // Disable text selection
    overlay.addEventListener(
        "selectstart",
        function(e) {
            e.preventDefault();
        }
    );


    try {

        const pdfjsLib =
            await loadPDFJS();


        const loadingTask =
            pdfjsLib.getDocument({
                url: pdfURL
            });


        const pdf =
            await loadingTask.promise;


        const pagesContainer =
            document.getElementById("pdfPages");

        const loading =
            document.getElementById("pdfLoading");


        if (loading) {
            loading.remove();
        }


        // Render every page
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
            "PDF ERROR:",
            error
        );


        const loading =
            document.getElementById("pdfLoading");


        if (loading) {

            loading.innerHTML = `

                <div class="pdf-error">

                    ❌ PDF could not be opened.

                    <br><br>

                    Please check the PDF URL.

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


    const pageWrapper =
        document.createElement("div");

    pageWrapper.className =
        "pdf-page-wrapper";


    const canvas =
        document.createElement("canvas");

    canvas.className =
        "pdf-page";


    const context =
        canvas.getContext("2d");


    // Get available width
    const scrollArea =
        document.getElementById(
            "pdfScrollArea"
        );


    const availableWidth =
        Math.min(
            scrollArea.clientWidth - 24,
            1000
        );


    const originalViewport =
        page.getViewport({
            scale: 1
        });


    const scale =
        availableWidth /
        originalViewport.width;


    const viewport =
        page.getViewport({
            scale: scale
        });


    // High quality on mobile
    const deviceScale =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.floor(
            viewport.width *
            deviceScale
        );


    canvas.height =
        Math.floor(
            viewport.height *
            deviceScale
        );


    canvas.style.width =
        viewport.width + "px";


    canvas.style.height =
        viewport.height + "px";


    context.setTransform(
        deviceScale,
        0,
        0,
        deviceScale,
        0,
        0
    );


    pageWrapper.appendChild(
        canvas
    );


    container.appendChild(
        pageWrapper
    );


    await page.render({

        canvasContext: context,

        viewport: viewport

    }).promise;

}


// =====================================================
// CLOSE PDF
// =====================================================

function closePDFViewer() {

    const viewer =
        document.getElementById(
            "pdfFullscreen"
        );


    if (viewer) {

        viewer.remove();

    }


    document.body.classList.remove(
        "pdf-viewer-open"
    );

}


// =====================================================
// ESCAPE KEY
// =====================================================

document.addEventListener(
    "keydown",
    function(e) {

        const viewer =
            document.getElementById(
                "pdfFullscreen"
            );


        if (
            e.key === "Escape" &&
            viewer
        ) {

            closePDFViewer();

        }


        // Block printing
        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "p"
        ) {

            e.preventDefault();

        }


        // Block save
        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "s"
        ) {

            e.preventDefault();

        }

    }
);


// =====================================================
// PRINT BLOCK
// =====================================================

window.addEventListener(
    "beforeprint",
    function(e) {

        e.preventDefault();

    }
);



// ================= SHOW COURSES =================

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
        // LOCAL MP4
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
    .addEventListener("click", function() {

        sessionStorage.removeItem(
            "loggedInStudent"
        );

        window.location.href =
            "login.html";

    });
