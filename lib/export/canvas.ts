/** Browser-only helpers shared by the roast card and CV exports. */

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking synchronously can cancel the download in Safari and Firefox.
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not render image"))), "image/png");
  });
}

/** Resolves the real font-family name behind a next/font CSS variable so canvas text matches the site. */
export async function brandFonts() {
  if (document.fonts?.ready) await document.fonts.ready;
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => {
    const value = styles.getPropertyValue(name).trim();
    return value ? `${value}, ${fallback}` : fallback;
  };

  return {
    sans: read("--font-inter", "Arial, sans-serif"),
    display: read("--font-display", "Arial, sans-serif"),
    serif: read("--font-serif", "Georgia, serif")
  };
}

export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines = Infinity) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  let consumed = 0;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      if (lines.length === maxLines) break;
      line = word;
    } else {
      line = candidate;
    }
    consumed += 1;
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  } else if (consumed < words.length && lines.length) {
    // Truncated: mark the last visible line.
    let last = lines[lines.length - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    lines[lines.length - 1] = `${last.replace(/[\s,.;:]+$/, "")}…`;
  }

  return lines;
}

export function drawLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, lineHeight: number) {
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}
