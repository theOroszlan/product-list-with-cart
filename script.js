// VARIABLES
const productsContainer = document.querySelector(".products-grid");
const cartSection = document.querySelector(".cart");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = cartSection.querySelector(".cart-items");
const orderTotalEl = cartSection.querySelector(".order-total-price");

let products = [];

// CLASSES
class Cart {
  constructor() {
    this.items = [];
  }

  removeItem = (id) => {
    let index = this.items.findIndex((item) => item.id === id);

    if (index === -1) return;

    this.items.splice(index, 1);
  };

  addItem = (id) => {
    let item = this.items.find((item) => item.id === id);
    if (!item) {
      const product = products.find((prod) => prod.id === id);
      const price = product.price;
      item = {
        id,
        name: product.name,
        price,
        qty: 1,
        totalPrice: price,
      };

      this.items.push(item);
      return;
    }

    item.qty += 1;
    item.totalPrice = item.qty * item.price;
  };

  updateQuantity = (id) => {
    let item = this.items.find((item) => item.id === id);

    if (!item) return;

    item.qty -= 1;
    item.totalPrice = item.qty * item.price;
    if (item.qty <= 0) {
      this.removeItem(id);
    }
  };

  getNumItems = () => {
    if (this.items.length === 0) return 0;

    const total = this.items.reduce((accumulator, item) => {
      return (accumulator += item.qty);
    }, 0);

    return total;
  };

  calculateTotalPrice = () => {
    if (this.items.length === 0) return 0;

    const total = this.items.reduce((accumulator, item) => {
      return (accumulator += item.totalPrice);
    }, 0);
    return total;
  };
}
const cart = new Cart();

// FUNCTIONS
const setProducts = (data) => {
  products = data;
};

const getProductCard = (childEl) => {
  return childEl.closest(".product");
};

const getQuantityEl = (card) => {
  return card.querySelector(".quantity-value");
};

const getCartItem = (id) => {
  return cart.items.find((item) => item.id === id);
};

const updateCart = () => {
  const items = cart.items;
  const total = cart.calculateTotalPrice();
  const count = cart.getNumItems();

  cartItemsEl.innerHTML = "";

  items.forEach((item) => {
    const itemEl = document.createElement("li");
    itemEl.classList.add("cart-item");

    itemEl.innerHTML = `
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <div>
                <span class="cart-item-quantity">${item.qty}x</span>
                <span class="cart-item-price">@$${item.price.toFixed(2)}</span>
                <span class="cart-item-total-price">${item.totalPrice.toFixed(2)}</span>
            </div>
        </div>
        <button
        data-id="${item.id}"
        aria-label="Remove ${item.name} from cart"
        class="cart-remove-item"
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
            d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
            />
        </svg>
        </button>`;

    cartItemsEl.appendChild(itemEl);
  });

  cartCountEl.textContent = count;
  orderTotalEl.textContent = `$${total.toFixed(2)}`;
};

const displayProducts = (products) => {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productEl = document.createElement("div");

    productEl.classList.add("product", "grid-item");
    productEl.setAttribute("data-id", product.id);

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
            <button class="add-to-cart cart-control">
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

// EVENT HANDLING
productsContainer.addEventListener("click", (e) => {
  const addToCartBtn = e.target.closest(".add-to-cart");
  const decreaseBtn = e.target.closest(".decrement-quantity-btn");
  const increaseBtn = e.target.closest(".increment-quantity-btn");

  if (addToCartBtn) {
    const productCard = getProductCard(addToCartBtn);
    const quantityEl = getQuantityEl(productCard);
    const decrementBtn = productCard.querySelector(".decrement-quantity-btn");
    const productId = Number(productCard.dataset.id);

    productCard.classList.add("selected");
    quantityEl.textContent = 1;
    decrementBtn.focus();
    cart.addItem(productId);
    updateCart();
    if (!cartSection.classList.contains("filled-cart")) {
      cartSection.classList.add("filled-cart");
    }
    return;
  }

  if (decreaseBtn) {
    const productCard = getProductCard(decreaseBtn);
    const quantityEl = getQuantityEl(productCard);
    const addToCartEl = productCard.querySelector(".add-to-cart");
    const productId = Number(productCard.dataset.id);

    cart.updateQuantity(productId);
    let item = getCartItem(productId);
    if (!item) {
      productCard.classList.remove("selected");
      addToCartEl.focus();
    }
    quantityEl.textContent = item?.qty ?? 0;
    updateCart();

    if (cart.items.length <= 0) {
      cartSection.classList.remove("filled-cart");
    }
    return;
  }

  if (increaseBtn) {
    const productCard = getProductCard(increaseBtn);
    const quantityEl = getQuantityEl(productCard);
    const productId = Number(productCard.dataset.id);

    cart.addItem(productId);
    const item = getCartItem(productId);
    quantityEl.textContent = item.qty;
    updateCart();
    return;
  }
});

cartSection.addEventListener("click", (e) => {
  const removeItemBtn = e.target.closest(".cart-remove-item");

  if (removeItemBtn) {
    const itemId = Number(removeItemBtn.dataset.id);
    const productCard = document.querySelector(`[data-id="${itemId}"]`);
    const quantityEl = getQuantityEl(productCard);

    cart.removeItem(itemId);
    productCard.classList.remove("selected");
    quantityEl.textContent = 0;
    updateCart();
    if (cart.items.length <= 0) {
      cartSection.classList.remove("filled-cart");
    }

    return;
  }
});
