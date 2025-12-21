export default function Rating({ value = 0, onRate }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onRate(n)}
          style={{ fontWeight: n <= value ? "bold" : "normal" }}
          type="button"
        >
          {n}
        </button>
      ))}
    </div>
  );
}
