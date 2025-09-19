import React from "react";
import css from "./SearchBox.module.css";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const [local, setLocal] = React.useState(value);

  // useDebounce повертає дебанcоване значення
  const [debounced] = useDebounce(local, 500);

  React.useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setLocal(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      value={local}
      placeholder="Search notes"
      onChange={handleChange}
    />
  );
};

export default SearchBox;
