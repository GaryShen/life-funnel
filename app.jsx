// Main app — bilingual vintage Life Funnel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "sepia",
  "grainSize": 2.6,
  "density": 60,
  "speed": 1.0,
  "showQuotes": true
}/*EDITMODE-END*/;

const THEMES = {
  sepia: {
    label: "Sepia 沙黃",
    "--paper":    "#ece2cf",
    "--paper-2":  "#ddcfb4",
    "--ink":      "#2b1d10",
    "--ink-soft": "#6b5536",
    "--sand":     "#c8893e",
    "--sand-2":   "#e0a44a",
    "--sand-hl":  "#f5cd7e",
    "--wood":     "#3e2716",
    "--wood-2":   "#5e3a20",
    "--brass":    "#b48946",
    "--brass-2":  "#876028",
    "--accent":   "#9c2a1d",
  },
  parchment: {
    label: "Parchment 羊皮",
    "--paper":    "#f3e8cf",
    "--paper-2":  "#e5d4ad",
    "--ink":      "#3a2410",
    "--ink-soft": "#7a5a32",
    "--sand":     "#a76321",
    "--sand-2":   "#c98336",
    "--sand-hl":  "#ecb45a",
    "--wood":     "#4a2c10",
    "--wood-2":   "#6e4720",
    "--brass":    "#c19550",
    "--brass-2":  "#8c6428",
    "--accent":   "#7a2c1a",
  },
  ledger: {
    label: "Ledger 賬本綠",
    "--paper":    "#dbe2cc",
    "--paper-2":  "#bfc9aa",
    "--ink":      "#1f2618",
    "--ink-soft": "#54614a",
    "--sand":     "#967032",
    "--sand-2":   "#b08840",
    "--sand-hl":  "#dab46c",
    "--wood":     "#28361e",
    "--wood-2":   "#3e4c30",
    "--brass":    "#9a7c3c",
    "--brass-2":  "#6e562a",
    "--accent":   "#7a3622",
  },
  midnight: {
    label: "Midnight 子夜",
    "--paper":    "#1b1814",
    "--paper-2":  "#26221b",
    "--ink":      "#efe6d3",
    "--ink-soft": "#a89a7e",
    "--sand":     "#e6b066",
    "--sand-2":   "#f1c98a",
    "--sand-hl":  "#ffe5b0",
    "--wood":     "#0d0a07",
    "--wood-2":   "#1c160f",
    "--brass":    "#d4a35a",
    "--brass-2":  "#a07a36",
    "--accent":   "#e07a4d",
  },
};

function applyTheme(themeKey) {
  const t = THEMES[themeKey] || THEMES.sepia;
  for (const k of Object.keys(t)) {
    if (k.startsWith("--")) {
      document.documentElement.style.setProperty(k, t[k]);
    }
  }
}

// pretty number with thousands separator
function fmt(n, digits = 0) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function NumField({ labelZh, labelEn, value, unit, min, max, onChange }) {
  return (
    <div className="field">
      <div className="field-label">
        <span className="zh">{labelZh}</span>
        <span className="en">{labelEn}</span>
      </div>
      <div className="num-input">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min} max={max}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") { onChange(""); return; }
            const n = parseInt(v, 10);
            if (!Number.isNaN(n)) onChange(Math.max(min ?? -Infinity, Math.min(max ?? Infinity, n)));
          }}
        />
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
}

function DateField({ labelZh, labelEn, value, onChange, max }) {
  return (
    <div className="field">
      <div className="field-label">
        <span className="zh">{labelZh}</span>
        <span className="en">{labelEn}</span>
      </div>
      <div className="num-input date-input">
        <input
          type="date"
          value={value}
          max={max}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// today's date as YYYY-MM-DD (local time)
function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// default birthday: today minus 28 years
function defaultBirthday() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 28);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// age in years (fractional) from YYYY-MM-DD birthday
function ageFromBirthday(bday) {
  if (!bday) return 0;
  const b = new Date(bday + "T00:00:00");
  if (Number.isNaN(b.getTime())) return 0;
  const diffMs = Date.now() - b.getTime();
  if (diffMs <= 0) return 0;
  return diffMs / (365.25 * 24 * 3600 * 1000);
}

function GenderSeg({ value, onChange }) {
  const opts = [
    { id: "male",    zh: "男", en: "Male" },
    { id: "female",  zh: "女", en: "Female" },
    { id: "neutral", zh: "不分", en: "Avg." },
  ];
  return (
    <div className="field">
      <div className="field-label">
        <span className="zh">性別</span>
        <span className="en">Gender</span>
      </div>
      <div className="seg">
        {opts.map((o) => (
          <button
            key={o.id}
            data-on={value === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.zh}
            <span className="en">{o.en}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ kZh, kEn, v, unitZh, unitEn }) {
  return (
    <div className="stat">
      <div className="k">
        <span className="zh">{kZh}</span>
        <span className="en">{kEn}</span>
      </div>
      <div className="v num">{v}{unitZh && <span className="u">{unitZh}</span>}</div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [birthday, setBirthday] = React.useState(defaultBirthday);
  const [gender, setGender] = React.useState("neutral");
  const [target, setTarget] = React.useState(82);
  const [quoteIdx, setQuoteIdx] = React.useState(0);

  // theme reactive
  React.useEffect(() => { applyTheme(t.theme); }, [t.theme]);

  // rotate quote
  React.useEffect(() => {
    const id = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % (window.QUOTES || []).length);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // numbers — age is derived from birthday (fractional, in years)
  const ageNum = Math.max(0, Math.min(120, ageFromBirthday(birthday)));
  const targetNum = Math.max(ageNum + 0.1, Math.min(120, +target || 80));
  const passed = ageNum / targetNum;
  const remainingYears = Math.max(0, targetNum - ageNum);
  const remainingDays = Math.round(remainingYears * 365.25);
  const remainingHours = Math.round(remainingYears * 365.25 * 24);
  const remainingWeekends = Math.round(remainingYears * 52);
  const pctPassed = passed * 100;

  // current date stamp
  const now = new Date();
  const dStamp = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`;
  const birthYear = birthday ? parseInt(birthday.slice(0, 4), 10) : now.getFullYear() - 28;

  // theme colors for hourglass
  const theme = THEMES[t.theme] || THEMES.sepia;

  const quote = (window.QUOTES || [])[quoteIdx] || {zh:"",en:"",attr:""};

  return (
    <div className="page">

      {/* Stamp */}
      <div className="date-stamp">
        <span className="big">{dStamp}</span>
        EDITION · 第 {now.getFullYear() - 2024 + 1} 版
      </div>

      {/* Masthead */}
      <header className="masthead">
        <div className="mast-l">
          Volume <b className="num">{birthYear}</b><br/>
          Issued upon a finite life
        </div>
        <div className="mast-c">
          <h1 className="title-zh">人 生 漏 斗</h1>
          <div className="title-en">— The Life Funnel —</div>
          <div className="ornament">
            <hr/> Memento Mori <hr/>
          </div>
        </div>
        <div className="mast-r">
          A daily reckoning<br/>
          <b>每 日 之 計</b>
        </div>
      </header>

      <div className="main">

        {/* LEFT — input */}
        <aside>
          <section className="panel">
            <h2 className="panel-title">您的座標 <span className="en">Your Coordinates</span></h2>
            <hr className="panel-rule" />
            <DateField labelZh="出生年月日" labelEn="Date of birth"
              value={birthday} max={todayISO()}
              onChange={setBirthday}/>
            <div style={{fontSize:11, color:"var(--ink-soft)", letterSpacing:".06em", lineHeight:1.5, margin:"-10px 0 14px"}}>
              <span className="zh">目前 </span>
              <b className="num" style={{color:"var(--ink)"}}>{fmt(ageNum, 2)}</b>
              <span className="zh"> 歲 · </span>
              <span className="eng">{fmt(ageNum, 2)} years old</span>
            </div>
            <GenderSeg value={gender} onChange={(g) => {
              setGender(g);
              // gentle nudge target value based on rough averages
              if (target === 82 || target === 78 || target === 84 || target === 80) {
                if (g === "male") setTarget(78);
                else if (g === "female") setTarget(84);
                else setTarget(82);
              }
            }}/>
            <NumField labelZh="目標壽命" labelEn="Target lifespan"
              value={target} unit="歲 / yrs" min={1} max={120}
              onChange={setTarget}/>
            <div style={{fontSize:11, color:"var(--ink-soft)", letterSpacing:".08em", lineHeight:1.5, marginTop:6}}>
              <span className="zh">參考：台灣男性平均約 77 · 女性約 84。</span><br/>
              <span className="eng">Ref: TW avg ≈ 77 (M) / 84 (F).</span>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">本日結算 <span className="en">Today's Tally</span></h2>
            <hr className="panel-rule dashed" />
            <Stat kZh="已過歲月" kEn="Years lived"
              v={fmt(ageNum, 2)} unitZh="年" />
            <Stat kZh="剩餘歲月" kEn="Years left"
              v={fmt(remainingYears, 1)} unitZh="年" />
            <Stat kZh="已過比例" kEn="Spent"
              v={fmt(pctPassed, 1) + "%"} />
          </section>
        </aside>

        {/* CENTER — quote + hourglass (quote sits above the glass) */}
        <main className="hourglass-col">
          {t.showQuotes && (
            <div className="quote-block quote-top">
              <p className="quote-zh">「{quote.zh}」</p>
              <p className="quote-en">"{quote.en}"</p>
              <div className="quote-attr">— {quote.attr} —</div>
            </div>
          )}

          <Hourglass
            passedRatio={passed}
            sandDensity={t.density}
            grainSize={t.grainSize}
            speedFactor={t.speed}
            demoSpeed={0}
            sandColor={theme["--sand"]}
            sandHl={theme["--sand-hl"]}
            woodColor={theme["--wood"]}
            brassColor={theme["--brass"]}
          />
          <div className="hg-caption">
            <span><b>上：餘命</b> · Top: remaining</span>
            <span>已 <b className="num">{fmt(pctPassed, 1)}%</b></span>
            <span><b>下：流逝</b> · Bottom: spent</span>
          </div>
        </main>

        {/* RIGHT — stats */}
        <aside>
          <section className="panel">
            <h2 className="panel-title">餘下時光 <span className="en">What Remains</span></h2>
            <hr className="panel-rule" />
            <Stat kZh="天數" kEn="Days" v={fmt(remainingDays)} unitZh="日"/>
            <Stat kZh="小時數" kEn="Hours" v={fmt(remainingHours)} unitZh="小時"/>
            <Stat kZh="週末" kEn="Weekends" v={fmt(remainingWeekends)} unitZh="次"/>

            <div className="pct-wrap" style={{marginTop:18}}>
              <div className="field-label" style={{margin:0}}>
                <span className="zh">人生進度</span>
                <span className="en">Life progress</span>
              </div>
              <div className="pct-bar" style={{marginTop:8}}>
                <div className="pct-bar-fill" style={{ width: `${Math.min(100, Math.max(0, pctPassed))}%` }}/>
              </div>
              <div className="pct-row">
                <span><span className="num">{fmt(pctPassed,1)}</span>% spent</span>
                <span><span className="num">{fmt(100 - pctPassed,1)}</span>% left</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">提醒 <span className="en">Reminders</span></h2>
            <hr className="panel-rule dashed" />
            <div style={{fontSize:13, lineHeight:1.65, color:"var(--ink)"}}>
              <p className="zh" style={{margin:"0 0 8px"}}>
                · 若父母 60 歲，每年見 2 次，約剩 <b className="num">{Math.max(0, (85 - 60) * 2)}</b> 次面。
              </p>
              <p className="zh" style={{margin:"0 0 8px"}}>
                · 你每天還能讀約 <b className="num">{fmt(Math.round(remainingDays * 0.5))}</b> 頁書。
              </p>
              <p className="zh" style={{margin:0}}>
                · 與所愛之人共度的清晨，僅約 <b className="num">{fmt(remainingDays)}</b> 個。
              </p>
            </div>
          </section>
        </aside>
      </div>

      <footer className="footer">
        <span>Printed in this very moment</span>
        <span>· {dStamp} ·</span>
        <span>No. <span className="num">{Math.round(passed * 10000)}</span> / 10,000</span>
      </footer>

      <TweaksPanel title="Tweaks · 調整">
        <TweakSection label="Theme · 主題" />
        <TweakRadio
          label="Palette"
          value={t.theme}
          options={[
            { value: "sepia",     label: "Sepia" },
            { value: "parchment", label: "Parch." },
            { value: "ledger",    label: "Ledger" },
            { value: "midnight",  label: "Night" },
          ]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakSection label="Sand · 沙粒" />
        <TweakSlider
          label="Grain size 沙粒大小"
          value={t.grainSize} min={1} max={5} step={0.2} unit="px"
          onChange={(v) => setTweak("grainSize", v)}
        />
        <TweakSlider
          label="Density 密度"
          value={t.density} min={10} max={200} step={5} unit="/s"
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSlider
          label="Speed 速度"
          value={t.speed} min={0.3} max={2.5} step={0.1} unit="×"
          onChange={(v) => setTweak("speed", v)}
        />
        <TweakSection label="Layout · 版面" />
        <TweakToggle
          label="Show quotes 顯示箴言"
          value={t.showQuotes}
          onChange={(v) => setTweak("showQuotes", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
