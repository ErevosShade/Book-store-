import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../core/firebase.js";
import { subscribe } from "../core/state.js";
import { addToCart } from "../services/cartService.js";
import { initAuthListener } from "../core/auth.js";
import {
  toggleWishlist,
  isInWishlist,
  updateWishlistCount
} from "../services/wishlistService.js";

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
let ratingsMap = {};


const filterState = {
  category: "All",
  search: "",
  maxPrice: Infinity,
  sort: "default"
};

subscribe((state) => {
  currentUser = state.user;
});


function productCardTemplate(product) {
  const wished = isInWishlist(product.id);

  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
      </div>

      <div class="product-info">
        <div class="title-row">
          <h3>${product.title}</h3>
          <span class="rating">
            ${renderStars(ratingsMap[product.id]?.avg || 0)}
          </span>

        </div>

        <p class="desc">${product.description}</p>

        <div class="price-row">
          <span class="price">₹${product.price}</span>

          <div class="card-actions">
            <button class="wishlist-btn ${wished ? "active" : ""}"
              data-id="${product.id}">
                ❤️
              </button>


            <button class="btn-cart"
              onclick='addToCart(${JSON.stringify(product)})'>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function loadRatings() {
  const snapshot = await getDocs(collection(db, "ratings"));
  const temp = {};

  snapshot.forEach(docSnap => {
    const { productId, rating } = docSnap.data();
    if (!temp[productId]) {
      temp[productId] = { total: 0, count: 0 };
    }
    temp[productId].total += rating;
    temp[productId].count += 1;
  });

  ratingsMap = {};
  Object.keys(temp).forEach(pid => {
    ratingsMap[pid] = {
      avg: +(temp[pid].total / temp[pid].count).toFixed(1),
      count: temp[pid].count
    };
  });
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

function renderStars(rating) {
  const full = Math.floor(rating);
  let stars = "";

  for (let i = 0; i < 5; i++) {
    stars += i < full ? "★" : "☆";
  }

  return stars;
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

productGrid.addEventListener("click", (e) => {
  const wishBtn = e.target.closest(".wishlist-btn");
  if (!wishBtn) return;

  const productId = wishBtn.dataset.id;

  // 🔥 FIND FULL PRODUCT OBJECT
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  toggleWishlist(product);
  updateWishlistCount();

  // re-render to update heart state
  applyFilters();
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

async function init() {
  await loadRatings();
  await loadProducts();
}

init();

