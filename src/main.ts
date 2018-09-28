import { tokenise } from './lexer';
import { parse } from './parser';
import { toAst } from './actions';
import commandLineArgs = require('command-line-args');

const text = `
title: "Demo Sequence Diagram"
actor AD = "Agile Digital"
actor ajb = "Adam"
actor p = "A Bad Program"
AD -> ajb: "Asks to do demo"
ajb -> AD: "Reluctantly agrees"
ajb -> p: "Launches"
p -> AD: "Fails to impress"
AD -> ajb: "Frowns"`;

const options = commandLineArgs([
  { name: 'text', alias: 'x', type: Boolean },
  { name: 'tokenise', alias: 't', type: Boolean },
  { name: 'parse', alias: 'p', type: Boolean },
  { name: 'toAst', alias: 'a', type: Boolean }
]);

if (options.text) {
  console.log(text);
}

if (options.tokenise) {
  const lexingResult = tokenise(text);
  console.log(JSON.stringify(lexingResult, null, 2));
}

if (options.parse) {
  parse(text);
}

if (options.toAst) {
  const ast = toAst(text);
  console.log(JSON.stringify(ast, null, 2));
}
