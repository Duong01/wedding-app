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
    label: "Màn hình mở thiệp",
    icon: "mdi-email-open-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "THIỆP MỜI CƯỚI" },
      { name: "Kicker", label: "Dòng trên thiệp", default: "SAVE THE DATE" },
      { name: "Invite", label: "Lời mời", default: "Trân trọng kính mời" },
      { name: "Button", label: "Nút mở thiệp", default: "CHẠM ĐỂ MỞ THIỆP" },
      {
        name: "Hint",
        label: "Dòng gợi ý",
        default: "Một lời mời · Một câu chuyện · Một ngày đặc biệt",
      },
    ],
  },

  {
    key: "couple",
    label: "Cô dâu & Chú rể",
    icon: "mdi-heart-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "TRÂN TRỌNG BÁO HỶ" },
      { name: "Heading", label: "Tiêu đề", default: "Thông tin tiệc cưới" },
    ],
  },

  {
    key: "story",
    label: "Chuyện tình yêu",
    icon: "mdi-book-heart-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "CÂU CHUYỆN CỦA CHÚNG MÌNH" },
      /*
       * Heading của mục này mặc định lấy từ story.Title
       * (panel "Chuyện tình yêu") nên default để trống.
       */
      { name: "Heading", label: "Tiêu đề", default: "" },
    ],
  },

  {
    key: "events",
    label: "Thông tin tiệc cưới",
    icon: "mdi-glass-cocktail",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "TIỆC BÁO HỶ" },
      { name: "Heading", label: "Tiêu đề", default: "Thông tin tiệc báo hỷ" },
    ],
  },

  {
    key: "dressCode",
    label: "Dress code",
    icon: "mdi-tshirt-crew-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "TRANG PHỤC" },
      { name: "Heading", label: "Tiêu đề", default: "Dress Code" },
      { name: "Intro", label: "Mô tả", default: "Trang phục dự tiệc" },
    ],
  },

  {
    key: "timeline",
    label: "Timeline",
    icon: "mdi-timeline-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "DẤU MỐC YÊU THƯƠNG" },
      { name: "Heading", label: "Tiêu đề", default: "Hành trình của chúng mình" },
      {
        name: "Intro",
        label: "Mô tả",
        default: "Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay",
      },
    ],
  },

  {
    key: "countdown",
    label: "Đếm ngược",
    icon: "mdi-timer-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "NGÀY VUI ĐANG ĐẾN GẦN" },
      { name: "Heading", label: "Tiêu đề", default: "Đếm ngược" },
    ],
  },

  {
    key: "gallery",
    label: "Album ảnh",
    icon: "mdi-image-multiple-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "KỶ NIỆM TƯƠI ĐẸP" },
      { name: "Heading", label: "Tiêu đề", default: "Album Hình Cưới" },
      {
        name: "Intro",
        label: "Mô tả",
        default: "Những khoảnh khắc đẹp nhất\nđược lưu giữ cùng chúng mình",
      },
    ],
  },

  {
    key: "map",
    label: "Bản đồ",
    icon: "mdi-map-marker-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "ĐƯỜNG ĐẾN NGÀY VUI" },
      { name: "Heading", label: "Tiêu đề", default: "Bản đồ địa điểm" },
    ],
  },

  {
    key: "gifts",
    label: "Mừng cưới",
    icon: "mdi-gift-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "GỬI YÊU THƯƠNG" },
      { name: "Heading", label: "Tiêu đề", default: "Hộp mừng cưới" },
      {
        name: "Intro",
        label: "Mô tả",
        default:
          "Những lời chúc và tình cảm của bạn\nlà món quà quý giá nhất dành cho chúng mình",
      },
    ],
  },

  {
    key: "guestbook",
    label: "Sổ lưu bút",
    icon: "mdi-message-heart-outline",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "LỜI CHÚC TỪ BẠN" },
      { name: "Heading", label: "Tiêu đề", default: "Sổ lưu bút" },
      {
        name: "Intro",
        label: "Mô tả",
        default:
          "Mỗi lời chúc là một kỷ niệm đẹp\nmà chúng mình muốn lưu giữ trong ngày đặc biệt này",
      },
    ],
  },

  {
    key: "footer",
    label: "Chân thiệp",
    icon: "mdi-page-layout-footer",
    fields: [
      { name: "Eyebrow", label: "Dòng nhỏ", default: "SAVE THE DATE" },
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
