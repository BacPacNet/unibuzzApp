import { useTheme } from "@/theme";
import { TypographySize, TypographyVariant } from "@/theme/styling/types";
import React from "react";
import { Text, TextProps } from "react-native";
import typography from "@/theme/styling/tokens/typography.json";

export interface Props extends TextProps {
  color?: any;
  variant: TypographyVariant;
  size: TypographySize;
}

//export interface Props extends TextProps {
//  color?: TypographyColors;
//  variant?: TypographyVariant;
//  size?: TypographySize;
//}

//const Text = styled(BaseText)<{
//  color: TypographyColors;
//  variant: TypographyVariant;
//  size: TypographySize;
//}>`
//  ${({ color, size, theme, variant }) => {
//    const style = theme.typography[variant][size].value;
//    const { fontWeight } = style;
//    let { fontFamily, lineHeight } = style;

//    if (Number.isNaN(parseInt(fontWeight))) {
//      fontFamily = `${fontFamily} ${fontWeight}`;
//    }
//    if (typeof lineHeight === 'number') {
//      lineHeight = `${lineHeight}px`;
//    } else {
//      lineHeight = undefined;
//    }

//    return {
//      ...style,
//      color: theme.colors.content[color].value,
//      fontFamily,
//      lineHeight,
//    };
//  }}
//`;

const Typography = ({
  children,
  style,
  variant,
  size,
  color,
  ...rest
}: Props) => {
  const { colors } = useTheme();
  const customStyle = typography[variant][size].value;
  const { fontFamily, fontWeight } = customStyle;
  const textStyles = {
    ...customStyle,
    fontFamily: `${fontFamily}-${fontWeight}`,
    color: color ? color : colors.text,
  };

  return (
    <Text style={[textStyles, style]} {...rest}>
      {children}
    </Text>
  );
};

export default Typography;
