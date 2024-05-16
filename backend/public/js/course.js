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

//Öffnen und schließen des Profils bei Klick auf Icon
function toggleProfile() {
  var dropdown = document.getElementById('profile-dropdown');
  var profileIcon = document.querySelector('.icon-profile');
  var isOpen = dropdown.style.display === 'block';

  if (!isOpen) {
    dropdown.style.display = 'block';
    profileIcon.focus();
    document.addEventListener('click', closeProfileClickOutside);
  } else {
    dropdown.style.display = 'none';
    profileIcon.blur();
    document.removeEventListener('click', closeProfileClickOutside);
  }
}

//Schließen des Profils bei Klick außerhalb von Icon und Dropdown
function closeProfileClickOutside(event) {
  var dropdown = document.getElementById('profile-dropdown');
  var profileIcon = document.querySelector('.icon-profile');
  var isClickInsideDropdown = dropdown.contains(event.target);
  var isClickOnIcon = profileIcon.contains(event.target);

  if (!isClickInsideDropdown && !isClickOnIcon) {
    dropdown.style.display = 'none';
    document.removeEventListener('click', closeProfileClickOutside);
  }
}