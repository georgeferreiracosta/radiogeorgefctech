import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [listenerCount, setListenerCount] = useState(Math.floor(Math.random() * 500) + 100);
  const [muted, setMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("Carregando...");
  const [bitrate, setBitrate] = useState("96kbps");
  const [spectrumData, setSpectrumData] = useState([]);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [source, setSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Stream URL direta do Caster.fm
  const STREAM_URL = "https://sapircast.caster.fm:19793/UYD7q";

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

  // Inicializar Web Audio API para spectrum
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      initAudioAnalysis();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isPlaying]);

  const initAudioAnalysis = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      audioContextRef.current = context;
      
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(context.destination);
      
      startSpectrumAnimation();
    } catch (error) {
      console.error('Erro ao inicializar análise de áudio:', error);
      startFakeSpectrum();
    }
  };

  const startSpectrumAnimation = () => {
    if (!canvasRef.current || !analyserRef.current) {
      startFakeSpectrum();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Configurar estilo
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#6C2BDD');
      gradient.addColorStop(0.5, '#9D4EDD');
      gradient.addColorStop(1, '#C77DFF');
      ctx.fillStyle = gradient;
      
      // Desenhar barras do spectrum
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        // Desenhar barra principal
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        // Adicionar brilho no topo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, 2);
        ctx.fillStyle = gradient;
        
        x += barWidth + 1;
      }
      
      // Atualizar dados para exibição
      setSpectrumData(Array.from(dataArray));
    };
    
    draw();
  };

  const startFakeSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = 64;
    const fakeData = new Array(bufferLength).fill(0);
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      // Gerar dados aleatórios para simulação
      for (let i = 0; i < bufferLength; i++) {
        fakeData[i] = Math.sin(Date.now() / 1000 + i * 0.1) * 50 + 50 + Math.random() * 20;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#6C2BDD');
      gradient.addColorStop(0.5, '#9D4EDD');
      gradient.addColorStop(1, '#C77DFF');
      ctx.fillStyle = gradient;
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = fakeData[i];
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, 2);
        ctx.fillStyle = gradient;
        
        x += barWidth + 1;
      }
      
      setSpectrumData(fakeData);
    };
    
    draw();
  };

  // Controle do player
  const togglePlay = async () => {
    setIsLoading(true);
    
    if (!isPlaying) {
      try {
        if (!audioRef.current.src) {
          audioRef.current.src = STREAM_URL;
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        setCurrentTrack("Transmissão ao vivo - Rádio George FC Tech");
        
        // Simular mudança de música a cada 3 minutos
        const tracks = [
          "Música eletrônica - DJ Mix",
          "Pop hits internacionais",
          "Tecnologia & Inovação Podcast",
          "Música brasileira atual",
          "Clássicos do rock"
        ];
        
        setInterval(() => {
          const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
          setCurrentTrack(`${randomTrack} - Ao vivo`);
        }, 180000);
        
      } catch (error) {
        console.error('Erro ao reproduzir:', error);
        alert('Erro ao conectar com a rádio. Tente novamente.');
        setIsPlaying(false);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    setIsLoading(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
      if (newVolume === 0) {
        setMuted(true);
        audioRef.current.muted = true;
      } else if (muted) {
        setMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const programacao = [
    { hora: "06:00", programa: "Acorda Cidade", dj: "DJ George" },
    { hora: "10:00", programa: "Tech Hits", dj: "Ana Tech" },
    { hora: "14:00", programa: "Informação Total", dj: "Repórter FC" },
    { hora: "18:00", programa: "Música & Tecnologia", dj: "DJ Code" },
    { hora: "22:00", programa: "Noite Eletrônica", dj: "Master Beat" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: "📷", url: "https://instagram.com" },
    { name: "Facebook", icon: "👥", url: "https://facebook.com" },
    { name: "Twitter", icon: "🐦", url: "https://twitter.com" },
    { name: "YouTube", icon: "▶️", url: "https://youtube.com" },
  ];

  return (
    <div style={styles.container}>
      {/* Áudio oculto para stream direta */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        style={{ display: 'none' }}
        preload="none"
      />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>📻</div>
            <div>
              <h1 style={styles.title}>Rádio George FC Tech</h1>
              <p style={styles.subtitle}>Música • Tecnologia • Informação • 24/7</p>
            </div>
          </div>
          <div style={styles.statsContainer}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{listenerCount}</div>
              <div style={styles.statLabel}>Ouvintes Online</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{bitrate}</div>
              <div style={styles.statLabel}>Qualidade</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{formatTime(currentTime)}</div>
              <div style={styles.statLabel}>Hora Local</div>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Live Badge */}
        <div style={styles.liveContainer}>
          <div style={styles.liveBadge}>
            <span style={styles.liveDot}></span>
            <span style={styles.liveText}>TRANSMISSÃO AO VIVO</span>
          </div>
          <div style={styles.streamInfo}>
            <span style={styles.streamIcon}>📡</span>
            <span style={styles.streamText}>Caster.fm Streaming</span>
          </div>
        </div>

        {/* Player Principal */}
        <div style={styles.playerContainer}>
          {/* Spectrum Visualizer */}
          <div style={styles.spectrumContainer}>
            <canvas
              ref={canvasRef}
              width={800}
              height={150}
              style={styles.spectrumCanvas}
            />
            <div style={styles.spectrumOverlay}>
              <div style={styles.spectrumTitle}>ANALISADOR DE ÁUDIO</div>
              <div style={styles.spectrumStatus}>
                {isPlaying ? 'ANÁLISE ATIVA' : 'PAUSADO'}
              </div>
            </div>
          </div>

          {/* Informações da Música */}
          <div style={styles.trackInfo}>
            <div style={styles.nowPlaying}>
              <div style={styles.nowPlayingLabel}>TOCANDO AGORA</div>
              <div style={styles.trackTitle}>{currentTrack}</div>
              <div style={styles.trackDetails}>
                <span style={styles.detailItem}>🎵 {bitrate} MP3</span>
                <span style={styles.detailItem}>📡 sapircast.caster.fm</span>
                <span style={styles.detailItem}>🌐 São Paulo, BR</span>
              </div>
            </div>
            
            {/* Controles do Player */}
            <div style={styles.playerControls}>
              <div style={styles.controlButtons}>
                <button 
                  onClick={togglePlay} 
                  disabled={isLoading}
                  style={{
                    ...styles.playButton,
                    ...(isPlaying ? styles.pauseButton : {}),
                    ...(isLoading ? styles.loadingButton : {})
                  }}
                  aria-label={isPlaying ? "Pausar" : "Tocar"}
                >
                  {isLoading ? (
                    <div style={styles.spinner}></div>
                  ) : isPlaying ? (
                    <>
                      <span style={styles.buttonIcon}>⏸️</span>
                      <span style={styles.buttonText}>PAUSAR</span>
                    </>
                  ) : (
                    <>
                      <span style={styles.buttonIcon}>▶️</span>
                      <span style={styles.buttonText}>OUVIR AGORA</span>
                    </>
                  )}
                </button>
                
                <div style={styles.secondaryControls}>
                  <button 
                    onClick={toggleMute} 
                    style={{
                      ...styles.muteButton,
                      ...(muted ? styles.mutedButton : {})
                    }}
                    aria-label={muted ? "Ativar som" : "Mutar"}
                  >
                    <span style={styles.buttonIcon}>
                      {muted ? "🔇" : volume > 50 ? "🔊" : "🔈"}
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const newVolume = Math.min(100, volume + 10);
                      setVolume(newVolume);
                      if (audioRef.current) audioRef.current.volume = newVolume / 100;
                    }}
                    style={styles.volumeUpButton}
                    aria-label="Aumentar volume"
                  >
                    <span style={styles.buttonIcon}>➕</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      const newVolume = Math.max(0, volume - 10);
                      setVolume(newVolume);
                      if (audioRef.current) audioRef.current.volume = newVolume / 100;
                    }}
                    style={styles.volumeDownButton}
                    aria-label="Diminuir volume"
                  >
                    <span style={styles.buttonIcon}>➖</span>
                  </button>
                </div>
              </div>
              
              {/* Controle de Volume */}
              <div style={styles.volumeContainer}>
                <div style={styles.volumeLabel}>
                  <span style={styles.volumeIcon}>
                    {muted ? "🔇" : volume > 50 ? "🔊" : "🔈"}
                  </span>
                  <span style={styles.volumeText}>{muted ? "MUDO" : `${volume}%`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={styles.volumeSlider}
                  aria-label="Volume"
                />
              </div>
              
              {/* Status do Player */}
              <div style={styles.statusContainer}>
                <div style={styles.statusItem}>
                  <span style={styles.statusIcon}>
                    {isPlaying ? "🎵" : "⏸️"}
                  </span>
                  <span style={styles.statusText}>
                    {isPlaying ? "TRANSMISSÃO ATIVA" : "PAUSADO"}
                  </span>
                </div>
                <div style={styles.statusItem}>
                  <span style={styles.statusIcon}>📊</span>
                  <span style={styles.statusText}>
                    {spectrumData.length > 0 ? "SPECTRUM ATIVO" : "ANALISADOR"}
                  </span>
                </div>
                <div style={styles.statusItem}>
                  <span style={styles.statusIcon}>⚡</span>
                  <span style={styles.statusText}>STREAM DIRETA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Programação */}
        <div style={styles.scheduleSection}>
          <h2 style={styles.sectionTitle}>📅 PROGRAMAÇÃO DO DIA</h2>
          <div style={styles.scheduleGrid}>
            {programacao.map((item, index) => (
              <div key={index} style={styles.scheduleItem}>
                <div style={styles.scheduleTime}>{item.hora}</div>
                <div style={styles.scheduleInfo}>
                  <div style={styles.programName}>{item.programa}</div>
                  <div style={styles.programDJ}>com {item.dj}</div>
                </div>
                {formatTime(currentTime).includes(item.hora.substring(0, 2)) && (
                  <div style={styles.nowPlayingBadge}>
                    <span style={styles.nowPlayingDot}></span>
                    AO VIVO
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={styles.actionButtons}>
          <button 
            onClick={togglePlay}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>{isPlaying ? "⏸️" : "▶️"}</span>
            <span style={styles.actionText}>
              {isPlaying ? "PAUSAR RÁDIO" : "OUVIR RÁDIO"}
            </span>
          </button>
          
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noreferrer"
            style={styles.whatsappButton}
          >
            <span style={styles.actionIcon}>📱</span>
            <span style={styles.actionText}>PEDIR MÚSICA</span>
          </a>
          
          <button 
            onClick={() => {
              const audio = document.createElement('audio');
              audio.src = STREAM_URL;
              audio.play();
              window.open(STREAM_URL, '_blank');
            }}
            style={styles.streamButton}
          >
            <span style={styles.actionIcon}>🔗</span>
            <span style={styles.actionText}>STREAM DIRETO</span>
          </button>
        </div>

        {/* Informações Técnicas */}
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <span style={styles.infoIcon}>🎧</span>
              <h3 style={styles.infoTitle}>COMO OUVIR</h3>
            </div>
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.checkIcon}>✅</span>
                <span>Stream MP3 96kbps</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.checkIcon}>✅</span>
                <span>Servidor: Caster.fm</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.checkIcon}>✅</span>
                <span>24 horas no ar</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.checkIcon}>✅</span>
                <span>Todos dispositivos</span>
              </div>
            </div>
          </div>
          
          <div style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <span style={styles.infoIcon}>📡</span>
              <h3 style={styles.infoTitle}>CONEXÃO</h3>
            </div>
            <div style={styles.connectionInfo}>
              <div style={styles.connectionItem}>
                <span style={styles.connectionLabel}>Status:</span>
                <span style={styles.connectionValue}>
                  {isPlaying ? 
                    <span style={styles.connected}>CONECTADO</span> : 
                    <span style={styles.disconnected}>DESCONECTADO</span>
                  }
                </span>
              </div>
              <div style={styles.connectionItem}>
                <span style={styles.connectionLabel}>Servidor:</span>
                <span style={styles.connectionValue}>sapircast.caster.fm</span>
              </div>
              <div style={styles.connectionItem}>
                <span style={styles.connectionLabel}>Porta:</span>
                <span style={styles.connectionValue}>19793</span>
              </div>
              <div style={styles.connectionItem}>
                <span style={styles.connectionLabel}>Mount:</span>
                <span style={styles.connectionValue}>/UYD7q</span>
              </div>
            </div>
          </div>
          
          <div style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <span style={styles.infoIcon}>🤝</span>
              <h3 style={styles.infoTitle}>CONTATO</h3>
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <span>contato@radiogeorgefctech.com</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <span>(11) 99999-9999</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>💼</span>
                <span>Parcerias comerciais</span>
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div style={styles.socialSection}>
          <h3 style={styles.sectionTitle}>📱 SIGA A RÁDIO</h3>
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
                <span style={styles.socialName}>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.footerIcon}>📻</span>
            <span style={styles.footerTitle}>Rádio George FC Tech</span>
          </div>
          <div style={styles.footerInfo}>
            <p style={styles.footerText}>
              © 2026 Rádio George FC Tech. Transmitindo de São Paulo para todo o Brasil 🇧🇷
            </p>
            <div style={styles.techInfo}>
              <span style={styles.techItem}>Powered by Caster.fm</span>
              <span style={styles.techItem}>●</span>
              <span style={styles.techItem}>Web Audio API</span>
              <span style={styles.techItem}>●</span>
              <span style={styles.techItem}>Spectrum Visualizer</span>
            </div>
          </div>
          <div style={styles.playerStats}>
            <div style={styles.statItemFooter}>
              <span style={styles.statValueFooter}>{listenerCount}</span>
              <span style={styles.statLabelFooter}>Ouvintes</span>
            </div>
            <div style={styles.statItemFooter}>
              <span style={styles.statValueFooter}>{bitrate}</span>
              <span style={styles.statLabelFooter}>Qualidade</span>
            </div>
            <div style={styles.statItemFooter}>
              <span style={styles.statValueFooter}>
                {isPlaying ? "ON" : "OFF"}
              </span>
              <span style={styles.statLabelFooter}>Status</span>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px #6C2BDD, 0 0 10px rgba(108, 43, 221, 0.3); }
          50% { box-shadow: 0 0 20px #6C2BDD, 0 0 30px rgba(108, 43, 221, 0.5); }
          100% { box-shadow: 0 0 5px #6C2BDD, 0 0 10px rgba(108, 43, 221, 0.3); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spectrumBar {
          0% { transform: scaleY(0.1); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        button {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        input[type="range"] {
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6C2BDD;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(108, 43, 221, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6C2BDD;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(108, 43, 221, 0.5);
          border: none;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        .glow {
          animation: glow 2s infinite;
        }
        
        .slide-up {
          animation: slideUp 0.5s ease-out;
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    color: "#ffffff",
    fontFamily: "'Roboto', 'Segoe UI', 'Arial', sans-serif",
    overflowX: "hidden",
  },

  header: {
    background: "rgba(10, 10, 20, 0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "2px solid rgba(108, 43, 221, 0.3)",
    padding: "20px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    animation: "slideUp 0.5s ease-out",
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

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logoIcon: {
    fontSize: "48px",
    animation: "pulse 3s infinite",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  title: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD, #C77DFF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0",
    letterSpacing: "1px",
  },

  subtitle: {
    fontSize: "14px",
    opacity: "0.8",
    margin: "5px 0 0 0",
    letterSpacing: "0.5px",
  },

  statsContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  statBox: {
    background: "rgba(108, 43, 221, 0.1)",
    border: "1px solid rgba(108, 43, 221, 0.2)",
    borderRadius: "12px",
    padding: "12px 20px",
    textAlign: "center",
    minWidth: "120px",
    animation: "fadeIn 0.6s ease-out",
  },

  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#6C2BDD",
    marginBottom: "5px",
  },

  statLabel: {
    fontSize: "12px",
    opacity: "0.8",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },

  liveContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
    animation: "slideUp 0.6s ease-out",
  },

  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(108, 43, 221, 0.15)",
    padding: "12px 24px",
    borderRadius: "50px",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    animation: "glow 2s infinite",
  },

  liveDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #ff0000, #ff6b6b)",
    animation: "pulse 1s infinite",
  },

  liveText: {
    color: "#ff6b6b",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  streamInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "10px 20px",
    borderRadius: "50px",
  },

  streamIcon: {
    fontSize: "18px",
    animation: "float 3s ease-in-out infinite",
  },

  streamText: {
    fontSize: "14px",
    fontWeight: "600",
    opacity: "0.9",
  },

  playerContainer: {
    background: "rgba(15, 15, 25, 0.8)",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "40px",
    border: "1px solid rgba(108, 43, 221, 0.2)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    animation: "slideUp 0.7s ease-out",
    position: "relative",
    overflow: "hidden",
  },

  spectrumContainer: {
    position: "relative",
    width: "100%",
    height: "180px",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "15px",
    marginBottom: "30px",
    overflow: "hidden",
    border: "1px solid rgba(108, 43, 221, 0.3)",
  },

  spectrumCanvas: {
    width: "100%",
    height: "100%",
    display: "block",
  },

  spectrumOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.4)",
    pointerEvents: "none",
  },

  spectrumTitle: {
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: "10px",
  },

  spectrumStatus: {
    fontSize: "24px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "2px",
  },

  trackInfo: {
    animation: "fadeIn 0.8s ease-out",
  },

  nowPlaying: {
    marginBottom: "30px",
  },

  nowPlayingLabel: {
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#9D4EDD",
    marginBottom: "10px",
  },

  trackTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "15px",
    background: "linear-gradient(45deg, #ffffff, #cccccc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  trackDetails: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
  },

  playerControls: {
    animation: "slideUp 0.9s ease-out",
  },

  controlButtons: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  playButton: {
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    border: "none",
    borderRadius: "15px",
    padding: "20px 40px",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white",
    boxShadow: "0 10px 30px rgba(108, 43, 221, 0.4)",
    minWidth: "220px",
    justifyContent: "center",
    textTransform: "uppercase",
  },

  pauseButton: {
    background: "linear-gradient(45deg, #ff4757, #ff6b81)",
  },

  loadingButton: {
    opacity: "0.7",
    cursor: "not-allowed",
  },

  spinner: {
    width: "24px",
    height: "24px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  buttonIcon: {
    fontSize: "24px",
  },

  buttonText: {
    fontSize: "16px",
    fontWeight: "700",
  },

  secondaryControls: {
    display: "flex",
    gap: "10px",
  },

  muteButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    borderRadius: "12px",
    padding: "15px",
    fontSize: "20px",
    color: "white",
    minWidth: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  mutedButton: {
    background: "rgba(255, 71, 87, 0.2)",
    borderColor: "rgba(255, 71, 87, 0.5)",
  },

  volumeUpButton: {
    background: "rgba(108, 43, 221, 0.2)",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    borderRadius: "12px",
    padding: "15px",
    fontSize: "20px",
    color: "white",
    minWidth: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  volumeDownButton: {
    background: "rgba(108, 43, 221, 0.2)",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    borderRadius: "12px",
    padding: "15px",
    fontSize: "20px",
    color: "white",
    minWidth: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  volumeContainer: {
    marginBottom: "30px",
  },

  volumeLabel: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },

  volumeIcon: {
    fontSize: "24px",
  },

  volumeText: {
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  volumeSlider: {
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    background: "linear-gradient(to right, #6C2BDD, #9D4EDD)",
    outline: "none",
    WebkitAppearance: "none",
  },

  statusContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  statusItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(108, 43, 221, 0.1)",
    padding: "15px 25px",
    borderRadius: "12px",
    border: "1px solid rgba(108, 43, 221, 0.2)",
    minWidth: "200px",
  },

  statusIcon: {
    fontSize: "20px",
  },

  statusText: {
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  scheduleSection: {
    marginBottom: "40px",
    animation: "slideUp 1s ease-out",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "25px",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  scheduleGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  scheduleItem: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "20px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  scheduleItemHover: {
    background: "rgba(255, 255, 255, 0.08)",
    transform: "translateX(10px)",
    borderColor: "rgba(108, 43, 221, 0.3)",
  },

  scheduleTime: {
    fontWeight: "700",
    fontSize: "20px",
    minWidth: "90px",
    color: "#6C2BDD",
    textAlign: "center",
  },

  scheduleInfo: {
    flex: "1",
  },

  programName: {
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: "5px",
  },

  programDJ: {
    fontSize: "14px",
    opacity: "0.8",
  },

  nowPlayingBadge: {
    background: "linear-gradient(45deg, #ff4757, #ff6b81)",
    color: "#000",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    animation: "glow 2s infinite",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    letterSpacing: "1px",
  },

  nowPlayingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#000",
    animation: "pulse 1s infinite",
  },

  actionButtons: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
    animation: "slideUp 1.1s ease-out",
  },

  actionButton: {
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    border: "none",
    borderRadius: "15px",
    padding: "20px 30px",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white",
    boxShadow: "0 10px 30px rgba(108, 43, 221, 0.4)",
    minWidth: "250px",
    justifyContent: "center",
    textTransform: "uppercase",
  },

  whatsappButton: {
    background: "linear-gradient(45deg, #25D366, #128C7E)",
    border: "none",
    borderRadius: "15px",
    padding: "20px 30px",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white",
    boxShadow: "0 10px 30px rgba(37, 211, 102, 0.4)",
    minWidth: "250px",
    justifyContent: "center",
    textTransform: "uppercase",
    textDecoration: "none",
  },

  streamButton: {
    background: "linear-gradient(45deg, #1e90ff, #3742fa)",
    border: "none",
    borderRadius: "15px",
    padding: "20px 30px",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "white",
    boxShadow: "0 10px 30px rgba(30, 144, 255, 0.4)",
    minWidth: "250px",
    justifyContent: "center",
    textTransform: "uppercase",
  },

  actionIcon: {
    fontSize: "24px",
  },

  actionText: {
    fontSize: "16px",
    fontWeight: "700",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
    animation: "slideUp 1.2s ease-out",
  },

  infoCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "25px",
    borderRadius: "15px",
    border: "1px solid rgba(108, 43, 221, 0.2)",
  },

  infoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  infoIcon: {
    fontSize: "32px",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  infoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0",
    letterSpacing: "1px",
  },

  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
  },

  checkIcon: {
    fontSize: "20px",
    color: "#25D366",
  },

  connectionInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  connectionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },

  connectionLabel: {
    fontSize: "14px",
    opacity: "0.8",
  },

  connectionValue: {
    fontSize: "14px",
    fontWeight: "600",
  },

  connected: {
    color: "#25D366",
    fontWeight: "700",
  },

  disconnected: {
    color: "#ff4757",
    fontWeight: "700",
  },

  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    fontSize: "15px",
  },

  contactIcon: {
    fontSize: "20px",
    opacity: "0.8",
  },

  socialSection: {
    marginBottom: "40px",
    animation: "slideUp 1.3s ease-out",
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
    padding: "20px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "white",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  socialLinkHover: {
    background: "rgba(108, 43, 221, 0.1)",
    transform: "translateY(-5px)",
    borderColor: "rgba(108, 43, 221, 0.3)",
  },

  socialIcon: {
    fontSize: "28px",
  },

  socialName: {
    fontSize: "16px",
    fontWeight: "600",
  },

  footer: {
    background: "rgba(10, 10, 20, 0.95)",
    borderTop: "2px solid rgba(108, 43, 221, 0.3)",
    padding: "30px 0",
    animation: "slideUp 1.4s ease-out",
  },

  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
  },

  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  footerIcon: {
    fontSize: "36px",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  footerTitle: {
    fontSize: "20px",
    fontWeight: "700",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  footerInfo: {
    flex: "1",
    textAlign: "center",
  },

  footerText: {
    fontSize: "14px",
    opacity: "0.7",
    margin: "0 0 10px 0",
  },

  techInfo: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  techItem: {
    fontSize: "12px",
    opacity: "0.5",
  },

  playerStats: {
    display: "flex",
    gap: "20px",
  },

  statItemFooter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(108, 43, 221, 0.1)",
    padding: "15px",
    borderRadius: "12px",
    minWidth: "100px",
  },

  statValueFooter: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#6C2BDD",
    marginBottom: "5px",
  },

  statLabelFooter: {
    fontSize: "12px",
    opacity: "0.8",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  // Responsividade
  '@media (max-width: 768px)': {
    headerContent: {
      flexDirection: "column",
      textAlign: "center",
    },
    
    statsContainer: {
      justifyContent: "center",
    },
    
    statBox: {
      minWidth: "100px",
    },
    
    liveContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    
    spectrumContainer: {
      height: "120px",
    },
    
    controlButtons: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    
    playButton: {
      width: "100%",
    },
    
    secondaryControls: {
      justifyContent: "center",
    },
    
    statusItem: {
      minWidth: "100%",
    },
    
    scheduleItem: {
      flexDirection: "column",
      textAlign: "center",
      gap: "15px",
    },
    
    scheduleTime: {
      minWidth: "auto",
    },
    
    actionButtons: {
      flexDirection: "column",
    },
    
    actionButton: {
      width: "100%",
    },
    
    whatsappButton: {
      width: "100%",
    },
    
    streamButton: {
      width: "100%",
    },
    
    footerContent: {
      flexDirection: "column",
      textAlign: "center",
    },
    
    playerStats: {
      width: "100%",
      justifyContent: "center",
    },
  },

  '@media (max-width: 480px)': {
    title: {
      fontSize: "22px",
    },
    
    statValue: {
      fontSize: "20px",
    },
    
    trackTitle: {
      fontSize: "20px",
    },
    
    playButton: {
      padding: "15px 25px",
    },
    
    actionButton: {
      padding: "15px 25px",
    },
    
    infoGrid: {
      gridTemplateColumns: "1fr",
    },
  },
};

// Adicionar hover effects via JavaScript inline
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    button:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
    }
    
    .social-link:hover {
      background: rgba(108, 43, 221, 0.1) !important;
      transform: translateY(-5px) !important;
      border-color: rgba(108, 43, 221, 0.3) !important;
    }
    
    .schedule-item:hover {
      background: rgba(255, 255, 255, 0.08) !important;
      transform: translateX(10px) !important;
      border-color: rgba(108, 43, 221, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
};

export { addHoverEffects };