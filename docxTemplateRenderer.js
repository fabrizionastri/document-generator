// Import required modules
const PizZip = require('pizzip')
const Docxtemplater = require('docxtemplater')
const expressionParser = require('docxtemplater/expressions.js')
const fs = require('fs')
const path = require('path')

// Resolve file paths
const fileName = process.argv[2] // Get the filename from the command line argument
const inputDir = path.resolve(__dirname, './files/input')
const outputDir = path.resolve(__dirname, './files/output')

// Load document template and data
const docxTemplatePath = path.join(inputDir, `${fileName}.docx`)
const jsonDataPath = path.join(inputDir, `${fileName}.json`)
const docxContent = fs.readFileSync(docxTemplatePath, 'binary')
const templateData = JSON.parse(fs.readFileSync(jsonDataPath, 'utf8'))

// Add custom filter to the expression parser
expressionParser.filters.toFixed = function (input, precision) {
  // In our example precision is the integer 2
  // Make sure that if your input is undefined, your
  // output will be undefined as well and will not
  // throw an error
  if (!input) return input
  return input.toFixed(precision)
}

expressionParser.filters.sumBy = function (input, field) {
  // In our example field is the string "price"

  // Make sure that if your input is undefined, your
  // output will be undefined as well and will not
  // throw an error
  if (!input) return input

  return input.reduce(function (sum, object) {
    return sum + object[field]
  }, 0)
}

// Initialize document processor
const zip = new PizZip(docxContent)
const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
  parser: expressionParser
})

// Render the template with the provided data
doc.render(templateData)

// Generate and write the output document
const outputBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' })
const outputPath = path.join(outputDir, `${fileName}_output.docx`)
fs.writeFileSync(outputPath, outputBuffer)

console.log(`Document generated: ${outputPath}`)
