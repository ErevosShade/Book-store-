import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import{ auth } from "./firebase.js";
import { setUser, clearState } from "../core/state.js"; 

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

export function logout() {
  return signOut(auth);
}

let authInitialized = false;

export function initAuthListener() {
  if (authInitialized) return;
  authInitialized = true;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      clearState();
    }
  });
}