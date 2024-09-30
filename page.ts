import {
  DomSelector,
  ElFunction,
} from "https://raw.githubusercontent.com/yjgaia/universal-page-module/refs/heads/main/src/mod.ts";

export const el: ElFunction<string, string> = function (
  selector: DomSelector,
  ...children: string[]
): string {
  const [tagName, idAndClasses] = selector.split(/(?=[#.])/);
  const tag = tagName || "div";
  let id = "";
  const classes: string[] = [];

  if (idAndClasses) {
    const parts = idAndClasses.split(".");
    parts.forEach((part) => {
      if (part.startsWith("#")) {
        id = part.slice(1);
      } else {
        classes.push(part);
      }
    });
  }

  let attributes = "";
  if (id) {
    attributes += ` id="${id}"`;
  }
  if (classes.length > 0) {
    attributes += ` class="${classes.join(" ")}"`;
  }

  const childrenContent = children.join("");

  return `<${tag}${attributes}>${childrenContent}</${tag}>`;
};
