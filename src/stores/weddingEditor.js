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

            Colors: {
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

        this.wedding.theme.Name =
          themeName ||
          "traditional-red";
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
