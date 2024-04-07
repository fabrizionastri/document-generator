# Generating PDF contracts

_Fabrizio Nastri, Feb 2023_

## Context and Objectives

I want to automatically generate contracts for FlexUp using data from the database and a contract template in word.

## Results

I have created:

- a `docxTemplateRenderer.js` code code that takes a Word template (with mailmerge fields in mustache-style format) and file with some data, and then generates an output docx file with the data merged into the template
- a `libreoffice-convert.js` code that converts a word document to PDF

I have tested both separately and they work.

I have started working on `extractDefaults.js` that is supposed to extract default values from the template.
→ this is incomplete, I need to finish it.

Next step is to extract the data from a database into a JS object.

## How to run

### `docxTemplateRenderer.js`

This runs from the command line, as follows:

```bash
node docxTemplateRenderer.js example1
```

This will:

- look for the template file `example1.docx` in the `files/input` folder
- look for the data file `example1.json` in the `files/input` folder
- generate the output file `example1_output.docx` in the `files/output` folder

Check out the [docxtemplater.com](https://www.docxtemplater.com) website for more information, specifically:

- [tags](https://docxtemplater.com/docs/tag-types/) for introducing the mustache-style tags in the Word template
- [angular-parser](https://docxtemplater.com/docs/angular-parse/) for more advanced templating

## History

I started on 4th Feb 2023 with the following ChatGPT exchange:

Fabrizio:

- I have a contract template written using Microsoft word. In that contract there are a large number of input fields which are fed to the document from a database. Please write me in javascript a code that will take the data from the database, and the word document template, and produce a pdf document with all the valid information ready for signature.

ChatGPT:

- You can use a library like Node.js and the NPM module 'docxtemplater' to achieve this. Here is some sample code that should get you started:

```JavaScript
  const fs = require('fs');
  const Docxtemplater = require('docxtemplater');

  // Load the template file as a buffer
  const content = fs.readFileSync('./contract_template.docx', 'binary');

  // Create a new instance of Docxtemplater
  const doc = new Docxtemplater(content);

  // Define the data to be injected into the template
  const data = {
    field1: 'Value 1',
    field2: 'Value 2',
    // Add as many fields as necessary
  };

  // Set the data on the docxtemplater instance
  doc.setData(data);

  // Render the template
  doc.render();

  // Get the rendered content as a buffer
  const buffer = doc.getZip().generate({ type: 'nodebuffer' });

  // Write the rendered content to a file
  fs.writeFileSync('./rendered_contract.docx', buffer);
```

- You'll need to install the docxtemplater module by running npm install docxtemplater in your terminal.
- Note that you'll need to install additional dependencies for this to work, such as jszip and lodash. The docxtemplater package should give you the information you need to install those as well.

---

However, the ChatGPT code did not work, but it led me to the docxtemplater documentation.

I then checked the docxtemplater documentation and got this code, which works (using the mustache templating rules):

```JavaScript
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

// Load the docx file as binary content
const content = fs.readFileSync(path.resolve(__dirname, "input.docx"),"binary");

const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
});

// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
doc.render({
    first_name: "John",
    last_name: "Doe",
    phone: "0652455478",
    description: "New Website",
});

const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
});

// buf is a nodejs Buffer, you can either write it to a
// file or res.send it with express for example.
fs.writeFileSync(path.resolve(__dirname, "output-docx2pdf.docx"), buf);
```

---

ChatGPT then gave me the following code to convert the Word into PDF

```JavaScript
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Create a new instance of PDFDocument
const doc = new PDFDocument();

// Read the generated .docx file
const content = fs.readFileSync('./output-chatGPT.docx');

// Pipe the content to the PDFDocument instance
doc.pipe(fs.createWriteStream('./output-chatGPT.pdf'));

// End the PDFDocument instance
doc.end();

```

Again, it did not work, so I check out the pdfkit documentation, and made a code that does work (see `pdfkit.js`). However, this is not relevant to my needs, as pdfkit creates PDF from scratch from a set of instructions.

So I found this website that has a great [tutorial video](https://www.pdftron.com/blog/nodejs/generate-pdf-convert-docx-to-pdf-with-nodejs/#create-a-simple-expressjs-server). However, this is a paid service so I need to buy a licence key !

Finally, I check out the libreoffice-convert library, and it worked like a charm !

Conclusion: I only need 2 libraries:

- docxtemplater
- libreoffice-convert

---

I then asked ChatGPT the following:

```
I manage multiple contract templates and need to programmatically create documents with the relevant user data. Each contract template has different sets of parameters, and some contract templates may have more than 100 different parameters. For most parameters, there is the default value that the user can potentially change, but that will mostly often not change.

When I do a mail merge using a contract template and a dataset, I only want to provide - in my dataset - the values for parameters that have been changed by the user (the overrides), and apply the default values for the other parameters.

Using docxtemplater, is there a way to provide a default value for each placeholder tag in the template itself ?

It seems that you can provide default values in the JavaScript code, but not in the template itself. That it inconventient, because: 1) data scheme may change from one contract to another, and 2) where there are lots of parameters, coding these in two separate locations is cumbersome and prone to errors.

Ideally, I would like to provide the default value within each tag. For example:

Hello {name="my dear friend"} !

So if no value is provided for name, it will print

Hello my dear friend !

Is there a built-in solution for this already ? If not, how could I program one ?

If this feature is not currently supported by docxtemplater, I would like to write a generic JavaScript function that would edit the dataset, replacing the missing data by the one found in the template, and then removing them from the template so that docxtemplater can interpret it correctly.
```

This is what I got back:

```JavaScript
const docx = require('docxtemplater');
const fs = require('fs');
const path = require('path');

// Load the template as a buffer
const content = fs.readFileSync(path.resolve(__dirname, 'template.docx'), 'binary');

// Create a new instance of docxtemplater with the content
const doc = new docx.default({content});

// Create a custom function to set the default values in the template
const setDefaults = (template, data) => {
  const placeholders = template.match(/{[^}]+}/g);
  placeholders.forEach(placeholder => {
    const [variable, defaultValue] = placeholder.slice(1, -1).split('=');
    if (!data[variable] && defaultValue) {
      data[variable] = defaultValue.slice(1, -1);
    }
  });
  return data;
};

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
fs.writeFileSync(path.resolve(__dirname, 'result.docx'), result, 'binary');

```

However, it did not work, so I asked a few follow up questions. Check them the out here:

https://chat.openai.com/chat/82445a25-67f4-4383-b08b-1c273c074e1b

I also posted my question on StackOverflow:

https://stackoverflow.com/questions/75372514/is-there-a-way-to-provide-default-values-within-the-template-when-generating-doc?noredirect=1#comment133000008_75372514
