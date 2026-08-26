"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileText,
  Flame,
  Sparkles,
  RefreshCw,
  Send,
  Share2,
  Star,
  Upload,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ResumeAnalysis, ResumeProblem } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { rehearseUrl } from "@/lib/site";

const loadingMessages = [
  "Reading your resume...",
  "Finding the red flags...",
  "Judging your bullet points...",
  "Checking for corporate fog...",
  "Preparing the roast..."
];

const fallbackAnalysis: ResumeAnalysis = {
  score: 68,
  verdict: "Useful experience, but the resume is making recruiters work too hard.",
  roast: [
    "Your bullet points are dressed like achievements, but most of them are just responsibilities wearing a tie.",
    "The skills section says you communicate well, then the resume immediately asks the reader to decode a wall of text.",
    "ATS bots can read this, but they may need a coffee and a sincere apology."
  ],
  summary:
    "The resume has enough substance to be competitive, but it needs sharper evidence, cleaner hierarchy, and more measurable outcomes.",
  strengths: ["Clear professional intent", "Relevant experience is present", "Enough raw material to improve quickly"],
  problems: [
    {
      title: "Weak Experience Bullets",
      severity: "high",
      explanation: "Several bullets describe duties instead of proving impact.",
      fix: "Rewrite the top bullets with action, scope, metric, and business result."
    },
    {
      title: "Missing Measurable Results",
      severity: "high",
      explanation: "Recruiters need proof that your work changed something.",
      fix: "Add numbers for revenue, time saved, users supported, defects reduced, or projects shipped."
    },
    {
      title: "Flat Skills Section",
      severity: "medium",
      explanation: "The skills list reads broad instead of targeted.",
      fix: "Group skills by category and prioritize the keywords from your target roles."
    }
  ],
  sections: {
    formatting: "Use tighter spacing, clear section headings, and consistent bullet structure.",
    experience: "Lead with outcomes and quantify the scope of your work.",
    skills: "Prioritize job-specific hard skills over generic traits.",
    education: "Keep it concise unless you are early career or the credential is central to the role.",
    ats: "Avoid unusual layouts, tables, and icons that can confuse parsers."
  },
  quick_wins: [
    "Add metrics to your three strongest bullets.",
    "Remove generic soft skills unless they are proven in experience bullets.",
    "Move the most relevant technical skills higher.",
    "Start every experience bullet with a strong action verb."
  ],
  rewrite_examples: [
    {
      original: "Responsible for managing projects and communicating with stakeholders.",
      improved:
        "Led 6 cross-functional projects, aligned 12 stakeholders, and cut delivery delays by 28% through weekly risk reviews."
    }
  ],
  final_verdict: "Fix the bullets first. That is where the fastest score jump is hiding.",
  interview_readiness:
    "You have material to discuss, but the current wording does not yet make your best stories easy to defend."
};

const testimonials = [
  ["https://i.pravatar.cc/96?img=12", "I fixed the resume, then Rehearse made the interview feel obvious."],
  ["https://i.pravatar.cc/96?img=32", "The roast hurt for five minutes. The interview prep helped for real."],
  ["https://i.pravatar.cc/96?img=47", "Practice before the call, not during the call."],
  ["https://i.pravatar.cc/96?img=56", "My resume stopped rambling and my answers finally sounded prepared."]
] as const;

function severityStyles(severity: ResumeProblem["severity"]) {
  if (severity === "high") return "border-ember bg-[#fff3ef] text-ember";
  if (severity === "medium") return "border-[#c58f23] bg-[#fff8e7] text-[#7b5712]";
  return "border-moss bg-[#edf8f2] text-moss";
}

function UncroppedImage({ src, alt, size = 104 }: { src: string; alt: string; size?: number }) {
  return <Image src={src} alt={alt} width={size} height={size} className="mx-auto object-contain" style={{ width: size, height: size }} />;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);
  const [generatedCv, setGeneratedCv] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [trustCount, setTrustCount] = useState(1270);
  const [toast, setToast] = useState("");
  const [showTipPopup, setShowTipPopup] = useState(false);
  const [showCvPopup, setShowCvPopup] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoading) return;
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/trust", { method: "POST" })
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted && typeof payload.count === "number") setTrustCount(payload.count);
      })
      .catch(() => {
        if (isMounted) setTrustCount(1270);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowTipPopup(true), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!showCvPopup) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowCvPopup(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCvPopup]);

  const shareText = useMemo(() => {
    const score = analysis?.score ?? fallbackAnalysis.score;
    return `My resume scored ${score}/100 on VibeJudge. Upload yours at vibejudge.app`;
  }, [analysis]);

  function selectFile(nextFile: File | null) {
    setError("");
    setAnalysis(null);
    setFile(nextFile);

    if (nextFile) {
      trackEvent("resume_upload_started");
      setToast("CV loaded. The judge is ready.");
    }
  }

  async function submitResume() {
    setError("");
    setIsLoading(true);
    setMessageIndex(0);
    trackEvent("resume_upload_completed");

    const formData = new FormData();
    if (file) formData.append("resume", file);

    try {
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || "Something went wrong.");

      setAnalysis(payload.analysis);
      trackEvent("resume_analysis_completed");
      trackEvent("resume_score_viewed");
      trackEvent("resume_roast_viewed");
      setToast("Roast complete. Emotional damage delivered.");
      window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (cause) {
      trackEvent("resume_analysis_failed");
      setError(cause instanceof Error ? cause.message : "We could not roast your resume right now.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyResult() {
    trackEvent("share_clicked");
    await navigator.clipboard.writeText(shareText);
    setToast("Result copied.");
  }

  async function shareResult() {
    trackEvent("share_clicked");
    if (navigator.share) {
      await navigator.share({ title: "VibeJudge result", text: shareText, url: "https://vibejudge.app" });
      setToast("Shared.");
      return;
    }

    await copyResult();
  }

  function escapeHtml(value: string) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function logoDataUrl() {
    const response = await fetch("/cv.png");
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not load logo"));
      reader.readAsDataURL(blob);
    });
  }

  function downloadBlob(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setToast("Download started.");
  }

  function loadCanvasImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.replace(/\s+/g, " ").trim().split(" ");
    let line = "";
    let nextY = y;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;

      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, nextY);
        line = word;
        nextY += lineHeight;
      } else {
        line = testLine;
      }
    }

    if (line) {
      ctx.fillText(line, x, nextY);
      nextY += lineHeight;
    }

    return nextY;
  }

  function drawWrappedTextLimited(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ) {
    const words = text.replace(/\s+/g, " ").trim().split(" ");
    const lines: string[] = [];
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;

      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }

      if (lines.length === maxLines) break;
    }

    if (line && lines.length < maxLines) lines.push(line);

    lines.forEach((item, index) => {
      const suffix = index === maxLines - 1 && words.join(" ").length > lines.join(" ").length ? "..." : "";
      ctx.fillText(`${item}${suffix}`, x, y + index * lineHeight);
    });

    return y + lines.length * lineHeight;
  }

  function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setToast("PNG download started.");
    }, "image/png");
  }

  async function downloadRoast() {
    if (!analysis) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 1800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const logo = await loadCanvasImage("/cv.png");
    const scoreColor = analysis.score >= 80 ? "#2e6f5e" : analysis.score >= 60 ? "#c58f23" : "#e8502f";

    ctx.fillStyle = "#f4f2ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#101010";
    ctx.beginPath();
    ctx.roundRect(54, 54, 1292, 1692, 48);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(86, 86, 1228, 1628, 38);
    ctx.fill();
    ctx.strokeStyle = "#dedbd2";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.drawImage(logo, 126, 126, 58, 58);
    ctx.fillStyle = "#101010";
    ctx.font = "900 36px Arial";
    ctx.fillText("VibeJudge", 202, 165);
    ctx.fillStyle = "#6b6259";
    ctx.font = "800 24px Arial";
    ctx.fillText("Resume roast report", 126, 230);

    ctx.fillStyle = "#101010";
    ctx.font = "900 82px Arial";
    ctx.fillText("YOUR RESUME", 126, 330);
    ctx.fillText("GOT ROASTED.", 126, 420);

    ctx.fillStyle = "#fff3ef";
    ctx.beginPath();
    ctx.roundRect(126, 476, 1148, 252, 34);
    ctx.fill();
    ctx.fillStyle = "#101010";
    ctx.beginPath();
    ctx.roundRect(162, 520, 250, 164, 28);
    ctx.fill();
    ctx.fillStyle = scoreColor;
    ctx.font = "900 96px Arial";
    ctx.fillText(String(analysis.score), 198, 630);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 28px Arial";
    ctx.fillText("/100", 326, 630);
    ctx.font = "800 21px Arial";
    ctx.fillText("RESUME SCORE", 198, 662);

    ctx.fillStyle = "#101010";
    ctx.font = "900 38px Arial";
    drawWrappedTextLimited(ctx, analysis.verdict, 458, 552, 740, 46, 2);
    ctx.fillStyle = "#4b5563";
    ctx.font = "500 27px Arial";
    drawWrappedTextLimited(ctx, analysis.summary, 458, 648, 740, 36, 2);

    const metrics = [
      ["Impact", Math.max(8, Math.min(100, analysis.score - 8))],
      ["ATS", Math.max(8, Math.min(100, analysis.score + 4))],
      ["Clarity", Math.max(8, Math.min(100, analysis.score - 2))]
    ] as const;
    let metricY = 806;
    ctx.fillStyle = "#101010";
    ctx.font = "900 34px Arial";
    ctx.fillText("RESUME HEALTH", 126, metricY);
    metricY += 44;
    for (const [label, value] of metrics) {
      ctx.fillStyle = "#101010";
      ctx.font = "900 24px Arial";
      ctx.fillText(label, 126, metricY);
      ctx.fillText(`${value}%`, 1172, metricY);
      ctx.fillStyle = "#dedbd2";
      ctx.beginPath();
      ctx.roundRect(126, metricY + 18, 1080, 18, 9);
      ctx.fill();
      ctx.fillStyle = label === "ATS" ? "#2e6f5e" : scoreColor;
      ctx.beginPath();
      ctx.roundRect(126, metricY + 18, 1080 * (Number(value) / 100), 18, 9);
      ctx.fill();
      metricY += 74;
    }

    let y = 1100;
    ctx.fillStyle = "#101010";
    ctx.font = "900 38px Arial";
    ctx.fillText("THE ROAST", 126, y);
    y += 54;
    for (const [index, item] of analysis.roast.slice(0, 3).entries()) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(126, y - 34, 1148, 124, 22);
      ctx.fill();
      ctx.strokeStyle = "#dedbd2";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#e8502f";
      ctx.font = "900 27px Arial";
      ctx.fillText(`#${index + 1}`, 160, y + 8);
      ctx.fillStyle = "#101010";
      ctx.font = "700 27px Arial";
      drawWrappedTextLimited(ctx, item, 230, y + 8, 980, 35, 2);
      y += 146;
    }

    ctx.fillStyle = "#101010";
    ctx.font = "900 26px Arial";
    ctx.fillText("Roasted by VibeJudge", 126, 1640);
    ctx.fillStyle = "#6b6259";
    ctx.font = "700 24px Arial";
    ctx.fillText("Upload yours at vibejudge.app", 126, 1680);

    downloadCanvas(canvas, "vibejudge-roast.png");
  }

  async function generateCv() {
    if (!file || !analysis) return;

    setError("");
    setIsGeneratingCv(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("analysis", JSON.stringify(analysis));

    try {
      const response = await fetch("/api/generate-cv", { method: "POST", body: formData });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || "Could not generate CV.");

      setGeneratedCv(payload.cv);
      trackEvent("cv_generation_completed");
      setToast("Generated CV is ready.");
      setShowCvPopup(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not generate the improved CV right now.");
    } finally {
      setIsGeneratingCv(false);
    }
  }

  function downloadGeneratedCv() {
    if (!generatedCv) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 1800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const knownHeadings = new Set([
      "PROFESSIONAL SUMMARY",
      "SUMMARY",
      "PROFILE",
      "CORE COMPETENCIES",
      "COMPETENCIES",
      "CORE SKILLS",
      "SKILLS",
      "TECHNICAL SKILLS",
      "PROFESSIONAL EXPERIENCE",
      "EXPERIENCE",
      "PROJECTS",
      "EDUCATION",
      "CERTIFICATIONS",
      "LANGUAGES",
      "AWARDS"
    ]);
    const cleanedLines = generatedCv
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\*\*/g, "")
      .split(/\n/)
      .map((line) => line.trim().replace(/^#+\s*/, ""))
      .filter((line) => line && !/^-{3,}$/.test(line) && !/^\|?[-\s|:]+\|?$/.test(line) && !line.includes("|---"));
    const nameLine = cleanedLines[0] ?? "Curriculum Vitae";
    const name = nameLine.replace(/^Name:\s*/i, "").slice(0, 90);
    const contactCandidate = cleanedLines[1] ?? "";
    const looksLikeContact =
      /(email|phone|linkedin|github|portfolio|website|@|\+\d{2,}|tel:)/i.test(contactCandidate) &&
      !knownHeadings.has(contactCandidate.toUpperCase());
    const contact = looksLikeContact ? contactCandidate.replace(/\s{2,}/g, " ").slice(0, 220) : "";
    const bodyLines = looksLikeContact ? cleanedLines.slice(2) : cleanedLines.slice(1);
    const sections: Array<{ heading: string; body: string[] }> = [];
    let current: { heading: string; body: string[] } | null = null;

    for (const line of bodyLines) {
      const normalized = line.toUpperCase().replace(/[:]+$/, "");
      const isHeading = knownHeadings.has(normalized) || (line.length <= 34 && /^[A-Z][A-Z\s/&-]+$/.test(line));

      if (isHeading) {
        const existing = sections.find((section) => section.heading === normalized);

        if (existing) {
          current = existing;
        } else {
          current = { heading: normalized, body: [] };
          sections.push(current);
        }
        continue;
      }

      const bodyLine = line.replace(/^\s*[-*]\s*/, "").replace(/\|/g, " | ").replace(/\s{2,}/g, " ").trim();
      if (!bodyLine || knownHeadings.has(bodyLine.toUpperCase())) continue;

      if (!current) {
        current = { heading: "PROFILE", body: [] };
        sections.push(current);
      }

      if (current.body[current.body.length - 1] === bodyLine) continue;

      current.body.push(bodyLine);
    }

    const visibleSections = sections.filter((section) => section.body.length > 0).slice(0, 8);

    ctx.fillStyle = "#f4f2ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(76, 54, 1248, 1692, 34);
    ctx.fill();
    ctx.strokeStyle = "#dedbd2";
    ctx.lineWidth = 2;
    ctx.stroke();

    const contentX = 140;
    const contentWidth = 1120;
    const bottomLimit = 1690;
    const scales = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64];

    const measureCanvas = document.createElement("canvas");
    measureCanvas.width = canvas.width;
    measureCanvas.height = canvas.height;
    const measureCtx = measureCanvas.getContext("2d");

    if (!measureCtx) return;

    const drawCv = (target: CanvasRenderingContext2D, scale: number) => {
      let y = 150;

      target.fillStyle = "#101010";
      target.font = `900 ${Math.round(52 * scale)}px Arial`;
      y = drawWrappedText(target, name || "Curriculum Vitae", contentX, y, contentWidth, 60 * scale) + 14 * scale;

      if (contact) {
        target.fillStyle = "#4b5563";
        target.font = `600 ${Math.round(23 * scale)}px Arial`;
        y = drawWrappedText(target, contact, contentX, y, contentWidth, 30 * scale) + 18 * scale;
      } else {
        y += 26 * scale;
      }

      target.fillStyle = "#e8502f";
      target.beginPath();
      target.roundRect(contentX, y, 170 * scale, 7 * scale, 4);
      target.fill();
      y += 58 * scale;

      for (const section of visibleSections) {
        const isSkills = /SKILL|COMPETENC/.test(section.heading);

        target.fillStyle = "#101010";
        target.font = `900 ${Math.round(27 * scale)}px Arial`;
        target.fillText(section.heading, contentX, y);
        y += 17 * scale;
        target.strokeStyle = "#dedbd2";
        target.lineWidth = Math.max(1, 2 * scale);
        target.beginPath();
        target.moveTo(contentX, y);
        target.lineTo(contentX + contentWidth, y);
        target.stroke();
        y += 34 * scale;

        for (const line of section.body) {
          target.font = `500 ${Math.round(23 * scale)}px Arial`;

          if (!isSkills) {
            target.fillStyle = "#e8502f";
            target.beginPath();
            target.arc(contentX + 8, y - 8 * scale, 4 * scale, 0, Math.PI * 2);
            target.fill();
          }

          target.fillStyle = "#343434";

          if (isSkills) {
            y = drawWrappedText(target, line, contentX, y, contentWidth, 31 * scale) + 8 * scale;
          } else {
            y = drawWrappedText(target, line, contentX + 26, y, contentWidth - 26, 31 * scale) + 10 * scale;
          }

          if (y > bottomLimit) return y;
        }

        y += 24 * scale;

        if (y > bottomLimit) return y;
      }

      return y;
    };

    let chosenScale = scales[scales.length - 1];

    for (const scale of scales) {
      if (drawCv(measureCtx, scale) <= bottomLimit) {
        chosenScale = scale;
        break;
      }
    }

    drawCv(ctx, chosenScale);

    downloadCanvas(canvas, "vibejudge-generated-cv.png");
  }

  function scrollToUpload() {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen overflow-hidden xl:pr-80">
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-center text-sm font-black text-ink shadow-soft"
            role="status"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showTipPopup && !analysis ? (
          <motion.aside
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            className="fixed bottom-5 left-5 z-40 hidden w-80 rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-soft md:block"
            aria-label="Resume roast tip"
          >
            <button
              type="button"
              onClick={() => setShowTipPopup(false)}
              className="focus-ring absolute right-3 top-3 rounded-full p-1 text-stone-500 transition hover:bg-stone-100 hover:text-ink"
              aria-label="Close popup"
            >
              <X size={18} aria-hidden />
            </button>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ember">Quick warning</p>
            <h2 className="mt-2 pr-6 text-xl font-black leading-tight">If your resume says &quot;hard worker,&quot; the roast may be personal.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Upload the CV and get the exact fixes before a recruiter sees the vague version.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowTipPopup(false);
                scrollToUpload();
              }}
              className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-black uppercase text-white"
            >
              <Upload size={15} aria-hidden />
              Upload CV
            </button>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCvPopup && generatedCv ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
            onClick={() => setShowCvPopup(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Your generated CV is ready"
          >
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-soft"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowCvPopup(false)}
                className="focus-ring absolute right-4 top-4 rounded-full p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-ink"
                aria-label="Close popup"
              >
                <X size={18} aria-hidden />
              </button>
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf8f2] text-moss"
              >
                <Sparkles size={30} aria-hidden />
              </motion.div>
              <h2 className="mt-5 text-3xl font-black uppercase">Your new CV is ready</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Your rewritten, recruiter-ready CV just left the kitchen. Review it, download it, and go win the interview.
              </p>
              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCvPopup(false);
                    window.setTimeout(() => document.getElementById("generated-cv")?.scrollIntoView({ behavior: "smooth" }), 80);
                  }}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black uppercase text-white transition hover:-translate-y-0.5"
                >
                  <FileText size={17} aria-hidden />
                  View my CV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadGeneratedCv();
                    setShowCvPopup(false);
                  }}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ink bg-[#f8d8f3] px-5 py-3 text-sm font-black uppercase text-ink transition hover:-translate-y-0.5"
                >
                  <Download size={17} aria-hidden />
                  Download CV
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <aside className="fixed right-5 top-8 z-30 hidden max-h-[calc(100vh-4rem)] w-72 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-soft xl:block">
        <h2 className="text-2xl font-black leading-tight text-ink">
          Fix the CV.
          <br />
          Win the interview.
        </h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
          {["Roast your resume first", "Practice realistic interview questions", "Stop freezing when they ask about your experience"].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
              {item}
            </li>
          ))}
        </ul>
        <a
          href={rehearseUrl} onClick={() => trackEvent("rehearse_cta_clicked")}
          className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink bg-[#f8d8f3] px-5 py-3 text-sm font-black text-ink transition hover:bg-ink hover:text-white"
        >
          <Send size={16} aria-hidden />
          Try Rehearse
        </a>
        <div className="mt-6 max-h-64 space-y-4 overflow-y-auto pr-2">
          {testimonials.map(([src, quote]) => (
            <figure key={quote} className="flex gap-3">
              <img src={src} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <blockquote className="text-sm font-semibold leading-6 text-stone-700">&quot;{quote}&quot;</blockquote>
            </figure>
          ))}
        </div>
      </aside>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#" className="focus-ring flex items-center gap-3 rounded-md" aria-label="VibeJudge home">
          <Image src="/cv.png" alt="" width={38} height={38} priority className="rounded-md" />
          <span className="text-lg font-black tracking-normal">VibeJudge</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-stone-600 sm:flex" aria-label="Main">
          <a className="focus-ring rounded-md hover:text-ink" href="#how-it-works">
            How it works
          </a>
          <a className="focus-ring rounded-md hover:text-ink" href="#about">
            About
          </a>
          <a className="focus-ring rounded-md hover:text-ink" href={rehearseUrl} onClick={() => trackEvent("rehearse_cta_clicked")}>
            Rehearse
          </a>
        </nav>
        <a
          href="https://www.producthunt.com/products/vibejudge?utm_source=badge-follow&utm_medium=badge&utm_source=badge-vibejudge"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-block rounded-lg"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1301141&theme=light"
            alt="VibeJudge - AI that brutally roasts your resume | Product Hunt"
            className="h-auto w-[180px] sm:w-[250px]"
            width={250}
            height={54}
          />
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 text-center sm:px-8 lg:pb-24 lg:pt-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex flex-col items-center justify-center gap-2 text-center text-sm font-black text-stone-700 sm:flex-row sm:gap-3 sm:text-left">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={22} className="fill-[#c58f23] text-[#c58f23]" aria-hidden />
              ))}
            </div>
            <span>Trusted by {trustCount.toLocaleString()} professionals and job seekers</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-black uppercase leading-[0.94] tracking-normal text-ink sm:text-6xl md:text-7xl">
            Your resume is embarrassing. Let&apos;s find out why.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-700 sm:text-xl">
            Upload your resume. We&apos;ll roast it, explain what&apos;s wrong, and tell you exactly what to fix.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToUpload}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-black uppercase text-white shadow-soft transition hover:-translate-y-0.5"
            >
              <Upload size={18} aria-hidden />
              Roast my resume
            </button>
            <span className="text-sm font-semibold text-stone-500">Free. No signup. No payment.</span>
          </div>
        </div>

        <section ref={uploadSectionRef} id="upload" aria-labelledby="upload-heading" className="relative mx-auto mt-12 max-w-3xl">
          <div className="relative rounded-[2rem] border border-stone-200 bg-white p-4 shadow-soft sm:p-6">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                selectFile(event.dataTransfer.files?.[0] ?? null);
              }}
              className={`flex min-h-[330px] flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed p-7 text-center transition ${
                isDragging ? "border-ember bg-[#fff3ef]" : "border-stone-300 bg-paper"
              }`}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-white">
                <FileText size={30} aria-hidden />
              </div>
              <h2 id="upload-heading" className="text-2xl font-black tracking-normal">
                Drop or insert your CV here
              </h2>
              <p className="mt-2 text-sm font-semibold text-stone-500">PDF, DOCX, or TXT up to 6MB</p>
              {file ? (
                <p className="mt-4 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700">
                  {file.name}
                </p>
              ) : null}
              <input
                ref={uploadRef}
                type="file"
                className="sr-only"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => uploadRef.current?.click()}
                className="focus-ring mt-6 rounded-full border border-ink bg-white px-5 py-3 text-sm font-black uppercase text-ink transition hover:bg-ink hover:text-white"
              >
                Insert CV
              </button>
            </div>

            <button
              type="button"
              disabled={!file || isLoading}
              onClick={submitResume}
              className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-6 py-4 text-sm font-black uppercase text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={18} aria-hidden /> : <Flame size={18} aria-hidden />}
              {isLoading ? loadingMessages[messageIndex] : "Roast this resume"}
            </button>

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 flex gap-3 rounded-2xl border border-ember bg-[#fff3ef] p-4 text-sm font-semibold text-ink"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 shrink-0 text-ember" size={18} aria-hidden />
                  <span>{error}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>
      </section>

      <section id="how-it-works" className="border-y border-stone-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 className="text-4xl font-black uppercase tracking-normal text-ink">How it works</h2>
          <div className="relative mx-auto mt-12 hidden h-[520px] max-w-4xl md:block">
            <ArrowUpRight className="absolute left-[17%] top-[12%] h-24 w-24 text-ink" strokeWidth={1.8} aria-hidden />
            <ArrowDownRight className="absolute right-[16%] top-[15%] h-24 w-24 text-ink" strokeWidth={1.8} aria-hidden />
            <ArrowDownLeft className="absolute bottom-[11%] right-[16%] h-24 w-24 text-ink" strokeWidth={1.8} aria-hidden />
            <ArrowUpLeft className="absolute bottom-[12%] left-[17%] h-24 w-24 text-ink" strokeWidth={1.8} aria-hidden />

            <article className="absolute left-1/2 top-[1%] flex w-60 -translate-x-1/2 flex-col items-center">
              <div className="flex items-end justify-center gap-1">
                <UncroppedImage src="/manlaptop.png" alt="Person uploading a resume on a laptop" size={98} />
                <UncroppedImage src="/womanlaptop.png" alt="Person preparing a resume on a laptop" size={98} />
              </div>
              <h3 className="mt-4 text-2xl font-black tracking-normal">Upload your CV</h3>
            </article>
            <article className="absolute right-[3%] top-[35%] flex w-52 flex-col items-center">
              <UncroppedImage src="/robot.webp" alt="AI robot reviewing a resume" size={112} />
              <h3 className="mt-4 text-2xl font-black tracking-normal">AI reads it</h3>
            </article>
            <article className="absolute bottom-[1%] left-1/2 flex w-52 flex-col items-center">
              <UncroppedImage src="/roasted.png" alt="Roasted resume with feedback" size={112} />
              <h3 className="mt-4 text-2xl font-black tracking-normal">Get roasted</h3>
            </article>
            <article className="absolute left-[3%] top-[35%] flex w-52 flex-col items-center">
              <div className="emoji text-7xl leading-none" role="img" aria-hidden>
                📈
              </div>
              <h3 className="mt-4 text-2xl font-black tracking-normal">Fix what matters</h3>
            </article>
          </div>
          <div className="mt-10 grid gap-4 md:hidden">
            {[
              ["Upload your CV", "upload"],
              ["AI reads it", "/robot.webp"],
              ["Get roasted", "/roasted.png"],
              ["Fix what matters", "chart"]
            ].map(([title, visual]) => (
              <article key={title} className="rounded-3xl border border-stone-200 bg-paper p-6">
                {visual === "upload" ? (
                  <div className="mx-auto flex items-end justify-center gap-1">
                    <UncroppedImage src="/manlaptop.png" alt="People uploading a resume on laptops" size={78} />
                    <UncroppedImage src="/womanlaptop.png" alt="Person preparing a resume on a laptop" size={78} />
                  </div>
                ) : visual === "chart" ? (
                  <div className="emoji text-6xl leading-none" role="img" aria-hidden>
                    📈
                  </div>
                ) : (
                  <UncroppedImage
                    src={visual}
                    alt={visual === "/robot.webp" ? "AI robot reviewing a resume" : "Roasted resume with feedback"}
                    size={92}
                  />
                )}
                <h3 className="mt-4 text-2xl font-black">{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {analysis ? (
          <motion.section
            id="results"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-6xl px-5 py-16 sm:px-8"
          >
            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-soft sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="rounded-[1.5rem] bg-ink p-7 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-stone-300">Your resume got roasted</p>
                    <Image src="/cv.png" alt="" width={34} height={34} className="rounded-md bg-white" />
                  </div>
                  <div className="mt-7 flex items-end gap-2">
                    <span className="text-8xl font-black leading-none">{analysis.score}</span>
                    <span className="pb-3 text-2xl font-black text-stone-300">/100</span>
                  </div>
                  <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-ember" style={{ width: `${analysis.score}%` }} />
                  </div>
                  <p className="mt-5 text-xl font-black">{analysis.verdict}</p>
                  <p className="mt-4 leading-7 text-stone-300">{analysis.summary}</p>
                  <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Impact", Math.max(8, Math.min(100, analysis.score - 8))],
                      ["ATS", Math.max(8, Math.min(100, analysis.score + 4))],
                      ["Clarity", Math.max(8, Math.min(100, analysis.score - 2))]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white/10 p-3">
                        <div className="text-xl font-black">{value}</div>
                        <div className="text-xs font-bold uppercase text-stone-300">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <section className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-stone-200 bg-paper p-6">
                    <h2 className="text-3xl font-black uppercase">The roast</h2>
                    <div className="mt-5 grid gap-3">
                      {analysis.roast.map((item, index) => (
                        <p key={item} className="rounded-2xl border border-stone-200 bg-white p-4 text-base font-semibold leading-7 shadow-sm">
                          <span className="mr-2 font-black text-ember">#{index + 1}</span>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-stone-500">Resume health chart</h3>
                      <div className="mt-5 space-y-4">
                        {[
                          ["Content", analysis.score],
                          ["Formatting", Math.max(10, Math.min(100, analysis.score + 7))],
                          ["Interview Readiness", Math.max(10, Math.min(100, analysis.score - 12))]
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="mb-2 flex justify-between text-sm font-black">
                              <span>{label}</span>
                              <span>{value}%</span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-stone-200">
                              <div className="h-full rounded-full bg-moss" style={{ width: `${value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-stone-500">Actions</h3>
                      <div className="mt-5 grid gap-3">
                        <button
                          type="button"
                          onClick={downloadRoast}
                          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black uppercase text-white"
                        >
                          <Download size={17} aria-hidden />
                          Download roast
                        </button>
                        <button
                          type="button"
                          onClick={generateCv}
                          disabled={isGeneratingCv || !file}
                          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ink bg-[#f8d8f3] px-5 py-3 text-sm font-black uppercase text-ink disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isGeneratingCv ? <RefreshCw className="animate-spin" size={17} aria-hidden /> : <Sparkles size={17} aria-hidden />}
                          {isGeneratingCv ? "Generating CV" : "Generate me a CV"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {generatedCv ? (
              <motion.section
                id="generated-cv"
                initial={{ opacity: 0, y: 32, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
                className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-7 shadow-soft"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-stone-500">Generated CV</p>
                    <h2 className="mt-2 text-2xl font-black uppercase">A cleaner draft based on your resume</h2>
                  </div>
                  <button
                    type="button"
                    onClick={downloadGeneratedCv}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-black uppercase"
                  >
                    <Download size={17} aria-hidden />
                    Download CV
                  </button>
                </div>
                <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-stone-200 bg-paper p-5 text-sm leading-7 text-stone-800">
                  {generatedCv}
                </pre>
              </motion.section>
            ) : null}

            <section className="mt-8">
              <h2 className="text-2xl font-black uppercase">What&apos;s holding you back</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {analysis.problems.map((problem) => (
                  <article key={problem.title} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-black">{problem.title}</h3>
                      <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${severityStyles(problem.severity)}`}>
                        {problem.severity}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-stone-600">{problem.explanation}</p>
                    <p className="mt-4 rounded-2xl bg-paper p-4 text-sm font-semibold leading-6 text-ink">{problem.fix}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
                <h2 className="text-2xl font-black uppercase">Fix these first</h2>
                <ol className="mt-5 space-y-3">
                  {analysis.quick_wins.map((win, index) => (
                    <li key={win} className="flex gap-3 rounded-2xl bg-paper p-4 text-sm font-bold leading-6">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss text-xs text-white">
                        {index + 1}
                      </span>
                      {win}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
                <h2 className="text-2xl font-black uppercase">Before / after</h2>
                <div className="mt-5 space-y-4">
                  {analysis.rewrite_examples.map((example) => (
                    <article key={example.original} className="grid gap-3">
                      <p className="rounded-2xl border border-stone-200 bg-[#fff3ef] p-4 text-sm leading-6 text-stone-700">
                        <strong>Before:</strong> {example.original}
                      </p>
                      <p className="rounded-2xl border border-stone-200 bg-[#edf8f2] p-4 text-sm leading-6 text-stone-700">
                        <strong>After:</strong> {example.improved}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-4 md:grid-cols-5">
              {Object.entries(analysis.sections).map(([name, value]) => (
                <article key={name} className="rounded-3xl border border-stone-200 bg-white p-5">
                  <h3 className="text-sm font-black uppercase text-stone-500">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700">{value}</p>
                </article>
              ))}
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
                <h2 className="text-2xl font-black uppercase">Shareable score</h2>
                <p className="mt-4 rounded-2xl bg-paper p-5 text-xl font-black">{shareText}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={copyResult} className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-black uppercase">
                    <Copy size={17} aria-hidden />
                    Copy result
                  </button>
                  <button onClick={shareResult} className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black uppercase text-white">
                    <Share2 size={17} aria-hidden />
                    Share
                  </button>
                  <button onClick={scrollToUpload} className="focus-ring inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-sm font-black uppercase">
                    <RefreshCw size={17} aria-hidden />
                    Try again
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-stone-200 bg-ink p-7 text-white shadow-soft">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-stone-300">Fixed your resume?</p>
                <h2 className="mt-4 text-3xl font-black">Now make sure you can actually defend it.</h2>
                <p className="mt-4 leading-7 text-stone-300">
                  Practice realistic job interviews with Rehearse after you apply the VibeJudge fixes.
                </p>
                <a href={rehearseUrl} onClick={() => trackEvent("rehearse_cta_clicked")} className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black uppercase text-ink">
                  Practice my interview
                  <Send size={17} aria-hidden />
                </a>
              </div>
            </section>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <section id="about" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-soft md:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-4xl font-black uppercase">Think your resume can survive?</h2>
            <p className="mt-4 text-lg leading-8 text-stone-600">Find out in seconds. No account, no checkout, no corporate ceremony.</p>
            <button
              type="button"
              onClick={scrollToUpload}
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-4 text-sm font-black uppercase text-white"
            >
              <Check size={18} aria-hidden />
              Roast my resume
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white px-5 py-8 sm:px-8 xl:hidden" aria-label="Rehearse promotion">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="text-2xl font-black leading-tight text-ink">
            Fix the CV.
            <br />
            Win the interview.
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
            {["Roast your resume first", "Practice realistic interview questions", "Stop freezing when they ask about your experience"].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href={rehearseUrl} onClick={() => trackEvent("rehearse_cta_clicked")}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink bg-[#f8d8f3] px-5 py-3 text-sm font-black text-ink transition hover:bg-ink hover:text-white"
          >
            <Send size={16} aria-hidden />
            Try Rehearse
          </a>
          <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-2">
            {testimonials.map(([src, quote]) => (
              <figure key={quote} className="flex gap-3">
                <img src={src} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <blockquote className="text-sm font-semibold leading-6 text-stone-700">&quot;{quote}&quot;</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white px-5 py-14 sm:px-8" aria-labelledby="resources-heading">
        <div className="mx-auto max-w-6xl">
          <h2 id="resources-heading" className="text-3xl font-black uppercase text-ink">
            Resume resources
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            Free guides, examples, and deep dives to make your resume impossible to ignore.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/ai-resume-checker", title: "AI Resume Checker", body: "How the instant resume check works." },
              { href: "/free-resume-checker", title: "Free Resume Checker", body: "What free includes. No signup needed." },
              { href: "/resume-review", title: "Resume Review", body: "The six-area review checklist." },
              { href: "/resume-roast", title: "Resume Roast", body: "Honest feedback with the roast format." },
              { href: "/resume-feedback", title: "Resume Feedback", body: "Turn feedback into a fix list." },
              { href: "/ats-resume-checker", title: "ATS Resume Checker", body: "See what the robots see." },
              { href: "/resume-examples", title: "Resume Examples", body: "Examples for 20+ roles and stages." },
              { href: "/guides", title: "Resume Guides", body: "Bullet points, summaries, ATS, gaps." }
            ].map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                className="focus-ring group rounded-3xl border border-stone-200 bg-paper p-5 transition hover:border-ink"
              >
                <span className="block font-black group-hover:text-ember">{resource.title}</span>
                <span className="mt-2 block text-sm leading-6 text-stone-600">{resource.body}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="hidden border-t border-stone-200 bg-white xl:block">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/cv.png" alt="" width={32} height={32} className="rounded-md" />
              <span className="font-black">VibeJudge</span>
            </div>
            <p className="mt-2 text-sm text-stone-500">AI-powered resume feedback without the corporate BS.</p>
            <a
              href="https://www.producthunt.com/products/vibejudge?utm_source=badge-follow&utm_medium=badge&utm_source=badge-vibejudge"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-4 inline-block rounded-lg"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1301141&theme=light"
                alt="VibeJudge - AI that brutally roasts your resume | Product Hunt"
                width={250}
                height={54}
                loading="lazy"
              />
            </a>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-stone-600" aria-label="Footer">
            <a href="#">Home</a>
            <a href="#how-it-works">How it works</a>
            <a href={rehearseUrl} onClick={() => trackEvent("rehearse_cta_clicked")}>Rehearse</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
          <p className="text-sm text-stone-500">Copyright 2026 VibeJudge.</p>
        </div>
      </footer>
    </main>
  );
}
