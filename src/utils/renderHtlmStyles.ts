const baseText = {
  fontSize: 14,
  color: "#3A3B3C",
};

const codeStyle = {
  fontFamily: "monospace",
  backgroundColor: "#f0f0f0",
  padding: 2,
  paddingLeft: 4,
  paddingRight: 4,
  borderRadius: 3,
  fontSize: 13,
  color: "#3A3B3C",
};

const preStyle = {
  ...codeStyle,
  padding: 8,
  margin: 0,
  whiteSpace: "pre" as const,
};

const alignCenter = { textAlign: "center" as const };
const alignRight = { textAlign: "right" as const };
const alignLeft = { textAlign: "left" as const };
const alignJustify = { textAlign: "justify" as const };

const PARAGRAPH_CODE_BLOCK_REGEX =
  /(?:<p>\s*<code>[\s\S]*?<\/code>\s*<\/p>\s*)+/gi;
const SINGLE_CODE_PARAGRAPH_REGEX =
  /<p>\s*<code>([\s\S]*?)<\/code>\s*<\/p>/gi;
const QL_CODE_BLOCK_CONTAINER_REGEX =
  /<div[^>]*class="ql-code-block-container"[^>]*>((?:\s*<div[^>]*class="ql-code-block"[^>]*>[\s\S]*?<\/div>\s*)+)<\/div>/gi;
const SINGLE_QL_CODE_BLOCK_REGEX =
  /<div[^>]*class="ql-code-block"[^>]*>([\s\S]*?)<\/div>/gi;

const normalizeCodeLine = (line: string) =>
  line.replace(/<br\s*\/?>/gi, "").trimEnd();

export const formatHtmlContentForCodeBlocks = (html?: string | null) => {
  if (!html) {
    return "";
  }

  const formattedCodeContainer = html.replace(
    QL_CODE_BLOCK_CONTAINER_REGEX,
    (matchedCodeBlock, codeContainerInnerHtml) => {
      const lines = Array.from(
        String(codeContainerInnerHtml).matchAll(SINGLE_QL_CODE_BLOCK_REGEX),
        (match: RegExpMatchArray) => normalizeCodeLine(match[1] || "")
      );

      if (!lines.length) {
        return matchedCodeBlock;
      }

      return `<pre><code>${lines.join("\n")}</code></pre>`;
    }
  );

  return formattedCodeContainer.replace(
    PARAGRAPH_CODE_BLOCK_REGEX,
    (matchedCodeBlock) => {
      const lines = Array.from(
        matchedCodeBlock.matchAll(SINGLE_CODE_PARAGRAPH_REGEX),
        (match: RegExpMatchArray) => normalizeCodeLine(match[1] || "")
      );

      if (!lines.length) {
        return matchedCodeBlock;
      }

      return `<pre><code>${lines.join("\n")}</code></pre>`;
    }
  );
};

export const htmlStyles = {
  tagsStyles: {
    body: {
      margin: 0,
      padding: 0,
      color: "#3A3B3C",
    },
    p: {
      margin: 0,
      padding: 0,
      ...baseText,
    },
    li: {
      margin: 0,
      padding: 0,
      ...baseText,
    },
    code: codeStyle,
    pre: preStyle,
  },

  classesStyles: {
    "ql-code-block": codeStyle,

    "ql-align-center": alignCenter,
    "ql-align-right": alignRight,
    "ql-align-left": alignLeft,
    "ql-align-justify": alignJustify,
  },
};
