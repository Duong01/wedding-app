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

  /*
   * og:image bắt buộc URL TUYỆT ĐỐI (Facebook/Zalo không
   * nhận đường dẫn tương đối). Ảnh asset của Vite trong
   * production có dạng "/assets/..." → ghép thêm siteUrl.
   */
  const absoluteUrl = (image) => {
    if (!image) {
      return "";
    }

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${BRAND.siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const apply = () => {
    const {
      title,
      description = BRAND.description,
      path = "",
      image,
      jsonLd = null,
      noindex = false,
    } = resolve() || {};

    const fullTitle = title
      ? `${title} | ${BRAND.name}`
      : BRAND.title;

    document.title = fullTitle;

    const url = `${BRAND.siteUrl}${path}`;

    upsertMeta("name", "description", description);

    /*
     * Luôn khai báo robots — trang thường thì "index, follow";
     * trang khai báo noindex (thiệp nháp/khóa, trang nội bộ)
     * thì "noindex, nofollow". Viết đè mỗi lần để không giữ
     * lại giá trị của trang trước khi điều hướng.
     */
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", BRAND.name);
    upsertMeta("property", "og:locale", "vi_VN");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);

    /*
     * Trang không khai báo ảnh riêng (vd trang Bảng giá)
     * → dùng logo thương hiệu, để link chia sẻ lúc nào
     * cũng có ảnh và không giữ lại ảnh của trang trước.
     */
    const shareImage = absoluteUrl(image || BRAND.ogImage);

    upsertMeta("property", "og:image", shareImage);
    upsertMeta("name", "twitter:image", shareImage);

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
