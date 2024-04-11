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
            event.preventDefault(); // Prevent the default link behavior
            parentDiv.previousElementSibling.textContent = event.target.textContent; // Set parent div's text
        };

        // Add the event listener to each link
        links.forEach(link => link.addEventListener('click', updateSiblingText));
    }
};


eventlistenerLinks(course);
eventlistenerLinks(lection);
eventlistenerLinks(position);
