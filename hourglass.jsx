// Hourglass — SVG draws everything static (glass, frame, AND the two sand
// piles). A canvas overlay draws ONLY the animated falling particles. Putting
// the piles in SVG guarantees they share the exact coordinate system as the
// glass cavity, so they can never drift sideways from the walls.

const HG = {
  W: 620, H: 1000,
  capH: 24,
  rodW: 6,
  frameInset: 36,
  neckY: 500,
  neckHalf: 22,
  glassTop: 50,
  glassBot: 950,
};

function hgXAtY(y) {
  const { glassTop, glassBot, neckY, frameInset, neckHalf, W } = HG;
  const halfMax = W / 2 - frameInset;
  if (y <= neckY) {
    const t = (y - glassTop) / (neckY - glassTop);
    return halfMax * (1 - t) + neckHalf * t;
  } else {
    const t = (y - neckY) / (glassBot - neckY);
    return neckHalf * (1 - t) + halfMax * t;
  }
}

// Build the SVG path string for the TOP sand pile.
// Sand fills the top chamber up to a surface line. Surface is flat from
// each wall in to a central concave dip.
function topPilePath(passed) {
  const remaining = Math.max(0, Math.min(1, 1 - passed));
  if (remaining <= 0.001) return "";
  const topRangeH = HG.neckY - HG.glassTop;
  const sandLineY = HG.neckY - topRangeH * remaining;
  const halfAtLine = hgXAtY(sandLineY);
  const cx = HG.W / 2;
  const dipHalfW = Math.max(30, halfAtLine * 0.5);
  const dipDepth = Math.min(26, (HG.neckY - sandLineY) * 0.22 + 6);

  const left  = cx - halfAtLine;
  const right = cx + halfAtLine;
  const dipL  = cx - dipHalfW;
  const dipR  = cx + dipHalfW;

  return [
    `M ${cx - HG.neckHalf} ${HG.neckY}`,
    `L ${left} ${sandLineY}`,
    `L ${dipL} ${sandLineY}`,
    `Q ${cx} ${sandLineY + dipDepth} ${dipR} ${sandLineY}`,
    `L ${right} ${sandLineY}`,
    `L ${cx + HG.neckHalf} ${HG.neckY}`,
    `Z`,
  ].join(" ");
}

// SVG path for the BOTTOM sand mound — a rounded cone with a peak.
function botPilePath(passed) {
  const filled = Math.max(0, Math.min(1, passed));
  if (filled <= 0.001) return "";
  const botRangeH = HG.glassBot - HG.neckY;
  const moundH = botRangeH * filled;
  const sandLineY = HG.glassBot - moundH;
  const halfAtLine = hgXAtY(sandLineY);
  const moundHalf = Math.min(halfAtLine, 50 + moundH * 0.5);
  const peakLift = Math.min(40, moundH * 0.28 + 12);
  const peakY = Math.max(HG.neckY + 24, sandLineY - peakLift);
  const cx = HG.W / 2;

  // outline: floor → up left wall to sandLineY → mound left base → peak curve → mound right base → down right wall → floor
  return [
    `M ${cx - hgXAtY(HG.glassBot)} ${HG.glassBot}`,
    `L ${cx - halfAtLine} ${sandLineY}`,
    `L ${cx - moundHalf} ${sandLineY}`,
    `Q ${cx} ${peakY} ${cx + moundHalf} ${sandLineY}`,
    `L ${cx + halfAtLine} ${sandLineY}`,
    `L ${cx + hgXAtY(HG.glassBot)} ${HG.glassBot}`,
    `Z`,
  ].join(" ");
}

// Position of the bottom-mound surface at a given x (used by particle physics
// so grains splash onto the actual mound shape).
function botSurfaceY(x, passed) {
  const filled = Math.max(0, Math.min(1, passed));
  const botRangeH = HG.glassBot - HG.neckY;
  const moundH = botRangeH * filled;
  const sandLineY = HG.glassBot - moundH;
  const halfAtLine = hgXAtY(sandLineY);
  const moundHalf = Math.min(halfAtLine, 50 + moundH * 0.5);
  const peakLift = Math.min(40, moundH * 0.28 + 12);
  const peakY = Math.max(HG.neckY + 24, sandLineY - peakLift);
  const cx = HG.W / 2;
  const adx = Math.abs(x - cx);
  if (adx <= moundHalf) {
    // approximate the quadratic peak by simple parabola for collision
    const t = adx / Math.max(moundHalf, 1);
    return peakY + (sandLineY - peakY) * (t * t);
  }
  return HG.glassBot - 2;
}

function Hourglass({ passedRatio, sandDensity, grainSize, speedFactor, demoSpeed, sandColor, sandHl, woodColor, brassColor }) {
  const canvasRef = React.useRef(null);     // falling-particle layer
  const accumRef  = React.useRef(null);     // persistent accumulation paint layer (never cleared between frames)
  const rafRef = React.useRef(0);
  const particlesRef = React.useRef([]);
  const lastTRef = React.useRef(0);
  const emitAccRef = React.useRef(0);
  // visual bonus accumulation that decays once it tops out — lets the user
  // SEE grains stack on the mound even though real-life passedRatio barely
  // moves per second.
  const bonusRef = React.useRef(0);
  const propsRef = React.useRef({});
  propsRef.current = { passedRatio, sandDensity, grainSize, speedFactor, demoSpeed, sandColor, sandHl };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const accum  = accumRef.current;
    if (!canvas || !accum) return;
    const ctx = canvas.getContext("2d");
    const actx = accum.getContext("2d");

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width  * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w; canvas.height = h;
      accum.width  = w; accum.height  = h;
      actx.clearRect(0, 0, w, h);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw(dt) {
      const p = propsRef.current;
      const sx = canvas.width  / HG.W;
      const sy = canvas.height / HG.H;

      // advance bonus accumulation: visual fill on top of base passedRatio.
      // 1 unit of demoSpeed ≈ visibly fill the remaining sand over ~30 s.
      const remainingNow = Math.max(0, 1 - p.passedRatio);
      bonusRef.current += dt * (p.demoSpeed || 0) / 30;
      if (bonusRef.current >= remainingNow) bonusRef.current = 0; // recycle
      const effectivePassed = Math.min(0.9999, p.passedRatio + bonusRef.current);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(sx, 0, 0, sy, 0, 0);

      // also set transform on the accumulation canvas (it persists between frames)
      actx.setTransform(sx, 0, 0, sy, 0, 0);
      // gently fade the accumulation paint so it doesn't saturate — uses identity-space op
      actx.setTransform(1, 0, 0, 1, 0, 0);
      actx.globalCompositeOperation = "destination-out";
      actx.fillStyle = "rgba(0,0,0,0.012)";
      actx.fillRect(0, 0, accum.width, accum.height);
      actx.globalCompositeOperation = "source-over";
      actx.setTransform(sx, 0, 0, sy, 0, 0);

      // Emit grains
      const topRemaining = 1 - effectivePassed;
      emitAccRef.current += dt * p.sandDensity * p.speedFactor;
      while (emitAccRef.current >= 1 && topRemaining > 0.001 && effectivePassed < 0.9995) {
        emitAccRef.current -= 1;
        const px = HG.W/2 + (Math.random() - 0.5) * (HG.neckHalf * 1.2);
        const py = HG.neckY - 6 - Math.random() * 8;
        particlesRef.current.push({
          x: px, y: py,
          vx: (Math.random() - 0.5) * 14,
          vy: 90 + Math.random() * 70,
          size: p.grainSize * (0.7 + Math.random() * 0.7),
          life: 0,
          color: Math.random() < 0.2 ? p.sandHl : p.sandColor,
        });
      }

      const grav = 1200 * p.speedFactor;
      const surviving = [];
      for (const g of particlesRef.current) {
        g.vy += grav * dt;
        g.x  += g.vx * dt;
        g.y  += g.vy * dt;
        g.life += dt;

        const surfY = botSurfaceY(g.x, effectivePassed);
        if (g.y >= surfY - 1) {
          // paint a permanent grain onto the accumulation canvas — DISABLED
          // (looked floaty). Falling grains just disappear into the mound.
          if (false) {
            actx.fillStyle = g.color;
            actx.beginPath();
            actx.arc(g.x, surfY - g.size * 0.4, g.size, 0, Math.PI * 2);
            actx.fill();
          }
          if (g.life > 0.05 && Math.random() < 0.4) {
            const dirSign = (g.x - HG.W/2) >= 0 ? 1 : -1;
            for (let k = 0; k < 1 + Math.floor(Math.random()*2); k++) {
              surviving.push({
                x: g.x, y: surfY - 2,
                vx: dirSign * (60 + Math.random() * 140),
                vy: -110 - Math.random() * 70,
                size: g.size * 0.7,
                life: 0,
                color: g.color,
              });
            }
          }
          continue;
        }
        if (g.y > HG.glassBot - 2) continue;
        // walls: stop if outside the chamber width at this y
        const cx = HG.W/2;
        const wallHalf = hgXAtY(Math.max(HG.glassTop, Math.min(HG.glassBot, g.y)));
        if (Math.abs(g.x - cx) > wallHalf - 1) {
          g.x = cx + Math.sign(g.x - cx) * (wallHalf - 1);
          g.vx *= -0.4;
        }
        surviving.push(g);
      }
      particlesRef.current = surviving;
      if (particlesRef.current.length > 900) {
        particlesRef.current.splice(0, particlesRef.current.length - 900);
      }

      for (const g of particlesRef.current) {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop(t) {
      const last = lastTRef.current || t;
      let dt = (t - last) / 1000;
      if (dt > 0.1) dt = 0.1;
      lastTRef.current = t;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  const topPath = topPilePath(passedRatio);
  const botPath = botPilePath(passedRatio);

  return (
    <div className="hourglass-frame">
      <svg className="silhouette" viewBox={`0 0 ${HG.W} ${HG.H}`} preserveAspectRatio="xMidYMid meet" style={{ zIndex: 2 }}>
        <defs>
          <linearGradient id="wood-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={woodColor}/>
            <stop offset="0.5" stopColor={woodColor} stopOpacity="0.82"/>
            <stop offset="1" stopColor={woodColor}/>
          </linearGradient>
          <linearGradient id="brass-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={brassColor}/>
            <stop offset="0.5" stopColor="#e3b873"/>
            <stop offset="1" stopColor={brassColor}/>
          </linearGradient>
          <linearGradient id="glass-shine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0"    stopColor="#ffffff" stopOpacity="0.05"/>
            <stop offset="0.25" stopColor="#ffffff" stopOpacity="0.22"/>
            <stop offset="0.5"  stopColor="#ffffff" stopOpacity="0.0"/>
            <stop offset="0.75" stopColor="#ffffff" stopOpacity="0.12"/>
            <stop offset="1"    stopColor="#ffffff" stopOpacity="0.0"/>
          </linearGradient>
          <linearGradient id="sand-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={sandHl}/>
            <stop offset="0.18" stopColor={sandColor}/>
            <stop offset="1" stopColor={sandColor}/>
          </linearGradient>
          <linearGradient id="sand-grad-bot" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={sandHl}/>
            <stop offset="0.25" stopColor={sandColor}/>
            <stop offset="1" stopColor={sandColor} stopOpacity="0.92"/>
          </linearGradient>
          {/* Grain texture — tiny stippled dots overlaid on sand fills so the
              piles read as granular rather than as solid blocks. */}
          <pattern id="sand-grain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="transparent"/>
            <circle cx="1.2" cy="1.5" r="0.9" fill="rgba(0,0,0,0.22)"/>
            <circle cx="4.2" cy="3.4" r="0.7" fill="rgba(255,230,180,0.35)"/>
            <circle cx="2.8" cy="4.8" r="0.55" fill="rgba(0,0,0,0.16)"/>
            <circle cx="5.1" cy="0.8" r="0.5" fill="rgba(0,0,0,0.12)"/>
          </pattern>
          <clipPath id="cavity">
            <path d={`
              M ${HG.frameInset} ${HG.glassTop}
              L ${HG.W/2 - HG.neckHalf} ${HG.neckY}
              L ${HG.frameInset} ${HG.glassBot}
              L ${HG.W - HG.frameInset} ${HG.glassBot}
              L ${HG.W/2 + HG.neckHalf} ${HG.neckY}
              L ${HG.W - HG.frameInset} ${HG.glassTop}
              Z
            `}/>
          </clipPath>
        </defs>

        {/* Inside-cavity content: glass tint, shine, and the static sand piles */}
        <g clipPath="url(#cavity)">
          <rect x="0" y="0" width={HG.W} height={HG.H} fill="rgba(255,240,200,0.04)"/>
          <rect x={HG.frameInset + 14} y={HG.glassTop} width={HG.W - 2*(HG.frameInset+14)} height={HG.H} fill="url(#glass-shine)"/>
          {topPath && <path d={topPath} fill="url(#sand-grad)"/>}
          {topPath && <path d={topPath} fill="url(#sand-grain)" style={{mixBlendMode:"multiply",opacity:0.85}}/>}
          {botPath && <path d={botPath} fill="url(#sand-grad-bot)"/>}
          {botPath && <path d={botPath} fill="url(#sand-grain)" style={{mixBlendMode:"multiply",opacity:0.85}}/>}
        </g>

        {/* Glass outline */}
        <path
          d={`
            M ${HG.frameInset} ${HG.glassTop}
            L ${HG.W/2 - HG.neckHalf} ${HG.neckY}
            L ${HG.frameInset} ${HG.glassBot}
            M ${HG.W - HG.frameInset} ${HG.glassTop}
            L ${HG.W/2 + HG.neckHalf} ${HG.neckY}
            L ${HG.W - HG.frameInset} ${HG.glassBot}
          `}
          stroke="rgba(40,20,5,0.55)" strokeWidth="1.5" fill="none"
        />

        {/* Top cap */}
        <rect x="0" y={HG.glassTop - HG.capH} width={HG.W} height={HG.capH} fill="url(#wood-grad)" />
        <rect x="0" y={HG.glassTop - HG.capH} width={HG.W} height="4" fill="rgba(0,0,0,0.3)" />
        <rect x="0" y={HG.glassTop - 6} width={HG.W} height="6" fill="rgba(0,0,0,0.25)" />
        <rect x={HG.W/2 - 60} y={HG.glassTop - HG.capH - 14} width="120" height="14" fill="url(#brass-grad)"/>
        <rect x={HG.W/2 - 80} y={HG.glassTop - HG.capH - 22} width="160" height="8"  fill="url(#wood-grad)"/>
        <rect x={HG.W/2 - 26} y={HG.glassTop - HG.capH - 38} width="52"  height="16" fill="url(#brass-grad)"/>
        <rect x={HG.W/2 - 8}  y={HG.glassTop - HG.capH - 52} width="16"  height="14" fill="url(#wood-grad)"/>

        {/* Bottom cap */}
        <rect x="0" y={HG.glassBot} width={HG.W} height={HG.capH} fill="url(#wood-grad)" />
        <rect x="0" y={HG.glassBot} width={HG.W} height="4" fill="rgba(255,255,255,0.18)" />
        <rect x="0" y={HG.glassBot + HG.capH - 4} width={HG.W} height="4" fill="rgba(0,0,0,0.3)" />
        <rect x={HG.W/2 - 60}  y={HG.glassBot + HG.capH}      width="120" height="14" fill="url(#brass-grad)"/>
        <rect x={HG.W/2 - 80}  y={HG.glassBot + HG.capH + 14} width="160" height="8"  fill="url(#wood-grad)"/>
        <rect x={HG.W/2 - 100} y={HG.glassBot + HG.capH + 22} width="200" height="12" fill="url(#wood-grad)"/>
        <rect x={HG.W/2 - 100} y={HG.glassBot + HG.capH + 32} width="200" height="3"  fill="rgba(0,0,0,0.35)"/>

        {/* Side rods */}
        {[[22, HG.glassTop - HG.capH], [HG.W - 22 - HG.rodW, HG.glassTop - HG.capH]].map(([x, y], i) => (
          <g key={i}>
            <rect x={x} y={y} width={HG.rodW} height={HG.glassBot - HG.glassTop + 2*HG.capH} fill="url(#brass-grad)"/>
            <rect x={x - 2} y={HG.glassTop - HG.capH + 8} width={HG.rodW + 4} height="6" fill={brassColor}/>
            <rect x={x - 2} y={HG.glassBot + HG.capH - 14} width={HG.rodW + 4} height="6" fill={brassColor}/>
          </g>
        ))}

        {/* Neck collar */}
        <rect x={HG.W/2 - HG.neckHalf - 14} y={HG.neckY - 5} width={(HG.neckHalf + 14) * 2} height="10" fill="url(#brass-grad)"/>
      </svg>

      <canvas ref={accumRef} className="sand" style={{ display: "none" }} />
      <canvas ref={canvasRef} className="sand" style={{ zIndex: 3 }} />
    </div>
  );
}

window.Hourglass = Hourglass;
