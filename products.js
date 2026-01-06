const products = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 24.99,
    rating: 4.8,
    reviews: 1247,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794"
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    price: 27.99,
    rating: 4.9,
    reviews: 2134,
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 26.99,
    rating: 4.7,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
  },
  {
    id: "4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 23.99,
    rating: 4.6,
    reviews: 1654,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93"
  }
];

function renderStars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return "★".repeat(full) + "☆".repeat(empty);
}

function productCardTemplate(p) {
  return `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.title}" />
      </div>

      <div class="product-info">
        <h3>${p.title}</h3>
        <p class="author">${p.author}</p>

        <div class="rating">
          <span class="stars">${renderStars(p.rating)}</span>
          <span class="rating-text">${p.rating} (${p.reviews})</span>
        </div>

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

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map(productCardTemplate).join("");
}

renderProducts();
