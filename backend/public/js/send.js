const send_button = document.querySelector('#confirm-button');

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
      throw error; // Re-throw the error to be handled by the caller
    }
  }

async function uploadImageQuestion(blob, question) {
    const formData = new FormData();
    formData.append('image', blob);
    formData.append('json', question)
  
    try {
      // Send the POST request to the server endpoint with the FormData
      const response = await fetch(`http://localhost:80/upload_min/`, {
        method: 'POST',
        body: formData
      });
  
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error('Error during the upload:', error);
    }
  }

  async function uploadQuestion(question) {
    console.log(question);
    const response =  fetch(`http://localhost:80/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: question
    }).then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
    
  }

send_button.addEventListener('click', (event) => {
    const multiple_choice = document.querySelector('#multiple-choice');
    const multiple_choice_image = document.querySelector('#multiple-choice-image');
    const image_description = document.querySelector('#image-description');
    const text_description = document.querySelector('#text-description');
    const question_content = document.querySelector('#frage');
    const inputA = document.querySelector('#inputA');
    const inputB = document.querySelector('#inputB');
    const inputC = document.querySelector('#inputC');
    const inputD = document.querySelector('#inputD');
    const optionA = document.querySelector('#optionA');
    const optionB = document.querySelector('#optionB');
    const optionC = document.querySelector('#optionC');
    const optionD = document.querySelector('#optionD');
    const beforeUpload= document.querySelector("#before-upload");
    const afterUpload = document.querySelector("#after-upload");
    const course = document.querySelector('#dropbtn-course');
    const lection = document.querySelector('#dropbtn-lection');
    const position = document.querySelector('#dropbtn-position');

    function checkDropdown(dropdown, message){
      if (dropdown.textContent === "Course" || dropdown.textContent === "Lection" || dropdown.textContent === "Position") {
        alert(message);
        return true;
      }
      return false;

      
    };

  function setCorrectAnswer(){
    if (optionA.checked) {
      return inputA.value;
    } else if (optionB.checked) {
      return inputB.value;
    } else if (optionC.checked) {
      return inputC.value;
    } else if (optionD.checked) {
      return inputD.value;
    }
  }

  function create_question_json_multiple(type, correct_answer){
    let lection_text = lection.textContent;
    let position_text = position.textContent;
    const lection_split = lection_text.split(" ");
    const position_split = position_text.split(" ");
    let question = {
        frage: question_content.value,
        type: type,
        a : inputA.value,
        b : inputB.value,
        c : inputC.value,
        d : inputD.value,
        correct_answer: correct_answer,
        course: course.textContent,
        lection: lection_split[lection_split.length -1],
        position: position_split[position_split.length -1]
    }
    return question
  }

  function create_question_json_single_answer(type, correct_answer){
    let lection_text = lection.textContent;
    let position_text = position.textContent;
    const lection_split = lection_text.split(" ");
    const position_split = position_text.split(" ");
    let question = {
        frage: question_content.value,
        type: type,
        a : inputA.value,
        b : null,
        c : null,
        d : null,
        correct_answer: correct_answer,
        course: course.textContent,
        lection: lection_split[lection_split.length -1],
        position: position_split[position_split.length -1]
    }

    return question
  }

  function cleanUp(){
    const inputs = [
      document.querySelector('#frage'),
      document.querySelector('#inputA'),
      document.querySelector('#inputB'),
      document.querySelector('#inputC'),
      document.querySelector('#inputD')
    ]
    inputs.forEach((element) => {
      element.value = '';
    })
  
    const checkboxes = document.querySelectorAll('.correct-checkbox-class');
    checkboxes.forEach((item) => {
      item.disabled = false;
      item.checked = false;
    })
  }

  if (checkDropdown(course, "Please select course!") ||
      checkDropdown(lection, "Please select lection!") ||
      checkDropdown(position, "Please select position!")) {
      return;
  }

  if (multiple_choice_image.classList.contains('selected-mode') == true){
      let correct_answer = setCorrectAnswer();

      if (typeof correct_answer === 'undefined'){
          alert("Select correct answer!");
          return
      }

      let question = create_question_json_multiple("multiple-choice-image",correct_answer);
      const img_tag = document.querySelector('#image-drop');
      getImageBlobFromImgTag(img_tag).
      then(imageBlob => {
          uploadImageQuestion(imageBlob, JSON.stringify({ question }));

  });
    afterUpload.style.display = "none";
    beforeUpload.style.display = "flex";
  }

  if (multiple_choice.classList.contains('selected-mode') == true){
    let correct_answer = setCorrectAnswer();

    if (typeof correct_answer === 'undefined'){
        alert("Select correct answer!");
        return
    }
  
    let question = create_question_json_multiple("multiple-choice", correct_answer);
    uploadQuestion(JSON.stringify({ question }));
  }

  if (image_description.classList.contains('selected-mode') == true){
    correct_answer = inputA.value;
    if (typeof correct_answer === 'undefined'){
        alert("Enter an answer!");
        return

    }
    let question = create_question_json_single_answer("image-description", correct_answer);
    const img_tag = document.querySelector('#image-drop');
    getImageBlobFromImgTag(img_tag).
    then(imageBlob => {
        uploadImageQuestion(imageBlob, JSON.stringify({ question }));
    afterUpload.style.display = "none";
    beforeUpload.style.display = "flex";
    });
  }

  if (text_description.classList.contains('selected-mode') == true){
    correct_answer = inputA.value;
    if (typeof correct_answer === 'undefined'){
      alert("Enter an answer!");
      return
  }
    let question = create_question_json_single_answer("text-description", correct_answer);
    uploadQuestion(JSON.stringify({ question }));
  }
  cleanUp();  
})