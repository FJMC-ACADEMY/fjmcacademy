
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
   LIFE AT DIPS - FAST SLIDER
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const track =
        document.getElementById("lifeTrack");

    const windowBox =
        document.getElementById("lifeWindow");

    const cards =
        Array.from(
            document.querySelectorAll(".life-card")
        );

    const prev =
        document.getElementById("lifePrev");

    const next =
        document.getElementById("lifeNext");


    const galleryBtn =
        document.getElementById("lifeGalleryBtn");

    const modal =
        document.getElementById("lifeModal");

    const modalImage =
        document.getElementById("lifeModalImage");

    const modalClose =
        document.getElementById("lifeModalClose");

    const modalPrev =
        document.getElementById("lifeModalPrev");

    const modalNext =
        document.getElementById("lifeModalNext");

    const modalCount =
        document.getElementById("lifeModalCount");


    /* STOP IF HTML IS NOT PRESENT */

    if (
        !track ||
        !windowBox ||
        !cards.length
    ) {
        console.log("Life slider not found");
        return;
    }


    let current = 0;

    let timer = null;

    let galleryIndex = 0;

    let touchStart = 0;

    let touchEnd = 0;

    let lastTap = 0;


    /* =================================================
       VISIBLE PHOTOS
    ================================================= */

    function visiblePhotos() {

        return window.innerWidth <= 700
            ? 1
            : 4;

    }


    /* =================================================
       MAX POSITION
    ================================================= */

    function maxPosition() {

        return Math.max(
            0,
            cards.length - visiblePhotos()
        );

    }


    /* =================================================
       MOVE
    ================================================= */

    function moveSlider() {

        const max =
            maxPosition();


        if (current > max) {
            current = 0;
        }


        if (current < 0) {
            current = max;
        }


        const cardWidth =
            cards[0].getBoundingClientRect().width;


        const gap =
            window.innerWidth <= 700
                ? 0
                : 25;


        const move =
            current *
            (cardWidth + gap);


        track.style.transform =
            "translate3d(-" +
            move +
            "px,0,0)";
    }


    /* =================================================
       NEXT
    ================================================= */

    function nextPhoto() {

        current++;


        if (current > maxPosition()) {
            current = 0;
        }


        moveSlider();

    }


    /* =================================================
       PREVIOUS
    ================================================= */

    function previousPhoto() {

        current--;


        if (current < 0) {
            current = maxPosition();
        }


        moveSlider();

    }


    /* =================================================
       AUTO 5 SECONDS
    ================================================= */

    function startAuto() {

        clearInterval(timer);


        timer = setInterval(
            nextPhoto,
            5000
        );

    }


    function stopAuto() {

        clearInterval(timer);

        timer = null;

    }


    /* =================================================
       BUTTONS
    ================================================= */

    next.addEventListener(
        "click",
        function () {

            nextPhoto();

            startAuto();

        }
    );


    prev.addEventListener(
        "click",
        function () {

            previousPhoto();

            startAuto();

        }
    );


    /* =================================================
       PAUSE ON PHOTOS
    ================================================= */

    windowBox.addEventListener(
        "mouseenter",
        stopAuto
    );


    windowBox.addEventListener(
        "mouseleave",
        startAuto
    );


    /* =================================================
       GALLERY
    ================================================= */

    function openGallery(number) {

        if (number < 0) {
            number = cards.length - 1;
        }


        if (number >= cards.length) {
            number = 0;
        }


        galleryIndex = number;


        const image =
            cards[galleryIndex]
                .querySelector("img");


        if (!image) {
            return;
        }


        modalImage.src =
            image.src;


        modalImage.alt =
            image.alt;


        modalCount.textContent =
            (galleryIndex + 1) +
            " / " +
            cards.length;


        modal.classList.add("open");


        stopAuto();

    }


    /* =================================================
       GALLERY BUTTON
    ================================================= */

    galleryBtn.addEventListener(
        "click",
        function () {

            openGallery(0);

        }
    );


    /* =================================================
       GALLERY NEXT
    ================================================= */

    modalNext.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            openGallery(
                galleryIndex + 1
            );

        }
    );


    /* =================================================
       GALLERY PREVIOUS
    ================================================= */

    modalPrev.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            openGallery(
                galleryIndex - 1
            );

        }
    );


    /* =================================================
       CLOSE
    ================================================= */

    function closeGallery() {

        modal.classList.remove("open");

        startAuto();

    }


    modalClose.addEventListener(
        "click",
        closeGallery
    );


    /* =================================================
       DOUBLE CLICK DESKTOP
    ================================================= */

    cards.forEach(
        function (card, number) {

            const image =
                card.querySelector("img");


            image.addEventListener(
                "dblclick",
                function () {

                    openGallery(number);

                }
            );

        }
    );


    /* =================================================
       MOBILE DOUBLE TAP
    ================================================= */

    cards.forEach(
        function (card, number) {

            const image =
                card.querySelector("img");


            image.addEventListener(
                "touchend",
                function (event) {

                    const now =
                        Date.now();


                    if (
                        now - lastTap < 350
                    ) {

                        event.preventDefault();

                        openGallery(number);

                    }


                    lastTap = now;

                },
                {
                    passive: false
                }
            );

        }
    );


    /* =================================================
       MOBILE SWIPE
    ================================================= */

    windowBox.addEventListener(
        "touchstart",
        function (event) {

            touchStart =
                event.touches[0].clientX;

            stopAuto();

        },
        {
            passive: true
        }
    );


    windowBox.addEventListener(
        "touchend",
        function (event) {

            touchEnd =
                event.changedTouches[0].clientX;


            const distance =
                touchStart - touchEnd;


            if (Math.abs(distance) > 50) {

                if (distance > 0) {

                    nextPhoto();

                } else {

                    previousPhoto();

                }

            }


            startAuto();

        }
    );


    /* =================================================
       KEYBOARD
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !modal.classList.contains("open")
            ) {
                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                openGallery(
                    galleryIndex + 1
                );

            }


            if (
                event.key === "ArrowLeft"
            ) {

                openGallery(
                    galleryIndex - 1
                );

            }


            if (
                event.key === "Escape"
            ) {

                closeGallery();

            }

        }
    );


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        moveSlider
    );


    /* =================================================
       START
    ================================================= */

    moveSlider();

    startAuto();


    console.log(
        "Life at DIPS: READY"
    );

});
