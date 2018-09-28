import { createToken, ILexerDefinitionError, ILexingResult, Lexer, TokenType } from 'chevrotain';
import * as _ from 'lodash/fp';

export const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z][\w-]*/ });

export const Title = createToken({
  name: 'Title',
  pattern: /title/,
  longer_alt: Identifier
});

export const Actor = createToken({
  name: 'Actor',
  pattern: /actor/,
  longer_alt: Identifier
});

export const Colon = createToken({
  name: 'Colon',
  pattern: /:/
});

export const Equals = createToken({
  name: 'Equals',
  pattern: /=/
});

export const Pointer = createToken({
  name: 'Pointer',
  pattern: /->/
});

export const String = createToken({
  name: 'String',
  pattern: /".*?"/
});

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

const allTokens: TokenType[] = [
  Title,
  Actor,
  Identifier,
  Colon,
  Equals,
  Pointer,
  String,
  WhiteSpace
];

export const DiagramLexer = new Lexer(allTokens);

export const tokenVocabulary = _.keyBy<TokenType>(t => t.name)(allTokens);

export const tokenise = (text: string): ILexingResult => {
  const lexingResult = DiagramLexer.tokenize(text);
  if (lexingResult.errors.length > 0) {
    _.forEach<ILexerDefinitionError>(e => console.error(e.message))(lexingResult.errors);
    throw Error(`No joy [${lexingResult.errors[0].message}].`);
  }
  return lexingResult;
};
