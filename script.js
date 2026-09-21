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
