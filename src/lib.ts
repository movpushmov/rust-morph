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
