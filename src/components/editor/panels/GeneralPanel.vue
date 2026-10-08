<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING INFORMATION </span>

        <h1>{{ $t('editor.menu.general') }}</h1>

        <p>{{ $t('generalPanel.desc') }}</p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
    </div>

    <!-- =====================================================
         TIẾN ĐỘ HOÀN THIỆN
    ====================================================== -->

    <div class="progress-card">
      <div class="progress-head">
        <strong> {{ $t('generalPanel.progress') }} </strong>

        <span> {{ $t("generalPanel.progressCount", { done: completedCount, total: checklist.length }) }} </span> </div> <div class="progress-bar"> <i :style="{ width: `${progressPercent}%` }" /> </div> <ul class="progress-list"> <li v-for="item in checklist" :key="item.id || item.label" :class="{ done: item.complete }" > <v-icon size="14"> {{ item.complete ? "mdi-check-circle" : "mdi-circle-outline" }} </v-icon> <span>{{ item.label }}</span> <em v-if="item.total > 1" class="progress-count"> {{ item.done }}/{{ item.total }} </em> </li> </ul> </div> <div class="form-grid"> <div class="editor-field"> <label>{{ $t('panel.groomName') }}</label> <input v-model="wedding.groomName" type="text" placeholder="Trần Hiếu" /> <small class="field-help"> {{ $t('generalPanel.namesSync') }} </small> </div> <div class="editor-field"> <label>{{ $t('panel.brideName') }}</label> <input v-model="wedding.brideName" type="text" placeholder="Hà Uyên" /> <small class="field-help"> {{ $t('generalPanel.namesSync') }} </small> </div> <div class="editor-field full"> <label>Slug</label> <div class="slug-row"> <input v-model="wedding.slug" type="text" placeholder="ha-uyen-tran-hieu" /> <button type="button" class="slug-button" :title="$t('generalPanel.slugFromNames')" @click="generateSlug" > <v-icon size="16"> mdi-auto-fix </v-icon> {{ $t('generalPanel.fromNames') }} </button> </div> <small class="field-help"> {{ $t('generalPanel.slugHint') }} <template v-if="wedding.slug"> {{ $t('generalPanel.guestsOpenAt') }} <code>/{{ wedding.slug }}</code> </template> </small> </div> <div class="editor-field"> <label>{{ $t('generalPanel.cardLanguage') }}</label> <select v-model="wedding.language"> <option v-for="lang in LANGUAGES" :key="lang.code" :value="lang.code" > {{ lang.flag }} {{ lang.label }} </option> </select> <small class="field-help"> {{ $t('generalPanel.cardLanguageHint') }} </small> </div> <div class="editor-field"> <label>{{ $t('panel.weddingDate') }}</label> <input :value="dateInputValue" type="date" @input="onDateInput" /> <small v-if="weddingDateLabel" class="field-help"> {{ weddingDateLabel }} </small> <small v-else class="field-help"> {{ $t('generalPanel.dateHint') }} </small> </div> <div class="editor-field full"> <label>{{ $t('generalPanel.lunarDate') }}</label> <input v-model="wedding.weddingLunar" type="text" :placeholder="$t('generalPanel.lunarPlaceholder')" /> <small class="field-help"> {{ $t('generalPanel.lunarHint') }} </small> </div> </div> </section> </template> <script setup> import { useI18n } from "vue-i18n"; import { computed } from "vue"; import { LANGUAGES } from "@/lang"; import { parseWeddingDate } from "@/utils/datetime"; import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue"; const { t } = useI18n(); const props = defineProps({ wedding: { type: Object, required: true }, /* { done, total } từ Editor.vue — badge hoàn thiện mục. */ progress: { type: Object, default: null }, /* Danh sách mục nội dung + tiến độ từng mục (Editor.vue). */ checklist: { type: Array, default: null }, /* { done, total, percent } toàn thiệp (Editor.vue). */ overall: { type: Object, default: null }, }); /* * Ngày cưới chỉ chọn NGÀY (input type="date" — * "YYYY-MM-DD"). Hệ thống vẫn lưu ISO đầy đủ * "2026-11-14T08:00:00" để countdown/hero không đổi * định dạng: giờ giữ nguyên nếu đã có, chưa có thì * mặc định 08:00. */ const dateInputValue = computed(() => { const raw = props.wedding.weddingDate; if (!raw) { return ""; } return String(raw).slice(0, 10); }); function onDateInput(event) { const day = event.target.value; if (!day) { props.wedding.weddingDate = ""; return; } const existing = parseWeddingDate(props.wedding.weddingDate); const hours = existing ? String(existing.getHours()).padStart(2, "0") : "08"; const minutes = existing ? String(existing.getMinutes()).padStart(2, "0") : "00"; props.wedding.weddingDate = `${day}T${hours}:${minutes}:00`; } /* * Hiển thị lại ngày cưới bằng chữ để người dùng kiểm * tra nhanh mình chọn đúng ngày chưa. */ const weddingDateLabel = computed(() => { const date = parseWeddingDate(props.wedding.weddingDate); if (!date) { return ""; } return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", }).format(date); }); /* ===================================================== SLUG ===================================================== */ /* * Bỏ dấu tiếng Việt + ký tự đặc biệt để ra slug hợp lệ * trên URL. "Hà Uyên & Trần Hiếu" → "ha-uyen-tran-hieu". */ function slugify(value) { return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateSlug() {
  const bride = slugify(props.wedding.brideName);

  const groom = slugify(props.wedding.groomName);

  const parts = [bride, groom].filter(Boolean);

  if (!parts.length) {
    return;
  }

  props.wedding.slug = parts.join("-");
}

/* =====================================================
   CHECKLIST HOÀN THIỆN
===================================================== */

/*
 * Danh sách mục + tiến độ do Editor.vue truyền xuống
 * (props.checklist) — cùng nguồn với badge ở từng panel và
 * thanh tiến độ trên header, nên ba chỗ luôn khớp nhau.
 *
 * Nếu vì lý do nào đó không có checklist (panel dùng độc
 * lập), rơi về danh sách rút gọn tính tại chỗ.
 */
const FALLBACK_CHECKLIST = computed(() => {
  const wedding = props.wedding;

  return [
    {
      id: "general",
      get label() { return t("generalPanel.check.names"); },
      done: wedding.groomName && wedding.brideName ? 1 : 0,
      total: 1,
    },
    {
      id: "events",
      get label() { return t("editor.menu.events"); },
      done: Array.isArray(wedding.events) ? wedding.events.length : 0,
      total: Math.max(wedding.events?.length || 0, 1),
    },
    {
      id: "gallery",
      get label() { return t("editor.menu.gallery"); },
      done: Array.isArray(wedding.gallery) && wedding.gallery.length ? 1 : 0,
      total: 1,
    },
    {
      id: "story",
      get label() { return t("editor.menu.story"); },
      done: wedding.story?.Description ? 1 : 0,
      total: 1,
    },
  ];
});

const checklist = computed(() => {
  const source =
    Array.isArray(props.checklist) && props.checklist.length
      ? props.checklist
      : FALLBACK_CHECKLIST.value;

  /* Chuẩn hoá: luôn có done/total/complete để template dùng thống nhất. */
  return source.map((item) => {
    const done = item.done || 0;
    const total = item.total || 0;

    return {
      ...item,
      done,
      total,
      complete: total > 0 && done >= total,
    };
  });
});

const completedCount = computed(
  () => checklist.value.filter((item) => item.complete).length
);

const progressPercent = computed(() => {
  if (props.overall?.total) {
    return props.overall.percent || 0;
  }

  return checklist.value.length
    ? Math.round((completedCount.value / checklist.value.length) * 100)
    : 0;
});
</script>

<style scoped>
.progress-card {
  margin-bottom: 24px;

  padding: 16px 18px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 15px;

  background: #fffdfb;
}

.progress-head {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 10px;
}

.progress-head strong {
  color: #3a2c26;

  font-size: 12.5px;
}

.progress-head span {
  color: #a8988a;

  font-size: 11px;
}

.progress-bar {
  height: 6px;

  overflow: hidden;

  border-radius: 999px;

  background: #f0e8dd;
}

.progress-bar i {
  display: block;

  height: 100%;

  border-radius: 999px;

  background: linear-gradient(90deg, var(--gold, #b9975b), var(--wine, #a63a2e));

  transition: width 0.35s ease;
}

.progress-list {
  display: flex;

  flex-wrap: wrap;

  gap: 6px 16px;

  margin: 13px 0 0;
  padding: 0;

  list-style: none;
}

.progress-list li {
  display: flex;

  align-items: center;

  gap: 5px;

  color: #a8988a;

  font-size: 11px;
}

.progress-list li.done {
  color: #3a7d44;
}

/* Số phần đã điền của mục có nhiều phần tử (sự kiện, lịch trình...). */
.progress-count {
  color: #a8988a;

  font-size: 10px;
  font-style: normal;
  font-weight: 650;
}

.slug-row {
  display: flex;

  gap: 7px;

  align-items: stretch;
}

.slug-row input {
  flex: 1;

  min-width: 0;
}

.slug-button {
  flex: 0 0 auto;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  padding: 0 13px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 10px;

  background: #fffdfb;

  color: #6b5a4e;

  font-family: inherit;
  font-size: 11.5px;
  font-weight: 650;

  white-space: nowrap;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.slug-button:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}

.field-help code {
  padding: 1px 5px;

  border-radius: 5px;

  background: #f4eee6;

  color: var(--wine, #a63a2e);

  font-size: 10px;
}

@media (max-width: 520px) {
  .slug-row {
    flex-direction: column;
  }

  .slug-button {
    height: 40px;

    justify-content: center;
  }
}
</style>
