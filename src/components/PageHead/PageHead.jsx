// src/components/PageHead.jsx

import { useEffect } from 'react';

// Define your constant site name/brand
const SITE_NAME = "DigitalAxis";
const SEPARATOR = " | ";

/**
 * Updates the browser tab title dynamically.
 * @param {string} pageTitle - The specific title for the current page (e.g., "Login", "Features").
 */
const PageHead = ({ pageTitle }) => {

  useEffect(() => {
    // Construct the full title string
    const fullTitle = pageTitle ? `${SITE_NAME}${SEPARATOR}${pageTitle}` : SITE_NAME;

    // Set the document title
    document.title = fullTitle;

    // The effect runs when the component mounts and whenever 'pageTitle' changes.
    // It cleans up (not strictly necessary for document.title but good practice)
    // by resetting the title, though in a routed app, the next component will set it.

  }, [pageTitle]); // Dependency array ensures this runs only when pageTitle changes.

  // This component renders nothing in the DOM
  return null;
};

export default PageHead;