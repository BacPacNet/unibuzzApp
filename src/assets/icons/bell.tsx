import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const Bell: React.FC<SvgProps> = (props) => {
  return (
    <Svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      fill="none"
      color="#6B7280"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.752 1.914a5.25 5.25 0 004.07 8.333.4.4 0 000 .011c.015.198.03.401.05.597.237 2.247.777 3.79 1.296 4.803.345.675.684 1.123.924 1.394a3.373 3.373 0 00.34.335l.01.006A.75.75 0 0121 18.75H3a.75.75 0 01-.441-1.356l.008-.007.064-.054c.06-.054.157-.145.277-.281.24-.27.579-.718.924-1.393C4.522 14.31 5.25 12.03 5.25 8.4c0-1.881.7-3.694 1.96-5.038C8.472 2.016 10.194 1.25 12 1.25c.382 0 .761.034 1.133.101.238.043 1.018.286 1.619.563z"
        fill="#6B7280"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.25 5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM9.894 20.351a.75.75 0 011.025.273 1.25 1.25 0 002.162 0 .75.75 0 111.298.753 2.75 2.75 0 01-4.758 0 .75.75 0 01.273-1.026z"
        fill="#6B7280"
      />
    </Svg>
  );
};

export default Bell;
