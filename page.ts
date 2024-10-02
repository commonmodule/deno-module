import {
  DomSelector,
  ElFunction,
} from "https://raw.githubusercontent.com/yjgaia/universal-page-module/refs/heads/main/src/mod.ts";

export const el: ElFunction<string> = function (
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

export function createPage(options: {
  title: string;
  cssFiles: string[];
}, ...children: string[]): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">
  <title>${options.title}</title>
  ${
    options.cssFiles.map((file) =>
      `<link rel="stylesheet" type="text/css" href="${file}" />`
    ).join("\n")
  }
</head>
<body>
  ${children.join("\n")}
</body>
</html>`;
}
