import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Utensils, Copy, Check, Heart, Download, Share2, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface PageSummaryProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedFoods: string[];
  onReset: () => void;
}

export const PageSummary: React.FC<PageSummaryProps> = ({
  selectedDate,
  selectedTime,
  selectedFoods,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Time slot mappings
  const timeMap: Record<string, { label: string; desc: string }> = {
    morning: { label: "Morning ☀️", desc: "Coffee & sunshine" },
    afternoon: { label: "Afternoon 🌤️", desc: "Lunch & stroll" },
    evening: { label: "Evening 🌙", desc: "Dinner & vibes" },
    "late-night": { label: "Late Night ✨", desc: "Drinks & stars" },
  };

  // Food item mappings
  const foodMap: Record<string, { label: string; emoji: string }> = {
    biryani: { label: "Biryani Bliss", emoji: "🍛" },
    kfc: { label: "KFC Chicken", emoji: "🍗" },
    pizza: { label: "Cheesy Pizza", emoji: "🍕" },
    momos: { label: "Steamy Momos", emoji: "🥟" },
    curry: { label: "Curry & Naan", emoji: "🥘" },
    dosa: { label: "Masala Dosa", emoji: "🥞" },
    chaat: { label: "Golgappa & Chaat", emoji: "🥙" },
    chai: { label: "Chai & Snacks", emoji: "☕" },
  };

  // Continuous Confetti for 8 seconds on component mount
  useEffect(() => {
    // Trigger initial celebration burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4f8b", "#ff85a7", "#fca5a5", "#ffffff"],
    });

    const duration = 8 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40;
      // Spawn side confetti showers
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#ff4f8b", "#ff85a7", "#ffffff"],
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#ff4f8b", "#ff85a7", "#ffffff"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date | null): string => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeId: string | null): string => {
    if (!timeId || !timeMap[timeId]) return "Not selected";
    const slot = timeMap[timeId];
    return `${slot.label} (${slot.desc})`;
  };

  const getFoodString = (): string => {
    if (selectedFoods.length === 0) return "None selected";
    return selectedFoods
      .map((id) => {
        const item = foodMap[id];
        return item ? `${item.emoji} ${item.label}` : id;
      })
      .join(", ");
  };

  const getSummaryText = (): string => {
    const dateText = formatDate(selectedDate);
    const timeText = formatTime(selectedTime);
    const foodText = getFoodString();

    return `💖 It's a Date! 💖\n\n📅 Date: ${dateText}\n⏰ Time: ${timeText}\n🍽️ Food: ${foodText}\n\nThank you for saying yes, Ritu ❤️\nMinhaz can't wait to spend this special day with you. Let's enjoy good food, lots of smiles, and create beautiful memories together. 🌹✨`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSummaryText()).then(() => {
      setCopied(true);
      // Small sparkle confetti on copy
      confetti({
        particleCount: 30,
        spread: 40,
        colors: ["#ff4f8b", "#ffffff"],
      });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = () => {
    const shareData = {
      title: "Our Date Invitation 💖",
      text: getSummaryText(),
      url: window.location.href,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          setShared(true);
          setTimeout(() => setShared(false), 2000);
        })
        .catch((err) => console.log("Error sharing", err));
    } else {
      // Fallback: Copy to clipboard and show feedback
      navigator.clipboard.writeText(getSummaryText()).then(() => {
        setShared(true);
        confetti({
          particleCount: 30,
          spread: 45,
          colors: ["#ff4f8b", "#ffffff"],
        });
        setTimeout(() => setShared(false), 2500);
      });
    }
  };

  // Draw a premium greeting card image on HTML Canvas and download it
  const handleDownloadCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1050;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient: romantic soft pink to white
    const gradient = ctx.createLinearGradient(0, 0, 800, 1050);
    gradient.addColorStop(0, "#fff0f3");
    gradient.addColorStop(0.5, "#ffe3e8");
    gradient.addColorStop(1, "#ffd6df");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 1050);

    // Decorative background heart shapes
    ctx.fillStyle = "rgba(255, 79, 139, 0.07)";
    ctx.font = "120px serif";
    ctx.fillText("❤️", 80, 200);
    ctx.fillText("💖", 680, 160);
    ctx.fillText("💕", 120, 880);
    ctx.fillText("🌹", 660, 840);

    // Card shadow
    ctx.shadowColor = "rgba(255, 79, 139, 0.12)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 16;

    // Draw main card body (glass look)
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    roundRect(ctx, 80, 80, 640, 890, 36);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Card border
    ctx.strokeStyle = "rgba(255, 79, 139, 0.15)";
    ctx.lineWidth = 2;
    roundRect(ctx, 80, 80, 640, 890, 36);
    ctx.stroke();

    // Soft pink circle for top heart icon
    ctx.fillStyle = "rgba(255, 79, 139, 0.1)";
    ctx.beginPath();
    ctx.arc(400, 185, 48, 0, Math.PI * 2);
    ctx.fill();

    // Heart Emoji in circle
    ctx.font = "44px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💖", 400, 185);

    // Title: It's a Date!
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("It's a Date! 💖", 400, 275);

    // Subtitle
    ctx.font = "600 22px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("I'm so excited! Here's our plan:", 400, 320);

    // Draw slots for Date, Time, and Food
    const dateText = formatDate(selectedDate);
    const timeText = formatTime(selectedTime);
    const foodsList = selectedFoods.map((id) => {
      const item = foodMap[id];
      return item ? `${item.emoji} ${item.label}` : id;
    });

    let yOffset = 380;

    const drawSlot = (title: string, content: string, icon: string) => {
      // Row box background
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.strokeStyle = "rgba(255, 79, 139, 0.08)";
      ctx.lineWidth = 1.5;
      roundRect(ctx, 120, yOffset, 560, 92, 20);
      ctx.fill();
      ctx.stroke();

      // Icon Emoji
      ctx.font = "36px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(icon, 150, yOffset + 46);

      // Section title header
      ctx.font = "bold 13px sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(title.toUpperCase(), 210, yOffset + 34);

      // Content text
      ctx.font = "bold 19px sans-serif";
      ctx.fillStyle = "#334155";
      if (ctx.measureText(content).width > 420) {
        ctx.font = "bold 15px sans-serif";
      }
      ctx.fillText(content, 210, yOffset + 62);

      yOffset += 112;
    };

    drawSlot("Selected Date", dateText, "📅");
    drawSlot("Selected Time", timeText, "🕒");

    const foodContent = foodsList.join(", ");
    drawSlot("Menu & Vibe", foodContent, "🍽️");

    // Special message
    yOffset += 24;
    ctx.fillStyle = "#334155";
    ctx.textAlign = "center";
    ctx.font = "italic 20px Georgia, serif";

    const msgLines = [
      "Thank you for saying yes, Ritu ❤️",
      "",
      "Minhaz can't wait to spend this special day with you.",
      "",
      "Let's enjoy good food, lots of smiles,",
      "and create beautiful memories together. 🌹✨",
    ];

    msgLines.forEach((line) => {
      if (line === "") {
        yOffset += 12;
      } else {
        ctx.fillText(line, 400, yOffset);
        yOffset += 28;
      }
    });

    // Draw elegant signature
    ctx.font = "600 14px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Made with ❤️ by Minhaz", 400, 930);

    // Save canvas to link & download
    const link = document.createElement("a");
    link.download = `Ritu_Minhaz_Date_Details.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -15 }}
      transition={{ duration: 0.7, type: "spring", bounce: 0.18 }}
      className="flex flex-col items-center w-full max-w-xl px-4 py-4 md:py-8 z-10 select-none"
    >
      {/* Center Glassmorphism Card */}
      <div className="w-full bg-white/75 backdrop-blur-md border border-white/50 shadow-[0_20px_50px_rgba(255,79,139,0.12)] rounded-[32px] p-6 md:p-10 flex flex-col items-center text-center">
        
        {/* Soft pink circle with Heart Icon */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="w-16 h-16 bg-pink-100/60 rounded-full flex items-center justify-center text-[#ff4f8b] mb-6 shadow-[0_6px_16px_rgba(255,79,139,0.1)]"
        >
          <Heart className="w-8 h-8 fill-current text-[#ff4f8b]" />
        </motion.div>

        {/* Headings */}
        <h2 className="font-serif font-black text-4xl text-gray-800 mb-2 tracking-tight">
          It's a Date! 💖
        </h2>
        <p className="font-sans font-bold text-gray-400 text-sm mb-8">
          I'm so excited! Here's our plan:
        </p>

        {/* DATE SUMMARY CARD */}
        <div className="w-full space-y-4 mb-8 text-left">
          
          {/* Selected Date */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-pink-50/50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-100/40 text-[#ff4f8b] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Selected Date
              </span>
              <span className="block text-gray-700 font-bold text-base md:text-lg mt-0.5">
                {formatDate(selectedDate)}
              </span>
            </div>
          </div>

          {/* Selected Time */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-pink-50/50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-100/40 text-[#ff4f8b] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Selected Time
              </span>
              <span className="block text-gray-700 font-bold text-base md:text-lg mt-0.5">
                {formatTime(selectedTime)}
              </span>
            </div>
          </div>

          {/* Menu & Vibe */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-pink-50/50 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-100/40 text-[#ff4f8b] flex items-center justify-center flex-shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Menu & Vibe
              </span>
              <span className="block text-gray-700 font-bold text-base md:text-lg mt-0.5 leading-relaxed">
                {getFoodString()}
              </span>
            </div>
          </div>
        </div>

        {/* Special Message Box */}
        <div className="w-full border-t border-b border-pink-100/60 py-6 mb-8 text-center text-gray-600 font-serif italic text-base md:text-lg leading-relaxed space-y-4">
          <p>Thank you for saying yes, Ritu ❤️</p>
          <p>Minhaz can't wait to spend this special day with you.</p>
          <p>Let's enjoy good food, lots of smiles, and create beautiful memories together. 🌹✨</p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* Copy Date Details */}
          <motion.button
            id="btn-copy-date"
            onClick={handleCopy}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(255, 79, 139, 0.25)" }}
            whileTap={{ scale: 0.97 }}
            className={`py-3.5 px-6 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border
              ${
                copied
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50/30"
              }
            `}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3px]" /> Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" /> Copy Date Details
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Download Date Card */}
          <motion.button
            id="btn-download-card"
            onClick={handleDownloadCard}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(255, 79, 139, 0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="py-3.5 px-6 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-[#ff4f8b] to-[#ff7fa9] text-white transition-all duration-300 shadow-[0_4px_16px_rgba(255,79,139,0.2)]"
          >
            <Download className="w-4 h-4" /> Download Date Card
          </motion.button>

          {/* Share Invitation */}
          <motion.button
            id="btn-share-invitation"
            onClick={handleShare}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(255, 79, 139, 0.25)" }}
            whileTap={{ scale: 0.97 }}
            className={`py-3.5 px-6 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border
              ${
                shared
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50/30"
              }
            `}
          >
            <Share2 className="w-4 h-4" /> {shared ? "Shared invitation!" : "Share Invitation"}
          </motion.button>

          {/* Start Again */}
          <motion.button
            id="btn-start-again"
            onClick={onReset}
            whileHover={{ scale: 1.03, border: "1px solid rgba(255,79,139,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="py-3.5 px-6 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer bg-white border border-gray-200 text-gray-500 hover:text-pink-500 hover:bg-pink-50/10 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" /> Start Again
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
