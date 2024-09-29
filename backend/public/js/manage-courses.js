document.addEventListener("DOMContentLoaded", function () {
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modal = document.getElementById("members-modal");

    modalCloseBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        fetch(`/delete-course`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "course_id": courseId })
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

            membersList.innerHTML = ''; // Clear the list before populating

            data.forEach(member => {
                const listItem = document.createElement('li');
                listItem.textContent = `${member.firstname} ${member.lastname} (${member.email})`; // Show name and email

                // Create Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';

                // When Delete button is clicked, call deleteMember with courseId and user_id
                deleteButton.onclick = () => deleteMember(courseId, member.user_id); // Use user_id here

                listItem.appendChild(deleteButton); // Append the delete button to the list item
                membersList.appendChild(listItem);  // Append the list item to the members list
            });

            modal.style.display = 'block'; // Show the modal
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch course members');
        });
}

function deleteMember(courseId, userId) {
    if (confirm('Are you sure you want to remove this member from the course?')) {
        fetch(`/delete-course-member`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ course_id: courseId, user_id: userId }) // Pass courseId and userId in the body
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload(); // Reload page to update the member list
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


function editCourseName(courseId) {
    const courseNameSpan = document.getElementById(`course-name-${courseId}`);
    const editCourseNameInput = document.getElementById(`edit-course-name-${courseId}`);
    const saveBtn = document.getElementById(`save-btn-${courseId}`);
    const cancelBtn = document.getElementById(`cancel-btn-${courseId}`);
    const editBtn = document.querySelector(`#course-${courseId} .edit-btn`);

    courseNameSpan.classList.add('hidden');
    editCourseNameInput.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    cancelBtn.classList.remove('hidden');
    editBtn.classList.add('hidden');
}

function saveCourseName(courseId) {
    const newCourseName = document.getElementById(`edit-course-name-${courseId}`).value;

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

function cancelEdit(courseId) {
    const courseNameSpan = document.getElementById(`course-name-${courseId}`);
    const editCourseNameInput = document.getElementById(`edit-course-name-${courseId}`);
    const saveBtn = document.getElementById(`save-btn-${courseId}`);
    const cancelBtn = document.getElementById(`cancel-btn-${courseId}`);
    const editBtn = document.querySelector(`#course-${courseId} .edit-btn`);

    courseNameSpan.classList.remove('hidden');
    editCourseNameInput.classList.add('hidden');
    saveBtn.classList.add('hidden');
    cancelBtn.classList.add('hidden');
    editBtn.classList.remove('hidden');
}

// Drag and Drop Functions
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, programName) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var courseElement = document.getElementById(data);
    var courseId = courseElement.getAttribute('data-course-id');

    fetch(`/move-course`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ course_id: courseId, new_program: programName })
    })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                response.text().then(text => alert('Failed to move course: ' + text));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to move course');
        });
}
