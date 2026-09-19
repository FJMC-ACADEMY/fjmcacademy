// =====================================================
// FJMC ACADEMY - STUDENT DASHBOARD
// =====================================================


// =====================================================
// STUDENTS
// =====================================================

const STUDENTS = {

    "rahul@gmail.com": {

        password: "Rahul@123",

        name: "Rahul",

        courses: [
            "real-analysis"
        ]

    },


    "amit@gmail.com": {

        password: "Amit@456",

        name: "Amit",

        courses: [
            "linear-algebra",
            "calculus"
        ]

    },


    "neha@gmail.com": {

        password: "Neha@789",

        name: "Neha",

        courses: [
            "real-analysis",
            "calculus"
        ]

    }

};


// =====================================================
// COURSE DATA
// =====================================================

const COURSES = {


    "real-analysis": {

        title: "Real Analysis",

        description:
            "Complete Real Analysis Course",

        lessons: [

            {
                title: "Lecture 1 - Introduction",

                type: "video",

                url:
                    "https://www.youtube.com/embed/hhjuLjGMxgw?rel=0"
            },


            {
                title: "Lecture 2 - Sequences",

                type: "video",

                url:
                    "https://www.youtube.com/embed/rkKZIMPecRA"
            },


            {
                title: "Lecture 3 - Local Video",

                type: "mp4",

                url:
                    "real-analysis-lecture-3.mp4"
            },


            // IMPORTANT:
            // These PDFs must exist in the same folder
            // as dashboard.html.

            {
                title: "Real Analysis Notes",

                type: "pdf",

                url:
                    "./321581555.PDF"
            },


            {
                title: "Lecture 2",

                type: "pdf",

                url:
                    "./ch03.pdf"
            },


            {
                title: "Live Class - Real Analysis",

                type: "live",

                url:
                    "https://meet.google.com/YOUR-LIVE-CLASS-LINK"
            }

        ]

    },


    // =================================================
    // LINEAR ALGEBRA
    // =================================================

    "linear-algebra": {

        title: "Linear Algebra",

        description:
            "Complete Linear Algebra Course",

        lessons: [

            {
                title: "Lecture 1",

                type: "video",

                url:
                    "https://www.youtube.com/embed/YOUR_VIDEO_ID"
            },


            {
                title: "Linear Algebra Notes",

                type: "pdf",

                url:
                    "./pdf/linear-algebra-notes.pdf"
            },


            {
                title: "Live Class - Linear Algebra",

                type: "live",

                url:
                    "https://meet.google.com/YOUR-LIVE-CLASS-LINK"
            }

        ]

    },


    // =================================================
    // CALCULUS
    // =================================================

    "calculus": {

        title: "Calculus",

        description:
            "Complete Calculus Course",

        lessons: [

            {
                title: "Lecture 1",

                type: "video",

                url:
                    "https://youtube.com/embed/m7BFuuMqP4I"
            },


            {
                title: "Lecture 2 - Local Video",

                type: "mp4",

                url:
                    "videos/calculus-lecture-2.mp4"
            },


            {
                title: "Calculus Notes",

                type: "pdf",

                url:
                    "./ch03.pdf"
            },


            // Google Drive /view URL removed.
            // PDF.js needs a direct PDF file URL.

            {
                title: "Live Class - Calculus",

                type: "live",

                url:
                    "https://meet.google.com/YOUR-LIVE-CLASS-LINK"
            }

        ]

    }

};


// =====================================================
// CHECK LOGIN
// =====================================================

const loggedInStudent =
    sessionStorage.getItem("loggedInStudent");


if (!loggedInStudent) {

    window.location.href =
        "login.html";

    throw new Error("Not logged in.");

}


const student =
    STUDENTS[loggedInStudent];


if (!student) {

    sessionStorage.removeItem(
        "loggedInStudent"
    );

    window.location.href =
        "login.html";

    throw new Error("Invalid student.");

}


// =====================================================
// STUDENT NAME
// =====================================================

document
    .getElementById("studentName")
    .textContent =
        "Welcome, " + student.name;


// =====================================================
// COURSE CONTAINER
// =====================================================

const container =
    document.getElementById(
        "coursesContainer"
    );


// =====================================================
// BASIC PROTECTION
// =====================================================

document.addEventListener(
    "contextmenu",
    function(e) {

        e.preventDefault();

    }
);


document.addEventListener(
    "copy",
    function(e) {

        e.preventDefault();

    }
);


document.addEventListener(
    "cut",
    function(e) {

        e.preventDefault();

    }
);


document.addEventListener(
    "selectstart",
    function(e) {

        e.preventDefault();

    }
);


// =====================================================
// KEYBOARD PROTECTION
// =====================================================

document.addEventListener(
    "keydown",
    function(e) {

        const key =
            e.key.toLowerCase();


        if (
            e.ctrlKey &&
            (
                key === "s" ||
                key === "p" ||
                key === "u" ||
                key === "c"
            )
        ) {

            e.preventDefault();

        }


        if (
            e.ctrlKey &&
            e.shiftKey &&
            key === "i"
        ) {

            e.preventDefault();

        }


        if (e.key === "PrintScreen") {

            e.preventDefault();

        }

    }
);


// =====================================================
// LOCAL VIDEO PREVIEW
// =====================================================

function previewLocalVideo(screen) {

    const video =
        screen.querySelector(
            ".local-video"
        );


    if (!video) return;


    video.muted = true;

    video.play().catch(
        function() {}
    );

}


// =====================================================
// STOP LOCAL VIDEO PREVIEW
// =====================================================

function stopLocalPreview(screen) {

    const video =
        screen.querySelector(
            ".local-video"
        );


    if (!video) return;


    video.pause();

    video.currentTime = 0;

}


// =====================================================
// OPEN LOCAL VIDEO
// =====================================================

function openLocalVideo(screen) {

    const video =
        screen.querySelector(
            ".local-video"
        );


    if (!video) return;


    screen.classList.add(
        "local-video-open"
    );


    video.muted = false;

    video.controls = true;

    video.play().catch(
        function() {}
    );

}


// =====================================================
// LOCAL MP4
// =====================================================

function createLocalVideo(
    videoURL,
    title
) {

    return `

        <div class="local-video-player">

            <div
                class="local-video-screen"

                onmouseenter="
                    previewLocalVideo(this)
                "

                onmouseleave="
                    stopLocalPreview(this)
                "

                onclick="
                    openLocalVideo(this)
                "
            >

                <video
                    class="local-video"

                    preload="metadata"

                    muted

                    playsinline

                    controls

                    controlsList="
                        nodownload
                        noplaybackrate
                    "

                    disablePictureInPicture

                    oncontextmenu="
                        return false;
                    "
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


            <h4 class="video-title">
                🎥 ${title}
            </h4>

        </div>

    `;

}


// =====================================================
// PDF BUTTON
// =====================================================

function createProtectedPDF(
    pdfURL,
    title
) {

    const encodedURL =
        encodeURIComponent(pdfURL);


    const encodedTitle =
        encodeURIComponent(title);


    return `

        <div class="protected-pdf">

            <h4>
                📕 ${title}
            </h4>


            <button
                type="button"

                class="pdf-open-btn"

                data-pdf-url="${encodedURL}"

                data-pdf-title="${encodedTitle}"
            >

                📄 Open PDF

            </button>

        </div>

    `;

}


// =====================================================
// PDF BUTTON EVENT
// =====================================================

document.addEventListener(
    "click",
    function(e) {

        const button =
            e.target.closest(
                ".pdf-open-btn"
            );


        if (!button) return;


        const pdfURL =
            decodeURIComponent(
                button.dataset.pdfUrl
            );


        const title =
            decodeURIComponent(
                button.dataset.pdfTitle
            );


        openPDFViewer(
            pdfURL,
            title
        );

    }
);


// =====================================================
// OPEN PDF VIEWER
// =====================================================

async function openPDFViewer(
    pdfURL,
    title
) {

    // Remove previous viewer

    const oldViewer =
        document.getElementById(
            "pdfFullscreen"
        );


    if (oldViewer) {

        oldViewer.remove();

    }


    // Prevent background scrolling

    document.body.classList.add(
        "pdf-viewer-open"
    );


    // Create viewer

    const viewer =
        document.createElement(
            "div"
        );


    viewer.id =
        "pdfFullscreen";


    viewer.innerHTML = `

        <div class="pdf-header">

            <span class="pdf-title">
                📕 ${title}
            </span>


            <button
                type="button"

                class="pdf-close-btn"

                id="pdfCloseButton"
            >

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


    document.body.appendChild(
        viewer
    );


    // Close

    document
        .getElementById(
            "pdfCloseButton"
        )
        .addEventListener(
            "click",
            closePDFViewer
        );


    // Block context menu

    viewer.addEventListener(
        "contextmenu",
        function(e) {

            e.preventDefault();

        }
    );


    // Block copy

    viewer.addEventListener(
        "copy",
        function(e) {

            e.preventDefault();

        }
    );


    // Block selection

    viewer.addEventListener(
        "selectstart",
        function(e) {

            e.preventDefault();

        }
    );


    try {

        // Check PDF.js

        if (
            typeof pdfjsLib ===
            "undefined"
        ) {

            throw new Error(
                "PDF.js did not load."
            );

        }


        // Set worker

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


        // Load PDF

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


        const loading =
            document.getElementById(
                "pdfLoading"
            );


        if (loading) {

            loading.remove();

        }


        // Render pages one by one

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
            document.getElementById(
                "pdfLoading"
            );


        if (loading) {

            loading.innerHTML = `

                <div class="pdf-error">

                    ❌ PDF could not be opened.

                    <br><br>

                    Check that the PDF file exists
                    at the specified path.

                </div>

            `;

        }

    }

}


// =====================================================
// RENDER PDF PAGE
// =====================================================

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


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.className =
        "pdf-page";


    const context =
        canvas.getContext(
            "2d"
        );


    const scrollArea =
        document.getElementById(
            "pdfScrollArea"
        );


    // Available width

    const availableWidth =
        Math.max(
            scrollArea.clientWidth - 20,
            280
        );


    const baseViewport =
        page.getViewport({
            scale: 1
        });


    const scale =
        availableWidth /
        baseViewport.width;


    const viewport =
        page.getViewport({
            scale: scale
        });


    // Retina/mobile quality

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


    wrapper.appendChild(
        canvas
    );


    container.appendChild(
        wrapper
    );


    await page.render({

        canvasContext:
            context,

        viewport:
            viewport

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
// ESC CLOSE
// =====================================================

document.addEventListener(
    "keydown",
    function(e) {

        if (e.key !== "Escape") {
            return;
        }


        const viewer =
            document.getElementById(
                "pdfFullscreen"
            );


        if (viewer) {

            closePDFViewer();

        }

    }
);


// =====================================================
// SHOW COURSES
// =====================================================

student.courses.forEach(
    function(courseId) {

        const course =
            COURSES[courseId];


        if (!course) return;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "course-card";


        let lessonsHTML = "";


        // =================================================
        // LESSONS
        // =================================================

        course.lessons.forEach(
            function(lesson) {


                // ================================
                // YOUTUBE
                // ================================

                if (
                    lesson.type ===
                    "video"
                ) {

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


                // ================================
                // MP4
                // ================================

                else if (
                    lesson.type ===
                    "mp4"
                ) {

                    lessonsHTML += `

                        <div class="lesson">

                            ${createLocalVideo(
                                lesson.url,
                                lesson.title
                            )}

                        </div>

                    `;

                }


                // ================================
                // PDF
                // ================================

                else if (
                    lesson.type ===
                    "pdf"
                ) {

                    lessonsHTML += `

                        <div class="lesson">

                            ${createProtectedPDF(
                                lesson.url,
                                less
