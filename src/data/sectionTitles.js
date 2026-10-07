import { t } from "@/lang";

import { effectiveGameType, gameTypeMeta } from "@/data/gameData";

/*
 * Tiêu đề các mục trên thiệp (section titles).
 *
 * Mỗi mục có thể có 3 dòng:
 *
 *   Eyebrow  — dòng nhỏ in hoa phía trên tiêu đề
 *   Heading  — tiêu đề chính
 *   Intro    — dòng mô tả ngắn dưới tiêu đề
 *
 * Người dùng sửa ở panel "Tiêu đề mục"; giá trị lưu vào
 * wedding.sections[key][field]. Bỏ trống = dùng lại giá
 * trị mặc định của mẫu thiệp (khai báo ở DEFAULT bên dưới).
 *
 * Nhờ vậy dữ liệu cũ (chưa có wedding.sections) vẫn hiển
 * thị đúng như trước, không cần migrate.
 */

/*
 * Thứ tự phần tử ở đây cũng là thứ tự hiển thị
 * trong panel chỉnh sửa.
 */
export const SECTION_TITLES = [
  {
    key: "opening",
    get label() { return t("sections.opening"); },
    icon: "mdi-email-open-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "THIỆP MỜI CƯỚI" },
      { name: "Kicker", get label() { return t("sections.field.kicker"); }, default: "SAVE THE DATE" },
      { name: "Invite", get label() { return t("sections.field.invite"); }, default: "Trân trọng kính mời" },
      { name: "Button", get label() { return t("sections.field.button"); }, default: "CHẠM ĐỂ MỞ THIỆP" },
      {
        name: "Hint",
        get label() { return t("sections.field.hint"); },
        default: "Một lời mời · Một câu chuyện · Một ngày đặc biệt",
      },
    ],
  },

  {
    key: "couple",
    get label() { return t("sections.couple"); },
    icon: "mdi-heart-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "TRÂN TRỌNG BÁO HỶ" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Thông tin tiệc cưới" },
    ],
  },

  {
    key: "story",
    get label() { return t("sections.story"); },
    icon: "mdi-book-heart-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "CÂU CHUYỆN CỦA CHÚNG MÌNH" },
      /*
       * Heading của mục này mặc định lấy từ story.Title
       * (panel "Chuyện tình yêu") nên default để trống.
       */
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "" },
    ],
  },

  {
    key: "video",
    get label() { return t("sections.video"); },
    icon: "mdi-play-circle-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "KHOẢNH KHẮC YÊU THƯƠNG" },
      /*
       * Heading mặc định lấy từ video.Title (panel
       * "Video cưới") nên default để trống.
       */
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "" },
    ],
  },

  {
    key: "events",
    get label() { return t("sections.events"); },
    icon: "mdi-glass-cocktail",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "TIỆC BÁO HỶ" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Thông tin tiệc báo hỷ" },
    ],
  },

  {
    key: "dressCode",
    get label() { return t("sections.dressCode"); },
    icon: "mdi-tshirt-crew-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "TRANG PHỤC" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Dress Code" },
      { name: "Intro", get label() { return t("sections.field.intro"); }, default: "Trang phục dự tiệc" },
    ],
  },

  {
    key: "timeline",
    get label() { return t("sections.timeline"); },
    icon: "mdi-timeline-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "DẤU MỐC YÊU THƯƠNG" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Hành trình của chúng mình" },
      {
        name: "Intro",
        get label() { return t("sections.field.intro"); },
        default: "Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay",
      },
    ],
  },

  {
    key: "countdown",
    get label() { return t("sections.countdown"); },
    icon: "mdi-timer-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "NGÀY VUI ĐANG ĐẾN GẦN" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Đếm ngược" },
    ],
  },

  {
    key: "gallery",
    get label() { return t("sections.gallery"); },
    icon: "mdi-image-multiple-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "KỶ NIỆM TƯƠI ĐẸP" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Album Hình Cưới" },
      {
        name: "Intro",
        get label() { return t("sections.field.intro"); },
        default: "Những khoảnh khắc đẹp nhất\nđược lưu giữ cùng chúng mình",
      },
    ],
  },

  {
    key: "game",
    get label() { return t("sections.game"); },
    icon: "mdi-party-popper",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "CÙNG VUI CHƠI" },
      /*
       * Heading mặc định lấy từ game.Title (panel
       * "Trò chơi") nên default để trống.
       */
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "" },
      /*
       * Intro mặc định lấy theo loại game
       * (gameTypeMeta(type).intro) — để trống.
       */
      { name: "Intro", get label() { return t("sections.field.intro"); }, default: "" },
    ],
  },

  {
    key: "gifts",
    get label() { return t("sections.gifts"); },
    icon: "mdi-gift-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "GỬI YÊU THƯƠNG" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Hộp mừng cưới" },
      {
        name: "Intro",
        get label() { return t("sections.field.intro"); },
        default:
          "Những lời chúc và tình cảm của bạn\nlà món quà quý giá nhất dành cho chúng mình",
      },
    ],
  },

  {
    key: "guestbook",
    get label() { return t("sections.guestbook"); },
    icon: "mdi-message-heart-outline",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "LỜI CHÚC TỪ BẠN" },
      { name: "Heading", get label() { return t("sections.field.heading"); }, default: "Sổ lưu bút" },
      {
        name: "Intro",
        get label() { return t("sections.field.intro"); },
        default:
          "Mỗi lời chúc là một kỷ niệm đẹp\nmà chúng mình muốn lưu giữ trong ngày đặc biệt này",
      },
    ],
  },

  {
    key: "footer",
    get label() { return t("sections.footer"); },
    icon: "mdi-page-layout-footer",
    fields: [
      { name: "Eyebrow", get label() { return t("sections.field.eyebrow"); }, default: "SAVE THE DATE" },
    ],
  },
];

/*
 * Giá trị người dùng đã nhập cho 1 ô, hoặc "" nếu
 * chưa nhập (kể cả khi wedding.sections chưa tồn tại).
 */
export function sectionOverride(sections, key, field) {
  const value = sections?.[key]?.[field];

  return typeof value === "string" ? value.trim() : "";
}

/*
 * Nội dung hiển thị của 1 ô: ưu tiên giá trị người dùng
 * nhập, nếu trống thì rơi về mặc định của mẫu thiệp.
 *
 * `fallback` cho phép mỗi mẫu truyền câu chữ riêng của
 * mình — mặc định chung trong SECTION_TITLES chỉ dùng khi
 * mẫu không truyền gì.
 */
export function sectionText(sections, key, field, fallback = "") {
  const override = sectionOverride(sections, key, field);

  if (override) {
    return override;
  }

  if (fallback) {
    return fallback;
  }

  const section = SECTION_TITLES.find((item) => item.key === key);

  return section?.fields.find((item) => item.name === field)?.default || "";
}

/*
 * Giá trị mặc định sẽ hiển thị trên thiệp cho 1 ô — tính
 * cả fallback động (story/video/game Heading lấy tiêu đề
 * từ panel khác). Panel "Tiêu đề mục" dùng hàm này để fill
 * sẵn chữ mặc định vào các ô ngay từ đầu.
 */
export function sectionDefault(wedding, key, field) {
  /* Mục có dữ liệu riêng (panel khác quản lý) */
  if (key === "story" && field === "Heading") {
    return (
      (typeof wedding?.story === "object" && wedding.story?.Title) ||
      t("Chuyện tình yêu")
    );
  }

  if (key === "video" && field === "Heading") {
    return wedding?.video?.Title || t("Video Cưới");
  }

  if (key === "game" && field === "Heading") {
    return wedding?.game?.Title || gameTypeMeta(effectiveGameType(wedding)).label;
  }

  if (key === "game" && field === "Intro") {
    return gameTypeMeta(effectiveGameType(wedding)).intro;
  }

  const section = SECTION_TITLES.find((item) => item.key === key);

  return section?.fields.find((item) => item.name === field)?.default || "";
}

/*
 * Tạo sẵn object rỗng cho mọi mục để panel chỉnh sửa
 * ghi được vào wedding.sections kể cả với dữ liệu cũ.
 */
export function ensureSections(wedding) {
  if (!wedding) {
    return null;
  }

  if (!wedding.sections || typeof wedding.sections !== "object") {
    wedding.sections = {};
  }

  SECTION_TITLES.forEach((section) => {
    if (!wedding.sections[section.key] || typeof wedding.sections[section.key] !== "object") {
      wedding.sections[section.key] = {};
    }
  });

  return wedding.sections;
}
