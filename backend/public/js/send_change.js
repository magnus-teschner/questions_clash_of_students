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
    formData.append('json', question)

  
    try {
      const response = await fetch(`/update_img`, {
        method: 'POST',
        body: formData
      });
  
    } catch (error) {
      console.error('Error during the upload:', error);
    }
  }

  async function uploadQuestion(question) {
    try {
      const response = await fetch(`/update`, {
        method: 'POST',
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
    const id = document.querySelector('#id-container').innerText;
    const type = document.querySelector('#edit-question-type').value;
    const question_text = document.querySelector('#edit-question').value;
    const answerA = document.querySelector('#edit-answer-a').value;
    const answerB = document.querySelector('#edit-answer-b').value;
    const answerC = document.querySelector('#edit-answer-c').value;
    const answerD = document.querySelector('#edit-answer-d').value;
    const correct_answer = document.querySelector('#edit-correct-answer').value;
    const course = document.querySelector('#edit-course').value;
    const lection = document.querySelector('#edit-lection').value;
    const position = document.querySelector('#edit-position').value;
    const image = document.querySelector('#img-modal');



  function create_question_json_multiple(){
    let question = {
        id: id,
        frage: question_text,
        type: type,
        a : answerA,
        b : answerB,
        c : answerC,
        d : answerD,
        correct_answer: correct_answer,
        course: course,
        lection: lection,
        position: position
    }
    return question
  }

  function create_question_json_single_answer(){
    let question = {
        id: id,
        frage: question_text,
        type: type,
        a : answerA,
        b : null,
        c : null,
        d : null,
        correct_answer: answerA,
        course: course,
        lection: lection,
        position: position
    }

    return question
  }
  let question;
  switch(type) {
    case 'multiple-choice-image':
        question = create_question_json_multiple();
        getImageBlobFromImgTag(image).
        then(imageBlob => {
            uploadImageQuestion(imageBlob, JSON.stringify({ question }));
  
        });
        break;

    case 'multiple-choice':
        question = create_question_json_multiple();
        uploadQuestion(JSON.stringify({ question }));
        break;

    case 'image-description':
        question = create_question_json_single_answer();
        getImageBlobFromImgTag(image).
        then(imageBlob => {
            uploadImageQuestion(imageBlob, JSON.stringify({ question }));
  
        });
        break;

    case 'text-description':
        question = create_question_json_single_answer();
        uploadQuestion(JSON.stringify({ question }));
        break;

  }
})