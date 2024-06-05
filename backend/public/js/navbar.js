document.addEventListener('click', function (event) {
    const profileIcon = document.querySelector('#icon-profile');
    const dropdown = document.getElementById('profile-dropdown');
    const isClickOnIcon = profileIcon.contains(event.target);
    const isOpen = dropdown.classList.contains('show');
    const currentPage = window.location.pathname.split('/').pop();
    const rakingIcon = document.querySelector('#icon-ranking');
    const coursesIcon = document.querySelector('#icon-course');

    // Funktion, um den Fokus auf das aktuelle Icon zu setzen
    function focusCurrentIcon() {
        if (currentPage === "ranking") {
            rakingIcon.focus();
        } else if (currentPage === "courses") {
            coursesIcon.focus();
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
            // Fokus auf das aktuelle Icon setzen
            focusCurrentIcon();
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
    const rakingIcon = document.querySelector('#icon-ranking');
    const coursesIcon = document.querySelector('#icon-course');

    if (currentPage === "ranking") {
        rakingIcon.focus();
    } else if (currentPage === "courses") {
        coursesIcon.focus();
    }  
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

