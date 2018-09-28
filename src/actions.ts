import { diagramParser } from './parser';
import { tokenise } from './lexer';
import { IParserDefinitionError } from 'chevrotain';
import * as _ from 'lodash/fp';

const BaseCstVisitor = diagramParser.getBaseCstVisitorConstructor();

class DiagramToAstVisitor extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  diagram(ctx) {
    const title = this.visit(ctx.titleStatement);
    const actors = ctx.actorStatement.map(as => this.visit(as));
    const signals = ctx.signalStatement.map(ss => this.visit(ss));
    return {
      title: title.label,
      actors,
      signals
    };
  }

  titleStatement(ctx) {
    const label = ctx.String[0].image;
    return {
      label
    };
  }

  actorStatement(ctx) {
    const id = ctx.Identifier[0].image;
    const name = ctx.String[0].image;
    return {
      id,
      name
    };
  }

  signalStatement(ctx) {
    const fromActor = ctx.lhs[0].image;
    const toActor = ctx.rhs[0].image;
    const action = ctx.String[0].image;
    return {
      fromActor,
      toActor,
      action
    }
  }
}

export const diagramToAstVisitor = new DiagramToAstVisitor();

export const toAst = (text: string) => {
  const lexingResult = tokenise(text);
  diagramParser.input = lexingResult.tokens;
  const cst = diagramParser.diagram();
  if (diagramParser.errors.length > 0) {
    _.forEach<IParserDefinitionError>(e => console.error(e.message))(diagramParser.errors);
    throw Error(`No joy [${diagramParser.errors[0].message}].`);
  }
  return diagramToAstVisitor.visit(cst);
};
