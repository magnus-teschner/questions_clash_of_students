document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    const modal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close-btn');
    const saveButton = document.querySelector('#save-btn');
    const cancelButton = document.querySelector('#cancel-btn');
    
    let currentRow;

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentRow = event.target.closest('tr');
            openModal(currentRow);
        });
    });

    closeModal.addEventListener('click', () => {
        closeModalFunction();
    });

    saveButton.addEventListener('click', () => {
        saveChanges(currentRow);
        closeModalFunction();
    });

    cancelButton.addEventListener('click', () => {
        closeModalFunction();
    });


    uploadDiv.addEventListener("click", (e) => {
        e.preventDefault();
        newImageUpload.click();
    });

    uploadDiv.addEventListener("dragover", (e) => {
        e.preventDefault();

    });
    
    uploadDiv.addEventListener("drop", (e) => {
        console.log("drop");
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadNewImage(e.dataTransfer.files[0]);
        }
    });

    newImageUpload.addEventListener("change", (e) => {
        e.preventDefault();
        uploadNewImage(e.target.files[0]);
    });

    const questionTypeSelector = document.querySelector('#edit-question-type');
    questionTypeSelector.addEventListener('change', function(event) {
        const questionType = event.target.value;
        deactivateAfterType(questionType);
    });



    function removeClass(class_name){
        document.getElementById('answerBModal').classList.remove(class_name);
        document.getElementById('answerCModal').classList.remove(class_name);
        document.getElementById('answerDModal').classList.remove(class_name);
        document.getElementById('correctAnswerModal').classList.remove(class_name);
        document.querySelector('#image-field-modal').style.display = 'flex';
    }

    function addClass(class_name){
        document.getElementById('answerBModal').classList.add(class_name);
        document.getElementById('answerCModal').classList.add(class_name);
        document.getElementById('answerDModal').classList.add(class_name);
        document.getElementById('correctAnswerModal').classList.add(class_name);

    }

    function deactivateAfterType(type) {
        switch (type){
            case 'multiple-choice-image':
                removeClass('hidden');
                break;
            case 'multiple-choice':
                removeClass('hidden');
                document.querySelector('#image-field-modal').style.display = 'none';
                break;
            case 'image-description':
                addClass('hidden');
                document.querySelector('#image-field-modal').style.display = 'flex';
                break;
            case 'text-description':
                addClass('hidden');
                document.querySelector('#image-field-modal').style.display = 'none';
                break;

        }
    }

    function openModal(row) {
        const id = row.cells[0].innerText;
        const questionType = row.cells[1].innerText;
        const question = row.cells[2].innerText;
        const answerA = row.cells[3].innerText;
        const answerB = row.cells[4].innerText;
        const answerC = row.cells[5].innerText;
        const answerD = row.cells[6].innerText;
        const correctAnswer = row.cells[7].innerText;
        const program = row.cells[8].innerText;
        const course = row.cells[9].innerText;
        const lection = row.cells[10].innerText;
        const position = row.cells[11].innerText;
        const image_url = row.cells[12].querySelector('.store-url').innerText;
        const image = document.querySelector('#img-modal');

        document.getElementById('edit-question-type').value = questionType;
        document.getElementById('edit-question').value = question;
        document.getElementById('edit-answer-a').value = answerA;
        document.getElementById('edit-answer-b').value = answerB;
        document.getElementById('edit-answer-c').value = answerC;
        document.getElementById('edit-answer-d').value = answerD;
        document.getElementById('edit-correct-answer').value = correctAnswer;
        document.getElementById('edit-program').value = program;
        document.getElementById('edit-course').value = course;
        document.getElementById('edit-lection').value = lection;
        document.getElementById('edit-position').value = position;
        document.getElementById('id-container').innerText = id;

        deactivateAfterType(questionType);

        if (image_url !== 'N/A'){
            image.src = `http://localhost:9000/images-questions-bucket/${image_url}`;
            
        } else {
            image.src = 'none';
        };

        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        document.getElementById('main-container').classList.add('modal-bg-blur');
    }

    function closeModalFunction() {
        document.body.classList.remove('modal-open');
        document.getElementById('main-container').classList.remove('modal-bg-blur');
        modal.classList.add('hidden');
    }

    function saveChanges(row) {
        
        row.cells[1].innerText = document.getElementById('edit-question-type').value;
        row.cells[2].innerText = document.getElementById('edit-question').value;
        row.cells[3].innerText = document.getElementById('edit-answer-a').value;
        row.cells[4].innerText = document.getElementById('edit-answer-b').value;
        row.cells[5].innerText = document.getElementById('edit-answer-c').value;
        row.cells[6].innerText = document.getElementById('edit-answer-d').value;
        row.cells[7].innerText = document.getElementById('edit-correct-answer').value;
        row.cells[8].innerText = document.getElementById('edit-program').value;
        row.cells[9].innerText = document.getElementById('edit-course').value;
        row.cells[10].innerText = document.getElementById('edit-lection').value;
        row.cells[11].innerText = document.getElementById('edit-position').value;

        let type_selector_value = document.getElementById('edit-question-type').value
        if (type_selector_value === 'multiple-choice' || type_selector_value === 'text-description'){
            row.cells[12].querySelector('.store-url').innerText = '';
            row.cells[12].querySelector('.row-image').src = '';
            row.cells[12].querySelector('.row-image').classList.add('hidden');

        } else {
            row.cells[12].querySelector('.store-url').innerText = document.querySelector('#img-modal').src;
            row.cells[12].querySelector('.row-image').src = document.querySelector('#img-modal').src;
            row.cells[12].querySelector('.row-image').classList.remove('hidden');

        }
    }


    function uploadNewImage(file) {
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            document.querySelector('#img-modal').src = blobUrl;
        }
    }
    

});


document.addEventListener("DOMContentLoaded", function() {
    const profileBtn = document.getElementById("profile-btn");
    const profileOptions = document.getElementById("profile-options");
  
    profileBtn.addEventListener("click", function() {
        if (profileOptions.classList.contains("hidden")) {
            profileOptions.classList.remove("hidden");
            profileOptions.style.display = "flex";
        } else {
            profileOptions.classList.add("hidden");
            profileOptions.style.display = "none";
        }
    });
  
    // Hide the profile options when clicking outside
    document.addEventListener("click", function(event) {
        if (!profileBtn.contains(event.target) && !profileOptions.contains(event.target)) {
            profileOptions.classList.add("hidden");
            profileOptions.style.display = "none";
        }
    });
  });
  