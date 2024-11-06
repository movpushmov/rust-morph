import { AstNode, CodeLine } from "./base";
import { NodeType } from "./lib";

export class SourceFile implements AstNode {
  readonly type = NodeType.SourceFile;
  public lines: CodeLine[];

  constructor(options: { lines: CodeLine[] }) {
    this.lines = options.lines;
  }

  print(): string {
    return this.lines.map((l) => l.print()).join("\n");
  }
}
