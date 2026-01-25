import { loadComponent } from "./loadComponent.js";
import { logout } from "../core/auth.js";
import { subscribe } from "../core/state.js";

export async function loadNavbar() {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  if (navbarContainer.children.length > 0) return;

  const res = await fetch("../../components/navbar.html");
  const html = await res.text();

  navbarContainer.innerHTML = html;

  setupNavbar(); // ✅ THIS WAS MISSING
}




function setupNavbar() {

  const accountBtn = document.getElementById("accountBtn");
  const accountDropdown = document.getElementById("accountDropdown");

  const logoutBtn = document.getElementById("logoutBtn");


  subscribe((state) => {
  const signInBtn = document.getElementById("openLoginBtn");
  const accountWrapper = document.getElementById("accountWrapper");
  const userNameSpan = document.getElementById("userName");
  const avatar = document.getElementById("userAvatar");
  const cartCountEl = document.getElementById("cartCount");

  // Guard: navbar not loaded yet
  if (!signInBtn || !accountWrapper) return;

  // 🛒 Cart count
  if (cartCountEl) {
    cartCountEl.textContent = state.cart.length;
  }

  // 👤 User logged in
  if (state.user) {
    signInBtn.classList.add("hidden");
    accountWrapper.classList.remove("hidden");

    const name =
      state.user.displayName ||
      state.user.email.split("@")[0];

    const firstName = name.split(" ")[0];

    if (userNameSpan) userNameSpan.textContent = firstName;
    if (avatar) avatar.textContent = firstName[0].toUpperCase();
  } 
  // 👤 Logged out
  else {
    signInBtn.classList.remove("hidden");
    accountWrapper.classList.add("hidden");

    if (cartCountEl) cartCountEl.textContent = "0";
  }
});




  if (accountBtn && accountDropdown) {
    accountBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 🔥 CRITICAL FIX
      accountDropdown.style.display =
        accountDropdown.style.display === "block" ? "none" : "block";
    });
  }

  if (accountDropdown) {
    accountDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }


  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout();
      accountDropdown.style.display = "none";
    });
  }


  document.addEventListener("click", (e) => {
    if (accountWrapper && !accountWrapper.contains(e.target)) {
      accountDropdown.style.display = "none";
    }
  });



}