import {
  AstNode,
  CodeLine,
  Expression,
  PropertyGet,
  Type,
  VariableStatement,
} from "./base";
import { optional, withNextPaddingLevel, withPadding } from "./lib";
import { StructInitStatement } from "./struct";

export enum BracesType {
  Squared,
  Rounded,
}

type MacrosParameters = {
  bracesType: BracesType;
};

export class FunctionCall implements AstNode {
  public identifier: string;
  public isMacros: boolean;
  public isAwaited: boolean;
  public isFromNamespaceOrStruct: boolean;
  public passedParameters: Expression[];
  public nextCalls: FunctionCall | PropertyGet;
  public macrosParameters?: MacrosParameters;

  constructor(options: {
    identifier: string;
    isMacros: boolean;
    isAwaited: boolean;
    isFromNamespaceOrStruct: boolean;
    passedParameters: Expression[];
    nextCalls: FunctionCall | PropertyGet;
    macrosParameters?: MacrosParameters;
  }) {
    this.identifier = options.identifier;
    this.isMacros = options.isMacros;
    this.isAwaited = options.isAwaited;
    this.isFromNamespaceOrStruct = options.isFromNamespaceOrStruct;
    this.passedParameters = options.passedParameters;
    this.nextCalls = options.nextCalls;
    this.macrosParameters = options.macrosParameters;
  }

  print(): string {
    const nos = this.isFromNamespaceOrStruct ? "::" : ".";
    const lb =
      this.macrosParameters?.bracesType === BracesType.Rounded ? "(" : "[";
    const pp = this.passedParameters.map((p) => p.print()).join(", ");
    const rb =
      this.macrosParameters?.bracesType === BracesType.Rounded ? ")" : "]";
    const aw = optional(this.isAwaited, ".await");
    const nc = this.nextCalls.print();

    return `${nos}${this.identifier}${lb}${pp}${rb}${aw}${nc}`;
  }
}

export class SelfParameter implements AstNode {
  public isMutable: boolean;

  constructor(options: { isMutable: boolean }) {
    this.isMutable = options.isMutable;
  }

  print(): string {
    return this.isMutable ? `&mut self` : `&self`;
  }
}

export class FunctionDeclarationParameter implements AstNode {
  public identifier: string;
  public type: Type;

  constructor(options: { identifier: string; type: Type }) {
    this.identifier = options.identifier;
    this.type = options.type;
  }

  print(): string {
    return `${this.identifier}: ${this.type.print()}`;
  }
}

export class FunctionDeclaration implements AstNode {
  public identifier: string;
  public isPublic: boolean;
  public isAsync: boolean;
  public returnType: Type;
  public parameters: (FunctionDeclarationParameter | SelfParameter)[];
  public body: CodeLine[];

  constructor(options: {
    identifier: string;
    isPublic: boolean;
    isAsync: boolean;
    returnType: Type;
    parameters: (FunctionDeclarationParameter | SelfParameter)[];
    body: CodeLine[];
  }) {
    this.identifier = options.identifier;
    this.isPublic = options.isPublic;
    this.isAsync = options.isAsync;
    this.returnType = options.returnType;
    this.parameters = options.parameters;
    this.body = options.body;
  }

  print(): string {
    const p = optional(this.isPublic, "pub ");
    const as = optional(this.isAsync, "async ");
    const params = this.parameters.map((p) => p.print()).join(", ");
    const t = optional(
      Boolean(this.returnType),
      ` -> ${this.returnType.print()}`
    );

    const b =
      this.body.length > 0
        ? withNextPaddingLevel(() => this.body.map((c) => c.print()), ";\n")
        : undefined;

    const body = b ? `{\n${b}\n${withPadding("}")}` : `{}`;

    return `${p}${as}fn ${this.identifier}(${params})${t} ${body}`;
  }
}

export class ReturnStatement implements AstNode {
  public payload:
    | FunctionCall
    | VariableStatement
    | PropertyGet
    | StructInitStatement;

  public withKeyword: boolean;

  constructor(options: {
    payload:
      | FunctionCall
      | VariableStatement
      | PropertyGet
      | StructInitStatement;
    withKeyword?: boolean;
  }) {
    this.payload = options.payload;
    this.withKeyword = options.withKeyword ?? false;
  }

  print(): string {
    const p = this.payload.print();

    return this.withKeyword ? `return ${p};` : `${p}`;
  }
}
