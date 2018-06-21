
/**
 * Collapse the parent section if it's not collapsed, or expand it if it is.
 * @param {HTMLButtonElement} collapseButton The button that was clicked.
 */
function toggleSectionCollapse(collapseButton) {
  let sectionElement = collapseButton.parentElement;

  sectionElement.classList.toggle("collapsed");
}

/**
 * Add the height of each section as a style directly to the element.
 */
function updateSectionHeights() {
  let sectionElements = document.querySelectorAll(".category"),
      sectionElementsArray = Array.from(sectionElements);

  sectionElementsArray.forEach(function(sectionElement) {
    // If we don't reset the height, it will always be the same thing that it
    // was first set to.
    sectionElement.style.height = null;
    sectionElement.style.height = `${sectionElement.offsetHeight}px`;
  });
}

/**
 * Add click listeners to all the collapse buttons on the page.
 */
function initializeCategoryCollapsing() {
  // Find all of the buttons on the page:
  let collapseButtonElements = document.querySelectorAll(".collapseCategoryButton");

  // Convert the element list to an array so we can loop over it:
  let collapseButtonElementsArray = Array.from(collapseButtonElements);

  // Loop through the array, assigning the event listener to each button:
  collapseButtonElementsArray.forEach(function(buttonElement) {
    buttonElement.addEventListener("click", function() {
      toggleSectionCollapse(this);
    });
  });

  // This is almost perfect, but there's a small problem. Even though there
  // is a height transition set in CSS, the collapse isn't going to animate
  // because you have to set an original height. But if a height is set in CSS,
  // some content might get cut out when the section isn't collapsed. So instead,
  // we'll use JavaScript to get all of the uncollapsed heights and then set 
  // them in CSS.
  updateSectionHeights();

  // Much better! Except...what if the page gets resized and the element height
  // changes because the text reflowed? Let's listen for page resizing in case
  // that happens.
  window.addEventListener("resize", function() {
    updateSectionHeights();
  });
}