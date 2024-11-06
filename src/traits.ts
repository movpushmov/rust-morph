import { AstNode, Type } from "./base";
import { FunctionDeclarationParameter, SelfParameter } from "./fns";
import { NodeType, optional, withNextPaddingLevel } from "./lib";

export class TraitFunctionDeclaration implements AstNode {
  readonly type = NodeType.FunctionDeclaration;
  public identifier: string;
  public isAsync: boolean;
  public returnType?: Type;
  public parameters: (FunctionDeclarationParameter | SelfParameter)[];

  constructor(options: {
    identifier: string;
    isAsync: boolean;
    returnType?: Type;
    parameters: (FunctionDeclarationParameter | SelfParameter)[];
  }) {
    this.identifier = options.identifier;
    this.isAsync = options.isAsync;
    this.returnType = options.returnType;
    this.parameters = options.parameters;
  }

  print(): string {
    const as = optional(this.isAsync, "async ");
    const params = this.parameters.map((p) => p.print()).join(", ");
    const t = optional(
      Boolean(this.returnType),
      ` -> ${this.returnType?.print()}`
    );

    return `${as}fn ${this.identifier}(${params})${t}`;
  }
}

export class TraitDeclaration implements AstNode {
  readonly type = NodeType.TraitDeclaration;
  public identifier: string;
  public declarations: TraitFunctionDeclaration[];

  constructor(options: {
    identifier: string;
    declarations: TraitFunctionDeclaration[];
  }) {
    this.identifier = options.identifier;
    this.declarations = options.declarations;
  }

  print(): string {
    const body =
      this.declarations.length > 0
        ? `{\n${withNextPaddingLevel(
            () => this.declarations.map((declaration) => declaration.print()),
            ";\n"
          )};\n}`
        : "{}";

    return `trait ${this.identifier} ${body}`;
  }
}
