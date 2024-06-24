document.addEventListener("DOMContentLoaded", function() {
    const events = document.querySelectorAll(".timeline .event h3");

    events.forEach(event => {
        event.addEventListener("click", function() {
            this.parentElement.classList.toggle("active");
        });
    });
});
