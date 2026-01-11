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

const alignCenter = { textAlign: "center" as const };
const alignRight = { textAlign: "right" as const };
const alignLeft = { textAlign: "left" as const };
const alignJustify = { textAlign: "justify" as const };

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
  },

  classesStyles: {
    "ql-code-block": codeStyle,

    "ql-align-center": alignCenter,
    "ql-align-right": alignRight,
    "ql-align-left": alignLeft,
    "ql-align-justify": alignJustify,
  },
};
