import React, { useState, useEffect } from 'react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [listenerCount, setListenerCount] = useState(Math.floor(Math.random() * 500) + 100);

  // Atualizar hora atual
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Simular variação de ouvintes
  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        const newCount = prev + change;
        return Math.max(50, Math.min(800, newCount));
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Aqui você pode adicionar lógica para controlar o iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.postMessage(isPlaying ? 'pause' : 'play', '*');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  const programacao = [
    { hora: "06:00", programa: "Acorda Cidade", dj: "DJ George" },
    { hora: "10:00", programa: "Tech Hits", dj: "Ana Tech" },
    { hora: "14:00", programa: "Informação Total", dj: "Repórter FC" },
    { hora: "18:00", programa: "Música & Tecnologia", dj: "DJ Code" },
    { hora: "22:00", programa: "Noite Eletrônica", dj: "Master Beat" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "Facebook", icon: "👥", url: "#" },
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "YouTube", icon: "▶️", url: "#" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>📻</div>
            <div>
              <h1 style={styles.title}>Rádio George FC Tech</h1>
              <p style={styles.subtitle}>Música • Tecnologia • Informação</p>
            </div>
          </div>
          <div style={styles.timeDisplay}>
            <div style={styles.currentTime}>{formatTime(currentTime)}</div>
            <div style={styles.date}>
              {currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Live Status */}
        <div style={styles.liveSection}>
          <div style={styles.liveBadge}>
            <span style={styles.liveDot}></span>
            <span style={styles.liveText}>TRANSMITINDO AO VIVO</span>
          </div>
          
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>👥</span>
              <span style={styles.statText}>{listenerCount} ouvintes online</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statIcon}>🎵</span>
              <span style={styles.statText}>MP3 128kbps</span>
            </div>
          </div>
        </div>

        {/* Player */}
        <div style={styles.playerSection}>
          <div style={styles.playerWrapper}>
            {/* Player Oficial isMyRadio */}
            <div style={styles.iframeContainer}>
              <iframe
                src="https://radiogeorgefctech.ismyradio.com/player?embed=1"
                title="Rádio George FC Tech Player"
                allow="autoplay"
                frameBorder="0"
                scrolling="no"
                style={styles.playerIframe}
                onLoad={() => console.log('Player carregado!')}
              />
            </div>

            {/* Controles Extras */}
            <div style={styles.controls}>
              <button 
                onClick={togglePlay} 
                style={styles.controlButton}
                aria-label={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              
              <div style={styles.volumeControl}>
                <span style={styles.volumeIcon}>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={styles.volumeSlider}
                  aria-label="Volume"
                />
                <span style={styles.volumeValue}>{volume}%</span>
              </div>
            </div>
          </div>

          {/* Player para Mobile */}
          <div style={styles.mobilePlayer}>
            <audio
              controls
              autoPlay
              style={styles.mobileAudio}
            >
              <source 
                src="https://stream.ismyradio.com/radiogeorgefctech" 
                type="audio/mpeg" 
              />
            </audio>
          </div>
        </div>

        {/* Programação */}
        <div style={styles.scheduleSection}>
          <h2 style={styles.sectionTitle}>📅 Programação do Dia</h2>
          <div style={styles.scheduleGrid}>
            {programacao.map((item, index) => (
              <div key={index} style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>{item.hora}</div>
                <div style={styles.scheduleInfo}>
                  <div style={styles.programName}>{item.programa}</div>
                  <div style={styles.programDJ}>com {item.dj}</div>
                </div>
                {formatTime(currentTime).includes(item.hora.substring(0, 2)) && (
                  <div style={styles.nowPlaying}>AGORA</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={styles.actionButtons}>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noreferrer"
            style={styles.whatsappButton}
          >
            <span style={styles.buttonIcon}>📱</span>
            <span>Pedir Música no WhatsApp</span>
          </a>
          
          <a
            href="mailto:contato@radio.com"
            style={styles.emailButton}
          >
            <span style={styles.buttonIcon}>✉️</span>
            <span>Enviar Sugestão</span>
          </a>
        </div>

        {/* Redes Sociais */}
        <div style={styles.socialSection}>
          <h3 style={styles.sectionTitle}>Siga a Rádio</h3>
          <div style={styles.socialGrid}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                style={styles.socialLink}
              >
                <span style={styles.socialIcon}>{social.icon}</span>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Informações Técnicas */}
        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>📡 Como Ouvir</h4>
            <p style={styles.infoText}>
              • Acesse nosso site 24h/dia<br/>
              • Use nosso app (em breve)<br/>
              • Stream direto: 128kbps MP3<br/>
              • Compatível com todos os dispositivos
            </p>
          </div>
          
          <div style={styles.infoCard}>
            <h4 style={styles.infoTitle}>🎙️ Seja Nosso Parceiro</h4>
            <p style={styles.infoText}>
              Quer anunciar na rádio?<br/>
              Entre em contato:<br/>
              comercial@radiogeorgefctech.com<br/>
              (11) 99999-9999
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2026 Rádio George FC Tech. Todos os direitos reservados.<br/>
            Transmitindo de São Paulo para todo o Brasil 🇧🇷
          </p>
          <div style={styles.techBadge}>
            <span>Powered by ismyradio • React • Web Stream</span>
          </div>
        </div>
      </footer>

      {/* Animação CSS */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px #1db954; }
          50% { box-shadow: 0 0 20px #1db954; }
          100% { box-shadow: 0 0 5px #1db954; }
        }
        
        * {
          box-sizing: border-box;
        }
        
        iframe {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a2b3c 100%)",
    color: "#ffffff",
    fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
  },

  header: {
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "20px 0",
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    fontSize: "48px",
    animation: "pulse 2s infinite",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(45deg, #1db954, #25d366)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0",
  },

  subtitle: {
    fontSize: "14px",
    opacity: "0.8",
    margin: "5px 0 0 0",
  },

  timeDisplay: {
    textAlign: "right",
  },

  currentTime: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#1db954",
  },

  date: {
    fontSize: "14px",
    opacity: "0.8",
    marginTop: "5px",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },

  liveSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    background: "rgba(255, 0, 0, 0.1)",
    padding: "15px 25px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 0, 0, 0.3)",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  liveDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#ff0000",
    animation: "pulse 1s infinite",
  },

  liveText: {
    color: "#ff0000",
    fontWeight: "700",
    fontSize: "16px",
    letterSpacing: "1px",
  },

  stats: {
    display: "flex",
    gap: "20px",
  },

  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  statIcon: {
    fontSize: "18px",
  },

  statText: {
    fontSize: "14px",
    opacity: "0.9",
  },

  playerSection: {
    marginBottom: "40px",
  },

  playerWrapper: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  iframeContainer: {
    borderRadius: "15px",
    overflow: "hidden",
    marginBottom: "20px",
  },

  playerIframe: {
    width: "100%",
    height: "140px",
    border: "none",
    borderRadius: "15px",
  },

  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },

  controlButton: {
    background: "#1db954",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "24px",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  volumeControl: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "300px",
  },

  volumeIcon: {
    fontSize: "20px",
  },

  volumeSlider: {
    flex: "1",
    height: "6px",
    borderRadius: "3px",
    background: "#333",
    outline: "none",
    opacity: "0.7",
    transition: "opacity 0.2s",
  },

  volumeValue: {
    minWidth: "40px",
    textAlign: "center",
    fontSize: "14px",
  },

  mobilePlayer: {
    display: "none",
  },

  scheduleSection: {
    marginBottom: "40px",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1db954",
  },

  scheduleGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  scheduleItem: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "15px",
    borderRadius: "10px",
    transition: "all 0.3s",
  },

  scheduleTime: {
    fontWeight: "600",
    fontSize: "18px",
    minWidth: "80px",
    color: "#1db954",
  },

  scheduleInfo: {
    flex: "1",
  },

  programName: {
    fontWeight: "600",
    fontSize: "16px",
  },

  programDJ: {
    fontSize: "14px",
    opacity: "0.8",
  },

  nowPlaying: {
    background: "#1db954",
    color: "#000",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    animation: "glow 2s infinite",
  },

  actionButtons: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },

  whatsappButton: {
    flex: "1",
    background: "linear-gradient(45deg, #25d366, #128c7e)",
    color: "white",
    padding: "18px 25px",
    borderRadius: "15px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minWidth: "250px",
    transition: "transform 0.3s",
  },

  emailButton: {
    flex: "1",
    background: "linear-gradient(45deg, #ea4335, #d14836)",
    color: "white",
    padding: "18px 25px",
    borderRadius: "15px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minWidth: "250px",
    transition: "transform 0.3s",
  },

  buttonIcon: {
    fontSize: "20px",
  },

  socialSection: {
    marginBottom: "40px",
  },

  socialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "15px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "white",
    transition: "all 0.3s",
  },

  socialIcon: {
    fontSize: "24px",
  },

  infoSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  infoCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  infoTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1db954",
  },

  infoText: {
    fontSize: "14px",
    lineHeight: "1.6",
    opacity: "0.9",
  },

  footer: {
    background: "rgba(0, 0, 0, 0.8)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "30px 0",
  },

  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    textAlign: "center",
  },

  footerText: {
    fontSize: "14px",
    opacity: "0.7",
    lineHeight: "1.6",
    marginBottom: "15px",
  },

  techBadge: {
    fontSize: "12px",
    opacity: "0.5",
    letterSpacing: "1px",
  },

  // Responsividade
  '@media (max-width: 768px)': {
    mobilePlayer: {
      display: "block",
    },
    playerWrapper: {
      display: "none",
    },
    headerContent: {
      flexDirection: "column",
      gap: "15px",
    },
    timeDisplay: {
      textAlign: "center",
    },
    liveSection: {
      flexDirection: "column",
      gap: "15px",
    },
    actionButtons: {
      flexDirection: "column",
    },
    whatsappButton: {
      minWidth: "100%",
    },
    emailButton: {
      minWidth: "100%",
    },
    volumeControl: {
      width: "200px",
    },
  },
};