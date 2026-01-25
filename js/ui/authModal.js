import { loadComponent } from "./loadComponent.js";
import { login, signup, googleLogin } from "../core/auth.js";

export async function initAuthModal() {
    await loadComponent("auth-modal", "../../components/auth-modal.html");

    const modal = document.getElementById("loginModal");
    const openBtn = document.getElementById("openLoginBtn");
    const closeBtn = document.getElementById("closeModal");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

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
        if (!btn.dataset.bound) {
            btn.dataset.bound = "true";
            btn.addEventListener("click", async () => {
                try {
                    await googleLogin();
                    modal.style.display = "none";
                } catch (err) {
                    alert(err.message);
                }
            });
        }
    });
}