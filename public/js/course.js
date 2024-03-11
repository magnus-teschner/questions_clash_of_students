document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lessons = btn.parentNode.nextElementSibling;
      lessons.style.display = lessons.style.display === 'block' ? 'none' : 'block';
      btn.textContent = btn.textContent === '▼' ? '▲' : '▼';
    });
  });