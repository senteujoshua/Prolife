document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.getElementById("menu");
    const closeIcon = document.querySelector(".close-icon");
    const navMenu = document.querySelector(".nav-ul");

    closeIcon.style.display = 'none';
    menuIcon.addEventListener("click", function () {
        navMenu.classList.toggle("show");
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    });

    closeIcon.addEventListener("click", function () {
        navMenu.classList.remove("show");
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
});


