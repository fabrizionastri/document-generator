/* 
This is maybe nice to create PDF files, but not to convert Word to PDF
*/

const fs = require('fs');
const PDFDocument = require('pdfkit');

// Create a new instance of PDFDocument
const doc = new PDFDocument();

// Pipe the content to the PDFDocument instance
doc.pipe(fs.createWriteStream('./files/output-pdfkit.pdf'));

// Embed a font, set the font size, and render some text
doc
  .font('./fonts/opensans-regular.ttf')
  .fontSize(18)
  .text('Some text with an embedded font!', 100, 100);

// Add an image, constrain it to a given size, and center it vertically and horizontally
try {
  doc.image('./images/image.png', {
    fit: [250, 300],
    align: 'center',
    valign: 'center'
  });
} catch (error) {
  console.error(`Error adding image: ${error}`);
}

/* It did not work with my initial PNG image, but it worked in JPG. Comment from ChatGPT:
It's possible that the .png image is not supported or that there's a problem with the encoding 
of the image file. Try converting the image to a different format, such as .jpeg or .gif, 
and see if it works correctly. Additionally, you can try using a library such as Sharp to read and 
convert the image to a format that's compatible with PDFKit.
I tried another PNG image and it did work.
I also converted the jpg back to png, so had essentially the same png as initially, and now it works.
So, that means that some PNG files don't work with PDF. 
ChatGPT was right this time !!!
*/

// Add another page
doc
  .addPage()
  .fontSize(25)
  .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
doc
  .save()
  .moveTo(100, 150)
  .lineTo(100, 250)
  .lineTo(200, 250)
  .fill('#FF3300');

// // Apply some transforms and render an SVG path with the 'even-odd' fill rule
// doc
//   .scale(0.6)
//   .translate(470, -380)
//   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//   .fill('red', 'even-odd')
//   .restore();

// Add some text with annotations
doc
  .addPage()
  .fillColor('blue')
  .text('Here is a link!', 100, 100)
  .underline(100, 100, 160, 27, { color: '#0000FF' })
  .link(100, 100, 160, 27, 'http://google.com/');

// Finalize PDF file and End the PDFDocument instance
doc.end();