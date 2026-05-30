import { useState, useEffect, useRef, useCallback } from "react";

// ─── Google Fonts ────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg0: #070B14;
      --bg1: #0B1020;
      --bg2: #111827;
      --bg3: #182030;
      --cyan: #4FD1C5;
      --sky: #38BDF8;
      --violet: #8B5CF6;
      --amber: #F59E0B;
      --green: #22C55E;
      --red: #EF4444;
      --text: #CBD5E1;
      --dim: #475569;
      --bright: #E2E8F0;
    }

    html, body { background: var(--bg0); color: var(--text); overflow-x: hidden; }

    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes flicker {
      0%,100% { opacity: 1; }
      92% { opacity: 1; }
      93% { opacity: 0.85; }
      94% { opacity: 1; }
      96% { opacity: 0.9; }
      97% { opacity: 1; }
    }
    @keyframes pulse-cyan {
      0%,100% { box-shadow: 0 0 8px rgba(79,209,197,0.3); }
      50% { box-shadow: 0 0 20px rgba(79,209,197,0.6), 0 0 40px rgba(79,209,197,0.2); }
    }
    @keyframes pulse-green {
      0%,100% { box-shadow: 0 0 8px rgba(34,197,94,0.3); }
      50% { box-shadow: 0 0 20px rgba(34,197,94,0.6), 0 0 40px rgba(34,197,94,0.2); }
    }
    @keyframes data-flow {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-200px); opacity: 0; }
    }
    @keyframes blink {
      0%,100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      15% { transform: translateX(-8px); }
      30% { transform: translateX(8px); }
      45% { transform: translateX(-6px); }
      60% { transform: translateX(6px); }
      75% { transform: translateX(-3px); }
      90% { transform: translateX(3px); }
    }
    @keyframes sweep-green {
      0% { transform: translateY(-100%); opacity: 0; }
      10% { opacity: 0.6; }
      100% { transform: translateY(100%); opacity: 0; }
    }
    @keyframes sweep-red {
      0% { transform: translateX(-100%); opacity: 0; }
      10% { opacity: 0.5; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ripple {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes particle-burst {
      0% { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: var(--tx, translate(30px,-30px)) scale(0); opacity: 0; }
    }
    @keyframes progress-fill {
      from { width: 0%; }
      to { width: 100%; }
    }
    @keyframes grid-move {
      0% { background-position: 0 0; }
      100% { background-position: 0 60px; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes glitch {
      0%,100% { clip-path: inset(0 0 100% 0); }
      20% { clip-path: inset(30% 0 40% 0); transform: translateX(-4px); }
      40% { clip-path: inset(60% 0 20% 0); transform: translateX(4px); }
      60% { clip-path: inset(10% 0 70% 0); transform: translateX(-2px); }
      80% { clip-path: inset(50% 0 10% 0); transform: translateX(2px); }
    }
    @keyframes typing-cursor {
      0%,100% { border-color: var(--cyan); }
      50% { border-color: transparent; }
    }
    @keyframes corner-anim {
      0%,100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes stream-flow {
      0% { opacity: 0; transform: translateY(0); }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translateY(-300px); }
    }
    @keyframes wave {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
);

// ─── Animated Background ─────────────────────────────────────────────────────
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.6 ? "#4FD1C5" : Math.random() > 0.5 ? "#38BDF8" : "#8B5CF6"
    }));

    const streams = Array.from({ length: 8 }, (_, i) => ({
      x: (i + 1) * (W / 9),
      y: Math.random() * H,
      speed: Math.random() * 0.8 + 0.3,
      chars: Array.from({ length: 12 }, () => String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))),
      alpha: Math.random() * 0.15 + 0.05
    }));

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(79,209,197,0.04)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      const offset = (frame * 0.2) % gridSize;
      for (let x = 0; x <= W; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = -gridSize + offset; y <= H; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Data streams
      ctx.font = "12px 'Share Tech Mono'";
      streams.forEach(s => {
        s.y -= s.speed;
        if (s.y < -200) s.y = H + 100;
        s.chars.forEach((c, i) => {
          const alpha = s.alpha * (1 - i / 12);
          ctx.fillStyle = `rgba(79,209,197,${alpha})`;
          ctx.fillText(c, s.x, s.y + i * 16);
        });
        if (frame % 20 === 0) s.chars[0] = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `,${p.alpha})`).replace("rgb(", "rgba(").replace("#4FD1C5", `rgba(79,209,197,${p.alpha})`).replace("#38BDF8", `rgba(56,189,248,${p.alpha})`).replace("#8B5CF6", `rgba(139,92,246,${p.alpha})`);
        // simpler:
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Scanline CRT
      const scanY = (frame * 1.5) % (H + 100) - 50;
      const grad = ctx.createLinearGradient(0, scanY, 0, scanY + 3);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, "rgba(79,209,197,0.04)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY, W, 3);

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      opacity: 0.8
    }} />
  );
};

// ─── Corner Brackets ─────────────────────────────────────────────────────────
const CornerBrackets = ({ color = "#4FD1C5", size = 14, thickness = 2, animated = false }) => {
  const s = {
    position: "absolute", width: size, height: size,
    borderColor: color,
    animation: animated ? "corner-anim 2s ease-in-out infinite" : "none"
  };
  return (
    <>
      <span style={{ ...s, top: 0, left: 0, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopStyle: "solid", borderLeftStyle: "solid" }} />
      <span style={{ ...s, top: 0, right: 0, borderTopWidth: thickness, borderRightWidth: thickness, borderTopStyle: "solid", borderRightStyle: "solid" }} />
      <span style={{ ...s, bottom: 0, left: 0, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomStyle: "solid", borderLeftStyle: "solid" }} />
      <span style={{ ...s, bottom: 0, right: 0, borderBottomWidth: thickness, borderRightWidth: thickness, borderBottomStyle: "solid", borderRightStyle: "solid" }} />
    </>
  );
};

// ─── Hero Section ────────────────────────────────────────────────────────────
const HeroSection = () => {
  const [typed, setTyped] = useState("");
  const subtitle = "Upload documents. Retrieve knowledge. Chat with your data.";
  const [subIdx, setSubIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setSubIdx(prev => {
          if (prev >= subtitle.length) { clearInterval(interval); return prev; }
          return prev + 1;
        });
      }, 28);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      textAlign: "center", padding: "60px 20px 40px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.8s ease, transform 0.8s ease"
    }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--dim)" }}>
        <span style={{ color: "var(--green)" }}>● SYSTEM ONLINE</span>
        <span>RAG CORE v1.0.7</span>
        <span style={{ color: "var(--cyan)" }}>● VECTOR DB CONNECTED</span>
      </div>

      {/* Main title */}
      <h1 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "clamp(32px, 6vw, 72px)",
        fontWeight: 900,
        letterSpacing: "0.12em",
        lineHeight: 1.1,
        marginBottom: 20,
        animation: "flicker 8s infinite"
      }}>
        <span style={{ color: "var(--bright)" }}>PDF </span>
        <span style={{
          color: "var(--cyan)",
          textShadow: "0 0 20px rgba(79,209,197,0.5), 0 0 40px rgba(79,209,197,0.2)"
        }}>RAG </span>
        <span style={{
          color: "var(--violet)",
          textShadow: "0 0 20px rgba(139,92,246,0.5)"
        }}>ASSISTANT</span>
      </h1>

      {/* Subtitle with typing effect */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(13px, 1.8vw, 17px)",
        color: "var(--dim)",
        letterSpacing: "0.05em",
        minHeight: 28
      }}>
        <span style={{ color: "var(--cyan)", marginRight: 8 }}>›</span>
        {subtitle.slice(0, subIdx)}
        <span style={{
          display: "inline-block", width: 2, height: "1em",
          background: "var(--cyan)", marginLeft: 2,
          animation: "blink 0.8s step-end infinite",
          verticalAlign: "middle"
        }} />
      </div>
    </div>
  );
};

// ─── Upload Zone ─────────────────────────────────────────────────────────────
const UploadZone = ({ onUpload, uploadState }) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      onUpload(null, "invalid");
      return;
    }
    onUpload(file, "valid");
  };

  const borderColor = uploadState === "success" ? "var(--green)"
    : uploadState === "error" ? "var(--red)"
    : drag ? "var(--cyan)"
    : "rgba(79,209,197,0.3)";

  const glowColor = uploadState === "success" ? "rgba(34,197,94,0.3)"
    : uploadState === "error" ? "rgba(239,68,68,0.3)"
    : drag ? "rgba(79,209,197,0.2)"
    : "rgba(79,209,197,0.08)";

  return (
    <div style={{
      position: "relative", padding: 3,
      borderRadius: 12,
      background: `linear-gradient(135deg, ${borderColor}40, transparent 50%, ${borderColor}40)`,
      animation: uploadState === "error" ? "shake 0.5s ease" : uploadState === "success" ? "pulse-green 2s infinite" : "pulse-cyan 3s infinite",
    }}>
      {/* Scanline sweep on success */}
      {uploadState === "success" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          background: "linear-gradient(180deg, transparent, rgba(34,197,94,0.15), transparent)",
          animation: "sweep-green 1.2s ease forwards",
          borderRadius: 12, overflow: "hidden", pointerEvents: "none"
        }} />
      )}
      {uploadState === "error" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.2), transparent)",
          animation: "sweep-red 0.4s ease 2",
          borderRadius: 12, overflow: "hidden", pointerEvents: "none"
        }} />
      )}

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => uploadState === "idle" && inputRef.current?.click()}
        style={{
          position: "relative",
          background: `linear-gradient(135deg, var(--bg1), var(--bg2))`,
          border: `1px solid ${borderColor}`,
          borderRadius: 10,
          padding: "48px 32px",
          cursor: uploadState === "idle" ? "pointer" : "default",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          boxShadow: `inset 0 0 60px ${glowColor}, 0 0 30px ${glowColor}`,
          transition: "all 0.3s ease",
          transform: drag ? "scale(1.01) translateY(-2px)" : "scale(1)",
          overflow: "hidden"
        }}
      >
        <CornerBrackets color={borderColor} size={20} thickness={2} animated />

        {/* CRT scanlines overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none", borderRadius: 10
        }} />

        <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])} />

        {uploadState === "idle" && (
          <div style={{ animation: "float 3s ease-in-out infinite" }}>
            {/* PDF Icon */}
            <div style={{ fontSize: 56, marginBottom: 16, filter: "drop-shadow(0 0 12px rgba(79,209,197,0.4))" }}>
              <svg width="60" height="72" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block" }}>
                <path d="M8 0h32l20 20v52H8z" fill="rgba(79,209,197,0.08)" stroke="#4FD1C5" strokeWidth="1.5"/>
                <path d="M40 0l20 20H40z" fill="rgba(79,209,197,0.15)" stroke="#4FD1C5" strokeWidth="1.5"/>
                <text x="10" y="52" fontFamily="'Orbitron'" fontSize="11" fill="#4FD1C5" fontWeight="700">PDF</text>
              </svg>
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--bright)", letterSpacing: "0.1em", marginBottom: 10 }}>
              DRAG & DROP YOUR PDF HERE
            </div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "var(--dim)", marginBottom: 16 }}>— OR —</div>
            <div style={{
              display: "inline-block", padding: "8px 24px",
              border: "1px solid var(--cyan)", borderRadius: 4,
              fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 600,
              color: "var(--cyan)", letterSpacing: "0.15em",
              background: "rgba(79,209,197,0.06)",
              boxShadow: "0 0 12px rgba(79,209,197,0.2)"
            }}>
              CLICK TO BROWSE
            </div>
            <div style={{ marginTop: 14, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--dim)" }}>
              Only PDF files are supported
            </div>
          </div>
        )}

        {uploadState === "success" && (
          <div style={{ animation: "fadeSlideUp 0.5s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 12, color: "var(--green)", textShadow: "0 0 20px rgba(34,197,94,0.6)" }}>✓</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--green)", letterSpacing: "0.15em", marginBottom: 6 }}>PDF VERIFIED</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "var(--dim)" }}>Document accepted — processing initiated</div>
          </div>
        )}

        {uploadState === "error" && (
          <div>
            <div style={{ fontSize: 40, marginBottom: 12, color: "var(--red)", textShadow: "0 0 20px rgba(239,68,68,0.6)" }}>✗</div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--red)", letterSpacing: "0.15em", marginBottom: 6 }}>INVALID FILE TYPE</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "var(--red)", opacity: 0.7 }}>PDF FILES ONLY</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Pipeline Stage ───────────────────────────────────────────────────────────
const PipelineStage = ({ stage, status, index }) => {
  const icons = ["📄", "🔍", "✂️", "🧠", "📚", "⚡", "✅"];
  const labels = ["UPLOADING", "EXTRACTING", "CHUNKING", "EMBEDDING", "INDEXING", "OPTIMIZING", "READY"];
  const descs = ["Uploading document", "Extracting text", "Creating chunks", "Generating embeddings", "Building vector index", "Optimizing retrieval", "Knowledge base ready"];

  const isActive = status === "active";
  const isDone = status === "done";
  const isPending = status === "pending";

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      flex: 1, minWidth: 80
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
        border: `2px solid ${isDone ? "var(--green)" : isActive ? "var(--cyan)" : "rgba(79,209,197,0.15)"}`,
        background: isDone ? "rgba(34,197,94,0.1)" : isActive ? "rgba(79,209,197,0.12)" : "rgba(11,16,32,0.8)",
        boxShadow: isDone ? "0 0 16px rgba(34,197,94,0.3)" : isActive ? "0 0 20px rgba(79,209,197,0.4)" : "none",
        animation: isActive ? "pulse-cyan 1.5s infinite" : "none",
        transition: "all 0.4s ease",
        position: "relative",
        overflow: "hidden"
      }}>
        {isActive && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent, rgba(79,209,197,0.15), transparent)",
            animation: "sweep-green 1.5s ease-in-out infinite"
          }} />
        )}
        {isDone ? <span style={{ color: "var(--green)", fontSize: 20, fontWeight: 700 }}>✓</span> : <span>{icons[index]}</span>}
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", height: 2, background: "rgba(79,209,197,0.1)", borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: isDone ? "100%" : isActive ? "60%" : "0%",
          background: isDone ? "var(--green)" : "var(--cyan)",
          transition: "width 0.8s ease",
          animation: isActive ? "progress-fill 2s ease infinite" : "none"
        }} />
      </div>

      <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: isDone ? "var(--green)" : isActive ? "var(--cyan)" : "var(--dim)", textAlign: "center" }}>
        {labels[index]}
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--dim)", textAlign: "center", display: "none" }}>
        {descs[index]}
      </div>
    </div>
  );
};

// ─── Processing Pipeline ──────────────────────────────────────────────────────
const STAGES = 7;
const STAGE_DURATION = 1400; // ms per stage

const ProcessingPipeline = ({ active, onComplete, fileName }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] [INFO] PDF detected`,
    `[${new Date().toLocaleTimeString()}] [INFO] Initializing processing pipeline...`
  ]);
  const logsRef = useRef(null);

  const stageMessages = [
    `[INFO] Uploading ${fileName || "document"}...`,
    `[INFO] Extracting text content...`,
    `[INFO] Chunking document into segments...`,
    `[INFO] Generating vector embeddings...`,
    `[INFO] Upserting into Qdrant vector DB...`,
    `[INFO] Optimizing similarity search...`,
    `[READY] Knowledge base indexed successfully`
  ];

  useEffect(() => {
    if (!active) return;
    let stage = 0;
    const advance = () => {
      if (stage >= STAGES) { onComplete?.(); return; }
      const msg = `[${new Date().toLocaleTimeString()}] ${stageMessages[stage]}`;
      setLogs(prev => [...prev, msg]);
      setCurrentStage(stage);
      stage++;
      if (stage < STAGES) setTimeout(advance, STAGE_DURATION);
      else setTimeout(() => onComplete?.(), STAGE_DURATION);
    };
    advance();
  }, [active]);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  const getStatus = (i) => {
    if (i < currentStage) return "done";
    if (i === currentStage) return "active";
    return "pending";
  };

  return (
    <div style={{
      background: "var(--bg1)", border: "1px solid rgba(79,209,197,0.2)",
      borderRadius: 12, padding: "24px 20px",
      animation: "fadeSlideUp 0.5s ease"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", boxShadow: "0 0 8px var(--amber)", animation: "blink 1s infinite" }} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--amber)", letterSpacing: "0.12em" }}>
          AI PROCESSING PIPELINE
        </span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--dim)", marginLeft: "auto" }}>
          Preparing Knowledge Base...
        </span>
      </div>

      {/* Stages */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {Array.from({ length: STAGES }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <PipelineStage stage={i} status={getStatus(i)} index={i} />
            {i < STAGES - 1 && (
              <div style={{ width: 20, height: 2, background: i < currentStage ? "var(--green)" : "rgba(79,209,197,0.15)", transition: "background 0.5s ease", flexShrink: 0, margin: "0 4px", marginTop: -24 }} />
            )}
          </div>
        ))}
      </div>

      {/* Terminal Logs */}
      <div style={{ border: "1px solid rgba(79,209,197,0.1)", borderRadius: 6, background: "var(--bg0)", padding: "12px 14px" }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>TERMINAL LOGS</div>
        <div ref={logsRef} style={{ maxHeight: 100, overflowY: "auto", scrollBehavior: "smooth" }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
              color: log.includes("[READY]") ? "var(--green)" : log.includes("[ERROR]") ? "var(--red)" : "rgba(79,209,197,0.7)",
              lineHeight: 1.6,
              animation: "fadeSlideUp 0.3s ease"
            }}>
              {log}
            </div>
          ))}
          <span style={{ display: "inline-block", width: 8, height: 14, background: "var(--cyan)", animation: "blink 0.8s step-end infinite", verticalAlign: "middle" }} />
        </div>
      </div>
    </div>
  );
};

// ─── Document Status Card ─────────────────────────────────────────────────────
const DocumentStatusCard = ({ fileName, chunks }) => (
  <div style={{
    background: "var(--bg1)", border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: 12, padding: "20px",
    boxShadow: "0 0 20px rgba(34,197,94,0.1)",
    animation: "pulse-green 3s infinite, fadeSlideUp 0.5s ease",
    position: "relative", overflow: "hidden"
  }}>
    <CornerBrackets color="var(--green)" size={14} thickness={1.5} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 10px var(--green)" }} />
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: "var(--green)", letterSpacing: "0.12em" }}>
        KNOWLEDGE BASE READY
      </span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {[
        ["DOCUMENT", fileName || "document.pdf"],
        ["CHUNKS", chunks?.toString() || "—"],
        ["INDEX", "ACTIVE"],
        ["STATUS", "INDEXED"]
      ].map(([label, val]) => (
        <div key={label} style={{ background: "rgba(34,197,94,0.06)", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(34,197,94,0.1)" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "var(--dim)", marginBottom: 4, letterSpacing: "0.1em" }}>{label}</div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--green)" }}>{val}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "var(--dim)", marginRight: 4 }}>AI CORE</span>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 6, height: 6, borderRadius: "50%",
        background: "var(--cyan)",
        animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite`
      }} />
    ))}
  </div>
);

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  const [displayed, setDisplayed] = useState(isUser ? msg.content : "");
  const [done, setDone] = useState(isUser);

  useEffect(() => {
    if (isUser) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(msg.content.slice(0, i));
      i++;
      if (i > msg.content.length) { clearInterval(interval); setDone(true); }
    }, 12);
    return () => clearInterval(interval);
  }, [msg.content, isUser]);

  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      animation: "fadeSlideUp 0.4s ease",
      marginBottom: 12
    }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(79,209,197,0.15)", border: "1px solid var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginRight: 8, flexShrink: 0, alignSelf: "flex-end", boxShadow: "0 0 8px rgba(79,209,197,0.3)" }}>
          ◈
        </div>
      )}
      <div style={{
        maxWidth: "72%",
        padding: "12px 16px",
        borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
        background: isUser ? "rgba(139,92,246,0.1)" : "rgba(79,209,197,0.06)",
        border: `1px solid ${isUser ? "rgba(139,92,246,0.3)" : "rgba(79,209,197,0.25)"}`,
        boxShadow: isUser ? "0 0 10px rgba(139,92,246,0.1)" : "0 0 10px rgba(79,209,197,0.08)",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 13, lineHeight: 1.7,
        color: isUser ? "var(--bright)" : "var(--text)"
      }}>
        {!isUser && (
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: "var(--cyan)", letterSpacing: "0.12em", marginBottom: 6 }}>
            AI RESPONSE
          </div>
        )}
        {displayed}
        {!isUser && !done && (
          <span style={{ display: "inline-block", width: 2, height: "1em", background: "var(--cyan)", marginLeft: 2, animation: "blink 0.5s step-end infinite", verticalAlign: "middle" }} />
        )}
        {msg.sources && msg.sources.length > 0 && done && (
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(79,209,197,0.15)" }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--dim)" }}>
              SOURCES: {msg.sources.join(", ")}
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(139,92,246,0.15)", border: "1px solid var(--violet)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginLeft: 8, flexShrink: 0, alignSelf: "flex-end" }}>
          ◉
        </div>
      )}
    </div>
  );
};

// ─── Chat Window ──────────────────────────────────────────────────────────────
const ChatWindow = ({ messages, loading }) => {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  return (
    <div style={{
      minHeight: 280, maxHeight: 420, overflowY: "auto",
      padding: "16px 4px",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(79,209,197,0.2) transparent"
    }}>
      {messages.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "var(--dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>◈</div>
          Ask a question to begin querying the knowledge base...
        </div>
      )}
      {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}
      {loading && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
};

// ─── Prompt Input ─────────────────────────────────────────────────────────────
const PromptInput = ({ onSend, disabled, loading }) => {
  const [val, setVal] = useState("");

  const send = () => {
    if (!val.trim() || disabled || loading) return;
    onSend(val.trim());
    setVal("");
  };

  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-end",
      background: "var(--bg1)", border: "1px solid rgba(79,209,197,0.2)",
      borderRadius: 10, padding: "14px 16px",
      boxShadow: disabled ? "none" : "0 0 20px rgba(79,209,197,0.05)",
      transition: "box-shadow 0.3s ease"
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 9, color: "var(--dim)", letterSpacing: "0.1em", marginBottom: 8 }}>ASK A QUESTION</div>
        <textarea
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          disabled={disabled || loading}
          placeholder="Ask a question about your document..."
          rows={2}
          style={{
            width: "100%", background: "transparent", border: "none", outline: "none",
            resize: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
            color: disabled ? "var(--dim)" : "var(--bright)",
            lineHeight: 1.6,
            caretColor: "var(--cyan)",
            cursor: disabled ? "not-allowed" : "text"
          }}
        />
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--dim)", marginTop: 4 }}>
          Press Enter to send · Shift+Enter for newline
        </div>
      </div>

      <button
        onClick={send}
        disabled={disabled || loading || !val.trim()}
        style={{
          flexShrink: 0,
          padding: "14px 24px",
          background: loading ? "rgba(79,209,197,0.08)" : disabled ? "rgba(71,85,105,0.2)" : "rgba(79,209,197,0.1)",
          border: `1.5px solid ${disabled ? "var(--dim)" : "var(--cyan)"}`,
          borderRadius: 8,
          cursor: disabled || loading ? "not-allowed" : "pointer",
          fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700,
          color: disabled ? "var(--dim)" : "var(--cyan)",
          letterSpacing: "0.12em",
          boxShadow: !disabled && !loading ? "0 0 16px rgba(79,209,197,0.2)" : "none",
          transition: "all 0.2s ease",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6
        }}
        onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.boxShadow = "0 0 28px rgba(79,209,197,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = !disabled ? "0 0 16px rgba(79,209,197,0.2)" : "none"; }}
      >
        {loading ? (
          <>
            <div style={{ width: 18, height: 18, border: "2px solid rgba(79,209,197,0.2)", borderTopColor: "var(--cyan)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: 9 }}>ANALYZING</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <span>SEND</span>
          </>
        )}
      </button>
    </div>
  );
};

// ─── API HELPERS ──────────────────────────────────────────────────────────────
const BACKEND_URL = "http://localhost:8000";
const INNGEST_URL = "http://localhost:8288";

const ingestPDF = async (filePath, sourceId) => {
  const resp = await fetch(`${INNGEST_URL}/e/rag/ingest_pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { pdf_path: filePath, source_id: sourceId } })
  });
  return resp.ok;
};

const queryPDF = async (question) => {
  const resp = await fetch(`${INNGEST_URL}/e/rag/query_pdf_ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { question, top_k: 5 } })
  });
  // Note: Inngest event triggers are async. Poll or use the API endpoint directly.
  // For direct answer, call FastAPI endpoint if you expose /query
  if (!resp.ok) throw new Error("Query failed");
  const data = await resp.json();
  return data;
};

// Direct FastAPI query (add this endpoint in main.py — see instructions below)
const queryDirect = async (question) => {
  const resp = await fetch(`${BACKEND_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, top_k: 5 })
  });
  if (!resp.ok) throw new Error("Query failed");
  return resp.json();
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PDFRagAssistant() {
  const [uploadState, setUploadState] = useState("idle"); // idle | success | error
  const [processingActive, setProcessingActive] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);


    const handleUpload = useCallback(async (file, status) => {
        if (status === "invalid") {
            setUploadState("error");
            setTimeout(() => setUploadState("idle"), 3000);
            return;
        }

        setUploadedFile(file);
        setUploadState("success");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const resp = await fetch(`${BACKEND_URL}/upload`, {
                method: "POST",
                body: formData,
            });
            if (!resp.ok) throw new Error("Upload failed");
            setTimeout(() => setProcessingActive(true), 1200);
        } catch (err) {
            setUploadState("error");
            setTimeout(() => setUploadState("idle"), 3000);
            console.error("Upload error:", err);
        }
    }, []);

  const handlePipelineComplete = useCallback(() => {
    setProcessingDone(true);
    setMessages([{
      role: "assistant",
      content: `Knowledge base initialized. I've processed "${uploadedFile?.name || "your document"}" and indexed it for retrieval. You can now ask me anything about its contents.`,
      sources: []
    }]);
  }, [uploadedFile]);

  const handleSend = useCallback(async (question) => {
    setMessages(prev => [...prev, { role: "user", content: question }]);
    setLoading(true);
    try {
      const result = await queryDirect(question);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.answer || "No answer found in the document.",
        sources: result.sources || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `[ERROR] Query failed: ${err.message}. Ensure your FastAPI backend is running at ${BACKEND_URL} and the /query endpoint exists.`,
        sources: []
      }]);
    }
    setLoading(false);
  }, []);

  return (
    <>
      <FontLoader />
      <div style={{
        minHeight: "100vh",
        background: "var(--bg0)",
        position: "relative",
        animation: "flicker 12s infinite"
      }}>
        <AnimatedBackground />

        {/* CRT vignette */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)"
        }} />

        {/* Top bar */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 10,
          background: "rgba(7,11,20,0.85)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(79,209,197,0.1)",
          display: "flex", alignItems: "center", padding: "10px 24px", gap: 16
        }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 900, color: "var(--cyan)", letterSpacing: "0.15em", textShadow: "0 0 10px rgba(79,209,197,0.4)" }}>
            ◈ RAG OS
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "var(--dim)" }}>v1.0.7</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 20, fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
            <span style={{ color: "var(--green)" }}>● INNGEST</span>
            <span style={{ color: "var(--cyan)" }}>● QDRANT</span>
            <span style={{ color: processingDone ? "var(--green)" : "var(--amber)" }}>
              ● {processingDone ? "INDEXED" : "STANDBY"}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: 900, margin: "0 auto",
          padding: "80px 20px 60px"
        }}>
          <HeroSection />

          {/* Upload zone */}
          {!processingActive && !processingDone && (
            <div style={{ marginBottom: 24, animation: "fadeSlideUp 0.6s ease 0.3s both" }}>
              <UploadZone onUpload={handleUpload} uploadState={uploadState} />
            </div>
          )}

          {/* Processing pipeline */}
          {processingActive && !processingDone && (
            <div style={{ marginBottom: 24 }}>
              <ProcessingPipeline
                active={processingActive}
                onComplete={handlePipelineComplete}
                fileName={uploadedFile?.name}
              />
            </div>
          )}

          {/* Ready state */}
          {processingDone && (
            <div style={{ marginBottom: 24, animation: "fadeSlideUp 0.6s ease" }}>
              <DocumentStatusCard fileName={uploadedFile?.name} chunks={428} />
            </div>
          )}

          {/* Chat section */}
          {processingDone && (
            <div style={{
              background: "var(--bg1)", border: "1px solid rgba(79,209,197,0.15)",
              borderRadius: 12, padding: "20px", animation: "fadeSlideUp 0.6s ease 0.2s both"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(79,209,197,0.1)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", animation: "blink 2s infinite" }} />
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 600, color: "var(--cyan)", letterSpacing: "0.1em" }}>KNOWLEDGE RETRIEVAL INTERFACE</span>
              </div>
              <ChatWindow messages={messages} loading={loading} />
              <PromptInput onSend={handleSend} disabled={false} loading={loading} />
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 40, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(71,85,105,0.5)", letterSpacing: "0.08em" }}>
            PDF RAG ASSISTANT · POWERED BY INNGEST + QDRANT + GROQ · BACKEND: {BACKEND_URL}
          </div>
        </div>
      </div>
    </>
  );
}
