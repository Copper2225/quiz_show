import React from "react";

/**
 * SVG Text Component generated from: "- ½"
 * Font: Arial
 * Size: 50px
 * Generated on: 11.9.2025, 12:08:25
 */

interface TextToSvgComponentProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  width?: string | number;
  height?: string | number;
}

const MinusHalfIcon: React.FC<TextToSvgComponentProps> = ({
  className = "",
  style = {},
  fill = "#000000",
  ...props
}) => {
  return (
    <svg
      className={className}
      style={style}
      fill={fill}
      viewBox={`0 8 75 40`}
      data-asc="0.9052734375"
      {...props}
    >
      <defs />
      <g fill={fill} stroke={fill}>
        <path d="M0 34.52L0 30.10L13.50 30.10L13.50 34.52L0 34.52ZM34.52 46.66L61.40 8.86L65.23 8.86L38.35 46.66L34.52 46.66M37.04 27.37L37.04 13.84Q34.55 15.82 31.57 16.60L31.57 13.60Q33.08 13.11 34.94 11.82Q36.79 10.52 37.94 9.03L40.58 9.03L40.58 27.37L37.04 27.37M54.57 46.02Q54.71 44.65 55.74 43.26Q57.25 41.14 60.77 38.60Q64.28 36.06 64.94 35.30Q65.84 34.30 65.84 33.25Q65.84 32.08 65.00 31.34Q64.16 30.59 62.48 30.59Q60.86 30.59 60.07 31.16Q59.28 31.74 58.76 33.35L55.08 32.98Q55.79 30.25 57.54 28.97Q59.30 27.69 62.55 27.69Q66.24 27.69 67.96 29.13Q69.68 30.57 69.68 32.64Q69.68 34.69 68.24 36.52Q67.14 37.89 63.26 40.72Q61.21 42.21 60.35 43.07L69.78 43.07L69.78 46.02L54.57 46.02Z" />
      </g>
    </svg>
  );
};

export default MinusHalfIcon;
