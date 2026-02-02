// ===== Load customer info =====
const customerInfo = JSON.parse(localStorage.getItem('customerInfo')) || {};

// Map elements
document.getElementById('cust-name').textContent = customerInfo.name || "-";
document.getElementById('cust-contact').textContent = customerInfo.contact || "-";
document.getElementById('cust-address').textContent = customerInfo.barangay + ", " + (customerInfo.address || "-");
document.getElementById('cust-notes').textContent = customerInfo.notes || "No notes";

// ===== Load cart =====
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const orderItemsDiv = document.getElementById('order-items');

let subtotal = 0;
let maxPrepTime = 0; // pinakamahabang prep time

// ===== Prep times per product type =====
const prepTimes = {
    "drink": 5,
    "meal": 15,
    "light-meal": 10
};

cart.forEach(item => {
    const p = document.createElement('p');
    p.textContent = `${item.name} x${item.qty} — ₱${item.price * item.qty}`;
    orderItemsDiv.appendChild(p);

    subtotal += item.price * item.qty;

    // compute prep time base sa type
    let typeTime = prepTimes[item.type] || 0;
    if (typeTime > maxPrepTime) {
        maxPrepTime = typeTime;
    }
});

// ===== Delivery info per barangay =====
const deliveryData = {
    "Balon-Anito": { fee: 50, eta: 15 },
    "Camaya": { fee: 50, eta: 15 },
    "Ipag": { fee: 50, eta: 15 },
    "Maligaya": { fee: 70, eta: 20 },
    "Malaya": { fee: 70, eta: 25 },
    "Poblacion": { fee: 50, eta: 10 },
    "San Carlos": { fee: 50, eta: 15 },
    "San Isidro": { fee: 50, eta: 15 }
};

const barangay = customerInfo.barangay;
let deliveryFee = 0;
let barangayEta = 0;

if (barangay && deliveryData[barangay]) {
    deliveryFee = deliveryData[barangay].fee;
    barangayEta = deliveryData[barangay].eta;
}

// Final ETA = barangay eta + pinakamahabang prep time + buffer
let eta = barangayEta + maxPrepTime + 10;

// ===== Display totals =====
document.getElementById('subtotal').textContent = subtotal.toFixed(2);
document.getElementById('delivery-fee').textContent = deliveryFee.toFixed(2);
document.getElementById('total').textContent = (subtotal + deliveryFee).toFixed(2);
document.getElementById('eta').textContent = `${eta} mins`;

// ===== Payment Button =====
document.getElementById("pay-btn").addEventListener("click", async () => {
    const paymentMethod = document.getElementById("payment-method").value;
    const total = parseFloat(document.getElementById("total").textContent);

    if (paymentMethod !== "gcash") {
        alert("Currently, only GCash is supported.");
        return;
    }

    if (total < 1) {
    alert("Minimum order amount must be at least ₱1.00");
    return;
    } /* updated */


    try {
        const response = await fetch("create-checkout.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                payment_method: paymentMethod,
                amount: Math.round(total) // 🔥 siguradong integer
            })
        });

        const data = await response.json();

        if (data.checkout_url) {
            // ✅ Save order ID locally para magamit sa success.html
            localStorage.setItem("orderId", data.orderId);

            // Redirect to PayMongo checkout
            window.location.href = data.checkout_url;
        }

    } catch (error) {
        console.error(error);
        alert("Error occurred while processing payment.");
    }
});
