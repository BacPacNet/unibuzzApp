import * as React from "react";
import Svg, { Rect, Path, SvgProps } from "react-native-svg";

const PostOption: React.FC<SvgProps> = (props) => {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Rect width={32} height={32} rx={16} fill="#F3F2FF" />
      <Path
        d="M9.875 16h.009M16 16h.009m6.116 0h.009M10.75 16A.875.875 0 119 16a.875.875 0 011.75 0zm6.125 0a.875.875 0 11-1.75 0 .875.875 0 011.75 0zM23 16a.875.875 0 11-1.75 0A.875.875 0 0123 16z"
        stroke="#6744FF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PostOption;
