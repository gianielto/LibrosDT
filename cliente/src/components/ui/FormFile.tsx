interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  name?: string;
  htmlfor?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  name,
  htmlfor,
  onChange,
}) => (
  <>
    <label htmlFor={htmlfor}>{label}</label>
    <input type={type} value={value} name={name} onChange={onChange} />
  </>
);
export default FormField;
