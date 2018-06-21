
/**
 * Collapse the parent section if it's not collapsed, or expand it if it is.
 * @param {HTMLButtonElement} collapseButton The button that was clicked.
 */
function toggleSectionCollapse(collapseButton) {
  let sectionElement = collapseButton.parentElement;

  sectionElement.classList.toggle("collapsed");
}

/**
 * Add click listeners to all the collapse buttons on the page.
 */
function addCollapseButtonEventListeners() {
  // Find all of the buttons on the page:
  let collapseButtonElements = document.querySelectorAll(".collapseCategoryButton");

  // Convert the element list to an array so we can loop over it:
  let collapseButtonElementsArray = Array.from(collapseButtonElements);

  // Loop through the array, assigning the event listener to each button:
  collapseButtonElementsArray.forEach(function(buttonElement) {
    console.log(buttonElement);
    buttonElement.addEventListener("click", function() {
      toggleSectionCollapse(this);
    });
  });


}