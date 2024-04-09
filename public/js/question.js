
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
  