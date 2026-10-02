/*
 * Parse link video YouTube / TikTok → URL nhúng iframe.
 *
 * Hỗ trợ:
 *   YouTube: youtube.com/watch?v=ID · youtu.be/ID ·
 *            youtube.com/shorts/ID · youtube.com/embed/ID
 *   TikTok:  tiktok.com/@user/video/ID
 *
 * Link khác / rỗng → null — component tự fallback link
 * thường, không bao giờ để mục video chết.
 */

const YOUTUBE_ID = /[A-Za-z0-9_-]{11}/;

function parseYouTube(url) {
  let id = "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      id = parsed.pathname.slice(1);
    } else if (parsed.pathname.startsWith("/shorts/") || parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/")[2] || "";
    } else if (parsed.searchParams.get("v")) {
      id = parsed.searchParams.get("v");
    }
  } catch {
    /*
     * URL không hợp lệ — thử match ID thô để chấp nhận
     * cả link dán thiếu "https://".
     */
    const raw = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
    id = raw ? raw[1] : "";
  }

  id = (id || "").split(/[?&#]/)[0];

  if (!id || !YOUTUBE_ID.test(id)) {
    return null;
  }

  return {
    provider: "youtube",
    videoId: id,
    embedUrl: `https://www.youtube.com/embed/${id}?rel=0`,
    posterUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

function parseTikTok(url) {
  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("tiktok.com")) {
      return null;
    }

    /*
     * Chỉ lấy ID số sau /video/ — embed/v2 chỉ cần ID,
     * không cần username.
     */
    const match = parsed.pathname.match(/\/video\/(\d+)/);

    if (!match) {
      return null;
    }

    return {
      provider: "tiktok",
      videoId: match[1],
      embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}`,
      /*
       * TikTok không có thumbnail free không qua oEmbed —
       * poster dùng nền gradient + nút play chung.
       */
      posterUrl: "",
    };
  } catch {
    return null;
  }
}

export function parseVideoUrl(raw) {
  const url = typeof raw === "string" ? raw.trim() : "";

  if (!url) {
    return null;
  }

  return parseYouTube(url) || parseTikTok(url);
}

/*
 * Bật autoplay cho embed YouTube.
 *
 * Trình duyệt chỉ cho autoplay trong iframe cross-origin khi
 * TẮT TIẾNG (mute=1) — có tiếng thì luôn chặn. Video chạy
 * ngay khi khách lướt tới, khách bấm icon loa trên player
 * để bật tiếng.
 */
export function autoplayUrl(embedUrl) {
  if (!embedUrl || !embedUrl.includes("youtube.com")) {
    return embedUrl;
  }

  const withAutoplay = embedUrl.includes("autoplay=")
    ? embedUrl
    : `${embedUrl}&autoplay=1`;

  return withAutoplay.includes("mute=")
    ? withAutoplay
    : `${withAutoplay}&mute=1`;
}
