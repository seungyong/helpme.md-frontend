import styles from "./Select.module.scss";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value?: string;
  selectedValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Select = ({
  options,
  value,
  selectedValue,
  onChange,
  disabled = false,
}: SelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      defaultValue={selectedValue}
      className={`${styles.select} ${disabled ? styles.disabled : ""}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
