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

    const track =
        document.getElementById("lifeTrack");

    const slider =
        document.getElementById("lifeSlider");

    const slides =
        document.querySelectorAll(".life-slide");

    const nextBtn =
        document.getElementById("lifeNextBtn");

    const prevBtn =
        document.getElementById("lifePrevBtn");


    /* POPUP */

    const popup =
        document.getElementById("lifePhotoPopup");

    const popupImage =
        document.getElementById("lifePopupImage");

    const popupClose =
        document.getElementById("lifePopupClose");


    let currentIndex = 0;

    let visibleSlides = 4;

    let autoSlide;


    /* =================================================
       VISIBLE SLIDES
    ================================================= */

    function setVisibleSlides() {

        if (window.innerWidth <= 600) {

            visibleSlides = 1;

        } else if (window.innerWidth <= 900) {

            visibleSlides = 2;

        } else {

            visibleSlides = 4;
        }


        const maximumIndex =
            Math.max(0, slides.length - visibleSlides);


        if (currentIndex > maximumIndex) {

            currentIndex = 0;
        }


        moveSlider();
    }


    /* =================================================
       MOVE SLIDER
    ================================================= */

    function moveSlider() {

        if (!slides.length) {
            return;
        }


        const slideWidth =
            slides[0].getBoundingClientRect().width;


        let gap = 28;


        if (window.innerWidth <= 600) {

            gap = 0;
        }


        const distance =
            currentIndex * (slideWidth + gap);


        track.style.transform =
            "translateX(-" + distance + "px)";
    }


    /* =================================================
       NEXT
    ================================================= */

    function nextSlide() {

        const maximumIndex =
            Math.max(0, slides.length - visibleSlides);


        currentIndex++;


        if (currentIndex > maximumIndex) {

            currentIndex = 0;
        }


        moveSlider();
    }


    /* =================================================
       PREVIOUS
    ================================================= */

    function previousSlide() {

        const maximumIndex =
            Math.max(0, slides.length - visibleSlides);


        currentIndex--;


        if (currentIndex < 0) {

            currentIndex = maximumIndex;
        }


        moveSlider();
    }


    /* =================================================
       BUTTONS
    ================================================= */

    nextBtn.addEventListener("click", function () {

        nextSlide();

        restartAutoSlide();

    });


    prevBtn.addEventListener("click", function () {

        previousSlide();

        restartAutoSlide();

    });


    /* =================================================
       AUTO SLIDE — 5 SECONDS
    ================================================= */

    function startAutoSlide() {

        clearInterval(autoSlide);


        autoSlide = setInterval(function () {

            nextSlide();

        }, 5000);
    }


    function restartAutoSlide() {

        clearInterval(autoSlide);

        startAutoSlide();
    }


    /* =================================================
       MOUSE HOVER = PAUSE
    ================================================= */

    slider.addEventListener("mouseenter", function () {

        clearInterval(autoSlide);

    });


    slider.addEventListener("mouseleave", function () {

        startAutoSlide();

    });


    /* =================================================
       DOUBLE CLICK = OPEN FULL PHOTO
    ================================================= */

    slides.forEach(function (slide) {

        const image =
            slide.querySelector("img");


        image.addEventListener("dblclick", function (event) {

            event.preventDefault();


            popupImage.src =
                image.src;


            popup.classList.add("active");


            clearInterval(autoSlide);

        });

    });


    /* =================================================
       MOBILE DOUBLE TAP
    ================================================= */

    slides.forEach(function (slide) {

        const image =
            slide.querySelector("img");


        let lastTap = 0;


        image.addEventListener("touchend", function (event) {

            const now =
                Date.now();


            const difference =
                now - lastTap;


            if (difference > 0 && difference < 350) {

                event.preventDefault();


                popupImage.src =
                    image.src;


                popup.classList.add("active");


                clearInterval(autoSlide);
            }


            lastTap = now;

        });

    });


    /* =================================================
       CLOSE POPUP
    ================================================= */

    popupClose.addEventListener("click", function () {

        popup.classList.remove("active");

        popupImage.src = "";

        startAutoSlide();

    });


    /* =================================================
       CLICK OUTSIDE PHOTO = CLOSE
    ================================================= */

    popup.addEventListener("click", function (event) {

        if (event.target === popup) {

            popup.classList.remove("active");

            popupImage.src = "";

            startAutoSlide();
        }

    });


    /* =================================================
       ESC KEY
    ================================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            popup.classList.remove("active");

            popupImage.src = "";

            startAutoSlide();
        }

    });


    /* =================================================
       GALLERY BUTTON
    ================================================= */

    document
        .getElementById("lifeGalleryBtn")
        .addEventListener("click", function () {

            const image =
                slides[currentIndex].querySelector("img");


            popupImage.src =
                image.src;


            popup.classList.add("active");


            clearInterval(autoSlide);

        });


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener("resize", function () {

        setVisibleSlides();

    });


    /* =================================================
       START
    ================================================= */

    setVisibleSlides();

    startAutoSlide();

});
