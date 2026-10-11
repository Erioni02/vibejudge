import type { ResumeAnalysis } from "@/lib/types";
import { scoreBand } from "@/lib/score";
import { brandFonts, canvasToBlob, drawLines, roundRect, wrapLines } from "@/lib/export/canvas";

export type RoastCardOptions = {
  /** When false the card only shows the score and verdict — the most privacy-conservative option. */
  includeRoast: boolean;
};

const W = 1080;
const H = 1350;
const PAD = 84;

/**
 * Renders a 4:5 share card (Instagram/LinkedIn friendly). It never includes the CV file,
 * the candidate's name, or contact details — only the score, verdict, and optionally the roast lines.
 */
export async function renderRoastCard(analysis: ResumeAnalysis, options: RoastCardOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  const fonts = await brandFonts();
  const band = scoreBand(analysis.score);
  const innerW = W - PAD * 2;

  // Paper background
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 0, W, H);

  // Brand row
  ctx.fillStyle = "#16130f";
  roundRect(ctx, PAD, 72, 52, 52, 12);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 30px ${fonts.display}`;
  ctx.textAlign = "center";
  ctx.fillText("V", PAD + 26, 109);
  ctx.textAlign = "left";
  ctx.fillStyle = "#16130f";
  ctx.font = `700 34px ${fonts.display}`;
  ctx.fillText("VibeJudge", PAD + 70, 110);
  ctx.textAlign = "right";
  ctx.fillStyle = "#6f675c";
  ctx.font = `600 20px ${fonts.sans}`;
  ctx.fillText("CV ROAST REPORT", W - PAD, 106);
  ctx.textAlign = "left";

  // Score panel
  const panelY = 164;
  const panelH = 300;
  ctx.fillStyle = "#16130f";
  roundRect(ctx, PAD, panelY, innerW, panelH, 28);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 196px ${fonts.display}`;
  const scoreText = String(Math.round(analysis.score));
  ctx.fillText(scoreText, PAD + 48, panelY + 214);
  const scoreWidth = ctx.measureText(scoreText).width;
  ctx.fillStyle = "#a59b8c";
  ctx.font = `600 48px ${fonts.display}`;
  ctx.fillText("/100", PAD + 60 + scoreWidth, panelY + 212);

  // Band pill
  ctx.font = `600 24px ${fonts.sans}`;
  const pillText = band.label.toUpperCase();
  const pillW = ctx.measureText(pillText).width + 40;
  ctx.fillStyle = band.hex;
  roundRect(ctx, W - PAD - 48 - pillW, panelY + 52, pillW, 48, 24);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillText(pillText, W - PAD - 48 - pillW + 20, panelY + 84);

  // Progress bar
  const barX = PAD + 48;
  const barW = innerW - 96;
  ctx.fillStyle = "#3d3730";
  roundRect(ctx, barX, panelY + 246, barW, 12, 6);
  ctx.fill();
  ctx.fillStyle = band.hex === "#2f6b57" ? "#5fae8f" : band.hex;
  roundRect(ctx, barX, panelY + 246, Math.max(12, (barW * analysis.score) / 100), 12, 6);
  ctx.fill();

  // Verdict
  let y = panelY + panelH + 84;
  ctx.fillStyle = "#16130f";
  ctx.font = `700 50px ${fonts.display}`;
  y = drawLines(ctx, wrapLines(ctx, analysis.verdict, innerW, options.includeRoast ? 3 : 4), PAD, y, 60) + 22;

  const footerTop = H - 150;

  if (options.includeRoast) {
    ctx.fillStyle = "#e2492f";
    ctx.font = `600 22px ${fonts.sans}`;
    ctx.fillText("THE ROAST", PAD, y + 8);
    y += 58;

    for (const [index, line] of analysis.roast.slice(0, 3).entries()) {
      ctx.font = `italic 400 42px ${fonts.serif}`;
      const lines = wrapLines(ctx, `“${line}”`, innerW - 64, 3);
      const blockH = lines.length * 52;
      if (y + blockH > footerTop - 20) break;

      ctx.fillStyle = "#e2492f";
      ctx.font = `700 26px ${fonts.display}`;
      ctx.fillText(String(index + 1).padStart(2, "0"), PAD, y);
      ctx.fillStyle = "#16130f";
      ctx.font = `italic 400 42px ${fonts.serif}`;
      y = drawLines(ctx, lines, PAD + 64, y, 52) + 34;
    }
  } else {
    ctx.fillStyle = "#3d3730";
    ctx.font = `400 32px ${fonts.sans}`;
    drawLines(ctx, wrapLines(ctx, analysis.summary, innerW, 5), PAD, y + 10, 46);
  }

  // Footer
  ctx.strokeStyle = "#cfc6b6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, footerTop + 20);
  ctx.lineTo(W - PAD, footerTop + 20);
  ctx.stroke();
  ctx.fillStyle = "#16130f";
  ctx.font = `600 28px ${fonts.display}`;
  ctx.fillText("Think your CV can survive?", PAD, footerTop + 76);
  ctx.fillStyle = "#6f675c";
  ctx.font = `500 24px ${fonts.sans}`;
  ctx.fillText("Get roasted free at vibejudge.app", PAD, footerTop + 112);

  return canvasToBlob(canvas);
}
