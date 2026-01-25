import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../core/firebase.js";
import { subscribe } from "../core/state.js";
import { addToCart } from "../services/cartService.js";
import { initAuthListener } from "../core/auth.js";

initAuthListener();
const filterBtn = document.querySelector(".filter-btn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");
const applyFiltersBtn = document.getElementById("applyFilters");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const categoryButtons = document.querySelectorAll(".category-btn");
const productGrid = document.getElementById("productGrid");
const params = new URLSearchParams(window.location.search);
const activeCategory = params.get("category");
// Trial
let currentUser = null;
let allProducts = [];
let filteredProducts = [];

const filterState = {
  category: "All",
  search: "",
  maxPrice: Infinity,
  sort: "default"
};

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
        <a href="product.html?id=${p.id}" class="product-title">
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
  if (!productGrid) return;

  productGrid.innerHTML = "";
  allProducts.length = 0;

  // 🔥 FETCH ALL PRODUCTS ONCE
  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach(docSnap => {
    allProducts.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  // APPLY FILTERS AFTER FETCH
  applyFilters();
}

function applyFilters() {
  filteredProducts = allProducts.filter(p => {

    // CATEGORY
    if (
      filterState.category !== "All" &&
      p.category !== filterState.category
    ) {
      return false;
    }

    // PRICE
    if (p.price > filterState.maxPrice) {
      return false;
    }

    // SEARCH
    if (filterState.search) {
      const text = `${p.title} ${p.author}`.toLowerCase();
      if (!text.includes(filterState.search)) return false;
    }

    return true;
  });

  switch (filterState.sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case "title-asc":
      filteredProducts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "title-desc":
      filteredProducts.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      break;
  }

  renderProducts();
}

function renderProducts() {
  productGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filteredProducts.forEach(p => {
    productGrid.innerHTML += productCardTemplate(p);
  });
}


productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-cart");
  if (!btn) return;

  if (!currentUser) {
    alert("Please sign in to add items to cart");
    return;
  }

  const product = allProducts.find(p => p.id === btn.dataset.id);
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
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    filterState.category = btn.dataset.category;
    applyFilters();
  });
});




filterBtn.addEventListener("click", () => {
  filterPanel.style.display =
    filterPanel.style.display === "block" ? "none" : "block";
});

priceRange.addEventListener("input", () => {
  filterState.maxPrice = Number(priceRange.value);
  priceValue.textContent = `$0 – $${priceRange.value}`;
  applyFilters();
});


closeFilter.addEventListener("click", () => {
  filterPanel.style.display = "none";
});

applyFiltersBtn.addEventListener("click", () => {
  filterPanel.style.display = "none";
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  filterState.search = e.target.value.toLowerCase();
  applyFilters();
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
  filterState.sort = e.target.value;
  applyFilters();
});



if (activeCategory) {
  filterState.category = activeCategory;

  // 🔥 SYNC UI WITH URL CATEGORY
  categoryButtons.forEach(btn => {
    btn.classList.toggle("active",
      btn.dataset.category === activeCategory
    );
  });
}

loadProducts();

