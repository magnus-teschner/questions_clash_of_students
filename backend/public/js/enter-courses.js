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


document.addEventListener("DOMContentLoaded", function() {
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
                window.location.reload(); // Refresh the page after successful enrollment
            } else {
                response.text().then(text => alert('Failed to enroll in course: ' + text));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to enroll in course');
        });
    }

    // Attach the enrollCourse function to the global scope to be accessible from the HTML
    window.enrollCourse = enrollCourse;
});
