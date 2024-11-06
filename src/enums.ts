import { AstNode } from "./base";
import { NodeType, optional, withNextPaddingLevel } from "./lib";

export class EnumPropertyDeclaration implements AstNode {
  readonly type = NodeType.EnumPropertyDeclaration;
  public identifier: string;
  public value?: string | number;

  constructor(options: { identifier: string; value?: string | number }) {
    this.identifier = options.identifier;
    this.value = options.value;
  }

  print(): string {
    const v = optional(Boolean(this.value), ` = ${this.value}`);

    return `${this.identifier}${v}`;
  }
}

export class EnumDeclaration implements AstNode {
  readonly type = NodeType.EnumDeclaration;
  public identifier: string;
  public isPublic: boolean;
  public fields: EnumPropertyDeclaration[];

  constructor(options: {
    identifier: string;
    isPublic: boolean;
    fields: EnumPropertyDeclaration[];
  }) {
    this.identifier = options.identifier;
    this.isPublic = options.isPublic;
    this.fields = options.fields;
  }

  print(): string {
    const p = optional(this.isPublic, "pub ");
    const i = this.identifier;
    const f =
      this.fields.length > 0
        ? withNextPaddingLevel(() => this.fields.map((f) => f.print()), ",\n")
        : undefined;

    return `${p}enum ${i} {\n${f ?? ""}\n}`;
  }
}
