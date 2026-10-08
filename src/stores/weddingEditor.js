import { defineStore } from "pinia";

import { DEFAULT_QUIZ_QUESTIONS } from "@/data/gameData";

import {
  DEFAULT_PALETTE,
  THEME_PALETTES,
} from "@/data/themePalettes";

/*
 * Bản ghi giá trị đồng bộ gần nhất cho các trường
 * dùng chung (GroomName/BrideName/WeddingDate ở
 * Hero/Footer). Không cần reactive — chỉ dùng để
 * phân biệt "đang trùng giá trị đã sync" với
 * "người dùng chủ động sửa khác đi".
 */
let lastSynced = {};

/*
 * Số bước hoàn tác tối đa. Mỗi bước là một bản
 * snapshot JSON của wedding — đủ nhỏ để giữ trong
 * bộ nhớ nhưng vẫn cho người dùng "cứu" được các
 * thao tác nhập liệu.
 */
const HISTORY_LIMIT = 40;

/*
 * Khóa localStorage giữ bản nháp khi người dùng
 * lỡ tải lại trang / đóng tab.
 */
const DRAFT_KEY = "wedding-editor-draft";

/*
 * Bảng màu từng mẫu đã tách sang src/data/themePalettes.js
 * để component dùng chung (GameSection, VideoSection...)
 * import được mà không kéo editor store vào bundle trang
 * khách mời. Re-export giữ nguyên import path cũ
 * (ThemePanel, verify-theme-panel.mjs).
 */
export { THEME_PALETTES };

function clone(value) {
  if (!value) {
    return null;
  }

  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

export const useWeddingEditorStore =
  defineStore("weddingEditor", {

    state: () => ({
      wedding: null,
      initialized: false,

      /*
       * Trạng thái "có thay đổi chưa lưu" — dùng cho
       * badge autosave, cảnh báo rời trang và nút Lưu.
       */
      dirty: false,

      lastSavedAt: null,

      /*
       * Lịch sử hoàn tác: mảng snapshot + con trỏ.
       * historyIndex luôn trỏ tới bản đang hiển thị.
       */
      history: [],
      historyIndex: -1,

      /*
       * Bản nháp khôi phục được từ localStorage (nếu có)
       * — Editor.vue hỏi người dùng trước khi dùng.
       */
      pendingDraft: null,
    }),

    getters: {
      canUndo: (state) => state.historyIndex > 0,

      canRedo: (state) =>
        state.historyIndex >= 0 &&
        state.historyIndex < state.history.length - 1,

      /*
       * Số bước đã thao tác — hiển thị cho người dùng
       * biết còn hoàn tác được bao nhiêu lần.
       */
      undoDepth: (state) => Math.max(0, state.historyIndex),
    },

    actions: {

      /* =====================================================
         ĐỒNG BỘ TRƯỜNG DÙNG CHUNG
      ===================================================== */

      /*
       * Đồng bộ các trường dùng chung giữa các panel:
       * nhập tên/ngày ở panel Thông tin chung sẽ tự
       * điền sang Hero/Footer/Couple/Countdown (và
       * ngược lại) — người dùng không phải nhập lại.
       *
       * Quy tắc: chỉ ghi đè trường đích khi nó đang
       * trống hoặc đang trùng giá trị cũ (đã được sync
       * trước đó), để không mất nội dung người dùng
       * chủ động sửa khác đi.
       */
      syncSharedFields(source, target) {
        if (!source || !target) {
          return;
        }

        const pairs = [
          ["groomName", "GroomName"],
          ["brideName", "BrideName"],
          ["weddingDate", "WeddingDate"],
        ];

        pairs.forEach(([from, to]) => {
          const next = source[from];

          if (!next) {
            return;
          }

          const current = target[to];

          if (!current || current === lastSynced[to]) {
            target[to] = next;

            lastSynced[to] = next;
          }
        });
      },

      /*
       * Tự điền dữ liệu liên quan khi nhập ở panel
       * Thông tin chung:
       *
       * - groomName → couple.Groom.Name
       * - brideName → couple.Bride.Name
       * - weddingDate → countdown.Target
       *
       * Dùng cùng cơ chế lastSynced với syncSharedFields:
       * chỉ ghi đè khi trường đích đang trống hoặc vẫn
       * trùng giá trị đã sync trước đó.
       */
      syncRelatedFields(source) {
        if (!source || !this.wedding) {
          return;
        }

        const targets = [
          {
            value: source.groomName,
            get: () => this.wedding.couple?.Groom,
            key: "Name",
            syncKey: "coupleGroomName",
          },
          {
            value: source.brideName,
            get: () => this.wedding.couple?.Bride,
            key: "Name",
            syncKey: "coupleBrideName",
          },
          {
            value: source.weddingDate,
            get: () => this.wedding.countdown,
            key: "Target",
            syncKey: "countdownTarget",
          },
        ];

        targets.forEach(({ value, get, key, syncKey }) => {
          if (!value) {
            return;
          }

          const target = get();

          if (!target) {
            return;
          }

          const current = target[key];

          if (!current || current === lastSynced[syncKey]) {
            target[key] = value;

            lastSynced[syncKey] = value;
          }
        });
      },

      /* =====================================================
         LỊCH SỬ HOÀN TÁC
      ===================================================== */

      /*
       * Ghi một bản snapshot mới vào lịch sử.
       *
       * Gọi sau mỗi thay đổi đã "lắng" (debounce ở
       * composable useEditorHistory) để không tạo ra
       * hàng trăm bước cho một lần gõ phím.
       */
      pushHistory() {
        if (!this.wedding) {
          return;
        }

        const snapshot = clone(this.wedding);

        /*
         * Bỏ các bước "redo" cũ khi người dùng thao tác
         * tiếp sau khi đã hoàn tác.
         */
        if (this.historyIndex < this.history.length - 1) {
          this.history = this.history.slice(0, this.historyIndex + 1);
        }

        this.history.push(snapshot);

        if (this.history.length > HISTORY_LIMIT) {
          this.history.shift();
        }

        this.historyIndex = this.history.length - 1;
      },

      undo() {
        if (!this.canUndo) {
          return false;
        }

        this.historyIndex -= 1;

        this.wedding = clone(this.history[this.historyIndex]);

        this.dirty = true;

        return true;
      },

      redo() {
        if (!this.canRedo) {
          return false;
        }

        this.historyIndex += 1;

        this.wedding = clone(this.history[this.historyIndex]);

        this.dirty = true;

        return true;
      },

      resetHistory() {
        this.history = [];
        this.historyIndex = -1;

        if (this.wedding) {
          this.pushHistory();
        }
      },

      /* =====================================================
         TRẠNG THÁI LƯU
      ===================================================== */

      markDirty() {
        this.dirty = true;
      },

      markSaved() {
        this.dirty = false;
        this.lastSavedAt = Date.now();
      },

      /* =====================================================
         BẢN NHÁP LOCALSTORAGE
      ===================================================== */

      /*
       * Lưu bản nháp xuống localStorage. Không lưu ảnh
       * base64 (rất nặng) — chỉ lưu cấu trúc dữ liệu.
       */
      saveDraft() {
        if (!this.wedding) {
          return;
        }

        try {
          window.localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({
              savedAt: Date.now(),
              wedding: this.wedding,
            })
          );
        } catch (error) {
          /*
           * Hết quota hoặc chế độ riêng tư — bỏ qua,
           * autosave chỉ là tiện ích.
           */
          console.warn("[WeddingEditor] Không lưu được bản nháp:", error);
        }
      },

      /*
       * Đọc bản nháp đang có trong localStorage.
       * Trả về { savedAt, wedding } hoặc null.
       */
      readDraft() {
        try {
          const raw = window.localStorage.getItem(DRAFT_KEY);

          if (!raw) {
            return null;
          }

          const parsed = JSON.parse(raw);

          if (!parsed?.wedding) {
            return null;
          }

          return parsed;
        } catch (error) {
          console.warn("[WeddingEditor] Bản nháp hỏng, bỏ qua:", error);

          return null;
        }
      },

      clearDraft() {
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* bỏ qua */
        }

        this.pendingDraft = null;
      },

      /* =====================================================
         KHỞI TẠO
      ===================================================== */

      init(themeName = "traditional-red") {
        if (this.wedding) {
          return this.wedding;
        }

        /*
         * Thiệp mới khởi tạo với NỘI DUNG MẪU đầy đủ (lấy từ
         * mock/wedding.json) — người dùng vào chỉ cần ĐỔI nội
         * dung cho đúng mình, không phải nhập từ trang trắng.
         * Slug để trống: người dùng tự đặt (hoặc bấm "từ tên").
         */
        this.wedding = {
          Id: null,
          slug: "",

          groomName: "Trần Hiếu",
          brideName: "Hà Uyên",
          language: "vi",
          weddingDate: "2026-11-14T08:00:00",

          coverImage: "",

          theme: {
            Name: themeName,

            /*
             * Màu theo từng mẫu (xem THEME_PALETTES) —
             * không còn gán cứng bảng traditional-red
             * cho mọi thiệp.
             */
            Colors: {
              ...clone(THEME_PALETTES[themeName] || DEFAULT_PALETTE),
            },

            Fonts: {
              Main: "Cormorant Garamond",
              Heading: "Cormorant Garamond",
              Script: "Allura",
            },

            Layout: {
              MaxWidth: "900px",
              SectionPadding: "80px",
            },
          },

          couple: {
            Bride: {
              Name: "Hà Uyên",
              Nickname: "Uyên",
              Role: "Cô dâu",
              Avatar: "",
              Cover: "",
              Father: "Đinh Văn Tá",
              Mother: "Nguyễn Thị Thu",
              Address: "Thôn Đồng Tâm, xã Hợp Thịnh, huyện Hiệp Hòa, tỉnh Bắc Ninh",
              Description: "Một cô gái nhẹ nhàng, luôn mang đến sự ấm áp cho mọi người.",
            },

            Groom: {
              Name: "Trần Hiếu",
              Nickname: "Hiếu",
              Role: "Chú rể",
              Avatar: "",
              Cover: "",
              Father: "Trần Văn Bình",
              Mother: "Nguyễn Thị Bảy",
              Address: "Số 9 đường Cống Đồng, thôn Đức Hậu, xã Đa Phúc, TP Hà Nội",
              Description: "Một chàng trai chân thành, luôn biết quan tâm và sẻ chia.",
            },
          },

          hero: {
            GroomName: "Trần Hiếu",
            BrideName: "Hà Uyên",
            Title: "Save The Date",
            WeddingDate: "2026-11-14T08:00:00",
            Subtitle: "Trân trọng kính mời",
            Background: "",
            Music: "",
            Location: "Thôn Đồng Tâm, xã Hợp Thịnh, huyện Hiệp Hòa, tỉnh Bắc Ninh",
          },

          story: {
            Title: "Chuyện Tình Yêu",
            Description: "Từ những người bạn, chúng mình đã cùng nhau đi qua nhiều chặng đường và quyết định nắm tay nhau suốt cuộc đời.",

            /*
             * Chế độ hiển thị: 'text' (1 khối văn bản) hoặc
             * 'milestones' (danh sách dấu mốc — xem
             * storyMilestones bên dưới).
             */
            Mode: "text",
          },

          /*
           * Mốc chuyện tình yêu (chế độ 'milestones') —
           * mỗi mốc: Date (chuỗi tự do), Title, Description,
           * Image. Thứ tự hiển thị theo thứ tự list.
           */
          storyMilestones: [],

          /*
           * Video cưới (YouTube/TikTok) — chủ thiệp dán link,
           * thiệp nhúng và phát. Bật/tắt qua settings.ShowVideo.
           */
          video: {
            Enabled: true,
            Url: "https://www.youtube.com/watch?v=PggDHkV0nGU",
            Title: "Video cưới của chúng mình",
          },

          /*
           * Mini game — 4 loại (lucky-wheel / couple-quiz /
           * scratch-card / memory-match). Bật/tắt qua
           * settings.ShowGame.
           */
          game: {
            Enabled: true,
            GameType: "lucky-wheel",
            Title: "Ghép hình cặp đôi",
          },

          /*
           * Phần quà thật từ cô dâu chú rể — có quà là game
           * chạy "chế độ quà" (khách trúng nhập tên để đối
           * chiếu tại lễ). Rỗng = chế độ vui (lời chúc).
           */
          gamePrizes: [],

          /*
           * Câu hỏi trắc nghiệm (game couple-quiz) — khởi tạo
           * bằng 3 câu mẫu để chủ thiệp có sẵn nội dung sửa.
           */
          gameQuestions: DEFAULT_QUIZ_QUESTIONS.map((q) => ({ ...q })),

          /* Ảnh ghép đôi (game memory-match) — rỗng dùng album. */
          gameImages: [],

          /*
           * Sự kiện cưới — 2 buổi mẫu (vu quy + thành hôn),
           * người dùng đổi ngày/giờ/địa chỉ cho đúng mình.
           */
          events: [
            {
              Id: 1,
              EventType: "vuquy",
              Title: "Lễ Vu Quy",
              Weekday: "THỨ BẢY",
              Day: "14",
              Month: "11",
              Year: "2026",
              EventDate: "2026-11-14",
              EventTime: "09:00",
              Lunar: "",
              Location: "Tư gia nhà gái",
              Address: "Thôn Đồng Tâm, xã Hợp Thịnh, Bắc Ninh",
              Map: "",
            },
            {
              Id: 2,
              EventType: "tanthanh",
              Title: "Lễ Thành Hôn",
              Weekday: "THỨ BẢY",
              Day: "14",
              Month: "11",
              Year: "2026",
              EventDate: "2026-11-14",
              EventTime: "17:30",
              Lunar: "",
              Location: "Nhà hàng ABC",
              Address: "123 Đường Lê Lợi, Hà Nội",
              Map: "",
            },
          ],

          /*
           * Lịch trình ngày cưới — 5 mốc mẫu theo trình tự
           * một buổi tiệc chuẩn.
           */
          timeline: [
            {
              Id: 1,
              Time: "08:00",
              Title: "Chuẩn bị đón khách",
              Description: "Cô dâu chú rể chuẩn bị những khoảnh khắc đầu tiên.",
              Location: "Tư gia nhà gái",
              Icon: "♡",
            },
            {
              Id: 2,
              Time: "09:30",
              Title: "Làm lễ gia tiên",
              Description: "Nghi thức gia tiên và trao gửi lời chúc phúc.",
              Location: "Tư gia",
              Icon: "囍",
            },
            {
              Id: 3,
              Time: "11:00",
              Title: "Đón khách",
              Description: "Trân trọng đón tiếp quý khách đến chung vui.",
              Location: "Sảnh tiệc cưới",
              Icon: "♡",
            },
            {
              Id: 4,
              Time: "11:30",
              Title: "Khai tiệc",
              Description: "Cùng nhau nâng ly chúc mừng hạnh phúc đôi uyên ương.",
              Location: "Nhà hàng tiệc cưới",
              Icon: "✦",
            },
            {
              Id: 5,
              Time: "12:00",
              Title: "Chụp ảnh lưu niệm",
              Description: "Lưu lại những khoảnh khắc đáng nhớ cùng gia đình và bạn bè.",
              Location: "Sảnh tiệc",
              Icon: "✧",
            },
          ],

          gallery: [],
          recipientName: [],

          /*
           * Quà cưới — 2 mục mẫu (chuyển khoản + ví điện tử),
           * người dùng thay bằng tài khoản thật của mình.
           */
          gifts: [
            {
              Id: 1,
              Name: "Chuyển khoản",
              Description: "Nếu muốn gửi lời chúc bằng món quà nhỏ, bạn có thể chuyển khoản theo thông tin dưới đây.",
              BankName: "MB Bank",
              AccountName: "TRẦN VĂN HIẾU",
              AccountNumber: "0123456789",
              QrCode: "",
            },
            {
              Id: 2,
              Name: "Ví điện tử",
              Description: "Bạn cũng có thể gửi lời chúc thông qua ví điện tử.",
              BankName: "Momo",
              AccountName: "HÀ THỊ UYÊN",
              AccountNumber: "0123456789",
              QrCode: "",
            },
          ],

          guestBook: {
            Enabled: true,
            Title: "Sổ Lưu Bút",
            Guest: [],
          },

          countdown: {
            Enabled: true,
            Target: "2026-11-14T09:00:00",
          },

          footer: {
            Message: "Sự hiện diện của Quý khách là niềm vinh hạnh của gia đình chúng tôi.",
            Copyright: "Hà Uyên & Trần Hiếu",
            GroomName: "Trần Hiếu",
            BrideName: "Hà Uyên",
          },

          settings: {
            ShowHero: true,
            ShowCouple: true,
            ShowStory: true,
            ShowEvents: true,
            ShowCountdown: true,
            ShowTimeline: true,
            ShowGallery: true,
            ShowMap: true,
            ShowDressCode: true,
            ShowGift: true,
            ShowGuestBook: true,
            ShowMusic: true,
            ShowFooter: true,

            /*
             * Mục mới mặc định TẮT ở thiệp mới — người dùng
             * tự bật khi dán link / muốn có game. Thiệp CŨ
             * load từ API được back-fill false ở
             * ensureNewSections (utils/weddingShape.js).
             */
            ShowVideo: false,
            ShowGame: false,
            ShowSeasonFx: true,
          },

          music: {
            Enabled: true,
            Url: "/music/So_Beautiful_In_White.mp3",
            Title: "So Beautiful In White",
            Autoplay: true,
          },

          /*
           * Trang phục dự tiệc — chỉ vài mẫu dùng
           * (xem các trang DressCode.vue trong src/page).
           */
          dressCode: {
            Note: "",
            Colors: [],
            Suggestions: [],
          },

          /*
           * Lời cảm ơn cuối thiệp (một số mẫu dùng
           * thay cho footer.Message).
           */
          thankYouNote: "",

          /*
           * Ngày âm lịch — hiển thị cạnh ngày dương.
           */
          weddingLunar: "",

          /*
           * Tiêu đề các mục trên thiệp — người dùng đổi ở
           * panel "Tiêu đề mục". Xem src/data/sectionTitles.js.
           */
          sections: {},
        };

        this.initialized = true;

        this.dirty = false;
        this.lastSavedAt = null;

        this.resetHistory();

        return this.wedding;
      },

      setWedding(data) {
        this.wedding = data || null;
        this.initialized = !!data;

        lastSynced = {};

        this.dirty = false;
        this.lastSavedAt = null;

        this.resetHistory();
      },

      setTheme(themeName) {
        if (!this.wedding) {
          this.init(themeName);
          return;
        }

        if (!this.wedding.theme) {
          this.wedding.theme = {};
        }

        const name =
          themeName ||
          "traditional-red";

        this.wedding.theme.Name = name;

        /*
         * Đổi mẫu là đổi luôn bộ màu — nếu chỉ đổi Name,
         * thiệp romantic-pink vẫn mang màu đỏ sẫm của
         * mẫu cũ và hiển thị sai ở các theme đọc biến
         * --primary/--accent.
         */
        this.wedding.theme.Colors = {
          ...clone(THEME_PALETTES[name] || DEFAULT_PALETTE),
        };
      },

      reset(themeName = "traditional-red") {
        this.wedding = null;
        this.initialized = false;
        lastSynced = {};

        this.history = [];
        this.historyIndex = -1;

        this.init(themeName);
      },

      clear() {
        this.wedding = null;
        this.initialized = false;
        lastSynced = {};

        this.dirty = false;
        this.lastSavedAt = null;

        this.history = [];
        this.historyIndex = -1;
      },
    },
  });
