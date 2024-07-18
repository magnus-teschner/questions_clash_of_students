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

  // Add event listener for the close button of the modal
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modal = document.getElementById("members-modal");
  
  modalCloseBtn.addEventListener("click", function() {
      modal.style.display = "none";
  });

  // Close modal when clicking outside of the modal content
  window.addEventListener("click", function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
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


  function editCourse(courseId) {
    fetch(`/course-members?id=${courseId}`)
    .then(response => response.json())
    .then(data => {
        const modal = document.getElementById('members-modal');
        const membersList = document.getElementById('members-list');
        membersList.innerHTML = '';
        data.forEach(member => {
            const listItem = document.createElement('li');
            listItem.textContent = `${member.user_email}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteMember(courseId, member.user_email);

            listItem.appendChild(deleteButton);
            membersList.appendChild(listItem);
        });
        modal.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to fetch course members');
    });
}

function deleteMember(courseId, userEmail) {
    if (confirm('Are you sure you want to delete this member from the course?')) {
        fetch(`/delete-member`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ course_id: courseId, user_email: userEmail })
        })
        .then(response => {
            if (response.ok) {
                // Refresh the members list after deletion
                editCourse(courseId);
            } else {
                response.text().then(text => alert('Failed to delete member: ' + text));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete member');
        });
    }
}





  