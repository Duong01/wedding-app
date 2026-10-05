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

  if (!wedding.video || typeof wedding.video !== "object") {
    wedding.video = { Enabled: true, Url: "", Title: "" };
  }

  if (!wedding.game || typeof wedding.game !== "object") {
    wedding.game = { Enabled: true, GameType: "lucky-wheel", Title: "" };
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
