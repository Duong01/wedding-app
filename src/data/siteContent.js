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
  hours: "8:00 – 21:00 hằng ngày",
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
  { label: "Trang chủ", routeName: "Home" },
  { label: "Mẫu thiệp cưới", routeName: "Templates" },
  { label: "Bảng giá", routeName: "Pricing" },
  { label: "Hướng dẫn", routeName: "Guide" },
  { label: "Giới thiệu", routeName: "About" },
  { label: "Liên hệ", routeName: "Contact" },
];

/*
 * Liên kết phụ ở chân trang — nhóm theo chủ đề.
 */
export const FOOTER_GROUPS = [
  {
    title: "Khám phá",
    links: [
      { label: "Trang chủ", routeName: "Home" },
      { label: "Mẫu thiệp cưới", routeName: "Templates" },
      { label: "Tạo thiệp ngay", routeName: "Editor" },
      { label: "Thiệp của tôi", routeName: "Manage" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Bảng giá", routeName: "Pricing" },
      { label: "Hướng dẫn tạo thiệp", routeName: "Guide" },
      { label: "Giới thiệu", routeName: "About" },
      { label: "Liên hệ", routeName: "Contact" },
    ],
  },
  {
    title: "Phong cách",
    links: [
      { label: "Thiệp cưới online", routeName: "WeddingOnline" },
      { label: "Mẫu thiệp cưới đẹp", routeName: "TemplatesFeatured" },
      { label: "Thiệp cưới hiện đại", routeName: "TemplatesModern" },
      { label: "Thiệp cưới truyền thống", routeName: "TemplatesTraditional" },
    ],
  },
];

/*
 * Tính năng — lưới bento ở trang chủ.
 */
export const FEATURES = [
  {
    orn: "囍",
    title: "Bộ sưu tập Á Đông",
    text: "Năm bộ sưu tập với bản sắc riêng — từ đỏ son truyền thống, lụa ngà kim tuyến đến tối giản hiện đại.",
  },
  {
    orn: "✦",
    title: "Editor linh hoạt",
    text: "Đổi nội dung, thứ tự mục, font, màu sắc và bố cục theo đúng cảm nhận của bạn.",
  },
  {
    orn: "❀",
    title: "Hiển thị mọi thiết bị",
    text: "Thiệp tự động chuẩn trên điện thoại, tablet và máy tính — khách mời mở là đẹp.",
  },
  {
    orn: "❖",
    title: "Bản đồ & lịch nhắc",
    text: "Chỉ đường tới địa điểm lễ và thêm sự kiện vào lịch điện thoại chỉ với một chạm.",
  },
  {
    orn: "✽",
    title: "Mừng cưới online",
    text: "Khách quét QR chuyển khoản mừng cưới, không còn lo chuẩn bị phong bì.",
  },
  {
    orn: "❝",
    title: "Sổ lưu bút số",
    text: "Lời chúc của khách mời lưu lại trên thiệp, hai bạn đọc lại mãi về sau.",
  },
  {
    orn: "❦",
    title: "Album ảnh không giới hạn",
    text: "Tải lên bao nhiêu ảnh cưới cũng được — thiệp tự sắp thành album mượt mà.",
  },
  {
    orn: "◈",
    title: "Tên miền riêng",
    text: "Đường link ngắn gọn dạng thiepduyen.com/ten-hai-ban, dễ đọc, dễ nhớ, dễ chia sẻ.",
  },
];

/*
 * Quy trình 3 bước.
 */
export const STEPS = [
  {
    seal: "壹",
    title: "Chọn mẫu",
    text: "Duyệt bộ sưu tập, chọn tấm thiệp đúng gu của hai bạn.",
  },
  {
    seal: "贰",
    title: "Điền thông tin",
    text: "Nhập tên, ngày cưới, sự kiện, ảnh và lời nhắn một lần — hiển thị đồng bộ khắp thiệp.",
  },
  {
    seal: "叁",
    title: "Gửi khách mời",
    text: "Xuất bản và chia sẻ đường link qua Zalo, Messenger hay in mã QR lên thiệp giấy.",
  },
];

/*
 * Nhóm tính năng chi tiết — khối tab ở trang chủ.
 * Mỗi nhóm có ảnh minh hoạ lấy từ template-preview.
 */
export const FEATURE_GROUPS = [
  {
    id: "thiep",
    label: "Thiệp cưới",
    title: "Tấm thiệp chỉn chu trong từng chi tiết",
    text: "Mỗi mẫu thiệp là một bố cục hoàn chỉnh — không phải biểu mẫu điền vào. Bạn chỉ việc thay nội dung.",
    image: "song_hy_red",
    points: [
      "Ảnh bìa, ảnh cưới và album hiển thị sắc nét trên mọi màn hình",
      "Đồng hồ đếm ngược tới ngày cưới",
      "Câu chuyện tình yêu, lời ngỏ và sơ đồ chỉ đường",
      "Nhạc nền phát khi khách mở thiệp",
    ],
  },
  {
    id: "khach-moi",
    label: "Quản lý khách mời",
    title: "Biết ai sẽ đến, ai chưa xem",
    text: "Theo dõi lượt mở thiệp và danh sách khách xác nhận tham dự — không cần hỏi lại từng người.",
    image: "jasmine_white",
    points: [
      "Danh sách khách mời theo nhà trai / nhà gái",
      "Khách xác nhận tham dự ngay trên thiệp",
      "Thống kê lượt xem và lượt chia sẻ",
      "Xuất danh sách để sắp bàn tiệc",
    ],
  },
  {
    id: "mung-cuoi",
    label: "Mừng cưới QR",
    title: "Mừng cưới không cần phong bì",
    text: "Khách quét mã QR là chuyển khoản được ngay, hai bạn nhận đủ và minh bạch từng khoản.",
    image: "baroque_gold",
    points: [
      "Hiển thị QR ngân hàng của cả cô dâu và chú rể",
      "Khách tự nhập số tiền và lời chúc",
      "Sao kê mừng cưới lưu lại trên thiệp",
      "Không lộ số tài khoản cho người lạ",
    ],
  },
  {
    id: "luu-but",
    label: "Sổ lưu bút",
    title: "Lời chúc ở lại mãi với thời gian",
    text: "Khách mời gửi lời chúc trực tiếp lên thiệp. Nhiều năm sau mở lại, hai bạn vẫn đọc được nguyên vẹn.",
    image: "cherry_blossom_pink",
    points: [
      "Khách gửi lời chúc không cần đăng nhập",
      "Duyệt trước khi hiển thị để tránh nội dung xấu",
      "Lưu vĩnh viễn theo thiệp",
      "Có thể xuất ra file để in kỷ niệm",
    ],
  },
];

/*
 * Đánh giá của khách hàng.
 */
export const TESTIMONIALS = [
  {
    name: "Minh Anh & Quốc Bảo",
    meta: "Cưới tháng 3/2026 · Hà Nội",
    text: "Hai đứa mê bộ sưu tập Á Đông. Khách mời ai cũng hỏi thiệp làm ở đâu, nhất là phần quét QR mừng cưới — tiện hơn phong bì nhiều.",
    orn: "囍",
  },
  {
    name: "Thu Hà & Đức Long",
    meta: "Cưới tháng 1/2026 · Đà Nẵng",
    text: "Mình không biết gì về thiết kế nhưng vẫn làm xong trong một buổi tối. Sửa đi sửa lại bao nhiêu lần cũng không mất thêm phí.",
    orn: "❀",
  },
  {
    name: "Ngọc Trâm & Hoàng Nam",
    meta: "Cưới tháng 12/2025 · TP.HCM",
    text: "Điểm mình thích nhất là sổ lưu bút. Giờ thỉnh thoảng mở lại đọc lời chúc của ông bà, cảm động lắm.",
    orn: "❝",
  },
  {
    name: "Lan Phương & Tuấn Kiệt",
    meta: "Cưới tháng 11/2025 · Huế",
    text: "Chọn mẫu truyền thống vì hai bên gia đình đều thích. Thiệp lên đúng tinh thần lễ nghi, không bị sến.",
    orn: "✦",
  },
  {
    name: "Diệu Linh & Trọng Nghĩa",
    meta: "Cưới tháng 10/2025 · Cần Thơ",
    text: "Nhắn hỗ trợ lúc 10 giờ đêm mà vẫn được trả lời trong vài phút. Đúng cái mình cần trước ngày cưới.",
    orn: "❦",
  },
  {
    name: "Thanh Vân & Hữu Phước",
    meta: "Cưới tháng 9/2025 · Hải Phòng",
    text: "Gửi link qua Zalo cho hơn 400 khách, không ai kêu khó mở. Bố mẹ hai bên cũng xem được trên điện thoại.",
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
    name: "Miễn phí",
    price: 0,
    priceLabel: "0đ",
    unit: "mãi mãi",
    tagline: "Thử sức trước khi quyết định",
    highlight: false,
    cta: "Bắt đầu tạo thiệp",
    features: [
      "Truy cập toàn bộ 20+ mẫu thiệp",
      "Editor đầy đủ, sửa không giới hạn",
      "Xem trước thiệp trên mọi thiết bị",
      "Lưu nháp không giới hạn thời gian",
    ],
    missing: [
      "Chưa xuất bản được cho khách mời",
      "Chưa có sổ lưu bút",
      "Chưa có QR mừng cưới",
    ],
  },
  {
    id: "tron-doi",
    name: "Trọn đời",
    price: 50000,
    priceLabel: "50.000đ",
    unit: "một lần duy nhất",
    tagline: "Chọn nhiều nhất — trả một lần, dùng mãi",
    highlight: true,
    cta: "Chọn gói này",
    features: [
      "Mọi thứ ở gói Miễn phí",
      "Xuất bản thiệp, chia sẻ không giới hạn khách mời",
      "Dùng thử 3 ngày trước khi thanh toán",
      "Sổ lưu bút số lưu vĩnh viễn",
      "QR mừng cưới cho cả hai bên",
      "Đồng hồ đếm ngược, bản đồ chỉ đường, nhạc nền",
      "Sửa nội dung bất cứ lúc nào, kể cả sau khi gửi",
      "Hỗ trợ chỉnh sửa miễn phí qua Messenger",
    ],
    missing: [],
  },
  {
    id: "cao-cap",
    name: "Cao cấp",
    price: null,
    priceLabel: "Liên hệ",
    unit: "báo giá riêng",
    tagline: "Cho tiệc lớn và yêu cầu riêng",
    highlight: false,
    cta: "Nhắn tư vấn",
    features: [
      "Mọi thứ ở gói Trọn đời",
      "Tên miền riêng theo tên hai bạn",
      "Thiết kế chỉnh riêng theo yêu cầu",
      "Quản lý khách mời và sắp bàn tiệc",
      "Hỗ trợ ưu tiên 24/7",
    ],
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

  return "Trả khi xuất bản";
}

/*
 * Câu hỏi thường gặp — dùng cho trang chủ và trang Hướng dẫn.
 */
export const FAQS = [
  {
    q: "Thiệp cưới online là gì?",
    a: "Là một trang web riêng của hai bạn — không chỉ thay thế thiệp giấy mà còn là không gian lưu giữ album ảnh, câu chuyện tình yêu, lời chúc của khách mời và tiền mừng qua QR code.",
  },
  {
    q: "Tôi có cần biết lập trình hay thiết kế không?",
    a: "Không. Giao diện được làm để bạn chỉ cần điền thông tin và chọn mẫu. Mọi thứ còn lại đã được dựng sẵn.",
  },
  {
    q: "Chi phí tạo thiệp là bao nhiêu?",
    a: "Tạo và chỉnh sửa hoàn toàn miễn phí. Sau khi xuất bản, bạn được dùng thử 3 ngày để chia sẻ với khách mời. Sau đó chỉ thanh toán một lần duy nhất để giữ thiệp vĩnh viễn — giá hiển thị rõ trước khi bạn xác nhận.",
  },
  {
    q: "Tôi cần chuẩn bị những gì?",
    a: "Tên cô dâu chú rể, tên cha mẹ hai bên, địa chỉ nhà trai – nhà gái, thời gian và địa điểm tiệc cưới, ảnh cưới chất lượng cao, và số tài khoản ngân hàng nếu muốn nhận tiền mừng online.",
  },
  {
    q: "Xuất bản rồi có sửa được không?",
    a: "Được. Bạn chỉnh sửa bất cứ lúc nào, kể cả sau khi đã gửi khách mời. Thay đổi cập nhật tự động trên đúng đường link bạn đã chia sẻ.",
  },
  {
    q: "Gửi được cho bao nhiêu khách?",
    a: "Không giới hạn. Chỉ cần chia sẻ đường link, bạn có thể mời tất cả bạn bè và người thân ở bất cứ đâu.",
  },
  {
    q: "Thiệp có mở được trên điện thoại không?",
    a: "Có. Mọi mẫu thiệp đều được dựng responsive — hiển thị đúng trên điện thoại, tablet và máy tính. Khách mời chỉ cần bấm vào link là xem được, không cần cài ứng dụng.",
  },
  {
    q: "Khách mời có cần đăng nhập để xem thiệp không?",
    a: "Không. Thiệp mở công khai qua đường link bạn chia sẻ. Khách chỉ cần bấm vào là xem được toàn bộ nội dung.",
  },
  {
    q: "Tôi có thể dùng tên miền riêng không?",
    a: "Có, thuộc gói Cao cấp. Thiệp sẽ chạy trên tên miền của bạn thay vì đường link mặc định — phù hợp nếu hai bạn muốn lưu lại lâu dài hoặc dùng cho mục đích thương mại.",
  },
  {
    q: "Thanh toán bằng cách nào?",
    a: "Chuyển khoản ngân hàng theo thông tin hiển thị ở bước kích hoạt thiệp. Sau khi nhận được, hệ thống xác nhận và thiệp của bạn được giữ vĩnh viễn.",
  },
];

/*
 * Bộ sưu tập → trang đích tương ứng.
 * Dùng cho khối "Bộ sưu tập theo phong cách" ở trang chủ.
 */
export const COLLECTION_LANDING = {
  "a-dong": {
    routeName: "TemplatesTraditional",
    title: "Á Đông sang trọng",
    text: "Đỏ son, vàng son, họa tiết trống đồng và chữ song hỷ — cho đám cưới đậm lễ nghi truyền thống.",
  },
  "kim-lua": {
    routeName: "TemplatesFeatured",
    title: "Kim tuyến & lụa",
    text: "Foil vàng trên nền lụa ngà hoặc nền sẫm — sang trọng nhưng không phô trương.",
  },
  "lang-man": {
    routeName: "TemplatesModern",
    title: "Lãng mạn đương đại",
    text: "Hồng phấn, đào, oải hương với chữ viết tay mềm mại — nhẹ nhàng và nữ tính.",
  },
  "thien-nhien": {
    routeName: "TemplatesFeatured",
    title: "Thiên nhiên & vintage",
    text: "Lá xanh, đất nung, giấy cũ — gần gũi như một khu vườn buổi sớm.",
  },
  "toi-gian": {
    routeName: "TemplatesModern",
    title: "Tối giản hiện đại",
    text: "Nét mực gọn, khoảng trắng rộng, một điểm đỏ nhấn — tinh tế và rất hiện đại.",
  },
};

/*
 * Số liệu tin cậy — dùng ở hero và trang Giới thiệu.
 */
export const STATS = [
  { value: "20+", label: "Mẫu thiệp" },
  { value: "5", label: "Bộ sưu tập" },
  { value: "3 ngày", label: "Dùng thử" },
];

export const ABOUT_STATS = [
  { value: "12.000+", label: "Thiệp đã tạo" },
  { value: "20+", label: "Mẫu thiết kế" },
  { value: "5", label: "Bộ sưu tập" },
  { value: "4,9/5", label: "Đánh giá trung bình" },
];

/*
 * Giá trị cốt lõi — trang Giới thiệu.
 */
export const VALUES = [
  {
    orn: "囍",
    title: "Đẹp phải đi cùng dễ",
    text: "Một tấm thiệp đẹp không nên đòi hỏi bạn phải học thiết kế. Chúng tôi làm phần khó, bạn làm phần ý nghĩa.",
  },
  {
    orn: "✦",
    title: "Minh bạch từ đầu",
    text: "Không phí ẩn, không tự động trừ tiền. Giá hiển thị rõ trước khi bạn quyết định, và bạn được dùng thử trước.",
  },
  {
    orn: "❀",
    title: "Tôn trọng bản sắc",
    text: "Mỗi bộ sưu tập bám vào một tinh thần riêng — Á Đông, lãng mạn, thiên nhiên hay tối giản — chứ không phải một mẫu tô màu.",
  },
  {
    orn: "❝",
    title: "Kỷ niệm phải ở lại",
    text: "Thiệp cưới không chỉ để mời. Nó là nơi lưu lời chúc, ảnh và câu chuyện — nên chúng tôi giữ nó vĩnh viễn.",
  },
];

/*
 * Checklist chuẩn bị nội dung — trang Hướng dẫn.
 */
export const GUIDE_CHECKLIST = [
  {
    group: "Thông tin hai bạn",
    items: [
      "Tên đầy đủ của cô dâu và chú rể (kèm tên thường gọi nếu muốn)",
      "Ảnh chân dung của mỗi người",
      "Ảnh bìa — ảnh ngang, chất lượng cao",
    ],
  },
  {
    group: "Thông tin gia đình",
    items: [
      "Tên cha mẹ hai bên",
      "Địa chỉ nhà trai và nhà gái",
      "Thứ tự anh chị em nếu muốn ghi rõ (trưởng nam, thứ nữ…)",
    ],
  },
  {
    group: "Lễ và tiệc",
    items: [
      "Ngày giờ lễ ăn hỏi, lễ thành hôn, tiệc cưới",
      "Tên và địa chỉ từng địa điểm",
      "Link Google Maps của địa điểm tiệc",
    ],
  },
  {
    group: "Album & kỷ niệm",
    items: [
      "10–30 ảnh cưới, ưu tiên ảnh ngang",
      "Câu chuyện tình yêu — 3 đến 5 mốc thời gian",
      "Lời ngỏ gửi khách mời",
    ],
  },
  {
    group: "Mừng cưới",
    items: [
      "Số tài khoản ngân hàng của cô dâu và chú rể",
      "Tên chủ tài khoản đúng như ngân hàng ghi",
      "Tên ngân hàng và chi nhánh",
    ],
  },
];

/*
 * Mẹo nhỏ — trang Hướng dẫn.
 */
export const GUIDE_TIPS = [
  {
    orn: "◈",
    title: "Chọn ảnh ngang cho ảnh bìa",
    text: "Ảnh bìa hiển thị dạng khung rộng. Ảnh ngang tỉ lệ 16:9 hoặc 3:2 cho kết quả đẹp nhất, ảnh dọc sẽ bị cắt mất hai bên.",
  },
  {
    orn: "✦",
    title: "Viết lời ngỏ ngắn, đọc to lên thử",
    text: "Ba đến bốn câu là đủ. Đọc thành tiếng giúp bạn nhận ra câu nào dài dòng hoặc nghe không tự nhiên.",
  },
  {
    orn: "❀",
    title: "Gửi thiệp trước ngày cưới 3–4 tuần",
    text: "Khách cần thời gian sắp xếp. Gửi sớm cũng giúp bạn kịp điều chỉnh nếu có sai sót về địa điểm hay giờ giấc.",
  },
  {
    orn: "❝",
    title: "Kiểm tra trên chính điện thoại của bạn",
    text: "Hơn 90% khách mời mở thiệp bằng điện thoại. Hãy tự mở link trên máy mình trước khi gửi cho bất kỳ ai.",
  },
];

/*
 * Câu hỏi riêng cho trang Bảng giá.
 */
export const PRICING_FAQS = [
  {
    q: "Dùng thử 3 ngày được tính từ lúc nào?",
    a: "Từ lúc bạn bấm xuất bản thiệp. Trong 3 ngày đó thiệp hoạt động đầy đủ — khách mời xem được, gửi lời chúc được, quét QR được.",
  },
  {
    q: "Hết 3 ngày mà chưa thanh toán thì sao?",
    a: "Thiệp tạm ẩn với khách mời nhưng toàn bộ nội dung vẫn được giữ nguyên. Bạn thanh toán lúc nào thì thiệp hoạt động lại, không mất dữ liệu.",
  },
  {
    q: "Trả một lần rồi có phát sinh phí hằng năm không?",
    a: "Không. Gói Trọn đời là thanh toán một lần duy nhất, không có phí gia hạn hay phí lưu trữ hằng năm.",
  },
  {
    q: "Tôi tạo nhiều thiệp thì tính phí thế nào?",
    a: "Phí tính theo từng thiệp được xuất bản. Bạn có thể tạo và lưu nháp bao nhiêu thiệp cũng được mà không mất phí.",
  },
  {
    q: "Có được hoàn tiền không?",
    a: "Có. Nếu thiệp gặp lỗi kỹ thuật mà chúng tôi không khắc phục được, bạn được hoàn lại toàn bộ trong vòng 7 ngày kể từ lúc thanh toán.",
  },
];

/*
 * Chính sách hoàn tiền — trích thẳng từ PRICING_FAQS để trang thanh toán
 * và trang Bảng giá không nói hai câu khác nhau. Sửa câu trả lời ở trên
 * là trang thanh toán tự cập nhật theo.
 */
export const REFUND_POLICY =
  PRICING_FAQS.find((item) => item.q.includes("hoàn tiền"))?.a || "";

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
