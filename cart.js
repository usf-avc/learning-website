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
  console.group("addItemToCart()");
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

  // Finally add the item to the list of items in the cart.
  console.log("Adding item to cart:", item);
  cart.push(item);
  console.log("Item added. New cart:", cart);

  // Mark the item as added in the page
  itemElement.classList.add("inCart");
  let addToCartButton = itemElement.querySelector(".addToCartButton");
  addToCartButton.innerHTML = addToCartButtonText.inCart;
  addToCartButton.disabled = true;
  console.log("Item marked as added on the page.");
  console.groupEnd();
}

/**
 * Remove an item from the cart, using its ID
 * @param {string} itemId The ID of the element to remove.
 */
function removeItemFromCart(itemId) {
  console.group("removeItemFromCart()");
  console.log("Removing item from cart with id:", itemId);

  // First we need to find out what position the item has in the cart:
  let indexOfItem = cart.findIndex(function(item) {
    return item.id === itemId;
  });
  console.log("Item is in cart at position:", indexOfItem);

  // Now lets remove the item.
  if(indexOfItem !== -1) {
    // If the item actually is in the cart
    cart.splice(indexOfItem, 1);
  }
  console.log("Item removed from cart. New cart:", cart);

  // Mark the item as removed in the page
  let itemElement = document.getElementById(itemId);
  itemElement.classList.remove("inCart");
  let addToCartButton = itemElement.querySelector(".addToCartButton");
  addToCartButton.innerHTML = addToCartButtonText.outOfCart;
  addToCartButton.disabled = false;
  console.log("Item marked as removed on the page.");

  buildCart();
  console.groupEnd();
}

/**
 * Hide or show the cart, depending on whether it's hiding or showing:
 */
function toggleCart() {
  console.group("toggleCart()");

  // We need to refresh the cart before showing it:
  buildCart();
  document.querySelector(".cartContainer").classList.toggle("hidden");

  console.log("Cart toggled.");
  console.groupEnd();
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
  console.group("buildCart()");
  console.log("Refreshing cart contents.");

  // Get the container element where all the items go
  let cartItemsContainer = document.querySelector(".cartItems");

  // Create total cost and html variables for later use
  let totalCost = 0, html = ``;

  if(cart.length != 0) {
    // If there are some items in the cart

    // Add each item to the cart as new HTML
    cart.forEach(function(item) {
      console.groupCollapsed(item.id);

      // Calculate the item price and add it to the total price in cart
      let totalItemPrice = item.pricePerItem * item.amountInCart;
      console.log("Item cost:", totalItemPrice);
      totalCost += totalItemPrice;

      //  Generate HTML code for displaying the item:
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
      console.log("Item HTML generated:", itemHTML);

      // Add the item's HTML to the end of the overall HTML:
      html += itemHTML;
      console.groupEnd();
    });
  } else {
    console.log("The cart is empty.");
    // If there are no items in the cart:
    html = `<div class="item noItems"><span>There are no items in your cart yet. Go add some!</span></div>`;
  }

  // Find the total cost element:
  let totalCostElement = cartItemsContainer.parentElement.querySelector(".totalCostNumber");
  // Round and add the total cost:
  totalCost = formatWithTwoDecimalPlaces(totalCost);
  totalCostElement.textContent = totalCost;
  console.log("Total cost of cart: $", totalCost);

  cartItemsContainer.innerHTML = html;
  console.log("HTML updated.");

  listenForCartActions();
  console.groupEnd();
}

/**
 * Add cart button listeners.
 */
function listenForCartActions() {
  console.group("listenForCartActions()");

  // Find all the remove from cart buttons
  let removeFromCartButtons = document.querySelectorAll(".removeFromCartButton"),
  removeFromCartButtonsArray = Array.from(removeFromCartButtons);
  console.log("Remove From Cart Buttons found:", removeFromCartButtonsArray);

  // Loop through the buttons and add the click event to each one
  removeFromCartButtonsArray.forEach(function (cartButtonElement) {
    // The item is the parent of the button
    cartButtonElement.addEventListener("click", function() {
      removeItemFromCart(this.dataset.id);
    });
  });
  console.log("'click' event listeners added.");

  console.log("Looking for Amount in Cart boxes...");
  // Find all the amount in cart input boxes
  let amountInCartBoxes = document.querySelectorAll(".amountInCart"),
      amountInCartBoxesArray = Array.from(amountInCartBoxes);
  console.log("Amount In Cart Input Boxes found:", amountInCartBoxesArray);

  // Loop through the boxes and start listening for when their value changes
  amountInCartBoxesArray.forEach(function(amountBoxElement) {
    amountBoxElement.addEventListener("change", function() {
      // When a value changes, update the amount of the item in the cart
      let itemId = this.dataset.id;
      updateAmountInCart(itemId, this.value);
    });
  });
  console.log("'change' event listeners added.");

  console.groupEnd();
}

/**
 * Update the amount of an item in the cart.
 * @param {string} itemId The id of the item.
 * @param {number} amount The new inventory.
 */
function updateAmountInCart(itemId, amount) {
  console.group("updateAmountInCart()");
  console.log("Changing the amount of item with id:", itemId, "to", amount);

  let indexOfItem = cart.findIndex(function(item) {
    return item.id === itemId;
  });
  console.log("Item index:", indexOfItem);

  if(indexOfItem !== -1) {
    cart[indexOfItem].amountInCart = amount;
    console.log("Item amount updated. New item:", cart[indexOfItem]);
  }

  buildCart();
  console.groupEnd();
}

/**
 * Add click listeners to all the cart buttons.
 */
function initializeCart() {
  console.groupCollapsed("initializeCart()");
  console.log("Initializing cart behaviour.");

  // Find all the add to cart buttons
  let addToCartButtons = document.querySelectorAll(".addToCartButton"),
      addToCartButtonsArray = Array.from(addToCartButtons);
  console.log("Add to Cart Buttons found:", addToCartButtonsArray);

  // Loop through the buttons and add the click event to each one
  addToCartButtonsArray.forEach(function (cartButtonElement) {
    // The item is the parent of the button
    cartButtonElement.addEventListener("click", function() {
      // If the button is clicked, add its item to the cart
      addItemToCart(this.parentElement);
    });
  });
  console.log("'click' events added to 'Add to Cart' buttons.");


  // Find the open and close cart buttons:
  let cartToggleButtons = document.querySelectorAll(".openCartButton, .closeCartButton"),
      cartToggleButtonsArray = Array.from(cartToggleButtons);
  console.log("Cart open/close buttons found: ", cartToggleButtonsArray);

  // Loop through the buttons and add the click event to each one
  cartToggleButtonsArray.forEach(function(toggleButtonElement) {
    toggleButtonElement.addEventListener("click", function() {
      toggleCart();
    });
  });
  console.log("'click' events added to open/close buttons.");

  console.groupEnd();
}