document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.querySelector(".menu-icon");
    const sidebar = document.querySelector(".sidebar");  
    const closeBtn = document.querySelector(".close-btn"); 

    menuIcon.addEventListener("click", (e) => {
        e.preventDefault();
        sidebar.classList.add("active");
    });

    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sidebar.classList.remove("active");
    });
});
