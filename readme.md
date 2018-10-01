# DSL Diagram

## DSL

If we create a small [domain specific language](https://en.wikipedia.org/wiki/Domain-specific_language) (DSL) to describe a [sequence diagram](https://en.wikipedia.org/wiki/Sequence_diagram), it might look something like this:

    title: "Demo Sequence Diagram"
    actor AD = "Agile Digital"
    actor ajb = "Adam"
    actor p = "A Bad Program"
    AD -> ajb: "Asks to do demo"
    ajb -> AD: "Reluctantly agrees"
    ajb -> p: "Launches"
    p -> AD: "Fails to impress"
    AD -> ajb: "Frowns"

We might want to do this for a number of reasons:

* DSLs are light and easy to use.
* Text files are easily source controlled, making them versionable and diffable.
* Generating the diagrams can be automated, making changing font, size, colour, or adding a graphic to all diagrams in a project an easier task.

So how do we translate our human readable DSL into a more machine readable format for an image generation process? We could brute force it with our own suite of string readers and [regular expressions](https://en.wikipedia.org/wiki/Regular_expression). Or we could employ a [parser](https://en.wikipedia.org/wiki/Parsing) building library to properly parse our DSL and extract from it an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST).

## Parser

This project is TypeScript running on Node.js using Yarn. Unit testing is done with Jest. All the heavy lifting around the parsing is done with a very nice library called [Chevrotain](https://github.com/SAP/chevrotain).

To build the program, type:

    yarn install
    yarn tsc

To test the program, type:

    yarn test

To run the program, type:

    yarn main [options]

The options indicate which part of the program you would like to run and it is possible to specify more than one.

    -x, --text        Show the sample DSL text.
    -t, --tokenise    Tokenise and show tokens or errors.
    -p, --parse       Parse and show errors.
    -a, --toAst       Convert to an AST and show the AST or errors.

Alternatively type the following commands to perform a single step.

    yarn text
    yarn tokenise
    yarn parse
    yarn toAst

### Tokenise

The first step is to define the tokens in our language, which at first glance appear to be:

  * The "title" keyword.
  * The "actor" keyword.
  * Identifier, a short label with no white space (e.g. `AD`).
  * Colon symbol.
  * Equals symbol.
  * A pointer symbol (`->`).
  * Double quoted string for longer labels with white space.
  * And of course white space itself.

Chevrotain makes this easy to do, with each token getting a name and short regular expression to define them. You can see the definitions in `lexer.ts`.

Tokens that might be another token if the lexer keeps reading can be marked as such with the `longer_alt` property. For example, `actorB` should be an identifier, not the `actor` keyword and a `B` identifier. The order the tokens are given to the lexer also matter. For example, we need to define our keywords before identifier, otherwise all keywords would be mistakenly read as identifiers (the flip side of `longer_alt`). And tokens that we don't care about (like white space) can be added to the `Lexer.SKIPPED` group.

Type `yarn tokenise` to see the tokens generated from the sample DSL text.

### Parse

Tokens aren't much good on their own. They need to be combined into meaningful structures or statements. For our DSL, these might be:

  * The diagram itself, made up of:
    * One title statement.
    * One or more actor statements.
    * One or more signal statements.
  * A title statement, made up of:
    * The title keyword.
    * Colon.
    * String.
  * An actor statement, made up of:
    * The actor keyword.
    * An identifier.
    * Equals.
    * String.
  * A signal statement, made up of:
    * An identifier (actor 1, `lhs`).
    * Pointer.
    * An identifier (actor 2, `rhs`).
    * Colon.
    * String.

The parser is where the rules are defined, see `parser.ts`. Chevrotain makes defining rules, subrules, and collections easy. We can even label certain tokens for easier identification later on when building our AST.

Type `yarn parse` to see any errors from parsing the sample DSL text. Chevrotain will tell us what it was expecting and what it received instead. Chevrotain can also provide suggestions during coding through an [assist function](http://sap.github.io/chevrotain/website/Deep_Dive/syntactic_content_assist.html).

### To AST

The parser internally builds a concrete syntax tree (CST) which usually has more information than we need. To build an AST, Chevrotain employs the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern) to allow a separate class to do the work. This lets the parser do its thing, but also allows us to define more than one AST generator for a given parser if we need to.

We're going to build a single object in memory from our DSL text, extracting all the information we need to generate an image or produce a script. See `actions.ts` to see how the information is extracted from the provided context object, and how the `visit` method is used for handling embedded statements. Each token consumed in a rule or subrule appears as a collection in the context object. When order matters and we want to be more explicit, labels defined in the parser also appear in the context object (e.g. the `lhs` and `rhs` labels used in the signal statement).

Type `yarn toAst` to see the final AST generated from the sample DSL text.

## Profit

A diagram hasn't been generated yet, but hopefully this chunk of code demonstrates one way to define a DSL and translate it into a more machine readable format. From that we can generate a diagram, a script, some scaffolding or boilerplate code, an environment definition, or really anything we want to automate or wish was less cryptic or verbose.
