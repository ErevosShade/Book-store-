import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

auth.onAuthStateChanged((user) => {
  if (!user) {
    alert("Please sign in to view cart");
    return;
  }
  currentUser = user;
  loadCart();
});

async function loadCart() {
  let total = 0;
  let count = 0;
  const cartRef = collection(db, "users", currentUser.uid, "cart");
  const snap = await getDocs(cartRef);

  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if (snap.empty) {
    container.innerHTML = "<p style='text-align:center;'>Your cart is empty 🛒</p>";

    const totalEl = document.getElementById("cartTotal");
    const countEl = document.getElementById("itemCount");
    if (totalEl) totalEl.textContent = "0";
    if (countEl) countEl.textContent = "0";

    return;
  }


  snap.forEach(docSnap => {
    const p = docSnap.data();
    const id = docSnap.id;
    const totalEl = document.getElementById("cartTotal");
    const countEl = document.getElementById("itemCount");

    total += p.price * p.quantity;
    count += p.quantity;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.title}">

        <div class="cart-info">
          <h4>${p.title}</h4>
          <div class="cart-qty">
            <button class="qty-btn minus" data-id="${id}">−</button>
            <span class="qty-value">${p.quantity}</span>
            <button class="qty-btn plus" data-id="${id}">+</button>
          </div>
          <p>₹${p.price * p.quantity}</p>     
        </div>

        <button class="remove-btn" data-id="${id}">
          Remove
        </button>
      </div>
    `;
  });

  if (totalEl) totalEl.textContent = total;
  if (countEl) countEl.textContent = count;

  attachRemoveHandlers();
  attachQuantityHandlers();
}

function attachRemoveHandlers() {
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await deleteDoc(doc(db, "users", currentUser.uid, "cart", id));
      loadCart(); // 🔥 re-render cart
    });
  });
}

function attachQuantityHandlers() {
  document.querySelectorAll(".qty-btn.plus").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await updateDoc(doc(db, "users", currentUser.uid, "cart", id), {
        quantity: increment(1)
      });
      loadCart();
    });
  });

  document.querySelectorAll(".qty-btn.minus").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const ref = doc(db, "users", currentUser.uid, "cart", id);

      const snap = await getDocs(collection(db, "users", currentUser.uid, "cart"));
      const item = snap.docs.find(d => d.id === id);

      if (!item) return;

      const qty = item.data().quantity;

      if (qty <= 1) {
        await deleteDoc(ref);
      } else {
        await updateDoc(ref, { quantity: increment(-1) });
      }

      loadCart();
    });
  });
}
