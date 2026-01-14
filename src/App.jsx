export default function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📻 Rádio George FC Tech</h1>
      <p style={styles.live}>🔴 AO VIVO</p>

      <iframe
        src="https://radiogeorgefctech.ismyradio.com/player"
        width="100%"
        height="120"
        frameBorder="0"
        scrolling="no"
        allow="autoplay"
        style={styles.player}
      />

      <p style={styles.text}>
        Música, tecnologia e informação 24 horas no ar.
      </p>

      <a
        href="https://wa.me/5515992485695"
        target="_blank"
        style={styles.button}
        rel="noreferrer"
      >
        📲 WhatsApp da Rádio
      </a>

      <footer style={styles.footer}>
        © 2026 Rádio George FC Tech
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #000, #0f2027)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "20px",
    textAlign: "center",
  },
  title: { fontSize: "28px", fontWeight: "bold" },
  live: { color: "red", fontWeight: "bold" },
  player: { maxWidth: "360px" },
  text: { opacity: 0.8 },
  button: {
    background: "#1db954",
    color: "#000",
    padding: "12px 24px",
    borderRadius: "30px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  footer: { marginTop: "20px", fontSize: "12px", opacity: 0.6 },
};
