import fs from "fs/promises";

export async function extractTextFromFile(
  filePath: string,
  mimetype: string
): Promise<string | undefined> {
  if (mimetype === "text/plain" || mimetype.startsWith("text/")) {
    return fs.readFile(filePath, "utf-8");
  }

  if (mimetype === "application/pdf") {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    } catch {
      return undefined;
    }
  }

  return undefined;
}
