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
<script>

let lifeIndex = 0;

const lifeTrack = document.getElementById("lifeTrack");
const lifeSlides = document.querySelectorAll(".life-slide");

let lifeVisible = 4;

function updateLifeVisible() {

    if (window.innerWidth <= 600) {
        lifeVisible = 1;
    }
    else if (window.innerWidth <= 900) {
        lifeVisible = 2;
    }
    else {
        lifeVisible = 4;
    }

    if (lifeIndex > lifeSlides.length - lifeVisible) {
        lifeIndex = 0;
    }

    updateLifeSlider();
}

function updateLifeSlider() {

    const slideWidth =
        lifeSlides[0].getBoundingClientRect().width + 28;

    lifeTrack.style.transform =
        `translateX(-${lifeIndex * slideWidth}px)`;
}

function lifeNext() {

    lifeIndex++;

    if (lifeIndex > lifeSlides.length - lifeVisible) {
        lifeIndex = 0;
    }

    updateLifeSlider();
}

function lifePrev() {

    lifeIndex--;

    if (lifeIndex < 0) {
        lifeIndex = lifeSlides.length - lifeVisible;
    }

    updateLifeSlider();
}


/* AUTO SLIDE */

let lifeAutoSlide = setInterval(lifeNext, 4000);


/* PAUSE ON MOUSE */

const lifeSliderArea =
    document.querySelector(".life-slider-wrapper");

lifeSliderArea.addEventListener("mouseenter", () => {
    clearInterval(lifeAutoSlide);
});

lifeSliderArea.addEventListener("mouseleave", () => {
    lifeAutoSlide = setInterval(lifeNext, 4000);
});


window.addEventListener("resize", updateLifeVisible);

updateLifeVisible();

</script>
<script>

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
