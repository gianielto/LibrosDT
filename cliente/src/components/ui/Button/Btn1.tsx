import "./Button.css";

interface Btn1Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Btn1: React.FC<Btn1Props> = ({ children, className = "", ...rest }) => {
  return (
    <button className={`Btn ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Btn1;
