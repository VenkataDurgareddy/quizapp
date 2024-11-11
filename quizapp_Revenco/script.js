let timer;
let timeLeft = 30 * 60;
let interval;
let currentSection = 0;
const sections = [
    { question: "What is your favorite color?", options: ["Red", "Blue", "Green", "Yellow"] },
    { question: "What is your favorite animal?", options: ["Dog", "Cat", "Horse", "Elephant"] },
    { question: "What is your favorite food?", options: ["Pizza", "Sushi", "Burger", "Pasta"] },
];

let answers = [];

function startSurvey() {
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('questionnaire').classList.remove('hidden');
    showSection();
    startTimer();
}

function startTimer() {
    interval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(interval);
            alert("Time's up! Please submit the survey.");
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            timeLeft--;
        }
    }, 1000);
}

function showSection() {
    const section = sections[currentSection];
    const questionContainer = document.getElementById('questions-container');
    questionContainer.innerHTML = `
        <h2>${section.question}</h2>
        ${section.options.map(option => `
            <div class="option">
                <input type="radio" name="answer" value="${option}">
                <label>${option}</label>
            </div>
        `).join('')}
    `;
}

function nextSection() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert("Please select an answer.");
        return;
    }
    answers.push({ question: sections[currentSection].question, answer: selectedOption.value });
    currentSection++;
    if (currentSection >= sections.length) {
        document.getElementById('next-section-btn').classList.add('hidden');
        document.getElementById('submit-btn').classList.remove('hidden');
    } else {
        showSection();
    }
}

function submitSurvey() {
    clearInterval(interval);
    document.getElementById('questionnaire').classList.add('hidden');
    document.getElementById('review').classList.remove('hidden');
    generateReviewContent();
}

function generateReviewContent() {
    const reviewContent = document.getElementById('review-content');
    reviewContent.innerHTML = answers.map((answer, index) => `
        <p><strong>Q${index + 1}:</strong> ${answer.question}</p>
        <p><strong>Answer:</strong> ${answer.answer}</p>
    `).join('');
}

function toggleFinalSubmit() {
    const finalSubmitBtn = document.getElementById('final-submit-btn');
    finalSubmitBtn.classList.toggle('hidden', !document.getElementById('consent-checkbox').checked);
}

function finalSubmit() {
    document.getElementById('loading-spinner').classList.remove('hidden');
    setTimeout(() => {
        generatePDF();
        document.getElementById('loading-spinner').classList.add('hidden');
        document.getElementById('review').classList.add('hidden');
        document.getElementById('success-message').classList.remove('hidden');
    }, 3000);
}

function generatePDF() {
    const element = document.getElementById('review-content');
    html2pdf().from(element).save();
}
