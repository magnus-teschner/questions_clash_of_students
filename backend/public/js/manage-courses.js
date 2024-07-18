document.addEventListener("DOMContentLoaded", function() {
    const profileBtn = document.getElementById("profile-btn");
    const profileOptions = document.getElementById("profile-options");
    profileOptions.classList.add("hidden");

    profileBtn.addEventListener("click", function() {
        if (profileOptions.classList.contains("hidden")) {
            profileOptions.classList.remove("hidden");
            profileOptions.style.display = "flex";
        } else {
            profileOptions.classList.add("hidden");
            profileOptions.style.display = "none";
        }
    });

    document.addEventListener("click", function(event) {
        if (!profileBtn.contains(event.target) && !profileOptions.contains(event.target)) {
            profileOptions.classList.add("hidden");
            profileOptions.style.display = "none";
        }
    });

    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modal = document.getElementById("members-modal");

    modalCloseBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    const renameCourseForm = document.getElementById("rename-course-form");
    renameCourseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const newCourseName = document.getElementById("new-course-name").value;
        const courseId = document.getElementById("course-id").value;
        renameCourse(courseId, newCourseName);
    });
});

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
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

function editCourse(courseId, courseName) {
    fetch(`/course-members?id=${courseId}`)
    .then(response => response.json())
    .then(data => {
        const modal = document.getElementById('members-modal');
        const membersList = document.getElementById('members-list');
        const courseIdInput = document.getElementById("course-id");
        const newCourseNameInput = document.getElementById("new-course-name");

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

        // Set the hidden input value to the course ID
        courseIdInput.value = courseId;
        newCourseNameInput.value = courseName;

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

function renameCourse(courseId, newCourseName) {
    fetch(`/rename-course`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ course_id: courseId, new_course_name: newCourseName })
    })
    .then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            response.text().then(text => alert('Failed to rename course: ' + text));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to rename course');
    });
}
