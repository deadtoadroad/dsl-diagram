import * as lexer from '../src/lexer';
import { tokenise } from '../src/lexer';
import { tokenMatcher } from 'chevrotain';

test('tokenise title', () => {
  const text = 'title: "a random title here"';
  const lexingResult = tokenise(text);
  expect(lexingResult.errors.length).toBe(0);
  const tokens = lexingResult.tokens;
  expect(tokens.length).toBe(3);
  expect(tokens[0].image).toBe('title');
  expect(tokens[1].image).toBe(':');
  expect(tokens[2].image).toBe('"a random title here"');
  expect(tokenMatcher(tokens[0], lexer.Title));
  expect(tokenMatcher(tokens[1], lexer.Colon));
  expect(tokenMatcher(tokens[2], lexer.String));
});

test('tokenise actor', () => {
  const text = 'actor a1 = "actor 1"';
  const lexingResult = tokenise(text);
  expect(lexingResult.errors.length).toBe(0);
  const tokens = lexingResult.tokens;
  expect(tokens.length).toBe(4);
  expect(tokens[0].image).toBe('actor');
  expect(tokens[1].image).toBe('a1');
  expect(tokens[2].image).toBe('=');
  expect(tokens[3].image).toBe('"actor 1"');
  expect(tokenMatcher(tokens[0], lexer.Actor));
  expect(tokenMatcher(tokens[1], lexer.Identifier));
  expect(tokenMatcher(tokens[2], lexer.Equals));
  expect(tokenMatcher(tokens[3], lexer.String));
});

test('tokenise signal', () => {
  const text = 'a1 -> a2: "action"';
  const lexingResult = tokenise(text);
  expect(lexingResult.errors.length).toBe(0);
  const tokens = lexingResult.tokens;
  expect(tokens.length).toBe(5);
  expect(tokens[0].image).toBe('a1');
  expect(tokens[1].image).toBe('->');
  expect(tokens[2].image).toBe('a2');
  expect(tokens[3].image).toBe(':');
  expect(tokens[4].image).toBe('"action"');
  expect(tokenMatcher(tokens[0], lexer.Identifier));
  expect(tokenMatcher(tokens[1], lexer.Pointer));
  expect(tokenMatcher(tokens[2], lexer.Identifier));
  expect(tokenMatcher(tokens[3], lexer.Colon));
  expect(tokenMatcher(tokens[4], lexer.String));
});
