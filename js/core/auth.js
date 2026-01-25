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
import { listenToCart } from "../services/cartService.js";    

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
let unsubscribeCart = null;
export function initAuthListener() {
  if (authInitialized) return;
  authInitialized = true;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      if (unsubscribeCart) unsubscribeCart();
      unsubscribeCart = listenToCart(user.uid);
    } else {
      if (unsubscribeCart) unsubscribeCart();
      unsubscribeCart = null;
      clearState();

    }
  });
}

export function listenToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}