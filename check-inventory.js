
/**
 * The location of the inventory.json file on the AVC server.
 * @type {string}
 */
const inventoryUrl = "https://cdn.rawgit.com/usf-avc/learning-website/master/remote-files/inventory.json";

/**
 * The text to put after the number of items in stock. This is kept as a
 * constant so it's easy to change later if needed.
 * @type {Object}
 * @property {string} none The text to show if there are no items left.
 * @property {string} singular The text to show if there's just one item.
 * @property {string} plural The text to show if there are multiple items left.
 */
const inStockText = {
  none: "items in stock. <br> Please check back later.",
  singular: "item in stock. Hurry!",
  plural: "items in stock."
};

/**
 * Recieve and process some JSON data located at a remote URL.
 * @param {string} url The location of the JSON file.
 * @returns {Promise>Object} A Promise that resolves with the data object if
 * the request is successful.
 */
function getJSONData(url) {
  // This function has to wait for a request to go through, so it can't return
  // the data immediately. Instead, it returns a "Promise" to return the data
  // when it can.
  return new Promise(function(resolve, reject) {
    console.group("getJSONData()");

    // fetch() is an easy way to request data by URL:
    console.log("Request sent to URL:", url);
    fetch(url)
      // After the request finishes, the response is recieved by this then() 
      // function:
      .then(function(response) {
        console.log("Response recieved:", response);

        if(response.status === 200) {
          console.log("Request was successful.");
          // The status is 200 when the request goes through successfully.
          // If this happens, the json() function will turn the plain text data
          // into an object that we can easily read. That object will be recieved
          // by the then() function below after it's done being parsed.
          return response.json();

        } else {
          console.log("Request was unsuccessful.");
          // If the response is not 200 (for example, it could be 404, which
          // means the resource doesn't exist) we know the call failed.
          // If this happens, the Error will be caught by catch() below, causing
          // the promise to reject.
          throw Error(`Server request failed (status: ${response.statusText})`);
        }
      })
      // Assuming everything went well, this then() function now gets the object:
      .then(function(processedData) {
        console.log("Data processed:", processedData);

        // Successfully resolve the Promise with the processed data:
        console.log("Promise resolved 👍.");
        console.groupEnd();
        resolve(processedData);
      })
      // In case something went wrong, this catch() function will catch the error:
      .catch(function(error) {
        console.error(error);

        // Reject the promise with the error information:
        console.warn("Promise rejected 👎.");
        console.groupEnd();
        reject(error);
      });
  });
}

/**
 * Fetch and process the inventory data located on the remote server.
 * @returns {Promise>Object} A Promise that resolves with the data object if
 * the request is successful.
 */
function getInventoryData() {
  // This function is just a shortcut wrapper for getJSONData().
  return getJSONData(inventoryUrl);
}

/**
 * Update the "in stock" information on the page.
 * @param {Object} inventoryData Processed data object from the JSON on the server.
 * @param {Object} itemsByCategory Object with all of the item elements, arranged
 * by category.
 */
function updateInfoOnPage(inventoryData, itemsByCategory) {
  console.groupCollapsed("updateInfoOnPage()");
  console.log("Updating stock information on the page...");

  // We need to loop over all the items and update each of their "in stock"
  // counts. itemsByCategory is an object, not an array, so we can't forEach
  // directly on it, but we can if we use the entries() method, which
  // returns an array of two-element arrays, where the first element is the
  // key and the second is the value:
  Object.entries(itemsByCategory).forEach(function(category) {

    // We used the category id as the key before, so it's the first element now:
    let categoryId = category[0];
    
    console.groupCollapsed(categoryId);
    console.log("Updating items in category with id:", categoryId);

    // The items were stored as the value, so the second element is is the
    // object that has all the items. We have to do the same thing here and 
    // get the entries of this sub-object:
    Object.entries(category[1]).forEach(function(item) {
      // We used the item id as the key before, so it's the first element now:
      let itemId = item[0], itemElement = item[1];

      console.groupCollapsed(itemId);
      console.log("Updating info for item with id:", itemId);

      // Now we have all of the information necessary to get the data from the
      // inventoryData object. We needed the category id and the element id.
      let itemStockAmount = inventoryData[categoryId][itemId].amountInStock;

      // Let's figure out which text to use by checking the stock amount:
      let itemStockText, itemInStock = true;
      if(itemStockAmount > 1) {
        // Multiple items are in stock.
        itemStockText = inStockText.plural;
      } else if(itemStockAmount <= 0) {
        // No items in stock. If the stock amount is a negative number, that's
        // definitely an error and we don't want the customer to see that.
        itemStockText = inStockText.none;
        itemInStock = false;
      } else {
        // Just one item in stock.
        itemStockText = inStockText.singular;
      }

      console.log("Full stock text:", itemStockAmount, itemStockText);
      console.log("Item in stock:", itemInStock);
      
      // Now it's time to use that information by changing the page contents.
      itemElement.querySelector(".inStockCount").innerHTML = itemStockAmount;
      itemElement.querySelector(".inStockText").innerHTML = itemStockText;

      // And let's add an outOfStock class and disable buttons for any items
      // that are out of stock:
      if(itemInStock === false) {
        itemElement.classList.add("outOfStock");
        let addToCartButton = itemElement.querySelector(".addToCartButton");
        addToCartButton.disabled = true;
        addToCartButton.innerHTML = addToCartButtonText.outOfStock;
      } else {
        // Make sure the ones that are in stock don't have that class
        itemElement.classList.remove("outOfStock");
        itemElement.querySelector(".addToCartButton").disabled = false;
      }
      console.log("All item info updated successfully.");
      console.groupEnd();
    });

    console.log("Stock info has been updated successfully for this category.");
    console.groupEnd();
  });

  console.log("Success! All stock info has been updated.");
  console.groupEnd();
}

/**
 * Find and store all of the needed item elements from the page.
 */
function getItemElements() {
  console.group("getItemElements()");
  console.log("Searching for items on the page...");

  // We need to find all of the items on the page and store them for later.
  // Lets create an empty object to store them in:
  let itemsByCategory = {};
  // First, find all of the categories:
  let categoryElements = document.querySelectorAll(".category");
  // querySelectorAll returns a NodeList, which is hard to work with, but we
  // can convert it to an array:
  let categoryElementsArray = Array.from(categoryElements);

  // Now we can loop over it easily, executing this function on each category:
  categoryElementsArray.forEach(function(categoryElement) {
    // Save the category name:
    let categoryId = categoryElement.id;
    console.groupCollapsed(categoryId);
    console.log("Getting items for category with id: ", categoryId);

    // Add the category as an empty object child of our itemsByCategory object:
    itemsByCategory[categoryId] = {};
    // Each category is an HTML <section> element. Let's get all the items in
    // the category, and convert that to an array:
    let itemElements = categoryElement.querySelectorAll(".item");
    let itemElementsArray = Array.from(itemElements);
    //Now we can loop over the items. This is a loop within a loop:
    itemElementsArray.forEach(function(itemElement) {
      let itemId = itemElement.id;
      console.groupCollapsed(itemId);
      console.log("Found item with id:", itemId);
      console.log(itemElement);

      // And finally add each item to the category object it belongs to.
      itemsByCategory[categoryId][itemElement.id] = itemElement;
      console.log("Item added.");
      console.groupEnd();
    });

    console.log("All items found for this category:", itemsByCategory[categoryId]);
    console.groupEnd();
  });

  // Now itemsByCategory is an object that contains every category, and each
  // category in that object is its own object that contains every item in
  // the category. The following statement logs the object to the console so
  // you can inspect it:
  console.log("Items found and stored:", itemsByCategory);
  console.groupEnd();

  return itemsByCategory;
}

/**
 * Update the inventory information on the page.
 */
function updateInventoryInfo() {
  console.groupCollapsed("updateInventoryInfo()");

  // We could wait and get the elements after recieving the data, but it's faster
  // to do it while waiting for the request, since we have to wait anyway.
  let itemsByCategory = getItemElements();

  // Let's get the inventory data and update the page:
  getInventoryData()
    .then(function(inventoryData) {
      // The data was recieved and processed succesfully.
      console.log("Data recieved:", inventoryData);

      // Update the page using the recieved data:
      updateInfoOnPage(inventoryData, itemsByCategory);
    })
    .catch(function(error) {
      // Just in case anything goes wrong.
      console.error(error);
    });
  
  // Notice in the console how this group ends before the data is recieved?
  // That's because when this console.groupEnd() runs, we're still waiting on
  // the request to load.
  console.groupEnd();
}