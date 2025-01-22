// Toggle dropdown visibility
const button = document.querySelector('.dropdown-button');
const content = document.getElementById('dropdown-content');
button.addEventListener('click', () => {
    console.log('Dropdown clicked');
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
});

// EmailJS integration
emailjs.init("QZMnm--kOwgZn4vsu"); // Replace with your actual public key
document.getElementById("form-style").addEventListener("submit", function (e) {
    e.preventDefault();
    emailjs.sendForm("service_8jct4e6", "template_2xov5r4", this)
        .then(() => {
            alert("Message sent successfully!");
        })
        .catch((error) => {
            alert("Failed to send message: " + error.text);
        });
});

// Session price data
const sessionPrices = {
    mentoring: { single: 150, packages: { 2: 300, 3: 450, 4: 600, 5: 750, 6: 850, 7: 925, 8: 1000 } },
    "guided-meditation": { single: 75, packages: { 3: 200, 4: 260, 5: 325, 6: 390, 7: 455, 8: 520 } },
    "quick-checkin": { single: 70 },
    "custom-session": { single: "Contact for pricing" }
};

// Elements
const sessionTypeElement = document.getElementById("session-type");
const sessionCountContainer = document.getElementById("session-count-container");
const sessionCountElement = document.getElementById("session-count");
const totalPriceElement = document.getElementById("total-price");
const calculatePriceButton = document.getElementById("calculate-price");

// Display session count input if required
sessionTypeElement.addEventListener("change", function () {
    const sessionType = sessionTypeElement.value;
    if (sessionType === "mentoring" || sessionType === "guided-meditation") {
        sessionCountContainer.style.display = "block";
    } else {
        sessionCountContainer.style.display = "none";
        totalPriceElement.textContent = `Total Price: $${sessionPrices[sessionType].single}`;
    }
});

// Calculate and display total price
calculatePriceButton.addEventListener("click", function () {
    const sessionType = sessionTypeElement.value;
    const sessionCount = parseInt(sessionCountElement.value, 10);

    if (sessionType === "custom-session") {
        totalPriceElement.textContent = "Total Price: Contact for pricing";
        // Scroll to form for custom session
        const formContainer = document.getElementById("form-style");
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: "smooth" });
        }
    } else {
        const pricingInfo = sessionPrices[sessionType];
        if (sessionCount > 1 && pricingInfo.packages && pricingInfo.packages[sessionCount]) {
            totalPriceElement.textContent = `Total Price: $${pricingInfo.packages[sessionCount]}`;
        } else {
            totalPriceElement.textContent = `Total Price: $${sessionCount * pricingInfo.single}`;
        }
    }
});

// PayPal Button rendering
paypal.Buttons({
    createOrder: function(data, actions) {
        const sessionType = document.getElementById('session-type').value;
        const sessionCount = document.getElementById('session-count').value || 1;
        const itemPrice = calculatePrice(sessionType, sessionCount);

        return fetch('http://localhost:3000/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    { id: sessionType, quantity: sessionCount, price: itemPrice }
                ],
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to create order.');
            }
            return response.json();
        })
        .then((orderData) => {
            return orderData.id;
        })
        .catch((error) => {
            console.error("Error creating order:", error);
            alert('There was an issue creating your order. Please try again.');
        });
    },
    onApprove: function(data, actions) {
        return fetch(`http://localhost:3000/capture-order/${data.orderID}`, {
            method: 'POST',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to capture order.');
            }
            return response.json();
        })
        .then((details) => {
            alert(`Transaction completed by ${details.payer.name.given_name}`);
        })
        .catch((err) => {
            console.error('Error capturing order:', err);
            alert('There was an issue capturing your order. Please try again.');
        });
    },
    onError: function(err) {
        console.error('An error occurred:', err);
        alert('Something went wrong with your payment. Please try again.');
    },
}).render('#paypal-button-container'); // Render PayPal button inside this div

// Helper function to calculate price
function calculatePrice(sessionType, sessionCount) {
    const pricingInfo = sessionPrices[sessionType];
    if (pricingInfo.packages && pricingInfo.packages[sessionCount]) {
        return pricingInfo.packages[sessionCount];
    }
    return sessionCount * pricingInfo.single;
}

// Video modal functionality
const videos = document.querySelectorAll('.scroll-container .block video');
const modal = document.getElementById('imageModal');
const modalVideo = document.getElementById('modalVideo');
const closeBtn = document.querySelector('.modal .close');

videos.forEach(video => {
  video.addEventListener('click', () => {
    modal.style.display = 'block';
    modalVideo.src = video.src; // Set the modal video source
    modalVideo.play();
  });
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  modalVideo.pause();
  modalVideo.src = ''; // Stop video
});

// Close modal when clicking outside video
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = ''; // Stop video
  }
});

// Service Agreement Modal functionality
const termsModal = document.getElementById('terms-modal');
const termsLink = document.getElementById('terms-link');
const closeTermsBtn = termsModal.querySelector('.close');

termsLink.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default link behavior
  termsModal.style.display = 'block'; // Show the modal
});

closeTermsBtn.addEventListener('click', function () {
  termsModal.style.display = 'none'; // Hide the modal
});

window.addEventListener('click', function (event) {
  if (event.target === termsModal) {
    termsModal.style.display = 'none'; // Hide the modal
  }
});

// Checkbox and button enabling functionality
const checkbox = document.getElementById("agreement-checkbox");
const closeButton = document.getElementById("close-modal");

checkbox.addEventListener("change", function() {
    closeButton.disabled = !checkbox.checked;
});

// Intersection Observer for Animations
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("button:not(#send-button), .dropdown-button");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    elements.forEach(element => {
        observer.observe(element);
    });
});
