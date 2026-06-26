// VARIABLES
const productsContainer = document.querySelector(".products-grid");
let products = [];

// FUNCTIONS
const setProducts = (data) => {
  products = data;
};

const displayProducts = (products) => {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productEl = document.createElement("div");

    productEl.classList.add("product", "grid-item");

    productEl.innerHTML = `           
            <picture>
              <source
                media="(min-width: 1024px)"
                srcset="${product.image.desktop}"
              />
              <source
                media="(min-width: 768px)"
                srcset="${product.image.tablet}"
              />
              <img
                class="product-image"
                src="${product.image.mobile}"
                alt="${product.name}"
              />
            </picture>
            <p class="product-category">${product.category}</p>
            <h2 class="product-name">${product.name}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button data-name="${product.name}" class="add-to-cart cart-control">
              <img
                aria-hidden="true"
                focusable="false"
                src="./assets/images/icon-add-to-cart.svg"
                alt=""
              /><span>Add to Cart</span>
            </button>
            <div class="quantity-selector cart-control">
              <button
                aria-label="Decrease ${product.name} quantity"
                class="quantity-btn decrement-quantity-btn"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="2"
                  fill="none"
                  viewBox="0 0 10 2"
                >
                  <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
                </svg>
              </button>
              <span role="status" aria-live="polite" class="quantity-value"
                >0</span
              >
              <button
                aria-label="Increase ${product.name} quantity"
                class="quantity-btn increment-quantity-btn"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    fill="currentColor"
                    d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                  />
                </svg>
              </button>
            </div>`;

    productsContainer.appendChild(productEl);
  });
};

const fetchProducts = async () => {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error("Unable to load products.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const loadProducts = async () => {
  const data = await fetchProducts();
  setProducts(data ?? []);

  displayProducts(products);
};
loadProducts();
