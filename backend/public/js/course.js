// Tab Functionality
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }

  tablinks = document.getElementsByClassName("tab-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");

  localStorage.setItem('activeTab', tabName);
}

document.addEventListener("DOMContentLoaded", function () {
  const activeTab = localStorage.getItem('activeTab') || 'meineKurse';

  openTab({ currentTarget: document.querySelector(`.tab-link[onclick*="${activeTab}"]`) }, activeTab);

  const buttons = document.querySelectorAll('.enroll-btn');
  buttons.forEach(button => {
    if (button.classList.contains('enrolled')) {
      button.disabled = true;
    }
  });

  // Function to enroll in a course
  function enrollCourse(courseId) {
    fetch('/enroll-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ course_id: courseId })
    })
      .then(response => {
        if (response.ok) {
          window.location.reload();
        } else {
          response.text().then(text => alert('Failed to enroll in course: ' + text));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to enroll in course');
      });
  }

  // Function to unenroll from a course
  function unenrollCourse(courseId) {
    fetch('/unenroll-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ course_id: courseId })
    })
      .then(response => {
        if (response.ok) {
          window.location.reload();
        } else {
          response.text().then(text => alert('Failed to unenroll from course: ' + text));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to unenroll from course');
      });
  }

  fetch('/course-progress')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const progressBars = document.querySelectorAll('.progress-bar');

      data.forEach((course, index) => {
        const progress = calculateProgress(course.progress, 100);
        progressBars[index].style.width = progress.toFixed(0) + '%';
        progressBars[index].textContent = progress.toFixed(0) + '%';

        if (progress === 0) {
          progressBars[index].style.width = 0 + '%';
          progressBars[index].textContent = 0 + '%';
        }
      });
    })
    .catch(error => {
      console.error('Error fetching course progress:', error);
    });

  function calculateProgress(currentPoints, maxPoints) {
    if (maxPoints === 0) return 0;
    if (currentPoints === 0) return 0;
    return (currentPoints / maxPoints) * 100;
  }

  window.enrollCourse = enrollCourse;
  window.unenrollCourse = unenrollCourse;
});

// Play Button Lessons
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    var url = 'https://kocbetue.itch.io/clash-of-students';
    window.location.href = url;
  })
});