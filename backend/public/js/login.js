const wrapper = document.querySelector(".wrapper"),
studentsHeader = document.querySelector(".students header"),
profsHeader = document.querySelector(".profs header");

profsHeader.addEventListener("click", () => {
    wrapper.classList.add("active");
    document.body.classList.add('background-profs');
    document.body.classList.remove('background-students');
});

studentsHeader.addEventListener("click", () => {
    wrapper.classList.remove("active");
    document.body.classList.add('background-students');
    document.body.classList.remove('background-profs');
});