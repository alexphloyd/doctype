export function generatePreview(content: string, maxLength = 370) {
  let preview = content.substring(0, maxLength);
  if (content.length > maxLength) {
    preview += '...';
  }

  return preview;
}
