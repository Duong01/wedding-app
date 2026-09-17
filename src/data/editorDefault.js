/*
 * Giờ hiện tại theo định dạng lưu trữ của hệ thống:
 * "2026-11-14T08:00:00" (ISO — dấu "T").
 */
function nowIsoFormat() {
  const now = new Date();

  const pad = (number) => String(number).padStart(2, "0");

  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:00`
  );
}

export function createDefaultWedding(themeName = "traditional-red") {
  return {
    Id: null,
    slug: "",
    groomName: "Chú rể",
    brideName: "Cô dâu",
    language: "vi",
    weddingDate: nowIsoFormat(),
    coverImage: "",
    theme: {
      Name: themeName,
      Colors: {
        Primary: "#7b0d0d",
        Secondary: "#9d2525",
        Accent: "#c79d5c",
        AccentLight: "#f7d8a3",
        Background: "#fffdfb",
        BackgroundSecondary: "#f7f3ee",
        Text: "#5c4d46",
        TextSecondary: "#806f66",
        White: "#ffffff",
      },
      Fonts: {
        Main: "Cormorant Garamond",
        Heading: "Cormorant Garamond",
        Script: "Allura",
      },
      Layout: {
        MaxWidth: "930px",
        SectionPadding: "80px",
      },
    },
    couple: {
      Bride: {
        Name: "Cô dâu",
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
        Name: "Chú rể",
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
      GroomName: "Chú rể",
      BrideName: "Cô dâu",
      Title: "Save The Date",
      WeddingDate: nowIsoFormat(),
      Subtitle: "Trân trọng kính mời",
      Background: "",
      Music: "",
      Location: "",
    },
    story: {
      Title: "Chuyện Tình Yêu",
      Description: "",
    },
    events: [],
    gallery: [],
    timeline: [],
    recipientName: [],
    gifts: [],
    guestBook: {
      Enabled: true,
      Title: "Sổ Lưu Bút",
      Guest: [],
    },
    countdown: {
      Enabled: true,
      Target: nowIsoFormat(),
    },
    footer: {
      Message: "",
      Copyright: "",
      GroomName: "Chú rể",
      BrideName: "Cô dâu",
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
}
