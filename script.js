// Populate state dropdown
const states = [
  "Select State",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const stateSelect = document.getElementById("state");
states.forEach((state) => {
  const option = document.createElement("option");
  option.text = state;
  option.value = state;
  stateSelect.add(option);
});

function getAmount() {
  const today = new Date();
  const deadline = new Date("2025-08-15T23:59:59");
  // 30000 Naira = 3,000,000 kobo, 50000 Naira = 5,000,000 kobo
  return today <= deadline ? 3000000 : 5000000;
}

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const state = document.getElementById("state").value;
    const occupation = document.getElementById("occupation").value;
    const qualification = document.getElementById("qualification").value;
    const purpose = document.getElementById("purpose").value;
    const amount = getAmount();

    const handler = PaystackPop.setup({
      key: "pk_test_44b1466e12f99db2cbb42d161c1cd0861462c930",
      email: email,
      amount: amount,
      currency: "NGN",
      ref: "YAS-" + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        const data = {
          name,
          phone,
          email,
          state,
          occupation,
          qualification,
          purpose,
          amount: amount / 100,
          reference: response.reference,
          payment_date: new Date().toISOString(),
        };

        fetch(
          "https://script.google.com/macros/s/AKfycbympXhxMJ9VrQD-fjtIVwdO7m5WC3reWJjLXe_y_3FI9r4oCR2yvn3POvQRJHG5VUv2JQ/exec",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        )
          .then((res) => res.json())
          .then(() => {
            // Show flashscreen
            const flashscreen = document.getElementById("flashscreen");
            flashscreen.classList.remove("d-none");
            about-program.classList.remove("d-none");

            // Scroll smoothly to About Program section
            document
              .getElementById("about-program")
              .scrollIntoView({ behavior: "smooth" });

            // Disable the form inputs while flashscreen shows
            document
              .getElementById("registrationForm")
              .querySelectorAll("input, select, button")
              .forEach((el) => (el.disabled = true));
          })
          .catch((err) => alert("Error saving data: " + err));
      },
      onClose: function () {
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  });

// Close flashscreen and reset form on clicking the Continue button
document
  .getElementById("flashscreen-close")
  .addEventListener("click", () => {
    const flashscreen = document.getElementById("flashscreen");
    flashscreen.classList.add("d-none");

    // Enable form inputs again
    document
      .getElementById("registrationForm")
      .querySelectorAll("input, select, button")
      .forEach((el) => (el.disabled = false));

    // Reset the form
    document.getElementById("registrationForm").reset();
  });
