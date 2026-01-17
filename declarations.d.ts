declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "@env" {
  export const NEXT_PUBLIC_SOCKET_URL: string;
  export const NEXT_PUBLIC_SOCKET_URL_IOS: string;
  export const NEXT_PUBLIC_CUSTOM_BASE_URL: string;
  export const NEXT_PUBLIC_API_BASE_URL: string;
  export const NEXT_PROD_FE_BASE_URL: string;
  export const NEXT_DEV_FE_BASE_URL: string;
  export const NEXT_PROD_BE_BASE_URL: string;
  export const NEXT_PUBLIC_MIXPANEL_TOKEN: string;
  export const NODE_ENV: string;
}
