import { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  bgColor?: string;
  textColor?: string;
}

export default function SearchBar({
  placeholder = "Search Quests...",
  onSearch,
  bgColor = "var(--questInputBg)",
  textColor = "var(--questInputText)",
}: SearchBarProps) {
  const [searchText, setSearchText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleClear = () => {
    setSearchText("");
    if (onSearch) onSearch("");
  };

  const customStyles = {
    "--search-bg": bgColor,
    "--search-text": textColor,
  } as React.CSSProperties;

  return (
    <div className="search-bar-container" style={customStyles}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="search-icon"
      >
        <path
          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 21L16.65 16.65"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchText}
        onChange={handleChange}
      />

      {searchText && (
        <button className="search-clear-btn" onClick={handleClear}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
