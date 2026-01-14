import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [listeners, setListeners] = useState(125);
  const [spectrumEffect, setSpectrumEffect] = useState(1);
  const [currentTrack, setCurrentTrack] = useState("Rádio George FC Tech - Transmissão Ao Vivo");
  const [bitrate, setBitrate] = useState("128kbps");
  const [audioContext, setAudioContext] = useState(null);
  const [audioData, setAudioData] = useState(new Uint8Array(128));
  const [connectionStatus, setConnectionStatus] = useState("Conectando...");
  const [showSettings, setShowSettings] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // Stream URL direta do Caster.fm
  const STREAM_URL = "https://sapircast.caster.fm:19793/UYD7q?token=db0dd6f14c9c1e8b552206f015912820";

  // Efeitos de spectrum disponíveis
  const spectrumEffects = [
    { id: 1, name: "Barras Clássicas", color: "#6C2BDD" },
    { id: 2, name: "Ondas Suaves", color: "#25D366" },
    { id: 3, name: "Partículas", color: "#FF6B6B" },
    { id: 4, name: "Anéis Concêntricos", color: "#4ECDC4" },
    { id: 5, name: "Espiral", color: "#FFD93D" },
    { id: 6, name: "Matrix", color: "#00FF00" },
    { id: 7, name: "Fogo", color: "#FF4500" },
    { id: 8, name: "Água", color: "#1E90FF" },
    { id: 9, name: "Neón", color: "#FF00FF" },
    { id: 10, name: "Arco-íris", color: "rainbow" }
  ];

  // Atualizar hora atual e ouvintes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simular variação de ouvintes (em produção, buscaria da API)
      setListeners(prev => {
        const change = Math.floor(Math.random() * 20) - 8;
        return Math.max(50, prev + change);
      });
    }, 30000);
    
    return () => clearInterval(timer);
  }, []);

  // Inicializar Web Audio API quando player tocar
  useEffect(() => {
    if (isPlaying) {
      initAudioAnalysis();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext) {
        audioContext.close();
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const initAudioAnalysis = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      setAudioContext(context);
      
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = context.createMediaElementSource(audioRef.current);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(context.destination);
      
      startSpectrumAnimation();
    } catch (error) {
      console.error('Erro ao inicializar análise de áudio:', error);
      startSimulatedSpectrum();
    }
  };

  const startSpectrumAnimation = () => {
    if (!canvasRef.current || !analyserRef.current) {
      startSimulatedSpectrum();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSpectrumEffect(ctx, canvas, dataArray, spectrumEffect);
    };
    
    draw();
  };

  const startSimulatedSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const bufferLength = 128;
    const simulatedData = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      // Gerar dados simulados
      const time = Date.now() / 1000;
      for (let i = 0; i < bufferLength; i++) {
        const wave1 = Math.sin(time * 2 + i * 0.2) * 50;
        const wave2 = Math.sin(time * 3 + i * 0.15) * 30;
        const wave3 = Math.sin(time * 1.5 + i * 0.3) * 20;
        const random = Math.random() * 15;
        simulatedData[i] = 70 + wave1 + wave2 + wave3 + random;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSpectrumEffect(ctx, canvas, simulatedData, spectrumEffect);
      setAudioData(simulatedData);
    };
    
    draw();
  };

  const drawSpectrumEffect = (ctx, canvas, data, effectId) => {
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = data.length;
    
    switch(effectId) {
      case 1: // Barras Clássicas
        drawBars(ctx, width, height, data, '#6C2BDD');
        break;
      case 2: // Ondas Suaves
        drawWave(ctx, width, height, data, '#25D366');
        break;
      case 3: // Partículas
        drawParticles(ctx, width, height, data, '#FF6B6B');
        break;
      case 4: // Anéis Concêntricos
        drawCircles(ctx, width, height, data, '#4ECDC4');
        break;
      case 5: // Espiral
        drawSpiral(ctx, width, height, data, '#FFD93D');
        break;
      case 6: // Matrix
        drawMatrix(ctx, width, height, data, '#00FF00');
        break;
      case 7: // Fogo
        drawFire(ctx, width, height, data, '#FF4500');
        break;
      case 8: // Água
        drawWater(ctx, width, height, data, '#1E90FF');
        break;
      case 9: // Neón
        drawNeon(ctx, width, height, data, '#FF00FF');
        break;
      case 10: // Arco-íris
        drawRainbow(ctx, width, height, data);
        break;
      default:
        drawBars(ctx, width, height, data, '#6C2BDD');
    }
  };

  // Funções de desenho para cada efeito
  const drawBars = (ctx, width, height, data, color) => {
    const barWidth = (width / data.length) * 2.5;
    let x = 0;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, lightenColor(color, 50));
    ctx.fillStyle = gradient;
    
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height;
      
      // Barra principal
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      // Brilho no topo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(x, height - barHeight, barWidth, 2);
      ctx.fillStyle = gradient;
      
      x += barWidth + 1;
    }
  };

  const drawWave = (ctx, width, height, data, color) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const amplitude = (data[i] / 255) * (height / 2);
      const y = height / 2 + Math.sin(Date.now() / 1000 + i * 0.1) * amplitude;
      
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Preenchimento gradiente
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '80');
    gradient.addColorStop(1, color + '20');
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const drawParticles = (ctx, width, height, data, color) => {
    const particleCount = data.length;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (i / particleCount) * width;
      const y = height - (data[i] / 255) * height;
      const size = (data[i] / 255) * 10 + 2;
      
      // Partícula central
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Aura ao redor
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.strokeStyle = color + '40';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Rastro
      for (let j = 1; j <= 3; j++) {
        ctx.beginPath();
        ctx.arc(x, y + j * 5, size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(40 - j * 10).toString(16);
        ctx.fill();
      }
    }
  };

  const drawCircles = (ctx, width, height, data, color) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;
    
    for (let i = 0; i < data.length; i += 4) {
      const radius = (data[i] / 255) * maxRadius;
      const opacity = data[i] / 255;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const drawSpiral = (ctx, width, height, data, color) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 8;
      const radius = (data[i] / 255) * maxRadius + 10;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawMatrix = (ctx, width, height, data, color) => {
    const cols = 20;
    const rows = 10;
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const index = (col * rows + row) % data.length;
        const intensity = data[index] / 255;
        
        // Caractere "matrix"
        ctx.fillStyle = `rgba(0, 255, 0, ${intensity})`;
        ctx.font = `${cellHeight * 0.8}px monospace`;
        ctx.fillText(
          String.fromCharCode(48 + Math.floor(Math.random() * 74)),
          col * cellWidth,
          row * cellHeight + cellHeight * 0.8
        );
      }
    }
  };

  const drawFire = (ctx, width, height, data, color) => {
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#FF4500');
    gradient.addColorStop(0.5, '#FF8C00');
    gradient.addColorStop(1, '#FFFF00');
    
    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const flameHeight = (data[i] / 255) * height * 0.8;
      
      // Chama
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.bezierCurveTo(
        x + 10, height - flameHeight * 0.3,
        x - 10, height - flameHeight * 0.7,
        x, height - flameHeight
      );
      ctx.bezierCurveTo(
        x + 10, height - flameHeight * 0.7,
        x - 10, height - flameHeight * 0.3,
        x, height
      );
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  const drawWater = (ctx, width, height, data, color) => {
    const waveCount = 3;
    
    for (let wave = 0; wave < waveCount; wave++) {
      ctx.beginPath();
      ctx.moveTo(0, height * 0.7);
      
      for (let i = 0; i < width; i += 5) {
        const dataIndex = Math.floor((i / width) * data.length);
        const waveHeight = (data[dataIndex] / 255) * 30;
        const y = height * 0.7 + 
                  Math.sin(i * 0.02 + Date.now() / 1000 + wave) * waveHeight;
        
        ctx.lineTo(i, y);
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      const opacity = 0.3 + (wave * 0.2);
      ctx.fillStyle = color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
      ctx.fill();
    }
  };

  const drawNeon = (ctx, width, height, data, color) => {
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    
    // Linhas de neón
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const y = height - (data[i] / 255) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Pontos de neón
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / data.length) * width;
      const y = height - (data[i] / 255) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
  };

  const drawRainbow = (ctx, width, height, data) => {
    const colors = [
      '#FF0000', '#FF7F00', '#FFFF00',
      '#00FF00', '#0000FF', '#4B0082', '#9400D3'
    ];
    
    const barWidth = (width / data.length) * 2.5;
    let x = 0;
    
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height;
      const colorIndex = Math.floor((i / data.length) * colors.length);
      const color = colors[colorIndex];
      
      // Barra colorida
      ctx.fillStyle = color;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      // Brilho
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, height - barHeight, barWidth, 2);
      
      x += barWidth + 1;
    }
  };

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  };

  // Controle do player
  const togglePlay = async () => {
    if (!isPlaying) {
      try {
        setConnectionStatus("Conectando...");
        
        // Configurar áudio
        audioRef.current.src = STREAM_URL;
        audioRef.current.volume = volume / 100;
        
        // Tentar tocar
        await audioRef.current.play();
        
        setIsPlaying(true);
        setConnectionStatus("Conectado");
        setAudioError(null);
        
        // Simular informações da música
        simulateTrackInfo();
        
      } catch (error) {
        console.error('Erro ao reproduzir:', error);
        setAudioError("Não foi possível conectar à transmissão. Tente novamente.");
        setConnectionStatus("Erro de conexão");
        setIsPlaying(false);
        
        // Iniciar spectrum simulado
        startSimulatedSpectrum();
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setConnectionStatus("Pausado");
    }
  };

  const simulateTrackInfo = () => {
    const tracks = [
      "George FC Tech - Mix Eletrônico",
      "Música Popular Brasileira",
      "Tech Podcast - Inovações Digitais",
      "Pop Internacional - Top Hits",
      "Clássicos do Rock Mundial",
      "Jazz & Blues Especial",
      "Música Eletrônica Progressive",
      "Hip Hop Internacional",
      "Reggae & World Music",
      "MPB Atual"
    ];
    
    const artists = [
      "DJ George Mastermix",
      "Ana Tech & Convidados",
      "Tech News Network",
      "International Hits FM",
      "Rock Legends Radio",
      "Jazz Masters",
      "Progressive Beats",
      "Hip Hop Central",
      "World Sound System",
      "MPB Connection"
    ];
    
    // Mudar música a cada 30 segundos
    let trackIndex = 0;
    const interval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(interval);
        return;
      }
      
      trackIndex = (trackIndex + 1) % tracks.length;
      setCurrentTrack(`${tracks[trackIndex]} - ${artists[trackIndex]}`);
    }, 30000);
    
    // Primeira música
    setCurrentTrack(`${tracks[0]} - ${artists[0]}`);
    
    return () => clearInterval(interval);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const changeSpectrumEffect = (effectId) => {
    setSpectrumEffect(effectId);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getListenerColor = () => {
    if (listeners > 200) return "#25D366";
    if (listeners > 100) return "#FFD93D";
    return "#FF6B6B";
  };

  return (
    <div style={styles.container}>
      {/* Elemento de áudio oculto */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        style={{ display: 'none' }}
        onError={(e) => {
          console.error('Erro no áudio:', e);
          setAudioError("Erro na transmissão de áudio");
          setConnectionStatus("Erro");
        }}
        onCanPlay={() => {
          setConnectionStatus("Pronto");
          setAudioError(null);
        }}
      />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>🎧</div>
              <div style={styles.logoText}>
                <h1 style={styles.title}>Rádio George FC Tech</h1>
                <p style={styles.subtitle}>Música • Tecnologia • Informação • 24/7</p>
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
              <div style={styles.statIcon}>📡</div>
              <div style={styles.statInfo}>
                <div style={styles.statLabel}>STATUS</div>
                <div style={{
                  ...styles.statValue,
                  color: connectionStatus === "Conectado" ? "#25D366" : 
                         connectionStatus === "Conectando..." ? "#FFD93D" : "#FF6B6B"
                }}>
                  {connectionStatus}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Spectrum Visualizer */}
        <div 
          style={styles.spectrumContainer}
          onClick={togglePlay}
          title="Clique para play/pause"
        >
          <canvas
            ref={canvasRef}
            width={1200}
            height={300}
            style={styles.spectrumCanvas}
          />
          
          <div style={styles.spectrumOverlay}>
            <div style={styles.spectrumTitle}>
              {isPlaying ? "🎵 TOCANDO AGORA" : "⏸️ PAUSADO"}
            </div>
            <div style={styles.spectrumTrack}>{currentTrack}</div>
            <div style={styles.spectrumStats}>
              <span style={styles.spectrumStat}>🎧 {listeners} ouvintes</span>
              <span style={styles.spectrumStat}>⚡ {bitrate}</span>
              <span style={styles.spectrumStat}>🔊 {volume}%</span>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.mainControls}>
            <button 
              onClick={togglePlay}
              style={{
                ...styles.playButton,
                ...(isPlaying ? styles.pauseButton : {})
              }}
            >
              <span style={styles.buttonIcon}>
                {isPlaying ? "⏸️" : "▶️"}
              </span>
              <span style={styles.buttonText}>
                {isPlaying ? "PAUSAR" : "TOCAR RÁDIO"}
              </span>
            </button>
            
            <div style={styles.volumeSection}>
              <button 
                onClick={toggleMute}
                style={styles.muteButton}
                title={audioRef.current?.muted ? "Ativar som" : "Mutar"}
              >
                <span style={styles.buttonIcon}>
                  {audioRef.current?.muted ? "🔇" : volume > 50 ? "🔊" : "🔈"}
                </span>
              </button>
              
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
            
            <button 
              onClick={() => setShowSettings(!showSettings)}
              style={styles.settingsButton}
              title="Configurações do spectrum"
            >
              <span style={styles.buttonIcon}>⚙️</span>
              <span style={styles.buttonText}>EFEITOS</span>
            </button>
          </div>

          {/* Spectrum Effects Selector */}
          {showSettings && (
            <div style={styles.effectsPanel}>
              <h4 style={styles.effectsTitle}>🎨 Efeitos de Spectrum</h4>
              <div style={styles.effectsGrid}>
                {spectrumEffects.map(effect => (
                  <button
                    key={effect.id}
                    onClick={() => changeSpectrumEffect(effect.id)}
                    style={{
                      ...styles.effectButton,
                      ...(spectrumEffect === effect.id ? styles.effectButtonActive : {}),
                      borderColor: effect.color === 'rainbow' ? '#6C2BDD' : effect.color
                    }}
                    title={effect.name}
                  >
                    <div style={{
                      ...styles.effectPreview,
                      background: effect.color === 'rainbow' 
                        ? 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)'
                        : effect.color
                    }}></div>
                    <span style={styles.effectName}>{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {audioError && (
            <div style={styles.errorMessage}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{audioError}</span>
              <button 
                onClick={togglePlay}
                style={styles.retryButton}
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Audio Information */}
          <div style={styles.audioInfo}>
            <div style={styles.audioInfoItem}>
              <span style={styles.infoIcon}>🎵</span>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>MÚSICA ATUAL</div>
                <div style={styles.infoValue}>{currentTrack}</div>
              </div>
            </div>
            
            <div style={styles.audioInfoItem}>
              <span style={styles.infoIcon}>📊</span>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>EFEITO ATIVO</div>
                <div style={styles.infoValue}>
                  {spectrumEffects.find(e => e.id === spectrumEffect)?.name}
                </div>
              </div>
            </div>
            
            <div style={styles.audioInfoItem}>
              <span style={styles.infoIcon}>📡</span>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>STREAM</div>
                <div style={styles.infoValue}>
                  Caster.fm • {bitrate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div style={styles.statsContainer}>
          <h3 style={styles.statsTitle}>📈 ESTATÍSTICAS EM TEMPO REAL</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>👥</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>{listeners}</div>
                <div style={styles.statCardLabel}>Ouvintes Conectados</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: `${Math.min(100, (listeners / 300) * 100)}%`,
                    background: getListenerColor()
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>📶</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>{bitrate}</div>
                <div style={styles.statCardLabel}>Qualidade do Stream</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: '100%',
                    background: '#25D366'
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statCardIcon}>⏱️</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>24/7</div>
                <div style={styles.statCardLabel}>Transmissão Contínua</div>
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
              <div style={styles.statCardIcon}>🎛️</div>
              <div style={styles.statCardContent}>
                <div style={styles.statCardValue}>{spectrumEffect}/10</div>
                <div style={styles.statCardLabel}>Efeito de Spectrum</div>
                <div style={styles.statCardProgress}>
                  <div style={{
                    ...styles.statCardProgressBar,
                    width: `${(spectrumEffect / 10) * 100}%`,
                    background: spectrumEffects.find(e => e.id === spectrumEffect)?.color || '#6C2BDD'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsContainer}>
          <button 
            onClick={() => window.open(STREAM_URL, '_blank')}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>🔗</span>
            <span style={styles.actionText}>ABRIR STREAM DIRETO</span>
          </button>
          
          <button 
            onClick={() => setVolume(100)}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>🔊</span>
            <span style={styles.actionText}>VOLUME MÁXIMO</span>
          </button>
          
          <button 
            onClick={() => {
              const randomEffect = Math.floor(Math.random() * 10) + 1;
              setSpectrumEffect(randomEffect);
            }}
            style={styles.actionButton}
          >
            <span style={styles.actionIcon}>🎲</span>
            <span style={styles.actionText}>EFEITO ALEATÓRIO</span>
          </button>
          
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noreferrer"
            style={{...styles.actionButton, background: '#25D366'}}
          >
            <span style={styles.actionIcon}>📱</span>
            <span style={styles.actionText}>PEDIR MÚSICA</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.footerIcon}>🎧</span>
            <span style={styles.footerTitle}>Rádio George FC Tech</span>
          </div>
          
          <div style={styles.footerInfo}>
            <p style={styles.footerText}>
              Transmitindo via Caster.fm • São Paulo, Brasil 🇧🇷
            </p>
            <div style={styles.footerStats}>
              <span style={styles.footerStat}>
                <span style={styles.footerStatIcon}>👥</span>
                {listeners} ouvintes
              </span>
              <span style={styles.footerStat}>•</span>
              <span style={styles.footerStat}>
                <span style={styles.footerStatIcon}>🎵</span>
                {bitrate}
              </span>
              <span style={styles.footerStat}>•</span>
              <span style={styles.footerStat}>
                <span style={styles.footerStatIcon}>⏱️</span>
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
          
          <div style={styles.footerPlayer}>
            <button 
              onClick={togglePlay}
              style={styles.footerPlayButton}
            >
              <span style={styles.footerPlayIcon}>
                {isPlaying ? "⏸️" : "▶️"}
              </span>
            </button>
            <div style={styles.footerStatus}>
              {isPlaying ? "TOCANDO" : "PAUSADO"}
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
        
        @keyframes glow {
          0% { box-shadow: 0 0 10px #6C2BDD; }
          50% { box-shadow: 0 0 25px #6C2BDD; }
          100% { box-shadow: 0 0 10px #6C2BDD; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spectrumWave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: #0a0a0a;
        }
        
        button {
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-family: inherit;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }
        
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        input[type="range"] {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        input[type="range"]:hover {
          opacity: 1;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6C2BDD;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(108, 43, 221, 0.6);
          transition: all 0.3s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6C2BDD;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(108, 43, 221, 0.6);
          border: none;
          transition: all 0.3s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        .glow-animation {
          animation: glow 2s infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0c0c1a 100%)",
    color: "#ffffff",
    fontFamily: "'Roboto', 'Segoe UI', system-ui, sans-serif",
    overflowX: "hidden",
  },

  header: {
    background: "rgba(15, 15, 25, 0.95)",
    backdropFilter: "blur(15px)",
    borderBottom: "2px solid rgba(108, 43, 221, 0.3)",
    padding: "20px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 5px 30px rgba(0, 0, 0, 0.5)",
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
    gap: "15px",
  },

  logoIcon: {
    fontSize: "48px",
    animation: "pulse 3s infinite",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD, #C77DFF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 0 10px rgba(108, 43, 221, 0.5))",
  },

  logoText: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD, #C77DFF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0",
    letterSpacing: "0.5px",
    textShadow: "0 2px 10px rgba(108, 43, 221, 0.3)",
  },

  subtitle: {
    fontSize: "14px",
    opacity: "0.9",
    margin: "5px 0 0 0",
    letterSpacing: "1px",
    fontWeight: "500",
  },

  statsSection: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "12px 20px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minWidth: "150px",
    transition: "all 0.3s ease",
  },

  statItemHover: {
    background: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(108, 43, 221, 0.3)",
    transform: "translateY(-2px)",
  },

  statIcon: {
    fontSize: "28px",
    opacity: "0.9",
  },

  statInfo: {
    display: "flex",
    flexDirection: "column",
  },

  statLabel: {
    fontSize: "12px",
    opacity: "0.7",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "24px",
    fontWeight: "800",
    marginTop: "2px",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
    animation: "fadeIn 0.5s ease-out",
  },

  spectrumContainer: {
    position: "relative",
    width: "100%",
    height: "300px",
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "20px",
    marginBottom: "30px",
    overflow: "hidden",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 15px 50px rgba(0, 0, 0, 0.7)",
  },

  spectrumContainerHover: {
    borderColor: "rgba(108, 43, 221, 0.6)",
    transform: "scale(1.01)",
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
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.4)",
    pointerEvents: "none",
    padding: "30px",
  },

  spectrumTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "15px",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },

  spectrumTrack: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "15px",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
    textAlign: "center",
    maxWidth: "80%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  spectrumStats: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  spectrumStat: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    backdropFilter: "blur(10px)",
  },

  controlsContainer: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "30px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    animation: "fadeIn 0.6s ease-out",
  },

  mainControls: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  playButton: {
    flex: "1",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    border: "none",
    borderRadius: "15px",
    padding: "20px 30px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    minWidth: "250px",
    boxShadow: "0 10px 30px rgba(108, 43, 221, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  pauseButton: {
    background: "linear-gradient(45deg, #FF4757, #FF6B81)",
  },

  buttonIcon: {
    fontSize: "24px",
  },

  buttonText: {
    fontSize: "16px",
    fontWeight: "700",
  },

  volumeSection: {
    flex: "2",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "15px 25px",
    borderRadius: "15px",
    minWidth: "300px",
  },

  muteButton: {
    background: "rgba(108, 43, 221, 0.2)",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "20px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
  },

  volumeSlider: {
    flex: "1",
    height: "8px",
    background: "linear-gradient(to right, #6C2BDD, #9D4EDD)",
    borderRadius: "4px",
    WebkitAppearance: "none",
  },

  volumeValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#6C2BDD",
    minWidth: "50px",
    textAlign: "center",
  },

  settingsButton: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    borderRadius: "15px",
    padding: "20px 30px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minWidth: "150px",
  },

  effectsPanel: {
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "15px",
    padding: "25px",
    marginBottom: "20px",
    border: "1px solid rgba(108, 43, 221, 0.3)",
    animation: "fadeIn 0.3s ease-out",
  },

  effectsTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#9D4EDD",
    marginBottom: "20px",
    textAlign: "center",
  },

  effectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "15px",
  },

  effectButton: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "2px solid",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
  },

  effectButtonActive: {
    background: "rgba(108, 43, 221, 0.2)",
    transform: "scale(1.05)",
    boxShadow: "0 5px 20px rgba(108, 43, 221, 0.3)",
  },

  effectPreview: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginBottom: "5px",
  },

  effectName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },

  errorMessage: {
    background: "rgba(255, 71, 87, 0.1)",
    border: "1px solid rgba(255, 71, 87, 0.3)",
    borderRadius: "12px",
    padding: "15px 20px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    animation: "fadeIn 0.3s ease-out",
  },

  errorIcon: {
    fontSize: "24px",
  },

  errorText: {
    flex: "1",
    fontSize: "15px",
    fontWeight: "600",
    color: "#FF6B6B",
  },

  retryButton: {
    background: "rgba(255, 71, 87, 0.3)",
    border: "1px solid rgba(255, 71, 87, 0.5)",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
  },

  audioInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  audioInfoItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  infoIcon: {
    fontSize: "32px",
    opacity: "0.8",
  },

  infoContent: {
    flex: "1",
  },

  infoLabel: {
    fontSize: "12px",
    opacity: "0.7",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "5px",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
  },

  statsContainer: {
    marginBottom: "30px",
    animation: "fadeIn 0.7s ease-out",
  },

  statsTitle: {
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "25px",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    letterSpacing: "1px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "15px",
    padding: "25px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease",
  },

  statCardHover: {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(108, 43, 221, 0.3)",
    transform: "translateY(-5px)",
  },

  statCardIcon: {
    fontSize: "40px",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  statCardContent: {
    flex: "1",
  },

  statCardValue: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#6C2BDD",
    marginBottom: "5px",
  },

  statCardLabel: {
    fontSize: "14px",
    opacity: "0.8",
    marginBottom: "10px",
    fontWeight: "600",
  },

  statCardProgress: {
    height: "6px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "3px",
    overflow: "hidden",
  },

  statCardProgressBar: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.5s ease",
  },

  actionsContainer: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "30px",
    animation: "fadeIn 0.8s ease-out",
  },

  actionButton: {
    flex: "1",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    border: "none",
    borderRadius: "12px",
    padding: "18px 25px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    minWidth: "200px",
    textDecoration: "none",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  actionIcon: {
    fontSize: "20px",
  },

  actionText: {
    fontSize: "14px",
    fontWeight: "700",
  },

  footer: {
    background: "rgba(15, 15, 25, 0.95)",
    borderTop: "2px solid rgba(108, 43, 221, 0.3)",
    padding: "25px 0",
    backdropFilter: "blur(10px)",
    animation: "fadeIn 0.9s ease-out",
  },

  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "20px",
  },

  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  footerIcon: {
    fontSize: "28px",
    background: "linear-gradient(45deg, #6C2BDD, #9D4EDD)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  footerTitle: {
    fontSize: "18px",
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
    opacity: "0.8",
    marginBottom: "10px",
  },

  footerStats: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  footerStat: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px",
    opacity: "0.7",
  },

  footerStatIcon: {
    fontSize: "14px",
  },

  footerPlayer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  footerPlayButton: {
    background: "rgba(108, 43, 221, 0.2)",
    border: "2px solid rgba(108, 43, 221, 0.3)",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "20px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  footerPlayIcon: {
    fontSize: "20px",
  },

  footerStatus: {
    fontSize: "14px",
    fontWeight: "600",
    opacity: "0.8",
  },

  // Responsividade
  '@media (max-width: 768px)': {
    headerContent: {
      flexDirection: "column",
      textAlign: "center",
    },
    
    statItem: {
      minWidth: "120px",
      flex: "1",
    },
    
    spectrumContainer: {
      height: "200px",
    },
    
    mainControls: {
      flexDirection: "column",
    },
    
    playButton: {
      width: "100%",
      minWidth: "auto",
    },
    
    volumeSection: {
      width: "100%",
      minWidth: "auto",
    },
    
    settingsButton: {
      width: "100%",
      minWidth: "auto",
    },
    
    effectsGrid: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    
    audioInfo: {
      gridTemplateColumns: "1fr",
    },
    
    statsGrid: {
      gridTemplateColumns: "1fr",
    },
    
    actionsContainer: {
      flexDirection: "column",
    },
    
    actionButton: {
      width: "100%",
      minWidth: "auto",
    },
    
    footerContent: {
      flexDirection: "column",
      textAlign: "center",
    },
  },

  '@media (max-width: 480px)': {
    title: {
      fontSize: "22px",
    },
    
    spectrumContainer: {
      height: "150px",
    },
    
    effectsGrid: {
      gridTemplateColumns: "1fr",
    },
  },
};

// Adicionar hover effects
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    .stat-item:hover {
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(108, 43, 221, 0.3) !important;
      transform: translateY(-2px) !important;
    }
    
    .spectrum-container:hover {
      border-color: rgba(108, 43, 221, 0.6) !important;
      transform: scale(1.01) !important;
    }
    
    .stat-card:hover {
      background: rgba(255, 255, 255, 0.05) !important;
      border-color: rgba(108, 43, 221, 0.3) !important;
      transform: translateY(-5px) !important;
    }
    
    .effect-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
};

export { addHoverEffects };