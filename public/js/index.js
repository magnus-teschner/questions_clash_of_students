const selector_questions = document.querySelector('#question-selector');
const question = document.querySelector('.question');
const absenden_button = document.querySelector('#confirm');

const question_content = document.querySelector('#question-content');
const answerA = document.querySelector('#answerA');
const answerB = document.querySelector('#answerB');
const answerC = document.querySelector('#answerC');
const answerD = document.querySelector('#answerD');



const question_entry_container = document.querySelector('#entry-container');

function delete_all_childs(container){
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function create_question_field(container){
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    const questionLabel = document.createTextNode('Frage: ');
    const questionTextArea = document.createElement('textarea');
    questionTextArea.id = 'question-content';
    questionTextArea.rows = 3;
    
    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionTextArea)
    container.appendChild(questionDiv);
}


function create_4_answers(container){
    // Answer Div
    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers';

    // Antwort-Gruppe 12
    const answer12Div = document.createElement('div');
    answer12Div.className = 'answer-12';
    const answer1Div = document.createElement('div');
    answer1Div.className = 'answer-1';
    const answerALabel = document.createTextNode('Answer A: ');
    const answerATextArea = document.createElement('textarea');
    answerATextArea.id = 'answerA';
    answerATextArea.rows = 2;
    answer1Div.appendChild(answerALabel);
    answer1Div.appendChild(answerATextArea);
    answer12Div.appendChild(answer1Div);

    const answer2Div = document.createElement('div');
    answer2Div.className = 'answer-2';
    const answerBLabel = document.createTextNode('Answer B: ');
    const answerBTextArea = document.createElement('textarea');
    answerBTextArea.id = 'answerB';
    answerBTextArea.rows = 2;
    answer2Div.appendChild(answerBLabel);
    answer2Div.appendChild(answerBTextArea);
    answer12Div.appendChild(answer2Div);

    // Antwort-Gruppe 34
    const answer34Div = document.createElement('div');
    answer34Div.className = 'answer-34';
    const answer3Div = document.createElement('div');
    answer3Div.className = 'answer-3';
    const answerCLabel = document.createTextNode('Answer C: ');
    const answerCTextArea = document.createElement('textarea');
    answerCTextArea.id = 'answerC';
    answerCTextArea.rows = 2;
    answer3Div.appendChild(answerCLabel);
    answer3Div.appendChild(answerCTextArea);
    answer34Div.appendChild(answer3Div);

    const answer4Div = document.createElement('div');
    answer4Div.className = 'answer-4';
    const answerDLabel = document.createTextNode('Answer D: ');
    const answerDTextArea = document.createElement('textarea');
    answerDTextArea.id = 'answerD';
    answerDTextArea.rows = 2;
    answer4Div.appendChild(answerDLabel);
    answer4Div.appendChild(answerDTextArea);
    answer34Div.appendChild(answer4Div);

    container.appendChild(answer12Div)
    container.appendChild(answer34Div)

}

create_question_field(question_entry_container);
create_4_answers(question_entry_container);


selector_questions.addEventListener('change', (e) => {
    delete_all_childs(question_entry_container);
    create_question_field(question_entry_container);
    create_4_answers(question_entry_container);
    console.log(e.target.value)});

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



