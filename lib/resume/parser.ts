import mammoth from "mammoth";
import pdf from "pdf-parse";

export async function extractResumeText(file: File, extension: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const normalizedExtension = extension.toLowerCase();

  if (normalizedExtension === "txt" || file.type === "text/plain") {
    return buffer.toString("utf8");
  }

  if (normalizedExtension === "docx" || file.type.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (normalizedExtension === "pdf" || file.type === "application/pdf") {
    const result = await pdf(buffer);
    return result.text;
  }

  throw new Error("Unsupported resume format");
}
