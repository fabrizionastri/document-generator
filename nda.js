// from docxtemplater website
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const filename = "nda"
const inputPath = path.join(__dirname, `./files/${filename}_template_with_defaults.docx`);
const outputPath = path.join(__dirname, `./files/${filename}_template.docx`);

// Load the docx file as binary content (async function)
const content = fs.readFileSync(inputPath,"binary");

// this is required to work with zip files, docx seem to be zip files
const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

/* const data = {
  "users": [
    {
      "name": "John"
    },
    {
      "name": "Mary"
    },
    {
      "name": "Jane"
    },
    {
      "name": "Sean"
    }
  ]
} */

const data = {
  party1: [
    {
      business: true,
      type: "entity",
      name: "Cosys",
      shortname: "Cosys",
      legal_form: "société civile",
      country: "France",
      registered_address: "10 rue Saint Paul, 75004, Paris, France",
      city: "Paris",
      registration_number: "519 072 417",
      representative : {
        first_name: "Fabrizio ",
        last_name: "Nastri",
        civilty: "M.",
        title: "gérant (managing director)"
      }
    },
  ],
  party1multiple: false,
  party2: [
    {
      business: true,
      name: "Tartampion",
      shortname: "Tartampion",
      legal_form: "SAS",
      country: "Poland",
      registered_address: "99 Bolkick laan, MZ-3434, Warsaw, Poland",
      city: "Warsaw",
      registration_number: "9789 6542 12",
      first_name: "Bogdan",
      last_name: "Polksi",
      civilty: "Z.",
      title: "apparcick (director)"
    },
    {
      business: true,
      name: "Cosys",
      shortname: "Cosys",
      legal_form: "société civile",
      country: "France",
      registered_address: "10 rue Saint Paul, 75004, Paris, France",
      city: "Paris",
      registration_number: "519 072 417",
      representative : {
        first_name: "Fabrizio ",
        last_name: "Nastri",
        civilty: "M.",
        title: "gérant (managing director)"
      }
    },
    {
      business: false,
      first_name: "Marina",
      last_name: "Querchig",
      civilty: "Mme.",
      nationality: "Swiss",
      birth_date: "21/08/1953",
      birth_city: "Milano",
      address: "45 rue du Brussier, B-1900, Genèves, Suisse",
      shortname: "Mme Querchig",
    }
  ],
  party2multiple: true,
  nonPoaching: false,
  nonCircumvention: false,
  nonCompetition: false,
  duration:true,
}

doc.render(data)
  
const buf = doc.getZip().generate({
  type: "nodebuffer",
  // compression: DEFLATE adds a compression step.
  // For a 50MB output document, expect 500ms additional CPU time
  compression: "DEFLATE",
});

// buf is a nodejs Buffer, you can either write it to a
// file or res.send it with express for example.
fs.writeFileSync(outputPath, buf);