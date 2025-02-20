import {
  DomChild,
  DomSelector,
} from "https://raw.githubusercontent.com/yjgaia/universal-page-module/refs/heads/main/deno/mod.ts";

export function el<S extends DomSelector>(
  selector: S,
  ...children: DomChild<S>[]
): string {
  const parts = (selector || "div").split(/([#.])/);
  const tag = parts[0] || "div";

  let id = "";
  const classes: string[] = [];

  let currentType: "#" | "." | "" = "";
  for (let i = 1; i < parts.length; i += 2) {
    currentType = parts[i] as "#" | ".";
    const value = parts[i + 1];
    if (currentType === "#") id = value;
    else if (currentType === ".") classes.push(value);
  }

  let attributes = "";
  if (id) {
    attributes += ` id="${id}"`;
  }
  if (classes.length > 0) {
    attributes += ` class="${classes.join(" ")}"`;
  }

  let childrenContent = "";

  for (const child of children) {
    if (child === undefined) continue;
    else if (typeof child === "string") {
      childrenContent += child.replace("\n", "<br>");
    } else {
      for (const key in child) {
        if (key === "style") {
          let style = "";
          for (const styleKey in child.style) {
            style += `${
              styleKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
            }:${child.style[styleKey as keyof typeof child.style]};`;
          }
          attributes += ` style="${style}"`;
        } else {
          attributes += ` ${key}="${child[key as keyof typeof child]}"`;
        }
      }
    }
  }

  return `<${tag}${attributes}>${childrenContent}</${tag}>`;
}

export function createPage(options: {
  title: string;
  suffix?: string;
  description?: string;
  coverImageURL?: string;
  jsFiles?: string[];
  cssFiles?: string[];
  gtagId?: string;
  viewTransition?: boolean;
  twitterHandle?: string;
}, ...children: string[]): string {
  let ogTags =
    `<meta property="og:type" content="website">\n<meta property="og:title" content="${options.title}">`;
  ogTags += options.coverImageURL
    ? `\n<meta property="og:image" content="${options.coverImageURL}">`
    : "";
  ogTags += options.description
    ? `\n<meta property="og:description" content="${options.description}">`
    : "";

  let twitterTags =
    `<meta name="twitter:card" content="summary">\n<meta name="twitter:title" content="${options.title}">`;
  twitterTags += options.coverImageURL
    ? `\n<meta name="twitter:image" content="${options.coverImageURL}">`
    : "";
  twitterTags += options.description
    ? `\n<meta name="twitter:description" content="${options.description}">`
    : "";
  twitterTags += options.twitterHandle
    ? `\n<meta name="twitter:site" content="${options.twitterHandle}">`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge, chrome=1">
  ${
    options.description
      ? `<meta name="description" content="${options.description}">`
      : ""
  }
  ${ogTags}
  ${twitterTags}
  <meta name="robots" content="index, follow">
  ${
    options.viewTransition
      ? '<meta name="view-transition" content="same-origin" />'
      : ""
  }
  <title>${
    options.title + (options.suffix ? ` | ${options.suffix}` : "")
  }</title>
  ${
    options.cssFiles
      ? options.cssFiles.map((file) =>
        `<link rel="stylesheet" type="text/css" href="${file}" />`
      ).join("\n")
      : ""
  }
  ${
    options.gtagId
      ? `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${options.gtagId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${options.gtagId}');
</script>`
      : ""
  }
</head>
<body>
  ${children.join("\n")}
  ${
    options.jsFiles
      ? options.jsFiles.map((file) => `<script src="${file}"></script>`).join(
        "\n",
      )
      : ""
  }
</body>
</html>`;
}
