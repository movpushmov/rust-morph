import { AstNode } from "./base";
import { NodeType } from "./lib";

export class NamedImports implements AstNode {
  readonly type = NodeType.NamedImports;
  public imports: string[];

  constructor(options: { imports: string[] }) {
    this.imports = options.imports;
  }

  print(): string {
    const imports = this.imports.join(", ");

    return this.imports.length > 1 ? `{${imports}}` : imports;
  }
}

export class UseStatement implements AstNode {
  readonly type = NodeType.UseStatement;
  public path: (string | NamedImports)[];

  constructor(options: { path: (string | NamedImports)[] }) {
    this.path = options.path;
  }

  print(): string {
    const use = this.path
      .map((v) => (typeof v === "string" ? v : v.print()))
      .join("::");

    return `use ${use};`;
  }
}
