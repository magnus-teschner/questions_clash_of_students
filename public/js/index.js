const selector_questions = document.querySelector('#question-selector');
const question = document.querySelector('.question');
const absenden_button = document.querySelector('#confirm');

const question_content = document.querySelector('#question-content');
const answerA = document.querySelector('#answerA');
const answerB = document.querySelector('#answerB');
const answerC = document.querySelector('#answerC');
const answerD = document.querySelector('#answerD');



selector_questions.addEventListener('change', (e) => console.log(e.target.value));
absenden_button.addEventListener('click', () => {
    let question = {
        frage: question_content.value,
        a : answerA.value,
        b : answerB.value,
        c : answerC.value,
        d : answerD.value,
    }
    console.log(question);

    fetch('/submit_question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),

    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
})



