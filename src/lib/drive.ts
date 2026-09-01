export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;

  // Patterns for Google Drive file IDs:
  // 1. https://drive.google.com/file/d/FILE_ID/...
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch?.[1]) return fileDMatch[1];

  // 2. https://drive.google.com/open?id=FILE_ID or ?id=FILE_ID or &id=FILE_ID
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch?.[1]) return idParamMatch[1];

  // 3. https://drive.google.com/uc?export=...&id=FILE_ID
  const ucMatch = url.match(/\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch?.[1]) return ucMatch[1];

  // 4. https://docs.google.com/document/d/FILE_ID/ or /presentation/d/FILE_ID/ or /spreadsheets/d/FILE_ID/
  const docMatch = url.match(/\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (docMatch?.[1]) return docMatch[1];

  return null;
}

export function formatGoogleDriveUrl(url: string): string {
  if (!url) return "";

  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // If it's a generic google drive link containing /view, replace with /preview
  if (url.includes("drive.google.com") && url.includes("/view")) {
    return url.replace(/\/view(?:\?.*)?$/, "/preview");
  }

  return url;
}

export function getPdfProxyUrl(url: string): string {
  if (!url) return "";
  return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
}

export function formatGoogleDriveDownloadUrl(url: string): string {
  if (!url) return "";

  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return url;
}
