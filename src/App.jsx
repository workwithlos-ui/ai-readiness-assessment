import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Brain, Zap, Target, Shield, TrendingUp, Users, CheckCircle, ArrowRight, BarChart3, Cpu, Globe, Mail } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           QUESTIONS & SCORING                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

const questions = [
  {
    id: 1, category: "Operations",
    question: "How much of your team's time is spent on repetitive, manual tasks?",
    options: [
      { text: "Most of our work is manual and repetitive", score: 1 },
      { text: "About half — some things are automated", score: 2 },
      { text: "We've automated the basics, but there's more to do", score: 3 },
      { text: "We're highly automated with systems running 24/7", score: 4 }
    ]
  },
  {
    id: 2, category: "Data",
    question: "How organized is your business data (CRM, leads, financials)?",
    options: [
      { text: "Scattered across spreadsheets and inboxes", score: 1 },
      { text: "We have a CRM but it's not consistently updated", score: 2 },
      { text: "Our data is centralized and mostly clean", score: 3 },
      { text: "Clean, structured, and integrated across systems", score: 4 }
    ]
  },  {
    id: 3, category: "Customer Experience",
    question: "How quickly does your team respond to new leads or inquiries?",
    options: [
      { text: "Whenever someone gets around to it (hours or days)", score: 1 },
      { text: "Within a few hours during business hours", score: 2 },
      { text: "Under 30 minutes, with a defined process", score: 3 },
      { text: "Instantly — automated response + human follow-up", score: 4 }
    ]
  },
  {
    id: 4, category: "Content & Marketing",
    question: "How consistently does your business publish content across platforms?",
    options: [
      { text: "Rarely — we post when we remember", score: 1 },
      { text: "A few times a month, no real strategy", score: 2 },
      { text: "Weekly with a loose content calendar", score: 3 },
      { text: "Daily across multiple platforms with a system", score: 4 }
    ]
  },
  {
    id: 5, category: "Revenue Intelligence",
    question: "How well do you track where your revenue actually comes from?",
    options: [
      { text: "We don't — revenue just shows up (or doesn't)", score: 1 },
      { text: "We have a rough idea but no real attribution", score: 2 },
      { text: "We track by channel but can't tie to specific actions", score: 3 },
      { text: "Full attribution from first touch to closed deal", score: 4 }
    ]
  },  {
    id: 6, category: "Team & Culture",
    question: "How does your team feel about adopting AI tools?",
    options: [
      { text: "Skeptical or resistant — 'we do things our way'", score: 1 },
      { text: "Curious but overwhelmed — don't know where to start", score: 2 },
      { text: "Open and experimenting with a few tools", score: 3 },
      { text: "AI-first mindset — always looking for the next edge", score: 4 }
    ]
  },
  {
    id: 7, category: "Competitive Position",
    question: "How do you stack up against competitors using AI?",
    options: [
      { text: "We're behind — competitors are ahead of us", score: 1 },
      { text: "About the same — nobody's really doing it yet", score: 2 },
      { text: "We're slightly ahead with a few AI implementations", score: 3 },
      { text: "We're the ones competitors are trying to catch", score: 4 }
    ]
  }
];

const archetypes = [
  { min: 7, max: 11, name: "AI Skeptic", color: "#ef4444", icon: Shield, tagline: "You're leaving money on the table",
    desc: "Your business is running on manual processes and gut instinct. That worked 5 years ago. Today, your competitors who adopt AI first will capture the leads, close the deals, and dominate the market while you're still doing things by hand.",
    recs: ["Start with ONE high-impact AI tool (like an AI receptionist)", "Audit your biggest time-wasters — that's where AI wins fastest", "Book a strategy call to identify your #1 revenue leak"] },
  { min: 12, max: 17, name: "AI Curious", color: "#f59e0b", icon: Brain, tagline: "You see the potential but haven't captured it",
    desc: "You know AI matters but you're stuck in the 'where do I start' loop. Good news: you don't need to overhaul everything. One strategic AI deployment can show ROI in 30 days and build momentum for the rest.",
    recs: ["Deploy an AI receptionist to capture missed calls 24/7", "Implement a content engine to 10x your output", "Map your customer journey — find the 3 biggest drop-off points"] },  { min: 18, max: 23, name: "AI Ready", color: "#6366f1", icon: TrendingUp, tagline: "You're primed for a massive leap",
    desc: "You've got the foundation. Clean-ish data, some automation, a team that's open to change. Now you need the right AI stack to connect the dots. This is where businesses go from 'doing well' to 'dominating their market.'",
    recs: ["Build an AI agent team (sales, ops, content, finance, strategy)", "Implement revenue attribution across all channels", "Create a custom AI-powered sales pipeline"] },
  { min: 24, max: 28, name: "AI Pioneer", color: "#34d399", icon: Zap, tagline: "You're already in the top 2%",
    desc: "You're operating at a level most businesses won't reach for 3-5 years. The question isn't whether to use AI — it's how to build proprietary AI advantages that competitors literally cannot replicate.",
    recs: ["Build custom AI tools specific to your industry", "Create an AI-powered competitive intelligence system", "Develop proprietary models trained on your business data"] }
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           COMPONENTS                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

const ProgressBar = ({ current, total }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        flex: 1, height: 4, borderRadius: 2,
        background: i < current ? "linear-gradient(90deg, #6366f1, #818cf8)" : "rgba(99,102,241,0.15)",
        transition: "background 0.4s ease",
        boxShadow: i < current ? "0 0 8px rgba(99,102,241,0.3)" : "none"
      }} />
    ))}
  </div>
);

const ScoreRing = ({ score, maxScore, color }) => {
  const pct = Math.round((score / maxScore) * 100);
  const size = 200; const stroke = 12;
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto 24px" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${color}60)`, transition: "stroke-dashoffset 2s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>out of {maxScore}</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           MAIN APP                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [phase, setPhase] = useState("intro"); // intro, quiz, results
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [animating, setAnimating] = useState(false);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const archetype = archetypes.find(a => totalScore >= a.min && totalScore <= a.max) || archetypes[0];
  const handleAnswer = (score) => {
    setSelectedOption(score);
    setAnimating(true);
    setAnswers(prev => ({ ...prev, [currentQ]: score }));
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setPhase("results");
      }
      setAnimating(false);
    }, 400);
  };

  const goBack = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
      setSelectedOption(answers[currentQ - 1] || null);
    }
  };

  const restart = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setEmail("");
  };

  const bg = { minHeight: "100vh", background: "linear-gradient(145deg, #020617 0%, #0f172a 50%, #020617 100%)", fontFamily: "'Inter',-apple-system,sans-serif", color: "#e2e8f0" };
  /* ── INTRO SCREEN ─────────────────────────────────────────── */
  if (phase === "intro") return (
    <div style={bg}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", left: "25%", width: 500, height: 500, borderRadius: "50%", background: "rgba(99,102,241,0.06)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(244,114,182,0.04)", filter: "blur(100px)" }} />
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px", position: "relative", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 100, marginBottom: 32 }}>
          <Brain size={16} color="#818cf8" />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", letterSpacing: 1 }}>FREE ASSESSMENT</span>
        </div>

        <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, background: "linear-gradient(135deg, #fff 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Is Your Business Ready for AI?
        </h1>

        <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
          7 questions. 2 minutes. Get your AI Readiness Score, your business archetype, and a personalized action plan — free.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48, textAlign: "center" }}>
          {[
            { icon: Zap, label: "7 Questions", sub: "Takes 2 minutes" },
            { icon: Target, label: "Your Score", sub: "Out of 28 points" },
            { icon: TrendingUp, label: "Action Plan", sub: "Personalized to you" }
          ].map((item, i) => (
            <div key={i} style={{ padding: "20px 16px", borderRadius: 16, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.08)" }}>
              <item.icon size={24} color="#818cf8" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{item.sub}</div>            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase("quiz")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px",
            borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 24px rgba(99,102,241,0.4)", transition: "all 0.3s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Start Assessment <ArrowRight size={18} />
        </button>

        <p style={{ fontSize: 12, color: "#475569", marginTop: 16 }}>No account required. Free forever.</p>

        <div style={{ position: "absolute", bottom: -60, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ fontSize: 10, color: "#334155", letterSpacing: 1.5 }}>POWERED BY</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#818cf8", letterSpacing: 2, marginTop: 4 }}>ELIOS AI</div>
        </div>
      </div>
    </div>
  );
  /* ── QUIZ SCREEN ──────────────────────────────────────────── */
  if (phase === "quiz") {
    const q = questions[currentQ];
    return (
      <div style={bg}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: 1.5 }}>AI READINESS ASSESSMENT</span>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{currentQ + 1} of {questions.length}</span>
          </div>

          <ProgressBar current={currentQ + 1} total={questions.length} />

          <div style={{ padding: "8px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 8, display: "inline-block", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: 1 }}>{q.category.toUpperCase()}</span>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 32 }}>{q.question}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.score)}
                style={{
                  width: "100%", textAlign: "left", padding: "18px 20px", borderRadius: 14,
                  border: selectedOption === opt.score ? `2px solid #818cf8` : "2px solid rgba(99,102,241,0.1)",
                  background: selectedOption === opt.score ? "rgba(99,102,241,0.15)" : "rgba(15,23,42,0.6)",
                  color: "#e2e8f0", fontSize: 15, fontWeight: 500, cursor: "pointer",
                  transition: "all 0.2s", opacity: animating && selectedOption !== opt.score ? 0.5 : 1
                }}
                onMouseEnter={e => { if (selectedOption !== opt.score) e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
                onMouseLeave={e => { if (selectedOption !== opt.score) e.currentTarget.style.borderColor = "rgba(99,102,241,0.1)"; }}
              >                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: selectedOption === opt.score ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.08)",
                    fontSize: 12, fontWeight: 700, color: selectedOption === opt.score ? "#fff" : "#818cf8",
                    transition: "all 0.2s", flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt.text}
                </div>
                {selectedOption === opt.score && <CheckCircle size={18} color="#818cf8" style={{ flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {currentQ > 0 && (
            <button onClick={goBack} style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 24,
              padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)",
              background: "transparent", color: "#64748b", fontSize: 13, fontWeight: 600,
              cursor: "pointer"
            }}>
              <ChevronLeft size={16} /> Previous
            </button>
          )}

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <span style={{ fontSize: 10, color: "#334155", letterSpacing: 1.5 }}>POWERED BY </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#818cf8", letterSpacing: 1.5 }}>ELIOS AI</span>
          </div>
        </div>
      </div>
    );
  }
  /* ── RESULTS SCREEN ───────────────────────────────────────── */
  const ArchIcon = archetype.icon;
  return (
    <div style={bg}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: `${archetype.color}08`, filter: "blur(120px)" }} />
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 24px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: `${archetype.color}15`, border: `1px solid ${archetype.color}30`, borderRadius: 100, marginBottom: 24 }}>
            <ArchIcon size={16} color={archetype.color} />
            <span style={{ fontSize: 12, fontWeight: 700, color: archetype.color, letterSpacing: 1 }}>YOUR RESULT</span>
          </div>

          <ScoreRing score={totalScore} maxScore={28} color={archetype.color} />

          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
            You're an <span style={{ color: archetype.color }}>{archetype.name}</span>
          </h1>
          <p style={{ fontSize: 16, color: archetype.color, fontWeight: 600, marginBottom: 24 }}>{archetype.tagline}</p>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>{archetype.desc}</p>
        </div>

        {/* Category breakdown */}
        <div style={{ borderRadius: 16, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.08)", padding: "24px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>SCORE BREAKDOWN</div>
          {questions.map((q, i) => {
            const score = answers[i] || 0;
            return (
              <div key={i} style={{ marginBottom: i < questions.length - 1 ? 12 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{q.category}</span>
                  <span style={{ fontSize: 12, color: archetype.color, fontWeight: 700 }}>{score}/4</span>                </div>
                <div style={{ height: 6, background: "rgba(99,102,241,0.08)", borderRadius: 3 }}>
                  <div style={{ height: 6, borderRadius: 3, background: archetype.color, width: `${(score / 4) * 100}%`, transition: "width 1.5s ease", boxShadow: `0 0 8px ${archetype.color}40` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div style={{ borderRadius: 16, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.08)", padding: "24px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, marginBottom: 16 }}>YOUR ACTION PLAN</div>
          {archetype.recs.map((rec, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < archetype.recs.length - 1 ? 16 : 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${archetype.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: archetype.color }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>{rec}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ borderRadius: 16, background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.2)", padding: "32px", textAlign: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Want the full AI strategy built for you?</h3>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24, lineHeight: 1.6 }}>
            Book a free 30-minute strategy call. We'll map out exactly which AI systems will generate the highest ROI for your business — and build them for you.
          </p>
          <a
            href="https://calendly.com/elios-ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px",              borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none",
              boxShadow: "0 4px 24px rgba(99,102,241,0.4)"
            }}
          >
            Book Your Free AI Strategy Call <ArrowRight size={18} />
          </a>
        </div>

        {/* Email capture */}
        <div style={{ borderRadius: 16, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.08)", padding: "24px", textAlign: "center", marginBottom: 32 }}>
          <Mail size={20} color="#818cf8" style={{ marginBottom: 8 }} />
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Get your full report via email</h4>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>We'll send a detailed breakdown with industry benchmarks</p>
          <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)",
                background: "rgba(15,23,42,0.8)", color: "#e2e8f0", fontSize: 14, outline: "none"
              }}
            />
            <button style={{
              padding: "12px 20px", borderRadius: 10, border: "none",
              background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer"
            }}>
              Send
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={restart} style={{            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.15)",
            background: "transparent", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>
            Retake Assessment
          </button>
          <div>
            <span style={{ fontSize: 10, color: "#334155", letterSpacing: 1.5 }}>POWERED BY </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#818cf8", letterSpacing: 1.5 }}>ELIOS AI</span>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 3px; }
        a:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
