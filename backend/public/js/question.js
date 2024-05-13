
const elements = [
    document.querySelector('#multiple-choice'),
    document.querySelector('#multiple-choice-image'),
    document.querySelector('#image-description'),
    document.querySelector('#text-description')
  ];
  

  function removeClassFromAll(className) {
    elements.forEach(element => {
      element.classList.remove(className);
    });
  }
  
  elements.forEach(element => {
    element.addEventListener('click', function() {
      removeClassFromAll('selected-mode');
      this.classList.add('selected-mode');
    });
  });
  

const multiple_choice = document.querySelector('#multiple-choice');
const multiple_choice_image = document.querySelector('#multiple-choice-image');
const image_description = document.querySelector('#image-description');
const text_description = document.querySelector('#text-description');

multiple_choice.addEventListener('click', () => {
    const image_uploader = document.querySelector('#file-upload');
    image_uploader.style.display = "none";
    const elements = [
        document.querySelector('#answer2'),
        document.querySelector('#answer3'),
        document.querySelector('#answer4'),
      ];

    elements.forEach(element => {
        element.style.display = "flex";
    });

    const answerA = document.querySelector('#answer1');
    answerA.style.width = "340px";

    const inputA = document.querySelector('#inputA');
    inputA.style.width = "175px";

    const textA = document.querySelector('#answer1 .in-box-p');
    textA.textContent = "Answer A";

    const rightAnswer = document.querySelector('#correct_answer_selector');
    rightAnswer.style.display = "flex";
})


multiple_choice_image.addEventListener('click', () => {
    const image_uploader = document.querySelector('#file-upload');
    image_uploader.style.display = "flex";
    const elements = [
        document.querySelector('#answer2'),
        document.querySelector('#answer3'),
        document.querySelector('#answer4'),
      ];

    elements.forEach(element => {
        element.style.display = "flex";
    });

    const answerA = document.querySelector('#answer1');
    answerA.style.width = "340px";

    const inputA = document.querySelector('#inputA');
    inputA.style.width = "175px";

    const textA = document.querySelector('#answer1 .in-box-p');
    textA.textContent = "Answer A";

    const rightAnswer = document.querySelector('#correct_answer_selector');
    rightAnswer.style.display = "flex";
})


image_description.addEventListener('click', () => {

    const image_uploader = document.querySelector('#file-upload');
    image_uploader.style.display = "flex";
    const elements = [
        document.querySelector('#answer2'),
        document.querySelector('#answer3'),
        document.querySelector('#answer4'),
      ];

    elements.forEach(element => {
        element.style.display = "none";
    });

    const answerA = document.querySelector('#answer1');
    answerA.style.width = "100%";

    const inputA = document.querySelector('#inputA');
    inputA.style.width = "80%";

    const textA = document.querySelector('#answer1 .in-box-p');
    textA.textContent = "Answer";

    const rightAnswer = document.querySelector('#correct_answer_selector');
    rightAnswer.style.display = "none";
    
})

text_description.addEventListener('click', () => {

    const image_uploader = document.querySelector('#file-upload');
    image_uploader.style.display = "none";
    const elements = [
        document.querySelector('#answer2'),
        document.querySelector('#answer3'),
        document.querySelector('#answer4'),
      ];

    elements.forEach(element => {
        element.style.display = "none";
    })

    const answerA = document.querySelector('#answer1');
    answerA.style.width = "100%";

    const inputA = document.querySelector('#inputA');
    inputA.style.width = "80%";

    const textA = document.querySelector('#answer1 .in-box-p');
    textA.textContent = "Answer";

    const rightAnswer = document.querySelector('#correct_answer_selector');
    rightAnswer.style.display = "none";
    
})


const checkboxes = document.querySelectorAll('.correct-checkbox-class');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            checkboxes.forEach((item) => {
                if (item !== checkbox) {
                    item.disabled = true;
                }
            });
        } else {
            checkboxes.forEach(function(item) {
                item.disabled = false;
            });
        }
    });
});
