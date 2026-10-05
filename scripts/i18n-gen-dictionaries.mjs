/*
 * Sinh 4 file dịch en_US.js / zh_CN.js / ko_KR.js / ja_JP.js
 * từ: (1) bản dịch đang có trong src/lang (giữ nguyên khi
 * chạy lại), (2) bảng bổ sung SUPPLEMENT bên dưới, (3) danh
 * sách key thực tế đang dùng (scripts/card-keys.json) — chỉ
 * xuất key đang dùng, giữ đúng dạng 'vi': 'dịch' như mẫu.
 *
 * Chạy: node scripts/i18n-gen-dictionaries.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const keys = JSON.parse(readFileSync(join(ROOT, "scripts/card-keys.json"), "utf8"));

/* vi → [vi, en, zh, ko, ja] — nạp từ bản dịch đang có */
const LOCALES = [
  { file: "en_US.js", idx: 1, header: "English" },
  { file: "zh_CN.js", idx: 2, header: "中文 (简体)" },
  { file: "ko_KR.js", idx: 3, header: "한국어" },
  { file: "ja_JP.js", idx: 4, header: "日本語" },
];

const byVi = new Map();

for (const { file, idx } of LOCALES) {
  let table;
  try {
    const mod = await import(
      `file://${join(ROOT, "src/lang", file).replace(/\\/g, "/")}`
    );
    table = mod.default || {};
  } catch {
    table = {};
  }
  for (const [vi, trans] of Object.entries(table)) {
    if (!byVi.has(vi)) byVi.set(vi, [vi, "", "", "", ""]);
    byVi.get(vi)[idx] = trans;
  }
}

/*
 * Bổ sung key còn thiếu (định dạng [vi, en, zh, ko, ja]).
 * Key vi phải TRÙNG CHÍNH XÁC chuỗi trong code.
 */
const SUPPLEMENT = {
  " giờ": [" giờ", "h", "时", "시간", "時間"],
  " ngày": [" ngày", "d", "天", "일", "日"],
  " phút": [" phút", "m", "分", "분", "分"],
  "＋ THÊM VÀO LỊCH": ["＋ THÊM VÀO LỊCH", "＋ ADD TO CALENDAR", "＋ 添加到日历", "＋ 달력에 추가", "＋ カレンダーに追加"],
  "✓ Có, tôi sẽ tham dự": ["✓ Có, tôi sẽ tham dự", "✓ Yes, I will attend", "✓ 是，我会出席", "✓ 네, 참석합니다", "✓ はい、出席します"],
  "✕ Rất tiếc, tôi không thể tham dự": ["✕ Rất tiếc, tôi không thể tham dự", "✕ Sadly, I cannot attend", "✕ 很遗憾，我无法出席", "✕ 죄송하지만 참석이 어렵습니다", "✕ 残念ながら出席できません"],
  "🎁 Bạn nhận được:": ["🎁 Bạn nhận được:", "🎁 You got:", "🎁 你获得了：", "🎁 받으셨습니다:", "🎁 結果は:"],
  "Ảnh cưới ": ["Ảnh cưới ", "Wedding photo ", "婚纱照 ", "웨딩 사진 ", "ウェディング写真 "],
  "bằng một lời hẹn ước trăm năm": ["bằng một lời hẹn ước trăm năm", "with a vow of a hundred years", "以百年之约", "백년의 약속으로", "百年の誓いで"],
  "Cảm ơn vì đã đến,": ["Cảm ơn vì đã đến,", "Thank you for coming,", "感谢您的到来，", "와주셔서 감사합니다,", "お越しくださりありがとうございます、"],
  "Cào lại": ["Cào lại", "Scratch again", "再刮一次", "다시 긁기", "もう一度"],
  "CÂU CHUYỆN TÌNH YÊU": ["CÂU CHUYỆN TÌNH YÊU", "OUR LOVE STORY", "我们的爱情故事", "우리의 사랑 이야기", "私たちの愛の物語"],
  "CHẠM ĐỂ XEM QR LỚN": ["CHẠM ĐỂ XEM QR LỚN", "TAP TO VIEW LARGE QR", "点击查看大二维码", "터치해서 큰 QR 보기", "タップしてQR拡大"],
  "Chế độ xem trước — không lưu.": ["Chế độ xem trước — không lưu.", "Preview mode — not saved.", "预览模式——不保存。", "미리보기 모드 — 저장되지 않습니다.", "プレビューモード — 保存されません。"],
  "CHỈ ĐƯỜNG": ["CHỈ ĐƯỜNG", "DIRECTIONS", "路线指引", "길 안내", "道案内"],
  "Chơi lại": ["Chơi lại", "Play again", "再玩一次", "다시 하기", "もう一度"],
  "Chúng mình đã về chung một nhà ❤️": ["Chúng mình đã về chung một nhà ❤️", "We are now one family ❤️", "我们已成为一家人 ❤️", "이제 우리는 한 가족이 되었습니다 ❤️", "私たちは家族になりました ❤️"],
  "Chữ Hỷ": ["Chữ Hỷ", "Double Happiness", "囍字", "쌍희 글자", "囍の文字"],
  "Chưa có bản đồ cho địa điểm này": ["Chưa có bản đồ cho địa điểm này", "No map for this venue yet", "该地点暂无地图", "이 장소의 지도가 없습니다", "この会場の地図はまだありません"],
  "Chưa có lịch trình.": ["Chưa có lịch trình.", "No schedule yet.", "暂无日程。", "일정이 없습니다.", "日程はまだありません。"],
  "Chưa có thông tin mừng cưới.": ["Chưa có thông tin mừng cưới.", "No gift information yet.", "暂无礼金信息。", "축의 정보가 없습니다.", "ご祝儀情報はまだありません。"],
  "Còn ": ["Còn ", "in ", "还有 ", "남음 ", "あと "],
  "CÙNG CHÚNG MÌNH": ["CÙNG CHÚNG MÌNH", "WITH US", "与我们同在", "함께", "私たちと"],
  "cùng gia đình hai bên": ["cùng gia đình hai bên", "with both families", "与双方家庭", "양쪽 가족과 함께", "両家とともに"],
  "Đám cưới ": ["Đám cưới ", "Wedding of ", "婚礼：", "결혼식: ", "結婚式: "],
  "ĐANG MỞ...": ["ĐANG MỞ...", "OPENING...", "正在打开...", "열고 있습니다...", "開いています..."],
  "Đang tính toán...": ["Đang tính toán...", "Calculating...", "计算中...", "계산 중...", "計算中..."],
  "đến dự buổi tiệc chung vui cùng gia đình": ["đến dự buổi tiệc chung vui cùng gia đình", "to celebrate with the family", "与家人共襄盛举", "가족과 함께 축하하기 위해", "ご家族と共にお祝いするために"],
  "Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại": ["Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại", "Join us in celebration at", "与我们全家共襄盛举于", "우리 가족과 함께 축하할 장소", "私たちの家族と一緒にお祝いする場所"],
  "ĐÓNG": ["ĐÓNG", "CLOSE", "关闭", "닫기", "閉じる"],
  "được lưu giữ cùng chúng mình": ["được lưu giữ cùng chúng mình", "kept with us", "与我们一同珍藏", "함께 간직됩니다", "私たちと共に"],
  "Gửi đến chúng mình những lời chúc thật ấm áp nhé": ["Gửi đến chúng mình những lời chúc thật ấm áp nhé", "Send us your warmest wishes", "给我们送上最温暖的祝福吧", "따뜻한 축하를 보내주세요", "温かいお祝いの言葉をください"],
  "Hai người, hai hành trình": ["Hai người, hai hành trình", "Two people, two journeys", "两个人，两段旅程", "두 사람, 두 여정", "二人、二つの旅路"],
  "Hãy là người đầu tiên gửi lời chúc đến cô dâu chú rể nhé ♡": ["Hãy là người đầu tiên gửi lời chúc đến cô dâu chú rể nhé ♡", "Be the first to send your wishes to the couple ♡", "来当第一个向新人送上祝福的人吧 ♡", "신랑신부에게 첫 번째 축하를 보내주세요 ♡", "新郎新婦に最初の祝福を送ってください ♡"],
  "HÂN HẠNH ĐÓN TIẾP": ["HÂN HẠNH ĐÓN TIẾP", "HONORED TO WELCOME YOU", "恭候光临", "환영합니다", "お迎えいたします"],
  "HỌ CHÚ RỂ": ["HỌ CHÚ RỂ", "GROOM'S SURNAME", "新郎姓氏", "신랑의 성", "新郎の姓"],
  "HỌ CÔ DÂU": ["HỌ CÔ DÂU", "BRIDE'S SURNAME", "新娘姓氏", "신부의 성", "新婦の姓"],
  "HỶ KẾT LƯƠNG DUYÊN": ["HỶ KẾT LƯƠNG DUYÊN", "A JOYFUL UNION", "喜结良缘", "인연을 맺습니다", "良縁を結ぶ"],
  "KHOẢNH KHẮC": ["KHOẢNH KHẮC", "MOMENTS", "瞬间", "순간", "瞬間"],
  "là niềm vinh hạnh của gia đình chúng tôi": ["là niềm vinh hạnh của gia đình chúng tôi", "is an honor for our family", "是我们全家的荣幸", "저희 가족의 영광입니다", "私たちの家族の栄誉です"],
  "Làm lại": ["Làm lại", "Try again", "重来", "다시 하기", "やり直す"],
  "Lễ Thành Hôn": ["Lễ Thành Hôn", "Wedding Ceremony", "结婚典礼", "결혼식", "結婚式"],
  "LỄ THÀNH HÔN CỦA CON CHÚNG TÔI": ["LỄ THÀNH HÔN CỦA CON CHÚNG TÔI", "THE WEDDING OF OUR CHILD", "我们孩子的婚礼", "우리 아이의 결혼식", "我が子の結婚式"],
  "LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI": ["LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI", "THE CEREMONY WILL BE HELD AT", "结婚典礼举行于", "결혼식이 거행되는 장소", "結婚式が執り行われる場所"],
  "LỜI CHÚC YÊU THƯƠNG": ["LỜI CHÚC YÊU THƯƠNG", "LOVING WISHES", "爱的祝福", "사랑의 축하", "愛の祝福"],
  "Lưu ảnh QR": ["Lưu ảnh QR", "Save QR image", "保存二维码图片", "QR 이미지 저장", "QR画像を保存"],
  "Lưu QR": ["Lưu QR", "Save QR", "保存二维码", "QR 저장", "QRを保存"],
  "Một hành trình mới bắt đầu": ["Một hành trình mới bắt đầu", "A new journey begins", "新的旅程开始了", "새로운 여정이 시작됩니다", "新しい旅が始まります"],
  "Một lời mời · Một chữ song hỷ · Một đời hạnh phúc": ["Một lời mời · Một chữ song hỷ · Một đời hạnh phúc", "One invitation · One double happiness · A lifetime together", "一份邀请 · 一个囍字 · 一生幸福", "하나의 초대 · 하나의 쌍희 · 평생의 행복", "一つの招待 · 一つの囍 · 一生の幸せ"],
  "Một lời mời · Một nhành hoa · Một đời hạnh phúc": ["Một lời mời · Một nhành hoa · Một đời hạnh phúc", "One invitation · One flower · A lifetime together", "一份邀请 · 一朵花 · 一生幸福", "하나의 초대 · 한 송이 꽃 · 평생의 행복", "一つの招待 · 一輪の花 · 一生の幸せ"],
  "Một ngày thật đẹp": ["Một ngày thật đẹp", "A beautiful day", "美好的一天", "아름다운 날", "素晴らしい日"],
  "một tình yêu thật đẹp": ["một tình yêu thật đẹp", "a beautiful love", "一份美好的爱情", "아름다운 사랑", "美しい愛"],
  "MỞ / LƯU ẢNH QR": ["MỞ / LƯU ẢNH QR", "OPEN / SAVE QR", "打开/保存二维码", "QR 열기 / 저장", "QRを開く/保存"],
  "Mở thiệp": ["Mở thiệp", "Open invitation", "打开请柬", "청첩장 열기", "招待状を開く"],
  "nay cùng bước chung một con đường.": ["nay cùng bước chung một con đường.", "now walk the same road together.", "如今携手同行一条路。", "이제 같은 길을 함께 걷습니다.", "今、同じ道を共に歩みます。"],
  "NGÀY ": ["NGÀY ", "DAY ", "日 ", "일 ", "日 "],
  "NGÀY VUI": ["NGÀY VUI", "THE BIG DAY", "喜庆之日", "결혼식 날", "挙式の日"],
  "Nhập họ tên để cô dâu chú rể chuẩn bị quà cho bạn tại lễ cưới.": ["Nhập họ tên để cô dâu chú rể chuẩn bị quà cho bạn tại lễ cưới.", "Enter your name so the couple can prepare your gift at the wedding.", "请输入姓名，以便新人为您准备礼物。", "신랑신부가 결혼식에서 드릴 선물을 준비할 수 있도록 성함을 입력해 주세요.", "新郎新婦が結婚式でお渡しする景品を準備できるよう、お名前をご入力ください。"],
  "Những khoảnh khắc đặc biệt trong ngày vui của chúng mình": ["Những khoảnh khắc đặc biệt trong ngày vui của chúng mình", "Special moments from our big day", "我们喜庆之日的特别瞬间", "우리 결혼식의 특별한 순간들", "私たちの結婚式の特別な瞬間"],
  "Những khoảnh khắc đẹp nhất": ["Những khoảnh khắc đẹp nhất", "Our most beautiful moments", "最美好的瞬间", "가장 아름다운 순간들", "最も美しい瞬間"],
  "Những khoảnh khắc đẹp nhất được lưu giữ cùng chúng mình": ["Những khoảnh khắc đẹp nhất được lưu giữ cùng chúng mình", "Our most beautiful moments kept with us", "最美好的瞬间与我们一同珍藏", "가장 아름다운 순간들을 함께 간직합니다", "最も美しい瞬間を私たちと共に"],
  "Những lời chúc và tình cảm của bạn là món quà quý giá nhất dành cho chúng mình": ["Những lời chúc và tình cảm của bạn là món quà quý giá nhất dành cho chúng mình", "Your wishes and love are the most precious gifts for us", "您的祝福与情意是给我们最珍贵的礼物", "귀하의 축하와 마음은 저희에게 가장 소중한 선물입니다", "皆様のお祝いの気持ちは私たちにとって最も大切な贈り物です"],
  "ở lại và cùng nhau đi đến hôm nay.": ["ở lại và cùng nhau đi đến hôm nay.", "stayed and walked together to this day.", "留下来并一起走到了今天。", "머물며 함께 오늘까지 걸어왔습니다.", "残って共に今日まで歩んできました。"],
  "Phượng": ["Phượng", "Phoenix", "凤", "봉황", "鳳凰"],
  "Quét mã QR để gửi lời chúc mừng": ["Quét mã QR để gửi lời chúc mừng", "Scan the QR code to send your wishes", "扫描二维码送上祝福", "QR 코드를 스캔해서 축하를 보내세요", "QRコードをスキャンしてお祝いを送る"],
  "Rồng": ["Rồng", "Dragon", "龙", "용", "龍"],
  "Sắp diễn ra!": ["Sắp diễn ra!", "Coming soon!", "即将举行！", "곧 시작됩니다!", "まもなく始まります!"],
  "Sự hiện diện của bạn đã là món quà quý giá nhất.": ["Sự hiện diện của bạn đã là món quà quý giá nhất.", "Your presence is already the most precious gift.", "您的光临已是最珍贵的礼物。", "귀하의 참석이 가장 소중한 선물입니다.", "ご列席こそが最も大切な贈り物です。"],
  "Sự hiện diện của Quý khách": ["Sự hiện diện của Quý khách", "Your presence", "您的光临", "귀빈의 참석", "ご列席の皆様"],
  "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!": ["Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!", "Your presence is an honor for our family!", "您的光临是我们全家的荣幸！", "귀빈의 참석은 저희 가족의 영광입니다!", "ご列席は私たちの家族の栄誉です!"],
  "THÁNG ": ["THÁNG ", "MONTH ", "月 ", "월 ", "月 "],
  "THÊM VÀO LỊCH": ["THÊM VÀO LỊCH", "ADD TO CALENDAR", "添加到日历", "달력에 추가", "カレンダーに追加"],
  "THIỆP HỒNG BÁO HỶ": ["THIỆP HỒNG BÁO HỶ", "PINK WEDDING ANNOUNCEMENT", "粉色喜帖", "핑크 청첩장", "ピンクの招待状"],
  "Thông tin chuyển khoản đang được cập nhật.": ["Thông tin chuyển khoản đang được cập nhật.", "Bank transfer information is being updated.", "转账信息正在更新中。", "계좌 정보가 업데이트 중입니다.", "振込情報は準備中です。"],
  "THỜI GIAN CỬ HÀNH": ["THỜI GIAN CỬ HÀNH", "CEREMONY TIME", "典礼时间", "예식 시간", "挙式時間"],
  "Tiệc báo hỷ sẽ diễn ra vào lúc:": ["Tiệc báo hỷ sẽ diễn ra vào lúc:", "The wedding banquet will be held at:", "喜宴将于以下时间举行：", "피로연이 아래 시간에 진행됩니다:", "披露宴は以下の時間に行われます:"],
  "Tiệc cưới của ": ["Tiệc cưới của ", "Wedding of ", "婚礼：", "결혼식: ", "結婚式: "],
  "TRĂM NĂM HẠNH PHÚC": ["TRĂM NĂM HẠNH PHÚC", "A HUNDRED YEARS OF HAPPINESS", "百年好合", "백년해로", "百年幸福"],
  "trân trọng báo tin": ["trân trọng báo tin", "respectfully announce", "敬告", "삼가 알립니다", "謹んでお知らせします"],
  "út nữ": ["út nữ", "youngest daughter", "幼女", "막내 딸", "末の娘"],
  "Vuốt sang để lật ảnh · chạm ảnh để xem lớn": ["Vuốt sang để lật ảnh · chạm ảnh để xem lớn", "Swipe to flip · tap to enlarge", "滑动翻页 · 点击放大", "스와이프해서 넘기기 · 탭해서 확대", "スワイプでめくる · タップで拡大"],
  "XEM BẢN ĐỒ": ["XEM BẢN ĐỒ", "VIEW MAP", "查看地图", "지도 보기", "地図を見る"],
  "XEM VỊ TRÍ TRÊN BẢN ĐỒ": ["XEM VỊ TRÍ TRÊN BẢN ĐỒ", "VIEW ON MAP", "在地图上查看位置", "지도에서 위치 보기", "地図で位置を見る"],
  "Hãy để lại một lời chúc thật đẹp cho đôi uyên ương.": ["Hãy để lại một lời chúc thật đẹp cho đôi uyên ương.", "Leave a beautiful wish for the couple.", "为这对新人留下一句美好的祝福吧。", "두 사람에게 아름다운 축하의 말을 남겨주세요.", "お二人へ素敵な祝福の言葉をお残しください。"],
  "Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể chuyển khoản qua các tài khoản bên dưới.": ["Nếu bạn muốn gửi lời chúc và món quà nhỏ đến cô dâu chú rể, bạn có thể chuyển khoản qua các tài khoản bên dưới.", "If you would like to send your wishes and a small gift to the couple, you can transfer to the accounts below.", "如果您想向新人送上祝福和一份小礼物，可以通过以下账户转账。", "신랑 신부에게 축하와 작은 선물을 보내고 싶으시다면 아래 계좌로 송금하실 수 있습니다.", "ご新郎新婦へお祝いとささやかな贈り物を送りたい方は、以下の口座へお振込みいただけます。"],
  "Những lời chúc sẽ trở thành một phần ký ức đẹp của chúng mình.": ["Những lời chúc sẽ trở thành một phần ký ức đẹp của chúng mình.", "Your wishes will become part of our beautiful memories.", "这些祝福将成为我们美好回忆的一部分。", "여러분의 축하가 우리의 아름다운 추억이 됩니다.", "皆さまの祝福は私たちの素敵な思い出の一部になります。"],
  "Sự hiện diện và lời chúc phúc của bạn đã là món quà quý giá nhất dành cho chúng mình.": ["Sự hiện diện và lời chúc phúc của bạn đã là món quà quý giá nhất dành cho chúng mình.", "Your presence and blessings are already the most precious gift to us.", "您的到来与祝福已是我们最珍贵的礼物。", "함께해 주시고 축복해 주시는 것만으로도 가장 소중한 선물입니다.", "お越しいただき祝福してくださることが、私たちにとって何よりの贈り物です。"],
  "TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA CON CHÚNG TÔI": ["TRÂN TRỌNG BÁO TIN LỄ THÀNH HÔN CỦA CON CHÚNG TÔI", "WE JOYFULLY ANNOUNCE THE WEDDING OF OUR CHILDREN", "谨此敬告 我们的孩子即将举行婚礼", "저희 자녀의 결혼식을 삼가 알려드립니다", "謹んでご報告申し上げます 私たちの子の結婚式"],
  "Từ một cuộc gặp gỡ tình cờ, những câu chuyện nhỏ dần trở thành những ký ức lớn. Và hôm nay, chúng mình quyết định viết tiếp câu chuyện ấy bằng một lời hẹn ước trăm năm.": ["Từ một cuộc gặp gỡ tình cờ, những câu chuyện nhỏ dần trở thành những ký ức lớn. Và hôm nay, chúng mình quyết định viết tiếp câu chuyện ấy bằng một lời hẹn ước trăm năm.", "From a chance meeting, small conversations grew into great memories. And today, we decide to continue that story with a vow of a hundred years.", "从一次偶然的相遇，细碎的对话渐渐成为珍贵的回忆。而今天，我们决定以百年之约续写这个故事。", "우연한 만남에서 시작된 작은 이야기들이 큰 추억이 되었습니다. 그리고 오늘, 우리는 백년의 약속으로 그 이야기를 이어가려 합니다.", "偶然の出会いから、小さな会話が大きな思い出になりました。そして今日、私たちは百年の誓いでその物語を続けることにしました。"],
};

for (const values of Object.values(SUPPLEMENT)) {
  byVi.set(values[0], values);
}

/* Chỉ giữ key đang dùng thật */
const used = keys.filter((k) => byVi.has(k));
const stillMissing = keys.filter((k) => !byVi.has(k));

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

for (const { file, idx, header } of LOCALES) {
  const lines = [
    "/*",
    ` * BẢN DỊCH CHỮ TRÊN THIỆP — ${header}`,
    " *",
    " * Key = chuỗi tiếng Việt gốc trong code ($t(\"...\")).",
    " * Thiếu key → hiển thị nguyên tiếng Việt (fallback).",
    " * Sửa bản dịch tại đây, không cần đụng code.",
    " */",
    "export default {",
  ];

  for (const key of used) {
    const values = byVi.get(key);
    const trans = values[idx];
    lines.push(`  '${esc(key)}': '${esc(trans)}',`);
  }

  lines.push("};");

  writeFileSync(join(ROOT, "src/lang", file), lines.join("\n") + "\n", "utf8");
  console.log(`OK src/lang/${file} — ${used.length} key`);
}

if (stillMissing.length) {
  console.log(`\n!!! VẪN THIẾU ${stillMissing.length} key:`);
  stillMissing.forEach((k) => console.log(`  ${JSON.stringify(k)}`));
} else {
  console.log("\nĐủ 100% key.");
}
