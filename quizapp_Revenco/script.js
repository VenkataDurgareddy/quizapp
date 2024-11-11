let timer;
let timeLeft = 1800;
let currentSection = 0;
const sections = [
    {
        id: 1,
        questions: [
            {
                type: "radio",
                question: "What is your gender?",
                options: ["Male", "Female", "Prefer not to disclose"],
                branching: {
                    "Male": ["What is your age?", "What is your occupation?"],
                    "Female": ["What is your age?", "What is your occupation?"],
                    "Prefer not to disclose": []
                }
            },
            {
                type: "checkbox",
                question: "Which of these hobbies do you enjoy?",
                options: ["Reading", "Traveling", "Cooking", "Sports"]
            },
            {
                type: "text",
                question: "Please describe your favorite hobby.",
            }
        ]
    },
    {
        id: 2,
        questions: [
            {
                type: "radio",
                question: "How often do you exercise?",
                options: ["Daily", "Weekly", "Monthly", "Rarely"]
            },
            {
                type: "checkbox",
                question: "Which types of exercise do you do regularly?",
                options: ["Running", "Yoga", "Weightlifting", "Cycling"]
            },
            {
                type: "text",
                question: "What motivates you to stay active?",
            }
        ]
    },
    {
        id: 3,
        questions: [
            {
                type: "radio",
                question: "How would you rate your dietary habits?",
                options: ["Very healthy", "Somewhat healthy", "Unhealthy"]
            },
            {
                type: "checkbox",
                question: "Which types of food do you prefer?",
                options: ["Vegetarian", "Non-vegetarian", "Vegan", "Gluten-free"]
            },
            {
                type: "text",
                question: "Any specific dietary preferences?",
            }
        ]
    }
];


function startSurvey() {
    document.getElementById("start-btn").classList.add("hidden");
    document.getElementById("questionnaire").classList.remove("hidden");
    startTimer();
    loadSection();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        displayTime();
        if (timeLeft === 60) alert("One minute left!");
        if (timeLeft === 0) endSurvey();
    }, 1000);
}

function displayTime() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function loadSection() {
    const questionsContainer = document.getElementById("questions-container");
    questionsContainer.innerHTML = "";
    const section = sections[currentSection];
    
    section.questions.forEach(question => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = `<p>${question.question}</p>`;
        
        if (question.type === "radio" || question.type === "checkbox") {
            question.options.forEach(option => {
                const input = document.createElement("input");
                input.type = question.type;
                input.name = question.question;
                input.value = option;
                const label = document.createElement("label");
                label.textContent = option;
                questionDiv.appendChild(input);
                questionDiv.appendChild(label);
                questionDiv.appendChild(document.createElement("br"));
            });
        } else if (question.type === "text") {
            const input = document.createElement("input");
            input.type = "text";
            questionDiv.appendChild(input);
        }
        
        questionsContainer.appendChild(questionDiv);
    });
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        loadSection();
    } else {
        document.getElementById("next-section-btn").classList.add("hidden");
        document.getElementById("submit-btn").classList.remove("hidden");
    }
}

function submitSurvey() {
    document.getElementById("questionnaire").classList.add("hidden");
    document.getElementById("review").classList.remove("hidden");
    const consentCheckbox = document.getElementById("consent-checkbox");
    consentCheckbox.addEventListener("change", () => {
        document.getElementById("final-submit-btn").classList.toggle("hidden", !consentCheckbox.checked);
    });
}

function finalSubmit() {
    const confirmation = confirm("Are you sure you want to submit your responses?");
    if (confirmation) {
        clearInterval(timer);
        document.getElementById("review").classList.add("hidden");
        document.getElementById("success-message").classList.remove("hidden");
        alert("Thank you for submitting the questionnaire!");
    } else {
        alert("Submission canceled. Please review your answers.");
    }
}

function endSurvey() {
    alert("Time's up! Submitting your responses automatically.");
    submitSurvey();
}

function downloadPDF() {
    document.getElementById("loading-spinner").classList.remove("hidden");
    setTimeout(() => {
        const element = document.getElementById("review-content");
        html2pdf()
            .from(element)
            .set({
                margin: 1,
                filename: 'survey_responses.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            })
            .save()
            .then(() => {
                document.getElementById("loading-spinner").classList.add("hidden");
                alert("PDF downloaded with your responses.");
            })
            .catch(() => {
                document.getElementById("loading-spinner").classList.add("hidden");
                alert("An error occurred while generating the PDF.");
            });
    }, 1000);
}
