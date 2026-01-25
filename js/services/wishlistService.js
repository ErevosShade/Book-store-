import { db } from "../core/firebase.js";
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const WISHLIST_KEY = "booknest_wishlist";

export function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

export function saveWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function toggleWishlist(product) {
  if (!product || !product.id) return;

  let wishlist = getWishlist().filter(Boolean); // 🚨 remove nulls

  const exists = wishlist.some(item => item.id === product.id);

  if (exists) {
    wishlist = wishlist.filter(item => item.id !== product.id);
  } else {
    wishlist.push(product);
  }

  saveWishlist(wishlist);
}


export function isInWishlist(productId) {
  const wishlist = getWishlist();

  return wishlist.some(item => item && item.id === productId);
}


export function updateWishlistCount() {
  const countEl = document.getElementById("wishlist-count");
  if (countEl) countEl.textContent = getWishlist().length;
}
