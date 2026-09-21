
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
   LIFE AT DIPS - COMPLETE SLIDER + GALLERY
===================================================== */

(function () {

    document.addEventListener("DOMContentLoaded", function () {

        const section =
            document.querySelector(".life-dips-section");

        if (!section) {
            return;
        }


        const slider =
            document.getElementById("lifeSlider");

        const track =
            document.getElementById("lifeTrack");

        const slides =
            Array.from(
                section.querySelectorAll(".life-slide")
            );


        const prevBtn =
            document.getElementById("lifePrevBtn");

        const nextBtn =
            document.getElementById("lifeNextBtn");


        const galleryBtn =
            document.getElementById("lifeGalleryBtn");


        const popup =
            document.getElementById("lifeGalleryPopup");

        const popupImage =
            document.getElementById("lifePopupImage");

        const popupClose =
            document.getElementById("lifePopupClose");

        const popupPrev =
            document.getElementById("lifePopupPrev");

        const popupNext =
            document.getElementById("lifePopupNext");

        const popupCounter =
            document.getElementById("lifePopupCounter");


        if (
            !slider ||
            !track ||
            slides.length === 0
        ) {
            console.log("Life slider elements missing");
            return;
        }


        /* =================================================
           VARIABLES
        ================================================= */

        let currentIndex = 0;

        let galleryIndex = 0;

        let autoTimer = null;

        let touchStartX = 0;

        let touchEndX = 0;

        let lastTap = 0;


        /* =================================================
           HOW MANY PHOTOS ARE VISIBLE
        ================================================= */

        function getVisiblePhotos() {

            if (window.innerWidth <= 700) {
                return 1;
            }

            return 4;
        }


        /* =================================================
           MOVE SLIDER
        ================================================= */

        function updateSlider() {

            const visible =
                getVisiblePhotos();


            const maxIndex =
                Math.max(
                    0,
                    slides.length - visible
                );


            if (currentIndex > maxIndex) {
                currentIndex = 0;
            }


            if (currentIndex < 0) {
                currentIndex = maxIndex;
            }


            const slide =
                slides[0];


            const slideWidth =
                slide.getBoundingClientRect().width;


            let gap = 25;


            if (window.innerWidth <= 700) {
                gap = 0;
            }


            const moveAmount =
                currentIndex *
                (slideWidth + gap);


            track.style.transform =
                "translate3d(-" +
                moveAmount +
                "px, 0, 0)";
        }


        /* =================================================
           NEXT
        ================================================= */

        function nextPhoto() {

            const visible =
                getVisiblePhotos();


            const maxIndex =
                Math.max(
                    0,
                    slides.length - visible
                );


            currentIndex++;


            if (currentIndex > maxIndex) {
                currentIndex = 0;
            }


            updateSlider();
        }


        /* =================================================
           PREVIOUS
        ================================================= */

        function previousPhoto() {

            const visible =
                getVisiblePhotos();


            const maxIndex =
                Math.max(
                    0,
                    slides.length - visible
                );


            currentIndex--;


            if (currentIndex < 0) {
                currentIndex = maxIndex;
            }


            updateSlider();
        }


        /* =================================================
           AUTO SLIDE
           EVERY 5 SECONDS
        ================================================= */

        function startAutoSlide() {

            stopAutoSlide();


            autoTimer =
                setInterval(
                    function () {

                        nextPhoto();

                    },
                    5000
                );
        }


        function stopAutoSlide() {

            if (autoTimer !== null) {

                clearInterval(autoTimer);

                autoTimer = null;
            }
        }


        /* =================================================
           NEXT / PREVIOUS BUTTONS
        ================================================= */

        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                function () {

                    nextPhoto();

                    startAutoSlide();

                }
            );
        }


        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                function () {

                    previousPhoto();

                    startAutoSlide();

                }
            );
        }


        /* =================================================
           PAUSE WHEN CURSOR IS ON PHOTOS
        ================================================= */

        slider.addEventListener(
            "mouseenter",
            function () {

                stopAutoSlide();

            }
        );


        slider.addEventListener(
            "mouseleave",
            function () {

                startAutoSlide();

            }
        );


        /* =================================================
           OPEN LARGE GALLERY
        ================================================= */

        function openGallery(index) {

            if (!popup || !popupImage) {
                return;
            }


            if (index < 0) {
                index = slides.length - 1;
            }


            if (index >= slides.length) {
                index = 0;
            }


            galleryIndex = index;


            const image =
                slides[galleryIndex]
                    .querySelector("img");


            if (!image) {
                return;
            }


            popupImage.src =
                image.src;


            popupImage.alt =
                image.alt;


            if (popupCounter) {

                popupCounter.textContent =
                    (galleryIndex + 1) +
                    " / " +
                    slides.length;

            }


            popup.classList.add("active");


            stopAutoSlide();
        }


        /* =================================================
           CLOSE GALLERY
        ================================================= */

        function closeGallery() {

            if (!popup) {
                return;
            }


            popup.classList.remove("active");


            if (popupImage) {
                popupImage.src = "";
            }


            startAutoSlide();
        }


        /* =================================================
           GALLERY NEXT
        ================================================= */

        function galleryNext() {

            galleryIndex++;


            if (galleryIndex >= slides.length) {
                galleryIndex = 0;
            }


            openGallery(galleryIndex);
        }


        /* =================================================
           GALLERY PREVIOUS
        ================================================= */

        function galleryPrevious() {

            galleryIndex--;


            if (galleryIndex < 0) {
                galleryIndex =
                    slides.length - 1;
            }


            openGallery(galleryIndex);
        }


        /* =================================================
           VIEW OUR PICTURE GALLERY
        ================================================= */

        if (galleryBtn) {

            galleryBtn.addEventListener(
                "click",
                function () {

                    openGallery(0);

                }
            );
        }


        /* =================================================
           POPUP BUTTONS
        ================================================= */

        if (popupNext) {

            popupNext.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    galleryNext();

                }
            );
        }


        if (popupPrev) {

            popupPrev.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    galleryPrevious();

                }
            );
        }


        if (popupClose) {

            popupClose.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    closeGallery();

                }
            );
        }


        /* =================================================
           CLICK DARK AREA TO CLOSE
        ================================================= */

        if (popup) {

            popup.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === popup
                    ) {

                        closeGallery();

                    }

                }
            );
        }


        /* =================================================
           DOUBLE CLICK DESKTOP
        ================================================= */

        slides.forEach(
            function (slide, index) {

                const image =
                    slide.querySelector("img");


                if (!image) {
                    return;
                }


                image.addEventListener(
                    "dblclick",
                    function (event) {

                        event.preventDefault();

                        openGallery(index);

                    }
                );


                /* =========================================
                   DOUBLE TAP MOBILE
                ========================================= */

                image.addEventListener(
                    "touchend",
                    function (event) {

                        const now =
                            Date.now();


                        const timeSinceLastTap =
                            now - lastTap;


                        if (
                            timeSinceLastTap > 0 &&
                            timeSinceLastTap < 350
                        ) {

                            event.preventDefault();

                            openGallery(index);

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

        slider.addEventListener(
            "touchstart",
            function (event) {

                if (
                    event.touches &&
                    event.touches.length > 0
                ) {

                    touchStartX =
                        event.touches[0].clientX;

                }

                stopAutoSlide();

            },
            {
                passive: true
            }
        );


        slider.addEventListener(
            "touchmove",
            function (event) {

                if (
                    event.touches &&
                    event.touches.length > 0
                ) {

                    touchEndX =
                        event.touches[0].clientX;

                }

            },
            {
                passive: true
            }
        );


        slider.addEventListener(
            "touchend",
            function () {

                const distance =
                    touchStartX -
                    touchEndX;


                if (Math.abs(distance) > 50) {

                    if (distance > 0) {

                        nextPhoto();

                    } else {

                        previousPhoto();

                    }

                }


                touchStartX = 0;

                touchEndX = 0;


                startAutoSlide();

            }
        );


        /* =================================================
           KEYBOARD
        ================================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    !popup ||
                    !popup.classList.contains("active")
                ) {
                    return;
                }


                if (event.key === "ArrowRight") {

                    galleryNext();

                }


                if (event.key === "ArrowLeft") {

                    galleryPrevious();

                }


                if (event.key === "Escape") {

                    closeGallery();

                }

            }
        );


        /* =================================================
           RESIZE
        ================================================= */

        window.addEventListener(
            "resize",
            function () {

                updateSlider();

            }
        );


        /* =================================================
           START
        ================================================= */

        updateSlider();

        startAutoSlide();


        console.log(
            "Life at DIPS slider loaded successfully"
        );

    });

})();
