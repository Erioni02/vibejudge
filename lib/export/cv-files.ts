import type { ParsedCv } from "@/lib/cv/parse";
import { formatHeading } from "@/lib/cv/parse";
import { brandFonts, canvasToBlob, drawLines, wrapLines } from "@/lib/export/canvas";

/* ------------------------------------------------------------------ */
/* PDF: real, selectable text (ATS-readable), multi-page A4.          */
/* ------------------------------------------------------------------ */

// The PDF uses the built-in Helvetica font, which only covers the WinAnsi character set.
const winAnsiExtras = new Set("\u20ac\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\u017e\u0178");
const replacements: Record<string, string> = {
  "\u2010": "-", // hyphen
  "\u2011": "-", // non-breaking hyphen (common in AI output)
  "\u2012": "-", // figure dash
  "\u2212": "-", // minus sign
  "\u00a0": " ", // no-break space
  "\u2007": " ",
  "\u2009": " ",
  "\u200a": " ",
  "\u202f": " ",
  "\u200b": "", // zero-width space
  "\u2060": "",
  "\ufeff": ""
};

// Letters with no Unicode decomposition, approximated rather than dropped.
const approximations: Record<string, string> = {
  "\u0141": "L",
  "\u0142": "l",
  "\u0110": "D",
  "\u0111": "d",
  "\u0131": "i",
  "\u0126": "H",
  "\u0127": "h",
  "\u0166": "T",
  "\u0167": "t"
};

function isWinAnsi(char: string) {
  const code = char.charCodeAt(0);
  return (code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || winAnsiExtras.has(char);
}

/** Maps text onto WinAnsi. Reports whether any character had to be dropped or approximated. */
export function toPdfText(text: string) {
  let lossy = false;
  let out = "";

  for (const char of text.normalize("NFC")) {
    if (char in replacements) {
      out += replacements[char];
    } else if (isWinAnsi(char)) {
      out += char;
    } else {
      lossy = true;
      if (char in approximations) {
        out += approximations[char];
        continue;
      }
      // Try the unaccented base letter (e.g. "ą" → "a") before giving up.
      const base = char.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
      out += base && [...base].every(isWinAnsi) ? base : "?";
    }
  }

  return { text: out, lossy };
}

export async function renderCvPdf(cv: ParsedCv) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 54;
  const width = pageW - margin * 2;
  let y = margin;
  let lossy = false;

  const clean = (value: string) => {
    const result = toPdfText(value);
    if (result.lossy) lossy = true;
    return result.text;
  };

  const ensure = (height: number) => {
    if (y + height > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (text: string, x: number, maxWidth: number, size: number, style: "normal" | "bold", color: string, leading = 1.38) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(clean(text), maxWidth) as string[];
    for (const line of lines) {
      ensure(size * leading);
      doc.text(line, x, y + size);
      y += size * leading;
    }
  };

  write(cv.name, margin, width, 22, "bold", "#16130f", 1.2);
  if (cv.contact) {
    y += 2;
    write(cv.contact, margin, width, 9.5, "normal", "#6f675c");
  }
  y += 8;
  doc.setFillColor("#e2492f");
  doc.rect(margin, y, 44, 2.5, "F");
  y += 18;

  for (const section of cv.sections) {
    ensure(40);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor("#16130f");
    doc.text(clean(section.heading), margin, y + 9.5, { charSpace: 0.9 });
    y += 15;
    doc.setDrawColor("#e5dfd4");
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + width, y);
    y += 9;

    for (const line of section.lines) {
      if (line.kind === "role") {
        y += 3;
        write(line.title, margin, width, 10.5, "bold", "#16130f", 1.3);
        if (line.meta.length) write(line.meta.join("  ·  "), margin, width, 9, "normal", "#6f675c", 1.4);
        y += 2;
      } else if (line.kind === "bullet") {
        // Reserve the first line so the bullet dot never lands on a different page than its text.
        ensure(15);
        doc.setFillColor("#e2492f");
        doc.circle(margin + 3, y + 6.5, 1.6, "F");
        write(line.text, margin + 14, width - 14, 10, "normal", "#2b2620", 1.42);
        y += 2;
      } else if (line.kind === "pair") {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        const label = `${clean(line.label)}: `;
        const labelW = doc.getTextWidth(label);
        ensure(14);
        doc.setTextColor("#16130f");
        doc.text(label, margin, y + 10);
        const valueLines = doc.splitTextToSize(clean(line.value), width - labelW) as string[];
        doc.setFont("helvetica", "normal");
        doc.setTextColor("#2b2620");
        valueLines.forEach((valueLine, index) => {
          if (index > 0) ensure(14);
          doc.text(valueLine, margin + (index === 0 ? labelW : 0), y + 10);
          y += 14.2;
        });
        y += 2;
      } else {
        write(line.text, margin, width, 10, "normal", "#2b2620", 1.45);
        y += 3;
      }
    }
    y += 8;
  }

  return { blob: doc.output("blob"), lossy };
}

/* ------------------------------------------------------------------ */
/* PNG: single A4 page image, scaled down to fit (preserved format).   */
/* ------------------------------------------------------------------ */

const PNG_W = 1240;
const PNG_H = 1754;

export async function renderCvPng(cv: ParsedCv) {
  const canvas = document.createElement("canvas");
  canvas.width = PNG_W;
  canvas.height = PNG_H;
  const ctx = canvas.getContext("2d");
  const measure = document.createElement("canvas").getContext("2d");
  if (!ctx || !measure) throw new Error("Canvas is not supported in this browser");

  const fonts = await brandFonts();
  const x = 110;
  const width = PNG_W - x * 2;
  const bottom = PNG_H - 90;

  const draw = (target: CanvasRenderingContext2D, s: number) => {
    let y = 130;
    target.textBaseline = "alphabetic";
    target.fillStyle = "#16130f";
    target.font = `700 ${Math.round(56 * s)}px ${fonts.display}`;
    y = drawLines(target, wrapLines(target, cv.name, width), x, y, 62 * s);

    if (cv.contact) {
      target.fillStyle = "#6f675c";
      target.font = `500 ${Math.round(22 * s)}px ${fonts.sans}`;
      y = drawLines(target, wrapLines(target, cv.contact, width), x, y + 8 * s, 30 * s);
    }

    y += 18 * s;
    target.fillStyle = "#e2492f";
    target.fillRect(x, y, 90 * s, 5 * s);
    y += 64 * s;

    for (const section of cv.sections) {
      target.fillStyle = "#16130f";
      target.font = `700 ${Math.round(22 * s)}px ${fonts.sans}`;
      target.fillText(formatHeading(section.heading).toUpperCase(), x, y);
      y += 16 * s;
      target.fillStyle = "#e5dfd4";
      target.fillRect(x, y, width, Math.max(1, 2 * s));
      y += 40 * s;

      for (const line of section.lines) {
        if (line.kind === "role") {
          target.fillStyle = "#16130f";
          target.font = `700 ${Math.round(24 * s)}px ${fonts.sans}`;
          y = drawLines(target, wrapLines(target, line.title, width), x, y + 6 * s, 32 * s);
          if (line.meta.length) {
            target.fillStyle = "#6f675c";
            target.font = `500 ${Math.round(21 * s)}px ${fonts.sans}`;
            y = drawLines(target, wrapLines(target, line.meta.join("  ·  "), width), x, y, 30 * s);
          }
          y += 8 * s;
        } else if (line.kind === "bullet") {
          target.fillStyle = "#e2492f";
          target.beginPath();
          target.arc(x + 7, y - 8 * s, 4 * s, 0, Math.PI * 2);
          target.fill();
          target.fillStyle = "#2b2620";
          target.font = `400 ${Math.round(22 * s)}px ${fonts.sans}`;
          y = drawLines(target, wrapLines(target, line.text, width - 30), x + 30, y, 31 * s) + 8 * s;
        } else {
          const text = line.kind === "pair" ? `${line.label}: ${line.value}` : line.text;
          target.fillStyle = "#2b2620";
          target.font = `400 ${Math.round(22 * s)}px ${fonts.sans}`;
          y = drawLines(target, wrapLines(target, text, width), x, y, 31 * s) + 8 * s;
        }
        if (y > bottom) return y;
      }
      y += 26 * s;
      if (y > bottom) return y;
    }
    return y;
  };

  const scales = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58];
  const scale = scales.find((candidate) => draw(measure, candidate) <= bottom) ?? scales[scales.length - 1];

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PNG_W, PNG_H);
  draw(ctx, scale);

  return canvasToBlob(canvas);
}
