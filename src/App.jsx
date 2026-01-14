export default function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📻 Rádio George FC Tech</h1>

      <div style={styles.liveWrapper}>
        <span style={styles.liveDot}></span>
        <span style={styles.liveText}>AO VIVO</span>
      </div>

      {/* PLAYER OFICIAL isMyRadio (EMBED) */}
      <iframe
        src="https://radiogeorgefctech.ismyradio.com/player?embed=1"
        title="Rádio George FC Tech Player"
        allow="autoplay"
        frameBorder="0"
        scrolling="no"
        style={styles.player}
      />

      <p style={styles.description}>
        Música, tecnologia e informação 24 horas no ar.
      </p>

      <a
        href="https://wa.me/5500000000000"
        target="_blank"
        rel="noreferrer"
        style={styles.button}
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
    background: "linear-gradient(180deg, #050505, #0f2027)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "18px",
    padding: "24px",
    textAlign: "center",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  title: {
    fontSize: "30px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  liveWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  liveDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "red",
    boxShadow: "0 0 10px red",
    animation: "pulse 1.2s infinite",
  },

  liveText: {
    color: "red",
    fontWeight: "bold",
    fontSize: "14px",
  },

  player: {
    width: "100%",
    maxWidth: "380px",
    height: "120px",
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 0 20px rgba(0,0,0,0.6)",
  },

  description: {
    opacity: 0.85,
    fontSize: "14px",
  },

  button: {
    background: "#1db954",
    color: "#000",
    padding: "14px 26px",
    borderRadius: "30px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
    transition: "0.2s",
  },

  footer: {
    marginTop: "24px",
    fontSize: "12px",
    opacity: 0.6,
  },
};
