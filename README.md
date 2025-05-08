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

## Versioning

- April 2024: renamed and improved the `docxTemplateRenderer.js`:
  - adding custom filters to the parser
  - separating input template and data
  - creating CLI arguments
- Feb 2023: first version
  - created the basic version of the template & data merger, and word to pdf converter
