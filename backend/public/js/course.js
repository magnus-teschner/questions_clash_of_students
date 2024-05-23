const profileIcon = document.querySelector('#icon-profile');

const dropdown = document.getElementById('profile-dropdown');



document.addEventListener('click', function (event) {
  var isClickOnIcon = profileIcon.contains(event.target)
  var isOpen = dropdown.classList.contains('show');

  if (isClickOnIcon) {
    if (!isOpen) {
      dropdown.classList.remove('hidden');
      dropdown.classList.add('show');
      profileIcon.focus();
    } else {
      dropdown.classList.remove('show');
      dropdown.classList.add('hidden');
      profileIcon.blur();
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

document.querySelector('#icon-logout').addEventListener('click', function () {
  window.location.href = 'log-out';
});

document.querySelectorAll('.toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lessons = btn.parentNode.nextElementSibling;
    lessons.style.display = lessons.style.display === 'block' ? 'none' : 'block';
    btn.textContent = btn.textContent === '▼' ? '▲' : '▼';
  });
});


document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    var url = 'https://kocbetue.itch.io/clash-of-students';
    window.location.href = url;
  })
});