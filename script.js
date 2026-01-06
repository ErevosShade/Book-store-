import { onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { login, signup, googleLogin } from "./auth.js";

const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLoginBtn");
const closeBtn = document.getElementById("closeModal");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const signInBtn = document.getElementById("openLoginBtn");
const accountWrapper = document.getElementById("accountWrapper");
const accountBtn = document.getElementById("accountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const userNameSpan = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

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

// TOGGLE between Login and Signup forms
document.getElementById("showSignup").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
});

//HANDLE LOGIN & SIGNUP SUBMITS
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        await login(email, password);
        alert("Logged in successfully");
        modal.style.display = "none";
    } catch (err) {
        alert(err.message);
    }
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = signupForm.querySelectorAll("input");
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    const confirm = inputs[3].value;

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    try {
        await signup(email, password);
        modal.style.display = "none"; // correct 
    } catch (err) {
        alert(err.message);
    }
});

// GOOGLE LOGIN
document.querySelectorAll(".google-auth").forEach((btn) => {
    btn.addEventListener("click", async () => {
        try {
            await googleLogin();
            modal.style.display = "none"; // close modal
        } catch (err) {
            alert(err.message);
        }
    });
});


// AUTH STATE LISTENER
onAuthStateChanged(auth, (user) => {
    if (user) {
        signInBtn.style.display = "none";
        accountWrapper.style.display = "block";

        const fullName =
            user.displayName || user.email.split("@")[0];
        const firstName = fullName.split(" ")[0];

        userNameSpan.textContent = firstName;
        document.getElementById("userAvatar").textContent =
            firstName.charAt(0).toUpperCase();
    } else {
        signInBtn.style.display = "block";
        accountWrapper.style.display = "none";
    }
});


if (accountBtn && accountDropdown) {
    accountBtn.addEventListener("click", () => {
        accountDropdown.style.display =
            accountDropdown.style.display === "block" ? "none" : "block";
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        accountDropdown.style.display = "none";
    });
}


document.addEventListener("click", (e) => {
    if (accountWrapper && !accountWrapper.contains(e.target)) {
        accountDropdown.style.display = "none";
    }
});

