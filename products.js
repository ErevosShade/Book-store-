import { collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";
import { auth } from "./firebase.js";

const filterBtn = document.querySelector(".filter-btn");
const filterPanel = document.getElementById("filterPanel");
const closeFilter = document.getElementById("closeFilter");
const applyFilters = document.getElementById("applyFilters");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const categoryButtons = document.querySelectorAll(".category-btn");

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
          <button class="btn-cart" data-id="${p.id}">
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

  const products = [];

  snapshot.forEach(docSnap => {
  const data = docSnap.data();
  data.id = docSnap.id; // ✅ attach Firestore ID
  products.push(data);
  grid.innerHTML += productCardTemplate(data);
});


  setTimeout(() => {
    document.querySelectorAll(".btn-cart").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        addToCart(products[i]);
      });
    });
  }, 0);

}

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


loadProducts();

async function addToCart(product) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in to add items to cart");
    return;
  }

  const cartRef = doc(db, "users", user.uid, "cart", product.id);
  const snap = await getDoc(cartRef);

  if (snap.exists()) {
    await updateDoc(cartRef, {
      quantity: increment(1)
    });
  } else {
    await setDoc(cartRef, {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  showCartToast(`${product.title} added to cart`);
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
