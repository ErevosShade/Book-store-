import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";
const filterBtn = document.querySelector(".filter-btn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");
const applyFilters = document.getElementById("applyFilters");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

let currentCategory = "All";



function productCardTemplate(p) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.title}" />
      </div>

      <div class="product-info">
        <h3>${p.title}</h3>
        <p class="author">${p.author}</p>
        <p class="desc">${p.description}</p>

        <div class="price-row">
          <span class="price">$${p.price}</span>
          <button class="btn-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

async function loadProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

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

  snapshot.forEach(doc => {
    grid.innerHTML += productCardTemplate(doc.data());
  });
}


loadProducts();

const categoryButtons = document.querySelectorAll(".category-btn");

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
