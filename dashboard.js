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
                url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
            },

            // LOCAL MP4
            {
                title: "Lecture 3 - Local Video",
                type: "mp4",
                url: "videos/real-analysis-lecture-3.mp4"
            },

            // PDF
            {
                title: "Real Analysis Notes",
                type: "pdf",
                url: "pdf/Real/real-analysis-notes.pdf"
            },

            {
                title: "Lecture 2",
                type: "pdf",
                url: "pdf/Real/321581555.pdf"
            },

            // LIVE
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
                url: "https://www.youtube.com/embed/YOUR_VIDEO_ID"
            },

            {
                title: "Lecture 2 - Local Video",
                type: "mp4",
                url: "videos/calculus-lecture-2.mp4"
            },

            {
                title: "Calculus Notes",
                type: "pdf",
                url: "pdf/calculus-notes.pdf"
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
// LOCAL VIDEO PREVIEW
// =====================================================

function previewLocalVideo(screen) {

    const video =
        screen.querySelector(".local-video");

    if (!video) return;

    video.muted = true;

    video.play().catch(function () {});

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

    video.play().catch(function () {});

}


// =====================================================
// LOCAL VIDEO HTML
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

                    controlsList="nodownload"

                    oncontextmenu="return false;"
                >

                    <source
                        src="${videoURL}"
                        type="video/mp4"
                    >

                    Your browser does not support
                    MP4 video playback.

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


// ================= SHOW ASSIGNED COURSES =================

student.courses.forEach(function(courseId) {

    const course = COURSES[courseId];

    if (!course) return;


    const card = document.createElement("div");

    card.className = "course-card";


    let lessonsHTML = "";


    // ================= LESSONS =================

    course.lessons.forEach(function(lesson) {


        // =================================================
        // YOUTUBE VIDEO
        // =================================================

        if (lesson.type === "video") {

            lessonsHTML += `
                <div class="lesson">

                    <h4>🎥 ${lesson.title}</h4>

                    <div class="video-box">

                        <iframe
                            src="${lesson.url}"

                            title="${lesson.title}"

                            allow="accelerometer;
                            autoplay;
                            clipboard-write;
                            encrypted-media;
                            gyroscope;
                            picture-in-picture"

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

                    <h4>📕 ${lesson.title}</h4>

                    <a
                        href="${lesson.url}"

                        target="_blank"

                        rel="noopener noreferrer"

                        class="pdf-btn">

                        📄 Open PDF

                    </a>

                </div>
            `;
        }


        // =================================================
        // LIVE CLASS
        // =================================================

        else if (lesson.type === "live") {

            lessonsHTML += `
                <div class="lesson">

                    <h4>🔴 ${lesson.title}</h4>

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

            <h3>${course.title}</h3>

            <p>${course.description}</p>

            ${lessonsHTML}

        </div>
    `;


    container.appendChild(card);

});


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function() {

        sessionStorage.removeItem("loggedInStudent");

        window.location.href = "login.html";

    });