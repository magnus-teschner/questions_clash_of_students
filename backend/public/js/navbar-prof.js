document.addEventListener('click', function (event) {
    const profileIcon = document.querySelector('#icon-profile');
    const addQuestionIcon = document.querySelector('#icon-add-question');
    const manageQuestionIcon = document.querySelector('#icon-manage-question');
    const manageCourseIcon = document.querySelector('#icon-manage-course');
    const dropdown = document.getElementById('profile-dropdown');
    const isClickOnIcon = profileIcon.contains(event.target);
    const isOpen = dropdown.classList.contains('show');
    const currentPage = window.location.pathname.split('/').pop();

    function highlightCurrentIcon() {
        if (currentPage === "questions") {
            addQuestionIcon.classList.add('focus');
            manageQuestionIcon.classList.remove('focus');
            manageCourseIcon.classList.remove('focus');
        } else if (currentPage === "manage-questions") {
            manageQuestionIcon.classList.add('focus');
            addQuestionIcon.classList.remove('focus');
            manageCourseIcon.classList.remove('focus');
        } else if (currentPage === "manage-courses") {
            manageCourseIcon.classList.add('focus');
            addQuestionIcon.classList.remove('focus');
            manageQuestionIcon.classList.remove('focus');
        } else {
            addQuestionIcon.classList.remove('focus');
            manageQuestionIcon.classList.remove('focus');
            manageCourseIcon.classList.remove('focus');
        }
    }

    if (isClickOnIcon) {
        if (!isOpen) {
            dropdown.classList.remove('hidden');
            dropdown.classList.add('show');
            profileIcon.focus();
        } else {
            dropdown.classList.remove('show');
            dropdown.classList.add('hidden');
            profileIcon.blur();
            highlightCurrentIcon();
        }
    } else {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
            dropdown.classList.add('hidden');
        } else {
            profileIcon.focus();
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();
    const addQuestionIcon = document.querySelector('#icon-add-question');
    const manageQuestionIcon = document.querySelector('#icon-manage-question');
    const manageCourseIcon = document.querySelector('#icon-manage-course');

    function highlightCurrentIcon() {
        if (currentPage === "questions") {
            addQuestionIcon.classList.add('focus');
            manageQuestionIcon.classList.remove('focus');
            manageCourseIcon.classList.remove('focus');
        } else if (currentPage === "manage-questions") {
            manageQuestionIcon.classList.add('focus');
            addQuestionIcon.classList.remove('focus');
            manageCourseIcon.classList.remove('focus');
        } else if (currentPage === "manage-courses") {
            manageCourseIcon.classList.add('focus');
            addQuestionIcon.classList.remove('focus');
            manageQuestionIcon.classList.remove('focus');
        } else {
            addQuestionIcon.classList.remove('focus');
            manageQuestionIcon.classList.remove('focus');
            manageCourseIcon.classList.remove('focus');
        }
    }

    highlightCurrentIcon();
});

document.querySelector('#icon-add-question').addEventListener('click', function () {
    window.location.href = 'questions';
});

document.querySelector('#icon-manage-question').addEventListener('click', function () {
    window.location.href = 'manage-questions';
});

document.querySelector('#icon-manage-course').addEventListener('click', function () {
    window.location.href = 'manage-courses';
});

document.querySelector('#icon-logout').addEventListener('click', function () {
    window.location.href = 'log-out';
});
