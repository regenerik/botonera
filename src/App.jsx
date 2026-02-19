import { useMemo, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const audioRef = useRef(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(""), 900);
  };

  const playSound = (file, label) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const a = new Audio(file);
      audioRef.current = a;
      a.addEventListener("error", () => showToast(`No encontré: ${file}`));
      a.play()
        .then(() => label && showToast(label))
        .catch(() => showToast(`No pude reproducir: ${file}`));
    } catch (e) {
      showToast("Error reproduciendo audio");
    }
  };

  const A = (label, emoji, file) => ({
    label,
    emoji,
    audio: `${import.meta.env.BASE_URL}audio/${file}`,
  });

  const topPrimary = useMemo(
    () => [A("Sí", "👍", "acc_si.mp3"), A("No", "👎", "acc_no.mp3")],
    []
  );

  const quick = useMemo(
    () => [
      A("Tengo hambre", "🍽️", "comida_tengo_hambre.mp3"),
      A("Quiero más", "➕", "comida_quiero_mas.mp3"),
      A("No quiero más", "🛑", "comida_no_quiero_mas.mp3"),
      A("Quiero agua", "💧", "comida_agua.mp3"),
      A("Ir al baño", "🚽", "acc_ir_banio.mp3"),
      A("Me duele", "🤕", "emo_me_duele.mp3"),
      A("Ayuda", "🆘", "acc_ayuda.mp3"),
      A("Gaseosa", "🥤", "acc_quiero_gaseosa.mp3"),
    ],
    []
  );

  const rail = useMemo(
    () => [
      A("Sí", "👍", "acc_si.mp3"),
      A("No", "👎", "acc_no.mp3"),
      A("Tengo hambre", "🍽️", "comida_tengo_hambre.mp3"),
      A("Ir al baño", "🚽", "acc_ir_banio.mp3"),
      A("Quiero agua", "💧", "comida_agua.mp3"),
      A("Me duele", "🤕", "emo_me_duele.mp3"),
      A("Quiero dormir", "🛌", "acc_quiero_dormir.mp3"),
      A("Quiero compu", "💻", "acc_quiero_compu.mp3"),
      A("Quiero dibujar", "🎨", "acc_quiero_dibujar.mp3"),
      A("Quiero jugar", "🧸", "acc_quiero_jugar.mp3"),
    ],
    []
  );

  const categories = useMemo(
    () => [
      {
        name: "Comidas",
        emoji: "🍽️",
        desc: "Comer, tomar, más o no más",
        items: [
          A("Quiero comer", "😋", "comida_quiero_comer.mp3"),
          A("Tengo hambre", "🍽️", "comida_tengo_hambre.mp3"),
          A("Quiero más", "➕", "comida_quiero_mas.mp3"),
          A("No quiero más", "🛑", "comida_no_quiero_mas.mp3"),
          A("Agua", "💧", "comida_agua.mp3"),
          A("Leche", "🥛", "comida_leche.mp3"),
          A("Pan", "🍞", "comida_pan.mp3"),
          A("Factura", "🥐", "comida_factura.mp3"),
          A("Quiero helado", "🍦", "comida_quiero_helado.mp3"),
          A("Gaseosa", "🥤", "acc_quiero_gaseosa.mp3"),
          A("Pizza", "🍕", "comida_quiero_pizza.mp3"),
          A("Hamburguesa", "🍔", "comida_quiero_hamburguesa.mp3"),
          A("Empanadas", "🥟", "comida_quiero_empanada.mp3"),
          A("Panchos", "🌭", "comida_quiero_panchos.mp3"),
          A("Sanguches", "🥪", "comida_quiero_sanguches.mp3"),
          A("Torta", "🍰", "comida_quiero_torta.mp3"),
        ],
      },
      {
        name: "Emociones",
        emoji: "🙂",
        desc: "Cómo se siente",
        items: [
          A("Feliz", "😄", "emo_feliz.mp3"),
          A("Triste", "😢", "emo_triste.mp3"),
          A("Cansada", "🥱", "emo_cansada.mp3"),
          A("Animada", "🤩", "emo_animada.mp3"),
          A("Me causa gracia", "😂", "emo_gracia.mp3"),
          A("No me gusta", "🙅‍♀️", "emo_no_me_gusta.mp3"),
          A("Estoy enojada", "😠", "emo_enojada.mp3"),
          A("Asustada", "😨", "emo_asustada.mp3"),
          A("Me duele", "🤕", "emo_me_duele.mp3"),
        ],
      },
      {
        name: "Acciones",
        emoji: "🏃",
        desc: "Lo que quiere hacer",
        items: [
          A("Ir al baño", "🚽", "acc_ir_banio.mp3"),
          A("Quiero bañarme", "🛁", "acc_quiero_banarme.mp3"),
          A("Quiero dormir", "🛌", "acc_quiero_dormir.mp3"),
          A("Quiero jugar", "🧸", "acc_quiero_jugar.mp3"),
          A("Quiero dibujar", "🎨", "acc_quiero_dibujar.mp3"),
          A("Quiero compu", "💻", "acc_quiero_compu.mp3"),
          A("Quiero salir", "🚪", "acc_quiero_salir.mp3"),
          A("No quiero salir", "🚫🚪", "acc_no_quiero_salir.mp3"),
          A("Ayuda", "🆘", "acc_ayuda.mp3"),
          A("Gaseosa", "🥤", "acc_quiero_gaseosa.mp3"),
          A("Casa", "🏠", "acc_quiero_casa.mp3"),
          A("Super", "🛒", "acc_quiero_super.mp3"),
        ],
      },
      {
        name: "Lugares",
        emoji: "📍",
        desc: "A dónde quiere ir",
        items: [
          A("Casa", "🏠", "lug_casa.mp3"),
          A("Baño", "🚽", "lug_banio.mp3"),
          A("Cocina", "🍳", "lug_cocina.mp3"),
          A("Cama", "🛏️", "lug_cama.mp3"),
          A("Plaza", "🌳", "lug_plaza.mp3"),
          A("Super", "🛒", "lug_tienda.mp3"),
        ],
      },
    ],
    []
  );

  return (
    <div className="app">
      <header className="header">
        <h1 className="h1">Botonera</h1>
        <p className="sub">Botones grandes y panel rápido.</p>
      </header>

      <div className="layout">
        <main className="main">
          <section className="topRow">
            {topPrimary.map((b) => (
              <button
                key={b.label}
                className={`card card--xl ${b.label === "Sí" ? "yes" : "no"}`}
                onClick={() => playSound(b.audio, b.label)}
              >
                <div className="emoji big">{b.emoji}</div>
                <div className="label big">{b.label}</div>
              </button>
            ))}
          </section>

          <section className="panel">
            <div className="panelTitle">Rápido</div>
            <div className="grid quickGrid">
              {quick.map((item) => (
                <button
                  key={item.label}
                  className="card"
                  onClick={() => playSound(item.audio, item.label)}
                >
                  <div className="emoji">{item.emoji}</div>
                  <div className="label">{item.label}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panelTitle">Categorías</div>
            <div className="accordion">
              {categories.map((cat) => (
                <details key={cat.name} className="category">
                  <summary className="summary">
                    <div className="summaryLeft">
                      <div className="summaryEmoji">{cat.emoji}</div>
                      <div className="summaryText">
                        <div className="summaryTitle">{cat.name}</div>
                        <div className="summaryDesc">{cat.desc}</div>
                      </div>
                    </div>
                    <div className="chev">⌄</div>
                  </summary>
                  <div className="content">
                    <div className="grid">
                      {cat.items.map((item) => (
                        <button
                          key={item.label}
                          className="card"
                          onClick={() => playSound(item.audio, item.label)}
                        >
                          <div className="emoji">{item.emoji}</div>
                          <div className="label">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        </main>

        <div className="rail-container">
          <aside className="rail" aria-label="Accesos fijos">
            {rail.map((b) => (
              <button
                key={b.label}
                className="railBtn"
                onClick={() => playSound(b.audio, b.label)}
              >
                <span className="railEmoji">{b.emoji}</span>
              </button>
            ))}
          </aside>
        </div>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}