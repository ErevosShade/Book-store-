// auth.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// LOGIN
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// SIGNUP
export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// GOOGLE AUTH
export function googleLogin() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
