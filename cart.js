/**
 * @todo add console logging for this file
 */


/**
 * Contains the IDs of all of the items currently in the cart.
 * @type {string[]}
 */
let cart = [];

/**
 * Add an item to the cart and mark that item as added.
 * @param {HTMLDivElement} itemElement The element representing the item to add.
 */
function addItemToCart(itemElement) {
  // Add the ID to the cart array
  let itemId = itemElement.id;
  cart.push(itemId);

  // Mark the item as added
  itemElement.classList.add("inCart");
  let addToCartButton = itemElement.querySelector(".addToCartButton");
  addToCartButton.innerHTML = addToCartButtonText.inCart;
  addToCartButton.disabled = true;
}

/**
 * Add click listeners to all the cart buttons.
 */
function initializeCart() {
  // Find all the add to cart buttons and loop through them
  let addToCartButtons = document.querySelectorAll(".addToCartButton"),
      addToCartButtonsArray = Array.from(addToCartButtons);

  addToCartButtonsArray.forEach(function (cartButtonElement) {
    // The item is the parent of the button
    cartButtonElement.addEventListener("click", function() {
      addItemToCart(this.parentElement)
    });
  });
}