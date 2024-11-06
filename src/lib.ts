import { Type } from "./base";

export enum NodeType {
  SourceFile = "source-file",
  NamedImports = "named-imports",
  Type = "type",
  Literal = "literal",
  MathOperation = "math-operation",
  VariableStatement = "variable-statement",
  PropertyGet = "property-get",
  VariableDeclaration = "variable-declaration",
  VariableChangeStatement = "variable-change-statement",
  NewLine = "new-line",
  SelfStatement = "self-statement",
  CommentStatement = "comment-statement",
  EnumPropertyDeclaration = "enum-property-declaration",
  EnumDeclaration = "enum-declaration",
  UseStatement = "use-statement",
  FunctionCall = "function-call",
  SelfParameter = "self-parameter",
  FunctionDeclarationParameter = "function-declaration-parameter",
  FunctionDeclaration = "function-declaration",
  ReturnStatement = "return-statement",
  StructPropertyDeclaration = "struct-property-declaration",
  StructDeclaration = "struct-declaration",
  StructInitPropertyStatement = "struct-init-property-statement",
  StructInitStatement = "struct-init-statement",
  ImplDeclaration = "impl-declaration",
  TraitDeclaration = "trait-declaration",
  TraitFunctionDeclaration = "trait-function-declaration",
}

export function optional(condition: boolean, result: string) {
  return condition ? result : "";
}

let currentLevel = 0;

export function nextPaddingLevel() {
  currentLevel++;
}

export function prevPaddingLevel() {
  currentLevel--;
}

export function withPadding(input: string) {
  let padding = ``;

  for (let i = 0; i < currentLevel; i++) {
    padding += "  ";
  }

  return `${padding}${input}`;
}

export function withNextPaddingLevel(input: () => string[], join = "") {
  nextPaddingLevel();
  const content = input()
    .map((l) => withPadding(l))
    .join(join);
  prevPaddingLevel();

  return content;
}

const primitiveTypes = [
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "f32",
  "f64",
  "bool",
  "chat",
  "isize",
  "usize",
  "str",
];

export function isRustPrimitiveType(type: string | Type) {
  if (typeof type === "string") {
    return primitiveTypes.includes(type);
  }

  if (typeof type.base === "string") {
    return primitiveTypes.includes(type.base);
  }

  return primitiveTypes.includes(type.base.identifier);
}
