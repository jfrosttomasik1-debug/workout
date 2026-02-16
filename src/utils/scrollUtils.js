/**
 * Scroll to a specific element by ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset in pixels (default: 0)
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

