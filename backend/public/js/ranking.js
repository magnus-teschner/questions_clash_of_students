function filterByCourse() {
    var selectedCourse = document.getElementById("kurs-filter").value;
    var items = document.querySelectorAll('.ranking-item');
    
    items.forEach(function(item) {
        if (selectedCourse === "all" || item.classList.contains(selectedCourse)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}