import { initAuthListener } from "../core/auth.js";
import { subscribe } from "../core/state.js";
import { removeFromCart, updateCartQuantity } from "../services/cartService.js";

initAuthListener();

subscribe((state) => {
  const container = document.getElementById("cartItems");
  const empty = document.getElementById("emptyCart");
  const totalEl = document.getElementById("cartTotal");
  const totalItemsEl = document.getElementById("totalItems");
  const checkoutBtn = document.querySelector(".checkout-btn");

  if (!container || !empty || !totalEl) return;

  /* NOT LOGGED IN */
  if (!state.user) {
    empty.style.display = "block";
    empty.textContent = "Please sign in to view your cart";
    container.innerHTML = "";
    totalEl.textContent = "₹0";
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Sign in to continue";
    return;
  }

  /* EMPTY CART */
  if (state.cart.length === 0) {
    empty.style.display = "block";
    empty.textContent = "Your cart is empty";
    container.innerHTML = "";
    totalEl.textContent = "₹0";
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Cart is Empty";
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

    <div class="cart-info">
      <h4>${item.title}</h4>
      <p class="desc">
        ${item.description}
      </p>
      <p class="price">₹${item.price}</p>
    </div>

    <div class="cart-actions">
      <div class="qty-controls">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
        <span class="qty">${item.quantity}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>

      <button data-id="${item.id}" class="remove">Remove</button>
    </div>

  </div>
`;


  });

  totalEl.textContent = `${total.toFixed(2)}`;
  if (totalItemsEl) {
    totalItemsEl.textContent = state.cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  container.querySelectorAll(".remove").forEach(btn => {
    btn.onclick = () => {
      if (confirm("Remove this item from cart?")) {
        removeFromCart(state.user.uid, btn.dataset.id);
      }
    };

  });

  container.querySelectorAll(".qty-btn").forEach(btn => {
    btn.onclick = () =>
      updateCartQuantity(
        state.user.uid,
        btn.dataset.id,
        Number(btn.dataset.delta)
      );
  });

  /* CHECKOUT ENABLE */
  checkoutBtn.disabled = false;
  checkoutBtn.textContent = "Proceed to Checkout";
});
