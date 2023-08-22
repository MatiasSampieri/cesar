const removeAccents = require('remove-accents');
const fs = require('fs');

const palabras = fs.readFileSync('./public/palabras.txt', {encoding: 'utf-8'}).split('\n');
const sin_acc = palabras.map(pal => removeAccents(pal));

fs.writeFileSync('./public/palabras_clean.json', JSON.stringify(sin_acc))