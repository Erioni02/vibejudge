/**
 * Turns the plain-text CV returned by /api/generate-cv into a structure that the
 * on-screen document, the PDF export, and the PNG export can all render consistently.
 */

export type CvLine =
  | { kind: "role"; title: string; meta: string[] }
  | { kind: "bullet"; text: string }
  | { kind: "pair"; label: string; value: string }
  | { kind: "text"; text: string };

export type CvSection = { heading: string; lines: CvLine[] };

export type ParsedCv = { name: string; contact: string; sections: CvSection[] };

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
  "WORK EXPERIENCE",
  "PROJECTS",
  "EDUCATION",
  "CERTIFICATIONS",
  "LANGUAGES",
  "AWARDS"
]);

const contactPattern = /(email|phone|linkedin|github|portfolio|website|@|\+\d{2,}|tel:|https?:\/\/|www\.)/i;
const bulletPattern = /^\s*[-*•–]\s+/;

function isHeading(line: string) {
  const normalized = line.toUpperCase().replace(/:+$/, "").trim();
  return knownHeadings.has(normalized) || (line.length <= 34 && /^[A-Z][A-Z\s/&-]+:?$/.test(line));
}

export function parseCv(raw: string): ParsedCv {
  const lines = raw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*/g, "")
    .split(/\n/)
    .map((line) => line.trim().replace(/^#+\s*/, ""))
    .filter((line) => line && !/^-{3,}$/.test(line) && !/^\|?[-\s|:]+\|?$/.test(line) && !line.includes("|---"));

  const name = (lines[0] ?? "Curriculum Vitae").replace(/^Name:\s*/i, "").slice(0, 90);
  const contactCandidate = lines[1] ?? "";
  const hasContact = contactPattern.test(contactCandidate) && !isHeading(contactCandidate);
  const contact = hasContact
    ? contactCandidate
        .replace(/\s*[|•]\s*/g, " · ")
        .replace(/\s{2,}/g, " ")
        .slice(0, 240)
    : "";
  const body = lines.slice(hasContact ? 2 : 1);

  const sections: CvSection[] = [];
  let current: CvSection | null = null;

  for (const line of body) {
    if (isHeading(line)) {
      const heading = line.toUpperCase().replace(/:+$/, "").trim();
      current = sections.find((section) => section.heading === heading) ?? null;

      if (!current) {
        current = { heading, lines: [] };
        sections.push(current);
      }
      continue;
    }

    if (!current) {
      current = { heading: "PROFILE", lines: [] };
      sections.push(current);
    }

    const isBullet = bulletPattern.test(line);
    const text = line.replace(bulletPattern, "").replace(/\s{2,}/g, " ").trim();
    if (!text) continue;

    const previous = current.lines[current.lines.length - 1];
    if (previous && "text" in previous && previous.text === text) continue;

    if (isBullet) {
      current.lines.push({ kind: "bullet", text });
    } else if (text.includes("|") && text.split("|").length >= 2) {
      const [title, ...meta] = text.split("|").map((part) => part.trim()).filter(Boolean);
      current.lines.push({ kind: "role", title: title ?? text, meta });
    } else if (/^[^:]{2,40}:\s+\S/.test(text) && !/^https?:/i.test(text)) {
      const index = text.indexOf(":");
      current.lines.push({ kind: "pair", label: text.slice(0, index).trim(), value: text.slice(index + 1).trim() });
    } else {
      current.lines.push({ kind: "text", text });
    }
  }

  return { name, contact, sections: sections.filter((section) => section.lines.length > 0) };
}

/** Title-cases an uppercase section heading for display ("PROFESSIONAL EXPERIENCE" → "Professional Experience"). */
export function formatHeading(heading: string) {
  return heading
    .toLowerCase()
    .split(" ")
    .map((word) => (word === "&" ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

/** A filename-safe slug derived from the candidate name. */
export function cvFileName(name: string, extension: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${slug || "cv"}-cv.${extension}`;
}
