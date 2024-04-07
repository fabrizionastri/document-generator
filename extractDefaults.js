const Docxtemplater = require("docxtemplater");
const fs = require('fs');
const PizZip = require("pizzip");
const path = require('path');

const filename = "multiparam"
const inputPath = path.join(__dirname, `./files/${filename}_template_with_defaults.docx`);
const outputPath = path.join(__dirname, `./files/${filename}_template.docx`);

// Load the template as a buffer
const content = fs.readFileSync(inputPath, 'binary');


// Create a new instance of docxtemplater with the content
// this is required to work with zip files, docx seem to be zip files
const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

// Create a custom function to set the default values in the template
const setDefaults = (template, data) => {
  const placeholders = template.match(/{[^}]+}/g);
  placeholders.forEach(placeholder => {
    const [variable, defaultValue] = placeholder.slice(1, -1).split('=');
    if (!data[variable] && defaultValue) {
      data[variable] = defaultValue.slice(1, -1).toString();
    }
  });
  return data;
}

// Load the data object
const data = {
  name: 'John Doe',
  title: 'Manager',
};

// Set the default values in the data object
const updatedData = setDefaults(content.toString(), data);

// Set the data object on the docxtemplater instance
doc.setData(updatedData);

// Apply the data to the template and get the result as a buffer
const result = doc.render();

// Write the result to a file
fs.writeFileSync(outputPath, result, 'binary');