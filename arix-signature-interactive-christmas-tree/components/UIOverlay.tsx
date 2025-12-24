import React, { useState } from 'react';

interface UIOverlayProps {
  lightsOn: boolean;
  setLightsOn: (v: boolean) => void;
  rotateSpeed: number;
  setRotateSpeed: (v: number) => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ lightsOn, setLightsOn, rotateSpeed, setRotateSpeed }) => {
  const [wish, setWish] = useState("");
  const [isWished, setIsWished] = useState(false);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(wish.trim()) {
        setIsWished(true);
        // Reset after 3 seconds for the UX
        setTimeout(() => {
            setIsWished(false);
            setWish("");
        }, 4000);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10">
      
      {/* Header / Brand */}
      <div className="flex flex-col items-center md:items-start space-y-2 animate-fade-in-down">
        <h1 className="font-serif text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 tracking-widest uppercase drop-shadow-md">
          Arix
        </h1>
        <h2 className="font-serif text-xs md:text-sm text-yellow-100 tracking-[0.3em] uppercase opacity-80 border-b border-yellow-500/30 pb-2">
          Signature Collection
        </h2>
      </div>

      {/* Center Message (Conditional) */}
      {isWished && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000 ease-in-out">
            <h3 className="font-serif text-2xl md:text-4xl text-white drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] animate-pulse">
                Wish Cast to the Stars
            </h3>
        </div>
      )}

      {/* Controls & Interaction */}
      <div className="flex flex-col md:flex-row justify-between items-end w-full gap-6 pointer-events-auto">
        
        {/* Wish Input */}
        <div className="w-full md:w-1/3 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-sm">
            <form onSubmit={handleWishSubmit} className="flex flex-col gap-2">
                <label className="text-yellow-500/80 text-xs tracking-widest uppercase font-serif">Make a Holiday Wish</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={wish}
                        onChange={(e) => setWish(e.target.value)}
                        placeholder="Type your wish..."
                        className="bg-transparent border-b border-white/20 text-white font-serif focus:outline-none focus:border-yellow-500 w-full pb-1 placeholder-white/20"
                    />
                    <button 
                        type="submit"
                        className="text-yellow-400 hover:text-white transition-colors duration-300 uppercase text-xs tracking-widest disabled:opacity-30"
                        disabled={!wish}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-4 items-end">
            <div className="flex flex-col items-end gap-1">
                <span className="text-yellow-500/60 text-[10px] tracking-widest uppercase">Illumination</span>
                <button 
                    onClick={() => setLightsOn(!lightsOn)}
                    className={`
                        px-6 py-2 border transition-all duration-500 font-serif text-sm tracking-widest uppercase
                        ${lightsOn 
                            ? 'border-yellow-500 text-yellow-900 bg-yellow-500 shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                            : 'border-white/20 text-white/50 hover:border-white/40'
                        }
                    `}
                >
                    {lightsOn ? 'ON' : 'OFF'}
                </button>
            </div>

            <div className="flex flex-col items-end gap-1">
                <span className="text-yellow-500/60 text-[10px] tracking-widest uppercase">Rotation</span>
                <div className="flex gap-2">
                    {[0, 0.5, 2].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => setRotateSpeed(speed)}
                            className={`
                                w-8 h-8 rounded-full border flex items-center justify-center text-[10px] transition-all duration-300
                                ${rotateSpeed === speed 
                                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' 
                                    : 'border-white/10 text-white/30 hover:border-white/30'
                                }
                            `}
                        >
                            {speed === 0 ? '||' : speed === 0.5 ? '1x' : '2x'}
                        </button>
                    ))}
                </div>
            </div>
        </div>

      </div>
      
      {/* Footer / Copyright */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
         <p className="text-white/20 text-[10px] font-serif tracking-widest">
            © 2024 ARIX DIGITAL. IMMERSIVE EXPERIENCE.
         </p>
      </div>

    </div>
  );
};

export default UIOverlay;