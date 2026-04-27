// gridBook.tsx
import "./gridBook.css";
interface GridBookProps {
  children: React.ReactNode;
}

const GridBook: React.FC<GridBookProps> = ({ children }) => {
  return <div className="cardbook-grid ">{children}</div>;
};
export default GridBook;
