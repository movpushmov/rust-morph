import { AstNode, Expression, Literal, Type } from "./base";
import { FunctionDeclaration } from "./fn";
import { optional, withNextPaddingLevel, withPadding } from "./lib";

export class StructPropertyDeclaration implements AstNode {
  public identifier: string;
  public isPublic: boolean;
  public type: Type;

  constructor(options: { identifier: string; isPublic: boolean; type: Type }) {
    this.identifier = options.identifier;
    this.isPublic = options.isPublic;
    this.type = options.type;
  }

  print(): string {
    const p = optional(this.isPublic, "pub ");

    return `${p}${this.identifier}: ${this.type.print()}`;
  }
}

export class StructDeclaration implements AstNode {
  public identifier: string;
  public isPublic: boolean;
  public properties: StructPropertyDeclaration[];

  constructor(options: {
    identifier: string;
    isPublic: boolean;
    properties: StructPropertyDeclaration[];
  }) {
    this.identifier = options.identifier;
    this.isPublic = options.isPublic;
    this.properties = options.properties;
  }

  print(): string {
    const p = optional(this.isPublic, "pub ");
    const pr =
      this.properties.length > 0
        ? withNextPaddingLevel(
            () => this.properties.map((p) => p.print()),
            ",\n"
          )
        : undefined;

    return `${p}${this.identifier} ${pr ? `{\n${pr}\n}` : "{}"}`;
  }
}

export class StructInitPropertyStatement implements AstNode {
  public identifier: string;
  public value: Expression;

  constructor(options: { identifier: string; value: Expression }) {
    this.identifier = options.identifier;
    this.value = options.value;
  }

  print(): string {
    return `${this.identifier}: ${this.value.print()}`;
  }
}

export class StructInitStatement implements AstNode {
  public identifier: string;
  public parameters: StructInitPropertyStatement[];

  constructor(options: {
    identifier: string;
    parameters: StructInitPropertyStatement[];
  }) {
    this.identifier = options.identifier;
    this.parameters = options.parameters;
  }

  print(): string {
    const params =
      this.parameters.length > 0
        ? withNextPaddingLevel(
            () => this.parameters.map((p) => p.print()),
            ",\n"
          )
        : undefined;

    return `${this.identifier} ${
      params ? `{\n${params}\n${withPadding("}")}` : "{}"
    }`;
  }
}

export class ImplDeclaration implements AstNode {
  public identifier: string;
  public declarations: FunctionDeclaration[];

  constructor(options: {
    identifier: string;
    declarations: FunctionDeclaration[];
  }) {
    this.identifier = options.identifier;
    this.declarations = options.declarations;
  }

  print(): string {
    const declarations = withNextPaddingLevel(
      () => this.declarations.map((d) => d.print()),
      "\n\n"
    );

    return `impl ${this.identifier} {\n${declarations}\n}`;
  }
}
