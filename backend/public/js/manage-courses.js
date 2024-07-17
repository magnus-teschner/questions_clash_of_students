document.addEventListener("DOMContentLoaded", function() {
    const profileBtn = document.getElementById("profile-btn");
    const profileOptions = document.getElementById("profile-options");
    profileOptions.classList.add("hidden");
  
    profileBtn.addEventListener("click", function() {
        
        console.log(profileOptions.classList.contains("hidden"))
        if (profileOptions.classList.contains("hidden")) {
            profileOptions.classList.remove("hidden");
            profileOptions.style.display = "flex";
        } else {
            profileOptions.classList.add("hidden");
            profileOptions.style.display = "none";
        }
    });
  
    // Hide the profile options when clicking outside
    document.addEventListener("click", function(event) {
        if (!profileBtn.contains(event.target) && !profileOptions.contains(event.target)) {
            profileOptions.classList.add("hidden");
            profileOptions.style.display = "none";
        }
    });
  });


  function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        console.log(courseId);
      fetch(`/delete-course?id=${courseId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          window.location.reload();
        } else {
          response.text().then(text => alert('Failed to delete course: ' + text));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete course');
      });
    }
  }




  