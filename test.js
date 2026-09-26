/* =========================================================
   FJMC ACADEMY - LECTURE WISE TEST SYSTEM
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
   ========================================================= */

const TESTS = {

    "real-analysis": {

        title: "Real Analysis",

        lectures: {

            "1": {

                title: "Lecture 1",

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
                                            "Every convergent sequence is bounded."
                                    },

                                    {
                                        text:
                                            "Every bounded sequence is convergent",

                                        correct: false,

                                        solution:
                                            "A bounded sequence need not converge. For example, (-1)^n is bounded but divergent."
                                    },

                                    {
                                        text:
                                            "Every sequence is convergent",

                                        correct: false,

                                        solution:
                                            "Not every sequence converges."
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
                                            "By definition, the limit of the sequence is L."
                                    },

                                    {
                                        text: "0 always",

                                        correct: false,

                                        solution:
                                            "A convergent sequence need not converge to zero."
                                    },

                                    {
                                        text: "Infinity always",

                                        correct: false,

                                        solution:
                                            "A convergent sequence has a finite real limit."
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
                                            "Positive terms alone do not imply the Cauchy property."
                                    },

                                    {
                                        text:
                                            "The sequence is always increasing",

                                        correct: false,

                                        solution:
                                            "An increasing sequence need not be Cauchy."
                                    },

                                    {
                                        text:
                                            "The sequence has infinitely many terms",

                                        correct: false,

                                        solution:
                                            "Having infinitely many terms does not imply that a sequence is Cauchy."
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
                                            "The supremum of (0,1) is 1."
                                    },

                                    {
                                        text: "0",

                                        correct: false,

                                        solution:
                                            "0 is the infimum, not the supremum."
                                    },

                                    {
                                        text: "1/2",

                                        correct: false,

                                        solution:
                                            "1/2 is not an upper bound of (0,1)."
                                    },

                                    {
                                        text:
                                            "There is no supremum",

                                        correct: false,

                                        solution:
                                            "The set (0,1) has supremum 1."
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
                                            "Every bounded monotone sequence of real numbers converges."
                                    },

                                    {
                                        text:
                                            "Intermediate Value Theorem",

                                        correct: false,

                                        solution:
                                            "This theorem concerns continuous functions."
                                    },

                                    {
                                        text:
                                            "Bolzano-Weierstrass Theorem",

                                        correct: false,

                                        solution:
                                            "It states that every bounded sequence has a convergent subsequence."
                                    },

                                    {
                                        text:
                                            "Mean Value Theorem",

                                        correct: false,

                                        solution:
                                            "It concerns derivatives of functions."
                                    }

                                ]
                            }

                        ]

                    },


                    /* =========================================
                       LECTURE 1 - TEST 2
                       ========================================= */

                    "2": {

                        title:
                            "Real Analysis - Lecture 1 Test - 2",

                        duration: 30,

                        questions: [

                            {
                                question:
                                    "Which of the following sequences converges to 0?",

                                options: [

                                    {
                                        text: "1/n",

                                        correct: true,

                                        solution:
                                            "As n tends to infinity, 1/n tends to 0."
                                    },

                                    {
                                        text: "n",

                                        correct: false,

                                        solution:
                                            "n tends to infinity."
                                    },

                                    {
                                        text: "(-1)^n",

                                        correct: false,

                                        solution:
                                            "(-1)^n oscillates between -1 and 1."
                                    },

                                    {
                                        text: "n^2",

                                        correct: false,

                                        solution:
                                            "n^2 tends to infinity."
                                    }

                                ]
                            },


                            {
                                question:
                                    "Which of the following sequences is bounded?",

                                options: [

                                    {
                                        text: "(-1)^n",

                                        correct: true,

                                        solution:
                                            "The sequence only takes the values -1 and 1."
                                    },

                                    {
                                        text: "n",

                                        correct: false,

                                        solution:
                                            "n is unbounded."
                                    },

                                    {
                                        text: "n^2",

                                        correct: false,

                                        solution:
                                            "n^2 is unbounded."
                                    },

                                    {
                                        text: "2^n",

                                        correct: false,

                                        solution:
                                            "2^n is unbounded."
                                    }

                                ]
                            },


                            {
                                question:
                                    "What is the infimum of the set (0,1)?",

                                options: [

                                    {
                                        text: "0",

                                        correct: true,

                                        solution:
                                            "The infimum of (0,1) is 0."
                                    },

                                    {
                                        text: "1",

                                        correct: false,

                                        solution:
                                            "1 is the supremum."
                                    },

                                    {
                                        text: "1/2",

                                        correct: false,

                                        solution:
                                            "1/2 is not a lower bound."
                                    },

                                    {
                                        text:
                                            "There is no infimum",

                                        correct: false,

                                        solution:
                                            "The set (0,1) has infimum 0."
                                    }

                                ]
                            },


                            {
                                question:
                                    "Which of the following is true for every convergent sequence of real numbers?",

                                options: [

                                    {
                                        text: "It is bounded",

                                        correct: true,

                                        solution:
                                            "Every convergent sequence of real numbers is bounded."
                                    },

                                    {
                                        text:
                                            "It is strictly increasing",

                                        correct: false,

                                        solution:
                                            "Convergence does not imply increasing behaviour."
                                    },

                                    {
                                        text:
                                            "It is strictly decreasing",

                                        correct: false,

                                        solution:
                                            "Convergence does not imply decreasing behaviour."
                                    },

                                    {
                                        text:
                                            "It contains only positive terms",

                                        correct: false,

                                        solution:
                                            "A convergent sequence may contain negative terms."
                                    }

                                ]
                            },


                            {
                                question:
                                    "Which sequence is monotone increasing?",

                                options: [

                                    {
                                        text: "a_n = n",

                                        correct: true,

                                        solution:
                                            "a_(n+1) = n+1 > n = a_n."
                                    },

                                    {
                                        text: "a_n = (-1)^n",

                                        correct: false,

                                        solution:
                                            "The sequence alternates between -1 and 1."
                                    },

                                    {
                                        text: "a_n = 1/n",

                                        correct: false,

                                        solution:
                                            "1/n is decreasing."
                                    },

                                    {
                                        text: "a_n = (-1)^n/n",

                                        correct: false,

                                        solution:
                                            "The signs alternate."
                                    }

                                ]
                            }

                        ]

                    }

                }

            },


            /* =================================================
               LECTURE 2
               ================================================= */

            "2": {

                title: "Lecture 2",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 2 Test - 1",

                        duration: 30,

                        questions: [

                            {
                                question:
                                    "Sample Lecture 2 Question",

                                options: [

                                    {
                                        text: "Correct Answer",

                                        correct: true,

                                        solution:
                                            "Explanation of the correct answer."
                                    },

                                    {
                                        text: "Wrong Answer",

                                        correct: false,

                                        solution:
                                            "Explanation."
                                    },

                                    {
                                        text: "Wrong Answer",

                                        correct: false,

                                        solution:
                                            "Explanation."
                                    },

                                    {
                                        text: "Wrong Answer",

                                        correct: false,

                                        solution:
                                            "Explanation."
                                    }

                                ]
                            }

                        ]

                    },


                    "2": {

                        title:
                            "Real Analysis - Lecture 2 Test - 2",

                        duration: 30,

                        questions: [

                            {
                                question:
                                    "Sample Lecture 2 Test 2 Question",

                                options: [

                                    {
                                        text: "Correct Answer",

                                        correct: true,

                                        solution:
                                            "Explanation."
                                    },

                                    {
                                        text: "Wrong Answer",

                                        correct: false,

                                        solution:
                                            "Explanation."
                                    },

                                    {
                                        text: "Wrong Answer",

                                        correct: false,

                                        solution:
                                            "Explanation."
                                    },

                                    {
                                        text: "Wrong Answer",

                                        correct: false,

                                        solution:
                                            "Explanation."
                                    }

                                ]
                            }

                        ]

                    }

                }

            },


            /* =================================================
               LECTURE 3
               ================================================= */

            "3": {

                title: "Lecture 3",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 3 Test - 1",

                        duration: 30,

                        questions: []

                    },

                    "2": {

                        title:
                            "Real Analysis - Lecture 3 Test - 2",

                        duration: 30,

                        questions: []

                    }

                }

            },


            /* =================================================
               LECTURE 4
               ================================================= */

            "4": {

                title: "Lecture 4",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 4 Test - 1",

                        duration: 30,

                        questions: []

                    },

                    "2": {

                        title:
                            "Real Analysis - Lecture 4 Test - 2",

                        duration: 30,

                        questions: []

                    }

                }

            },


            /* =================================================
               LECTURE 5
               ================================================= */

            "5": {

                title: "Lecture 5",

                tests: {

                    "1": {

                        title:
                            "Real Analysis - Lecture 5 Test - 1",

                        duration: 30,

                        questions: []

                    },

                    "2": {

                        title:
                            "Real Analysis - Lecture 5 Test - 2",

                        duration: 30,

                        questions: []

                    }

                }

            }

        }

    }

},
/* =====================================================
   CALCULUS
   ===================================================== */

"calculus": {

    title: "Calculus",

    lectures: {

        /* ==============================================
           LECTURE 1
           ============================================== */

        "1": {

            title: "Calculus - Lecture 1",

            tests: {

                "1": {

                    title:
                        "Calculus - Lecture 1 Test - 1",

                    duration: 30,

                    questions: [

                        {
                            question:
                                "YOUR QUESTION HERE",

                            options: [

                                {
                                    text:
                                        "Option A",

                                    correct: true,

                                    solution:
                                        "Explanation of correct answer."
                                },

                                {
                                    text:
                                        "Option B",

                                    correct: false,

                                    solution:
                                        "Explanation."
                                },

                                {
                                    text:
                                        "Option C",

                                    correct: false,

                                    solution:
                                        "Explanation."
                                },

                                {
                                    text:
                                        "Option D",

                                    correct: false,

                                    solution:
                                        "Explanation."
                                }

                            ]
                        }

                    ]

                },


                /* LECTURE 1 - TEST 2 */

                "2": {

                    title:
                        "Calculus - Lecture 1 Test - 2",

                    duration: 30,

                    questions: [

                        /* Test 2 questions here */

                    ]

                }

            }

        },


        /* ==============================================
           LECTURE 2
           ============================================== */

        "2": {

            title: "Calculus - Lecture 2",

            tests: {

                "1": {

                    title:
                        "Calculus - Lecture 2 Test - 1",

                    duration: 30,

                    questions: [

                        /* Lecture 2 Test 1 questions */

                    ]

                },


                "2": {

                    title:
                        "Calculus - Lecture 2 Test - 2",

                    duration: 30,

                    questions: [

                        /* Lecture 2 Test 2 questions */

                    ]

                }

            }

        },


        /* ==============================================
           LECTURE 3
           ============================================== */

        "3": {

            title: "Calculus - Lecture 3",

            tests: {

                "1": {

                    title:
                        "Calculus - Lecture 3 Test - 1",

                    duration: 30,

                    questions: [

                        /* Lecture 3 Test 1 questions */

                    ]

                }

            }

        }

    }

           }

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
   URL PARAMETERS
   ========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

courseId =
    params.get("course");

lectureId =
    params.get("lecture");

testNumber =
    params.get("test");


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


        /* ================================================
           COURSE CHECK
           ================================================ */

        const course =
            TESTS[courseId];


        if (!course) {

            showMessage(
                "Course not available."
            );

            return;

        }


        /*
         * IMPORTANT
         *
         * Agar lecture/test URL mein nahi hai,
         * to selection page dikhao.
         */

        if (
            !lectureId ||
            !testNumber
        ) {

            showTestSelection();

            return;

        }


        currentTest =
            course
                .lectures[lectureId]
                ?.tests[testNumber];


        if (!currentTest) {

            showMessage(
                "Test not available."
            );

            return;

        }


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
   MESSAGE
   ========================================================= */

function showMessage(message) {

    const loading =
        document.getElementById(
            "loading"
        );

    if (loading) {

        loading.innerHTML = `
            <h3>${message}</h3>
        `;

    }

}


/* =========================================================
   TEST SELECTION
   ========================================================= */

function showTestSelection() {

    const loading =
        document.getElementById(
            "loading"
        );

    if (loading) {

        loading.remove();

    }


    const area =
        document.getElementById(
            "testArea"
        );


    if (!area) {

        return;

    }


    const course =
        TESTS[courseId];


    let html = `

        <div class="test-info">

            <h1>
                ${course.title}
            </h1>

            <p>
                Select Lecture and Test
            </p>

        </div>

    `;


    Object.keys(course.lectures)
        .forEach(
            function(lectureKey) {

                const lecture =
                    course.lectures[
                        lectureKey
                    ];


                html += `

                    <div
                        class="question"
                    >

                        <h2>
                            📚 ${lecture.title}
                        </h2>

                        <div
                            style="
                                display:grid;
                                gap:10px;
                            "
                        >

                `;


                Object.keys(
                    lecture.tests
                ).forEach(
                    function(testKey) {

                        const test =
                            lecture.tests[
                                testKey
                            ];


                        html += `

                            <button
                                class="submit-btn"
                                style="
                                    background:#2563eb;
                                "
                                onclick="
                                    openTest(
                                        '${lectureKey}',
                                        '${testKey}'
                                    )
                                "
                            >

                                📝 Test ${testKey}

                                <span
                                    style="
                                        font-size:14px;
                                        opacity:.9;
                                    "
                                >
                                    (${test.duration} min)
                                </span>

                            </button>

                        `;

                    }
                );


                html += `

                        </div>

                    </div>

                `;

            }
        );


    area.innerHTML =
        html;

}


/* =========================================================
   OPEN TEST
   ========================================================= */

window.openTest =
    function(
        lecture,
        test
    ) {

        window.location.href =
            "test.html?course=" +
            encodeURIComponent(
                courseId
            ) +
            "&lecture=" +
            encodeURIComponent(
                lecture
            ) +
            "&test=" +
            encodeURIComponent(
                test
            );

    };


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
                JSON.parse(
                    stored
                );

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
                    00:00
                </strong>

            </div>

        </div>

        <form id="testForm">

    `;


    currentTest.questions.forEach(
        function(
            question,
            index
        ) {

            html += `

                <div class="question">

                    <h3>
                        Q${index + 1}.
                        ${question.question}
                    </h3>

            `;


            question.options.forEach(
                function(
                    option,
                    optionIndex
                ) {

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
                        new Event(
                            "submit"
                        )
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
        function(
            question,
            index
        ) {

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
                score /
                total *
                100
            ).toFixed(2)
            : "0.00";


    /* =====================================================
       UNIQUE RESULT ID
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


        /*
         * FIRST ATTEMPT ONLY
         */

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
                Calculating Rank...
            </div>

        </div>


        <div
            class="leaderboard"
        >

            <h2>
                🏆 First Attempt Leaderboard
            </h2>

            <div
                id="leaderboardList"
            >
                Loading...
            </div>

        </div>

        <h2>
            Solutions & Explanations
        </h2>

    `;


    currentTest.questions.forEach(
        function(
            question,
            qIndex
        ) {

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
                function(
                    option,
                    optionIndex
                ) {

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


        const currentTestId =
            courseId +
            "-lecture-" +
            lectureId +
            "-test-" +
            testNumber;


        const results = [];


        snapshot.forEach(
            function(resultDoc) {

                const data =
                    resultDoc.data();


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


        results.sort(
            function(a, b) {

                const difference =
                    Number(b.score) -
                    Number(a.score);


                if (
                    difference !== 0
                ) {

                    return difference;

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


        let html = "";


        results.forEach(
            function(
                result,
                index
            ) {

                const name =
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


                if (index === 0) {

                    rankText =
                        "🥇 #1";

                } else if (index === 1) {

                    rankText =
                        "🥈 #2";

                } else if (index === 2) {

                    rankText =
                        "🥉 #3";

                }


                const isMe =
                    result.uid ===
                    currentUser.uid;


                html += `

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
                            ${name}
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


        if (leaderboardList) {

            leaderboardList.innerHTML =
                html ||
                "<p>No results yet.</p>";

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

            leaderboardList.textContent =
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
