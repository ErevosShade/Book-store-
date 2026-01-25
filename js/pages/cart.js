import { initAuthListener } from "../core/auth.js";
import { subscribe } from "../core/state.js";
import { removeFromCart } from "../services/cartService.js";

initAuthListener();

subscribe((state) => {
  const container = document.getElementById("cartItems");
  const empty = document.getElementById("emptyCart");
  const totalEl = document.getElementById("cartTotal");
  const totalItemsEl = document.getElementById("totalItems");


  if (!container || !empty || !totalEl) return;

  /* NOT LOGGED IN */
  if (!state.user) {
    empty.style.display = "block";
    empty.textContent = "Please sign in to view your cart";
    container.innerHTML = "";
    totalEl.textContent = "₹0";
    return;
  }

  /* EMPTY CART */
  if (state.cart.length === 0) {
    empty.style.display = "block";
    empty.textContent = "Your cart is empty";
    container.innerHTML = "";
    totalEl.textContent = "₹0";
    return;
  }

  /* RENDER CART */
  empty.style.display = "none";
  container.innerHTML = "";

  let total = 0;

  state.cart.forEach(item => {
    total += item.price * item.quantity;

    container.innerHTML += `
  <div class="cart-item">
    <img src="${item.image}" alt="${item.title}">
    <div class="info">
      <h4>${item.title}</h4>
      <p>₹${item.price} × ${item.quantity}</p>
      <button data-id="${item.id}" class="remove">Remove</button>
    </div>
  </div>
`;

  });

  if (totalItemsEl) {
    totalItemsEl.textContent = state.cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  totalEl.textContent = `₹${total}`;

  container.querySelectorAll(".remove").forEach(btn => {
    btn.onclick = () => removeFromCart(state.user.uid, btn.dataset.id);
  });
});
