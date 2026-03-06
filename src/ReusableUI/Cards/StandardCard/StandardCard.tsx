import "./StandardCard.css";
interface StandardCardProps {
  children?: React.ReactNode;
  className?: string;
}

export function StandardCard({ children, className = "" }: StandardCardProps) {
  return (
    <div className={`standard-card-container ${className}`}>{children}</div>
  );
}
