/**
 * @todo add console logging for this file
 */

/**
 * An item in the cart.
 * @typedef {Object} CartItem
 * @property {string} id The ID of the item.
 * @property {string} name The name of the item.
 * @property {string} image URL of the image for the item.
 * @property {number} pricePerItem Price per item.
 * @property {number} amountInCart Number of this item in the cart.
 * @property {number} amountInStock The maximum number of items that can be had.
 */

/**
 * Contains the information about all of the items currently in the cart.
 * @type {CartItem[]}
 */
let cart = [];

/**
 * Add an item to the cart and mark that item as added.
 * @param {HTMLDivElement} itemElement The element representing the item to add.
 */
function addItemToCart(itemElement) {
  // Create an empty object to hold the item information. This object should be
  // structured like the CartItem defined above. Of course the amount in the
  // cart starts at one.
  let item = {
    amountInCart: 1
  };

  // Add the ID:
  item.id = itemElement.id;

  // Find the image element:
  let imageElement = itemElement.querySelector(".itemImage");
  // Add the image URL:
  item.image = imageElement.src;

  // Find the item name and add it:
  let nameElement = itemElement.querySelector(".itemName");
  item.name = nameElement.textContent;

  // Find the item price, and convert it to a number and add it:
  let priceElement = itemElement.querySelector(".priceNumber");
  item.pricePerItem = +priceElement.textContent;

  // Find the item stock, and convert it to a number and add it:
  let stockElement = itemElement.querySelector(".inStockCount");
  item.amountInStock = +stockElement.textContent;

  // Finally add the item to the list of items in the cart:
  cart.push(item);

  // Mark the item as added in the page
  itemElement.classList.add("inCart");
  let addToCartButton = itemElement.querySelector(".addToCartButton");
  addToCartButton.innerHTML = addToCartButtonText.inCart;
  addToCartButton.disabled = true;
}

/**
 * Remove an item from the cart, using its ID
 * @param {string} itemId The ID of the element to remove.
 */
function removeItemFromCart(itemId) {
  // First we need to find out what position the item has in the cart:
  let indexOfItem = cart.findIndex(function(item) {
    return item.id === itemId;
  });

  // Now lets remove the item.
  if(indexOfItem !== -1) {
    // If the item actually is in the cart
    cart.splice(indexOfItem, 1);
  }

  // Mark the item as removed in the page
  let itemElement = document.getElementById(itemId);
  itemElement.classList.remove("inCart");
  let addToCartButton = itemElement.querySelector(".addToCartButton");
  addToCartButton.innerHTML = addToCartButtonText.outOfCart;
  addToCartButton.disabled = false;

  buildCart();
}

/**
 * Hide or show the cart, depending on whether it's hiding or showing:
 */
function toggleCart() {
  buildCart();
  document.querySelector(".cartContainer").classList.toggle("hidden");
}

/** 
 * Round a number to two decimal places.
 * @param {number} number
 * @returns {string} The number, with two decimal places.
 */
function formatWithTwoDecimalPlaces(number) {
  return Number(number).toFixed(2);
}

/**
 * Generate and insert the HTML to show the items in the cart.
 */
function buildCart() {
  let cartItemsContainer = document.querySelector(".cartItems");

  let html = ``;

  // Create total cost variable
  let totalCost = 0;

  if(cart.length != 0) {
    // If there are some items in the cart

    // Add each item to the cart as new HTML
    cart.forEach(function(item) {
      let totalItemPrice = item.pricePerItem * item.amountInCart;
      totalCost += totalItemPrice;

      let itemHTML = `
      <div class="item">
        <img class="itemImage" src="${item.image}">
        <div class="itemDetails">
          <h3 class="itemName">${item.name}</h3>
          <p class="priceInfo">
            <span class="itemPrice">$${formatWithTwoDecimalPlaces(item.pricePerItem)}</span> × 
            <input type="number" min="1" max="${item.amountInStock}" data-id="${item.id}" aria-label="Amount in Cart" class="amountInCart" value="${item.amountInCart}"> in cart
          </p>
        </div>
        <div class="itemPrice itemTotalPrice">
          $${formatWithTwoDecimalPlaces(totalItemPrice)}
        </div>
        <button class="removeFromCartButton iconButton" data-id="${item.id}">Remove From Cart</button>
      </div>`;

      html += itemHTML;
    });
  } else {
    // If there are no items in the cart:
    html = `<div class="item noItems"><span>There are no items in your cart yet. Go add some!</span></div>`;
  }

  // Find the total cost element:
  let totalCostElement = cartItemsContainer.parentElement.querySelector(".totalCostNumber");
  // Round and add the total cost:
  totalCost = totalCost;
  totalCostElement.textContent = formatWithTwoDecimalPlaces(totalCost);

  cartItemsContainer.innerHTML = html;

  listenForCartActions();
}

/**
 * Add cart button listeners.
 */
function listenForCartActions() {
  // Find all the remove from cart buttons
  let removeFromCartButtons = document.querySelectorAll(".removeFromCartButton"),
  removeFromCartButtonsArray = Array.from(removeFromCartButtons);

  // Loop through the buttons and add the click event to each one
  removeFromCartButtonsArray.forEach(function (cartButtonElement) {
    // The item is the parent of the button
    cartButtonElement.addEventListener("click", function() {
      removeItemFromCart(this.dataset.id);
    });
  });

  // Find all the amount in cart input boxes
  let amountInCartBoxes = document.querySelectorAll(".amountInCart"),
      amountInCartBoxesArray = Array.from(amountInCartBoxes);
  
  amountInCartBoxesArray.forEach(function(amountBoxElement) {
    amountBoxElement.addEventListener("change", function() {
      let itemId = this.dataset.id;
      updateAmountInCart(itemId, this.value);
    });
  });
}

/**
 * Update the amount of an item in the cart.
 * @param {string} itemId The id of the item.
 * @param {number} amount The new inventory.
 */
function updateAmountInCart(itemId, amount) {
  let indexOfItem = cart.findIndex(function(item) {
    return item.id === itemId;
  });

  if(indexOfItem !== -1) {
    cart[indexOfItem].amountInCart = amount;
  }

  buildCart();
}

/**
 * Add click listeners to all the cart buttons.
 */
function initializeCart() {
  // Find all the add to cart buttons
  let addToCartButtons = document.querySelectorAll(".addToCartButton"),
      addToCartButtonsArray = Array.from(addToCartButtons);

  // Loop through the buttons and add the click event to each one
  addToCartButtonsArray.forEach(function (cartButtonElement) {
    // The item is the parent of the button
    cartButtonElement.addEventListener("click", function() {
      addItemToCart(this.parentElement);
    });
  });


  // Find the open and close cart buttons:
  let cartToggleButtons = document.querySelectorAll(".openCartButton, .closeCartButton"),
      cartToggleButtonsArray = Array.from(cartToggleButtons);
      console.log(cartToggleButtonsArray)

  // Loop through the buttons and add the click event to each one
  cartToggleButtonsArray.forEach(function(toggleButtonElement) {
    toggleButtonElement.addEventListener("click", function() {
      toggleCart();
    });
  });
}