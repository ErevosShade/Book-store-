import { login, signup, googleLogin } from "./auth.js";
const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openLoginBtn");
const closeBtn = document.getElementById("closeModal");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

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

  const email = loginForm.querySelector('input[type="email"]').value;
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
  const email = inputs[1].value;
  const password = inputs[2].value;
  const confirm = inputs[3].value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    await signup(email, password);
    alert("Account created!");
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  } catch (err) {
    alert(err.message);
  }
});

document.querySelectorAll(".google").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await googleLogin();
      modal.style.display = "none";
    } catch (err) {
      alert(err.message);
    }
  });
});
