import { defineStore } from "pinia";

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
 * =====================================================
 * BẢNG MÀU MẶC ĐỊNH THEO TỪNG MẪU THIỆP
 * =====================================================
 * Trước đây init() luôn gán bảng màu traditional-red
 * cho MỌI mẫu — mở editor từ mẫu romantic-pink thì
 * thiệp vẫn mang màu đỏ sẫm, các theme đọc biến
 * --primary/--accent (RomanticPink, ModernWhite,
 * SongHyRed...) hiển thị sai hoàn toàn.
 *
 * Mỗi mẫu giờ có bộ màu riêng, khớp với bản demo
 * (src/mock/wedding.json) và với màu gốc của theme.
 * Theme hardcode màu trong CSS (DongSon, IvoryGold...)
 * không đọc các biến này nhưng vẫn giữ cho dữ liệu
 * nhất quán khi lưu lên API.
 */
/*
 * Xuất ra để ThemePanel dùng làm "bảng màu có sẵn" —
 * preset trong editor phải khớp màu thật của mẫu thiệp,
 * không phải màu nhận diện trên thẻ gallery.
 */
export const THEME_PALETTES = {
  "traditional-red": {
    Primary: "#7b0d0d",
    Secondary: "#9d2525",
    Accent: "#c79d5c",
    AccentLight: "#f7d8a3",
    Background: "#f8f5ed",
    BackgroundSecondary: "#eee8dc",
    Text: "#5c4d46",
    TextSecondary: "#806f66",
    White: "#fffaf4",
  },

  "romantic-pink": {
    Primary: "#cb5d6c",
    Secondary: "#933845",
    Accent: "#cb5d6c",
    AccentLight: "#f6dfe2",
    Background: "#fdf3f4",
    BackgroundSecondary: "#f6dfe2",
    Text: "#933845",
    TextSecondary: "#cb5d6c",
    White: "#ffffff",
  },

  "elegant-gold": {
    Primary: "#d70c1b",
    Secondary: "#a30a15",
    Accent: "#d70c1b",
    AccentLight: "#fdecee",
    Background: "#ffffff",
    BackgroundSecondary: "#fdecee",
    Text: "#000000",
    TextSecondary: "#4a4a4a",
    White: "#ffffff",
  },

  "modern-white": {
    Primary: "#486c7d",
    Secondary: "#3a5666",
    Accent: "#a4c4d4",
    AccentLight: "#e8f0f4",
    Background: "#ffffff",
    BackgroundSecondary: "#e8f0f4",
    Text: "#3a5666",
    TextSecondary: "#6b8494",
    White: "#ffffff",
  },

  "nhat-binh-do": {
    Primary: "#9c1f2c",
    Secondary: "#560207",
    Accent: "#9c1f2c",
    AccentLight: "#f6ecd9",
    Background: "#fbf8f3",
    BackgroundSecondary: "#f6ecd9",
    Text: "#560207",
    TextSecondary: "#9c1f2c",
    White: "#ffffff",
  },

  "royal-red": {
    Primary: "#5c080c",
    Secondary: "#8c171b",
    Accent: "#d0a85c",
    AccentLight: "#f4dca5",
    Background: "#f4eee2",
    BackgroundSecondary: "#e7decd",
    Text: "#49352d",
    TextSecondary: "#79645a",
    White: "#fff9ed",
  },

  "dong-son": {
    Primary: "#762d1f",
    Secondary: "#984a32",
    Accent: "#b9824b",
    AccentLight: "#e3c18d",
    Background: "#24100e",
    BackgroundSecondary: "#e5d8c4",
    Text: "#f3ead8",
    TextSecondary: "#806b5c",
    White: "#fffaf1",
  },

  "ivory-gold": {
    Primary: "#6f2528",
    Secondary: "#91484a",
    Accent: "#c9a66b",
    AccentLight: "#f0ddb5",
    Background: "#fffdf8",
    BackgroundSecondary: "#f0ebe0",
    Text: "#51433c",
    TextSecondary: "#82746b",
    White: "#fffdf8",
  },

  "serene-green": {
    Primary: "#28514b",
    Secondary: "#6c8e7a",
    Accent: "#c8d4c3",
    AccentLight: "#edf4eb",
    Background: "#f5f8f4",
    BackgroundSecondary: "#e8efe6",
    Text: "#2e3834",
    TextSecondary: "#6d7c73",
    White: "#ffffff",
  },

  "sunset-peach": {
    Primary: "#7a4a3d",
    Secondary: "#d67a63",
    Accent: "#f4c6a9",
    AccentLight: "#fbe5d5",
    Background: "#fffaf5",
    BackgroundSecondary: "#fdeee4",
    Text: "#523835",
    TextSecondary: "#8a665e",
    White: "#ffffff",
  },

  "champagne-blush": {
    Primary: "#6c4b4a",
    Secondary: "#b67f7d",
    Accent: "#ead2b6",
    AccentLight: "#f7ebdf",
    Background: "#fffaf7",
    BackgroundSecondary: "#f4eee8",
    Text: "#453533",
    TextSecondary: "#806b67",
    White: "#ffffff",
  },

  "midnight-gold": {
    Primary: "#261d23",
    Secondary: "#9b7d4d",
    Accent: "#d8b676",
    AccentLight: "#f1e0b8",
    Background: "#17121b",
    BackgroundSecondary: "#f1ebe0",
    Text: "#f0e6d2",
    TextSecondary: "#726360",
    White: "#ffffff",
  },

  "lavender-cream": {
    Primary: "#584a5b",
    Secondary: "#a086b4",
    Accent: "#d8c0de",
    AccentLight: "#f2e7f6",
    Background: "#faf8fc",
    BackgroundSecondary: "#f1ebf4",
    Text: "#433846",
    TextSecondary: "#7e6d82",
    White: "#ffffff",
  },

  "double-happiness": {
    Primary: "#7a1216",
    Secondary: "#a32a2a",
    Accent: "#d9a441",
    AccentLight: "#f3d9a4",
    Background: "#5c0e10",
    BackgroundSecondary: "#6b1013",
    Text: "#f7e6c4",
    TextSecondary: "#d9b98a",
    White: "#fdf6ec",
  },

  "boho-terracotta": {
    Primary: "#511419",
    Secondary: "#7a1f24",
    Accent: "#ffdfaf",
    AccentLight: "#ffe9c9",
    Background: "#2b0303",
    BackgroundSecondary: "#3a0607",
    Text: "#ffefd6",
    TextSecondary: "#e8cfa8",
    White: "#fff6e6",
  },

  "song-hy-red": {
    Primary: "#800000",
    Secondary: "#a52a2a",
    Accent: "#fbbf24",
    AccentLight: "#ffeed2",
    Background: "#fff7eb",
    BackgroundSecondary: "#f7ead9",
    Text: "#666666",
    TextSecondary: "#800000",
    White: "#ffffff",
  },

  "to-duyen-xanh": {
    Primary: "#5e813c",
    Secondary: "#1a3500",
    Accent: "#d1db9c",
    AccentLight: "#f3dfc5",
    Background: "#fefbf4",
    BackgroundSecondary: "#f7f3e6",
    Text: "#1a3500",
    TextSecondary: "#5e813c",
    White: "#ffffff",
  },

  "emerald-luxe": {
    Primary: "#4c2d1f",
    Secondary: "#e1c490",
    Accent: "#e1c490",
    AccentLight: "#f3ddb8",
    Background: "#fef0e0",
    BackgroundSecondary: "#f7e6cd",
    Text: "#4c2d1f",
    TextSecondary: "#624537",
    White: "#fffaf2",
  },

  "long-phung-v3": {
    Primary: "#7a0014",
    Secondary: "#710001",
    Accent: "#ffbe89",
    AccentLight: "#f3dfc5",
    Background: "#7a0014",
    BackgroundSecondary: "#710001",
    Text: "#ffbe89",
    TextSecondary: "#d4af37",
    White: "#fff4de",
  },
};

const DEFAULT_PALETTE = THEME_PALETTES["traditional-red"];

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

        this.wedding = {
          Id: null,
          slug: "",

          groomName: "",
          brideName: "",
          language: "vi",
          weddingDate: "",

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
              Name: "",
              Nickname: "",
              Role: "Cô dâu",
              Avatar: "",
              Cover: "",
              Father: "",
              Mother: "",
              Address: "",
              Description: "",
            },

            Groom: {
              Name: "",
              Nickname: "",
              Role: "Chú rể",
              Avatar: "",
              Cover: "",
              Father: "",
              Mother: "",
              Address: "",
              Description: "",
            },
          },

          hero: {
            GroomName: "",
            BrideName: "",
            Title: "",
            WeddingDate: "",
            Subtitle: "",
            Background: "",
            Music: "",
            Location: "",
          },

          story: {
            Title: "",
            Description: "",
          },

          events: [],
          timeline: [],
          gallery: [],
          recipientName: [],
          gifts: [],

          guestBook: {
            Enabled: true,
            Title: "",
            Guest: [],
          },

          countdown: {
            Enabled: true,
            Target: "",
          },

          footer: {
            Message: "",
            Copyright: "",
            GroomName: "",
            BrideName: "",
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
          },

          music: {
            Enabled: true,
            Url: "",
            Title: "",
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
