import "./cardForm.css";

interface CardFormProps {
  title: string;
  children: React.ReactNode;
}
const CardForm: React.FC<CardFormProps> = ({ title, children }) => {
  return (
    <div className="card-form-container">
      <h2 className="card-form-title">{title}</h2>
      <hr className="card-form-divider" />
      <div className="card-form-content">{children}</div>
    </div>
  );
};
export default CardForm;
