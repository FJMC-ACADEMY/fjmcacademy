
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
   LIFE AT DIPS - FINAL VERSION
===================================================== */

(function () {

    function startLifeDips() {

        const track =
            document.getElementById("lifeDipsTrack");

        const viewport =
            document.getElementById("lifeDipsViewport");

        const photos =
            Array.from(
                document.querySelectorAll(".lifeDipsPhoto")
            );

        const nextButton =
            document.getElementById("lifeDipsNext");

        const prevButton =
            document.getElementById("lifeDipsPrev");

        const galleryButton =
            document.getElementById(
                "lifeDipsGalleryButton"
            );

        const gallery =
            document.getElementById(
                "lifeDipsGallery"
            );

        const largeImage =
            document.getElementById(
                "lifeDipsLargeImage"
            );

        const galleryNext =
            document.getElementById(
                "lifeDipsGalleryNext"
            );

        const galleryPrev =
            document.getElementById(
                "lifeDipsGalleryPrev"
            );

        const closeButton =
            document.getElementById(
                "lifeDipsClose"
            );

        const counter =
            document.getElementById(
                "lifeDipsCounter"
            );


        if (
            !track ||
            !viewport ||
            !photos.length ||
            !nextButton ||
            !prevButton
        ) {
            console.log(
                "Life at DIPS HTML missing"
            );

            return;
        }


        let sliderIndex = 0;

        let galleryIndex = 0;

        let autoTimer = null;

        let startX = 0;

        let endX = 0;


        /* =============================================
           VISIBLE
        ============================================= */

        function visible() {

            if (
                window.innerWidth <= 700
            ) {
                return 1;
            }

            return 4;
        }


        /* =============================================
           MAX INDEX
        ============================================= */

        function maxSliderIndex() {

            return Math.max(
                0,
                photos.length - visible()
            );

        }


        /* =============================================
           MOVE
        ============================================= */

        function moveSlider() {

            const max =
                maxSliderIndex();


            if (sliderIndex > max) {
                sliderIndex = 0;
            }


            if (sliderIndex < 0) {
                sliderIndex = max;
            }


            const width =
                photos[0]
                .getBoundingClientRect()
                .width;


            const gap =
                window.innerWidth <= 700
                    ? 0
                    : 25;


            const distance =
                sliderIndex *
                (width + gap);


            track.style.transform =
                "translate3d(-" +
                distance +
                "px,0,0)";

        }


        /* =============================================
           NEXT
        ============================================= */

        function nextSlide() {

            sliderIndex++;


            if (
                sliderIndex >
                maxSliderIndex()
            ) {

                sliderIndex = 0;

            }


            moveSlider();

        }


        /* =============================================
           PREVIOUS
        ============================================= */

        function previousSlide() {

            sliderIndex--;


            if (sliderIndex < 0) {

                sliderIndex =
                    maxSliderIndex();

            }


            moveSlider();

        }


        /* =============================================
           BUTTONS
        ============================================= */

        nextButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                nextSlide();

                restartAuto();

            }
        );


        prevButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                previousSlide();

                restartAuto();

            }
        );


        /* =============================================
           AUTO 5 SEC
        ============================================= */

        function startAuto() {

            clearInterval(autoTimer);


            autoTimer =
                setInterval(
                    function () {

                        nextSlide();

                    },
                    5000
                );

        }


        function stopAuto() {

            clearInterval(autoTimer);

        }


        function restartAuto() {

            stopAuto();

            startAuto();

        }


        /* =============================================
           MOUSE PAUSE
        ============================================= */

        viewport.addEventListener(
            "mouseenter",
            function () {

                stopAuto();

            }
        );


        viewport.addEventListener(
            "mouseleave",
            function () {

                startAuto();

            }
        );


        /* =============================================
           OPEN LARGE IMAGE
        ============================================= */

        function showGallery(number) {

            if (!gallery || !largeImage) {
                return;
            }


            if (number < 0) {

                number =
                    photos.length - 1;

            }


            if (number >= photos.length) {

                number = 0;

            }


            galleryIndex = number;


            const image =
                photos[galleryIndex]
                .querySelector("img");


            if (!image) {
                return;
            }


            largeImage.src =
                image.src;


            largeImage.alt =
                image.alt;


            counter.textContent =
                (galleryIndex + 1) +
                " / " +
                photos.length;


            gallery.classList.add(
                "lifeGalleryOpen"
            );


            stopAuto();

        }


        /* =============================================
           VIEW OUR PICTURE GALLERY
        ============================================= */

        if (galleryButton) {

            galleryButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    showGallery(0);

                }
            );

        }


        /* =============================================
           LARGE NEXT
        ============================================= */

        galleryNext.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                showGallery(
                    galleryIndex + 1
                );

            }
        );


        /* =============================================
           LARGE PREVIOUS
        ============================================= */

        galleryPrev.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                showGallery(
                    galleryIndex - 1
                );

            }
        );


        /* =============================================
           CLOSE
        ============================================= */

        closeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                gallery.classList.remove(
                    "lifeGalleryOpen"
                );

                startAuto();

            }
        );


        /* =============================================
           CLICK OUTSIDE IMAGE
        ============================================= */

        gallery.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === gallery
                ) {

                    gallery.classList.remove(
                        "lifeGalleryOpen"
                    );

                    startAuto();

                }

            }
        );


        /* =============================================
           DOUBLE CLICK DESKTOP
        ============================================= */

        photos.forEach(
            function (photo, number) {

                const image =
                    photo.querySelector("img");


                image.addEventListener(
                    "dblclick",
                    function (event) {

                        event.preventDefault();

                        showGallery(number);

                    }
                );

            }
        );


        /* =============================================
           MOBILE SWIPE
        ============================================= */

        viewport.addEventListener(
            "touchstart",
            function (event) {

                startX =
                    event.touches[0].clientX;

                stopAuto();

            },
            {
                passive: true
            }
        );


        viewport.addEventListener(
            "touchend",
            function (event) {

                endX =
                    event.changedTouches[0].clientX;


                const difference =
                    startX - endX;


                if (
                    Math.abs(difference) > 50
                ) {

                    if (difference > 0) {

                        nextSlide();

                    } else {

                        previousSlide();

                    }

                }


                startAuto();

            },
            {
                passive: true
            }
        );


        /* =============================================
           KEYBOARD
        ============================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    !gallery.classList.contains(
                        "lifeGalleryOpen"
                    )
                ) {
                    return;
                }


                if (
                    event.key === "ArrowRight"
                ) {

                    showGallery(
                        galleryIndex + 1
                    );

                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    showGallery(
                        galleryIndex - 1
                    );

                }


                if (
                    event.key === "Escape"
                ) {

                    gallery.classList.remove(
                        "lifeGalleryOpen"
                    );

                    startAuto();

                }

            }
        );


        /* =============================================
           RESIZE
        ============================================= */

        window.addEventListener(
            "resize",
            function () {

                moveSlider();

            }
        );


        /* =============================================
           START
        ============================================= */

        moveSlider();

        startAuto();


        console.log(
            "LIFE AT DIPS FINAL SYSTEM READY"
        );

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startLifeDips
        );

    } else {

        startLifeDips();

    }

})();
/* =====================================
   TOP RANKERS DATA
===================================== */

const rankers = [

  {
    name: "Rohit Sharma",
    rank: "Rank-16",
    exam: "june",
    examName: "CSIR NET June 25",
    photo: "images/rohit.jpg"
  },

  {
    name: "Ankita Rana",
    rank: "Rank-27",
    exam: "june",
    examName: "CSIR NET June 25",
    photo: "images/ankita.jpg"
  },

  {
    name: "Prakhar Nigam",
    rank: "Rank-28",
    exam: "june",
    examName: "CSIR NET June 25",
    photo: "images/prakhar.jpg"
  },

  {
    name: "Madhumita Raj",
    rank: "Rank-34",
    exam: "june",
    examName: "CSIR NET June 25",
    photo: "images/madhumita.jpg"
  },

  {
    name: "Poornima",
    rank: "Rank-38",
    exam: "june",
    examName: "CSIR NET June 25",
    photo: "images/poornima.jpg"
  },


  {
    name: "Tanishka Singh",
    rank: "Rank-28",
    exam: "dec",
    examName: "CSIR NET Dec 24",
    photo: "images/tanishka.jpg"
  },

  {
    name: "Aaina Dalal",
    rank: "Rank-30",
    exam: "dec",
    examName: "CSIR NET Dec 24",
    photo: "images/aaina.jpg"
  },

  {
    name: "Ananya Tripathi",
    rank: "Rank-30",
    exam: "dec",
    examName: "CSIR NET Dec 24",
    photo: "images/ananya.jpg"
  },

  {
    name: "Gouranga Payra",
    rank: "Rank-34",
    exam: "dec",
    examName: "CSIR NET Dec 24",
    photo: "images/gouranga.jpg"
  },


  {
    name: "Harish Kumar",
    rank: "Rank-13",
    exam: "jam",
    examName: "IIT JAM 25",
    photo: "images/harish.jpg"
  },

  {
    name: "Rahul Maithani",
    rank: "Rank-18",
    exam: "jam",
    examName: "IIT JAM 25",
    photo: "images/rahul.jpg"
  },

  {
    name: "Narendra Kumar",
    rank: "Rank-30",
    exam: "jam",
    examName: "IIT JAM 25",
    photo: "images/narendra.jpg"
  },

  {
    name: "Tushar Daila",
    rank: "Rank-31",
    exam: "jam",
    examName: "IIT JAM 25",
    photo: "images/tushar.jpg"
  }

];


/* =====================================
   VARIABLES
===================================== */

const cardsContainer =
  document.getElementById("rankersGrid");

const dotsContainer =
  document.getElementById("rankerDots");

const prevButton =
  document.getElementById("prevRanker");

const nextButton =
  document.getElementById("nextRanker");

const examTabs =
  document.querySelectorAll(".exam-tab");

const viewAllButton =
  document.getElementById("viewAllRankers");

const modal =
  document.getElementById("rankersModal");

const closeModal =
  document.getElementById("closeRankersModal");

const allRankersGrid =
  document.getElementById("allRankersGrid");


let currentExam = "june";

let currentIndex = 0;

const visibleCards = 4;


/* =====================================
   CREATE CARD
===================================== */

function createCard(person) {

  return `
    <article class="ranker-card">

      <img
        class="ranker-photo"
        src="${person.photo}"
        alt="${person.name}"
        onerror="this.style.display='none'"
      >

      <div class="ranker-info">

        <h3>${person.name}</h3>

        <span class="ranker-rank">
          ${person.rank}
        </span>

        <div class="ranker-exam">
          ${person.examName}
        </div>

      </div>

    </article>
  `;
}


/* =====================================
   GET CURRENT EXAM RANKERS
===================================== */

function getCurrentRankers() {

  return rankers.filter(
    person => person.exam === currentExam
  );

}


/* =====================================
   RENDER MAIN CARDS
===================================== */

function renderRankers() {

  const data = getCurrentRankers();

  const maxIndex =
    Math.max(0, data.length - visibleCards);

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }


  const visibleData =
    data.slice(
      currentIndex,
      currentIndex + visibleCards
    );


  cardsContainer.innerHTML =
    visibleData.map(createCard).join("");


  renderDots(data.length, maxIndex);

  updateButtons(data.length, maxIndex);
}


/* =====================================
   DOTS
===================================== */

function renderDots(total, maxIndex) {

  dotsContainer.innerHTML = "";


  for (
    let i = 0;
    i <= maxIndex;
    i++
  ) {

    const dot =
      document.createElement("span");

    dot.className = "ranker-dot";

    if (i === currentIndex) {
      dot.classList.add("active");
    }


    dot.addEventListener(
      "click",
      () => {

        currentIndex = i;

        renderRankers();

      }
    );


    dotsContainer.appendChild(dot);

  }

}


/* =====================================
   BUTTON STATUS
===================================== */

function updateButtons(total, maxIndex) {

  prevButton.disabled =
    currentIndex === 0;

  nextButton.disabled =
    currentIndex >= maxIndex;

}


/* =====================================
   NEXT
===================================== */

nextButton.addEventListener(
  "click",
  () => {

    const data = getCurrentRankers();

    const maxIndex =
      Math.max(
        0,
        data.length - visibleCards
      );


    if (currentIndex < maxIndex) {

      currentIndex++;

      renderRankers();

    }

  }
);


/* =====================================
   PREVIOUS
===================================== */

prevButton.addEventListener(
  "click",
  () => {

    if (currentIndex > 0) {

      currentIndex--;

      renderRankers();

    }

  }
);


/* =====================================
   EXAM TABS
===================================== */

examTabs.forEach(tab => {

  tab.addEventListener(
    "click",
    () => {

      examTabs.forEach(t =>
        t.classList.remove("active")
      );

      tab.classList.add("active");


      currentExam =
        tab.dataset.exam;

      currentIndex = 0;

      renderRankers();

    }
  );

});


/* =====================================
   VIEW ALL
===================================== */

viewAllButton.addEventListener(
  "click",
  () => {

    renderAllRankers();

    modal.classList.add("show");

    document.body.style.overflow =
      "hidden";

  }
);


/* =====================================
   RENDER ALL
===================================== */

function renderAllRankers() {

  const data =
    getCurrentRankers();


  allRankersGrid.innerHTML =
    data.map(createCard).join("");

}


/* =====================================
   CLOSE MODAL
===================================== */

closeModal.addEventListener(
  "click",
  closeRankers
);


modal.addEventListener(
  "click",
  event => {

    if (event.target === modal) {

      closeRankers();

    }

  }
);


function closeRankers() {

  modal.classList.remove("show");

  document.body.style.overflow =
    "";

}


/* =====================================
   ESC KEY
===================================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      modal.classList.contains("show")
    ) {

      closeRankers();

    }

  }
);


/* =====================================
   INITIAL LOAD
===================================== */

renderRankers();
