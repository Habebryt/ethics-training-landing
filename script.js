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
  return today <= deadline ? 3000000 : 5000000;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("registrationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const state = document.getElementById("state").value;
    const occupation = document.getElementById("occupation").value;
    const qualification = document.getElementById("qualification").value;
    const purpose = document.getElementById("purpose").value;
    const amount = getAmount();
    const reference = "YAS-" + Math.floor(Math.random() * 1000000000 + 1);
    const payment_date = new Date().toISOString();

    // Submit to Google Sheet immediately (before payment)
    const params = new URLSearchParams();
    params.append("name", name);
    params.append("phone", phone);
    params.append("email", email);
    params.append("state", state);
    params.append("occupation", occupation);
    params.append("qualification", qualification);
    params.append("purpose", purpose);
    params.append("amount", amount / 100);
    params.append("reference", reference);
    params.append("payment_date", payment_date);

    fetch("https://script.google.com/macros/s/AKfycbympXhxMJ9VrQD-fjtIVwdO7m5WC3reWJjLXe_y_3FI9r4oCR2yvn3POvQRJHG5VUv2JQ/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    }).catch((err) => console.error("Data insert failed:", err));

    const handler = PaystackPop.setup({
      key: "pk_test_44b1466e12f99db2cbb42d161c1cd0861462c930",
      email: email,
      amount: amount,
      currency: "NGN",
      ref: reference,
      callback: function () {
        const flashscreen = document.getElementById("flashscreen");
        flashscreen.classList.remove("d-none");
        document.getElementById("about-program").classList.remove("d-none");
        document.getElementById("about-program").scrollIntoView({ behavior: "smooth" });
        document.getElementById("registrationForm").reset();
      },
      onClose: function () {
        alert("Payment window closed.");
      }
    });

    handler.openIframe();
  });

  const flashscreenClose = document.getElementById("flashscreen-close");
  if (flashscreenClose) {
    flashscreenClose.addEventListener("click", () => {
      document.getElementById("flashscreen").classList.add("d-none");
      document.getElementById("registrationForm").reset();
    });
  }
});
