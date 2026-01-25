import { loadNavbar } from "../ui/navbar.js";
import { initAuthModal } from "../ui/authModal.js";
import { loadComponent } from "../ui/loadComponent.js";
import { initAuthListener } from "../core/auth.js";

async function initCategoriesPage() {
  initAuthListener();
  await loadNavbar();
  await initAuthModal();
  await loadComponent("footer", "../../components/footer.html");
}

initCategoriesPage();
