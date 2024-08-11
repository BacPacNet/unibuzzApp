export enum TypographyVariant {
  DISPLAY = "display",
  HEADING = "heading",
  LABEL = "label",
  PARAGRAPH = "paragraph",
  LINK = "link",
}

export enum TypographySize {
  LARGE = "large",
  MEDIUM = "medium",
  SMALL = "small",
  XTRASMALL = "xtrasmall",
}

type TypographyValue = {
  fontFamily: string;
  fontWeight: string;
  lineHeight?: number | string;
  fontSize: number;
  letterSpacing: number;
  paragraphSpacing: number;
  textDecoration: string;
  textCase: string;
  paragraphIndent?: string;
};

type TypographyItem = {
  value: TypographyValue;
  type: string;
};

export interface TypographyStyle {
  [TypographyVariant.DISPLAY]: Record<TypographySize, TypographyItem>;
  [TypographyVariant.HEADING]: Record<TypographySize, TypographyItem>;
  [TypographyVariant.LABEL]: Record<TypographySize, TypographyItem>;
  [TypographyVariant.PARAGRAPH]: Record<TypographySize, TypographyItem>;
  [TypographyVariant.LINK]: Record<TypographySize, TypographyItem>;
}
