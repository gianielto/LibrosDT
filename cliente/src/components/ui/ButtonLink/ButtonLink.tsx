import { Link } from "react-router-dom";
import "./ButtonLink.css";
interface ButtonLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const ButtonKink: React.FC<ButtonLinkProps> = ({ to, children, className }) => {
  return (
    <Link to={to} className={`button-link ${className || ""}`}>
      {children}
    </Link>
  );
};

export default ButtonKink;
