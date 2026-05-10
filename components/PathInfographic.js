"use client";
import { useState, useEffect } from "react";

// ─── data ────────────────────────────────────────────────────────────────────

const TAB_LABELS = {
  searching: "Looking for the right marketer",
  delegated: "Handed it to an agency",
  sales: "Sales aren't where I want them",
};

const SEARCHING_STEPS = [
  {
    num: "01",
    title: "The uncomfortable question call",
    body: "Before I touch anything, we spend 60 minutes on one question: who exactly are you for, and what do they feel before they find you? Most founders have never been asked this clearly. This session usually surfaces the real problem — which is rarely what they thought it was.",
    signal: "What you walk away with: clarity on your one real customer",
    good: true,
  },
  {
    num: "02",
    title: "The message, built from scratch",
    body: "No templates. No brand guidelines filled in with your logo. I write the words your customer needs to hear — at the exact moment they're deciding whether you're worth their attention. Positioning, tone, the one sentence that makes them feel seen.",
    signal: "What you walk away with: a messaging doc your whole team can use",
    good: true,
  },
  {
    num: "03",
    title: "The execution — copy, ads, content",
    body: "Only after the foundation is solid do we build anything. Ad copy, landing pages, content strategy — all pulled from the same source: what your customer actually feels. Nothing gets made that doesn't serve that.",
    signal: "What you walk away with: work you can run the same week",
    good: true,
  },
  {
    num: "04",
    title: "What I don't do",
    body: "I don't manage your social calendar. I don't post on your behalf. I don't write AI-generated blogs dressed as strategy. I'm not a retainer you forget you're paying. You'll know exactly what changed and why it worked.",
    signal: "Not a fit: if you need volume over quality",
    good: false,
  },
];

const DELEGATED_CHECKS = [
  {
    q: "Can they name your one specific customer — not a demographic, a person?",
    note: "Age range isn't a customer. \"32-year-old ops manager who's burned out from manual reporting\" is a customer.",
  },
  {
    q: "Do they know what your customer feels before they find you?",
    note: "Not what they want — what they feel. Frustrated? Embarrassed? Quietly desperate? This drives the copy.",
  },
  {
    q: "Can they explain why your customer would choose you over the next option?",
    note: "Not features. The emotional reason. If they can't say it plainly, neither can your ads.",
  },
  {
    q: "Did they test the messaging before scaling spend?",
    note: "Scaling bad messaging faster is how agencies burn budgets confidently.",
  },
  {
    q: "Have they changed their approach based on what the data showed?",
    note: "A report full of impressions isn't a strategy. Ask what they changed last month and why.",
  },
  {
    q: "Do they measure the metric that leads to sales — not just reach?",
    note: "Reach, likes, and follower growth are comfortable numbers. Cost per qualified lead is an uncomfortable one. Which are they showing you?",
  },
  {
    q: "Would they tell you if something wasn't working — before you asked?",
    note: "This one you already know the answer to.",
  },
];

const FUNNEL_STAGES = [
  {
    pct: 100,
    fill: 100,
    label: "People who could need you",
    sub: "They exist. The market is real.",
    detail:
      "The people who would genuinely benefit from what you sell are out there. This isn't the problem. The problem is somewhere below this.",
    leak: false,
    badge: null,
    highlight: false,
  },
  {
    pct: 72,
    fill: 72,
    label: "People who encounter your marketing",
    sub: "They've seen an ad, a post, a referral.",
    detail:
      "Reach isn't the problem for most founders. They're getting eyeballs. The drop happens next — when those eyeballs don't become interest.",
    leak: true,
    badge: "check here",
    highlight: false,
  },
  {
    pct: 28,
    fill: 28,
    label: "People who feel like it's for them",
    sub: "This is where most businesses leak.",
    detail:
      "This is the real gap. You're reaching people who could buy — but your messaging doesn't make them feel like it was made for them specifically. They scroll past. Not because they don't need it. Because it didn't feel like it was talking to them.",
    leak: true,
    badge: "biggest leak",
    highlight: true,
  },
  {
    pct: 18,
    fill: 18,
    label: "People who consider buying",
    sub: "They've looked at pricing or reached out.",
    detail:
      "By the time someone is considering buying, your messaging already did its job — or didn't. Fixing the sales process here is like mopping the floor while the tap is still running.",
    leak: false,
    badge: null,
    highlight: false,
  },
  {
    pct: 8,
    fill: 8,
    label: "People who buy",
    sub: "Your actual customers.",
    detail:
      "If this number feels low, resist the urge to look at your sales process first. Look at step 3 — messaging resonance. That's where the 72% went.",
    leak: false,
    badge: null,
    highlight: false,
  },
];

function getCheckResult(count) {
  if (count === 0) return null;
  if (count <= 2)
    return `They can answer ${count} of these. That means the work they're producing is built on guesses — however professional it looks. You're paying for execution without foundation.`;
  if (count <= 4)
    return "They've done some of the groundwork. But the gaps in what they can't answer are exactly where your budget is going to waste. Worth a direct conversation about the unanswered ones.";
  if (count <= 6)
    return "They're doing more than most agencies. The remaining gaps are worth pushing on — they're small but they're where the difference between good results and great ones lives.";
  return "They can answer all of these clearly? That's rare. Either you have an unusually good agency — or it's worth verifying the answers are real and not rehearsed.";
}

// ─── sub-panels ──────────────────────────────────────────────────────────────

function SearchingPanel() {
  return (
    <>
      <p style={s.eyebrow}>How I work</p>
      <p style={s.headline}>
        What working with me actually looks like — step by step
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {SEARCHING_STEPS.map((step) => (
          <div key={step.num} style={s.mechStep}>
            <div style={s.mechNum}>{step.num}</div>
            <div style={{ flex: 1 }}>
              <p style={s.mechTitle}>{step.title}</p>
              <p style={s.mechBody}>{step.body}</p>
              <span
                style={{
                  ...s.signal,
                  ...(step.good ? s.signalGood : s.signalBad),
                }}
              >
                {step.signal}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p style={s.panelNote}>
        "The right marketer asks the uncomfortable questions before touching
        anything. Have you been asked them yet?"
      </p>
    </>
  );
}

function DelegatedPanel() {
  const [checked, setChecked] = useState([]);

  function toggle(i) {
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );
  }

  const count = checked.length;
  const result = getCheckResult(count);

  return (
    <>
      <p style={s.eyebrow}>Agency audit</p>
      <p style={s.headline}>
        Seven questions to ask your agency in the next review
      </p>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: 16,
        }}
      >
        Tick the ones they can actually answer.{" "}
        <span style={{ color: "#C8A96E", fontWeight: 500 }}>{count} / 7</span>{" "}
        means they've done the groundwork.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DELEGATED_CHECKS.map((item, i) => {
          const isChecked = checked.includes(i);
          return (
            <div
              key={i}
              onClick={() => toggle(i)}
              style={{
                ...s.checkItem,
                ...(isChecked ? s.checkItemChecked : {}),
              }}
            >
              <div
                style={{
                  ...s.checkBox,
                  ...(isChecked ? s.checkBoxChecked : {}),
                }}
              >
                {isChecked && "✓"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={s.checkQ}>{item.q}</p>
                <p style={s.checkNote}>{item.note}</p>
              </div>
            </div>
          );
        })}
      </div>
      {result && <div style={s.checkResult}>{result}</div>}
    </>
  );
}

function SalesPanel() {
  const [openIdx, setOpenIdx] = useState(null);

  function toggle(i) {
    setOpenIdx((prev) => (prev === i ? null : i));
  }

  return (
    <>
      <p style={s.eyebrow}>Find the leak</p>
      <p style={s.headline}>Where exactly is your revenue disappearing?</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FUNNEL_STAGES.map((stage, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i}>
              <div
                onClick={() => toggle(i)}
                style={{
                  ...s.funnelStage,
                  ...(stage.leak && !stage.highlight ? s.funnelLeak : {}),
                  ...(stage.highlight ? s.funnelHighlight : {}),
                }}
              >
                <div style={{ width: 60, flexShrink: 0 }}>
                  <div style={s.funnelBarBg}>
                    <div
                      style={{ ...s.funnelBarFill, width: `${stage.fill}%` }}
                    />
                  </div>
                  <p style={s.funnelPct}>~{stage.pct}%</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={s.funnelLabel}>{stage.label}</p>
                  <p style={s.funnelSub}>{stage.sub}</p>
                  {isOpen && <p style={s.funnelDetail}>{stage.detail}</p>}
                </div>
                {stage.badge && (
                  <span
                    style={{
                      ...s.funnelBadge,
                      ...(stage.highlight ? s.funnelBadgeHighlight : {}),
                    }}
                  >
                    {stage.badge}
                  </span>
                )}
              </div>
              {i < FUNNEL_STAGES.length - 1 && (
                <div style={s.funnelConnector} />
              )}
            </div>
          );
        })}
      </div>
      <p style={s.panelNote}>
        "Most sales problems are fixed upstream. If your message doesn't make
        the right person feel seen, no closer in the world will save the deal."
      </p>
    </>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#C8A96E",
    marginBottom: 12,
    fontFamily: "var(--font-sans)",
  },
  headline: {
    fontSize: "clamp(18px, 2.5vw, 24px)",
    fontFamily: "var(--font-serif)",
    fontWeight: 400,
    color: "var(--text-primary)",
    lineHeight: 1.3,
    marginBottom: 28,
  },
  panelNote: {
    marginTop: 24,
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    fontStyle: "italic",
    fontFamily: "var(--font-serif)",
  },

  // searching
  mechStep: {
    display: "flex",
    gap: 20,
    alignItems: "flex-start",
    padding: "20px 8px",
    borderBottom: "0.5px solid var(--border-light)",
  },
  mechNum: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#C8A96E",
    minWidth: 28,
    paddingTop: 2,
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
  },
  mechTitle: {
    fontSize: 15,
    color: "var(--text-primary)",
    fontWeight: 500,
    marginBottom: 4,
    fontFamily: "var(--font-serif)",
  },
  mechBody: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  signal: {
    display: "inline-block",
    fontSize: 11,
    letterSpacing: 1,
    padding: "4px 10px",
    border: "0.5px solid",
    borderRadius: 2,
  },
  signalGood: {
    borderColor: "#C8A96E",
    color: "#C8A96E",
  },
  signalBad: {
    borderColor: "var(--border-light)",
    color: "var(--text-secondary)",
  },

  // delegated
  checkItem: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    padding: 16,
    border: "0.5px solid var(--border-light)",
    borderRadius: 6,
    cursor: "pointer",
    transition: "border-color .2s, background .2s",
  },
  checkItemChecked: {
    borderColor: "#C8A96E",
    background: "rgba(200,169,110,0.04)",
  },
  checkBox: {
    width: 18,
    height: 18,
    border: "1.5px solid var(--border-light)",
    borderRadius: 3,
    flexShrink: 0,
    marginTop: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    color: "#fff",
    transition: "background .2s, border-color .2s",
  },
  checkBoxChecked: {
    background: "#C8A96E",
    borderColor: "#C8A96E",
  },
  checkQ: {
    fontSize: 14,
    color: "var(--text-primary)",
    lineHeight: 1.5,
  },
  checkNote: {
    fontSize: 12,
    color: "var(--text-secondary)",
    marginTop: 4,
    lineHeight: 1.5,
  },
  checkResult: {
    marginTop: 20,
    padding: "14px 16px",
    borderLeft: "2px solid #C8A96E",
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  },

  // sales / funnel
  funnelStage: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    padding: "14px 16px",
    border: "0.5px solid var(--border-light)",
    borderRadius: 4,
    cursor: "pointer",
    transition: "all .2s",
  },
  funnelLeak: {
    borderColor: "rgba(200,169,110,0.5)",
    background: "rgba(200,169,110,0.04)",
  },
  funnelHighlight: {
    borderColor: "rgba(200,169,110,0.8)",
    background: "rgba(200,169,110,0.06)",
  },
  funnelBarBg: {
    height: 6,
    background: "var(--border-light)",
    borderRadius: 3,
    overflow: "hidden",
  },
  funnelBarFill: {
    height: "100%",
    borderRadius: 3,
    background: "#C8A96E",
    transition: "width .6s ease",
  },
  funnelPct: {
    fontSize: 11,
    color: "#C8A96E",
    marginTop: 3,
    letterSpacing: 0.5,
    fontFamily: "var(--font-sans)",
  },
  funnelLabel: {
    fontSize: 14,
    color: "var(--text-primary)",
    fontWeight: 500,
  },
  funnelSub: {
    fontSize: 12,
    color: "var(--text-secondary)",
    marginTop: 2,
    lineHeight: 1.5,
  },
  funnelDetail: {
    marginTop: 10,
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  },
  funnelBadge: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    border: "0.5px solid rgba(200,169,110,0.4)",
    padding: "3px 8px",
    borderRadius: 2,
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
  },
  funnelBadgeHighlight: {
    color: "#C8A96E",
    borderColor: "#C8A96E",
  },
  funnelConnector: {
    width: 1,
    height: 8,
    background: "var(--border-light)",
    margin: "0 auto",
  },
};

// ─── main component ───────────────────────────────────────────────────────────

export default function PathInfographic({ activePath }) {
  // Default to whichever tab matches the active path; fall back to "searching"
  const defaultTab =
    activePath && TAB_LABELS[activePath] ? activePath : "searching";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Keep tab in sync when parent changes activePath
  useEffect(() => {
    if (activePath && TAB_LABELS[activePath]) {
      setActiveTab(activePath);
    }
  }, [activePath]);

  return (
    <section
      style={{
        background: "var(--cream)",
        padding: "96px 32px",
        borderTop: "1px solid var(--border-light)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "0.5px solid var(--border-light)",
            marginBottom: 32,
            overflowX: "auto",
          }}
        >
          {Object.entries(TAB_LABELS).map(([key, label]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  fontSize: 12,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: isActive ? "#C8A96E" : "var(--text-secondary)",
                  padding: "10px 20px",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid #C8A96E"
                    : "2px solid transparent",
                  background: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-sans)",
                  transition: "color .2s, border-color .2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        {activeTab === "searching" && <SearchingPanel />}
        {activeTab === "delegated" && <DelegatedPanel />}
        {activeTab === "sales" && <SalesPanel />}
      </div>
    </section>
  );
}
