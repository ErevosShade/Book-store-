import { onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";
import { login, signup, googleLogin } from "./auth.js";



const signInBtn = document.getElementById("openLoginBtn");
const accountWrapper = document.getElementById("accountWrapper");
const accountBtn = document.getElementById("accountBtn");
const accountDropdown = document.getElementById("accountDropdown");
const userNameSpan = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");


// AUTH STATE LISTENER


