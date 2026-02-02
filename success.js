// ===== Get Data from localStorage =====
const customerInfo = JSON.parse(localStorage.getItem("customerInfo")) || {};
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Helper Function: Format as Peso =====
function formatPeso(amount) {
  return amount.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  // ===== Check if Order Exists =====
  if (!customerInfo.name || cart.length === 0) {
    document.querySelector(".payment-successful-container").innerHTML = `
      <h1 class="payment-successful">⚠ No Order Found</h1>
      <p>Please return to the homepage and place an order first.</p>
      <a href="home.html" class="back-to-home">Return to Home</a>
    `;
    return;
  }

  // ===== Display Customer Info =====
  document.getElementById("cust-name").textContent = customerInfo.name;
  document.getElementById("cust-contact").textContent = customerInfo.contact;
  document.getElementById("cust-address").textContent = `${customerInfo.barangay}, ${customerInfo.address}`;
  document.getElementById("cust-notes").textContent = customerInfo.notes || "No additional notes.";

  // ===== Compute Order Summary =====
  let subtotal = 0;
  let maxPrepTime = 0;

  const prepTimes = {
    "drink": 5,
    "meal": 15,
    "light-meal": 10
  };

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    let prep = prepTimes[item.type] || 0;
    if (prep > maxPrepTime) maxPrepTime = prep;
  });

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
  const deliveryFee = deliveryData[barangay]?.fee || 0;
  const barangayEta = deliveryData[barangay]?.eta || 0;

  const total = subtotal + deliveryFee;
  const eta = barangayEta + maxPrepTime + 10;

  // ===== Display Order Items =====
  const orderItemsDiv = document.getElementById("order-items");
  orderItemsDiv.innerHTML = `
    ${cart.map(item => `
      <p>${item.name} x${item.qty} — ₱${formatPeso(item.price * item.qty)}</p>
    `).join("")}
  `;

  // ===== Display Totals =====
  document.getElementById("subtotal").textContent = formatPeso(subtotal);
  document.getElementById("delivery-fee").textContent = formatPeso(deliveryFee);
  document.getElementById("total").textContent = formatPeso(total);
  document.getElementById("eta").textContent = `${eta} mins`;

  // ===== Generate and Show Order ID =====
  const orderId = "MC-" + Date.now().toString().slice(-6);
  localStorage.setItem("orderId", orderId);

  const header = document.querySelector(".payment-successful-container");

  const idContainer = document.createElement("div");
  idContainer.classList.add("order-id-container");
  idContainer.style.display = "flex";
  idContainer.style.alignItems = "center";
  idContainer.style.gap = "8px";
  idContainer.style.marginTop = "12px";

  idContainer.innerHTML = `
    <p style="margin: 0;">
      <strong>Order ID:</strong> <span id="order-id">${orderId}</span>
    </p>
    <svg id="copy-order-id" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#888" style="cursor:pointer;">
      <path d="M320-120q-33 0-56.5-23.5T240-200v-560h80v560h400v80H320Zm160-160q-33 0-56.5-23.5T400-360v-560q0-33 23.5-56.5T480-1000h400q33 0 56.5 23.5T960-920v560q0 33-23.5 56.5T880-280H480Zm0-80h400v-560H480v560Z"/>
    </svg>
  `;

  const customerDetails = document.getElementById("customer-details");
  header.insertBefore(idContainer, customerDetails);

  // ===== Copy to Clipboard =====
  document.getElementById("copy-order-id").addEventListener("click", () => {
    const orderIdText = document.getElementById("order-id").textContent;
    navigator.clipboard.writeText(orderIdText)
      .then(() => {
        const icon = document.getElementById("copy-order-id");
        icon.setAttribute("fill", "#4CAF50");

        // Create temporary "Copied!" toast
        const copiedMsg = document.createElement("span");
        copiedMsg.textContent = "Copied!";
        copiedMsg.style.marginLeft = "6px";
        copiedMsg.style.color = "#4CAF50";
        copiedMsg.style.fontSize = "0.9em";
        copiedMsg.style.fontWeight = "600";
        copiedMsg.style.transition = "opacity 0.3s ease";
        copiedMsg.style.opacity = "1";

        icon.parentElement.appendChild(copiedMsg);

        // Remove after 1.5 seconds
        setTimeout(() => {
          copiedMsg.style.opacity = "0";
          setTimeout(() => copiedMsg.remove(), 300);
          icon.setAttribute("fill", "#666");
        }, 1500);
      })
      .catch(err => console.error("Failed to copy:", err));
  });


  // ===== Save Order to Database =====
  (async () => {
    try {
      const res = await fetch("save-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          customer: {
            name: customerInfo.name,
            contact: customerInfo.contact,
            address: `${customerInfo.barangay}, ${customerInfo.address}`,
            notes: customerInfo.notes
          },
          items: cart,
          subtotal,
          delivery_fee: deliveryFee,
          total
        })
      });

      const data = await res.json();
      if (data.success) localStorage.removeItem("cart");
    } catch (err) {}
  })();
});
