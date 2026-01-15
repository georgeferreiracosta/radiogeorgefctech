import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [listeners, setListeners] = useState(245);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    song: '',
    artist: '',
    message: ''
  });

  // Atualizar hora atual
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular ouvintes em tempo real
  useEffect(() => {
    const listenerInterval = setInterval(() => {
      const baseListeners = 245;
      const hour = new Date().getHours();
      let multiplier = 1;

      if (hour >= 8 && hour <= 10) multiplier = 1.5;
      else if (hour >= 12 && hour <= 14) multiplier = 1.8;
      else if (hour >= 18 && hour <= 22) multiplier = 2.2;

      const randomChange = Math.floor(Math.random() * 30) - 10;
      const newListeners = Math.max(100, Math.floor(baseListeners * multiplier + randomChange));

      setListeners(newListeners);
    }, 15000);

    return () => clearInterval(listenerInterval);
  }, []);

  // Carregar script do Caster.fm
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//cdn.cloud.caster.fm//widgets/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpar script quando componente desmontar
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);



  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Funções para pedido de músicas
  const sendToWhatsApp = (formData) => {
    const message = `🎵 *PEDIDO DE MÚSICA - RÁDIO GEORGE FC TECH* 🎵
  
━━━━━━━━━━━━━━━━━━━━━━
👤 *Solicitante:* ${formData.name}

🎶 *Música:* ${formData.song}

🎤 *Artista:* ${formData.artist}

${formData.message ? `💬 *Mensagem/Dedicação:*\n${formData.message}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━
⏰ _Enviado em: ${new Date().toLocaleString('pt-BR')}_
📻 _Via: Rádio George FC Tech Online_`;

    // Formatar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // SEU número de WhatsApp (formatado: 55 + DDD + número)
    const whatsappNumber = '5515992485695';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!requestForm.name.trim() || !requestForm.song.trim() || !requestForm.artist.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    
    // Enviar para WhatsApp
    sendToWhatsApp(requestForm);
    
    alert('📱 Abrindo WhatsApp para enviar seu pedido!\n\nPor favor, confirme o envio na conversa do WhatsApp.');
    setShowRequestModal(false);
    setRequestForm({ name: '', song: '', artist: '', message: '' });
  };

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value
    });
  };

  // Funções para redes sociais
  const openSocialLink = (platform) => {
    const links = {
      facebook: 'https://www.facebook.com/radiogeorgefctech',
      instagram: 'https://www.instagram.com/radiogeorgefctech',
      twitter: 'https://www.x.com/radiogeorgefctech', // Alterado para X
      youtube: 'https://www.youtube.com/radiogeorgefctech',
      whatsapp: 'https://wa.me/5515992485695?text=Olá! Gostaria de pedir uma música na Rádio George FC Tech'
    };

    if (links[platform]) {
      window.open(links[platform], '_blank');
    }
  };

  const getListenerColor = () => {
    if (listeners > 300) return "#1DB954"; // Spotify green
    if (listeners > 200) return "#FFD93D";
    return "#FF6B6B";
  };



  return (
    <div style={styles.container}>

      {/* Header Spotify-style */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>🎧</div>
              <div style={styles.logoText}>
                <h1 style={styles.title}>Rádio George FC Tech</h1>
                <p style={styles.subtitle}>Transmissão Ao Vivo • 24/7</p>
              </div>
            </div>
          </div>
          
          <div style={styles.statsSection}>
            <div style={styles.statItem}>
              <div style={styles.statIcon}>👥</div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>OUVINTES</div>
                <div style={{...styles.statValue, color: getListenerColor()}}>
                  {listeners}
                </div>
              </div>
            </div>
            
            <div style={styles.statItem}>
              <div style={styles.statIcon}>⏱️</div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>HORA</div>
                <div style={styles.statValue}>{formatTime(currentTime)}</div>
              </div>
            </div>
            
            <div style={styles.statItem}>
              <div style={styles.statIcon}>📶</div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>STATUS</div>
                <div style={{
                  ...styles.statValue,
                  color: "#1DB954"
                }}>
                  AO VIVO
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Player Caster.fm */}
        <div style={styles.playerContainer}>
          <div data-type="newStreamPlayer" data-publicToken="fe202753-ba40-4cbd-9b08-c9678f206ccb" data-theme="dark" data-color="131212" data-channelId="" data-rendered="false" className="cstrEmbed">
            <a href="https://www.caster.fm">Shoutcast Hosting</a> <a href="https://www.caster.fm">Stream Hosting</a> <a href="https://www.caster.fm">Radio Server Hosting</a>
          </div>
        </div>

        {/* Informações Ao Vivo */}
        <div style={styles.playlistContainer}>
          <h3 style={styles.playlistTitle}>🎵 TRANSMISSÃO AO VIVO</h3>

          <div style={styles.liveTrackContainer}>
            <div style={styles.liveTrackCard}>
              <div style={styles.liveTrackHeader}>
                <div style={styles.liveIndicator}>
                  <span style={styles.liveDot}></span>
                  <span style={styles.liveText}>AO VIVO AGORA</span>
                </div>
                <div style={styles.lastUpdate}>
                  Transmissão 24/7
                </div>
              </div>

              <div style={styles.liveTrackInfo}>
                <div style={styles.liveTrackTitle}>
                  Transmissão Ao Vivo
                </div>
                <div style={styles.liveTrackArtist}>
                  Rádio George FC Tech
                </div>
                <div style={styles.liveTrackDetails}>
                  <span style={styles.liveTrackGenre}>Ao Vivo</span>
                  <span style={styles.liveTrackBitrate}>⚡ 128kbps</span>
                </div>
              </div>

              <div style={styles.liveTrackMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>🎵</span>
                  <span style={styles.metaText}>Transmissão ao vivo 24/7</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>📡</span>
                  <span style={styles.metaText}>Fonte: sapircast.caster.fm</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>🎧</span>
                  <span style={styles.metaText}>Rádio George FC Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div style={styles.statsContainer}>
          <h3 style={styles.statsTitle}>📊 ESTATÍSTICAS DA TRANSMISSÃO</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>👥</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>{listeners}</div>
                <div style={styles.statCardLabel}>Ouvintes Online</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: `${Math.min(100, (listeners / 500) * 100)}%`,
                    background: getListenerColor()
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>📶</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>128kbps</div>
                <div style={styles.statCardLabel}>Qualidade</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: '100%',
                    background: '#1DB954'
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>⏱️</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>24/7</div>
                <div style={styles.statCardLabel}>Transmissão</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: '100%',
                    background: '#6C2BDD'
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>🔴</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>AO VIVO</div>
                <div style={styles.statCardLabel}>Status</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: '100%',
                    background: '#FF4757'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Music Modal */}
        {showRequestModal && (
          <div style={styles.requestModal}>
            <div style={styles.requestModalContent}>
              <h2 style={styles.requestModalTitle}>🎵 PEDIR MÚSICA</h2>
              <p style={styles.requestModalSubtitle}>
                Preencha o formulário abaixo para solicitar uma música na Rádio George FC Tech
              </p>

              <form onSubmit={handleRequestSubmit} style={styles.requestForm}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Seu Nome *</label>
                  <input
                    type="text"
                    name="name"
                    value={requestForm.name}
                    onChange={handleRequestChange}
                    style={styles.formInput}
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nome da Música *</label>
                  <input
                    type="text"
                    name="song"
                    value={requestForm.song}
                    onChange={handleRequestChange}
                    style={styles.formInput}
                    placeholder="Digite o nome da música"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Artista *</label>
                  <input
                    type="text"
                    name="artist"
                    value={requestForm.artist}
                    onChange={handleRequestChange}
                    style={styles.formInput}
                    placeholder="Digite o nome do artista"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Mensagem (Opcional)</label>
                  <textarea
                    name="message"
                    value={requestForm.message}
                    onChange={handleRequestChange}
                    style={styles.formTextarea}
                    placeholder="Deixe uma mensagem especial ou dedicação"
                    rows="3"
                  />
                </div>

                <div style={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    style={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={styles.submitButton}
                  >
                    Enviar Pedido
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerContent}>
            <div style={styles.footerLogo}>
              <span style={styles.footerLogoIcon}>🎧</span>
              <span style={styles.footerLogoText}>Rádio George FC Tech</span>
            </div>
            
            <div style={styles.footerInfo}>
              <div style={styles.footerStat}>
                <span style={styles.footerStatIcon}>👥</span>
                <span style={styles.footerStatValue}>{listeners}</span>
                <span style={styles.footerStatLabel}>ouvintes</span>
              </div>

              <div style={styles.footerStat}>
                <span style={styles.footerStatIcon}>
                  ▶️
                </span>
                <span style={styles.footerStatValue}>
                  AO VIVO
                </span>
              </div>

              <div style={styles.footerStat}>
                <span style={styles.footerStatIcon}>🔴</span>
                <span style={styles.footerStatValue}>
                  TRANSMISSÃO
                </span>
              </div>
            </div>

            {/* Redes Sociais e Pedido de Música */}
            <div style={styles.footerActions}>
              <button
                onClick={() => setShowRequestModal(true)}
                style={styles.requestMusicButton}
                title="Pedir Música"
              >
                <span style={styles.requestMusicIcon}>🎵</span>
                <span style={styles.requestMusicText}>PEDIR MÚSICA</span>
              </button>

              <div style={styles.socialMedia}>
                <button
                  onClick={() => openSocialLink('facebook')}
                  style={styles.socialButton}
                  title="Facebook"
                >
                  <span style={styles.socialIcon}>📘</span>
                </button>

                <button
                  onClick={() => openSocialLink('instagram')}
                  style={styles.socialButton}
                  title="Instagram"
                >
                  <span style={styles.socialIcon}>📷</span>
                </button>

                <button
                  onClick={() => openSocialLink('twitter')}
                  style={styles.socialButton}
                  title="X (Twitter)"
                >
                  <span style={styles.socialIcon}>𝕏</span>
                </button>

                <button
                  onClick={() => openSocialLink('youtube')}
                  style={styles.socialButton}
                  title="YouTube"
                >
                  <span style={styles.socialIcon}>📺</span>
                </button>

                <button
                  onClick={() => openSocialLink('whatsapp')}
                  style={styles.socialButton}
                  title="WhatsApp"
                >
                  <span style={styles.socialIcon}>💬</span>
                </button>
              </div>
            </div>
            
            <div style={styles.footerCopyright}>
              © 2024 Rádio George FC Tech • Transmissão Ao Vivo 24/7 • WhatsApp: (15) 99248-5695
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glow {
          0% { box-shadow: 0 0 10px #1DB954; }
          50% { box-shadow: 0 0 25px #1DB954; }
          100% { box-shadow: 0 0 10px #1DB954; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          color: #fff;
        }
        
        button {
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: inherit;
          background: none;
        }
        
        button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        input[type="range"] {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .glow {
          animation: glow 2s infinite;
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .stats-section {
            justify-content: center;
          }
          
          .player-container {
            padding: 15px;
          }
          
          .track-info-container {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          
          .controls-container {
            flex-direction: column;
            gap: 20px;
          }
          
          .playback-controls {
            order: 1;
          }
          
          .volume-container {
            order: 3;
            width: 100%;
          }
          
          .audio-indicators {
            flex-direction: column;
            gap: 15px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .title {
            font-size: 20px;
          }
          
          .stat-item {
            min-width: 120px;
          }
          
          .play-button {
            width: 60px;
            height: 60px;
          }
          
          .track-title {
            font-size: 18px;
          }
          
          .track-artist {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #000 0%, #121212 100%)",
    color: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    overflowX: "hidden",
  },

  header: {
    background: "#000",
    borderBottom: "1px solid #282828",
    padding: "16px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    flexWrap: "wrap",
    gap: "20px",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoIcon: {
    fontSize: "32px",
    animation: "pulse 3s infinite",
    color: "#1DB954",
  },

  logoText: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
    margin: "0",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#b3b3b3",
    margin: "4px 0 0 0",
    fontWeight: "500",
  },

  statsSection: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minWidth: "140px",
    transition: "all 0.2s ease",
  },

  statIcon: {
    fontSize: "20px",
    opacity: "0.9",
  },

  statInfo: {
    display: "flex",
    flexDirection: "column",
  },

  statLabel: {
    fontSize: "11px",
    color: "#b3b3b3",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "18px",
    fontWeight: "700",
    marginTop: "2px",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
    animation: "fadeIn 0.3s ease-out",
  },

  playerContainer: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  trackInfoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    position: "relative",
  },

  albumArtPlaceholder: {
    width: "120px",
    height: "120px",
    background: "linear-gradient(135deg, #1DB954, #191414)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
  },

  albumArtIcon: {
    fontSize: "48px",
    color: "#fff",
    zIndex: 2,
  },

  albumArtGlow: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "radial-gradient(circle at center, rgba(29, 185, 84, 0.3) 0%, transparent 70%)",
    animation: "glow 3s infinite",
  },

  trackDetails: {
    flex: 1,
  },

  trackTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },

  trackArtist: {
    fontSize: "18px",
    color: "#b3b3b3",
    marginBottom: "16px",
    fontWeight: "500",
  },

  fileName: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },

  fileIcon: {
    fontSize: "14px",
    color: "#1DB954",
  },

  fileNameText: {
    fontSize: "14px",
    color: "#b3b3b3",
    fontFamily: "monospace",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  trackMeta: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  genreTag: {
    background: "rgba(29, 185, 84, 0.2)",
    color: "#1DB954",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid rgba(29, 185, 84, 0.3)",
  },

  bitrateTag: {
    background: "rgba(108, 43, 221, 0.2)",
    color: "#9D4EDD",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid rgba(108, 43, 221, 0.3)",
  },

  liveTag: {
    background: "rgba(255, 71, 87, 0.2)",
    color: "#FF4757",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    border: "1px solid rgba(255, 71, 87, 0.3)",
  },

  vuContainer: {
    width: "100%",
    height: "60px",
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "8px",
    marginBottom: "30px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  vuCanvas: {
    width: "100%",
    height: "100%",
    display: "block",
  },

  controlsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  playbackControls: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flex: 1,
    justifyContent: "center",
  },

  playButton: {
    background: "#1DB954",
    border: "none",
    borderRadius: "50%",
    width: "70px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(29, 185, 84, 0.3)",
  },

  playIcon: {
    fontSize: "28px",
    color: "#fff",
  },

  volumeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    justifyContent: "flex-end",
  },

  volumeButton: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#b3b3b3",
  },

  volumeIcon: {
    fontSize: "18px",
  },

  volumeSliderContainer: {
    flex: 1,
    maxWidth: "150px",
    position: "relative",
    height: "20px",
  },

  volumeSlider: {
    width: "100%",
    height: "4px",
    position: "absolute",
    opacity: 0,
    zIndex: 2,
    cursor: "pointer",
  },

  volumeBarBackground: {
    width: "100%",
    height: "4px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "2px",
    overflow: "hidden",
  },

  volumeBarFill: {
    height: "100%",
    background: "#1DB954",
    borderRadius: "2px",
    transition: "width 0.2s ease",
  },

  volumeValue: {
    fontSize: "14px",
    color: "#b3b3b3",
    minWidth: "40px",
    fontWeight: "500",
  },

  audioIndicators: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  indicator: {
    flex: 1,
    minWidth: "200px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  indicatorLabel: {
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#b3b3b3",
  },

  indicatorIcon: {
    fontSize: "12px",
  },

  indicatorBar: {
    height: "6px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "8px",
  },

  indicatorFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },

  indicatorValue: {
    fontSize: "14px",
    fontWeight: "700",
    textAlign: "right",
    color: "#1DB954",
  },

  errorMessage: {
    background: "rgba(255, 71, 87, 0.1)",
    border: "1px solid rgba(255, 71, 87, 0.3)",
    borderRadius: "8px",
    padding: "15px 20px",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    animation: "fadeIn 0.3s ease-out",
  },

  errorIcon: {
    fontSize: "20px",
  },

  errorText: {
    flex: 1,
    fontSize: "14px",
    fontWeight: "600",
    color: "#FF6B6B",
  },

  retryButton: {
    background: "rgba(255, 71, 87, 0.3)",
    border: "1px solid rgba(255, 71, 87, 0.5)",
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
  },

  playlistContainer: {
    marginBottom: "30px",
  },

  playlistTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  liveTrackContainer: {
    marginTop: "10px",
  },

  liveTrackCard: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  liveTrackHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  liveDot: {
    width: "8px",
    height: "8px",
    background: "#FF4757",
    borderRadius: "50%",
    animation: "pulse 1s infinite",
  },

  liveText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#FF4757",
  },

  lastUpdate: {
    fontSize: "12px",
    color: "#b3b3b3",
  },

  liveTrackInfo: {
    marginBottom: "15px",
  },

  liveTrackTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
  },

  liveTrackArtist: {
    fontSize: "16px",
    color: "#b3b3b3",
    marginBottom: "12px",
  },

  liveTrackDetails: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  liveTrackGenre: {
    background: "rgba(29, 185, 84, 0.2)",
    color: "#1DB954",
    padding: "4px 10px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "600",
    border: "1px solid rgba(29, 185, 84, 0.3)",
  },

  liveTrackBitrate: {
    background: "rgba(108, 43, 221, 0.2)",
    color: "#9D4EDD",
    padding: "4px 10px",
    borderRadius: "15px",
    fontSize: "11px",
    fontWeight: "600",
    border: "1px solid rgba(108, 43, 221, 0.3)",
  },

  liveTrackMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  metaIcon: {
    fontSize: "14px",
    color: "#1DB954",
  },

  metaText: {
    fontSize: "12px",
    color: "#b3b3b3",
  },

  loadingCard: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "12px",
    padding: "40px 20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },

  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255, 255, 255, 0.1)",
    borderTop: "3px solid #1DB954",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "14px",
    color: "#b3b3b3",
    textAlign: "center",
  },

  statsContainer: {
    marginBottom: "30px",
  },

  statsTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  statCardIcon: {
    fontSize: "32px",
    background: "linear-gradient(45deg, #1DB954, #25D366)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  statCardContent: {
    flex: 1,
  },

  statCardValue: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1DB954",
    marginBottom: "4px",
  },

  statCardLabel: {
    fontSize: "14px",
    color: "#b3b3b3",
    marginBottom: "8px",
    fontWeight: "500",
  },

  statCardProgress: {
    height: "4px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "2px",
    overflow: "hidden",
  },

  statCardProgressBar: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.5s ease",
  },

  footer: {
    background: "#000",
    borderTop: "1px solid #282828",
    padding: "30px 0",
    marginTop: "50px",
  },

  footerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },

  footerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    textAlign: "center",
  },

  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  footerLogoIcon: {
    fontSize: "24px",
    color: "#1DB954",
  },

  footerLogoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
  },

  footerInfo: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  footerStat: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  footerStatIcon: {
    fontSize: "16px",
    color: "#1DB954",
  },

  footerStatValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
  },

  footerStatLabel: {
    fontSize: "12px",
    color: "#b3b3b3",
  },

  footerCopyright: {
    fontSize: "14px",
    color: "#b3b3b3",
    marginTop: "10px",
  },

  footerActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
  },

  requestMusicButton: {
    background: "linear-gradient(45deg, #1DB954, #25D366)",
    border: "none",
    borderRadius: "25px",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(29, 185, 84, 0.3)",
    transition: "all 0.2s ease",
  },

  requestMusicIcon: {
    fontSize: "18px",
  },

  requestMusicText: {
    fontSize: "14px",
    fontWeight: "600",
  },

  socialMedia: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  socialButton: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  socialIcon: {
    fontSize: "20px",
  },

  requestModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
    animation: "fadeIn 0.3s ease-out",
  },

  requestModalContent: {
    background: "#181818",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  requestModalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "10px",
    textAlign: "center",
  },

  requestModalSubtitle: {
    fontSize: "14px",
    color: "#b3b3b3",
    marginBottom: "25px",
    textAlign: "center",
    lineHeight: "1.5",
  },

  requestForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  formLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
  },

  formInput: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s ease",
  },

  formTextarea: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
    transition: "all 0.2s ease",
  },

  formActions: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },

  cancelButton: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  submitButton: {
    flex: 1,
    background: "#1DB954",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};