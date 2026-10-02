/*
 * Sinh URL nhúng Google Maps + URL chỉ đường cho 1 sự kiện.
 *
 * Trích từ logic các WeddingMap.vue (trước đây copy 26 lần)
 * về 1 chỗ dùng chung — EventMap.vue gọi hàm này.
 *
 * Thứ tự ưu tiên (giống WeddingMap cũ):
 *   1. MapEmbed / EmbedUrl — người dùng dán link embed sẵn
 *   2. Link Map có sẵn "output=embed" → dùng luôn
 *   3. Link Map dạng ?q=lat,lng → ghép &output=embed
 *   4. Địa chỉ (Address || Location) → tìm kiếm + embed
 *   5. Không suy ra được → "" (component tự ẩn iframe)
 */

const COORDS = /q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/;

function eventAddress(event) {
  return (
    event?.Address ||
    event?.address ||
    event?.Location ||
    event?.location ||
    event?.Place ||
    ""
  );
}

function rawMapLink(event) {
  return event?.Map || event?.MapUrl || event?.map || "";
}

export function mapEmbedUrl(event) {
  if (!event) {
    return "";
  }

  const embed = event.MapEmbed || event.EmbedUrl || "";

  if (embed) {
    return embed;
  }

  const raw = rawMapLink(event);

  if (raw.includes("output=embed")) {
    return raw;
  }

  const coords = raw.match(COORDS);

  if (coords) {
    return `https://www.google.com/maps?q=${coords[1]},${coords[2]}&output=embed`;
  }

  const address = eventAddress(event);

  if (!address) {
    return "";
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export function mapDirectionsUrl(event) {
  if (!event) {
    return "";
  }

  const raw = rawMapLink(event);

  if (raw) {
    return raw;
  }

  const address = eventAddress(event);

  if (!address) {
    return "";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}
