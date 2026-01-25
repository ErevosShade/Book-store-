import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../core/firebase.js";
import { subscribe } from "../core/state.js";
import { addToCart } from "../services/cartService.js";
import { initAuthListener } from "../core/auth.js";

initAuthListener();
const filterBtn = document.querySelector(".filter-btn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");
const applyFilters = document.getElementById("applyFilters");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const categoryButtons = document.querySelectorAll(".category-btn");
const productGrid = document.getElementById("productGrid");
const params = new URLSearchParams(window.location.search);
const activeCategory = params.get("category");

let currentCategory = "All";
let currentUser = null;
let products = [];

subscribe((state) => {
  currentUser = state.user;
});


function productCardTemplate(p) {
  return `
    <div class="product-card">
      <a href="product.html?id=${p.id}" class="product-link">
        <div class="product-image">
          <img src="${p.image}" alt="${p.title}" />
        </div>
      </a>

      <div class="product-info">
        <a href="product.html?id=${p.id}" class="product-title"></a>
        <h3>${p.title}</h3>
        </a>

        <p class="author">${p.author}</p>
        <p class="desc">${p.description}</p>

        <div class="price-row">
          <span class="price">$${p.price}</span>
          <button class="btn-cart" data-id="${p.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}


async function loadProducts() {

  if(!productGrid) return;
  productGrid.innerHTML = "";
  products.length = 0;

  let q;

  if (currentCategory === "All") {
    q = collection(db, "products");
  } else {
    q = query(
      collection(db, "products"),
      where("category", "==", currentCategory)
    );
  }

  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    data.id = docSnap.id; // ✅ attach Firestore ID
    products.push(data);
    productGrid.innerHTML += productCardTemplate(data);
  });


}

productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-cart");
  if (!btn) return;

  if (!currentUser) {
    alert("Please sign in to add items to cart");
    return;
  }

  const product = products.find(p => p.id === btn.dataset.id);
  if (!product) return;

  addToCart(currentUser.uid, product);
  showCartToast(`${product.title} added to cart`);
});


function showCartToast(message) {
  const toast = document.getElementById("cartToast");
  const msg = document.getElementById("toastMsg");

  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // remove active from all buttons
    categoryButtons.forEach(b => b.classList.remove("active"));

    // set active button
    btn.classList.add("active");

    // update selected category
    currentCategory = btn.dataset.category;

    // reload products
    loadProducts();
  });
});



filterBtn.addEventListener("click", () => {
  filterPanel.style.display =
    filterPanel.style.display === "block" ? "none" : "block";
});

priceRange.addEventListener("input", () => {
  priceValue.textContent = `$0 – $${priceRange.value}`;
});

closeFilter.addEventListener("click", () => {
  filterPanel.style.display = "none";
});

applyFilters.addEventListener("click", () => {
  filterPanel.style.display = "none";
});

if (activeCategory) {
  currentCategory = activeCategory;

  // 🔥 SYNC UI WITH URL CATEGORY
  categoryButtons.forEach(btn => {
    btn.classList.remove("active");

    if (btn.dataset.category === activeCategory) {
      btn.classList.add("active");
    }
  });
}

loadProducts();

