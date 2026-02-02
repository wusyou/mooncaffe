// ====== Initialize cart ======
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = 0;

// Compute cartCount base sa restored cart
cart.forEach(item => {
    cartCount += item.qty;
});

// DOM elements
const checkoutBtn = document.getElementById("checkout-btn");
const cartItemsDiv = document.getElementById("cart-items");

// ====== Helper Functions ======
function updateBadge() {
    const badge = document.getElementById("cart-badge");
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? "inline-block" : "none";
}

function renderCart() {
    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <span>${item.name} - ₱${item.price}</span>
            <div class="cart-item-controls">
                <button onclick="updateCartItem(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="updateCartItem(${index}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${index})">x</button>
            </div>`;
        cartItemsDiv.appendChild(div);
    });

    document.getElementById("total").textContent = "Total: ₱" + total;

    updateCheckoutButton(); // ✅ Always check button state after render
}

function updateCheckoutButton() {
    checkoutBtn.disabled = cart.length === 0;
}

function updateCartItem(index, amount) {
    cart[index].qty += amount;
    if (cart[index].qty <= 0) {
        cartCount -= cart[index].qty + 1;
        cart.splice(index, 1);
    } else {
        cartCount += amount;
    }

    saveCart();
    updateBadge();
    renderCart();
}

function removeItem(index) {
    cartCount -= cart[index].qty;
    cart.splice(index, 1);
    saveCart();
    updateBadge();
    renderCart();
}

function changeQuantity(btn, amount) {
    const span = btn.parentElement.querySelector("span");
    let qty = parseInt(span.textContent);
    qty = Math.max(1, qty + amount);
    span.textContent = qty;
}

let products = [];

// Load products.json
fetch("products.json")
    .then(res => res.json())
    .then(data => {
    products = data;
  })
  .catch(err => console.error("Error loading products:", err));


function addToCart(item, price, btn) {
    const card = btn.parentElement;
    const qty = parseInt(card.querySelector(".quantity-controls span").textContent);

    const existingItem = cart.find(i => i.name === item);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        const product = products.find(p => p.name === item); // hanapin yung product sa products.json
        cart.push({ 
            name: item, 
            price, 
            qty, 
            type: product ? product.type : "unknown" 
        });
    }

    cartCount += qty;

    saveCart();
    updateBadge();
    renderCart();
    showToast(`${qty} × ${item} added to cart`);
    bounceCart();

    // Reset quantity
    card.querySelector(".quantity-controls span").textContent = 1;
}


function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("open");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function bounceCart() {
    const icon = document.querySelector(".cart-icon");
    icon.classList.add("bounce");
    setTimeout(() => icon.classList.remove("bounce"), 300);
}

// ====== Checkout Button ======
checkoutBtn.addEventListener("click", function() {
    saveCart();
    window.location.href = "info.html";
});

// ====== On page load ======
window.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    renderCart();
    updateCheckoutButton(); // ✅ Button enabled if cart has items
});
