const allowedTypes = new Map([
  ["application/pdf", "pdf"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
  ["text/plain", "txt"]
]);

const allowedExtensions = new Set(["pdf", "docx", "txt"]);

export const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024;
export const MAX_RESUME_CHARACTERS = 24000;
export const MIN_RESUME_CHARACTERS = 180;

export function validateResumeFile(file: File) {
  if (!file || file.size === 0) {
    return { ok: false as const, message: "That file looks empty. Even recruiters need something to ignore." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false as const, message: "Your resume is over 6MB. Compress it, then let us judge it." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const hasValidMime = allowedTypes.has(file.type);
  const hasValidExtension = allowedExtensions.has(extension);

  if (!hasValidMime && !hasValidExtension) {
    return { ok: false as const, message: "Upload a PDF, DOCX, or TXT file. Interpretive dance is not supported yet." };
  }

  return { ok: true as const, extension };
}

export function validateResumeText(text: string) {
  const cleaned = text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleaned.length < MIN_RESUME_CHARACTERS) {
    return { ok: false as const, message: "We could not find enough resume text to roast usefully." };
  }

  if (cleaned.length > MAX_RESUME_CHARACTERS) {
    const trimmed = cleaned.slice(0, MAX_RESUME_CHARACTERS);
    const lastBreak = trimmed.lastIndexOf("\n");
    const bounded = lastBreak > MAX_RESUME_CHARACTERS * 0.5 ? trimmed.slice(0, lastBreak) : trimmed;
    return { ok: true as const, text: bounded.trim() };
  }

  return { ok: true as const, text: cleaned };
}
