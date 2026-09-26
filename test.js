/* =========================================================
   FJMC ACADEMY - LECTURE WISE TEST SYSTEM

   URL FORMAT:

   test.html?course=real-analysis&lecture=1&test=1

   FEATURES:
   - Firebase Auth
   - Firebase Firestore
   - Course wise
   - Lecture wise
   - Multiple tests per lecture
   - 30 minute timer
   - First attempt only saved
   - Retake does NOT change leaderboard
   - Separate leaderboard for every lecture/test
   - Solutions & explanations
   - Basic copy/print/download protection
   ========================================================= */


/* =========================================================
   FIREBASE IMPORTS
   ========================================================= */

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


/* =========================================================
   TEST DATA
   =========================================================

   STRUCTURE:

   COURSE
      ↓
   LECTURE
      ↓
   TEST
      ↓
   QUESTIONS

   Example:

   real-analysis
      lecture 1
         test 1
         test 2

      lecture 2
         test 1
         test 2

   ========================================================= */

const TESTS = {


    /* =====================================================
       REAL ANALYSIS
       ===================================================== */

    "real-analysis": {

        title: "Real Analysis",

        lectures: {


            /* =================================================
               LECTURE 1
               ================================================= */

            "1": {

                title: "Real Analysis - Lecture 1",

                tests: {


                    "1": {

                        title:
                            "Real Analysis - Lecture 1 Test - 1",

                        duration: 30,

                        questions: [

                            {
                                question:
                                    "Which of the following statements is true about every convergent sequence?",

                                options: [

                                    {
                                        text:
                                            "Every convergent sequence is bounded",

                                        correct: true,

                                        solution:
                                            "Every convergent sequence is bounded. If a sequence converges to a finite limit, its terms cannot become arbitrarily large."
                                    },

                                    {
                                        text:
                                            "Every bounded sequence is convergent",

                                        correct: false,

                                        solution:
                                            "A bounded sequence need not converge. For example, (-1)^n is bounded but does not converge."
                                    },

                                    {
                                        text:
                                            "Every sequence is convergent",

                                        correct: false,

                                        solution:
                                            "This is false. Many sequences do not have a finite limit."
                                    },

                                    {
                                        text:
                                            "Every divergent sequence is bounded",

                                        correct: false,

                                        solution:
                                            "A divergent sequence can be bounded or unbounded."
                                    }

                                ]
                            },


                            {
                                question:
                                    "If a sequence converges to L, what is its limit?",

                                options: [

                                    {
                                        text: "L",

                                        correct: true,

                                        solution:
                                            "By definition, if a sequence converges, its limit is the value L to which the sequence approaches."
                                    },

                                    {
                                        text: "0 always",

                                        correct: false,

                                        solution:
                                            "A convergent sequence does not necessarily converge to zero."
                                    },

                                    {
                                        text: "Infinity always",

                                        correct: false,

                                        solution:
                                            "Convergence generally means approaching a finite real number."
                                    },

                                    {
                                        text: "It has no limit",

                                        correct: false,

                                        solution:
                                            "A convergent sequence necessarily has a limit."
                                    }

                                ]
                            },


                            {
                                question:
                                    "Which condition is sufficient for a sequence to be Cauchy in R?",

                                options: [

                                    {
                                        text:
                                            "The sequence is convergent",

                                        correct: true,

                                        solution:
                                            "Every convergent sequence in R is Cauchy."
                                    },

                                    {
                                        text:
                                            "The sequence contains only positive terms",

                                        correct: false,

                                        solution:
                                            "Positivity alone does not imply the Cauchy property."
                                    },

                                    {
                                        text:
                                            "The sequence is always increasing",

                                        correct: false,

                                        solution:
                                            "Being increasing alone does not guarantee that a sequence is Cauchy."
                                    },

                                    {
                                        text:
                                            "The sequence has infinitely many terms",

                                        correct: false,

                                        solution:
                                            "Having infinitely many terms says nothing about whether a sequence is Cauchy."
                                    }

                                ]
                            },


                            {
                                question:
                                    "What is the supremum of the set (0,1)?",

                                options: [

                                    {
                                        text: "1",

                                        correct: true,

                                        solution:
                                            "1 is an upper bound of (0,1), and every number smaller than 1 fails to be an upper bound. Hence sup(0,1)=1."
                                    },

                                    {
                                        text: "0",

                                        correct: false,

                                        solution:
                                            "0 is a lower bound, not the supremum."
                                    },

                                    {
                                        text: "1/2",

                                        correct: false,

                                        solution:
                                            "1/2 is an element of the set but is not an upper bound."
                                    },

                                    {
                                        text:
                                            "There is no supremum",

                                        correct: false,

                                        solution:
                                            "The real numbers are complete, and the set (0,1) has supremum 1."
                                    }

                                ]
                            },


                            {
                                question:
                                    "Which theorem states that every bounded monotone sequence converges?",

                                options: [

                                    {
                                        text:
                                            "Monotone Convergence Theorem",

                                        correct: true,

                                        solution:
                                            "The Monotone Convergence Theorem states that every monotone bounded sequence of real numbers converges."
                                    },

                                    {
                                        text:
                                            "Intermediate Value Theorem",

                                        correct: false,

                                        solution:
                                            "The Intermediate Value Theorem concerns continuous functions and values between function values."
                                    },

                                    {
                                        text:
                                            "Bolzano-Weierstrass Theorem",

                                        correct: false,

                                        solution:
                                            "Bolzano-Weierstrass states that every bounded sequence in R has a convergent subsequence."
                                    },

                                    {
                                        text:
                                            "Mean Value Theorem",

                                        correct: false,

                                        solution:
                                            "The Mean Value Theorem concerns derivatives of continuous/differentiable functions."
                                    }

                                ]
                            }

                        ]

                    },


                    /* =================================================
                       LECTURE 1 - TEST 2
                       ================================================= */

                    "2": {

                        title:
                            "Real Analysis - Lecture 1 Test - 2",

                        duration: 30,

                        questions: [

                            /* YAHAN TEST 2 KE QUESTIONS PASTE KARO */

                        ]

                    }

                }

            },


            /* =================================================
               LECTURE 2
               ================================================= */

            "2": {

                title: "Real Analysis - Lecture 2",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 2 Test - 1",

                        duration: 30,

                        questions: [

                            /* LECTURE 2 KE QUESTIONS */

                        ]

                    },


                    "2": {

                        title:
                            "Real Analysis - Lecture 2 Test - 2",

                        duration: 30,

                        questions: [

                            /* LECTURE 2 TEST 2 KE QUESTIONS */

                        ]

                    }

                }

            },


            /* =================================================
               LECTURE 3
               ================================================= */

            "3": {

                title: "Real Analysis - Lecture 3",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 3 Test - 1",

                        duration: 30,

                        questions: [

                            /* LECTURE 3 KE QUESTIONS */

                        ]

                    }

                }

            },


            /* =================================================
               LECTURE 4
               ================================================= */

            "4": {

                title: "Real Analysis - Lecture 4",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 4 Test - 1",

                        duration: 30,

                        questions: [

                            /* LECTURE 4 KE QUESTIONS */

                        ]

                    }

                }

            },


            /* =================================================
               LECTURE 5
               ================================================= */

            "5": {

                title: "Real Analysis - Lecture 5",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 5 Test - 1",

                        duration: 30,

                        questions: [

                            /* LECTURE 5 KE QUESTIONS */

                        ]

                    }

                }

            }

        }

    },


    /* =====================================================
       FUTURE COURSE EXAMPLE
       =====================================================

       Jab Linear Algebra banana ho:

       "linear-algebra": {

           title: "Linear Algebra",

           lectures: {

               "1": {

                   title: "Linear Algebra - Lecture 1",

                   tests: {

                       "1": {

                           title:
                               "Linear Algebra - Lecture 1 Test - 1",

                           duration: 30,

                           questions: []

                       }

                   }

               }

           }

       }

       ===================================================== */

};


/* =========================================================
   VARIABLES
   ========================================================= */

let currentUser = null;

let currentTest = null;

let courseId = null;

let lectureId = null;

let testNumber = null;

let timerInterval = null;

let remainingSeconds = 0;

let testSubmitted = false;


/* =========================================================
   GET URL PARAMETERS
   ========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


courseId =
    params.get("course");


lectureId =
    params.get("lecture") || "1";


testNumber =
    params.get("test") || "1";


/* =========================================================
   AUTH
   ========================================================= */

onAuthStateChanged(
    auth,

    async function(user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;


        const emailElement =
            document.getElementById(
                "studentEmail"
            );


        if (emailElement) {

            emailElement.textContent =
                user.email || "";

        }


        /* =================================================
           GET CURRENT TEST
           ================================================= */

        currentTest =
            TESTS[
                courseId
            ]
            ?.lectures[
                lectureId
            ]
            ?.tests[
                testNumber
            ];


        /* =================================================
           TEST NOT FOUND
           ================================================= */

        if (!currentTest) {

            const loading =
                document.getElementById(
                    "loading"
                );


            if (loading) {

                loading.innerHTML = `

                    <h3>
                        Test not available.
                    </h3>

                    <p>
                        Course:
                        ${courseId || "Unknown"}
                    </p>

                    <p>
                        Lecture:
                        ${lectureId}
                    </p>

                    <p>
                        Test:
                        ${testNumber}
                    </p>

                `;

            }

            return;

        }


        /* =================================================
           TEST TITLE
           ================================================= */

        const titleElement =
            document.getElementById(
                "testTitle"
            );


        if (titleElement) {

            titleElement.textContent =
                currentTest.title;

        }


        const loading =
            document.getElementById(
                "loading"
            );


        if (loading) {

            loading.remove();

        }


        renderTest();

        startTimer();

    }

);


/* =========================================================
   STUDENT NAME
   ========================================================= */

function getStudentName() {

    if (
        currentUser &&
        currentUser.displayName
    ) {

        return currentUser.displayName;

    }


    try {

        const stored =
            sessionStorage.getItem(
                "loggedInStudent"
            );


        if (stored) {

            const student =
                JSON.parse(stored);


            if (
                student &&
                student.name
            ) {

                return student.name;

            }

        }

    } catch (error) {

        console.log(
            "Student name error:",
            error
        );

    }


    if (
        currentUser &&
        currentUser.email
    ) {

        return currentUser.email
            .split("@")[0];

    }


    return "Student";

}


/* =========================================================
   RENDER TEST
   ========================================================= */

function renderTest() {

    const area =
        document.getElementById(
            "testArea"
        );


    if (!area) {

        return;

    }


    let html = `

        <div class="test-info">

            <h2>
                ${currentTest.title}
            </h2>

            <p>
                Lecture:
                ${lectureId}
            </p>

            <p>
                Test:
                ${testNumber}
            </p>

            <p>
                Total Questions:
                ${currentTest.questions.length}
            </p>

            <p>
                Each correct answer = 1 mark
            </p>

            <div
                id="timerBox"
                class="timer-box"
            >

                Time Left:

                <strong id="timer">
                    ${currentTest.duration}:00
                </strong>

            </div>

        </div>


        <form id="testForm">

    `;


    currentTest.questions.forEach(
        function(question, index) {

            html += `

                <div class="question">

                    <h3>
                        Q${index + 1}.
                        ${question.question}
                    </h3>

            `;


            question.options.forEach(
                function(option, optionIndex) {

                    html += `

                        <label class="option">

                            <input
                                type="radio"
                                name="q${index}"
                                value="${optionIndex}"
                            >

                            ${option.text}

                        </label>

                    `;

                }
            );


            html += `

                </div>

            `;

        }
    );


    html += `

        <button
            type="submit"
            class="submit-btn"
            id="submitBtn"
        >
            Submit Test
        </button>

        </form>

    `;


    area.innerHTML =
        html;


    const form =
        document.getElementById(
            "testForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            submitTest
        );

    }

}


/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {

    remainingSeconds =
        currentTest.duration * 60;


    updateTimer();


    timerInterval =
        setInterval(
            function() {

                if (testSubmitted) {

                    clearInterval(
                        timerInterval
                    );

                    return;

                }


                remainingSeconds--;


                updateTimer();


                if (
                    remainingSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    alert(
                        "Time is over. Test will be submitted automatically."
                    );


                    submitTest(
                        new Event("submit")
                    );

                }

            },
            1000
        );

}


/* =========================================================
   UPDATE TIMER
   ========================================================= */

function updateTimer() {

    const timer =
        document.getElementById(
            "timer"
        );


    if (!timer) {

        return;

    }


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timer.textContent =
        String(minutes)
            .padStart(2, "0") +
        ":" +
        String(seconds)
            .padStart(2, "0");


    if (
        remainingSeconds <= 60
    ) {

        timer.style.fontWeight =
            "900";

    }

}


/* =========================================================
   SUBMIT TEST
   ========================================================= */

async function submitTest(event) {

    if (event) {

        event.preventDefault();

    }


    if (testSubmitted) {

        return;

    }


    testSubmitted = true;


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

    }


    const submitBtn =
        document.getElementById(
            "submitBtn"
        );


    if (submitBtn) {

        submitBtn.disabled =
            true;

    }


    let score = 0;

    const answers = [];


    currentTest.questions.forEach(
        function(question, index) {

            const selected =
                document.querySelector(
                    `input[name="q${index}"]:checked`
                );


            const selectedIndex =
                selected
                    ? Number(
                        selected.value
                    )
                    : -1;


            const correctIndex =
                question.options.findIndex(
                    function(option) {

                        return (
                            option.correct ===
                            true
                        );

                    }
                );


            if (
                selectedIndex ===
                correctIndex
            ) {

                score++;

            }


            answers.push({

                questionIndex:
                    index,

                selectedIndex:
                    selectedIndex,

                correctIndex:
                    correctIndex

            });

        }
    );


    const total =
        currentTest.questions.length;


    const percentage =
        total > 0
            ? (
                (score / total) *
                100
            ).toFixed(2)
            : "0.00";


    /* =====================================================
       UNIQUE RESULT ID

       COURSE + LECTURE + TEST + EMAIL

       Example:

       real-analysis_lecture-1_test-1_email

       real-analysis_lecture-2_test-1_email

       Therefore every test gets separate
       first-attempt result.
       ===================================================== */


    const safeEmail =
        (
            currentUser.email || ""
        )
            .toLowerCase()
            .replace(
                /[^a-z0-9]/g,
                "_"
            );


    const resultId =
        courseId +
        "_lecture-" +
        lectureId +
        "_test-" +
        testNumber +
        "_" +
        safeEmail;


    try {

        const resultRef =
            doc(
                db,
                "testResults",
                resultId
            );


        const existingResult =
            await getDoc(
                resultRef
            );


        /* =================================================
           FIRST ATTEMPT ONLY

           Document does not exist:
           SAVE.

           Document exists:
           DO NOT UPDATE.
           ================================================= */


        if (
            !existingResult.exists()
        ) {

            await setDoc(
                resultRef,
                {

                    name:
                        getStudentName(),

                    email:
                        currentUser.email,

                    uid:
                        currentUser.uid,

                    course:
                        courseId,

                    lecture:
                        lectureId,

                    testNumber:
                        testNumber,

                    testId:
                        courseId +
                        "-lecture-" +
                        lectureId +
                        "-test-" +
                        testNumber,

                    score:
                        score,

                    total:
                        total,

                    percentage:
                        Number(
                            percentage
                        ),

                    answers:
                        answers,

                    submittedAt:
                        Date.now()

                }
            );

        }


        /* =================================================
           SHOW CURRENT ATTEMPT RESULT

           Rank will use FIRST ATTEMPT
           stored in Firestore.
           ================================================= */


        showResult(
            score,
            total,
            percentage,
            answers
        );


    } catch (error) {

        console.error(
            "Result save error:",
            error
        );


        alert(
            "Result save nahi ho saka.\n" +
            error.message
        );


        if (submitBtn) {

            submitBtn.disabled =
                false;

        }


        testSubmitted =
            false;


        return;

    }

}


/* =========================================================
   SHOW RESULT
   ========================================================= */

async function showResult(
    score,
    total,
    percentage,
    answers
) {

    const area =
        document.getElementById(
            "testArea"
        );


    if (!area) {

        return;

    }


    let html = `

        <div class="result">

            <h2>
                Test Completed
            </h2>

            <h1>
                ${score} / ${total}
            </h1>

            <p>
                Percentage:
                ${percentage}%
            </p>

            <div
                class="rank-box"
                id="rankBox"
            >

                Calculating First Attempt Rank...

            </div>

        </div>


        <div
            class="leaderboard"
            id="leaderboard"
        >

            <h2>
                🏆 First Attempt Leaderboard
            </h2>

            <div
                id="leaderboardList"
            >

                Loading leaderboard...

            </div>

        </div>


        <h2>
            Solutions & Explanations
        </h2>

    `;


    currentTest.questions.forEach(
        function(question, qIndex) {

            const answer =
                answers[qIndex];


            html += `

                <div class="question">

                    <h3>
                        Q${qIndex + 1}.
                        ${question.question}
                    </h3>

            `;


            question.options.forEach(
                function(option, optionIndex) {

                    const isCorrect =
                        option.correct === true;


                    const isSelected =
                        answer.selectedIndex ===
                        optionIndex;


                    let className =
                        isCorrect
                            ? "solution correct"
                            : "solution";


                    if (
                        isSelected &&
                        !isCorrect
                    ) {

                        className =
                            "solution wrong";

                    }


                    html += `

                        <div
                            class="${className}"
                        >

                            <strong>
                                ${option.text}
                            </strong>

                            <p>

                                ${
                                    isCorrect
                                        ? "✅ Correct Answer"
                                        : isSelected
                                            ? "❌ Your Answer"
                                            : "○ Option"
                                }

                            </p>

                            <p>

                                <strong>
                                    Explanation:
                                </strong>

                                ${option.solution}

                            </p>

                        </div>

                    `;

                }
            );


            html += `

                </div>

            `;

        }
    );


    area.innerHTML =
        html;


    await calculateRank();

}


/* =========================================================
   RANK + LEADERBOARD
   ========================================================= */

async function calculateRank() {

    const rankBox =
        document.getElementById(
            "rankBox"
        );


    const leaderboardList =
        document.getElementById(
            "leaderboardList"
        );


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "testResults"
                )
            );


        const results = [];


        const currentTestId =
            courseId +
            "-lecture-" +
            lectureId +
            "-test-" +
            testNumber;


        snapshot.forEach(
            function(resultDoc) {

                const data =
                    resultDoc.data();


                /* =========================================
                   ONLY CURRENT COURSE + LECTURE + TEST
                   ========================================= */

                if (
                    data.testId ===
                    currentTestId
                ) {

                    results.push(
                        data
                    );

                }

            }
        );


        /* =================================================
           SORT

           1. Highest score first
           2. Same score:
              Earlier first attempt first
           ================================================= */


        results.sort(
            function(a, b) {

                const scoreDifference =
                    Number(b.score) -
                    Number(a.score);


                if (
                    scoreDifference !== 0
                ) {

                    return scoreDifference;

                }


                return (
                    Number(
                        a.submittedAt || 0
                    ) -
                    Number(
                        b.submittedAt || 0
                    )
                );

            }
        );


        /* =================================================
           CURRENT STUDENT RANK
           ================================================= */

        const myIndex =
            results.findIndex(
                function(result) {

                    return (
                        result.uid ===
                        currentUser.uid
                    );

                }
            );


        const rank =
            myIndex >= 0
                ? myIndex + 1
                : "-";


        if (rankBox) {

            rankBox.innerHTML = `

                🏆 Your First Attempt Rank:

                <strong>
                    #${rank}
                </strong>

            `;

        }


        /* =================================================
           LEADERBOARD
           ================================================= */

        let leaderboardHTML = "";


        if (
            results.length === 0
        ) {

            leaderboardHTML = `

                <p>
                    No results yet.
                </p>

            `;

        } else {

            results.forEach(
                function(result, index) {

                    const studentName =
                        result.name ||
                        (
                            result.email
                                ? result.email
                                    .split("@")[0]
                                : "Student"
                        );


                    let rankText =
                        "#" +
                        (
                            index + 1
                        );


                    if (
                        index === 0
                    ) {

                        rankText =
                            "🥇 #1";

                    } else if (
                        index === 1
                    ) {

                        rankText =
                            "🥈 #2";

                    } else if (
                        index === 2
                    ) {

                        rankText =
                            "🥉 #3";

                    }


                    const isMe =
                        result.uid ===
                        currentUser.uid;


                    leaderboardHTML += `

                        <div
                            class="
                                leaderboard-row
                                ${
                                    isMe
                                        ? "my-rank"
                                        : ""
                                }
                            "
                        >

                            <span
                                class="lb-rank"
                            >
                                ${rankText}
                            </span>


                            <span
                                class="lb-name"
                            >

                                ${studentName}

                                ${
                                    isMe
                                        ? " 👈"
                                        : ""
                                }

                            </span>


                            <span
                                class="lb-score"
                            >

                                ${result.score}/${result.total}

                            </span>

                        </div>

                    `;

                }
            );

        }


        if (leaderboardList) {

            leaderboardList.innerHTML =
                leaderboardHTML;

        }


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        if (rankBox) {

            rankBox.textContent =
                "Rank unavailable";

        }


        if (leaderboardList) {

            leaderboardList.innerHTML =
                "Leaderboard unavailable.";

        }

    }

}


/* =========================================================
   BASIC PROTECTION
   ========================================================= */

document.addEventListener(
    "contextmenu",
    function(event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "copy",
    function(event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "cut",
    function(event) {

        event.preventDefault();

    }
);


document.addEventListener(
    "selectstart",
    function(event) {

        event.preventDefault();

    }
);


/* =========================================================
   KEYBOARD PROTECTION
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        if (
            (
                event.ctrlKey ||
                event.metaKey
            ) &&
            (
                key === "p" ||
                key === "s" ||
                key === "c" ||
                key === "u"
            )
        ) {

            event.preventDefault();

            event.stopPropagation();

        }


        if (
            key === "f12"
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   PRINT PROTECTION
   ========================================================= */

window.addEventListener(
    "beforeprint",
    function() {

        document.body.dataset
            .originalHTML =
            document.body.innerHTML;


        document.body.innerHTML = `

            <div
                style="
                    width:100%;
                    height:100vh;
                    background:white;
                "
            ></div>

        `;

    }
);


window.addEventListener(
    "afterprint",
    function() {

        window.location.reload();

    }
);
