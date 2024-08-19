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

  window.enrollCourse = enrollCourse;
  window.unenrollCourse = unenrollCourse;
});

// Toggle Button Courses
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', function () {
    const courseItem = this.closest('.course-item');
    courseItem.classList.toggle('active');
  });
});

// Play Button Lessons
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    var url = 'https://kocbetue.itch.io/clash-of-students';
    window.location.href = url;
  })
});