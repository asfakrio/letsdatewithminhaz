import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail } from "lucide-react";

interface PageProposalProps {
  onAccept: () => void;
}

interface BurstHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface TempHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
  delay: number;
}

const RUNAWAY_MESSAGES = [
  "🥺 Please don't click No...",
  "👉👈 Are you sure, Ritu? Give Minhaz a chance... ❤️",
  "🌹 Please? It would make me really happy... 😊",
  "🥹 Just one date... I promise it'll be fun! ✨",
  "💖 Okay okay... one last try. Please say Yes? 🥺❤️",
];

export const PageProposal: React.FC<PageProposalProps> = ({ onAccept }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isAccepted, setIsAccepted] = useState(false);
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);
  const [hasMoved, setHasMoved] = useState(false);

  // Pleading message and transformation states
  const [noAttempts, setNoAttempts] = useState(0);
  const [isTransformed, setIsTransformed] = useState(false);
  const [messageHearts, setMessageHearts] = useState<TempHeart[]>([]);
  const [showAcceptanceMessage, setShowAcceptanceMessage] = useState(false);
  const [originalCoords, setOriginalCoords] = useState<{ left: number; top: number } | null>(null);

  // Spawn small hearts around the message bubble when it updates
  const spawnHearts = () => {
    const newHearts: TempHeart[] = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: -80 + Math.random() * 160, // drift left/right
      y: -40 - Math.random() * 80,  // float upwards
      scale: 0.5 + Math.random() * 0.8,
      delay: Math.random() * 0.15,
    }));
    setMessageHearts(newHearts);

    // Clean up hearts after animation completes
    setTimeout(() => {
      setMessageHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1500);
  };

  // Trigger runaway movement of the No button within screen boundaries
  const moveNoButton = () => {
    if (isTransformed || noAttempts >= 5) {
      return;
    }

    const nextAttempts = noAttempts + 1;
    setNoAttempts(nextAttempts);
    spawnHearts();

    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get actual button size, fallback to typical dimensions
    const btn = document.getElementById("btn-no");
    let width = 140;
    let height = 55;
    let currentLeft = 0;
    let currentTop = 0;

    if (btn) {
      const rect = btn.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      currentLeft = rect.left;
      currentTop = rect.top;
    }

    // Capture original static coordinates on first move
    let refLeft = originalCoords?.left ?? currentLeft;
    let refTop = originalCoords?.top ?? currentTop;

    if (!originalCoords && currentLeft !== 0) {
      setOriginalCoords({ left: currentLeft, top: currentTop });
      refLeft = currentLeft;
      refTop = currentTop;
    }

    const padding = 24;
    const maxX = viewportWidth - width - padding * 2;
    const maxY = viewportHeight - height - padding * 2;

    // Constrain random coordinates within safe viewport boundaries
    const absX = padding + Math.random() * Math.max(0, maxX);
    const absY = padding + Math.random() * Math.max(0, maxY);

    // Calculate relative offsets from original DOM position
    const offsetX = absX - refLeft;
    const offsetY = absY - refTop;

    setNoPosition({ x: offsetX, y: offsetY });
    setHasMoved(true);

    // After 5 attempts, trigger auto-transformation back to relative flow and turn into YES
    if (nextAttempts === 5) {
      setTimeout(() => {
        setIsTransformed(true);
        setHasMoved(false); // Smoothly slides back to its original layout position (0, 0)
        setNoPosition({ x: 0, y: 0 });
      }, 2000);
    }
  };

  const handleYesClick = () => {
    setIsAccepted(true);
    setShowAcceptanceMessage(true);

    // 1. Confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4f8b", "#ff85a7", "#fca5a5", "#ffffff"],
    });

    // Side showers
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 } });
    }, 250);

    // 2. Generate Heart Burst Animation
    const hearts: BurstHeart[] = Array.from({ length: 32 }).map((_, i) => {
      const angle = (i / 32) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const speed = 100 + Math.random() * 250;
      return {
        id: i,
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        scale: 0.5 + Math.random() * 1.2,
        rotation: Math.random() * 360,
      };
    });
    setBurstHearts(hearts);

    // 3. Page transition after acceptance screen settles
    setTimeout(() => {
      onAccept();
    }, 2500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl px-6 text-center z-10 select-none">
      
      {/* Full screen acceptance message overlay */}
      <AnimatePresence>
        {showAcceptanceMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.15, 1], opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center max-w-md text-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-7xl mb-8 filter drop-shadow-[0_10px_20px_rgba(255,79,139,0.3)]"
              >
                💖🎉
              </motion.div>
              <h2 className="font-serif font-black text-3xl md:text-4xl text-[#ff4f8b] leading-tight mb-4 drop-shadow-sm">
                Yay! I knew you'd say yes, Ritu! ❤️
              </h2>
              <p className="font-sans font-semibold text-gray-400 text-sm mt-2 animate-pulse">
                Setting up our date plan... ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart Burst Canvas */}
      <AnimatePresence>
        {isAccepted && !showAcceptanceMessage && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
            {burstHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: heart.x,
                  y: heart.y,
                  opacity: 0,
                  scale: heart.scale,
                  rotate: heart.rotation,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="absolute text-pink-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#ff4f8b"
                  className="w-10 h-10 drop-shadow-[0_4px_8px_rgba(255,79,139,0.3)]"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center"
      >
        {/* Envelope Bouncing Icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          className="relative w-28 h-28 mb-8 flex items-center justify-center bg-pink-50/50 rounded-full border border-pink-100 shadow-[0_8px_24px_rgba(255,79,139,0.06)]"
        >
          {/* Heart peaking out of envelope */}
          <motion.div
            animate={{ y: [4, -8, 4] }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            className="absolute top-6 text-[#ff4f8b]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(255,79,139,0.2)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
          <Mail className="w-16 h-16 text-pink-300 stroke-[1.25]" />
        </motion.div>

        {/* Serif Romantic Heading */}
        <h1 className="font-serif font-black text-4xl md:text-5xl lg:text-6xl text-gray-800 tracking-tight leading-tight mb-8 max-w-xl">
          Will you go on a date with Minhaz?
        </h1>

        {/* Message bubble for attempts */}
        <div className="min-h-[60px] w-full flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            {noAttempts > 0 && !showAcceptanceMessage && (
              <motion.div
                key={noAttempts}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative px-6 py-3 bg-pink-50/90 border border-pink-100/70 rounded-2xl text-[#ff4f8b] font-bold shadow-[0_4px_12px_rgba(255,79,139,0.06)] text-sm md:text-base flex items-center justify-center"
              >
                {/* Floating Heart Particle Effect for message */}
                {messageHearts.map((heart) => (
                  <motion.span
                    key={heart.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ x: heart.x, y: heart.y, opacity: 0, scale: heart.scale }}
                    transition={{ duration: 1.2, delay: heart.delay, ease: "easeOut" }}
                    className="absolute text-pink-400 pointer-events-none select-none text-xl"
                    style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                  >
                    ❤️
                  </motion.span>
                ))}
                {RUNAWAY_MESSAGES[noAttempts - 1]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions Button Row */}
        <div className="relative flex flex-row items-center justify-center gap-6 min-h-[80px] w-full">
          
          {/* YES Button */}
          <motion.button
            id="btn-yes"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYesClick}
            className="px-8 py-3.5 bg-gradient-to-r from-[#ff4f8b] to-[#ff6b9d] hover:from-[#e03b73] hover:to-[#ff4f8b] text-white text-lg font-semibold rounded-full shadow-[0_8px_24px_rgba(255,79,139,0.35)] transition-all duration-250 cursor-pointer z-10 flex items-center gap-2"
          >
            {isTransformed ? "💕 YES" : "Yes 💖"}
          </motion.button>

          {/* RUNAWAY NO Button */}
          <motion.button
            id="btn-no"
            type="button"
            onMouseEnter={isTransformed ? undefined : moveNoButton}
            onHoverStart={isTransformed ? undefined : moveNoButton}
            onClick={isTransformed ? handleYesClick : moveNoButton}
            onTouchStart={isTransformed ? undefined : moveNoButton}
            onFocus={isTransformed ? undefined : moveNoButton}
            animate={{
              x: noPosition.x,
              y: noPosition.y,
            }}
            style={{
              position: "relative",
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 9,
              mass: 0.6,
            }}
            className={`px-8 py-3.5 text-lg font-semibold rounded-full transition-colors duration-250 z-20 outline-none cursor-pointer
              ${isTransformed 
                ? "bg-gradient-to-r from-[#ff4f8b] to-[#ff6b9d] hover:from-[#e03b73] hover:to-[#ff4f8b] text-white shadow-[0_8px_24px_rgba(255,79,139,0.35)]" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              }
              ${hasMoved && !isTransformed ? "shadow-[0_8px_24px_rgba(255,79,139,0.12)]" : ""}
            `}
          >
            {isTransformed ? "💕 YES" : "No"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
