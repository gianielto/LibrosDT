// import { Link, LinkProps } from 'react-router-dom';
// import "./ButtonLink.css";
// interface ButtonLinkProps {
//   to: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const ButtonKink: React.FC<ButtonLinkProps> = ({ to, children, className }) => {
//   return (
//     <Link to={to} className={`button-link ${className || ""}`}>
//       {children}
//     </Link>
//   );
// };

// export default ButtonKink;
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import "./ButtonLink.css";
import React from "react";

type ButtonLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <Link {...rest} className={`button-link ${className}`}>
      {children}
    </Link>
  );
};

export default ButtonLink;
