export type MediaKind = "youtube" | "instagram" | "drive" | "file" | "iframe";

export function detectMediaKind(rawUrl: string): MediaKind {
  const url = rawUrl.toLowerCase();
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("drive.google.com")) return "drive";
  if (/\.(mp4|webm|ogg)(\?|$)/.test(url)) return "file";
  return "iframe";
}

export function youtubeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const id = url.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
    if (url.pathname.startsWith("/embed/")) return rawUrl;
  } catch {
    return null;
  }
  return null;
}

export function youtubeVideoId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }
    if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    return url.searchParams.get("v");
  } catch {
    return null;
  }
}

export function videoPosterUrl(rawUrl: string): string | null {
  const kind = detectMediaKind(rawUrl);
  if (kind === "youtube") {
    const id = youtubeVideoId(rawUrl);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  if (kind === "drive") {
    const fileMatch = rawUrl.match(/\/file\/d\/([^/]+)/);
    let id = fileMatch?.[1] ?? null;
    if (!id) {
      try {
        id = new URL(rawUrl).searchParams.get("id");
      } catch {
        id = null;
      }
    }
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w320` : null;
  }
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("imagekit.io")) {
      return `${url.origin}${url.pathname.replace(/\/$/, "")}/ik-thumbnail.jpg`;
    }
    if (url.hostname.includes("res.cloudinary.com") && url.pathname.includes("/video/upload/")) {
      const jpg = url.pathname
        .replace("/video/upload/", "/video/upload/so_0,w_320,h_320,c_fill/")
        .replace(/\.(mp4|webm|mov|ogg)$/i, ".jpg");
      return `${url.origin}${jpg}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function driveEmbedUrl(rawUrl: string): string {
  const fileMatch = rawUrl.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  return rawUrl.replace("/view", "/preview");
}
