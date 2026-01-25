import { loadComponent } from "./loadComponent.js";
import { listenToAuthChanges, logout } from "../core/auth.js";

export async function loadNavbar() {
  await loadComponent("navbar", "../../components/navbar.html");
  setupNavbarAuth();
}

function setupNavbarAuth() {
  const signInBtn = document.getElementById("openLoginBtn");
  const accountWrapper = document.getElementById("accountWrapper");
  const accountBtn = document.getElementById("accountBtn");
  const accountDropdown = document.getElementById("accountDropdown");
  const userNameSpan = document.getElementById("userName");
  const avatar = document.getElementById("userAvatar");
  const logoutBtn = document.getElementById("logoutBtn");


  listenToAuthChanges((user) => {
    if (user) {
      signInBtn?.classList.add("hidden");
      accountWrapper?.classList.remove("hidden");

      const name = user.displayName || user.email.split("@")[0];
      const first = name.split(" ")[0];

      userNameSpan.textContent = first;
      avatar.textContent = first[0].toUpperCase();
    } else {
      signInBtn?.classList.remove("hidden");
      accountWrapper?.classList.add("hidden");
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
      await signOut(auth);
      accountDropdown.style.display = "none";
    });
  }


  document.addEventListener("click", (e) => {
    if (accountWrapper && !accountWrapper.contains(e.target)) {
      accountDropdown.style.display = "none";
    }
  });
}