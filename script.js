// --- Basic Setup & Page Navigation ---
document.addEventListener('DOMContentLoaded', function() {
    const pageLinks = document.querySelectorAll('.page-link');
    const pages = document.querySelectorAll('.page-content');
    const mobileMenu = document.getElementById('mobile-menu');

    // Handle Bootstrap Collapse for mobile menu
    const bsCollapse = mobileMenu ? new bootstrap.Collapse(mobileMenu, {
        toggle: false
    }) : null;

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.add('d-none');
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.remove('d-none');
        }
        window.scrollTo(0, 0); // Scroll to top on page change
        if (bsCollapse && mobileMenu.classList.contains('show')) {
            bsCollapse.hide();
        }
    }
    
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });

    // Show home page by default
    showPage('home');
    
    // Populate Nigerian States
    const states = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"];
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }
});

// --- Form Switching Logic ---
const paymentBtn = document.getElementById('show-payment-form');
const reminderBtn = document.getElementById('show-reminder-form');
const paymentForm = document.getElementById('registrationForm');
const reminderForm = document.getElementById('reminderForm');

if (paymentBtn && reminderBtn) {
    paymentBtn.addEventListener('click', () => {
        paymentForm.classList.remove('d-none');
        reminderForm.classList.add('d-none');
    });

    reminderBtn.addEventListener('click', () => {
        reminderForm.classList.remove('d-none');
        paymentForm.classList.add('d-none');
    });
}

// --- EmailJS and Paystack Integration ---
(function() {
    // Initialize EmailJS with your Public Key
    emailjs.init("YjKxsPQhrZu1z_aHT"); 
})();

// --- Success Modal Logic ---
const successModalEl = document.getElementById('success-modal');
const successModal = successModalEl ? new bootstrap.Modal(successModalEl) : null;
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');

function showModal(title, message) {
    if(successModal && modalTitle && modalMessage) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        successModal.show();
    }
}

// --- Form Submission Logic ---
const registrationForm = document.getElementById("registrationForm");
if (registrationForm) {
    registrationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Gather all form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const state = document.getElementById("state").value;
        const occupation = document.getElementById("occupation").value;
        const qualification = document.getElementById("qualification").value;
        const purpose = document.getElementById("purpose").value;
        const expectations = document.getElementById("expectations").value;
        const amount = 15000;

        let handler = PaystackPop.setup({
            key: "pk_live_0a90c333370ff5364c0617edaf31fc6cc23062ea", // Your Paystack Public Key
            email: email,
            amount: amount * 100,
            currency: "NGN",
            ref: "yas-" + Math.floor(Math.random() * 1000000000 + 1),
            metadata: {
                full_name: name,
                phone_number: phone,
                occupation: occupation,
            },
            callback: function (response) {
                console.log("Payment successful. Reference: " + response.reference);
                
                const paymentDetails = {
                    name, email, phone, state, occupation, qualification, purpose, expectations,
                    amount: `₦${amount.toLocaleString()}`, // Format amount with comma
                    reference: response.reference
                };
                sendConfirmationEmail(paymentDetails);
                registrationForm.reset();
                showModal(
                    "Payment Successful!",
                    "Thank you for registering. More details will be shared with you shortly via email."
                );
            },
            onClose: function () {
                console.log("Payment window closed.");
            },
        });
        handler.openIframe();
    });
}


const reminderFormEl = document.getElementById('reminderForm');
if (reminderFormEl) {
    reminderFormEl.addEventListener('submit', function(e) {
        e.preventDefault();

        // Using sendForm because the HTML inputs have `name` attributes.
        emailjs.sendForm('service_jku9etf', 'template_5458qnz', this)
            .then(res => {
                console.log('User confirmation sent successfully.');
                reminderFormEl.reset();
                showModal('Reminder Set!', 'Thank you! A confirmation has been sent to your email address.');
            })
            .catch(err => {
                console.error('Failed to send user confirmation.', err);
                showModal('Error', 'Failed to send your confirmation email. Please check the address and try again.');
            });
    });
}

function sendConfirmationEmail(details) {
    // The parameters here match your EmailJS template fields.
    const templateParams = {
        name: details.name,
        email: details.email,
        phone: details.phone,
        state: details.state,
        occupation: details.occupation,
        qualification: details.qualification,
        purpose: details.purpose,
        expectations: details.expectations,
        amount: details.amount,
        reference: details.reference,
    };
    
    // This sends the payment confirmation to the user.
    emailjs.send("service_jku9etf", "template_mky3b2b", templateParams)
        .then((res) => console.log("Confirmation email sent.", res.status))
        .catch((err) => console.log("Failed to send confirmation email.", err));
}
