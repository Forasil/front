export default function ErrorBox({ message, onRetry }) {
  return (
    <div style={{ border: "1px solid #ffb3b3", padding: 12 }}>
      <p style={{ color: "red", margin: 0 }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: 8 }}>
          Повторить
        </button>
      )}
    </div>
  );
}
