"use client";

import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MIN_BUILDER_SUBSTANCE, builderAnswersSchema, builderSubstance, type BuilderAnswers } from "@/lib/validation/builder";

type Field = {
  key: keyof BuilderAnswers;
  label: string;
  placeholder: string;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
  half?: boolean;
};

type Step = {
  title: string;
  hint: string;
  fields: Field[];
  optional?: boolean;
};

const steps: Step[] = [
  {
    title: "What job are you going for?",
    hint: "Be specific. “Junior data analyst” beats “anything in tech”.",
    fields: [{ key: "targetRole", label: "Target role", placeholder: "e.g. Junior marketing assistant" }]
  },
  {
    title: "Who's this CV for?",
    hint: "Only name and email are required.",
    fields: [
      { key: "fullName", label: "Full name", placeholder: "Alex Rivera", autoComplete: "name" },
      { key: "email", label: "Email", placeholder: "alex@email.com", type: "email", autoComplete: "email" },
      { key: "phone", label: "Phone", placeholder: "Optional", type: "tel", autoComplete: "tel", half: true },
      { key: "location", label: "City", placeholder: "Optional", autoComplete: "address-level2", half: true },
      { key: "link", label: "LinkedIn or portfolio", placeholder: "Optional", type: "url" }
    ]
  },
  {
    title: "Education",
    hint: "School, college, university, courses, bootcamps — whatever applies.",
    optional: true,
    fields: [
      {
        key: "education",
        label: "Education",
        multiline: true,
        placeholder: "BSc Psychology, University of Leeds, 2021–2024. Dissertation on social media and attention. Grade: 2:1."
      }
    ]
  },
  {
    title: "Any work experience?",
    hint: "It all counts: part-time jobs, family business, freelancing, babysitting. Write what you did, not just the title.",
    optional: true,
    fields: [
      {
        key: "experience",
        label: "Work experience",
        multiline: true,
        placeholder: "Barista at Costa, 2022–now: open the shop on weekends, trained 3 new starters, handle the till during rush hour."
      }
    ]
  },
  {
    title: "Projects, volunteering, clubs",
    hint: "Side projects, societies, sports teams, volunteering, anything you organised.",
    optional: true,
    fields: [
      {
        key: "activities",
        label: "Projects and activities",
        multiline: true,
        placeholder: "Treasurer of the uni hiking society (60 members). Built a budgeting spreadsheet the whole society now uses."
      }
    ]
  },
  {
    title: "Skills and tools",
    hint: "Software, languages, certificates, practical skills.",
    optional: true,
    fields: [
      { key: "skills", label: "Skills", multiline: true, placeholder: "Excel, Canva, Google Analytics basics, Spanish (fluent), customer service, first aid certificate" }
    ]
  },
  {
    title: "One thing you're proud of",
    hint: "A result, a challenge you handled, something people thank you for. Numbers help if you have them — but only real ones.",
    optional: true,
    fields: [
      {
        key: "proudOf",
        label: "Something you're proud of",
        multiline: true,
        placeholder: "Raised £1,200 for a local food bank by organising a charity quiz night with two friends."
      }
    ]
  }
];

const lastStep = steps.length - 1;

export function CvBuilder({
  answers,
  onChange,
  onSubmit,
  busy,
  error,
  onStart
}: {
  answers: BuilderAnswers;
  onChange: (answers: BuilderAnswers) => void;
  onSubmit: () => void;
  busy: boolean;
  error: string;
  onStart: () => void;
}) {
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const onStartRef = useRef(onStart);
  const isFirstRender = useRef(true);
  const current = steps[step];

  // Fire onStart once on mount; afterwards, focus the first field whenever the step changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      onStartRef.current();
      return;
    }
    firstFieldRef.current?.focus();
  }, [step]);

  function update(key: keyof BuilderAnswers, value: string) {
    setStepError("");
    onChange({ ...answers, [key]: value });
  }

  /** Validates only the fields on the current step, plus the "enough material" check on the last one. */
  function validateStep() {
    const keys = current.fields.map((field) => field.key);
    const result = builderAnswersSchema.safeParse(answers);
    const issue = result.success ? null : result.error.issues.find((item) => keys.includes(item.path[0] as keyof BuilderAnswers));
    if (issue) return issue.message;
    if (step === lastStep && builderSubstance(answers) < MIN_BUILDER_SUBSTANCE) {
      return "Add a little more about your education, experience, or activities — the CV can only use what you tell it.";
    }
    return "";
  }

  function next() {
    const problem = validateStep();
    if (problem) {
      setStepError(problem);
      return;
    }
    if (step === lastStep) onSubmit();
    else setStep(step + 1);
  }

  const shownError = stepError || error;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        next();
      }}
      noValidate
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tabular-nums text-ink-3">
          Step {step + 1} of {steps.length}
        </p>
        {current.optional ? <p className="text-xs text-ink-3">Optional — skip if it doesn&apos;t apply</p> : null}
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-paper-2" aria-hidden>
        <div className="h-full rounded-full bg-ember transition-[width] duration-base ease-out" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>

      <div key={step} className="animate-fade-up">
        <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{current.title}</h3>
        <p className="mt-1 text-[13px] leading-5 text-ink-3">{current.hint}</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {current.fields.map((field, index) => {
            const common = {
              id: `builder-${field.key}`,
              value: answers[field.key],
              placeholder: field.placeholder,
              onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field.key, event.target.value),
              className:
                "focus-ring block w-full rounded-control border border-line-strong bg-paper px-3.5 py-2.5 text-sm leading-6 text-ink placeholder:text-ink-3/80 focus:bg-white"
            };
            return (
              <div key={field.key} className={field.half ? "col-span-1" : "col-span-2"}>
                <label htmlFor={common.id} className="sr-only">
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea {...common} ref={index === 0 ? (node) => void (firstFieldRef.current = node) : undefined} rows={5} className={`${common.className} resize-none`} />
                ) : (
                  <input
                    {...common}
                    ref={index === 0 ? (node) => void (firstFieldRef.current = node) : undefined}
                    type={field.type ?? "text"}
                    autoComplete={field.autoComplete}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {shownError ? (
        <p className="mt-3 flex gap-2 rounded-control bg-ember-soft/70 p-3 text-sm leading-6 text-ink" role="alert">
          <AlertCircle size={16} className="mt-1 shrink-0 text-ember" aria-hidden />
          {shownError}
        </p>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} disabled={busy} className="btn btn-ghost !px-3" aria-label="Previous step">
            <ArrowLeft size={16} aria-hidden />
          </button>
        ) : null}
        {current.optional && step < lastStep ? (
          <button type="button" onClick={() => setStep(step + 1)} className="btn btn-ghost">
            Skip
          </button>
        ) : null}
        <button type="submit" disabled={busy} aria-busy={busy} className={`btn ml-auto ${step === lastStep ? "btn-primary btn-lg flex-1" : "btn-dark"}`}>
          {step === lastStep ? (
            <>
              {busy ? <Loader2 size={17} className="animate-spin" aria-hidden /> : <Sparkles size={17} aria-hidden />}
              {busy ? "Writing your CV…" : "Build my CV — Free"}
            </>
          ) : (
            <>
              Next
              <ArrowRight size={16} aria-hidden />
            </>
          )}
        </button>
      </div>
      {step === lastStep ? (
        <p className="mt-3 text-center text-xs leading-5 text-ink-3">We only use what you wrote. Nothing is invented, and nothing is stored.</p>
      ) : null}
    </form>
  );
}
