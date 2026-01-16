import { collection, getDocs } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";
const filterBtn = document.querySelector(".filter-btn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");
const applyFilters = document.getElementById("applyFilters");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");



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
  const snapshot = await getDocs(collection(db, "products"));
  const grid = document.getElementById("productGrid");

  grid.innerHTML = "";

  snapshot.forEach(doc => {
    grid.innerHTML += productCardTemplate(doc.data());
  });
}

loadProducts();

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
