document.addEventListener('click', function (event) {
    const profileIcon = document.querySelector('#icon-profile');
    const dropdown = document.getElementById('profile-dropdown');
    const isClickOnIcon = profileIcon.contains(event.target);
    const isOpen = dropdown.classList.contains('show');
    const currentPage = window.location.pathname.split('/').pop();
    const rankingIcon = document.querySelector('#icon-ranking');
    const coursesIcon = document.querySelector('#icon-course');

    function highlightCurrentIcon() {
        if (currentPage === "ranking") {
            rankingIcon.classList.add('focus');
            coursesIcon.classList.remove('focus');
        } else if (currentPage === "courses") {
            coursesIcon.classList.add('focus');
            rankingIcon.classList.remove('focus');
        } else {
            rankingIcon.classList.remove('focus');
            coursesIcon.classList.remove('focus');
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
    const rankingIcon = document.querySelector('#icon-ranking');
    const coursesIcon = document.querySelector('#icon-course');

    function highlightCurrentIcon() {
        if (currentPage === "ranking") {
            rankingIcon.classList.add('focus');
            coursesIcon.classList.remove('focus');
        } else if (currentPage === "courses") {
            coursesIcon.classList.add('focus');
            rankingIcon.classList.remove('focus');
        } else {
            rankingIcon.classList.remove('focus');
            coursesIcon.classList.remove('focus');
        }
    }

    highlightCurrentIcon();
});

document.querySelector('#icon-ranking').addEventListener('click', function () {
    window.location.href = 'ranking';
});

document.querySelector('#icon-course').addEventListener('click', function () {
    window.location.href = 'courses';
});

document.querySelector('#icon-logout').addEventListener('click', function () {
    window.location.href = 'log-out';
});
