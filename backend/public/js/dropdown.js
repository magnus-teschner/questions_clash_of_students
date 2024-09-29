// Select the parent div by its ID or any other selector
const program = document.querySelector('#dropdown-content-program');
const course = document.querySelector('#dropdown-content-course');
const lection = document.querySelector('#dropdown-content-lection');
const position = document.querySelector('#dropdown-content-position');

const programParent = document.querySelector('#dropdown-program');
const childProgram = programParent.querySelector('.content-dropdown');

const courseParent = document.querySelector('#dropdown-course');
const childCourse = courseParent.querySelector('.content-dropdown');

const lectionParent = document.querySelector('#dropdown-lection');
const childLection = lectionParent.querySelector('.content-dropdown');

const positionParent = document.querySelector('#dropdown-position');
const childPosition = positionParent.querySelector('.content-dropdown');

function eventlistenerLinksCourses(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();

            const courseName = event.target.textContent;
            if (courseName === "Add course") return;
            const courseId = event.target.getAttribute('data-course-id');

            parentDiv.previousElementSibling.textContent = courseName;
            parentDiv.style.display = 'none';

            let url = `/get_lections/${courseId}`;
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    lectionParent.querySelector('#dropbtn-lection').textContent = 'Lection';

                    while (lection.children.length > 0) {
                        lection.removeChild(lection.firstChild);
                    }

                    data.forEach(lectionItem => {
                        let link_a = document.createElement('a');
                        link_a.textContent = `${document.querySelector('#dropbtn-course').textContent} Lection ${lectionItem.lection_name}`;

                        link_a.setAttribute('data-lection-id', lectionItem.lection_id);

                        lection.insertBefore(link_a, lection.firstChild);

                        eventlistenerLinksLection(document.querySelector('#dropdown-content-lection'));
                    });
                })
                .catch(error => {
                    console.error('Error fetching lections:', error);
                });
        };

        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
}



function eventlistenerLinksProgram(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();
            parentDiv.previousElementSibling.textContent = event.target.textContent;
            parentDiv.previousElementSibling.setAttribute('data-program-id', event.target.getAttribute('data-program-id'));
            parentDiv.style.display = 'none';

            let url = `/get_courses/${event.target.getAttribute('data-program-id')}`;
            fetch(url, {
                method: 'GET'
            })
                .then(response => {
                    if (response.status === 404) {
                        return []
                    }
                    return response.json()
                }
                )
                .then(data => {
                    courseParent.querySelector('#dropbtn-course').textContent = 'Course';

                    while (course.children.length > 1) {
                        course.removeChild(course.firstChild);
                    }

                    data.forEach(element => {
                        let link_a = document.createElement('a');
                        link_a.textContent = element.course_name;
                        link_a.setAttribute('data-course-id', element.course_id);
                        course.insertBefore(link_a, course.firstChild);
                        eventlistenerLinksCourses(document.querySelector('#dropdown-content-course'));

                    })

                })
                .catch(error => {
                    console.error('Error:', error);
                });

        };

        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
};

function split(str) {
    let splitted = str.split(" ");
    return splitted[splitted.length - 1]
}


function eventlistenerLinksLection(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();

            const lectionName = event.target.textContent;
            const lectionId = event.target.getAttribute('data-lection-id');

            parentDiv.previousElementSibling.textContent = lectionName;
            parentDiv.previousElementSibling.setAttribute('data-lection-id', lectionId);
            parentDiv.style.display = 'none';

            let url = `/get_positions/${lectionId}`;
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    positionParent.querySelector('#dropbtn-position').textContent = 'Position';

                    while (position.children.length > 0) {
                        position.removeChild(position.firstChild);
                    }

                    data.forEach(positionItem => {
                        let link_a = document.createElement('a');
                        link_a.textContent = `Position ${positionItem}`;
                        link_a.setAttribute('data-position', positionItem);

                        position.insertBefore(link_a, position.firstChild);

                        eventlistenerLinksPosition(document.querySelector('#dropdown-content-position'));
                    });
                })
                .catch(error => {
                    console.error('Error fetching positions:', error);
                });
        };

        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
}



function eventlistenerLinksPosition(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();
            parentDiv.previousElementSibling.textContent = event.target.textContent;
            parentDiv.previousElementSibling.setAttribute('data-position', event.target.getAttribute('data-position'));
            parentDiv.style.display = 'none';
        };
        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
};

const add_course = document.querySelector('#add-course');

function add_link_dropdown(placeholder, adder) {
    try {
        if (adder.previousElementSibling.tagName === 'DIV') {
            return;
        }
    } catch {

    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.gap = '10px';
    container.style.marginLeft = '10px';
    container.style.marginRight = '10px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.style.border = 'none';
    input.style.borderRadius = '10px';
    input.style.width = '80%';
    input.style.alignSelf = 'center';
    input.style.marginBottom = '5px';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×'; // Using '×' as a cross symbol
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = 'red';
    deleteBtn.style.fontSize = '20px';

    container.appendChild(input);
    container.appendChild(deleteBtn);

    adder.parentElement.insertBefore(container, adder);

    deleteBtn.addEventListener('click', function () {
        container.remove();
    });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const programId = document.querySelector('#dropbtn-program').getAttribute('data-program-id');

            let body = {
                program_id: programId,
                course_name: e.target.value.trim()
            };

            fetch('/add_course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    if (data.error) {
                        console.error('Error creating course:', data.error);
                    } else {
                        const courseId = data.courseId;
                        const courseName = data.courseName;

                        const a_new_course = document.createElement('a');
                        a_new_course.textContent = courseName;
                        a_new_course.setAttribute('data-course-id', courseId);

                        adder.parentElement.insertBefore(a_new_course, container);

                        eventlistenerLinksCourses(adder.parentElement);

                        container.remove();
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    });
}

add_course.addEventListener('click', function (event) {
    event.preventDefault();
    add_link_dropdown('Enter course', add_course);
});



eventlistenerLinksProgram(program);
eventlistenerLinksCourses(course);
eventlistenerLinksLection(lection);
eventlistenerLinksPosition(position);





programParent.addEventListener('mouseenter', () => {
    childProgram.style.display = 'flex';
})

programParent.addEventListener('mouseleave', () => {
    childProgram.style.display = 'none';
})


courseParent.addEventListener('mouseenter', () => {
    if (programParent.querySelector('#dropbtn-program').textContent != 'Program') {
        childCourse.style.display = 'flex';
    }

})

courseParent.addEventListener('mouseleave', () => {
    childCourse.style.display = 'none';
})


lectionParent.addEventListener('mouseenter', () => {
    if (courseParent.querySelector('#dropbtn-course').textContent != 'Course') {
        childLection.style.display = 'flex';
    }

})

lectionParent.addEventListener('mouseleave', () => {
    childLection.style.display = 'none';
})


positionParent.addEventListener('mouseenter', () => {
    if (lectionParent.querySelector('#dropbtn-lection').textContent != 'Lection') {
        childPosition.style.display = 'flex';
    }

})

positionParent.addEventListener('mouseleave', () => {
    childPosition.style.display = 'none';
})