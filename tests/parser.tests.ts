import { parse } from '../src/parser';

test('parse valid', () => {
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
  expect(() => parse(text)).not.toThrow();
});
