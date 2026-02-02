document.querySelector(".track-btn").addEventListener("click", async () => {
  const orderId = document.querySelector(".order-input").value.trim();
  const resultDiv = document.querySelector(".order-result");
  const orderCard = document.querySelector(".order-card");

  if (!orderId) {
    orderCard.innerHTML = `<p>Please enter your Order ID.</p>`;
    resultDiv.style.display = "block";
    return;
  }

  try {
    const res = await fetch("get-order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId }),
    });

    const data = await res.json();

    if (data.success) {
      const order = data.order;

      // ✅ Format order items
      let itemsHTML = "No items found";
      if (Array.isArray(order.items) && order.items.length > 0) {
        itemsHTML = order.items
          .map(
            (item) =>
              `${item.name} x${item.qty} — ₱${parseFloat(item.price * item.qty).toFixed(2)}`
          )
          .join("<br>");
      }

      // ✅ Format date nicely
      const formattedDate = new Date(order.created_at).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      // ✅ Display everything in the card
      orderCard.innerHTML = `
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${order.order_id}</p>
        <p><strong>Customer Name:</strong> ${order.customer_name}</p>
        <p><strong>Contact:</strong> ${order.customer_contact}</p>
        <p><strong>Address:</strong> ${order.customer_address}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Items:</strong><br>${itemsHTML}</p>
        <p><strong>Total:</strong> ₱${parseFloat(order.total).toFixed(2)}</p>
        <p><strong>Date Ordered:</strong> ${formattedDate}</p>
      `;

      resultDiv.style.display = "block";
    } else {
      orderCard.innerHTML = `<p>${data.message}</p>`;
      resultDiv.style.display = "block";
    }
  } catch (err) {
    console.error("Error:", err);
    orderCard.innerHTML = `<p style="color:red;">⚠ Server error. Please try again later.</p>`;
    resultDiv.style.display = "block";
  }
});
