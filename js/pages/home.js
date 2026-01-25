import { loadNavbar } from "../ui/navbar.js";
import { initAuthModal } from "../ui/authModal.js";
import { loadComponent } from "../ui/loadComponent.js";
import { initAuthListener } from "../core/auth.js";
async function initHomePage() {
  initAuthListener();
  await loadNavbar();
  await initAuthModal();
  initAuthModal();
  initLandingUI();
  await loadComponent("footer", "../../components/footer.html");
}

function initLandingUI() {
  document.getElementById("exploreBtn")?.addEventListener("click", () => {
    window.location.href = "products.html";
  });

  document.getElementById("browseBtn")?.addEventListener("click", () => {
    document.getElementById("categories")
      ?.scrollIntoView({ behavior: "smooth" });
  });

  document.querySelectorAll(".browse-card").forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      if (!category) return;
      window.location.href = `products.html?category=${category}`;
    });
  });
}

initHomePage();
