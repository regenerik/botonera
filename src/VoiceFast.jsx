import { useMemo, useRef, useState } from "react";
import "./VoiceFast.css";

const angleFromCenter = (cx, cy, x, y) => {
  let a = Math.atan2(y - cy, x - cx);
  // Ajustamos el ángulo para que coincida con el inicio del gradiente (arriba)
  a += Math.PI / 2;
  if (a < 0) a += Math.PI * 2;
  return a;
};

const dist = (cx, cy, x, y) => Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

function speak(text) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-AR";
    u.rate = 1.1;
    window.speechSynthesis.speak(u);
  } catch (e) { console.error(e); }
}

const TREE_DATA = [
  {
    label: "Quiero",
    color: "#8b5cf6",
    children: [
      { label: "comer", color: "#a78bfa", children: [
          { label: "fruta", color: "#c4b5fd" },
          { label: "galletitas", color: "#c4b5fd" },
          { label: "algo rico", color: "#c4b5fd" }
      ]},
      { label: "tomar", color: "#a78bfa", children: [
          { label: "agua", color: "#c4b5fd" },
          { label: "jugo", color: "#c4b5fd" },
          { label: "leche", color: "#c4b5fd" }
      ]},
      { label: "jugar", color: "#a78bfa", children: [
          { label: "afuera", color: "#c4b5fd" },
          { label: "con la tablet", color: "#c4b5fd" },
          { label: "con la pelota", color: "#c4b5fd" }
      ]},
    ],
  },
  {
    label: "Necesito",
    color: "#ef4444",
    children: [
      { label: "ir al", color: "#f87171", children: [
          { label: "baño", color: "#fca5a5" },
          { label: "médico", color: "#fca5a5" },
          { label: "cuarto", color: "#fca5a5" }
      ]},
      { label: "un", color: "#f87171", children: [
          { label: "abrazo", color: "#fca5a5" },
          { label: "descanso", color: "#fca5a5" },
          { label: "remedio", color: "#fca5a5" }
      ]},
      { label: "ayuda", color: "#f87171" },
    ],
  },
  {
    label: "Me siento",
    color: "#10b981",
    children: [
      { label: "muy", color: "#34d399", children: [
          { label: "contento", color: "#6ee7b7" },
          { label: "cansado", color: "#6ee7b7" },
          { label: "triste", color: "#6ee7b7" },
          { label: "enojado", color: "#6ee7b7" }
      ]},
      { label: "un poco", color: "#34d399", children: [
          { label: "enfermo", color: "#6ee7b7" },
          { label: "asustado", color: "#6ee7b7" },
          { label: "aburrido", color: "#6ee7b7" }
      ]},
    ],
  },
  {
    label: "Soy",
    color: "#3b82f6",
    children: [
      { label: "tu", color: "#60a5fa", children: [
          { label: "hijo", color: "#93c5fd" },
          { label: "amigo", color: "#93c5fd" },
          { label: "nieta", color: "#93c5fd" }
      ]},
      { label: "alguien", color: "#60a5fa", children: [
          { label: "valiente", color: "#93c5fd" },
          { label: "bueno", color: "#93c5fd" },
          { label: "especial", color: "#93c5fd" }
      ]},
    ],
  },
  { label: "Sí", color: "#22c55e" },
  { label: "No", color: "#f43f5e" },
];

export default function VoiceFast() {
  const wheelRef = useRef(null);
  const [phrase, setPhrase] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stack, setStack] = useState([{ nodes: TREE_DATA, picked: [] }]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const current = stack[stack.length - 1];
  const drillTimer = useRef(null);
  const pressTimer = useRef(null);

  const handleReset = () => {
    setIsOpen(false);
    setStack([{ nodes: TREE_DATA, picked: [] }]);
    setActiveIndex(-1);
    clearTimeout(pressTimer.current);
    clearTimeout(drillTimer.current);
  };

  const onPointerDown = () => {
    pressTimer.current = setTimeout(() => setIsOpen(true), 200);
  };

  const onPointerMove = (e) => {
    if (!isOpen) return;
    const el = wheelRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const d = dist(cx, cy, e.clientX, e.clientY);
    
    if (d > rect.width * 0.15) {
      const angle = angleFromCenter(cx, cy, e.clientX, e.clientY);
      const n = current.nodes.length;
      const idx = Math.floor((angle / (Math.PI * 2)) * n) % n;

      if (idx !== activeIndex) {
        setActiveIndex(idx);
        clearTimeout(drillTimer.current);
        
        const node = current.nodes[idx];
        if (node?.children) {
          drillTimer.current = setTimeout(() => {
            setStack(prev => [...prev, { 
              nodes: node.children, 
              picked: [...current.picked, node.label] 
            }]);
            setActiveIndex(-1);
          }, 600);
        }
      }
    } else {
      setActiveIndex(-1);
      clearTimeout(drillTimer.current);
    }
  };

  const onPointerUp = (e) => {
    clearTimeout(pressTimer.current);
    clearTimeout(drillTimer.current);

    if (isOpen) {
      if (activeIndex >= 0) {
        const words = [...current.picked, current.nodes[activeIndex].label];
        setPhrase(prev => [...prev, ...words]);
        speak(words.join(" "));
      }
    } else {
        const rect = wheelRef.current.getBoundingClientRect();
        const angle = angleFromCenter(rect.left + rect.width/2, rect.top + rect.height/2, e.clientX, e.clientY);
        const n = TREE_DATA.length;
        const idx = Math.floor((angle / (Math.PI * 2)) * n) % n;
        const word = TREE_DATA[idx].label;
        setPhrase(prev => [...prev, word]);
        speak(word);
    }
    handleReset();
  };

  return (
    <div className="pie-container">
      <div className="display-area">
        <div className="phrase-output">
          {phrase.length > 0 ? phrase.join(" ") : <span className="placeholder">Frase vacía...</span>}
        </div>
        <div className="controls">
          <button onClick={() => speak(phrase.join(" "))} className="btn-main">Reproducir</button>
          <button onClick={() => setPhrase([])} className="btn-sub">Borrar</button>
        </div>
      </div>

      <div className={`wheel-box ${isOpen ? 'is-open' : ''}`}
           onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        
        <div ref={wheelRef} className="radial-wheel"
             style={{ "--stops": current.nodes.map((n, i) => `${n.color} ${(i/current.nodes.length)*100}% ${((i+1)/current.nodes.length)*100}%`).join(", ") }}>
          
          {current.nodes.map((node, i) => {
            const n = current.nodes.length;
            // OFFSET de -90 grados para que coincida con el inicio de la torta arriba
            const sliceAngle = (i / n) * (Math.PI * 2) + (Math.PI / n) - (Math.PI / 2);
            return (
              <div key={i} className={`node-label ${i === activeIndex ? 'active' : ''}`}
                   style={{ left: `${50 + Math.cos(sliceAngle) * 35}%`, top: `${50 + Math.sin(sliceAngle) * 35}%` }}>
                {node.label}
              </div>
            );
          })}

          <div className="wheel-center">
            <span className="center-text">
                {activeIndex >= 0 ? current.nodes[activeIndex].label : (current.picked.at(-1) || "Mantené")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}