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