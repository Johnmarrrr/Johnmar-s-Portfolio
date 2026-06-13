import React, { useEffect, useRef, useState } from 'react';
import { ICONS_DATA } from './iconsData';

// Helper to draw a rounded rectangle
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
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

// Helper to replace white SVG fills with dark slate in light mode
const prepareSvgSrc = (svgSrc, theme) => {
  let cleaned = svgSrc;
  if (theme === 'light') {
    // Replace white fill color rgb(255, 255, 255) with slate-900 rgb(15, 23, 42)
    cleaned = cleaned.replace(/rgb\(255,\s*255,\s*255\)/gi, 'rgb(15, 23, 42)');
    cleaned = cleaned.replace(/#ffffff/gi, '#0f172a');
    cleaned = cleaned.replace(/#fff\b/gi, '#0f172a');
  }
  return cleaned;
};

export default function IconCloud() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'dark'
  );

  // Keep track of theme updates via MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      setCurrentTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current || canvas.parentElement;
    
    // Set size responsively
    const size = Math.min(container.clientWidth || 400, 400);
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const radius = size * 0.38;
    const centerX = size / 2;
    const centerY = size / 2;

    // Distribute points evenly on a sphere using Fibonacci sphere algorithm
    const tags = ICONS_DATA.map((icon, index) => {
      const count = ICONS_DATA.length;
      const phi = Math.acos(-1 + (2 * index) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = Math.cos(theta) * Math.sin(phi) * radius;
      const y = Math.sin(theta) * Math.sin(phi) * radius;
      const z = Math.cos(phi) * radius;

      const img = new Image();
      const themedSrc = prepareSvgSrc(icon.src, currentTheme);
      const svgPart = themedSrc.replace('data:image/svg+xml;utf8,', '');
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgPart);

      return {
        x,
        y,
        z,
        img,
        title: icon.title,
        alt: icon.alt,
        loaded: false
      };
    });

    // Handle image onload
    tags.forEach(tag => {
      tag.img.onload = () => {
        tag.loaded = true;
      };
    });

    let rx = 0.002; // initial X rotation speed
    let ry = 0.002; // initial Y rotation speed
    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;
    let hoveredTag = null;
    let animationFrameId;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - centerX;
      mouseY = e.clientY - rect.top - centerY;
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      hoveredTag = null;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left - centerX;
        mouseY = e.touches[0].clientY - rect.top - centerY;
        isHovered = true;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mouseenter', () => { isHovered = true; });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleMouseLeave);

    const animate = () => {
      // Calculate rotation speeds based on mouse position
      if (isHovered) {
        // Target speed is relative to distance from center
        const targetRy = (mouseX / centerX) * 0.015;
        const targetRx = -(mouseY / centerY) * 0.015;
        // Ease into target speed
        ry += (targetRy - ry) * 0.08;
        rx += (targetRx - rx) * 0.08;
      } else {
        // Slow default rotation when not hovered
        ry += (0.0015 - ry) * 0.05;
        rx += (0.0015 - rx) * 0.05;
      }

      // Rotate points
      tags.forEach(tag => {
        // Rotate around Y-axis (horizontal)
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const x1 = tag.x * cosY - tag.z * sinY;
        const z1 = tag.z * cosY + tag.x * sinY;

        // Rotate around X-axis (vertical)
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const y2 = tag.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + tag.y * sinX;

        tag.x = x1;
        tag.y = y2;
        tag.z = z2;
      });

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Perspective scale factor calculation:
      // Depth parameter determines camera view distance
      const depth = size * 0.85;

      // Detect which tag is currently hovered by checking proximity in 2D space
      // We look from front to back (highest z first)
      hoveredTag = null;
      if (isHovered) {
        const sortedFrontToBack = [...tags].sort((a, b) => b.z - a.z);
        for (const tag of sortedFrontToBack) {
          if (!tag.loaded) continue;
          const scale = depth / (depth - tag.z);
          const projX = centerX + tag.x * scale;
          const projY = centerY + tag.y * scale;
          const iconSize = 34 * scale;

          const dx = (mouseX + centerX) - projX;
          const dy = (mouseY + centerY) - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < iconSize / 2 + 6) {
            hoveredTag = tag;
            break;
          }
        }
      }

      // Update cursor pointer
      if (hoveredTag) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'grab';
      }

      // Draw background glow for active accent color if hovered
      // Painter's algorithm: draw background tags first
      const sortedBackToFront = [...tags].sort((a, b) => a.z - b.z);

      sortedBackToFront.forEach(tag => {
        if (!tag.loaded) return;

        const scale = depth / (depth - tag.z);
        const projX = centerX + tag.x * scale;
        const projY = centerY + tag.y * scale;
        const iconSize = 34 * scale;

        // Fading opacity based on depth
        // Front (z = radius) has opacity 1.0, Back (z = -radius) has opacity 0.35
        const opacity = 0.35 + ((tag.z + radius) / (2 * radius)) * 0.65;
        
        ctx.save();
        ctx.globalAlpha = opacity;

        // Draw highlight glow around hovered tag
        if (hoveredTag === tag) {
          ctx.beginPath();
          ctx.arc(projX, projY, iconSize / 2 + 8, 0, Math.PI * 2);
          // Standard transparent blue/indigo glow
          ctx.fillStyle = 'rgba(99, 102, 241, 0.18)';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
          ctx.stroke();
        }

        // Draw the image centered
        ctx.drawImage(
          tag.img,
          projX - iconSize / 2,
          projY - iconSize / 2,
          iconSize,
          iconSize
        );
        ctx.restore();
      });

      // Draw tooltip above hovered tag
      if (hoveredTag) {
        const scale = depth / (depth - hoveredTag.z);
        const projX = centerX + hoveredTag.x * scale;
        const projY = centerY + hoveredTag.y * scale;
        const iconSize = 34 * scale;

        const tooltipText = hoveredTag.title;
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        const textWidth = ctx.measureText(tooltipText).width;
        
        const paddingX = 8;
        const paddingY = 4;
        const textHeight = 11;
        const rectWidth = textWidth + paddingX * 2;
        const rectHeight = textHeight + paddingY * 2;
        const rectX = projX - rectWidth / 2;
        const rectY = projY - iconSize / 2 - rectHeight - 8;

        ctx.save();
        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;

        // Tooltip box background
        ctx.fillStyle = currentTheme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;

        drawRoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, 6);
        ctx.fill();
        ctx.shadowBlur = 0; // turn off shadow for border/text
        ctx.stroke();

        // Tooltip text
        ctx.fillStyle = currentTheme === 'dark' ? '#f8fafc' : '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tooltipText, projX, rectY + rectHeight / 2);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseLeave);
    };
  }, [currentTheme]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full max-w-[400px] aspect-square mx-auto bg-transparent z-10"
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full select-none"
      />
    </div>
  );
}
