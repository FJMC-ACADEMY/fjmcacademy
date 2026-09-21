// ================= MOBILE MENU =================

function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("active");

}


// ================= ENQUIRY FORM =================

document
    .getElementById("enquiryForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value;

        const phone =
            document.getElementById("phone").value;

        const course =
            document.getElementById("course").value;

        const message =
            document.getElementById("message").value;


        if (!name || !phone || !course) {

            alert("Please fill all required fields.");

            return;

        }


        alert(
            "Thank you " +
            name +
            "! Your enquiry has been received."
        );


        document
            .getElementById("enquiryForm")
            .reset();

});


    document.getElementById("resultDescription").textContent =
        student.description;
}


/* Change student every 5 seconds */

setInterval(function () {

    currentStudent++;

    if (currentStudent >= students.length) {
        currentStudent = 0;
    }

    showStudent();

}, 5000);



/* ================= TOP RANKER DATA ================= */

const rankerData = {

    "net-june-25": [

        {
            image: "1.jpg",
            name: "Madhumita Raj",
            rank: "Rank-34"
        },

        {
            image: "2.jpg",
            name: "Poornima",
            rank: "Rank-38"
        },

        {
            image: "3.jpg",
            name: "Nimesh Bhatt",
            rank: "Rank-46"
        },

        {
            image: "4.jpg",
            name: "Ritik Agarwal",
            rank: "Rank-47"
        },

        {
            image: "t5.jpg",
            name: "Nisha Yadav",
            rank: "Rank-66"
        }

    ],


    "net-dec-24": [

        {
            image: "1.jpg",
            name: "Student 1",
            rank: "Rank-12"
        },

        {
            image: "2.jpg",
            name: "Student 2",
            rank: "Rank-25"
        }

    ],


    "jam-25": [

        {
            image: "1.jpg",
            name: "Student 1",
            rank: "Rank-10"
        },

        {
            image: "top-rankers/jam-25/2.jpg",
            name: "Student 2",
            rank: "Rank-20"
        }

    ],


    "gate-25": [

        {
            image: "top-rankers/gate-25/1.jpg",
            name: "Student 1",
            rank: "Rank-15"
        },

        {
            image: "top-rankers/gate-25/2.jpg",
            name: "Student 2",
            rank: "Rank-30"
        }

    ],


    "net-june-24": [

        {
            image: "top-rankers/net-june-24/1.jpg",
            name: "Student 1",
            rank: "Rank-20"
        }

    ],


    "jam-24": [

        {
            image: "top-rankers/jam-24/1.jpg",
            name: "Student 1",
            rank: "Rank-18"
        }

    ],


    "gate-24": [

        {
            image: "top-rankers/gate-24/1.jpg",
            name: "Student 1",
            rank: "Rank-22"
        }

    ]

};


/* ================= SLIDER ================= */

let currentRankers = [];
let rankerIndex = 0;

const rankerTrack =
    document.getElementById("rankerTrack");


function showRankers(category, button) {

    currentRankers = rankerData[category] || [];

    rankerIndex = 0;

    rankerTrack.innerHTML = "";


    /* ACTIVE TAB */

    document
        .querySelectorAll(".ranker-tab")
        .forEach(tab => {
            tab.classList.remove("active");
        });

    button.classList.add("active");


    /* CREATE CARDS */

    currentRankers.forEach(student => {

        const card = document.createElement("div");

        card.className = "ranker-card";

        card.innerHTML = `

            <img src="${student.image}"
                 alt="${student.name}">

            <div class="ranker-info">

                ${student.name}<br>

                ${student.rank}

            </div>

        `;

        rankerTrack.appendChild(card);

    });

    updateRankerSlider();
}


function updateRankerSlider() {

    const card =
        rankerTrack.querySelector(".ranker-card");

    if (!card) return;

    const cardWidth =
        card.getBoundingClientRect().width + 35;

    rankerTrack.style.transform =
        `translateX(-${rankerIndex * cardWidth}px)`;
}


function rankerNext() {

    if (currentRankers.length === 0)
        return;

    const visible =
        window.innerWidth <= 600 ? 2 : 5;

    rankerIndex++;

    if (rankerIndex >
        currentRankers.length - visible) {

        rankerIndex = 0;
    }

    updateRankerSlider();
}


function rankerPrev() {

    if (currentRankers.length === 0)
        return;

    const visible =
        window.innerWidth <= 600 ? 2 : 5;

    rankerIndex--;

    if (rankerIndex < 0) {

        rankerIndex =
            Math.max(0,
            currentRankers.length - visible);
    }

    updateRankerSlider();
}


/* FIRST TAB */

const firstTab =
    document.querySelector(".ranker-tab");

showRankers("net-june-25", firstTab);


/* AUTO SLIDE */

let rankerAutoSlide =
    setInterval(rankerNext, 4000);


/* PAUSE WHEN MOUSE IS ON SLIDER */

const rankerArea =
    document.querySelector(".ranker-slider-area");

rankerArea.addEventListener("mouseenter", () => {

    clearInterval(rankerAutoSlide);

});

rankerArea.addEventListener("mouseleave", () => {

    rankerAutoSlide =
        setInterval(rankerNext, 4000);

});


window.addEventListener("resize",
    updateRankerSlider);

</script>
/* =====================================================
   LIFE AT DIPS SLIDER
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const lifeTrack = document.getElementById("lifeTrack");
    const lifeSlider = document.getElementById("lifeSlider");

    const lifeSlides =
        document.querySelectorAll(".life-slide");

    const lifePrevBtn =
        document.getElementById("lifePrevBtn");

    const lifeNextBtn =
        document.getElementById("lifeNextBtn");

    const lifeModal =
        document.getElementById("lifeImageModal");

    const lifeModalImage =
        document.getElementById("lifeModalImage");

    const lifeModalClose =
        document.getElementById("lifeModalClose");


    let lifeIndex = 0;

    let lifeVisible = 4;

    let lifeAutoSlide = null;

    let isMouseOverPhoto = false;


    /* =================================================
       FIND NUMBER OF VISIBLE PHOTOS
    ================================================= */

    function updateLifeVisible() {

        if (window.innerWidth <= 600) {

            lifeVisible = 1;

        } else if (window.innerWidth <= 900) {

            lifeVisible = 2;

        } else {

            lifeVisible = 4;
        }


        const maxIndex =
            Math.max(0, lifeSlides.length - lifeVisible);

        if (lifeIndex > maxIndex) {
            lifeIndex = 0;
        }

        updateLifeSlider();
    }


    /* =================================================
       UPDATE SLIDER POSITION
    ================================================= */

    function updateLifeSlider() {

        if (!lifeSlides.length) {
            return;
        }


        const slideWidth =
            lifeSlides[0].getBoundingClientRect().width;


        const gap =
            window.innerWidth <= 600 ? 0 : 28;


        const move =
            lifeIndex * (slideWidth + gap);


        lifeTrack.style.transform =
            "translateX(-" + move + "px)";
    }


    /* =================================================
       NEXT
    ================================================= */

    function lifeNext() {

        const maxIndex =
            Math.max(0, lifeSlides.length - lifeVisible);


        lifeIndex++;


        if (lifeIndex > maxIndex) {
            lifeIndex = 0;
        }


        updateLifeSlider();
    }


    /* =================================================
       PREVIOUS
    ================================================= */

    function lifePrev() {

        const maxIndex =
            Math.max(0, lifeSlides.length - lifeVisible);


        lifeIndex--;


        if (lifeIndex < 0) {
            lifeIndex = maxIndex;
        }


        updateLifeSlider();
    }


    /* =================================================
       BUTTON EVENTS
    ================================================= */

    lifeNextBtn.addEventListener("click", function (event) {

        event.preventDefault();

        lifeNext();

        restartAutoSlide();
    });


    lifePrevBtn.addEventListener("click", function (event) {

        event.preventDefault();

        lifePrev();

        restartAutoSlide();
    });


    /* =================================================
       AUTO SLIDE
       EVERY 5 SECONDS
    ================================================= */

    function startAutoSlide() {

        clearInterval(lifeAutoSlide);


        lifeAutoSlide = setInterval(function () {

            if (!isMouseOverPhoto) {
                lifeNext();
            }

        }, 5000);
    }


    function stopAutoSlide() {

        clearInterval(lifeAutoSlide);

        lifeAutoSlide = null;
    }


    function restartAutoSlide() {

        stopAutoSlide();

        startAutoSlide();
    }


    /* =================================================
       DESKTOP:
       MOUSE OVER PHOTO = PAUSE
    ================================================= */

    lifeSlider.addEventListener("mouseenter", function () {

        isMouseOverPhoto = true;

    });


    lifeSlider.addEventListener("mouseleave", function () {

        isMouseOverPhoto = false;

    });


    /* =================================================
       MOBILE TOUCH:
       TOUCH DOES NOT STOP AUTO SLIDE PERMANENTLY
    ================================================= */

    lifeSlider.addEventListener("touchstart", function () {

        isMouseOverPhoto = true;

    }, { passive: true });


    lifeSlider.addEventListener("touchend", function () {

        /*
           Mobile par finger hataane ke baad
           slider phir automatically chalega.
        */

        isMouseOverPhoto = false;

    }, { passive: true });


    /* =================================================
       DOUBLE CLICK IMAGE = OPEN LARGE
    ================================================= */

    lifeSlides.forEach(function (slide) {

        const image = slide.querySelector("img");


        image.addEventListener("dblclick", function (event) {

            event.preventDefault();

            lifeModalImage.src = image.src;

            lifeModal.classList.add("active");

        });


        /* MOBILE DOUBLE TAP */

        let lastTap = 0;


        image.addEventListener("touchend", function (event) {

            const currentTime =
                new Date().getTime();


            const tapLength =
                currentTime - lastTap;


            if (tapLength < 350 && tapLength > 0) {

                event.preventDefault();

                lifeModalImage.src = image.src;

                lifeModal.classList.add("active");
            }


            lastTap = currentTime;

        });

    });


    /* =================================================
       CLOSE IMAGE POPUP
    ================================================= */

    lifeModalClose.addEventListener("click", function () {

        lifeModal.classList.remove("active");

        lifeModalImage.src = "";

    });


    /* Click outside image = close */

    lifeModal.addEventListener("click", function (event) {

        if (event.target === lifeModal) {

            lifeModal.classList.remove("active");

            lifeModalImage.src = "";
        }

    });


    /* =================================================
       ESC KEY = CLOSE
    ================================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            lifeModal.classList.remove("active");

            lifeModalImage.src = "";
        }

    });


    /* =================================================
       GALLERY BUTTON
    ================================================= */

    const lifeGalleryBtn =
        document.getElementById("lifeGalleryBtn");


    lifeGalleryBtn.addEventListener("click", function () {

        /*
           Abhi button slider ko hi gallery ki tarah use karega.
           Baad mein separate gallery page bhi connect
           kiya ja sakta hai.
        */

        lifeSlides[lifeIndex]
            .querySelector("img")
            .dispatchEvent(
                new MouseEvent("dblclick", {
                    bubbles: true
                })
            );

    });


    /* =================================================
       WINDOW RESIZE
    ================================================= */

    window.addEventListener("resize", function () {

        updateLifeVisible();

    });


    /* =================================================
       INITIALIZE
    ================================================= */

    updateLifeVisible();

    startAutoSlide();

});
