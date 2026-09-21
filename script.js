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
/* =====================================================
   LIFE AT DIPS - INDEPENDENT SLIDER
===================================================== */

(function () {

    function initLifeDips() {

        const section =
            document.querySelector(".life-dips-section");

        if (!section) {
            return;
        }

        const track =
            section.querySelector(".life-track");

        const slider =
            section.querySelector(".life-slider");

        const slides =
            section.querySelectorAll(".life-slide");

        const prev =
            section.querySelector(".life-prev");

        const next =
            section.querySelector(".life-next");

        const gallery =
            section.querySelector(".life-gallery-btn");

        const popup =
            document.getElementById("lifePhotoPopup");

        const popupImage =
            document.getElementById("lifePopupImage");

        const popupClose =
            document.getElementById("lifePopupClose");


        if (!track || !slider || !slides.length) {
            return;
        }


        let index = 0;

        let timer = null;


        function getVisible() {

            if (window.innerWidth <= 600) {
                return 1;
            }

            if (window.innerWidth <= 900) {
                return 2;
            }

            return 4;
        }


        function moveSlider() {

            const visible =
                getVisible();

            const max =
                Math.max(0, slides.length - visible);


            if (index > max) {
                index = 0;
            }


            const width =
                slides[0].getBoundingClientRect().width;


            const gap =
                window.innerWidth <= 600 ? 0 : 28;


            track.style.transform =
                "translateX(-" +
                (index * (width + gap)) +
                "px)";
        }


        function nextPhoto() {

            const visible =
                getVisible();

            const max =
                Math.max(0, slides.length - visible);


            index++;


            if (index > max) {
                index = 0;
            }


            moveSlider();
        }


        function previousPhoto() {

            const visible =
                getVisible();

            const max =
                Math.max(0, slides.length - visible);


            index--;


            if (index < 0) {
                index = max;
            }


            moveSlider();
        }


        /* NEXT */

        if (next) {

            next.addEventListener("click", function(e) {

                e.preventDefault();

                nextPhoto();

                restartAuto();

            });

        }


        /* PREVIOUS */

        if (prev) {

            prev.addEventListener("click", function(e) {

                e.preventDefault();

                previousPhoto();

                restartAuto();

            });

        }


        /* AUTO 5 SECOND */

        function startAuto() {

            clearInterval(timer);

            timer = setInterval(function() {

                nextPhoto();

            }, 5000);

        }


        function stopAuto() {

            clearInterval(timer);

        }


        function restartAuto() {

            stopAuto();

            startAuto();

        }


        /* MOUSE PAUSE */

        slider.addEventListener("mouseenter", function() {

            stopAuto();

        });


        slider.addEventListener("mouseleave", function() {

            startAuto();

        });


        /* OPEN IMAGE */

        function openPhoto(image) {

            if (!popup || !popupImage) {
                return;
            }


            popupImage.src =
                image.src;

            popup.classList.add("active");

            stopAuto();

        }


        /* DOUBLE CLICK */

        slides.forEach(function(slide) {

            const image =
                slide.querySelector("img");

            if (!image) {
                return;
            }


            image.addEventListener(
                "dblclick",
                function(e) {

                    e.preventDefault();

                    openPhoto(image);

                }
            );


            /* MOBILE DOUBLE TAP */

            let lastTap = 0;


            image.addEventListener(
                "touchend",
                function(e) {

                    const now =
                        Date.now();

                    const difference =
                        now - lastTap;


                    if (
                        difference > 0 &&
                        difference < 350
                    ) {

                        e.preventDefault();

                        openPhoto(image);

                    }


                    lastTap = now;

                },
                { passive: false }
            );

        });


        /* GALLERY */

        if (gallery) {

            gallery.addEventListener(
                "click",
                function(e) {

                    e.preventDefault();

                    const image =
                        slides[index].querySelector("img");

                    if (image) {

                        openPhoto(image);

                    }

                }
            );

        }


        /* CLOSE */

        if (popupClose) {

            popupClose.addEventListener(
                "click",
                function() {

                    popup.classList.remove("active");

                    popupImage.src = "";

                    startAuto();

                }
            );

        }


        /* OUTSIDE CLICK */

        if (popup) {

            popup.addEventListener(
                "click",
                function(e) {

                    if (e.target === popup) {

                        popup.classList.remove("active");

                        popupImage.src = "";

                        startAuto();

                    }

                }
            );

        }


        /* ESC */

        document.addEventListener(
            "keydown",
            function(e) {

                if (
                    e.key === "Escape" &&
                    popup.classList.contains("active")
                ) {

                    popup.classList.remove("active");

                    popupImage.src = "";

                    startAuto();

                }

            }
        );


        window.addEventListener(
            "resize",
            moveSlider
        );


        /* START */

        moveSlider();

        startAuto();

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initLifeDips
        );

    } else {

        initLifeDips();

    }

})();
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
