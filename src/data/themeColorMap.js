/*
 * =========================================================
 * BẢN ĐỒ MÀU CỨNG → VAI TRÒ BẢNG MÀU (sinh tự động)
 * =========================================================
 * 15 mẫu thiệp hardcode màu trong CSS. Mỗi mã màu dưới đây
 * đã được thay trong CSS bằng var(--tc-<hex>, #<hex>) (và
 * rgba(var(--tc-<hex>-rgb, r, g, b), a)); mặc định biến
 * KHÔNG được gán nên thiệp hiển thị y như thiết kế.
 *
 * Khi chủ thiệp đổi 1 màu trong editor, useThemeColorVars
 * dịch mọi sắc độ thuộc vai trò đó theo cùng độ lệch OKLCH
 * (xem utils/colorShift.js) rồi mới gán biến.
 *
 * Vai trò gán theo màu gần nhất trong THEME_PALETTES (khoảng
 * cách OKLab ≤ 0.13); trắng/đen/xám cực trị giữ nguyên.
 */
export const THEME_COLOR_MAP = {
  "botanical-leaf": {
    BackgroundSecondary: ["e6f0e7","e9f2ea","eef5ef","f0f6f1","f1ebf4","f1f7f2","f2ead8"],
    Primary: ["3d5a47","4a6653"],
    Accent: ["7fa389"],
    AccentLight: ["b5d0ba","cfe3d2","dae9dc"],
    Background: ["f4f9f5","f4faf5","f9fbf9","f9fcf9","fafcf9","fafcfa","fbfcfa","fcfdfc","fdfefd"],
    Text: ["26302a","2f3a33"],
    Secondary: ["4a7a58","57806a","66805d"],
    TextSecondary: ["4f6b58","526e5a","55705c","566f5e","58715f","5a7362","5c7354"],
  },

  "champagne-blush": {
    BackgroundSecondary: ["f4eee8","faf0e6"],
    Primary: ["6c4b4a","785428"],
    Secondary: ["a97f4c","b67f7d","c9a06a"],
    Accent: ["d9b98c","e5c4b4","ead2b6","ecd2c4"],
    Background: ["fdf4eb","fdf6ef","fff4e8","fff8ee","fffaf0","fffaf4","fffaf7","fffcf7","fffcf8","fffdfa","fffdfb","fffdfc"],
    Text: ["2d201a","402a26","453533","483228","503228","533228","5b3c28"],
    AccentLight: ["efdfcf","f2e0d4","f2ead8","f5e6d6","f6e9dd","f6ece2","f7ece2","f8ede2","faeee2"],
    TextSecondary: ["5c7354","66805d","7a6662","7b6a60","7b6c62","7b6c66","7d5f58","7e6f66","886b64","896d48","8a6f62","8f5a56","8f6a3e","926664","a34d4d"],
  },

  "chateau-blue": {
    BackgroundSecondary: ["e4e9f3","e7ecf5","ecf0f7","eef1f8","eef2f9","eff2f8","f1ebf4","f2ead8"],
    Primary: ["2f3e5c"],
    Secondary: ["5c6d8f","7d8fb0"],
    AccentLight: ["b4c0d8","ccd6e8","d7dfed"],
    Background: ["f4f7fb","f5f7fb","fafbfd","fbfcfd","fcfcfd","fcfdfe","fdfdfe"],
    Text: ["242a38","2c3242"],
    TextSecondary: ["48546e","4d5a75","505d78","535f7a","566074","586276","5a6378"],
    Accent: ["8a6a3a","8a7354"],
  },

  "jade-phoenix": {
    BackgroundSecondary: ["f2ead8","f3e3c4","f5e8cd","f8edd6"],
    Primary: ["68262c","6e1f24","6e2a30","702c32"],
    Accent: ["8a6a3a","b98a4b"],
    AccentLight: ["d9b46a","e8c98a","edd5a4"],
    Background: ["f1ebf4","f9f0dc","f9f1de","fbf4e6","fdfaf3","fdfaf4","fefbf5","fefbf6"],
    Text: ["3a1c1e","4a2328"],
    Secondary: ["8a3a40","a33d2e"],
    White: ["fefdf9"],
    TextSecondary: ["722e34","753a3e","773c40","7a3a3f"],
  },

  "lavender-cream": {
    BackgroundSecondary: ["f1eaf6","f1ebf4","f2ead8","f6f0fa"],
    Primary: ["583c6e","584a5b"],
    Secondary: ["a086b4","b9a0d0"],
    Accent: ["c3a8d4","d8c0de","dfcfe9"],
    Background: ["f7f2fb","faf6ff","faf8fc","fbf8fd","fbf9ff","fcfafd","fcfaff","fdfcfe"],
    Text: ["2d2432","3a2e3e","433846"],
    TextSecondary: ["5c7354","66805d","6f5f74","6f6874","716976","736482","736877","75677a","766384","7d6390","a34d6b"],
    AccentLight: ["e9dcf1","ece1f2","f0e7f6"],
  },

  "modern-noir": {
    BackgroundSecondary: ["ede0c4","f0e5cd","f2ead8","f4ead4","f5ecd8","f6eedb"],
    Primary: ["3a3a3a","474747"],
    Accent: ["b8a07a","c9b48c"],
    AccentLight: ["dcc9a4","e4d3b3"],
    Background: ["f1ebf4","f8f2e4","fbf8f0","fbf8f1","fcf9f2","fcfaf3","fcfaf4","fdfcf7"],
    Text: ["242424","2b2b2b"],
    TextSecondary: ["4d4d4d","4f4f4f","525252","585858","5a5a5a","5c5c5c"],
    Secondary: ["6b6b6b","8a6a3a","8a7354"],
  },

  "ruby-romance": {
    BackgroundSecondary: ["f1ebf4","f2ead8","f5d8de","f7dce2","fae4e9","fbe7eb","fce8ec"],
    Text: ["3a1c22","4a232a","5c2430","683440","6e2632"],
    Primary: ["8c2f42"],
    Accent: ["c46a7e"],
    AccentLight: ["d998a6","e8b4be","efc6ce"],
    Background: ["fcf0f3","fdf7f8","fdf7f9","fdf8f9","fef9fa","fefafb","fefcfc","fefcfd"],
    TextSecondary: ["6e3844","703a46","723c48","75424c","77434e","7a4450","8a5c54","8c4452"],
    Secondary: ["a33d4e"],
  },

  "serene-green": {
    AccentLight: ["edf4eb","f0f6ee"],
    Primary: ["1e463c","28514b"],
    Secondary: ["6c8e7a","8fae9b","8fb3a0"],
    Accent: ["c8d4c3"],
    Background: ["f2f8f0","f4faf6","f5f8f4","f8fbf6","fbfdfa"],
    Text: ["182c27","1e3a34","2e3834"],
    BackgroundSecondary: ["d8e8d5","dfe9dc","e3efe0","f2ead8"],
    TextSecondary: ["3f6f63","567262","577165","5a6e62","606c64","616e67"],
  },

  "sunset-peach": {
    BackgroundSecondary: ["fdeadd","fdeee4","fff2e8","fff4e8","fff4ea"],
    Primary: ["7a4a3d","9c4a38"],
    Secondary: ["b85c48","d67a63","e89a7e"],
    Accent: ["e0a37e","f4c6a9","f8cfb8","ffc798"],
    Background: ["fff6ec","fff6ee","fff6ef","fff8ee","fff8f0","fff8f3","fffaf5","fffcf6","fffdfa","fffdfb","fffdfc"],
    Text: ["46261c","523835","5a3024","603426"],
    AccentLight: ["f2ead8","fbdcc9","ffdbaf","ffe0be"],
    TextSecondary: ["5c7354","66805d","7b6c62","7f685b","846859","86624c","8a6353","8c6857","995746","a34d4d","af5744"],
  },

  "watercolor-blush": {
    BackgroundSecondary: ["f1ebf4","f2ead8","f9e4ea","fae8ed","fcedf1","fdeff3","fdf0f3"],
    Primary: ["8a4a5c"],
    Accent: ["d98ca0"],
    AccentLight: ["e8b4c4","f2ccd8","f5dae2"],
    Background: ["fdf4f7","fdf8fa","fef4f7","fefafb","fff8fa","fff9fb","fffafc","fffcfd"],
    Text: ["4a333c","5a3f4a"],
    Secondary: ["b04a62","b06a80"],
    TextSecondary: ["96626f","9c6a76","9d5f6d","a05a6e","a06a7c","a2667a","a5586c"],
  },

  "midnight-gold": {
    Primary: ["201a24","221a28","261d23"],
    Accent: ["a8c79a","d8b676"],
    Background: ["120e15","17121b","1d1622"],
    Secondary: ["8d7f6d","9b7d4d"],
    Text: ["f0e6d2"],
    BackgroundSecondary: ["f2ead8"],
    AccentLight: ["eed9a8"],
    TextSecondary: ["b9a88f","e08a8a"],
  },

  "double-happiness": {
    Primary: ["7a1216","8f1a1e"],
    Accent: ["c08f34","d9a441"],
    Background: ["3c0a0c","5c0e10"],
    Secondary: ["6a4e3c","6e5542","785014","8c5f19","a32a2a","a34d4d","c23a35"],
    Text: ["f2ead8","f7e6c4"],
    BackgroundSecondary: ["5a3d2e","6a1013","6b1013"],
    AccentLight: ["f3d9a4"],
    White: ["fdf6ec","fff8ea","fffaee","fffcf4","fffdf8","fffdfa"],
    TextSecondary: ["e8bd6b"],
  },

  "long-phung-v3": {
    Accent: ["ff9b4a","ffb4a4","ffbe89"],
    Secondary: ["450001","4b0606","5a0001","5a000e","5a0014","6d0009","710001"],
    Primary: ["7a0014"],
    TextSecondary: ["d4af37"],
    AccentLight: ["f2ead8"],
    White: ["fff4de"],
  },

  "dong-son": {
    Accent: ["a96b32","b28a42","b3682c","b9823f"],
    TextSecondary: ["c99552","c9a45c","d4a35f","d5a966"],
    Primary: ["54120f","641914","741c17","8b241c","8d1115","8f241c"],
    Background: ["1a0a08","24100e","350b0a","3d100f"],
    AccentLight: ["cdb99b","d9b678"],
    Text: ["eee3cd","f2ead8","f3ead8"],
    BackgroundSecondary: ["ead7b5"],
    Secondary: ["765f57","8b5829","a02b20","a3161b","ac5c27"],
    White: ["fffaee","fffaf0"],
  },

  "ivory-gold": {
    Text: ["4a3f38","4e4740","4f4039","4f4439","51483f","554b43","5a4835","5c4d46","5f4a40","604b39","683919"],
    Accent: ["a97b36","a97b37","a97c37","a97e3d","aa7e3a","aa8448","ad8240","ae8441","af833c","b08748","b18a4d","b48a47","b48c4b","b58a45","b58a48","b58a49","b58b43","b58c4d","b68a46","b68a47","b68b49","b78b4a","b88b47","b9872c","bb914d","bd9130","c19b5d","c8a66a","c9a45c","d4a84f","d4af85","d8b46d","e1c27a"],
    Background: ["faf6f0","faf7ef","fff8e4","fff8e8","fff8e9","fff9e8","fff9eb","fff9ed","fff9ef","fffaee","fffaef","fffaf0","fffaf4","fffbf2","fffbf3","fffdf4","fffdf7","fffdf8","fffdf9"],
    BackgroundSecondary: ["edf6ed","f1e4cc","f2ead8","f3eadb","f5ede1","f7ecd6","f7edd7","f8ead0","f8edd9","f8eee0","f8f1e6","faf0da","faf2e1","fbe9e7","fbf1ec"],
    Primary: ["40230f","460f0f","4d211c","541919","541b1d","580e12","5a0000","5a1414","5b1818","5c2b15","5d080e","620909","641316","64140f","641417","641e14","643018","650b11","671317","681014","681317","681414","6e0d13","703518","711519","730b12","741014","741317","751116","761418","761519","771115","771317","78070b","781115","781414","781419","791115","7b0d0d","7c1116","7c1519","7d1519","7e1216","7e181c","7f151a","801519","821419","850f17","861317","861519","8b1116","8b1418","8c1116","8c1419","8c1519","8c171b","8d1115","8d111a","8d1418","8d1519","8d171b","8e1418","8e171a","8f111b","8f1519","941519","94171c","971519","97161b","981519","98161b"],
    AccentLight: ["d6c39e","d9cbb8","ddc491","ddc79f","ded1bf","e6d5b8","e8c86e","e8d5c4","eadcc7","f0d99a","f0dfc1","f1d58e","f2d9a7","f7e6b2","fff0bd"],
    Secondary: ["98171c","99171b","9a151a","9a161a","9a171b","9b161a","9b171b","9b171c","9c1721","a0171b","a1171c","a3161b","a42a2e","a42b2e","a51b20","a52b2f","a7191e","a91b25","b3261e"],
    TextSecondary: ["36743a","685b4f","6b5146","6d5741","6d5b49","705744","705947","72534a","725c43","75604e","75685c","765c48","76604c","76655c","77624d","78614b","7a6c5b","7b6f66","7c6e55","7d5a1e","80623e","80684f","81694f","836b3c","836b52","836c61","836f57","856f52","866839","866c48","866c53","876834","886834","89651f","896836","896939","8a6735","8a6833","8a6836","8a6947","8a6f40","8a7159","8b661f","8b6834","8b6935","8c6834","8d6935","8d6a35","8d6c43","8e6418","8e6933","8e6934","8e6935","8e6a36","8e6e35","8f6930","90672a","906c33","906c3a","906d38","91682b","92683a","927657","977035","996e2c","9a6f30","9b7037","9d7439","9d743a","a37a3d","a47534","a57a3b","a67b3d"],
  },
};
