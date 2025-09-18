import React from "react";

interface Props {
  children: React.ReactNode;
  textColor?: string;
}

const ShowText = ({ children, textColor }: Props) => {
  return (
    <div
      style={{ color: textColor }}
      className={"self-center w-full text-center text-7xl"}
    >
      {children}
    </div>
  );
};

export default ShowText;
