"use strict";

/* =========================================
   Dark Mode Toggle
   ========================================= */
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      themeToggleBtn.textContent = `☀️ Light Mode`;
    } else {
      themeToggleBtn.textContent = `🌙 Dark Mode`;
    }
  });
}

/* =========================================
   Hero Image Carousel
   ========================================= */
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
const slideInterval = 3000; // 3 seconds

function nextSlide() {
  if (slides.length === 0) {
    return;
  }

  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

if (slides.length > 1) {
  setInterval(nextSlide, slideInterval);
}

/* =========================================
   Cost Calculation
   ========================================= */

let cart = [];

const TAX_RATE = 0.08;

const cartItemsList = document.getElementById("cart-items");
const subtotalDisplay = document.getElementById("subtotal-display");
const taxDisplay = document.getElementById("tax-display");
const totalDisplay = document.getElementById("total-display");
const checkoutButton = document.getElementById("checkout-btn");
const addButtons = document.querySelectorAll(".add-btn");
const cartSummary = document.querySelector(".cart-summary");

// colors for messages
const ERROR_COLOR = `var(--state-error)`;
const SUCCESS_COLOR = `var(--state-success)`;

// Clear checkout message
function clearCheckoutMessage() {
  const messageEl = document.getElementById("checkout-message");
  if (messageEl) {
    messageEl.remove();
  }
}

// Show message below cart summary
function showCheckoutMessage(text, isError) {
  if (!cartSummary) {
    return;
  }

  let messageEl = document.getElementById("checkout-message");

  if (!messageEl) {
    messageEl = document.createElement("p");
    messageEl.id = `checkout-message`;
    messageEl.style.marginTop = `10px`;
    messageEl.style.fontWeight = `bold`;
    cartSummary.appendChild(messageEl);
  }

  messageEl.textContent = `${text}`;
  messageEl.style.color = isError ? ERROR_COLOR : SUCCESS_COLOR;
}

// update cart display
function updateCartDisplay() {
  if (!cartItemsList || !subtotalDisplay || !taxDisplay || !totalDisplay) {
    return;
  }

  cartItemsList.innerHTML = ``;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `<li class="empty-msg">Cart is empty</li>`;
    subtotalDisplay.textContent = `$0.00`;
    taxDisplay.textContent = `$0.00`;
    totalDisplay.textContent = `$0.00`;
    return;
  }

  let subtotal = 0;

  for (let i = 0; i < cart.length; i += 1) {
    const item = cart[i];
    subtotal += item.price;

    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${item.name}`;

    const rightSpan = document.createElement("span");
    rightSpan.style.display = `flex`;
    rightSpan.style.alignItems = `center`;
    rightSpan.style.gap = `0.4rem`;

    const priceSpan = document.createElement("span");
    priceSpan.textContent = `$${item.price.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.className = `remove-btn`;
    removeBtn.textContent = `Remove`;

    // Add event listener to remove item
    removeBtn.addEventListener("click", function () {
      removeFromCart(i);
    });

    rightSpan.appendChild(priceSpan);
    rightSpan.appendChild(removeBtn);

    li.appendChild(nameSpan);
    li.appendChild(rightSpan);

    cartItemsList.appendChild(li);
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
  taxDisplay.textContent = `$${tax.toFixed(2)}`;
  totalDisplay.textContent = `$${total.toFixed(2)}`;
}

// add item to cart
function addToCart(name, price) {
  const item = {
    name: name,
    price: price,
  };

  cart.push(item);
  clearCheckoutMessage();
  updateCartDisplay();
}

//remove item from cart
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) {
    return;
  }

  cart.splice(index, 1);
  clearCheckoutMessage();
  updateCartDisplay();
}

// Add buttons event listener
for (let i = 0; i < addButtons.length; i += 1) {
  const button = addButtons[i];

  button.addEventListener("click", function () {
    const name = button.getAttribute("data-name");
    const priceString = button.getAttribute("data-price");
    const price = parseFloat(priceString);

    addToCart(name, price);
  });
}

// checkout button event listener
if (checkoutButton) {
  checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
      showCheckoutMessage(
        `Your cart is empty. Please add at least one item before checkout.`,
        true
      );
      return;
    }

    const finalTotal = totalDisplay.textContent;

    showCheckoutMessage(
      `Thank you for your order! Total: ${finalTotal}`,
      false
    );

    cart = [];
    updateCartDisplay();
  });
}

// reset cart display on page load
updateCartDisplay();

/* =========================================
   Contact Form Validation
   ========================================= */
const contactForm = document.getElementById("contact-form");

// show input error message (displayed after the input)
function showInputError(inputId, message) {
  const inputEl = document.getElementById(inputId);
  if (!inputEl) {
    return;
  }

  const errorEl = document.createElement("span");
  errorEl.className = `error-message`;
  errorEl.style.color = ERROR_COLOR;
  errorEl.style.fontSize = `0.8rem`;
  errorEl.style.marginLeft = `10px`;
  errorEl.textContent = `${message}`;

  inputEl.after(errorEl);
  inputEl.style.borderColor = ERROR_COLOR;
}

// show radio group error message
function showRadioError(message) {
  const radioGroup = document.querySelector(".radio-group");
  if (!radioGroup) {
    return;
  }

  const errorEl = document.createElement("p");
  errorEl.className = `error-message`;
  errorEl.style.color = ERROR_COLOR;
  errorEl.style.fontSize = `0.8rem`;
  errorEl.style.marginTop = `5px`;
  errorEl.textContent = `${message}`;

  radioGroup.after(errorEl);
}

// clear all form error messages
function clearFormErrors() {
  const errors = document.querySelectorAll(".error-message");
  for (let i = 0; i < errors.length; i += 1) {
    errors[i].remove();
  }

  if (!contactForm) {
    return;
  }

  const inputs = contactForm.querySelectorAll("input, textarea");
  for (let j = 0; j < inputs.length; j += 1) {
    const input = inputs[j];
    input.style.borderColor = ``;
  }
}

// Contact Form message display
function clearContactMessage() {
  const messageEl = document.getElementById("contact-message");
  if (messageEl) {
    messageEl.remove();
  }
}

function showContactMessage(text, isError) {
  if (!contactForm) {
    return;
  }

  let messageEl = document.getElementById("contact-message");

  if (!messageEl) {
    messageEl = document.createElement("p");
    messageEl.id = `contact-message`;
    messageEl.style.marginTop = `15px`;
    messageEl.style.fontWeight = `bold`;
    contactForm.after(messageEl);
  }

  messageEl.textContent = `${text}`;
  messageEl.style.color = isError ? ERROR_COLOR : SUCCESS_COLOR;
}

if (contactForm) {
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const commentsInput = document.getElementById("comments");

  // required attribute
  if (phoneInput) {
    phoneInput.removeAttribute("required");
  }
  if (emailInput) {
    emailInput.removeAttribute("required");
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    clearFormErrors();
    clearContactMessage();

    const fullName = fullNameInput ? fullNameInput.value.trim() : ``;
    const phone = phoneInput ? phoneInput.value.trim() : ``;
    const email = emailInput ? emailInput.value.trim() : ``;
    const comments = commentsInput ? commentsInput.value.trim() : ``;

    const contactMethod = document.querySelector(
      `input[name="contactMethod"]:checked`
    );

    let isValid = true;

    // name is required
    if (fullName === ``) {
      showInputError(`fullName`, `Name is required.`);
      isValid = false;
    }

    // comments is required
    if (comments === ``) {
      showInputError(`comments`, `Comments are required.`);
      isValid = false;
    }

    // contact method is required
    if (!contactMethod) {
      showRadioError(`Please select how you'd like us to contact you.`);
      isValid = false;
    }

    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // check based on contact method
    if (contactMethod && contactMethod.value === `phone`) {
      // phone is required
      if (phone === ``) {
        showInputError(
          `phone`,
          `Phone number is required because you chose phone.`
        );
        isValid = false;
      } else if (!phoneRegex.test(phone)) {
        showInputError(`phone`, `Use format 123-456-7890.`);
        isValid = false;
      }

      // email if filled, check format
      if (email !== `` && !emailRegex.test(email)) {
        showInputError(`email`, `Email format looks incorrect.`);
        isValid = false;
      }
    } else if (contactMethod && contactMethod.value === `email`) {
      // email is required
      if (email === ``) {
        showInputError(`email`, `Email is required because you chose email.`);
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showInputError(`email`, `Please enter a valid email address.`);
        isValid = false;
      }

      // phone if filled, check format
      if (phone !== `` && !phoneRegex.test(phone)) {
        showInputError(`phone`, `Use format 123-456-7890.`);
        isValid = false;
      }
    }

    if (!isValid) {
      // form has errors → display a summary message at the bottom (same style as cart)
      showContactMessage(`Please fix the highlighted fields above.`, true);
      return;
    }

    // passed validation, create customer object
    const customer = {
      name: fullName,
      phone: phone,
      email: email,
      preferredContact: contactMethod ? contactMethod.value : ``,
      comments: comments,
    };

    const successText = `Message sent! Thanks, ${customer.name}. We will contact you via ${customer.preferredContact}.`;

    showContactMessage(successText, false);
    contactForm.reset();
  });
}
