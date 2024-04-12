// Select the parent div by its ID or any other selector
const course = document.querySelector('#dropdown-content-course');
const lection = document.querySelector('#dropdown-content-lection');
const position = document.querySelector('#dropdown-content-position');


function eventlistenerLinks(parentDiv) {
    // Check if the parentDiv exists to avoid errors
    
    if (parentDiv) {
        // Select all <a> children within the parent div
        const links = parentDiv.querySelectorAll('a');

        // Function to set parent div's text to the text of the clicked link
        const updateSiblingText = (event) => {
            if (event.currentTarget.getAttribute('id') == 'add-course'){
                return
            }
            event.preventDefault(); // Prevent the default link behavior
            parentDiv.previousElementSibling.textContent = event.target.textContent; // Set parent div's text
        };

        // Add the event listener to each link
        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
};

/*
const add_course = document.querySelector('#add-course');
add_course.addEventListener('click', function(event) {


    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter course!';
    input.style.border = 'none';
    input.style.borderRadius = '10px';
    input.style.width = '80%';
    input.style.alignSelf = 'center';
    input.style.marginBottom = '5px';


    this.parentElement..insertBefore(input, this);

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const a_new_course = document.createElement('a');
            a_new_course.textContent = e.target.value
            this.parentElement..insertBefore(a_new_course, this);
            this.remove()
          
        }
    });

});
*/
const add_course = document.querySelector('#add-course');
add_course.addEventListener('click', function(event) {
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
    input.placeholder = 'Enter course!';
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
    this.parentElement.insertBefore(container, this);

    // Add event listener to the delete button to remove the container
    deleteBtn.addEventListener('click', function() {
        container.remove();
    });

    // Handle input submission
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const a_new_course = document.createElement('a');
            a_new_course.textContent = e.target.value;
            this.parentElement.parentElement.insertBefore(a_new_course, this.parentElement);
            eventlistenerLinks(this.parentElement.parentElement);
            // Insert the new course link before the container
            this.parentElement.remove(); // Remove the container after submission
        }
    });
});


eventlistenerLinks(course);
eventlistenerLinks(lection);
eventlistenerLinks(position);