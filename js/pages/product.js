import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../core/firebase.js";
import { loadNavbar } from "../ui/navbar.js";
import { loadComponent } from "../ui/loadComponent.js";
import { addToCart } from "../services/cartService.js";
import { initAuthListener } from "../core/auth.js";
import { subscribe } from "../core/state.js";

initAuthListener();
await loadNavbar();
await loadComponent("footer", "../../components/footer.html");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const container = document.getElementById("productContainer");

let currentUser = null;

subscribe((state) => {
  currentUser = state.user;
});

if (!productId) {
  container.innerHTML = "<p>Product not found</p>";
  throw new Error("Missing product ID");
}

const ref = doc(db, "products", productId);
const snap = await getDoc(ref);

if (!snap.exists()) {
  container.innerHTML = "<p>Product not found</p>";
  throw new Error("Invalid product ID");
}

const product = snap.data();
product.id = productId;

container.innerHTML = `
  <div class="product-details">
    <div class="image">
      <img src="${product.image}" alt="${product.title}" />
    </div>

    <div class="info">
      <h1>${product.title}</h1>
      <p class="author">by ${product.author}</p>
      <p class="category">${product.category}</p>
      <p class="desc">${product.description}</p>

      <div class="buy-row">
        <span class="price">$${product.price}</span>
        <button id="addToCartBtn">Add to Cart</button>
      </div>
    </div>
  </div>
`;

document.getElementById("addToCartBtn").onclick = () => {
  if (!currentUser) {
    alert("Please sign in to add items to cart");
    return;
  }
  addToCart(currentUser.uid, product);
};
