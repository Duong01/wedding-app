/*
 * Dữ liệu mini game trong thiệp.
 *
 * 4 loại game (chủ thiệp chọn 1 trong editor — cột
 * WeddingGames.GameType):
 *   lucky-wheel  — Vòng quay may mắn
 *   couple-quiz  — Trắc nghiệm về cặp đôi (chủ thiệp tự ra câu hỏi)
 *   scratch-card — Cào trúng thưởng
 *   memory-match — Ghép hình cặp đôi
 *
 * 2 chế độ phần thưởng:
 *   - Chế độ quà: wedding.gamePrizes có mục → khách trúng quà
 *     thật, nhập tên để chủ thiệp đối chiếu tại lễ.
 *   - Chế độ vui: không có quà → khách nhận lời chúc
 *     (DEFAULT_WHEEL_PRIZES bên dưới).
 */

export const GAME_TYPES = [
  {
    value: "lucky-wheel",
    label: "Vòng quay may mắn",
    icon: "mdi-ferris-wheel",
    description: "Quay và nhận một phần quà / lời chúc.",
    intro: "Quay một lần — nhận một phần quà dành riêng cho bạn",
  },
  {
    value: "couple-quiz",
    label: "Trắc nghiệm về cặp đôi",
    icon: "mdi-comment-question-outline",
    description: "Câu hỏi do cô dâu chú rể tự ra.",
    intro: "Bạn hiểu cô dâu chú rể đến đâu?",
  },
  {
    value: "scratch-card",
    label: "Cào trúng thưởng",
    icon: "mdi-card-account-details-outline",
    description: "Cào lớp bạc nhận quà ngẫu nhiên.",
    intro: "Cào lớp bạc để xem bạn nhận được gì",
  },
  {
    value: "memory-match",
    label: "Ghép hình cặp đôi",
    icon: "mdi-cards-outline",
    description: "Lật thẻ ghép đôi ảnh cưới.",
    intro: "Ghép đúng các cặp ảnh cưới nhé",
  },
];

/*
 * Tra metadata 1 loại game — không biết type (dữ liệu cũ)
 * thì rơi về vòng quay.
 */
export function gameTypeMeta(type) {
  return GAME_TYPES.find((g) => g.value === type) || GAME_TYPES[0];
}

/*
 * 8 lời chúc mặc định (chế độ vui) — đủ số chẵn để chia đều
 * conic-gradient, mỗi ô 45°.
 */
export const DEFAULT_WHEEL_PRIZES = [
  "Trăm năm hạnh phúc",
  "Luôn yêu thương nhau",
  "Sức khỏe dồi dào",
  "Tài lộc đầy nhà",
  "Vạn sự như ý",
  "Con cháu đông đúc",
  "Một đời bên nhau",
  "May mắn ngập tràn",
];

/*
 * 3 câu hỏi mẫu cho editor — chủ thiệp mới bật trắc nghiệm
 * có sẵn nội dung để sửa theo chuyện của mình, không trắng
 * trang. CorrectIndex: 0 = A, 1 = B, 2 = C, 3 = D.
 */
export const DEFAULT_QUIZ_QUESTIONS = [
  {
    Question: "Hai người gặp nhau lần đầu ở đâu?",
    OptionA: "Ở trường",
    OptionB: "Qua bạn bè giới thiệu",
    OptionC: "Trong một chuyến đi",
    OptionD: "Tại nơi làm việc",
    CorrectIndex: 1,
  },
  {
    Question: "Ai tỏ tình trước?",
    OptionA: "Chú rể",
    OptionB: "Cô dâu",
    OptionC: "Cả hai cùng lúc",
    OptionD: "Không ai nhớ nữa",
    CorrectIndex: 0,
  },
  {
    Question: "Chuyến du lịch đầu tiên của hai người là ở đâu?",
    OptionA: "Đà Lạt",
    OptionB: "Đà Nẵng",
    OptionC: "Phú Quốc",
    OptionD: "Sapa",
    CorrectIndex: 0,
  },
];

/*
 * Chọn ngẫu nhiên 1 phần thưởng từ danh sách title.
 * Trả "" nếu danh sách rỗng — caller tự xử lý.
 */
export function pickRandomPrize(prizes) {
  if (!Array.isArray(prizes) || prizes.length === 0) {
    return "";
  }

  return prizes[Math.floor(Math.random() * prizes.length)];
}
