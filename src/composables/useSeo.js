import { onBeforeUnmount, watch } from "vue";

import { BRAND } from "@/data/siteContent";

/*
 * =========================================================
 * SEO CHO TỪNG TRANG
 * =========================================================
 * Router guard chỉ set document.title. Composable này bổ
 * sung phần còn lại: meta description, canonical, thẻ OG
 * và JSON-LD — để mỗi trang marketing có thẻ riêng khi
 * chia sẻ lên Facebook/Zalo và khi Google index.
 *
 * Cách dùng:
 *   useSeo({
 *     title: "Bảng giá",
 *     description: "...",
 *     path: "/bang-gia",
 *     jsonLd: { "@context": ..., "@type": ... },
 *   });
 *
 * Gọi trong <script setup> — tự chạy khi mount và tự dọn
 * JSON-LD khi rời trang.
 * =========================================================
 */

const JSON_LD_ID = "page-json-ld";

function upsertMeta(attr, key, content) {
  if (!content) {
    return;
  }

  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");

    tag.setAttribute(attr, key);

    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function upsertCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");

    link.setAttribute("rel", "canonical");

    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function upsertJsonLd(data) {
  const existing = document.getElementById(JSON_LD_ID);

  if (existing) {
    existing.remove();
  }

  if (!data) {
    return;
  }

  const script = document.createElement("script");

  script.type = "application/ld+json";
  script.id = JSON_LD_ID;
  script.textContent = JSON.stringify(data);

  document.head.appendChild(script);
}

export function useSeo(options = {}) {
  /*
   * Cho phép truyền thẳng object, hoặc một hàm trả về
   * object — dạng hàm cần thiết khi cùng một component
   * phục vụ nhiều route (các trang đích SEO dùng chung
   * Templates.vue) và thẻ phải đổi theo route.
   */
  const resolve = typeof options === "function" ? options : () => options;

  const apply = () => {
    const {
      title,
      description = BRAND.description,
      path = "",
      image,
      jsonLd = null,
    } = resolve() || {};

    const fullTitle = title
      ? `${title} | ${BRAND.name}`
      : BRAND.title;

    document.title = fullTitle;

    const url = `${BRAND.siteUrl}${path}`;

    upsertMeta("name", "description", description);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", BRAND.name);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);

    if (image) {
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
    }

    upsertCanonical(url);

    upsertJsonLd(jsonLd);
  };

  apply();

  if (typeof options === "function") {
    watch(options, apply);
  } else if (options.watchSource) {
    watch(options.watchSource, apply);
  }

  onBeforeUnmount(() => {
    document.getElementById(JSON_LD_ID)?.remove();
  });
}

/*
 * Bộ JSON-LD dựng sẵn cho vài loại trang.
 */

export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.siteUrl,
    description: BRAND.description,
    slogan: BRAND.slogan,
  };
}

/*
 * Dữ liệu có cấu trúc cho trang Bảng giá.
 *
 * Cố ý KHÔNG kèm `price`: giá chỉ hiện ở bước xuất bản thiệp,
 * nên công bố con số trong JSON-LD (thứ Google đọc và có thể
 * hiển thị thẳng trên kết quả tìm kiếm) sẽ đi ngược lại ý đó.
 * Vẫn khai báo các gói để Google hiểu đây là sản phẩm có nhiều
 * mức, chỉ là chưa nêu giá.
 */
export function productJsonLd(plans) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${BRAND.name} — Thiệp cưới online`,
    description: BRAND.description,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      availability: "https://schema.org/InStock",
    })),
  };
}
