/*
 * Bổ sung bản dịch "chữ trên thiệp" còn thiếu vào 4 file
 * src/lang/en_US.js / zh_CN.js / ko_KR.js / ja_JP.js.
 *
 * Nguồn key thiếu: scripts/card-missing.json (sinh bởi
 * scripts/i18n-audit.mjs — quét $t("...") thật trong
 * src/page, src/components/common, src/components/gallery).
 *
 * Chạy: node scripts/i18n-card-fill.mjs
 * Idempotent: key đã có trong file thì giữ nguyên, không ghi đè.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/* vi → [en, zh, ko, ja] */
const T = {
  "Ảnh cưới": ["Wedding photo", "婚纱照", "웨딩 사진", "ウェディング写真"],
  "Trân trọng kính mời": ["Respectfully invite", "诚挚邀请", "삼가 초대합니다", "謹んでご招待申し上げます"],
  "NGÀY CỦA CHÚNG MÌNH": ["OUR DAY", "我们的日子", "우리의 날", "私たちの日"],
  "MỞ THIỆP": ["OPEN INVITATION", "打开请柬", "청첩장 열기", "招待状を開く"],
  "Một lời mời · Một lời hẹn · Một đời hạnh phúc": ["One invitation · One promise · A lifetime of happiness", "一份邀请 · 一个约定 · 一生幸福", "하나의 초대 · 하나의 약속 · 평생의 행복", "一つの招待 · 一つの約束 · 一生の幸せ"],
  "LỊCH TRÌNH NGÀY CƯỚI": ["WEDDING DAY SCHEDULE", "婚礼日程", "결혼식 일정", "結婚式のスケジュール"],
  "Một dấu mốc đặc biệt": ["A special milestone", "一个特别的里程碑", "특별한 이정표", "特別な節目"],
  "CÙNG ĐẾM NGƯỢC": ["COUNTDOWN TOGETHER", "一起倒计时", "함께 카운트다운", "一緒にカウントダウン"],
  "THÔNG TIN LỄ CƯỚI": ["WEDDING CEREMONY INFO", "婚礼信息", "예식 정보", "挙式情報"],
  "Ông Bà": ["Grandparents", "祖父母", "조부모", "祖父母"],
  "TRÂN TRỌNG BÁO TIN": ["JOYFULLY ANNOUNCE", "敬告", "삼가 알립니다", "謹んでお知らせします"],
  "TRƯỞNG NAM": ["Eldest son", "长子", "장남", "長男"],
  "ÚT NỮ": ["Youngest daughter", "幼女", "막내 딸", "末の娘"],
  "TƯ GIA": ["At home", "私宅", "자택", "自宅"],
  "THÔNG TIN TIỆC CƯỚI": ["WEDDING BANQUET INFO", "婚宴信息", "피로연 정보", "披露宴情報"],
  "Tiệc cưới sẽ diễn ra vào lúc:": ["The wedding banquet will be held at:", "婚宴将于以下时间举行：", "피로연이 아래 시간에 진행됩니다:", "披露宴は以下の時間に行われます:"],
  "Đón khách": ["Guest reception", "迎宾", "접객", "受付"],
  "Khai tiệc": ["Banquet begins", "开席", "개식", "開宴"],
  "ĐỊA ĐIỂM": ["VENUE", "地点", "장소", "会場"],
  "Thêm vào lịch": ["Add to calendar", "添加到日历", "달력에 추가", "カレンダーに追加"],
  "XÁC NHẬN THAM DỰ": ["RSVP", "确认出席", "참석 확인", "出席確認"],
  "Xác nhận tham dự": ["Confirm attendance", "确认出席", "참석 확인", "出席を確認"],
  "Sự hiện diện của bạn là niềm vui đối với gia đình chúng tôi.": ["Your presence is a joy to our family.", "您的光临是我们全家的喜悦。", "귀하의 참석은 저희 가족의 기쁨입니다.", "ご列席は私たち家族の喜びです。"],
  "TRÂN TRỌNG KÍNH MỜI": ["RESPECTFULLY INVITE", "诚挚邀请", "삼가 초대합니다", "謹んでご招待申し上げます"],
  "Họ và tên": ["Full name", "姓名", "성함", "お名前"],
  "Nhập tên của bạn": ["Enter your name", "请输入您的姓名", "이름을 입력하세요", "お名前を入力してください"],
  "Bạn có tham dự không?": ["Will you attend?", "您会出席吗？", "참석하시겠습니까?", "ご出席されますか？"],
  "Có, tôi sẽ tham dự": ["Yes, I will attend", "是，我会出席", "네, 참석합니다", "はい、出席します"],
  "Rất tiếc, tôi không thể tham dự": ["Sadly, I cannot attend", "很遗憾，我无法出席", "죄송하지만 참석이 어렵습니다", "残念ながら出席できません"],
  "Số người tham dự": ["Number of guests", "出席人数", "참석 인원", "出席人数"],
  "ĐANG GỬI...": ["SENDING...", "发送中...", "전송 중...", "送信中..."],
  "GỬI XÁC NHẬN": ["SEND RSVP", "发送确认", "확인 전송", "確認を送信"],
  "ALBUM ẢNH": ["PHOTO ALBUM", "相册", "사진 앨범", "フォトアルバム"],
  "Chưa có hình ảnh": ["No photos yet", "暂无照片", "사진이 없습니다", "写真はまだありません"],
  "HỘP QUÀ MỪNG": ["GIFT BOX", "礼金盒", "축의금함", "ご祝儀箱"],
  "Mở hộp mừng cưới": ["Open the gift box", "打开礼金盒", "축의금함 열기", "ご祝儀箱を開く"],
  "CHẠM ĐỂ MỞ": ["TAP TO OPEN", "点击打开", "터치해서 열기", "タップして開く"],
  "Đóng hộp quà mừng": ["Close the gift box", "关闭礼金盒", "축의금함 닫기", "ご祝儀箱を閉じる"],
  "Hộp quà mừng": ["Gift box", "礼金盒", "축의금함", "ご祝儀箱"],
  "Xem QR lớn": ["View large QR", "查看大二维码", "큰 QR 보기", "QRを拡大表示"],
  "QR mừng cưới": ["Wedding gift QR", "礼金二维码", "축의금 QR", "ご祝儀QR"],
  "CHẠM VÀO QR ĐỂ XEM LỚN": ["TAP THE QR TO ENLARGE", "点击二维码放大", "QR을 터치해서 확대", "QRをタップして拡大"],
  "CHỦ TÀI KHOẢN": ["ACCOUNT HOLDER", "账户名", "예금주", "口座名義"],
  "Chưa cập nhật": ["Not updated yet", "尚未更新", "미업데이트", "未更新"],
  "SỐ TÀI KHOẢN": ["ACCOUNT NUMBER", "账号", "계좌번호", "口座番号"],
  "Sao chép số tài khoản": ["Copy account number", "复制账号", "계좌번호 복사", "口座番号をコピー"],
  "Đóng QR": ["Close QR", "关闭二维码", "QR 닫기", "QRを閉じる"],
  "QR MỪNG CƯỚI": ["WEDDING GIFT QR", "礼金二维码", "축의금 QR", "ご祝儀QR"],
  "Nhấn giữ vào ảnh để lưu QR về điện thoại": ["Press and hold the image to save the QR to your phone", "长按图片将二维码保存到手机", "이미지를 길게 눌러 QR을 휴대폰에 저장하세요", "画像を長押ししてQRをスマホに保存"],
  "CHUYỆN TÌNH YÊU": ["OUR LOVE STORY", "爱情故事", "사랑 이야기", "愛の物語"],
  "SỔ LƯU BÚT": ["GUESTBOOK", "留言簿", "방명록", "ゲストブック"],
  "Nhập tên*": ["Enter name*", "输入姓名*", "이름 입력*", "お名前を入力*"],
  "Nhập lời chúc*": ["Enter your wish*", "输入祝福*", "축하 메시지 입력*", "お祝いの言葉を入力*"],
  "GỬI LỜI CHÚC": ["SEND WISHES", "发送祝福", "축하 보내기", "お祝いを送る"],
  "Chưa có lời chúc nào": ["No wishes yet", "暂无祝福", "축하 메시지가 없습니다", "お祝いはまだありません"],
  "Hãy là người đầu tiên gửi lời yêu thương": ["Be the first to send your love", "来当第一个送上祝福的人吧", "첫 번째로 사랑을 보내주세요", "最初にお祝いを送ってください"],
  "CHÚ RỂ": ["GROOM", "新郎", "신랑", "新郎"],
  "CÔ DÂU": ["BRIDE", "新娘", "신부", "新婦"],
  "THÁNG": ["MONTH", "月", "월", "月"],
  "NĂM": ["YEAR", "年", "년", "年"],
  "THỜI GIAN": ["TIME", "时间", "시간", "時間"],
  "TIỆC CƯỚI": ["WEDDING BANQUET", "婚宴", "피로연", "披露宴"],
  "ĐÓN KHÁCH": ["RECEPTION", "迎宾", "접객", "受付"],
  "KHAI TIỆC": ["BANQUET BEGINS", "开席", "개식", "開宴"],
  "LỊCH": ["CALENDAR", "日历", "달력", "カレンダー"],
  "CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI": ["THANK YOU FOR CELEBRATING WITH US", "感谢您前来同欢", "함께해 주셔서 감사합니다", "お越しいただきありがとうございます"],
  "Đóng hộp mừng cưới": ["Close the gift box", "关闭礼金盒", "축의금함 닫기", "ご祝儀箱を閉じる"],
  "MỘT CHÚT YÊU THƯƠNG": ["A LITTLE LOVE", "一点心意", "작은 마음", "ほんの気持ち"],
  "Hộp mừng cưới": ["Gift box", "礼金盒", "축의금함", "ご祝儀箱"],
  "Gửi lời yêu thương": ["Send your love", "送上祝福", "사랑을 보내세요", "お祝いを送る"],
  "LỜI CHÚC": ["WISHES", "祝福", "축하", "お祝い"],
  "TÊN CỦA BẠN": ["YOUR NAME", "您的姓名", "성함", "お名前"],
  "Viết lời chúc dành cho cô dâu & chú rể...": ["Write a wish for the bride & groom...", "为新娘新郎写下祝福...", "신랑 신부에게 축하를 남겨주세요...", "新郎新婦へお祝いを書いてください..."],
  "CHẠM ĐỂ MỞ THIỆP": ["TAP TO OPEN THE INVITATION", "点击打开请柬", "터치해서 청첩장 열기", "タップして招待状を開く"],
  "Một lời mời · Một câu chuyện · Một ngày đặc biệt": ["One invitation · One story · One special day", "一份邀请 · 一个故事 · 一个特别的日子", "하나의 초대 · 하나의 이야기 · 특별한 하루", "一つの招待 · 一つの物語 · 特別な一日"],
  "DẤU MỐC YÊU THƯƠNG": ["MILESTONES OF LOVE", "爱的里程碑", "사랑의 이정표", "愛の節目"],
  "Hành trình của chúng mình": ["Our journey", "我们的旅程", "우리의 여정", "私たちの旅"],
  "Những khoảnh khắc đặc biệt đã đưa chúng mình đến ngày hôm nay": ["The special moments that brought us to today", "那些特别的瞬间带我们走到了今天", "우리를 오늘에 이르게 한 특별한 순간들", "私たちを今日へ導いた特別な瞬間"],
  "NGÀY VUI ĐANG ĐẾN GẦN": ["THE BIG DAY IS COMING", "大喜之日即将到来", "결혼식 날이 다가옵니다", "挙式の日が近づいています"],
  "Đếm ngược": ["Countdown", "倒计时", "카운트다운", "カウントダウン"],
  "TRÂN TRỌNG BÁO HỶ": ["JOYFULLY ANNOUNCE", "敬告", "삼가 알립니다", "謹んでお知らせします"],
  "Thông tin tiệc cưới": ["Wedding banquet info", "婚宴信息", "피로연 정보", "披露宴情報"],
  "Album Ảnh Cưới": ["Wedding Photo Album", "婚纱相册", "웨딩 사진 앨범", "ウェディングフォトアルバム"],
  "GỬI YÊU THƯƠNG": ["SEND LOVE", "送上祝福", "사랑 보내기", "お祝いを送る"],
  "CÂU CHUYỆN CỦA CHÚNG MÌNH": ["OUR STORY", "我们的故事", "우리의 이야기", "私たちの物語"],
  "LỜI CHÚC TỪ BẠN": ["WISHES FROM YOU", "来自您的祝福", "보내주신 축하", "皆さまからのお祝い"],
  "Sổ lưu bút": ["Guestbook", "留言簿", "방명록", "ゲストブック"],
  "Mỗi lời chúc là một kỷ niệm đẹp mà chúng mình muốn lưu giữ trong ngày đặc biệt này": ["Every wish is a beautiful memory we want to keep from this special day", "每一句祝福都是我们想在这特别的日子里珍藏的美好回忆", "모든 축하 메시지는 이 특별한 날에 간직하고 싶은 아름다운 추억입니다", "一つ一つのお祝いが、この特別な日に残したい素敵な思い出です"],
  "THIỆP CƯỚI": ["WEDDING INVITATION", "婚礼请柬", "청첩장", "結婚招待状"],
  "Quý khách": ["Dear guest", "尊敬的宾客", "귀빈", "ご来賓"],
  "Một dấu mốc đáng nhớ": ["A memorable milestone", "一个难忘的里程碑", "기억에 남는 이정표", "忘れられない節目"],
  "Đếm ngược ngày vui": ["Countdown to the big day", "大喜之日倒计时", "결혼식 날 카운트다운", "挙式日カウントダウン"],
  "Đôi uyên ương": ["The couple", "这对新人", "두 사람", "お二人"],
  "Ngày trọng đại": ["The big day", "大喜之日", "중요한 날", "大切な日"],
  "LỄ CƯỚI": ["WEDDING CEREMONY", "婚礼", "결혼식", "結婚式"],
  "Lễ thành hôn": ["Wedding ceremony", "结婚典礼", "결혼식", "結婚式"],
  "Khoảnh khắc yêu thương": ["Moments of love", "爱的瞬间", "사랑의 순간", "愛の瞬間"],
  "Những hình ảnh chúng mình muốn lưu giữ mãi.": ["The photos we want to keep forever.", "我们想永远珍藏的照片。", "영원히 간직하고 싶은 사진들.", "ずっと残しておきたい写真。"],
  "Hộp quà mừng cưới": ["Wedding gift box", "婚礼礼金盒", "축의금함", "ご祝儀箱"],
  "Mừng cưới": ["Wedding gift", "礼金", "축의금", "ご祝儀"],
  "ĐÔNG SƠN · TRĂM NĂM HẠNH PHÚC": ["DONG SON · A HUNDRED YEARS OF HAPPINESS", "东山 · 百年好合", "동선 · 백년해로", "東山 · 百年幸福"],
  "Chuyện chúng mình": ["Our story", "我们的故事", "우리의 이야기", "私たちの物語"],
  "Lời chúc yêu thương": ["Loving wishes", "爱的祝福", "사랑의 축하", "愛の祝福"],
  "✦ Gửi lời yêu thương ✦": ["✦ Send your love ✦", "✦ 送上祝福 ✦", "✦ 사랑을 보내세요 ✦", "✦ お祝いを送る ✦"],
  "Viết lời chúc dành cho đôi uyên ương...": ["Write a wish for the couple...", "为这对新人写下祝福...", "두 사람에게 축하를 남겨주세요...", "お二人へお祝いを書いてください..."],
  "NGÀY TRỌNG ĐẠI CỦA CHÚNG MÌNH": ["OUR BIG DAY", "我们的大喜之日", "우리의 중요한 날", "私たちの大切な日"],
  "Lịch trình ngày cưới": ["Wedding day schedule", "婚礼日程", "결혼식 일정", "結婚式のスケジュール"],
  "Cùng đếm ngược": ["Count down together", "一起倒计时", "함께 카운트다운", "一緒にカウントダウン"],
  "Từng giây trôi qua là một bước gần hơn đến ngày chúng mình chung đôi": ["Every second brings us closer to the day we become one", "每一秒都让我们更接近携手的那一天", "매 순간 우리가 하나 되는 날에 가까워집니다", "一秒ごとに、私たちが結ばれる日に近づきます"],
  "Thông tin lễ cưới": ["Wedding ceremony info", "婚礼信息", "예식 정보", "挙式情報"],
  "VÀO LÚC": ["AT", "时间", "시간", "時刻"],
  "Đóng": ["Close", "关闭", "닫기", "閉じる"],
  "Album Ảnh": ["Photo Album", "相册", "사진 앨범", "フォトアルバム"],
  "Hộp Quà Mừng": ["Gift Box", "礼金盒", "축의금함", "ご祝儀箱"],
  "Nhấn để mở": ["Tap to open", "点击打开", "터치해서 열기", "タップして開く"],
  "Cô dâu": ["Bride", "新娘", "신부", "新婦"],
  "Chú rể": ["Groom", "新郎", "신랑", "新郎"],
  "Chuyện tình yêu": ["Love story", "爱情故事", "사랑 이야기", "愛の物語"],
  "Chưa có lời chúc nào. Hãy là người đầu tiên!": ["No wishes yet. Be the first!", "暂无祝福。来当第一个吧！", "축하 메시지가 없습니다. 첫 번째가 되어주세요!", "お祝いはまだありません。最初の一人になってください！"],
  "Album ảnh cưới": ["Wedding photo album", "婚纱相册", "웨딩 사진 앨범", "ウェディングフォトアルバム"],
  "Mở hộp quà mừng": ["Open the gift box", "打开礼金盒", "축의금함 열기", "ご祝儀箱を開く"],
  "THIỆP MỜI": ["INVITATION", "请柬", "초대장", "招待状"],
  "LỄ THÀNH HÔN": ["WEDDING CEREMONY", "结婚典礼", "결혼식", "結婚式"],
  "NGÀY TRỌNG ĐẠI": ["THE BIG DAY", "大喜之日", "중요한 날", "大切な日"],
  "NGÀY TRỌNG ĐẠI ĐANG ĐẾN GẦN": ["THE BIG DAY IS APPROACHING", "大喜之日即将到来", "중요한 날이 다가옵니다", "大切な日が近づいています"],
  "NGÀY": ["DAY", "日", "일", "日"],
  "GIỜ": ["HOUR", "时", "시", "時"],
  "PHÚT": ["MINUTE", "分", "분", "分"],
  "GIÂY": ["SECOND", "秒", "초", "秒"],
  "BỐ": ["Father", "父亲", "아버지", "父"],
  "MẸ": ["Mother", "母亲", "어머니", "母"],
  "NHỮNG KHOẢNH KHẮC": ["MOMENTS", "瞬间", "순간들", "瞬間"],
  "KHOẢNH KHẮC CỦA CHÚNG MÌNH": ["OUR MOMENTS", "我们的瞬间", "우리의 순간", "私たちの瞬間"],
  "MỘT CHÚT TẤM LÒNG": ["A LITTLE GIFT", "一点心意", "작은 마음", "ほんの気持ち"],
  "MỪNG CƯỚI": ["WEDDING GIFT", "礼金", "축의금", "ご祝儀"],
  "Chưa có thông tin mừng cưới": ["No gift information yet", "暂无礼金信息", "축의금 정보가 없습니다", "ご祝儀情報はまだありません"],
  "SAO CHÉP": ["COPY", "复制", "복사", "コピー"],
  "Cô dâu chú rể": ["The bride and groom", "新娘新郎", "신랑 신부", "新郎新婦"],
  "THÔNG TIN VỀ CHÚNG MÌNH": ["ABOUT US", "关于我们", "우리 소개", "私たちについて"],
  "GỬI ĐẾN CHÚNG MÌNH": ["SEND TO US", "送给我们", "우리에게 보내기", "私たちへ送る"],
  "GỬI LỜI CHÚC ĐẾN CÔ DÂU CHÚ RỂ": ["SEND WISHES TO THE COUPLE", "向新人送上祝福", "신랑 신부에게 축하 보내기", "新郎新婦へお祝いを送る"],
  "HỌ VÀ TÊN": ["FULL NAME", "姓名", "성함", "お名前"],
  "Gửi những lời chúc tốt đẹp nhất...": ["Send your best wishes...", "送上最美好的祝福...", "가장 좋은 축하를 보내주세요...", "最高のお祝いを送ってください..."],
  "NHỮNG LỜI CHÚC": ["WISHES", "祝福", "축하 메시지", "お祝いの言葉"],
  "THIỆP CƯỚI LONG PHỤNG": ["DRAGON & PHOENIX WEDDING INVITATION", "龙凤婚礼请柬", "용봉 청첩장", "龍鳳の結婚招待状"],
  "LỊCH TRÌNH NGÀY VUI": ["BIG DAY SCHEDULE", "大喜之日日程", "결혼식 날 일정", "挙式日のスケジュール"],
  "ĐẾM NGƯỢC NGÀY VUI": ["COUNTDOWN TO THE BIG DAY", "大喜之日倒计时", "결혼식 날 카운트다운", "挙式日カウントダウン"],
  "NHÀ GÁI": ["BRIDE'S FAMILY", "女方家", "신부 측", "新婦側"],
  "NHÀ TRAI": ["GROOM'S FAMILY", "男方家", "신랑 측", "新郎側"],
  "ALBUM ẢNH CƯỚI": ["WEDDING PHOTO ALBUM", "婚纱相册", "웨딩 사진 앨범", "ウェディングフォトアルバム"],
  "HỘP MỪNG CƯỚI": ["GIFT BOX", "礼金盒", "축의금함", "ご祝儀箱"],
  "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!": ["Your presence is an honor for our family!", "您的光临是我们全家的荣幸！", "귀빈의 참석은 저희 가족의 영광입니다!", "ご列席は私たち家族の栄誉です！"],
  "Ngày trọng đại đang đến gần": ["The big day is approaching", "大喜之日即将到来", "중요한 날이 다가옵니다", "大切な日が近づいています"],
  "Lời chúc": ["Wish", "祝福", "축하", "お祝い"],
  "Đầu thiệp": ["Invitation header", "请柬开头", "청첩장 머리말", "招待状の冒頭"],
  "Nhập tên của bạn*": ["Enter your name*", "请输入您的姓名*", "이름을 입력하세요*", "お名前を入力してください*"],
  "Nhập lời chúc của bạn*": ["Enter your wish*", "输入您的祝福*", "축하 메시지를 입력하세요*", "お祝いの言葉を入力してください*"],
  "Tạo lời chúc bằng AI": ["Generate a wish with AI", "用 AI 生成祝福", "AI로 축하 메시지 생성", "AIでお祝いを生成"],
  "TRANG PHỤC": ["DRESS CODE", "着装", "드레스 코드", "ドレスコード"],
  "Biểu tượng cưới": ["Wedding symbol", "婚礼象征", "웨딩 심볼", "ウェディングシンボル"],
  "LỄ THÀNH HÔN TẠI": ["WEDDING CEREMONY AT", "结婚典礼于", "결혼식 장소", "結婚式会場"],
  "KÍNH MỜI": ["INVITE", "敬邀", "초대합니다", "ご招待"],
  "Khách mời": ["Guest", "宾客", "하객", "ゲスト"],
  "Một lời chúc yêu thương": ["A loving wish", "一句爱的祝福", "사랑의 축하 한마디", "愛のお祝いの言葉"],
  "Một người bạn": ["A friend", "一位朋友", "한 친구", "一人の友人"],
  "Trang phục dự tiệc": ["Party attire", "宴会着装", "파티 복장", "パーティー服装"],
  "Trăng soi đôi hạc · Vạn sự song toàn": ["Moonlight on the cranes · All things in harmony", "月照双鹤 · 万事双全", "달빛 아래 두 학 · 만사형통", "月が照らす二羽の鶴 · 万事円満"],
  "Để bức ảnh chung thêm phần hài hoà, chúng mình mong quý khách ghé thăm buổi tiệc với trang phục mang tông màu sau": ["To make our group photos more harmonious, we hope you'll join the party in the following color tones", "为了让合影更和谐，希望您以以下色调的服装出席", "단체 사진이 더 조화롭도록 아래 색상 톤의 의상으로 참석해 주시면 감사하겠습니다", "集合写真がより調和するよう、以下の色合いのお召し物でご出席いただけますと幸いです"],
  "Song hỷ": ["Double happiness", "双喜", "쌍희", "双喜"],
  "Thân Mời": ["Cordially invite", "诚邀", "삼가 초대합니다", "謹んでご招待"],
  "Chúc mừng hạnh phúc!": ["Congratulations!", "祝幸福！", "행복을 축하합니다!", "お幸せに！"],
  "Bạn sẽ tham dự chứ?": ["Will you attend?", "您会出席吗？", "참석하시겠습니까?", "ご出席されますか？"],
  "Có tham dự": ["Attending", "出席", "참석", "出席"],
  "Không tham dự": ["Not attending", "不出席", "불참", "欠席"],
  "Đang gửi...": ["Sending...", "发送中...", "전송 중...", "送信中..."],
  "Đang tự cuộn · chạm để dừng": ["Auto-scrolling · tap to stop", "自动滚动 · 点击停止", "자동 스크롤 · 터치해서 정지", "自動スクロール · タップで停止"],
  "Nhận quà": ["Claim gift", "领取礼物", "선물 받기", "景品を受け取る"],
  "Bản đồ ": ["Map ", "地图 ", "지도 ", "地図 "],
  "sự kiện": ["event", "活动", "이벤트", "イベント"],
  "Bật hoặc tắt nhạc": ["Toggle music", "开关音乐", "음악 켜기/끄기", "音楽のオン/オフ"],
  "Quay tiếp": ["Spin again", "再转一次", "다시 돌리기", "もう一度回す"],
  "Họ và tên của bạn": ["Your full name", "您的姓名", "성함", "お名前"],
  "Đã nhận quà": ["Gift claimed", "已领取礼物", "선물 받음", "景品受け取り済み"],
  "CÀO ĐỂ NHẬN QUÀ": ["SCRATCH TO CLAIM YOUR GIFT", "刮开领取礼物", "긁어서 선물 받기", "削って景品を受け取る"],
  "Khoảnh khắc": ["Moments", "瞬间", "순간", "瞬間"],
  "Video cưới": ["Wedding video", "婚礼视频", "웨딩 영상", "ウェディングビデオ"],
  "Đóng album": ["Close album", "关闭相册", "앨범 닫기", "アルバムを閉じる"],
  "Ảnh trước": ["Previous photo", "上一张", "이전 사진", "前の写真"],
  "Ảnh tiếp theo": ["Next photo", "下一张", "다음 사진", "次の写真"],
  "Xem ảnh ": ["View photo ", "查看照片 ", "사진 보기 ", "写真を見る "],
  "Khoảnh khắc cưới ": ["Wedding moment ", "婚礼瞬间 ", "웨딩 순간 ", "ウェディングの瞬間 "],
  "Đến ảnh ": ["To photo ", "到照片 ", "사진으로 ", "写真へ "],
};

const FILES = [
  { file: "en_US.js", idx: 0 },
  { file: "zh_CN.js", idx: 1 },
  { file: "ko_KR.js", idx: 2 },
  { file: "ja_JP.js", idx: 3 },
];

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

for (const { file, idx } of FILES) {
  const path = join(ROOT, "src/lang", file);
  let src = readFileSync(path, "utf8");

  const existing = new Set();
  const re = /^\s*'((?:[^'\\]|\\.)*)'\s*:/gm;
  let m;
  while ((m = re.exec(src))) existing.add(m[1].replace(/\\'/g, "'"));

  const added = [];
  for (const [vi, trans] of Object.entries(T)) {
    if (existing.has(vi)) continue;
    added.push(`  '${esc(vi)}': '${esc(trans[idx])}',`);
  }

  if (!added.length) {
    console.log(`${file}: không có key mới`);
    continue;
  }

  const close = src.lastIndexOf("};");
  src = src.slice(0, close) + added.join("\n") + "\n" + src.slice(close);
  writeFileSync(path, src, "utf8");
  console.log(`${file}: +${added.length} key`);
}
