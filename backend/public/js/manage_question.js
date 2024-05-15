document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    const modal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close-btn');
    const saveButton = document.querySelector('.save-btn');
    const cancelButton = document.querySelector('.cancel-btn');
    
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

    function openModal(row) {
        const questionType = row.cells[1].innerText;
        const question = row.cells[2].innerText;
        const answerA = row.cells[3].innerText;
        const answerB = row.cells[4].innerText;
        const answerC = row.cells[5].innerText;
        const answerD = row.cells[6].innerText;
        const correctAnswer = row.cells[7].innerText;
        const course = row.cells[8].innerText;
        const lection = row.cells[9].innerText;
        const position = row.cells[10].innerText;
        const imageUrl = row.cells[11].innerText;

        document.getElementById('edit-question-type').value = questionType;
        document.getElementById('edit-question').value = question;
        document.getElementById('edit-answer-a').value = answerA;
        document.getElementById('edit-answer-b').value = answerB;
        document.getElementById('edit-answer-c').value = answerC;
        document.getElementById('edit-answer-d').value = answerD;
        document.getElementById('edit-correct-answer').value = correctAnswer;
        document.getElementById('edit-course').value = course;
        document.getElementById('edit-lection').value = lection;
        document.getElementById('edit-position').value = position;
        document.getElementById('edit-image-url').value = imageUrl;

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
        row.cells[8].innerText = document.getElementById('edit-course').value;
        row.cells[9].innerText = document.getElementById('edit-lection').value;
        row.cells[10].innerText = document.getElementById('edit-position').value;
        row.cells[11].innerText = document.getElementById('edit-image-url').value;
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
  