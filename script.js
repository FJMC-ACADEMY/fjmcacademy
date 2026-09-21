
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
(function () {

  const students = [

    {
      name: "Rohit Sharma",
      rank: "Rank-16",
      exam: "CSIR NET June 25",
      image: "1.jpg"
    },

    {
      name: "Ankita Rana",
      rank: "Rank-27",
      exam: "CSIR NET June 25",
      image: "2.jpg"
    },

    {
      name: "Prakhar Nigam",
      rank: "Rank-28",
      exam: "CSIR NET June 25",
      image: "3.jpg"
    },

    {
      name: "Madhumita Raj",
      rank: "Rank-34",
      exam: "CSIR NET June 25",
      image: "4.jpg"
    },

    {
      name: "Poornima",
      rank: "Rank-38",
      exam: "CSIR NET June 25",
      image: "5.jpg"
    },

    {
      name: "Tanishka Singh",
      rank: "Rank-28",
      exam: "CSIR NET Dec 24",
      image: "6.jpg"
    },

    {
      name: "Aaina Dalal",
      rank: "Rank-30",
      exam: "CSIR NET Dec 24",
      image: "7.jpg"
    },

    {
      name: "Ananya Tripathi",
      rank: "Rank-30",
      exam: "CSIR NET Dec 24",
      image: "8.jpg"
    },

    {
      name: "Gouranga Payra",
      rank: "Rank-34",
      exam: "CSIR NET Dec 24",
      image: "1.jpg"
    },

    {
      name: "Harish Kumar",
      rank: "Rank-13",
      exam: "IIT JAM 25",
      image: "2.jpg"
    },

    {
      name: "Rahul Maithani",
      rank: "Rank-18",
      exam: "IIT JAM 25",
      image: "3.jpg"
    },

    {
      name: "Narendra Kumar",
      rank: "Rank-30",
      exam: "IIT JAM 25",
      image: "4.jpg"
    },

    {
      name: "Tushar Daila",
      rank: "Rank-31",
      exam: "IIT JAM 25",
      image: "5.jpg"
    }

  ];


  let selectedExam = "CSIR NET June 25";
  let currentIndex = 0;


  const cardsContainer =
    document.getElementById("rankersCards");

  const dotsContainer =
    document.getElementById("rankersDots");

  const prevButton =
    document.getElementById("rankerPrev");

  const nextButton =
    document.getElementById("rankerNext");

  const tabs =
    document.querySelectorAll(".ranker-tab");

  const modal =
    document.getElementById("rankersModal");

  const modalClose =
    document.getElementById("rankersModalClose");

  const modalTitle =
    document.getElementById("rankersModalTitle");

  const allRankers =
    document.getElementById("allRankers");

  const viewAllButton =
    document.getElementById("viewAllRankers");

  const photoViewer =
    document.getElementById("rankerPhotoViewer");

  const largePhoto =
    document.getElementById("rankerLargePhoto");

  const photoClose =
    document.getElementById("rankerPhotoClose");

  const background =
    document.querySelector(".rankers-bg");

  const backgroundButtons =
    document.querySelectorAll(
      ".background-buttons button"
    );


  function getStudents() {

    return students.filter(function (student) {

      return student.exam === selectedExam;

    });

  }


  function getVisibleCount() {

    if (window.innerWidth <= 700) {
      return 1;
    }

    if (window.innerWidth <= 1000) {
      return 3;
    }

    return 4;

  }


  function createCard(student) {

    const card =
      document.createElement("div");

    card.className = "ranker-card";


    const imageBox =
      document.createElement("div");

    imageBox.className =
      "ranker-image-box";


    const image =
      document.createElement("img");

    image.src = student.image;

    image.alt = student.name;

    image.loading = "lazy";


    imageBox.appendChild(image);


    /*
      Desktop:
      Double click = large photo

      Mobile:
      Single click = large photo
    */

    imageBox.addEventListener(
      "dblclick",
      function () {

        openPhoto(student.image);

      }
    );


    imageBox.addEventListener(
      "click",
      function () {

        if (window.innerWidth <= 700) {

          openPhoto(student.image);

        }

      }
    );


    const info =
      document.createElement("div");

    info.className = "ranker-info";


    const name =
      document.createElement("div");

    name.className = "ranker-name";

    name.textContent = student.name;


    const rank =
      document.createElement("div");

    rank.className = "ranker-rank";

    rank.textContent = student.rank;


    const exam =
      document.createElement("div");

    exam.className = "ranker-exam";

    exam.textContent = student.exam;


    info.appendChild(name);
    info.appendChild(rank);
    info.appendChild(exam);


    card.appendChild(imageBox);
    card.appendChild(info);


    return card;

  }


  function renderCards() {

    const list =
      getStudents();

    const visible =
      getVisibleCount();


    const maxIndex =
      Math.max(
        0,
        list.length - visible
      );


    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }


    cardsContainer.innerHTML = "";


    for (
      let i = currentIndex;
      i < currentIndex + visible &&
      i < list.length;
      i++
    ) {

      cardsContainer.appendChild(
        createCard(list[i])
      );

    }


    renderDots();

    updateArrows();

  }


  function renderDots() {

    const list =
      getStudents();

    const visible =
      getVisibleCount();


    const total =
      Math.max(
        1,
        list.length - visible + 1
      );


    dotsContainer.innerHTML = "";


    for (
      let i = 0;
      i < total;
      i++
    ) {

      const dot =
        document.createElement("button");

      dot.className =
        "ranker-dot";


      if (i === currentIndex) {
        dot.classList.add("active");
      }


      dot.addEventListener(
        "click",
        function () {

          currentIndex = i;

          renderCards();

        }
      );


      dotsContainer.appendChild(dot);

    }

  }


  function updateArrows() {

    const list =
      getStudents();

    const visible =
      getVisibleCount();


    const maxIndex =
      Math.max(
        0,
        list.length - visible
      );


    prevButton.disabled =
      currentIndex <= 0;

    nextButton.disabled =
      currentIndex >= maxIndex;

  }


  /*
    NEXT = only 1 photo forward
  */

  nextButton.addEventListener(
    "click",
    function () {

      const list =
        getStudents();

      const visible =
        getVisibleCount();

      const maxIndex =
        Math.max(
          0,
          list.length - visible
        );


      if (currentIndex < maxIndex) {

        currentIndex++;

        renderCards();

      }

    }
  );


  /*
    PREVIOUS = only 1 photo backward
  */

  prevButton.addEventListener(
    "click",
    function () {

      if (currentIndex > 0) {

        currentIndex--;

        renderCards();

      }

    }
  );


  /*
    EXAM TABS
  */

  tabs.forEach(function (tab) {

    tab.addEventListener(
      "click",
      function () {

        tabs.forEach(function (item) {

          item.classList.remove("active");

        });


        tab.classList.add("active");


        selectedExam =
          tab.getAttribute("data-exam");


        currentIndex = 0;


        renderCards();

      }
    );

  });


  /*
    VIEW ALL
  */

  viewAllButton.addEventListener(
    "click",
    function () {

      const list =
        getStudents();


      modalTitle.textContent =
        selectedExam + " - Top Rankers";


      allRankers.innerHTML = "";


      list.forEach(function (student) {

        allRankers.appendChild(
          createCard(student)
        );

      });


      modal.classList.add("show");

      document.body.style.overflow =
        "hidden";

    }
  );


  /*
    CLOSE MODAL
  */

  function closeModal() {

    modal.classList.remove("show");

    document.body.style.overflow = "";

  }


  modalClose.addEventListener(
    "click",
    closeModal
  );


  modal.addEventListener(
    "click",
    function (event) {

      if (event.target === modal) {

        closeModal();

      }

    }
  );


  /*
    LARGE PHOTO
  */

  function openPhoto(image) {

    largePhoto.src = image;

    photoViewer.classList.add("show");

    document.body.style.overflow =
      "hidden";

  }


  function closePhoto() {

    photoViewer.classList.remove("show");

    largePhoto.src = "";

    document.body.style.overflow = "";

  }


  photoClose.addEventListener(
    "click",
    closePhoto
  );


  photoViewer.addEventListener(
    "click",
    function (event) {

      if (event.target === photoViewer) {

        closePhoto();

      }

    }
  );


  /*
    ESCAPE
  */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {

        closeModal();

        closePhoto();

      }

    }
  );


  /*
    CHANGE BACKGROUND
  */

  backgroundButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const number =
            button.getAttribute(
              "data-background"
            );


          background.style.backgroundImage =
            'url("' + number + '.jpg")';


          backgroundButtons.forEach(
            function (item) {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add("active");

        }
      );

    }
  );


  /*
    RESIZE
  */

  window.addEventListener(
    "resize",
    function () {

      renderCards();

    }
  );


  /*
    INITIAL LOAD
  */

  renderCards();

  backgroundButtons[0].classList.add(
    "active"
  );

})();
