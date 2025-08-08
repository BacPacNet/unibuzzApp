export const FONTS = {
  // Inter Font Family (18pt)
  inter: {
    thin: "Inter_18pt-Thin",
    thinItalic: "Inter_18pt-ThinItalic",
    extraLight: "Inter_18pt-ExtraLight",
    extraLightItalic: "Inter_18pt-ExtraLightItalic",
    light: "Inter_18pt-Light",
    lightItalic: "Inter_18pt-LightItalic",
    regular: "Inter_18pt-Regular",
    italic: "Inter_18pt-Italic",
    medium: "Inter_18pt-Medium",
    mediumItalic: "Inter_18pt-MediumItalic",
    semiBold: "Inter_18pt-SemiBold",
    semiBoldItalic: "Inter_18pt-SemiBoldItalic",
    bold: "Inter_18pt-Bold",
    boldItalic: "Inter_18pt-BoldItalic",
    extraBold: "Inter_18pt-ExtraBold",
    extraBoldItalic: "Inter_18pt-ExtraBoldItalic",
    black: "Inter_18pt-Black",
    blackItalic: "Inter_18pt-BlackItalic",
  },
  
  // Inter Font Family (24pt)
  inter24: {
    thin: "Inter_24pt-Thin",
    thinItalic: "Inter_24pt-ThinItalic",
    extraLight: "Inter_24pt-ExtraLight",
    extraLightItalic: "Inter_24pt-ExtraLightItalic",
    light: "Inter_24pt-Light",
    lightItalic: "Inter_24pt-LightItalic",
    regular: "Inter_24pt-Regular",
    italic: "Inter_24pt-Italic",
    medium: "Inter_24pt-Medium",
    mediumItalic: "Inter_24pt-MediumItalic",
    semiBold: "Inter_24pt-SemiBold",
    semiBoldItalic: "Inter_24pt-SemiBoldItalic",
    bold: "Inter_24pt-Bold",
    boldItalic: "Inter_24pt-BoldItalic",
    extraBold: "Inter_24pt-ExtraBold",
    extraBoldItalic: "Inter_24pt-ExtraBoldItalic",
    black: "Inter_24pt-Black",
    blackItalic: "Inter_24pt-BlackItalic",
  },
  
  // Inter Font Family (28pt)
  inter28: {
    thin: "Inter_28pt-Thin",
    thinItalic: "Inter_28pt-ThinItalic",
    extraLight: "Inter_28pt-ExtraLight",
    extraLightItalic: "Inter_28pt-ExtraLightItalic",
    light: "Inter_28pt-Light",
    lightItalic: "Inter_28pt-LightItalic",
    regular: "Inter_28pt-Regular",
    italic: "Inter_28pt-Italic",
    medium: "Inter_28pt-Medium",
    mediumItalic: "Inter_28pt-MediumItalic",
    semiBold: "Inter_28pt-SemiBold",
    semiBoldItalic: "Inter_28pt-SemiBoldItalic",
    bold: "Inter_28pt-Bold",
    boldItalic: "Inter_28pt-BoldItalic",
    extraBold: "Inter_28pt-ExtraBold",
    extraBoldItalic: "Inter_28pt-ExtraBoldItalic",
    black: "Inter_28pt-Black",
    blackItalic: "Inter_28pt-BlackItalic",
  },
  
  // Poppins Font Family
  poppins: {
    thin: "Poppins-Thin",
    thinItalic: "Poppins-ThinItalic",
    extraLight: "Poppins-ExtraLight",
    extraLightItalic: "Poppins-ExtraLightItalic",
    light: "Poppins-Light",
    lightItalic: "Poppins-LightItalic",
    regular: "Poppins-Regular",
    italic: "Poppins-Italic",
    medium: "Poppins-Medium",
    mediumItalic: "Poppins-MediumItalic",
    semiBold: "Poppins-SemiBold",
    semiBoldItalic: "Poppins-SemiBoldItalic",
    bold: "Poppins-Bold",
    boldItalic: "Poppins-BoldItalic",
    extraBold: "Poppins-ExtraBold",
    extraBoldItalic: "Poppins-ExtraBoldItalic",
    black: "Poppins-Black",
    blackItalic: "Poppins-BlackItalic",
  },
} as const;



// Type definitions for better TypeScript support
export type FontFamily = keyof typeof FONTS;
export type FontWeight = keyof typeof FONTS.inter;
