import React, { useEffect } from "react";

export const CursorHearts: React.FC = () => {
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    const minDistance = 25; // minimum pixels moved to spawn a new heart

    const createHeart = (x: number, y: number) => {
      const heart = document.createElement("div");
      heart.className = "cursor-heart-particle";

      // Random sizes (12px to 28px) and rotations
      const size = 12 + Math.random() * 16;
      const startRotation = (Math.random() - 0.5) * 40; // -20 to 20 deg
      const colors = ["#ff4f8b", "#ff7ba6", "#fca5a5", "#ff2e7a", "#ff9bb9"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Elegant SVG heart structure
      heart.innerHTML = `
        <svg viewBox="0 0 24 24" fill="${color}" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(255, 79, 139, 0.25))">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `;

      // Assign initial styling (fixed at coordinate position)
      heart.style.position = "fixed";
      heart.style.left = `${x - size / 2}px`;
      heart.style.top = `${y - size / 2}px`;
      heart.style.width = `${size}px`;
      heart.style.height = `${size}px`;
      heart.style.pointerEvents = "none";
      heart.style.zIndex = "9999";
      heart.style.transform = `rotate(${startRotation}deg)`;
      heart.style.opacity = "1";
      heart.style.transition = "all 0.9s cubic-bezier(0.08, 0.75, 0.35, 1)";

      document.body.appendChild(heart);

      // Trigger animation on next paint loop
      requestAnimationFrame(() => {
        // Fall down slightly, drift sideways, shrink, and fade out
        const drift = (Math.random() - 0.5) * 70; // drift left/right
        const drop = 60 + Math.random() * 80; // fall down
        const endRotation = startRotation + (Math.random() - 0.5) * 80;

        heart.style.transform = `translate(${drift}px, ${drop}px) rotate(${endRotation}deg) scale(0.2)`;
        heart.style.opacity = "0";
      });

      // Clear from document
      setTimeout(() => {
        heart.remove();
      }, 900);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (distance < minDistance) return;

      lastX = e.clientX;
      lastY = e.clientY;
      createHeart(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const distance = Math.hypot(touch.clientX - lastX, touch.clientY - lastY);
      if (distance < minDistance) return;

      lastX = touch.clientX;
      lastY = touch.clientY;
      createHeart(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
};
