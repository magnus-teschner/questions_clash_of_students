const send_button = document.querySelector('#save-btn');

async function getImageBlobFromImgTag(imgElement) {
  if (!imgElement || !imgElement.src) {
    throw new Error('Invalid or missing image element.');
  }

  try {
    const response = await fetch(imgElement.src);
    if (!response.ok) {
      throw new Error(`Network response was not ok for ${imgElement.src}`);
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error('Error fetching image Blob:', error);
    throw error;
  }
}

async function uploadImageQuestion(blob, question) {
  const formData = new FormData();
  formData.append('image', blob);
  formData.append('questionData', question)


  try {
    const response = await fetch(`/question`, {
      method: 'PUT',
      body: formData
    });

  } catch (error) {
    console.error('Error during the upload:', error);
  }
}

async function uploadQuestion(question) {
  try {
    const response = await fetch(`/question`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: question
    });

  } catch (error) {
    console.error('Error during the upload:', error);
  }
}

send_button.addEventListener('click', (event) => {
  const id = document.querySelector('#id-container').innerText.trim();
  const type = document.querySelector('#edit-question-type').value;
  const question_text = document.querySelector('#edit-question').value;
  const answerA = document.querySelector('#edit-answer-a').value;
  const answerB = document.querySelector('#edit-answer-b').value;
  const answerC = document.querySelector('#edit-answer-c').value;
  const answerD = document.querySelector('#edit-answer-d').value;
  const correct_answer = document.querySelector('#edit-correct-answer').value;
  const image = document.querySelector('#img-modal');



  function create_question_json_multiple() {
    let question = {
      question_id: id,
      frage: question_text,
      question_type: type,
      answer_a: answerA,
      answer_b: answerB,
      answer_c: answerC,
      answer_d: answerD,
      correct_answer: correct_answer
    }
    return question
  }


  function create_question_json_single_answer() {
    let question = {
      question_id: id,
      frage: question_text,
      question_type: type,
      answer_a: answerA,
      answer_b: null,
      answer_c: null,
      answer_d: null,
      correct_answer: answerA
    }

    return question
  }
  let question;
  switch (type) {
    case 'multiple-choice-image':
      question = create_question_json_multiple();
      getImageBlobFromImgTag(image).
        then(imageBlob => {
          uploadImageQuestion(imageBlob, JSON.stringify(question));

        });
      break;

    case 'multiple-choice':
      question = create_question_json_multiple();
      uploadQuestion(JSON.stringify(question));
      break;

    case 'image-description':
      question = create_question_json_single_answer();
      getImageBlobFromImgTag(image).
        then(imageBlob => {
          uploadImageQuestion(imageBlob, JSON.stringify(question));

        });
      break;

    case 'text-description':
      question = create_question_json_single_answer();
      uploadQuestion(JSON.stringify(question));
      break;

  }
})