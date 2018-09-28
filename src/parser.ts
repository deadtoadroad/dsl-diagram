import { IParserDefinitionError, Parser } from 'chevrotain';
import * as lexer from './lexer';
import { tokenise, tokenVocabulary } from './lexer';
import * as _ from 'lodash/fp';

export class DiagramParser extends Parser {
  constructor(config = {}) {
    super(tokenVocabulary, config);
    this.performSelfAnalysis();
  }

  public diagram = this.RULE('diagram', () => {
    this.SUBRULE(this.titleStatement);
    this.AT_LEAST_ONE(() => this.SUBRULE(this.actorStatement));
    this.AT_LEAST_ONE1(() => this.SUBRULE(this.signalStatement));
  });

  private titleStatement = this.RULE('titleStatement', () => {
    this.CONSUME(lexer.Title);
    this.CONSUME(lexer.Colon);
    this.CONSUME(lexer.String);
  });

  private actorStatement = this.RULE('actorStatement', () => {
    this.CONSUME(lexer.Actor);
    this.CONSUME(lexer.Identifier);
    this.CONSUME(lexer.Equals);
    this.CONSUME(lexer.String);
  });

  private signalStatement = this.RULE('signalStatement', () => {
    this.CONSUME(lexer.Identifier, { LABEL: 'lhs' });
    this.CONSUME(lexer.Pointer);
    this.CONSUME1(lexer.Identifier, { LABEL: 'rhs' });
    this.CONSUME(lexer.Colon);
    this.CONSUME(lexer.String);
  });
}

export const diagramParser = new DiagramParser();

export const parse = (text: string): void => {
  const lexingResult = tokenise(text);
  diagramParser.input = lexingResult.tokens;
  diagramParser.diagram();
  if (diagramParser.errors.length > 0) {
    _.forEach<IParserDefinitionError>(e => console.error(e.message))(diagramParser.errors);
    throw Error(`No joy [${diagramParser.errors[0].message}].`);
  }
};
