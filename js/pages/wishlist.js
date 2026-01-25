import { getWishlist, toggleWishlist } from "../services/wishlistService.js";
import { addToCart } from "../services/cartService.js";

const grid = document.getElementById("wishlistGrid");

function renderWishlist() {
  const items = getWishlist();
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = "<p>Your wishlist is empty 💔</p>";
    return;
  }

  items.forEach(product => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" />
        <h3>${product.title}</h3>
        <p>${product.description || ""}</p>
        <strong>₹${product.price}</strong>

        <div class="actions">
          <button onclick="addToCart('${product.id}')">Add to Cart</button>
          <button onclick="remove('${product.id}')">Remove</button>
        </div>
      </div>
    `;
  });
}

window.remove = (id) => {
  const product = getWishlist().find(p => p.id === id);
  toggleWishlist(product);
  renderWishlist();
};

renderWishlist();
