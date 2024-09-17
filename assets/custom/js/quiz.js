const QUESTIONS = [
    {
        label: 'How old are you?',
        answers: ['18-25', '25-35', '35-45', '45-55', '55+'],
    },
    {
        label: 'What are your financial objectives?',
        answers: [
            'Build a financial safety net for emergencies',
            'Ensure support for you and your family',
            'Achieve financial independence',
            'Remodel or purchase a home',
        ],
    },
    {
        label: 'Which option would you feel most comfortable with?',
        answers: [
            'Gold mining stocks',
            'Physical gold bars or coins',
            'Gold exchange-traded funds (ETFs)',
            'Gold futures contracts',
            'Gold jewelry',
        ],
    },
    {
        label: 'Which factor would influence to buy or sell?',
        answers: [
            'Rising inflation rates',
            'Global political events',
            'Stock market fluctuations',
        ],
    },
    {
        label: 'How likely are you to consider adding gold to your portfolio?',
        answers: ['Very likely', 'Likely', 'Neutral', 'Unlikely', 'Never'],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="quiz-content">
                <div class="content">
                    <h2 class="title">Master the Art of Gold Investing in South Africa</h2>
                    <h4 class="sub-title">Test Your Knowledge on Gold Investment Strategies and Trends</h4>
                    <h5>Explore the dynamic world of gold investing in South Africa with our engaging quiz.</h5>
                    <button class="btn btn-primary w-100 py-3 first-button" data-action="startQuiz">Start</button>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">

            <div class="quiz-content text-center quiz-start">
                <div class="question-wrapper">
                    <div class="" style="width: 100%; padding-left: 20px; padding-right: 20px">
                        <div class="progress" style="padding-left: 0 !important; padding-right: 0 !important;">
                            <div class="progress-bar" style="width: ${questionsStep.getProgress()}%"></div>
                        </div>
                    </div>

                    <h3 class="question mt-4">${question.label}</h3>
                </div>

                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `
                                <button class="answer border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>
                            `,
                        )
                        .join('')}
                </div>
            </div>
        </div>
      `;
    },
    getProgress: () =>
        Math.floor((questionsStep.questionIndex / QUESTIONS.length) * 100),
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'goToNextQuestion':
                return questionsStep.goToNextQuestion();
            case 'goToPreviousQuestion':
                return questionsStep.goToPreviousQuestion();
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    goToPreviousQuestion: () => {
        questionsStep.questionIndex -= 1;
        questionsStep.render();
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content form-content">
                <div class="col-lg-6 col-md-6 col-sm-12 form-block">
                    <h2 class="title">Form of communication</h2>
                    <h3 class="mb-4">Please fill out the feedback form</h3>
                    <form>
                        <input class="form-control" name="name" type="name" placeholder="Name" required>
                        <input class="form-control" name="Surname" type="name" placeholder="Surname" required>
                        <input class="form-control" name="email" type="email" placeholder="E-Mail" required>
                        <input class="form-control" name="phone" type="phone" placeholder="Phone" required>
                        <div id="checkbox">
                            <input type="checkbox">
                            <label>I agree with the <a class="form-link" href="terms-of-use.html">terms of use and the privacy policy</a></label>
                        </div>
                         <div id="checkbox">
                            <input type="checkbox" checked disabled>
                            <label>I agree to the email newsletter</label>
                        </div>

                        
                        ${Object.keys(quiz.answers)
                            .map(
                                (question) =>
                                    `<input name="${question}" value="${quiz.answers[question]}" hidden>`,
                            )
                            .join('')}
                
                        <button data-action="submitAnswers" class="btn btn-primary w-100 py-3 first-button">Send</button>
                    </form>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        const newPath = 'thanks.html';
        if (el.getAttribute('data-action') === 'submitAnswers') {
            localStorage.setItem('quizDone', true);
            document.getElementById('main-page').classList.remove('hide');
            document.getElementById('quiz-page').classList.add('hide');
            document.getElementById('footer').classList.add('hide');
            window.location.href = newPath;
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    document.getElementById('main-page').classList.add('hide');
    quiz.init();
    quiz.render();
}
