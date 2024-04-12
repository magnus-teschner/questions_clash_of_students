const send_button = document.querySelector('#confirm-button');

async function getImageBlobFromImgTag(imgElement) {
    if (!imgElement || !imgElement.src) {
      throw new Error('Invalid or missing image element.');
    }
    
    try {
      // Fetch the image from its src URL
      const response = await fetch(imgElement.src);
      if (!response.ok) {
        throw new Error(`Network response was not ok for ${imgElement.src}`);
      }
      
      // Convert the response to a Blob
      const imageBlob = await response.blob();
      return imageBlob;
    } catch (error) {
      console.error('Error fetching image Blob:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

async function uploadImage(blob, json_question) {
    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('image', blob);
    formData.append('json', json_question)
  
    try {
      // Send the POST request to the server endpoint with the FormData
      const response = await fetch('http://localhost:3000/upload/', {
        method: 'POST',
        body: formData
      });
  
      // Handle the response from the server
      if (response.ok) {
        const result = await response.json();
        console.log(result.id)
        //console.log('File uploaded successfully:', result);
      } else {
        console.error('File upload failed:', response.statusText);
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error('Error during the upload:', error);
    }
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

    const course = document.querySelector('#dropbtn-course');
    const lection = document.querySelector('#dropbtn-lection');
    const position = document.querySelector('#dropbtn-position');

    if (course.textContent == "Course"){
        alert("Please select course!");
        return
    } else if (lection.textContent == "Lection"){
        alert("Please select lection!");
        return
    } else if (position.textContent == "Position"){
        alert("Please select position!");
        return
    } 

    if (multiple_choice_image.classList.contains('selected-mode') == true){
        if (optionA.checked) {
            correct_answer = inputA.value;
        } else if (optionB.checked) {
            correct_answer = inputB.value;
        } else if (optionC.checked) {
            correct_answer = inputC.value;
        } else if (optionD.checked) {
            correct_answer = inputD.value;
        }

        if (typeof correct_answer === 'undefined'){
            alert("Select correct answer!");
            return

        }

        let lection_text = lection.textContent;
        let position_text = position.textContent;
        const lection_split = lection_text.split(" ");
        const position_split = position_text.split(" ");
        let question = {
            frage: question_content.value,
            a : inputA.value,
            b : inputB.value,
            c : inputC.value,
            d : inputD.value,
            correct_answer: correct_answer,
            course: course.textContent,
            lection: lection_split[lection_split.length -1],
            position: position_split[position_split.length -1]
        }

        console.log(question);
        const img_tag = document.querySelector('#image-drop');
        getImageBlobFromImgTag(img_tag).
        then(imageBlob => {
            uploadImage(imageBlob, JSON.stringify({ question }));

    });
    }

    if (multiple_choice.classList.contains('selected-mode') == true){
      if (optionA.checked) {
          correct_answer = inputA.value;
      } else if (optionB.checked) {
          correct_answer = inputB.value;
      } else if (optionC.checked) {
          correct_answer = inputC.value;
      } else if (optionD.checked) {
          correct_answer = inputD.value;
      }
      if (typeof correct_answer === 'undefined'){
        alert("Select correct answer!");
        return
    }
    
      let lection_text = lection.textContent;
      let position_text = position.textContent;
      const lection_split = lection_text.split(" ");
      const position_split = position_text.split(" ");
      let question = {
          frage: question_content.value,
          a : inputA.value,
          b : inputB.value,
          c : inputC.value,
          d : inputD.value,
          correct_answer: correct_answer,
          course: course.textContent,
          lection: lection_split[lection_split.length -1],
          position: position_split[position_split.length -1],
          image: null
      }

      const response =  fetch('http://localhost:3000/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      }).then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => console.error('Error:', error));

  
    }

    if (image_description.classList.contains('selected-mode') == true){

      correct_answer = inputA.value;

      if (typeof correct_answer === 'undefined'){
          alert("Enter an answer!");
          return

      }

      let lection_text = lection.textContent;
      let position_text = position.textContent;
      const lection_split = lection_text.split(" ");
      const position_split = position_text.split(" ");
      let question = {
          frage: question_content.value,
          a : inputA.value,
          b : null,
          c : null,
          d : null,
          correct_answer: correct_answer,
          course: course.textContent,
          lection: lection_split[lection_split.length -1],
          position: position_split[position_split.length -1]
      }

      console.log(question);
      const img_tag = document.querySelector('#image-drop');
      getImageBlobFromImgTag(img_tag).
      then(imageBlob => {
          uploadImage(imageBlob, JSON.stringify({ question }));

      });
    }

    if (text_description.classList.contains('selected-mode') == true){
      correct_answer = inputA.value;
      if (typeof correct_answer === 'undefined'){
        alert("Enter an answer!");
        return
    }
    
      let lection_text = lection.textContent;
      let position_text = position.textContent;
      const lection_split = lection_text.split(" ");
      const position_split = position_text.split(" ");
      let question = {
          frage: question_content.value,
          a : inputA.value,
          b : null,
          c : null,
          d : null,
          correct_answer: correct_answer,
          course: course.textContent,
          lection: lection_split[lection_split.length -1],
          position: position_split[position_split.length -1],
          image: null
      }

      const response =  fetch('http://localhost:3000/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      }).then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => console.error('Error:', error));

  
    }
    
})