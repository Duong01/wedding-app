import { defineStore } from "pinia";

export const useWeddingEditorStore =
  defineStore("weddingEditor", {

    state: () => ({
      wedding: null,
      initialized: false,
    }),

    actions: {

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
            Enabled: false,
            Url: "",
            Title: "",
            Autoplay: false,
          },
        };

        this.initialized = true;

        return this.wedding;
      },

      setWedding(data) {
        this.wedding = data || null;
        this.initialized = !!data;
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

        this.init(themeName);
      },

      clear() {
        this.wedding = null;
        this.initialized = false;
      },
    },
  });