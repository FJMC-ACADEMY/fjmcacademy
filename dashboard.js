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


// =====================================================
// COURSE DATA
// =====================================================

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
                url: "321581555.PDF"
            },

            {
                title: "Lecture 2",
                type: "pdf",
                url: "ch03.pdf"
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


// =====================================================
// CHECK LOGIN
// =====================================================

const loggedInStudent =
    sessionStorage.getItem("loggedInStudent");

if (!loggedInStudent) {
    window.location.href = "login.html";
}

const student =
    STUDENTS[loggedInStudent];

if (!student) {

    sessionStorage.removeItem(
        "loggedInStudent"
    );

    window.location.href =
        "login.html";
}


// =====================================================
// STUDENT NAME
// =====================================================

document.getElementById("studentName").textContent =
    "Welcome, " + student.name;


// =====================================================
// COURSE CONTAINER
// =====================================================

const container =
    document.getElementById("coursesContainer");


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


// Keyboard shortcuts

document.addEventListener(
    "keydown",
    function(e) {

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
// LOCAL MP4 VIDEO
// =====================================================

function createLocalVideo(
    videoURL,
    title
) {

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

    return new Promise(
        function(resolve, reject) {

            if (
                pdfJSLoaded &&
                window.pdfjsLib
            ) {

                resolve();

                return;
            }


            if (window.pdfjsLib) {

                pdfJSLoaded = true;

                window.pdfjsLib
                    .GlobalWorkerOptions
                    .workerSrc =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

                resolve();

                return;
            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";


            script.onload =
                function() {

                    pdfJSLoaded = true;

                    window.pdfjsLib
                        .GlobalWorkerOptions
                        .workerSrc =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

                    resolve();

                };


            script.onerror =
                function() {

                    reject(
                        new Error(
                            "PDF.js could not be loaded."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );
}


// =====================================================
// PDF BUTTON
// =====================================================

function createProtectedPDF(
    pdfURL,
    title
) {

    const safeURL =
        pdfURL.replace(
            /'/g,
            "\\'"
        );


    const safeTitle =
        title.replace(
            /'/g,
            "\\'"
        );


    return `
        <div class="protected-pdf">

            <h4>
                📕 ${title}
            </h4>

            <button
                class="pdf-open-btn"

                onclick="openPDFViewer(
                    '${safeURL}',
                    '${safeTitle}'
                )"
            >

                📄 Open PDF

            </button>

        </div>
    `;
}


// =====================================================
// OPEN PDF VIEWER
// =====================================================

async function openPDFViewer(
    pdfURL,
    title
) {

    const oldViewer =
        document.getElementById(
            "pdfFullscreen"
        );


    if (oldViewer) {
        oldViewer.remove();
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
                📕 ${title}
            </div>

            <div class="pdf-controls">

                <button
                    class="pdf-fullscreen-btn"
                    onclick="togglePDFFullscreen()"
                >

                    ⛶ Full Screen

                </button>

                <button
                    class="pdf-close-btn"
                    onclick="closePDFViewer()"
                >

                    ✕ Close

                </button>

            </div>

        </div>


        <div
            id="pdfPages"
            class="pdf-pages"
        >

            <div class="pdf-loading">
                Loading PDF...
            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


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
            document.getElementById(
                "pdfPages"
            );


        if (!pagesContainer) {
            return;
        }


        pagesContainer.innerHTML =
            "";


        // ==========================================
        // RENDER ALL PAGES
        // ==========================================

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


        // ==========================================
        // MAKE SURE SCROLL IS ENABLED
        // ==========================================

        pagesContainer.style.overflowY =
            "scroll";

        pagesContainer.style.overflowX =
            "auto";

    }


    catch (error) {

        console.error(
            "PDF ERROR:",
            error
        );


        const pagesContainer =
            document.getElementById(
                "pdfPages"
            );


        if (pagesContainer) {

            pagesContainer.innerHTML = `

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


// =====================================================
// RENDER EVERY PDF PAGE
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


    const originalViewport =
        page.getViewport({
            scale: 1
        });


    // Width available for PDF

    const containerWidth =
        container.clientWidth;


    const availableWidth =
        Math.max(
            containerWidth - 24,
            280
        );


    // Calculate scale

    let scale =
        availableWidth /
        originalViewport.width;


    // Maximum scale

    scale =
        Math.min(
            scale,
            2
        );


    const viewport =
        page.getViewport({
            scale: scale
        });


    // ==========================================
    // PAGE CONTAINER
    // ==========================================

    const pageBox =
        document.createElement(
            "div"
        );


    pageBox.className =
        "pdf-page";


    pageBox.style.width =
        viewport.width + "px";


    pageBox.style.height =
        viewport.height + "px";


    pageBox.style.flex =
        "0 0 auto";


    // ==========================================
    // CANVAS
    // ==========================================

    const canvas =
        document.createElement(
            "canvas"
        );


    const context =
        canvas.getContext(
            "2d"
        );


    const pixelRatio =
        Math.max(
            window.devicePixelRatio || 1,
            1
        );


    canvas.width =
        Math.floor(
            viewport.width *
            pixelRatio
        );


    canvas.height =
        Math.floor(
            viewport.height *
            pixelRatio
        );


    canvas.style.width =
        viewport.width + "px";


    canvas.style.height =
        viewport.height + "px";


    canvas.style.display =
        "block";


    canvas.style.maxWidth =
        "none";


    canvas.style.pointerEvents =
        "none";


    canvas.setAttribute(
        "draggable",
        "false"
    );


    pageBox.appendChild(
        canvas
    );


    container.appendChild(
        pageBox
    );


    // ==========================================
    // RENDER PAGE
    // ==========================================

    await page.render({

        canvasContext:
            context,

        viewport:
            viewport,

        transform:
            pixelRatio !== 1
                ? [
                    pixelRatio,
                    0,
                    0,
                    pixelRatio,
                    0,
                    0
                ]
                : null

    }).promise;

}


// =====================================================
// PDF FULL SCREEN
// =====================================================

function togglePDFFullscreen() {

    const viewer =
        document.getElementById(
            "pdfFullscreen"
        );


    if (!viewer) return;


    if (!document.fullscreenElement) {

        if (
            viewer.requestFullscreen
        ) {

            viewer.requestFullscreen()
                .catch(
                    function() {}
                );

        }

    }

    else {

        if (
            document.exitFullscreen
        ) {

            document.exitFullscreen()
                .catch(
                    function() {}
                );

        }

    }

}


// =====================================================
// CLOSE PDF
// =====================================================

function closePDFViewer() {

    const viewer =
        document.getElementById(
            "pdfFullscreen"
        );


    if (
        document.fullscreenElement
    ) {

        document.exitFullscreen()
            .catch(
                function() {}
            );

    }


    if (viewer) {

        viewer.remove();

    }

}


// =====================================================
// SHOW ASSIGNED COURSES
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


        let lessonsHTML =
            "";


        course.lessons.forEach(
            function(lesson) {


                // ======================================
                // YOUTUBE
                // ======================================

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


                // ======================================
                // LOCAL MP4
                // ======================================

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


                // ======================================
                // PDF
                // ======================================

                else if (
                    lesson.type ===
                    "pdf"
                ) {

                    lessonsHTML += `

                        <div class="lesson">

                            ${createProtectedPDF(
                                less
