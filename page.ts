type Tag = "" | keyof HTMLElementTagNameMap;

type DomSelector =
  | Tag
  | `${Tag}#${string}`
  | `${Tag}.${string}`
  | `${Tag}#${string}.${string}`;

type InferElementTypeByTag<TT extends Tag | string> = TT extends ""
  ? HTMLDivElement
  : (
    TT extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TT]
      : HTMLElement
  );

type InferElementType<EOS extends DomSelector> = EOS extends "" ? HTMLDivElement
  : (
    EOS extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[EOS]
      : (
        EOS extends `${infer TT}#${string}` ? InferElementTypeByTag<TT>
          : (
            EOS extends `${infer TT}.${string}` ? InferElementTypeByTag<TT>
              : HTMLElement
          )
      )
  );

type ElementProperties<EOS extends DomSelector> =
  & Partial<Omit<InferElementType<EOS>, "style">>
  & { style?: Partial<CSSStyleDeclaration> };

type DomChild<EOS extends DomSelector = DomSelector> =
  | ElementProperties<InferElementType<EOS>>
  | string
  | undefined;

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
      childrenContent += child;
    } else {
      for (const key in child) {
        if (key === "style") {
          let style = "";
          for (const styleKey in child.style) {
            style += `${styleKey}:${
              child.style[styleKey as keyof typeof child.style]
            };`;
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
  jsFiles?: string[];
  cssFiles: string[];
  gtagId?: string;
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
