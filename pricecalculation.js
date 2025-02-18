// Session price data
const sessionPrices = {
    mentoring: { single: 150, packages: { 2: 300, 3: 450, 4: 600, 5: 750, 6: 850, 7: 925, 8: 1000 } },
    "guided-meditation": { single: 75, packages: { 3: 200, 4: 260, 5: 325, 6: 390, 7: 455, 8: 520 } },
    "quick-checkin": { single: 70 },
    "custom-session": { single: "Contact for pricing" }
};

// Bulk discount mapping
const bulkDiscounts = {
    mentoring: { 4: 50, 8: 150, 12: 300, 16: 500, 20: 750, 28: 1000 },
    "guided-meditation": { 4: 25, 8: 75, 12: 150, 16: 250, 20: 375, 28: 550 }
};

// Elements
const sessionTypeElement = document.getElementById("session-type");
const sessionCountContainer = document.getElementById("session-count-container");
const sessionCountElement = document.getElementById("session-count");
const totalPriceElement = document.getElementById("total-price");
const calculatePriceButton = document.getElementById("calculate-price");

// Set max session count
sessionCountElement.setAttribute("max", "28");

// Display session count input if required
sessionTypeElement.addEventListener("change", function () {
    const sessionType = sessionTypeElement.value;
    sessionCountElement.value = ""; // Reset count on change

    if (sessionType === "mentoring" || sessionType === "guided-meditation") {
        sessionCountContainer.style.display = "block";
    } else {
        sessionCountContainer.style.display = "none";
        totalPriceElement.textContent = `Total Price: $${sessionPrices[sessionType].single}`;
    }
});

// Validate session count input
sessionCountElement.addEventListener("input", function () {
    if (sessionCountElement.value > 28) {
        sessionCountElement.value = 28; // Enforce max limit
    }
});

// Calculate and display total price
calculatePriceButton.addEventListener("click", function () {
    const sessionType = sessionTypeElement.value;
    let sessionCount = parseInt(sessionCountElement.value, 10) || 1;

    // Enforce max session count
    if (sessionCount > 28) sessionCount = 28;

    if (sessionType === "custom-session") {
        totalPriceElement.textContent = "Total Price: Contact for pricing";
        const formContainer = document.getElementById("form-style");
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: "smooth" });
        }
    } else {
        const totalPrice = calculatePrice(sessionType, sessionCount);
        totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

    }
});

// Helper function to calculate price with discounts
function calculatePrice(sessionType, sessionCount) {
    if (sessionCount > 28) sessionCount = 28; // Enforce max limit

    const pricingInfo = sessionPrices[sessionType];
    let basePrice = sessionCount * pricingInfo.single;
    let discount = 0;

    // Check for package pricing first
    if (pricingInfo.packages && pricingInfo.packages[sessionCount]) {
        basePrice = pricingInfo.packages[sessionCount];
    }

    // Apply bulk discounts
    if (bulkDiscounts[sessionType]) {
        for (let milestone in bulkDiscounts[sessionType]) {
            if (sessionCount >= milestone) {
                discount = bulkDiscounts[sessionType][milestone];
            }
        }
    }

    return basePrice - discount;
}

// PayPal Button rendering
paypal.Buttons({
    createOrder: async function (data, actions) {
        const sessionType = document.getElementById('session-type').value;
        const sessionCount = parseInt(document.getElementById('session-count').value, 10) || 1;
        const totalPrice = calculatePrice(sessionType, sessionCount);

        const response = await fetch("http://localhost:3000/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionType,
                sessionCount,
                totalPrice: totalPrice.toFixed(2)
            }),
        });

        const orderData = await response.json();
        if (!orderData.approval_url) throw new Error("Approval URL not received");

        // Redirect user to PayPal checkout page
        window.location.href = orderData.approval_url;
    },
    onCancel: function (data) {
        alert("Payment was cancelled.");
    },
    onError: function (err) {
        console.error("Error during payment:", err);
        alert("Something went wrong. Please try again.");
    }
}).render("#paypal-button-container");

