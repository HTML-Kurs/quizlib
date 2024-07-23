const quiz = document.getElementById('quiz');


async function loadDoc(name) {
    const response = await fetch(`./quizlibary/${name}`);
    const data = await response.text();
    return data;
}


function loadQuestionsFromText(text) {
    var questions = text.replace("\r", "").split('\r\n\r\n');

    if (questions.length == 1) {
        questions = questions[0].split('\n\n');
    }

    console.log(text);

    console.log(questions);

    return questions.map((question) => {
        const lines = question.split('\n');
        const questionText = lines[0];
        const answers = lines.slice(1);
        return {
            question: questionText,
            answers: answers.map((answer) => {
                return {
                    answer: answer.replace('*', ''),
                    isCorrect: answer.startsWith('*')
                }
            })
        };
    });

}

var questions = [];

async function loadInQuiz() {

    const questionTemplate = await loadDoc('question.html');
    const optionTemplate = await loadDoc('option.html');

    const questionsText = await loadDoc('questions.txt');

    questions = loadQuestionsFromText(questionsText);

    quiz.innerHTML = '';

    questions.forEach((question, index) => {

        var innerOptions = '';
        question.answers.forEach((answer, index) => {
            innerOptions += optionTemplate.replace('ANSWER', answer.answer).replace('CORRECT', answer.isCorrect);
        });

        const questionElement = questionTemplate.replace('QUESTION', question.question).replace('OPTIONS', innerOptions);

        quiz.innerHTML += questionElement;

    });


}

function checkAnswer(correct, element) {
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
    }

}



loadInQuiz();