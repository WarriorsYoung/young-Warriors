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



// Video modal functionality
const videos = document.querySelectorAll('.scroll-container .block video');
const modal = document.getElementById('imageModal');
const modalVideo = document.getElementById('modalVideo');
const closeBtn = document.querySelector('.modal .close');

videos.forEach(video => {
    video.addEventListener('click', () => {
        modal.style.display = 'block';
        
        // Ensure the correct video is played by setting a new source
        modalVideo.src = video.getAttribute('src'); 
        modalVideo.play();
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = ''; // Clear the source to stop playback
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
