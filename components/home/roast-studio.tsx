"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeAnalysis } from "@/lib/types";
import { analyticsHeaders, trackEvent } from "@/lib/analytics/client";
import { parseLegacyChallenge } from "@/lib/challenge";
import { scoreBand } from "@/lib/score";
import { validateResumeFile } from "@/lib/validation/resume";
import { HeroPreview } from "@/components/home/hero-preview";
import { UploadPanel, type InputMode, type RoastStatus } from "@/components/home/upload-panel";
import { RoastReport } from "@/components/roast/roast-report";
import { CvWorkspace, type CvOrigin } from "@/components/cv/cv-workspace";
import { CvBuilder } from "@/components/home/cv-builder";
import { emptyBuilderAnswers, type BuilderAnswers } from "@/lib/validation/builder";

type CvStatus = "idle" | "loading" | "done" | "error";

class AbortedError extends Error {}
/** The request never reached the server, so no server-side event exists for it. */
class NetworkError extends Error {}

/** POSTs form data and always returns a friendly error message, even for non-JSON failures (e.g. 413 from the host). */
async function postForm<T>(url: string, body: FormData | string, signal: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      body,
      signal,
      // Anonymous analytics ids, so the server can attribute the confirmed outcome. No CV data.
      headers: { ...analyticsHeaders(), ...(typeof body === "string" ? { "Content-Type": "application/json" } : {}) }
    });
  } catch {
    if (signal.aborted) throw new AbortedError();
    throw new NetworkError("Network hiccup. Check your connection and try again.");
  }

  let payload: (T & { error?: string }) | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload) {
    if (response.status === 413) throw new Error("That file is too large to upload. Try a smaller PDF, or paste the text instead.");
    if (response.status === 429 && !payload?.error) throw new Error("Too many requests for now. Try again in a little while.");
    throw new Error(payload?.error || "Something went wrong on our side. Give it another shot.");
  }

  return payload;
}

function scrollToId(id: string) {
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}

export function RoastStudio({
  initialChallengeScore = null,
  challengeCode = null
}: {
  initialChallengeScore?: number | null;
  challengeCode?: string | null;
}) {
  const [mode, setMode] = useState<InputMode>("file");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");

  const [roastStatus, setRoastStatus] = useState<RoastStatus>("idle");
  const [roastError, setRoastError] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [cvStatus, setCvStatus] = useState<CvStatus>("idle");
  const [cvText, setCvText] = useState("");
  const [cvError, setCvError] = useState("");
  const [cvOrigin, setCvOrigin] = useState<CvOrigin>("original");
  const [builderAnswers, setBuilderAnswers] = useState<BuilderAnswers>(emptyBuilderAnswers);
  // In "No CV yet" mode, the CV the builder wrote becomes the input for roasting and rewriting.
  const [builtCvSource, setBuiltCvSource] = useState<string | null>(null);

  const [challengeScore, setChallengeScore] = useState<number | null>(initialChallengeScore);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const roastAbort = useRef<AbortController | null>(null);
  const cvAbort = useRef<AbortController | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const timer = window.setTimeout(() => setToastVisible(false), 3200);
    return () => window.clearTimeout(timer);
  }, [toast, toastVisible]);

  // Roast-off links (/k3x9q2mf, or legacy /?vs=54) carry only a score.
  useEffect(() => {
    const score = initialChallengeScore ?? parseLegacyChallenge(window.location.search);
    if (score !== null) {
      setChallengeScore(score);
      trackEvent("roast_off_share_opened", { entityId: challengeCode ?? undefined, meta: { legacy: !challengeCode } });
    }
  }, [initialChallengeScore, challengeCode]);

  /** Something a visitor did on a shared roast-off page (only when they arrived through one). */
  function trackRoastOff(action: "upload_started" | "roast_completed" | "generation_started") {
    if (challengeScore === null) return;
    trackEvent("roast_off_interaction", { entityId: challengeCode ?? undefined, meta: { action } });
  }

  useEffect(
    () => () => {
      roastAbort.current?.abort();
      cvAbort.current?.abort();
    },
    []
  );

  function clearResults() {
    roastAbort.current?.abort();
    cvAbort.current?.abort();
    setAnalysis(null);
    setRoastStatus("idle");
    setRoastError("");
    setCvStatus("idle");
    setCvText("");
    setCvError("");
  }

  function handleFile(next: File | null) {
    clearResults();

    if (!next) {
      setFile(null);
      return;
    }

    const validation = validateResumeFile(next);
    if (!validation.ok) {
      setFile(null);
      setRoastError(validation.message);
      return;
    }

    setFile(next);
    trackEvent("cv_upload_started", { meta: { input: "file" } });
    trackRoastOff("upload_started");
  }

  function handleText(next: string) {
    if (analysis || cvStatus !== "idle") clearResults();
    setRoastError("");
    setText(next);
  }

  function buildForm() {
    const form = new FormData();
    if (mode === "build" && builtCvSource) form.append("text", builtCvSource);
    else if (mode === "text") form.append("text", text);
    else if (file) form.append("resume", file);
    return form;
  }

  async function roast() {
    roastAbort.current?.abort();
    if (mode === "build") scrollToId("upload");
    const controller = new AbortController();
    roastAbort.current = controller;

    setRoastStatus("loading");
    setRoastError("");

    // Roast started/completed/failed are recorded by /api/analyze itself, after the real outcome.
    try {
      const payload = await postForm<{ analysis: ResumeAnalysis }>("/api/analyze", buildForm(), controller.signal);
      setAnalysis(payload.analysis);
      setRoastStatus("done");
      trackRoastOff("roast_completed");
      notify("Roast complete. Emotional damage delivered.");
      scrollToId("results");
    } catch (cause) {
      if (cause instanceof AbortedError) {
        trackEvent("cv_roast_abandoned");
        setRoastStatus("idle");
        return;
      }
      if (cause instanceof NetworkError) trackEvent("client_error", { meta: { feature: "roast", reason: "network" } });
      setRoastStatus("error");
      setRoastError(cause instanceof Error ? cause.message : "We could not roast your CV right now.");
    }
  }

  async function generateCv() {
    cvAbort.current?.abort();
    const controller = new AbortController();
    cvAbort.current = controller;

    const form = buildForm();
    if (analysis) form.append("analysis", JSON.stringify(analysis));

    setCvOrigin(analysis ? "roast" : "original");
    setCvStatus("loading");
    setCvError("");
    trackRoastOff("generation_started");
    scrollToId("new-cv");

    // Generation started/completed/failed are recorded by /api/generate-cv after the real outcome.
    try {
      const payload = await postForm<{ cv: string }>("/api/generate-cv", form, controller.signal);
      setCvText(payload.cv);
      setCvStatus("done");
      notify("Your new CV is ready.");
      scrollToId("new-cv");
    } catch (cause) {
      if (cause instanceof AbortedError) {
        trackEvent("cv_generation_abandoned");
        setCvStatus(cvText ? "done" : "idle");
        return;
      }
      if (cause instanceof NetworkError) trackEvent("client_error", { meta: { feature: "generation", reason: "network" } });
      setCvStatus("error");
      setCvError(cause instanceof Error ? cause.message : "We could not generate your new CV right now.");
    }
  }

  async function buildFromAnswers() {
    cvAbort.current?.abort();
    const controller = new AbortController();
    cvAbort.current = controller;

    setAnalysis(null);
    setRoastStatus("idle");
    setBuiltCvSource(null);
    setCvOrigin("answers");
    setCvStatus("loading");
    setCvError("");
    scrollToId("new-cv");

    try {
      const payload = await postForm<{ cv: string }>("/api/build-cv", JSON.stringify({ answers: builderAnswers }), controller.signal);
      setCvText(payload.cv);
      setBuiltCvSource(payload.cv);
      setCvStatus("done");
      notify("Your first CV is ready.");
      scrollToId("new-cv");
    } catch (cause) {
      if (cause instanceof AbortedError) {
        trackEvent("cv_generation_abandoned");
        setCvStatus(cvText ? "done" : "idle");
        return;
      }
      if (cause instanceof NetworkError) trackEvent("client_error", { meta: { feature: "builder", reason: "network" } });
      setCvStatus("error");
      setCvError(cause instanceof Error ? cause.message : "We could not build your CV right now.");
    }
  }

  function startOver() {
    clearResults();
    setFile(null);
    setText("");
    setBuiltCvSource(null);
    scrollToId("top");
  }

  const sourceLabel = mode === "file" && file ? file.name : mode === "build" ? "Your new CV" : "Pasted CV text";
  const showResults = Boolean(analysis) || cvStatus !== "idle";

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-20 z-50 mx-auto lg:bottom-5 flex w-[calc(100%-2rem)] max-w-sm items-center gap-2.5 rounded-control bg-ink px-4 py-3 text-sm font-medium text-white shadow-lift transition duration-base ease-out ${
          toastVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {toast ? <Check size={16} className="shrink-0 text-[#7fd1ae]" aria-hidden /> : null}
        {toast}
      </div>

      {/* Hero */}
      <section id="top" className="relative scroll-mt-24 overflow-hidden">
        <div className="section grid items-start gap-12 pb-16 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:gap-16 lg:pb-24 lg:pt-14">
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            {challengeScore !== null ? (
              <p className="flex animate-fade-up items-center gap-3 rounded-card border border-line bg-white px-4 py-3 text-sm leading-6 text-ink-2">
                <span className="emoji text-xl leading-none" aria-hidden>
                  🥊
                </span>
                <span>
                  <span className="font-semibold text-ink">Roast-off:</span> a friend scored{" "}
                  <span className="font-semibold text-ink">{challengeScore}/100</span> ({scoreBand(challengeScore).label}). Can your
                  CV beat it?
                </span>
              </p>
            ) : null}
            <h1
              className={`animate-fade-up text-balance font-display text-display-xl font-semibold text-ink [animation-delay:60ms] ${
                challengeScore !== null ? "mt-5" : ""
              }`}
            >
              Your CV is getting ignored.{" "}
              <span className="block font-serif font-normal italic tracking-[-0.02em] text-ember">Here&apos;s why.</span>
            </h1>
            <p className="mt-4 max-w-lg animate-fade-up text-[17px] leading-[1.7] text-ink-2 [animation-delay:120ms]">
              Upload it and get a score out of 100, a brutally honest roast, and the exact fixes. Takes under a minute.
            </p>

            <div className="mt-7 animate-fade-up [animation-delay:180ms]">
              <UploadPanel
                mode={mode}
                onModeChange={(next) => {
                  setMode(next);
                  setRoastError("");
                }}
                file={file}
                onFile={handleFile}
                text={text}
                onText={handleText}
                status={roastStatus}
                error={roastError}
                hasResult={Boolean(analysis)}
                cvBusy={cvStatus === "loading"}
                onRoast={roast}
                onGenerate={generateCv}
                onCancel={() => roastAbort.current?.abort()}
                onViewResults={() => scrollToId("results")}
                builder={
                  builtCvSource ? (
                    <div className="py-2 text-center">
                      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-moss-soft text-moss">
                        <Check size={20} aria-hidden />
                      </span>
                      <p className="mt-3 font-display text-lg font-semibold tracking-tight">Your first CV is ready.</p>
                      <p className="mt-1 text-sm text-ink-3">Download it, or see if it survives the judge.</p>
                      <div className="mt-4 grid gap-2">
                        {analysis ? (
                          <button type="button" onClick={() => scrollToId("results")} className="btn btn-dark btn-lg w-full">
                            View your roast
                          </button>
                        ) : (
                          <button type="button" onClick={roast} disabled={cvStatus === "loading"} className="btn btn-primary btn-lg w-full">
                            Now roast my new CV
                          </button>
                        )}
                        <button type="button" onClick={() => scrollToId("new-cv")} className="btn btn-secondary w-full">
                          View my CV
                        </button>
                        <button type="button" onClick={startOver} className="btn btn-ghost btn-sm">
                          Start over with new answers
                        </button>
                      </div>
                    </div>
                  ) : (
                  <CvBuilder
                    answers={builderAnswers}
                    onChange={setBuilderAnswers}
                    onSubmit={buildFromAnswers}
                    busy={cvStatus === "loading"}
                    error=""
                    onStart={() => trackEvent("builder_started")}
                  />
                  )
                }
              />
            </div>
          </div>

          <div className="hidden lg:block lg:self-center">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* Results */}
      {showResults ? (
        <section id="results" className="scroll-mt-20 border-y border-line bg-white py-12 sm:py-16" aria-label="Your results">
          <div className="section">
            {analysis ? (
              <RoastReport
                analysis={analysis}
                sourceLabel={sourceLabel}
                challengeScore={challengeScore}
                cvStatus={cvStatus}
                onGenerateCv={generateCv}
                onViewCv={() => scrollToId("new-cv")}
                onReset={startOver}
                notify={notify}
              />
            ) : null}

            {cvStatus !== "idle" ? (
              <div id="new-cv" className={`scroll-mt-20 ${analysis ? "mt-16 border-t border-line pt-16" : ""}`}>
                <CvWorkspace
                  status={cvStatus}
                  cvText={cvText}
                  error={cvError}
                  origin={cvOrigin}
                  onChange={(next) => {
                    setCvText(next);
                    if (cvOrigin === "answers") setBuiltCvSource(next);
                  }}
                  onRetry={cvOrigin === "answers" ? buildFromAnswers : generateCv}
                  onCancel={() => cvAbort.current?.abort()}
                  notify={notify}
                />
                {!analysis && cvStatus === "done" ? (
                  <div className="mt-10 flex flex-col items-center gap-3 text-center">
                    <p className="text-sm text-ink-2">
                      {cvOrigin === "answers" ? "Think it can survive the judge?" : "Curious what the judge thinks of your original?"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        scrollToId("upload");
                        void roast();
                      }}
                      className={`btn ${cvOrigin === "answers" ? "btn-primary" : "btn-secondary"}`}
                    >
                      {cvOrigin === "answers" ? "Now roast my new CV" : "Roast my original CV"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
