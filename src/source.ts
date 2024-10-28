import { AstNode, CodeLine } from "./base";

export class SourceFile implements AstNode {
  public lines: CodeLine[];

  constructor(options: { lines: CodeLine[] }) {
    this.lines = options.lines;
  }

  print(): string {
    return this.lines.map((l) => l.print()).join("\n");
  }
}
