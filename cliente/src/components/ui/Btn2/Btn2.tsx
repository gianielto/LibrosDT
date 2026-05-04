// Btn2.tsx

//
import { useEffect, useState } from "react";
import "./Btn2.css";

interface Btn2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  mobileBreakpoint?: number; // opcional
}

const Btn2: React.FC<Btn2Props> = ({
  children,
  icon,
  mobileBreakpoint = 480,
  className = "",
  ...rest
}) => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= mobileBreakpoint,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint]);

  return (
    <button className={`Btn2 ${className}`} {...rest}>
      {isMobile && icon ? icon : children}
    </button>
  );
};

export default Btn2;
