import { EnumDeclaration, EnumPropertyDeclaration } from "./enum";
import {
  FunctionCall,
  FunctionDeclaration,
  FunctionDeclarationParameter,
  ReturnStatement,
  SelfParameter,
} from "./fn";
import { UseStatement } from "./imports";
import { NodeType, optional } from "./lib";
import {
  ImplDeclaration,
  StructDeclaration,
  StructInitPropertyStatement,
  StructInitStatement,
  StructPropertyDeclaration,
} from "./struct";

export interface AstNode {
  type: NodeType;
  print(): string;
}

type RustTypeBase =
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "i8"
  | "i16"
  | "i32"
  | "i64"
  | "f32"
  | "String"
  | "bool"
  | { identifier: string };

export class Type implements AstNode {
  readonly type = NodeType.Type;
  public base: RustTypeBase;

  public isReference: boolean;
  public isMutable: boolean;
  public lifetime?: string;
  public genericParams?: Type[];

  constructor(options: {
    base: RustTypeBase;
    isReference: boolean;
    isMutable: boolean;
    lifetime?: string;
    genericParams?: Type[];
  }) {
    this.base = options.base;
    this.isReference = options.isReference;
    this.isMutable = options.isMutable;
    this.lifetime = options.lifetime;
    this.genericParams = options.genericParams;
  }

  print(): string {
    const r = optional(this.isReference, "&");
    const lt = optional(Boolean(this.lifetime), `'${this.lifetime} `);
    const mt = optional(this.isMutable, "mut ");
    const b = typeof this.base === "object" ? this.base.identifier : this.base;

    return `${r}${lt}${mt}${b}`;
  }
}

export class MathOperation implements AstNode {
  readonly type = NodeType.MathOperation;
  public leftOperand: Expression;
  public rightOperand: Expression;

  constructor(options: { leftOperand: Expression; rightOperand: Expression }) {
    this.leftOperand = options.leftOperand;
    this.rightOperand = options.rightOperand;
  }

  print(): string {
    throw "Not implemented";
  }
}

export class AddOperation extends MathOperation implements AstNode {
  print(): string {
    return `${this.leftOperand.print()} + ${this.rightOperand.print()}`;
  }
}
export class SubtractOperation extends MathOperation {
  print(): string {
    return `${this.leftOperand.print()} - ${this.rightOperand.print()}`;
  }
}

export class MultiplyOperation extends MathOperation {
  print(): string {
    return `${this.leftOperand.print()} * ${this.rightOperand.print()}`;
  }
}

export class DivideOperation extends MathOperation {
  print(): string {
    return `${this.leftOperand.print()} / ${this.rightOperand.print()}`;
  }
}

export type Expression =
  | Literal
  | MathOperation
  | VariableStatement
  | FunctionCall;

export class Literal implements AstNode {
  readonly type = NodeType.Literal;

  constructor(public value: string) {}

  print(): string {
    return this.value;
  }
}

export class VariableStatement implements AstNode {
  readonly type = NodeType.VariableStatement;

  public isReference: boolean;
  public isMutable: boolean;
  public identifier: string;
  public nextStatement?: FunctionCall | PropertyGet;
  public lifetime?: string;

  constructor(options: {
    isReference: boolean;
    isMutable: boolean;
    identifier: string;
    nextStatement?: FunctionCall | PropertyGet;
    lifetime?: string;
  }) {
    this.isReference = options.isReference;
    this.isMutable = options.isMutable;
    this.identifier = options.identifier;
    this.nextStatement = options.nextStatement;
    this.lifetime = options.lifetime;
  }

  print(): string {
    const r = optional(this.isReference, "&");
    const lt = optional(Boolean(this.lifetime), `'${this.lifetime} `);
    const mt = optional(this.isMutable, "mut ");
    const ns = optional(
      Boolean(this.nextStatement),
      this.nextStatement?.print()!
    );

    return `${r}${lt}${mt}${this.identifier}${ns}`;
  }
}

export class PropertyGet implements AstNode {
  readonly type = NodeType.PropertyGet;

  public identifier: string;
  public isAwaited: boolean;
  public isFromNamespaceOrStruct: boolean;

  constructor(options: {
    identifier: string;
    isAwaited: boolean;
    isFromNamespaceOrStruct: boolean;
  }) {
    this.identifier = options.identifier;
    this.isAwaited = options.isAwaited;
    this.isFromNamespaceOrStruct = options.isFromNamespaceOrStruct;
  }

  print(): string {
    const nos = this.isFromNamespaceOrStruct ? "::" : ".";

    return `${nos}${this.identifier}${optional(this.isAwaited, ".await")}`;
  }
}

export class VariableDeclaration implements AstNode {
  readonly type = NodeType.VariableDeclaration;

  public identifier: string;
  public isConst: boolean;
  public isMutable: boolean;
  public variableType?: Type;
  public value?: Expression;

  constructor(options: {
    identifier: string;
    isConst: boolean;
    isMutable: boolean;
    type?: Type;
    value?: Expression;
  }) {
    this.identifier = options.identifier;
    this.isConst = options.isConst;
    this.isMutable = options.isMutable;
    this.variableType = options.type;
    this.value = options.value;
  }

  print(): string {
    const c = this.isConst ? "const" : "let";
    const t = optional(Boolean(this.type), `: ${this.variableType?.print()}`);
    const v = optional(Boolean(this.value), ` = ${this.value?.print()}`);

    return `${c} ${this.identifier}${t}${v}`;
  }
}

export enum VariableChangeType {
  Add,
  Subtract,
  Divide,
  Multiply,
  Equal,
}

export class VariableChangeStatement implements AstNode {
  readonly type = NodeType.VariableChangeStatement;

  public toAssign: VariableStatement;
  public value: Expression;
  public changeType: VariableChangeType;

  constructor(options: {
    identifier: VariableStatement;
    value: Expression;
    changeType?: VariableChangeType;
  }) {
    this.toAssign = options.identifier;
    this.value = options.value;
    this.changeType = options.changeType ?? VariableChangeType.Equal;
  }

  print(): string {
    let ct = "";

    switch (this.changeType) {
      case VariableChangeType.Add: {
        ct = "+=";
        break;
      }
      case VariableChangeType.Subtract: {
        ct = "-=";
        break;
      }
      case VariableChangeType.Divide: {
        ct = "/=";
        break;
      }
      case VariableChangeType.Multiply: {
        ct = "*=";
        break;
      }
      case VariableChangeType.Equal: {
        ct = "=";
        break;
      }
    }

    return `${this.toAssign.print()} ${ct} ${this.value.print()}`;
  }
}

export class NewLine implements AstNode {
  readonly type = NodeType.NewLine;

  print(): string {
    return "";
  }
}

export class SelfStatement extends VariableStatement {
  print(): string {
    const baseClassResult = super.print();

    return `self.${baseClassResult}`;
  }
}

export class CommentStatement implements AstNode {
  readonly type = NodeType.CommentStatement;

  public content: string;
  public isMultiline: boolean;

  constructor(options: { content: string; isMultiline: boolean }) {
    this.content = options.content;
    this.isMultiline = options.isMultiline;
  }

  print(): string {
    return this.isMultiline ? `/*${this.content}*/` : `// ${this.content}`;
  }
}

export const newLine = new NewLine();

export type CodeLine =
  | Expression
  | VariableDeclaration
  | FunctionDeclaration
  | StructDeclaration
  | EnumDeclaration
  | ImplDeclaration
  | StructInitStatement
  | ReturnStatement
  | NewLine
  | CommentStatement
  | UseStatement;

export type AnyNode =
  | CodeLine
  | FunctionDeclarationParameter
  | SelfParameter
  | StructPropertyDeclaration
  | StructInitPropertyStatement
  | EnumPropertyDeclaration;
