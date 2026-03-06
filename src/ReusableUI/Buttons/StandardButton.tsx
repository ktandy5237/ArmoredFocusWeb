import React from "react";
import "./StandardButton.css";

// Define the available variants
type ButtonVariant = "green" | "purple" | "gold";

interface StandardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  label: string;
}

export default function StandardButton({
  variant = "green",
  icon,
  label,
  className = "",
  ...props
}: StandardButtonProps) {
  return (
    <button className={`game-button ${variant} ${className}`} {...props}>
      {/* Only render icon wrapper if an icon is provided */}
      {icon && <div className="icon-wrapper">{icon}</div>}
      <span>{label}</span>
    </button>
  );
}
