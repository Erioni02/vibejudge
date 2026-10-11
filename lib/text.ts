/** The model occasionally wraps words in *asterisks*, **bold**, __underscores__ or `backticks`; show plain text instead. */
export function stripMarkdown(text: string) {
  return text.replace(/(\*\*|\*|__|`)(.+?)\1/g, "$2");
}
