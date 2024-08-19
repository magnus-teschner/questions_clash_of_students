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
            if (event.currentTarget.getAttribute('class') == 'add-button') {
                return;
            }
            event.preventDefault();
            parentDiv.previousElementSibling.textContent = event.target.textContent;
            parentDiv.style.display = 'none';


        };
        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
};

function eventlistenerLinksProgram(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();
            parentDiv.previousElementSibling.textContent = event.target.textContent;
            parentDiv.style.display = 'none';
            const queryParams = new URLSearchParams({
                program: event.target.textContent,
              });
            
              // Construct the URL with parameters
              let url = `/get_courses/?${queryParams}`;
              fetch(url, {
                method: 'GET',
              })
              .then(response => response.json())
              .then(data => {
                courseParent.querySelector('#dropbtn-course').textContent = 'Course';

                while (course.children.length > 1) {
                    course.removeChild(course.firstChild);
                  }
                
                data.forEach(element => {
                    let link_a = document.createElement('a');
                    link_a.textContent = element.course_name;
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

function split(str){
    let splitted = str.split(" ");
    return splitted[splitted.length -1]
}


function eventlistenerLinksLection(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();
            parentDiv.previousElementSibling.textContent = event.target.textContent;
            parentDiv.style.display = 'none';
            const queryParams = new URLSearchParams({
                program: document.querySelector('#dropbtn-program').textContent,
                course: document.querySelector('#dropbtn-course').textContent,
                lection: split(document.querySelector('#dropbtn-lection').textContent),
              });
            
              // Construct the URL with parameters
              let url = `/get_positions/?${queryParams}`;
              fetch(url, {
                method: 'GET',
              })
              .then(response => response.json())
              .then(data => {
                document.querySelector('#dropbtn-position').textContent = 'Position';

                while (position.children.length > 0) {
                    position.removeChild(position.firstChild);
                  }
                
                data = data.reverse();
                data.forEach(element => {
                    let link_a = document.createElement('a');
                    link_a.textContent = `Position ${element}`;
                    position.insertBefore(link_a, position.firstChild);
                    eventlistenerLinksCourses(document.querySelector('#dropdown-content-position'));
                })

              })
              .catch(error => {
                console.error('Error:', error);
              });
        };
        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
};

function eventlistenerLinksPosition(parentDiv) {
    if (parentDiv) {
        const links = parentDiv.querySelectorAll('a');
        const updateSiblingText = (event) => {
            event.preventDefault();
            parentDiv.previousElementSibling.textContent = event.target.textContent;
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
    
    // Create a div container for the input field and the delete button
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.gap = '10px';
    container.style.marginLeft = '10px';
    container.style.marginRight = '10px';

    // Create the input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.style.border = 'none';
    input.style.borderRadius = '10px';
    input.style.width = '80%';
    input.style.alignSelf = 'center';
    input.style.marginBottom = '5px';

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×'; // Using '×' as a cross symbol
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.background = 'none';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = 'red';
    deleteBtn.style.fontSize = '20px';

    // Append the input field and delete button to the div container
    container.appendChild(input);
    container.appendChild(deleteBtn);

    // Insert the div container before the add button
    adder.parentElement.insertBefore(container, adder);

    // Add event listener to the delete button to remove the container
    deleteBtn.addEventListener('click', function() {
        container.remove();
    });

    // Handle input submission
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            let body = {program: document.querySelector('#dropbtn-program').innerText,
                        course: e.target.value}
            const response =  fetch(`/add_course`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
              }).then(response => response.json())
              .then(data => console.log(data))
              .catch((error) => console.error('Error:', error));
            const a_new_course = document.createElement('a');
            a_new_course.textContent = e.target.value;
            adder.parentElement.insertBefore(a_new_course, container);
            eventlistenerLinksCourses(adder.parentElement);
            container.remove();
        }
    });
}

add_course.addEventListener('click', function(event) {
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
    if (programParent.querySelector('#dropbtn-program').textContent != 'Program'){
        childCourse.style.display = 'flex';
    }
    
})

courseParent.addEventListener('mouseleave', () => {
    childCourse.style.display = 'none';
})


lectionParent.addEventListener('mouseenter', () => {
    if (courseParent.querySelector('#dropbtn-course').textContent != 'Course'){
        childLection.style.display = 'flex';
    }
    
})

lectionParent.addEventListener('mouseleave', () => {
    childLection.style.display = 'none';
})


positionParent.addEventListener('mouseenter', () => {
    if (lectionParent.querySelector('#dropbtn-lection').textContent != 'Lection'){
        childPosition.style.display = 'flex';
    }
    
})

positionParent.addEventListener('mouseleave', () => {
    childPosition.style.display = 'none';
})