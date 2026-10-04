import { t } from "@/lang";

/*
 * =========================================================
 * NỘI DUNG MARKETING DÙNG CHUNG
 * =========================================================
 * Toàn bộ copy của trang chủ, các trang hỗ trợ và footer
 * được khai báo một lần ở đây — tránh mỗi trang lặp lại
 * một bản chữ khác nhau rồi lệch nhau sau vài lần sửa.
 *
 * ⚠ CẦN THAY BẰNG THÔNG TIN THẬT:
 *   CONTACT.facebook / zalo / messenger / email / phone
 *   PRICING_PLANS[].price
 * =========================================================
 */

export const BRAND = {
  name: "Thiệp Duyên",
  mark: "Thiệp",
  suffix: "Duyên",
  domain: "thiepduyen.com",
  siteUrl: "https://thiepduyen.vn",
  title: "Thiệp cưới online đẹp – Tạo thiệp cưới điện tử miễn phí",
  slogan: "Thiệp cưới online – Trao lời yêu, gửi một đời duyên.",
  description:
    "Thiệp Duyên giúp bạn tạo thiệp cưới online đẹp chỉ trong vài phút: " +
    "chọn mẫu, điền thông tin, gửi khách mời qua link hoặc mã QR. " +
    "Tạo miễn phí, dùng thử 3 ngày, ưng mới thanh toán.",
};

/*
 * Thông tin liên hệ — hiện là placeholder.
 * Thay bằng giá trị thật trước khi phát hành.
 */
export const CONTACT = {
  facebook: "https://www.facebook.com/your-page",
  zalo: "",
  messenger: "https://m.me/470216759513444",
  email: "hotro@thiepduyen.vn",
  phone: "0900 000 000",
  get hours() { return t("contact.hours"); },
  address: "Việt Nam",
};

export function phoneHref(phone = CONTACT.phone) {
  return String(phone).replace(/[^0-9+]/g, "");
}

/*
 * Danh tính đơn vị nhận thanh toán — hiển thị trên trang thanh toán
 * để người chuyển khoản biết tiền đang đi đâu.
 *
 * ⚠ ĐỂ TRỐNG nếu chưa có. Dòng nào trống thì tự ẩn, KHÔNG hiện số giả
 *   và KHÔNG bịa. Điền đủ trước khi phát hành.
 *
 * Vì sao cần: khách sắp chuyển tiền cho một website họ vừa mở lần đầu.
 * Một cái tên pháp lý + mã số thuế + địa chỉ thật là thứ khiến họ dám bấm
 * "chuyển khoản". Thiếu những dòng này thì trang vẫn chạy, chỉ là khó tin hơn.
 */
export const BUSINESS = {
  legalName: "", // Tên pháp lý / hộ kinh doanh
  taxCode: "", // Mã số thuế
  address: "", // Địa chỉ đăng ký
  supportPhone: "", // SĐT hỗ trợ — trống thì lấy CONTACT.phone
  supportEmail: "", // Email hỗ trợ — trống thì lấy CONTACT.email
};

/*
 * Điều hướng chính — dùng cho header, menu di động
 * và cột "Khám phá" ở footer.
 */
export const NAV_LINKS = [
  { get label() { return t("nav.home"); }, routeName: "Home" },
  { get label() { return t("nav.templates"); }, routeName: "Templates" },
  { get label() { return t("nav.pricing"); }, routeName: "Pricing" },
  { get label() { return t("nav.guide"); }, routeName: "Guide" },
  { get label() { return t("nav.about"); }, routeName: "About" },
  { get label() { return t("nav.contact"); }, routeName: "Contact" },
];

/*
 * Liên kết phụ ở chân trang — nhóm theo chủ đề.
 *
 * Nhóm đặt `contact: true` render dạng danh sách liên hệ
 * (icon + link mailto/tel) thay vì router-link; `note` nếu có
 * hiển thị thành đoạn ghi chú dưới danh sách.
 */
export const FOOTER_GROUPS = [
  {
    get title() { return t("footer.explore"); },
    links: [
      { get label() { return t("nav.home"); }, routeName: "Home" },
      { get label() { return t("nav.templates"); }, routeName: "Templates" },
      { get label() { return t("footer.createNow"); }, routeName: "Editor" },
      { get label() { return t("nav.myWeddings"); }, routeName: "Manage" },
    ],
  },
  {
    get title() { return t("footer.support"); },
    links: [
      { get label() { return t("nav.pricing"); }, routeName: "Pricing" },
      { get label() { return t("footer.guideFull"); }, routeName: "Guide" },
      { get label() { return t("nav.about"); }, routeName: "About" },
      { get label() { return t("nav.contact"); }, routeName: "Contact" },
    ],
  },
  {
    get title() { return t("footer.styles"); },
    links: [
      { get label() { return t("footer.online"); }, routeName: "WeddingOnline" },
      { get label() { return t("footer.featured"); }, routeName: "TemplatesFeatured" },
      { get label() { return t("footer.modern"); }, routeName: "TemplatesModern" },
      { get label() { return t("footer.traditional"); }, routeName: "TemplatesTraditional" },
    ],
  },
  {
    get title() { return t("nav.contact"); },
    contact: true,
    links: [
      { icon: "mdi-clock-outline", get label() { return t("footer.supportHours", { hours: CONTACT.hours }); } },
      { icon: "mdi-email-outline", label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { icon: "mdi-phone-outline", label: CONTACT.phone, href: `tel:${phoneHref()}` },
    ],
    get note() { return t("footer.contactNote"); },
  },
];

/*
 * Tính năng — lưới bento ở trang chủ.
 */
export const FEATURES = [
  {
    orn: "囍",
    get title() { return t("features.asian.title"); },
    get text() { return t("features.asian.text"); },
  },
  {
    orn: "✦",
    get title() { return t("features.editor.title"); },
    get text() { return t("features.editor.text"); },
  },
  {
    orn: "❀",
    get title() { return t("features.devices.title"); },
    get text() { return t("features.devices.text"); },
  },
  {
    orn: "❖",
    get title() { return t("features.map.title"); },
    get text() { return t("features.map.text"); },
  },
  {
    orn: "✽",
    get title() { return t("features.gifts.title"); },
    get text() { return t("features.gifts.text"); },
  },
  {
    orn: "❝",
    get title() { return t("features.guestbook.title"); },
    get text() { return t("features.guestbook.text"); },
  },
  {
    orn: "❦",
    get title() { return t("features.album.title"); },
    get text() { return t("features.album.text"); },
  },
  {
    orn: "◈",
    get title() { return t("features.domain.title"); },
    get text() { return t("features.domain.text"); },
  },
];

/*
 * Quy trình 3 bước.
 */
export const STEPS = [
  {
    seal: "壹",
    get title() { return t("steps.pick.title"); },
    get text() { return t("steps.pick.text"); },
    get short() { return t("steps.pick.short"); },
  },
  {
    seal: "贰",
    get title() { return t("steps.fill.title"); },
    get text() { return t("steps.fill.text"); },
    get short() { return t("steps.fill.short"); },
  },
  {
    seal: "叁",
    get title() { return t("steps.send.title"); },
    get text() { return t("steps.send.text"); },
    get short() { return t("steps.send.short"); },
  },
];

/*
 * Nhóm tính năng chi tiết — khối tab ở trang chủ.
 * Mỗi nhóm có ảnh minh hoạ lấy từ template-preview.
 */
export const FEATURE_GROUPS = [
  {
    id: "thiep",
    get label() { return t("fg.card.label"); },
    get title() { return t("fg.card.title"); },
    get text() { return t("fg.card.text"); },
    image: "song_hy_red",
    get points() {
      return [
        t("fg.card.p1"),
        t("fg.card.p2"),
        t("fg.card.p3"),
        t("fg.card.p4"),
      ];
    },
  },
  {
    id: "khach-moi",
    get label() { return t("fg.guests.label"); },
    get title() { return t("fg.guests.title"); },
    get text() { return t("fg.guests.text"); },
    image: "jasmine_white",
    get points() {
      return [
        t("fg.guests.p1"),
        t("fg.guests.p2"),
        t("fg.guests.p3"),
        t("fg.guests.p4"),
      ];
    },
  },
  {
    id: "mung-cuoi",
    get label() { return t("fg.gifts.label"); },
    get title() { return t("fg.gifts.title"); },
    get text() { return t("fg.gifts.text"); },
    image: "baroque_gold",
    get points() {
      return [
        t("fg.gifts.p1"),
        t("fg.gifts.p2"),
        t("fg.gifts.p3"),
        t("fg.gifts.p4"),
      ];
    },
  },
  {
    id: "luu-but",
    get label() { return t("fg.guestbook.label"); },
    get title() { return t("fg.guestbook.title"); },
    get text() { return t("fg.guestbook.text"); },
    image: "cherry_blossom_pink",
    get points() {
      return [
        t("fg.guestbook.p1"),
        t("fg.guestbook.p2"),
        t("fg.guestbook.p3"),
        t("fg.guestbook.p4"),
      ];
    },
  },
];

/*
 * Đánh giá của khách hàng.
 */
export const TESTIMONIALS = [
  {
    name: "Minh Anh & Quốc Bảo",
    get meta() { return t("testi.1.meta"); },
    get text() { return t("testi.1.text"); },
    orn: "囍",
  },
  {
    name: "Thu Hà & Đức Long",
    get meta() { return t("testi.2.meta"); },
    get text() { return t("testi.2.text"); },
    orn: "❀",
  },
  {
    name: "Ngọc Trâm & Hoàng Nam",
    get meta() { return t("testi.3.meta"); },
    get text() { return t("testi.3.text"); },
    orn: "❝",
  },
  {
    name: "Lan Phương & Tuấn Kiệt",
    get meta() { return t("testi.4.meta"); },
    get text() { return t("testi.4.text"); },
    orn: "✦",
  },
  {
    name: "Diệu Linh & Trọng Nghĩa",
    get meta() { return t("testi.5.meta"); },
    get text() { return t("testi.5.text"); },
    orn: "❦",
  },
  {
    name: "Thanh Vân & Hữu Phước",
    get meta() { return t("testi.6.meta"); },
    get text() { return t("testi.6.text"); },
    orn: "◈",
  },
];

/*
 * Bảng giá.
 *
 * ⚠ Giá gói "Trọn đời" lấy theo con số duy nhất đang có
 * trong hệ thống (WeddingPayment.vue — FALLBACK_PAYMENT_INFO).
 * Cần xác nhận lại trước khi công bố chính thức.
 */
export const PRICING_PLANS = [
  {
    id: "mien-phi",
    get name() { return t("plan.free.name"); },
    price: 0,
    priceLabel: "0đ",
    get unit() { return t("plan.free.unit"); },
    get tagline() { return t("plan.free.tagline"); },
    highlight: false,
    get cta() { return t("plan.free.cta"); },
    get features() {
      return [
        t("plan.free.f1"),
        t("plan.free.f2"),
        t("plan.free.f3"),
        t("plan.free.f4"),
      ];
    },
    get missing() {
      return [
        t("plan.free.m1"),
        t("plan.free.m2"),
        t("plan.free.m3"),
      ];
    },
  },
  {
    id: "tron-doi",
    get name() { return t("plan.life.name"); },
    price: 50000,
    priceLabel: "50.000đ",
    get unit() { return t("plan.life.unit"); },
    get tagline() { return t("plan.life.tagline"); },
    highlight: true,
    get cta() { return t("plan.life.cta"); },
    get features() {
      return [
        t("plan.life.f1"),
        t("plan.life.f2"),
        t("plan.life.f3"),
        t("plan.life.f4"),
        t("plan.life.f5"),
        t("plan.life.f6"),
        t("plan.life.f7"),
        t("plan.life.f8"),
      ];
    },
    missing: [],
  },
  {
    id: "cao-cap",
    get name() { return t("plan.premium.name"); },
    price: null,
    get priceLabel() { return t("nav.contact"); },
    get unit() { return t("plan.premium.unit"); },
    get tagline() { return t("plan.premium.tagline"); },
    highlight: false,
    get cta() { return t("plan.premium.cta"); },
    get features() {
      return [
        t("plan.premium.f1"),
        t("plan.premium.f2"),
        t("plan.premium.f3"),
        t("plan.premium.f4"),
        t("plan.premium.f5"),
      ];
    },
    missing: [],
  },
];

/*
 * Gói trả phí mặc định — nguồn duy nhất cho con số hiển thị
 * ở bước xuất bản thiệp (PublishDialog) và ở trang thanh toán.
 *
 * Trước đây giá chỉ nằm trong PRICING_PLANS (trang marketing)
 * còn hộp thoại xuất bản chỉ ghi "thanh toán một lần" mà không
 * nói bao nhiêu — chủ thiệp phải bấm sang trang thanh toán mới
 * biết giá. Lấy từ đây để hai chỗ không lệch nhau.
 */
export const PAID_PLAN =
  PRICING_PLANS.find((plan) => plan.highlight) || PRICING_PLANS[1];

/*
 * Nhãn giá hiển thị trên trang công khai (trang chủ, Bảng giá,
 * trang đích SEO).
 *
 * Con số cụ thể chỉ xuất hiện ở bước xuất bản thiệp — lúc đó
 * chủ thiệp đã dựng xong thiệp và đang thật sự cân nhắc trả
 * tiền, nên giá là thông tin hữu ích. Để giá trên trang công
 * khai chỉ khiến khách so giá trước khi thấy sản phẩm.
 */
export function publicPriceLabel(plan) {
  if (!plan) {
    return "";
  }

  if (plan.price === 0) {
    return plan.priceLabel;
  }

  if (plan.price === null) {
    return plan.priceLabel;
  }

  return t("plan.payOnPublish");
}

/*
 * Câu hỏi thường gặp — dùng cho trang chủ và trang Hướng dẫn.
 */
export const FAQS = [
  {
    get q() { return t("faq.1.q"); },
    get a() { return t("faq.1.a"); },
  },
  {
    get q() { return t("faq.2.q"); },
    get a() { return t("faq.2.a"); },
  },
  {
    get q() { return t("faq.3.q"); },
    get a() { return t("faq.3.a"); },
  },
  {
    get q() { return t("faq.4.q"); },
    get a() { return t("faq.4.a"); },
  },
  {
    get q() { return t("faq.5.q"); },
    get a() { return t("faq.5.a"); },
  },
  {
    get q() { return t("faq.6.q"); },
    get a() { return t("faq.6.a"); },
  },
  {
    get q() { return t("faq.7.q"); },
    get a() { return t("faq.7.a"); },
  },
  {
    get q() { return t("faq.8.q"); },
    get a() { return t("faq.8.a"); },
  },
  {
    get q() { return t("faq.9.q"); },
    get a() { return t("faq.9.a"); },
  },
  {
    get q() { return t("faq.10.q"); },
    get a() { return t("faq.10.a"); },
  },
];

/*
 * Bộ sưu tập → trang đích tương ứng.
 * Dùng cho khối "Bộ sưu tập theo phong cách" ở trang chủ.
 */
export const COLLECTION_LANDING = {
  "truyen-thong": {
    routeName: "TemplatesTraditional",
    get title() { return t("col.traditional.title"); },
    get text() { return t("col.traditional.text"); },
  },
  "lang-man": {
    routeName: "TemplatesModern",
    get title() { return t("col.romantic.title"); },
    get text() { return t("col.romantic.text"); },
  },
  "hien-dai": {
    routeName: "TemplatesModern",
    get title() { return t("col.modern.title"); },
    get text() { return t("col.modern.text"); },
  },
  "co-dien": {
    routeName: "TemplatesFeatured",
    get title() { return t("col.classic.title"); },
    get text() { return t("col.classic.text"); },
  },
  "nghe-thuat": {
    routeName: "TemplatesFeatured",
    get title() { return t("col.art.title"); },
    get text() { return t("col.art.text"); },
  },
  "thien-nhien": {
    routeName: "TemplatesFeatured",
    get title() { return t("col.nature.title"); },
    get text() { return t("col.nature.text"); },
  },
  "a-dong": {
    routeName: "TemplatesTraditional",
    get title() { return t("col.asian.title"); },
    get text() { return t("col.asian.text"); },
  },
};

/*
 * Số liệu tin cậy — dùng ở hero và trang Giới thiệu.
 */
export const STATS = [
  { value: "26+", get label() { return t("stats.templates"); } },
  { value: "7", get label() { return t("stats.collections"); } },
  { get value() { return t("stats.trialValue"); }, get label() { return t("stats.trial"); } },
];

export const ABOUT_STATS = [
  { value: "12.000+", get label() { return t("stats.created"); } },
  { value: "26+", get label() { return t("stats.designs"); } },
  { value: "7", get label() { return t("stats.collections"); } },
  { value: "4,9/5", get label() { return t("stats.rating"); } },
];

/*
 * Giá trị cốt lõi — trang Giới thiệu.
 */
export const VALUES = [
  {
    orn: "囍",
    get title() { return t("values.1.title"); },
    get text() { return t("values.1.text"); },
  },
  {
    orn: "✦",
    get title() { return t("values.2.title"); },
    get text() { return t("values.2.text"); },
  },
  {
    orn: "❀",
    get title() { return t("values.3.title"); },
    get text() { return t("values.3.text"); },
  },
  {
    orn: "❝",
    get title() { return t("values.4.title"); },
    get text() { return t("values.4.text"); },
  },
];

/*
 * Checklist chuẩn bị nội dung — trang Hướng dẫn.
 */
export const GUIDE_CHECKLIST = [
  {
    get group() { return t("guide.c1.group"); },
    get items() {
      return [
        t("guide.c1.i1"),
        t("guide.c1.i2"),
        t("guide.c1.i3"),
      ];
    },
  },
  {
    get group() { return t("guide.c2.group"); },
    get items() {
      return [
        t("guide.c2.i1"),
        t("guide.c2.i2"),
        t("guide.c2.i3"),
      ];
    },
  },
  {
    get group() { return t("guide.c3.group"); },
    get items() {
      return [
        t("guide.c3.i1"),
        t("guide.c3.i2"),
        t("guide.c3.i3"),
      ];
    },
  },
  {
    get group() { return t("guide.c4.group"); },
    get items() {
      return [
        t("guide.c4.i1"),
        t("guide.c4.i2"),
        t("guide.c4.i3"),
      ];
    },
  },
  {
    get group() { return t("guide.c5.group"); },
    get items() {
      return [
        t("guide.c5.i1"),
        t("guide.c5.i2"),
        t("guide.c5.i3"),
      ];
    },
  },
];

/*
 * Mẹo nhỏ — trang Hướng dẫn.
 */
export const GUIDE_TIPS = [
  {
    orn: "◈",
    get title() { return t("guide.t1.title"); },
    get text() { return t("guide.t1.text"); },
  },
  {
    orn: "✦",
    get title() { return t("guide.t2.title"); },
    get text() { return t("guide.t2.text"); },
  },
  {
    orn: "❀",
    get title() { return t("guide.t3.title"); },
    get text() { return t("guide.t3.text"); },
  },
  {
    orn: "❝",
    get title() { return t("guide.t4.title"); },
    get text() { return t("guide.t4.text"); },
  },
];

/*
 * Câu hỏi riêng cho trang Bảng giá.
 */
export const PRICING_FAQS = [
  {
    get q() { return t("pfaq.1.q"); },
    get a() { return t("pfaq.1.a"); },
  },
  {
    get q() { return t("pfaq.2.q"); },
    get a() { return t("pfaq.2.a"); },
  },
  {
    get q() { return t("pfaq.3.q"); },
    get a() { return t("pfaq.3.a"); },
  },
  {
    get q() { return t("pfaq.4.q"); },
    get a() { return t("pfaq.4.a"); },
  },
  {
    id: "refund",
    get q() { return t("pfaq.5.q"); },
    get a() { return t("pfaq.5.a"); },
  },
];

/*
 * Chính sách hoàn tiền — trích thẳng từ PRICING_FAQS để trang thanh toán
 * và trang Bảng giá không nói hai câu khác nhau. Sửa câu trả lời ở trên
 * là trang thanh toán tự cập nhật theo.
 */
export const REFUND_POLICY = {
  get text() {
    return PRICING_FAQS.find((item) => item.id === "refund")?.a || "";
  },
};

/*
 * Chủ đề cho form liên hệ.
 */
export const CONTACT_TOPICS = [
  "Tư vấn chọn mẫu thiệp",
  "Hỗ trợ kỹ thuật khi tạo thiệp",
  "Thanh toán và kích hoạt",
  "Yêu cầu thiết kế riêng",
  "Hợp tác / quảng cáo",
  "Khác",
];
