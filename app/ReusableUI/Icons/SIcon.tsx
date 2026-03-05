export default function SIcon({ color = "currentColor", size = 18 }) {
  return (
    <span
      style={{
        fontSize: `${size}px`,
        fontWeight: "bold",
        fontStyle: "italic",
        color: color,
        lineHeight: 1,
        display: "inline-block",
        fontFamily: "serif",
      }}
    >
      S
    </span>
  );
}
