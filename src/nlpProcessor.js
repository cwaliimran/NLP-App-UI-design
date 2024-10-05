const fs = require('fs');
const pdf = require('pdf-parse');

// Function to parse the PDF content
async function extractContentFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);

  // Log extracted text for debugging
  console.log("Extracted PDF Content: ", pdfData.text); // Log PDF content

  return preprocessText(pdfData.text);  // Preprocess the extracted text to fix spacing issues
}

// Preprocess text to fix spacing issues
function preprocessText(text) {
  // Replace common issues where words are run together
  text = fixSpacing(text);
  return text;
}

// Function to fix spacing issues
function fixSpacing(text) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase letters
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')  // Add space between numbers and letters
    .replace(/([.,!?])([a-zA-Z])/g, '$1 $2')  // Ensure space after punctuation
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2')  // Handle uppercase words with no spaces
    .replace(/([a-z])([.,!?])/g, '$1$2 ');  // Ensure space before punctuation
}

// Function to dynamically extract sections and create screens
function processTextToExtractScreens(text) {
  // Split content into paragraphs or sections based on empty lines (common in structured documents)
  let sections = text.split(/\n\s*\n/).filter(section => section.trim() !== '');

  // For debugging: print the detected sections
  console.log("Detected Sections: ", sections);

  // If no sections are detected, log an error
  if (sections.length === 0) {
    console.error("No sections detected. Ensure the PDF content is structured.");
    return [];
  }

  // Process extracted screen data
  let screens = sections.map((section, index) => {
    // Split section into lines for individual fields
    let lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Build dynamic fields for each line of the section
    let fields = lines.map((line, i) => {
      return {
        type: 'textBlock',
        label: `Section ${index + 1} - Line ${i + 1}`,
        content: line
      };
    });

    // Generate dynamic actions (e.g., Next button)
    let actions = [
      {
        type: 'button',
        label: 'Next',
        onClick: 'nextScreen'
      }
    ];

    return {
      screenType: `screen${index + 1}`,
      description: `Screen ${index + 1}`,
      fields: fields,
      actions: actions
    };
  });

  // For debugging: print the generated screens
  console.log("Generated Screens: ", screens);

  return screens;
}

// Main function to handle PDF and create the screen JSON
async function createScreensFromPDF(filePath) {
  try {
    const pdfContent = await extractContentFromPDF(filePath);
    const screensData = processTextToExtractScreens(pdfContent);

    // Convert to JSON format for UI
    const screensJson = JSON.stringify(screensData, null, 2);

    // Write the result to a JSON file for the renderer
    fs.writeFileSync('screens.json', screensJson);

    console.log('Screens generated successfully and saved to screens.json!');
  } catch (error) {
    console.error('Error processing PDF:', error);
  }
}

// Example usage with a PDF file
createScreensFromPDF('./sample.pdf');
