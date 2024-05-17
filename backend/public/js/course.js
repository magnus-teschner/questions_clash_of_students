var profileIcon = document.querySelector('.icon-profile');
var dropdown = document.getElementById('profile-dropdown');

document.addEventListener('click', function (event) {
  var isClickOnIcon = profileIcon.contains(event.target)
  var isOpen = dropdown.style.display === 'block';

  if (isClickOnIcon) {
    if (!isOpen) {
      dropdown.style.display = 'block';
      profileIcon.focus();
    } else {
      dropdown.style.display = 'none';
      profileIcon.blur();
    }
  } else {
    if (!dropdown.contains(event.target)) {
      dropdown.style.display = 'none';
    } else {
      profileIcon.focus();
    }
  }
});

document.querySelector('.icon-logout').addEventListener('click', function () {
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