document.getElementById("customer-info-form").addEventListener("submit", function(e) {
    e.preventDefault(); // para hindi mag-reload

    // Kunin ang values
    const name = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const barangay = document.getElementById('barangay').value;
    const address = document.getElementById('address').value.trim();
    const notes = document.getElementById('notes').value.trim();

    // Simple validation
    if (!name || !contact || !barangay || !address) {
        alert("Please fill in all required fields.");
        return;
    }

    // Save customer info sa localStorage
    const customerInfo = { name, contact, barangay, address, notes };
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));

    // Redirect sa summary.html
    window.location.href = "summary.html";
});
