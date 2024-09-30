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
    const progressBars = document.querySelectorAll('.progress-bar');

    data.forEach((course, index) => {
      const progress = course.calculatedProgress;
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

  window.enrollCourse = enrollCourse;
  window.unenrollCourse = unenrollCourse;
});

// Play Button Lessons
document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Define the base URL
    var url = 'http://localhost:8080';
    const selectedProgram = btn.closest('.course-item').querySelector('.info-content span').innerText; // Adjust selector if necessary
    const selectedCourseId = btn.closest('.course-item').getAttribute('data-course-id');
    // Define the data to send in the POST request
    const postData = {
      program: selectedProgram,
      course: selectedCourseId
    };
    console.log(postData);

    // Make the POST fetch request
    fetch('/jwt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data => {
        const result = data.token.data.token;

        // Append the result as a URL parameter
        const newUrl = `${url}?token=${result}`;

        // Navigate to the new URL
        window.location.href = newUrl;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });
});

