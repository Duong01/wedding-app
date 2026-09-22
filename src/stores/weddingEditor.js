import { defineStore } from "pinia";

/*
 * Bản ghi giá trị đồng bộ gần nhất cho các trường
 * dùng chung (GroomName/BrideName/WeddingDate ở
 * Hero/Footer). Không cần reactive — chỉ dùng để
 * phân biệt "đang trùng giá trị đã sync" với
 * "người dùng chủ động sửa khác đi".
 */
let lastSynced = {};

export const useWeddingEditorStore =
  defineStore("weddingEditor", {

    state: () => ({
      wedding: null,
      initialized: false,
    }),

    actions: {

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
           * Tiêu đề các mục trên thiệp — người dùng đổi ở
           * panel "Tiêu đề mục". Xem src/data/sectionTitles.js.
           */
          sections: {},
        };

        this.initialized = true;

        return this.wedding;
      },

      setWedding(data) {
        this.wedding = data || null;
        this.initialized = !!data;

        lastSynced = {};
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

        this.init(themeName);
      },

      clear() {
        this.wedding = null;
        this.initialized = false;
        lastSynced = {};
      },
    },
  });