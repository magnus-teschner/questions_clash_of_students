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

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Define the base URL
    var url = 'http://localhost:8080';
    const selectedProgram = btn.closest('.course-item').querySelector('.info-content span').innerText; // Adjust selector if necessary
    const selectedCourse = btn.closest('.course-item').querySelector('.course-title').innerText; // Adjust selector if necessary

    // Define the data to send in the POST request
    const postData = {
      program: selectedProgram,
      course: selectedCourse,
    };

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
      // Assuming 'data' is the result you want to append as a URL parameter
      const result = encodeURIComponent(data.result); // Adjust 'result' as per your data structure

      // Append the result as a URL parameter
      const newUrl = `${url}?result=${result}`;

      // Navigate to the new URL
      window.location.href = newUrl;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  });
});

