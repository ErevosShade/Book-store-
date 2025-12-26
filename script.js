const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLoginBtn");
const closeBtn = document.getElementById("closeModal");

// OPEN from navbar Sign In
openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// CLOSE (X button)
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// CLOSE on outside click
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// CLOSE on ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.style.display = "none";
});

