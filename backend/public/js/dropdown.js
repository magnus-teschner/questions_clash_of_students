// Select the parent div by its ID or any other selector
const program = document.querySelector('#dropdown-content-program');
const course = document.querySelector('#dropdown-content-course');
const lection = document.querySelector('#dropdown-content-lection');
const position = document.querySelector('#dropdown-content-position');

function eventlistenerLinks(parentDiv) {
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

const add_course = document.querySelector('#add-course');
const add_program = document.querySelector('#add-program');

function add_link_dropdown(placeholder, adder) {
    if (adder.previousElementSibling.tagName === 'DIV') {
        return;
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
            const a_new_course = document.createElement('a');
            a_new_course.textContent = e.target.value;
            adder.parentElement.insertBefore(a_new_course, container);
            eventlistenerLinks(adder.parentElement);
            container.remove();
        }
    });
}

add_course.addEventListener('click', function(event) {
    event.preventDefault();
    add_link_dropdown('Enter course', add_course);
});

add_program.addEventListener('click', function(event) {
    event.preventDefault();
    add_link_dropdown('Enter program', add_program);
});

eventlistenerLinks(program);
eventlistenerLinks(course);
eventlistenerLinks(lection);
eventlistenerLinks(position);

const parentDivs = document.querySelectorAll('.dropdown');

// Loop through each parent div and add event listeners
parentDivs.forEach(parentDiv => {
    // Get the child div dynamically
    const childDiv = parentDiv.querySelector('.content-dropdown');

    // Add event listener for mouseenter
    parentDiv.addEventListener('mouseenter', () => {
        childDiv.style.display = 'flex';
    });

    // Add event listener for mouseleave
    parentDiv.addEventListener('mouseleave', () => {
        childDiv.style.display = 'none';
    });
});
