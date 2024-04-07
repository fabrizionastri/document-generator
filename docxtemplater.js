// from docxtemplater website
const fs = require('fs')
const path = require('path')
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const PDFDocument = require('pdfkit')

// Load the docx file as binary content (async function)
const content = fs.readFileSync(path.resolve(__dirname, './files/input/basic_template.docx'), 'binary')

// this is required to work with zip files, docx seem to be zip files
const zip = new PizZip(content)

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true
})

// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
doc.render({
  first_name: 'John',
  last_name: 'Doe',
  phone: '0652455478',
  description: 'New Website'
})

const buf = doc.getZip().generate({
  type: 'nodebuffer',
  // compression: DEFLATE adds a compression step.
  // For a 50MB output document, expect 500ms additional CPU time
  compression: 'DEFLATE'
})

// buf is a nodejs Buffer, you can either write it to a
// file or res.send it with express for example.
fs.writeFileSync(path.resolve(__dirname, './files/output/basic_template.docx'), buf)
