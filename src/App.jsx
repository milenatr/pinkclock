import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(600);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(600);

  // Usamos una URL de un sonido de campana suave (puedes cambiarla luego)
  const audioUrl = "https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3";
  const audioRef = useRef(new Audio(audioUrl));
  audioRef.current.loop = true;

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      // ¡AQUÍ SUENA EL AUDIO!
      audioRef.current.play();
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => {
    // Truco: En muchos navegadores el audio debe "despertarse" con un click
    audioRef.current.load(); 
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(initialTime);
    setIsActive(false);
    audioRef.current.pause();      // Detiene el sonido
    audioRef.current.currentTime = 0; // Lo devuelve al principio
  };

  const changeTime = (mins) => {
    const s = mins * 60;
    setSeconds(s);
    setInitialTime(s);
    setIsActive(false);
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - seconds) / initialTime) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#D9828C] font-sans">
      <div className="relative w-85 h-[420px] bg-white/25 backdrop-blur-xl rounded-[50px] border border-white/40 shadow-2xl flex flex-col items-center justify-between p-10 overflow-hidden">
        
        <div className="flex gap-6 text-white/80 font-bold text-sm z-10">
          <button onClick={() => changeTime(5)} className={`hover:text-white transition ${initialTime === 300 ? 'text-white border-b-2 border-white' : ''}`}>5 min</button>
          <button onClick={() => changeTime(10)} className={`hover:text-white transition ${initialTime === 600 ? 'text-white border-b-2 border-white' : ''}`}>10 min</button>
          <button onClick={() => changeTime(20)} className={`hover:text-white transition ${initialTime === 1200 ? 'text-white border-b-2 border-white' : ''}`}>20 min</button>
        </div>

        <div className="flex flex-col items-center z-10">
          <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Set Time</span>
          <h1 className="text-[90px] font-black text-white leading-none tracking-tighter drop-shadow-md">
            {formatTime(seconds)}
          </h1>
        </div>

        <button
          onClick={toggle}
          className="w-full py-5 bg-white text-[#D9828C] rounded-3xl font-black text-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 transition-all uppercase tracking-widest z-10"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>

        <div className="flex gap-5 z-10">
          <button onClick={reset} className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition border border-white/20">
             <span className="text-white text-xl">↺</span>
          </button>
          {/* Botón de prueba de sonido rápido */}
          <button onClick={() => audioRef.current.play()} className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition border border-white/20">
             <span className="text-white text-lg">🔔</span>
          </button>
        </div>
      </div>

      <div className="w-80 h-2.5 bg-white/20 rounded-full mt-10 overflow-hidden border border-white/10">
        <div 
          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;