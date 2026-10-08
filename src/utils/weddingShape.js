/*
 * Back-fill các field mới cho thiệp cũ (load từ API hoặc
 * mock chưa có field) — panel editor v-model không crash,
 * preview không undefined.
 *
 * Gọi trong Editor.vue initializeEditor() finally, cạnh
 * ensureSections (cùng mục đích: tương thích dữ liệu cũ).
 */

export function ensureNewSections(wedding) {
  if (!wedding) {
    return wedding;
  }

  /*
   * Ngôn ngữ thiệp (khách mời xem) — thiệp cũ chưa có
   * thì mặc định tiếng Việt, hiển thị như trước.
   */
  if (typeof wedding.language !== "string" || !wedding.language) {
    wedding.language = "vi";
  }

  /*
   * Thiệp bị lưu dở (backend cũ commit từng phần) → API trả
   * couple/hero/settings null hoặc thiếu Bride/Groom. Back-fill
   * object rỗng để panel editor v-model không crash và lần save
   * sau ghi lại đầy đủ.
   */
  if (!wedding.couple || typeof wedding.couple !== "object") {
    wedding.couple = { Bride: {}, Groom: {} };
  }

  ["Bride", "Groom"].forEach((role) => {
    if (!wedding.couple[role] || typeof wedding.couple[role] !== "object") {
      wedding.couple[role] = {};
    }
  });

  if (!wedding.hero || typeof wedding.hero !== "object") {
    wedding.hero = {};
  }

  if (!wedding.story || typeof wedding.story !== "object") {
    wedding.story = { Title: "", Description: "", Mode: "text" };
  }

  if (!wedding.guestBook || typeof wedding.guestBook !== "object") {
    wedding.guestBook = { Enabled: true, Title: "", Guest: [] };
  }

  if (!wedding.countdown || typeof wedding.countdown !== "object") {
    wedding.countdown = { Enabled: true, Target: "" };
  }

  if (!wedding.footer || typeof wedding.footer !== "object") {
    wedding.footer = { Message: "", Copyright: "", GroomName: "", BrideName: "" };
  }

  if (!wedding.music || typeof wedding.music !== "object") {
    wedding.music = { Enabled: true, Url: "", Title: "", Autoplay: true };
  }

  if (!wedding.dressCode || typeof wedding.dressCode !== "object") {
    wedding.dressCode = { Note: "", Colors: [], Suggestions: [] };
  }

  if (!wedding.video || typeof wedding.video !== "object") {
    wedding.video = { Enabled: true, Url: "", Title: "" };
  }

  if (!wedding.game || typeof wedding.game !== "object") {
    wedding.game = { Enabled: true, GameType: "lucky-wheel", Title: "" };
  }

  if (!Array.isArray(wedding.events)) {
    wedding.events = [];
  }

  if (!Array.isArray(wedding.timeline)) {
    wedding.timeline = [];
  }

  if (!Array.isArray(wedding.gallery)) {
    wedding.gallery = [];
  }

  if (!Array.isArray(wedding.gifts)) {
    wedding.gifts = [];
  }

  if (!Array.isArray(wedding.recipientName)) {
    wedding.recipientName = [];
  }

  if (!Array.isArray(wedding.storyMilestones)) {
    wedding.storyMilestones = [];
  }

  /*
   * Cấu hình trò chơi — quà / câu hỏi / ảnh (thiếu = game
   * rơi về chế độ vui + vòng quay, không crash).
   */
  if (!Array.isArray(wedding.gamePrizes)) {
    wedding.gamePrizes = [];
  }

  if (!Array.isArray(wedding.gameQuestions)) {
    wedding.gameQuestions = [];
  }

  if (!Array.isArray(wedding.gameImages)) {
    wedding.gameImages = [];
  }

  if (wedding.story && typeof wedding.story === "object") {
    if (!wedding.story.Mode) {
      wedding.story.Mode = "text";
    }
  }

  const settings =
    wedding.settings && typeof wedding.settings === "object"
      ? wedding.settings
      : (wedding.settings = {});

  /*
   * Cờ mới mặc định TẮT — thiệp cũ mở editor không tự
   * bật video/game. ShowSeasonFx mặc định bật (giá trị
   * frontend đã dùng từ trước).
   */
  if (typeof settings.ShowVideo !== "boolean") {
    settings.ShowVideo = false;
  }

  if (typeof settings.ShowGame !== "boolean") {
    settings.ShowGame = false;
  }

  if (typeof settings.ShowSeasonFx !== "boolean") {
    settings.ShowSeasonFx = true;
  }

  /* Tự cuộn thiệp khi khách không thao tác — mặc định bật */
  if (typeof settings.AutoScroll !== "boolean") {
    settings.AutoScroll = true;
  }

  /*
   * Kiểu album (data/galleryLayouts.js) — thiệp cũ chưa có
   * thì "default" = kiểu gốc của mẫu, hiển thị như trước.
   */
  if (typeof settings.GalleryLayout !== "string" || !settings.GalleryLayout) {
    settings.GalleryLayout = "default";
  }

  return wedding;
}
