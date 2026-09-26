<template>
  <main class="manage-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <!-- =====================================================
         HERO — gọn, căn giữa (kiểu dashboard)
    ====================================================== -->
    <section class="page-hero manage-hero">
      <div class="container hero-inner">
        <h1>Thiệp của tôi</h1>

        <p>Quản lý và theo dõi các thiệp của bạn</p>

        <div class="hero-actions">
          <button type="button" class="primary-btn" @click="goCreate">
            <span>＋</span>
            Tạo thiệp mới
          </button>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CONTENT
    ====================================================== -->
    <section class="container manage-content">
      <!-- BANNER: CHƯA ĐĂNG NHẬP — nháp chỉ nằm trên máy này -->
      <div v-if="isGuest" class="guest-banner">
        <v-icon size="22"> mdi-information-outline </v-icon>

        <div class="guest-banner-text">
          <strong>Đăng nhập để bảo vệ thiệp của bạn</strong>

          <p>
            Thiệp hiện chỉ lưu trên thiết bị này. Đăng nhập để truy cập từ mọi
            nơi và tránh mất dữ liệu.
          </p>
        </div>

        <button type="button" class="primary-btn" @click="goLogin">
          Đăng nhập ngay
        </button>
      </div>

      <!-- TAB LỌC: Tất cả / Xuất bản / Nháp -->
      <div v-if="!loading && !loadError" class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.key"
          type="button"
          class="filter-tab"
          :class="{ active: activeFilter === tab.key }"
          @click="activeFilter = tab.key"
        >
          {{ tab.label }} ({{ tab.count }})
        </button>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="manage-grid">
        <article v-for="i in 4" :key="i" class="manage-card">
          <div class="skeleton-body">
            <div class="skeleton-line small"></div>
            <div class="skeleton-line tiny"></div>
            <div class="skeleton-line"></div>
          </div>

          <div class="card-bar">
            <div class="skeleton-line tiny bar-skeleton"></div>
          </div>
        </article>
      </div>

      <!-- ERROR -->
      <div v-else-if="loadError" class="state-box">
        <div class="empty-icon">⚠</div>

        <h3>Không tải được danh sách</h3>

        <p>{{ loadError }}</p>

        <button type="button" class="retry-btn" @click="retryLoad">
          Thử lại
        </button>
      </div>

      <!-- EMPTY -->
      <div v-else-if="filteredEntries.length === 0" class="state-box empty">
        <div class="empty-icon">♡</div>

        <h3>Chưa có thiệp nào ở mục này</h3>

        <p>
          Hãy tạo thiệp mới hoặc chỉnh sửa một mẫu có sẵn, sau đó bấm "Lưu
          thiệp" để thiệp xuất hiện tại đây.
        </p>

        <button type="button" class="retry-btn" @click="goCreate">
          Tạo thiệp ngay
        </button>
      </div>

      <!-- GRID — thẻ compact kiểu dashboard -->
      <div v-else class="manage-grid">
        <article
          v-for="entry in filteredEntries"
          :key="entry.isLocalDraft ? 'local-draft' : entry.slug"
          class="manage-card"
        >
          <!-- BODY -->
          <div class="card-body">
            <div class="card-head">
              <h3>{{ getCoupleName(entry) }}</h3>

              <span class="card-open-hint">
                Chỉnh sửa thiệp
                <v-icon size="14"> mdi-chevron-right </v-icon>
              </span>
            </div>

            <div class="card-chips">
              <span
                class="status-chip"
                :class="statusChipClass(entry)"
              >
                {{ statusChipLabel(entry) }}
              </span>

              <span v-if="entry.theme" class="card-theme">
                {{ entry.theme }}
              </span>
            </div>

            <div class="card-meta">
              <span v-if="formatDate(entry.weddingDate)">
                {{ formatDate(entry.weddingDate) }}
              </span>

              <span v-if="entry.slug">/{{ entry.slug }}</span>

              <span v-if="entry.isLocalDraft">
                Lưu trên máy — tạo {{ formatDate(entry.createdAt) }}
              </span>

              <span v-else-if="formatDate(entry.createdAt)">
                Ngày tạo: {{ formatDate(entry.createdAt) }}
              </span>
            </div>
          </div>

          <!-- ACTION BAR — tách đáy thẻ -->
          <div class="card-bar">
            <!-- Thẻ bản nháp (chưa đăng nhập) -->
            <template v-if="entry.isLocalDraft">
              <button
                type="button"
                class="bar-btn primary"
                @click="editDraft"
              >
                <v-icon size="16"> mdi-pencil-outline </v-icon>

                Chỉnh sửa
              </button>

              <button
                type="button"
                class="bar-btn danger"
                @click="deleteDraft"
              >
                <v-icon size="16"> mdi-delete-outline </v-icon>

                Xóa
              </button>
            </template>

            <!-- Thẻ thiệp đã lưu trên server -->
            <template v-else>
              <button
                type="button"
                class="bar-btn primary"
                @click="editWedding(entry)"
              >
                <v-icon size="16"> mdi-pencil-outline </v-icon>

                Sửa
              </button>

              <button
                type="button"
                class="bar-btn"
                @click="viewWedding(entry)"
              >
                <v-icon size="16"> mdi-eye-outline </v-icon>

                Xem
              </button>

              <button
                v-if="canPublish(entry)"
                type="button"
                class="bar-btn publish"
                :disabled="publishing === entry.slug"
                @click="publishEntry(entry)"
              >
                <v-progress-circular
                  v-if="publishing === entry.slug"
                  indeterminate
                  size="14"
                  width="2"
                />

                <v-icon v-else size="16"> mdi-rocket-launch-outline </v-icon>

                Xuất bản
              </button>

              <button
                type="button"
                class="bar-btn"
                @click="openGuests(entry)"
              >
                <v-icon size="16"> mdi-account-multiple-outline </v-icon>

                Khách mời
              </button>

              <button
                type="button"
                class="bar-btn"
                @click="copyLink(entry)"
              >
                <v-icon size="16"> mdi-link-variant </v-icon>

                {{ canPublish(entry) ? "Link (chưa mở)" : "Link" }}
              </button>

              <button
                type="button"
                class="bar-btn"
                @click="goPayment(entry)"
              >
                <v-icon size="16"> mdi-credit-card-outline </v-icon>

                Thanh toán
              </button>

              <button
                type="button"
                class="bar-btn danger"
                :disabled="deleting === entry.slug"
                @click="confirmDelete(entry)"
              >
                <v-progress-circular
                  v-if="deleting === entry.slug"
                  indeterminate
                  size="13"
                  width="2"
                />

                <v-icon v-else size="16"> mdi-delete-outline </v-icon>

                Xóa
              </button>
            </template>
          </div>
        </article>
      </div>
    </section>

    <!-- =====================================================
         DELETE CONFIRM
    ====================================================== -->
    <Teleport to="body">
      <Transition name="detail-modal">
        <div
          v-if="deleteTarget"
          class="detail-modal"
          @click.self="deleteTarget = null"
        >
          <div class="confirm-panel">
            <div class="confirm-icon danger">
              <v-icon size="26"> mdi-alert-outline </v-icon>
            </div>

            <h3>Xóa thiệp này?</h3>

            <p>
              Thiệp
              <strong>{{ getCoupleName(deleteTarget) }}</strong>
              ({{ deleteTarget.slug }}) sẽ bị ẩn khỏi danh sách quản lý.
              Backend chưa có API xóa thiệp nên dữ liệu trên server vẫn còn.
            </p>

            <div class="confirm-actions">
              <button
                type="button"
                class="action-btn"
                @click="deleteTarget = null"
              >
                Hủy
              </button>

              <button
                type="button"
                class="action-btn danger"
                :disabled="deleting === deleteTarget.slug"
                @click="doDelete"
              >
                <v-progress-circular
                  v-if="deleting === deleteTarget.slug"
                  indeterminate
                  size="13"
                  width="2"
                />

                Xóa thiệp
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         GUESTS MODAL
    ====================================================== -->
    <Teleport to="body">
      <Transition name="detail-modal">
        <div
          v-if="guestsTarget"
          class="detail-modal"
          @click.self="closeGuests"
        >
          <div class="guests-panel">
            <div class="guests-head">
              <div>
                <span class="guests-eyebrow"> QUẢN LÝ KHÁCH MỜI </span>

                <h3>{{ getCoupleName(guestsTarget) }}</h3>

                <p class="guests-slug">/{{ guestsTarget.slug }}</p>
              </div>

              <button
                type="button"
                class="guests-close"
                @click="closeGuests"
              >
                <v-icon size="20"> mdi-close </v-icon>
              </button>
            </div>

            <p v-if="guestsMessage" class="guests-message" :class="{ error: guestsError }">
              {{ guestsMessage }}
            </p>

            <!-- ADD FORM -->
            <div class="guest-add-row">
              <input
                v-model.trim="newGuestName"
                type="text"
                placeholder="Tên khách mời (VD: Chú Minh + Cô Hằng)"
                maxlength="100"
                @keyup.enter="addGuest"
              />

              <button
                type="button"
                class="action-btn primary"
                :disabled="guestsBusy || !newGuestName"
                @click="addGuest"
              >
                <v-progress-circular
                  v-if="guestsBusy"
                  indeterminate
                  size="13"
                  width="2"
                />

                <v-icon v-else size="16"> mdi-account-plus-outline </v-icon>

                Thêm
              </button>
            </div>

            <!-- LIST -->
            <div v-if="guestsLoading" class="guests-loading">
              <v-progress-circular indeterminate size="26" width="2" />

              <span> Đang tải danh sách khách... </span>
            </div>

            <div v-else-if="guests.length === 0" class="guests-empty">
              Chưa có khách mời nào. Thêm khách để nhận link thiệp cá nhân.
            </div>

            <div v-else class="guests-list">
              <div
                v-for="guest in guests"
                :key="guest.Token"
                class="guest-row"
              >
                <template v-if="editingToken === guest.Token">
                  <input
                    v-model.trim="editingName"
                    type="text"
                    class="guest-edit-input"
                    maxlength="100"
                    @keyup.enter="saveGuestEdit(guest)"
                  />

                  <button
                    type="button"
                    class="action-btn primary"
                    :disabled="guestsBusy"
                    @click="saveGuestEdit(guest)"
                  >
                    Lưu
                  </button>

                  <button
                    type="button"
                    class="action-btn"
                    @click="cancelGuestEdit"
                  >
                    Hủy
                  </button>
                </template>

                <template v-else>
                  <div class="guest-info">
                    <strong>{{ guest.Name || "Chưa có tên" }}</strong>

                    <code>{{ guest.Token }}</code>
                  </div>

                  <div class="guest-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      title="Sao chép link cá nhân"
                      @click="copyGuestLink(guest)"
                    >
                      <v-icon size="16"> mdi-link-variant </v-icon>
                    </button>

                    <button
                      type="button"
                      class="icon-btn"
                      title="Sửa tên"
                      @click="startGuestEdit(guest)"
                    >
                      <v-icon size="16"> mdi-pencil-outline </v-icon>
                    </button>

                    <button
                      type="button"
                      class="icon-btn danger"
                      title="Xóa khách"
                      :disabled="guestsBusy"
                      @click="removeGuest(guest)"
                    >
                      <v-icon size="16"> mdi-delete-outline </v-icon>
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <p class="guests-hint">
              Mỗi khách có 1 link riêng dạng
              <code>/{{ guestsTarget.slug }}/{token}</code>. Khi khách mở link,
              thiệp sẽ hiện đúng tên của họ — bấm biểu tượng link để sao chép.
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div v-if="toast" class="manage-toast">
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  addRecipient as addRecipientApi,
  deleteRecipient as deleteRecipientApi,
  getRecipients as getRecipientsApi,
  updateRecipient as updateRecipientApi,
  getMyWeddings,
  publishWedding as publishWeddingApi,
} from "@/model/api";

import { PUBLISH_STATE } from "@/model/weddingAdmin";

import { useAuthStore } from "@/stores/auth";
import { useWeddingEditorStore } from "@/stores/weddingEditor";

const router = useRouter();

const route = useRoute();

const auth = useAuthStore();

const editorStore = useWeddingEditorStore();

/* =========================================================
   STATE
========================================================= */

const entries = ref([]);
const loading = ref(false);
const loadError = ref("");
const deleting = ref("");
const deleteTarget = ref(null);
const toast = ref("");

/* Slug của thiệp đang gọi API xuất bản ("" = không có). */
const publishing = ref("");

/* =========================================================
   CHƯA ĐĂNG NHẬP — bản nháp trên máy (localStorage)
   Thẻ hiển thị dạng "Bản nháp": chỉ sửa / xóa nháp,
   mọi tính năng server (xuất bản, khách mời...) ẩn đi.
========================================================= */

const localDraft = ref(null);

const isGuest = computed(() => !auth.isLoggedIn);

function loadLocalDraft() {
  localDraft.value = editorStore.readDraft();
}

/* Đưa bản nháp về đúng dạng thẻ trong grid (giống entry API). */
const draftEntry = computed(() => {
  if (!localDraft.value?.wedding) {
    return null;
  }

  const wedding = localDraft.value.wedding;

  return {
    slug: wedding.slug || "",
    groomName: wedding.groomName || "",
    brideName: wedding.brideName || "",
    weddingDate: wedding.weddingDate || "",
    theme: wedding.theme?.Name || "",
    coverImage: wedding.coverImage || "",
    status: "",
    createdAt: localDraft.value.savedAt || "",
    publishState: "draft-local",
    publishedAt: "",
    trialEndsAt: "",
    paidAt: "",
    daysLeft: 0,
    isLocalDraft: true,
  };
});

/* Danh sách hiển thị: API khi đã đăng nhập, nháp khi chưa. */
const visibleEntries = computed(() => {
  return isGuest.value
    ? draftEntry.value
      ? [draftEntry.value]
      : []
    : entries.value;
});

/* =========================================================
   TAB LỌC — Tất cả / Xuất bản / Nháp
   "Xuất bản" = đã publish (dùng thử / hết hạn / đã kích
   hoạt / khóa). "Nháp" = chưa xuất bản (draft server hoặc
   bản nháp trên máy khi chưa đăng nhập).
========================================================= */

const activeFilter = ref("all");

function isPublishedEntry(entry) {
  if (entry?.isLocalDraft) {
    return false;
  }

  return entry?.publishState !== PUBLISH_STATE.DRAFT;
}

const filterTabs = computed(() => {
  const all = visibleEntries.value;

  const published = all.filter(isPublishedEntry);

  return [
    { key: "all", label: "Tất cả", count: all.length },
    { key: "published", label: "Xuất bản", count: published.length },
    { key: "draft", label: "Nháp", count: all.length - published.length },
  ];
});

const filteredEntries = computed(() => {
  if (activeFilter.value === "published") {
    return visibleEntries.value.filter(isPublishedEntry);
  }

  if (activeFilter.value === "draft") {
    return visibleEntries.value.filter((entry) => !isPublishedEntry(entry));
  }

  return visibleEntries.value;
});

function editDraft() {
  router.push({ name: "Editor" });
}

async function deleteDraft() {
  editorStore.clearDraft();

  localDraft.value = null;

  showToast("Đã xóa bản nháp trên máy này");
}

function goLogin() {
  router.push({
    name: "Login",
    query: { redirect: route.fullPath },
  });
}

/* =========================================================
   GUESTS
========================================================= */

const guestsTarget = ref(null);
const guests = ref([]);
const guestsLoading = ref(false);
const guestsBusy = ref(false);
const guestsMessage = ref("");
const guestsError = ref(false);

const newGuestName = ref("");

const editingToken = ref("");
const editingName = ref("");

/* =========================================================
   LOAD — danh sách thiệp CỦA TÀI KHOẢN từ API
========================================================= */

async function loadEntries() {
  /* Chưa đăng nhập → chỉ có bản nháp trên máy, không gọi API. */
  if (!auth.isLoggedIn) {
    loadLocalDraft();

    return;
  }

  loading.value = true;

  loadError.value = "";

  try {
    const response = await getMyWeddings();

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      entries.value = result.data.map((item) => ({
        slug: item.Slug || item.slug,

        groomName: item.GroomName || item.groomName || "",

        brideName: item.BrideName || item.brideName || "",

        weddingDate: item.WeddingDate || item.weddingDate || "",

        theme: item.ThemeName || item.themeName || item.theme || "",

        coverImage: item.CoverImage || item.coverImage || "",

        status: item.Status || item.status || "",

        createdAt: item.CreatedAt || item.createdAt || "",

        /* Trạng thái xuất bản / dùng thử — server suy ra trong SQL. */
        publishState: item.PublishState || item.publishState || "",

        publishedAt: item.PublishedAt || item.publishedAt || "",

        trialEndsAt: item.TrialEndsAt || item.trialEndsAt || "",

        paidAt: item.PaidAt || item.paidAt || "",

        daysLeft: item.DaysLeft ?? item.daysLeft ?? 0,
      }));
    } else {
      loadError.value =
        result?.message || "Không thể tải danh sách thiệp.";
    }
  } catch (error) {
    console.error("[Manage] getMyWeddings error:", error);

    loadError.value =
      error?.response?.data?.message ||
      "Không thể tải danh sách thiệp. Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadEntries();
});

/*
 * Đăng nhập / đăng xuất ngay trên trang này (qua header)
 * → đổi nguồn dữ liệu: nháp máy ↔ danh sách API.
 */
watch(
  () => auth.isLoggedIn,
  () => {
    entries.value = [];

    loadEntries();
  }
);

/* =========================================================
   RETRY
========================================================= */

function retryLoad() {
  loadEntries();
}

/* =========================================================
   HELPERS
========================================================= */

function getCoupleName(entry) {
  const bride = entry?.brideName || "";
  const groom = entry?.groomName || "";

  if (!bride && !groom) {
    return "Thiệp cưới";
  }

  return `${bride} & ${groom}`;
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

/* =========================================================
   NAVIGATION
========================================================= */

function goCreate() {
  router.push({ name: "Templates" });
}

function editWedding(entry) {
  router.push({
    path: "/editor",
    query: {
      slug: entry.slug,
      theme: entry.theme || undefined,
    },
  });
}

function viewWedding(entry) {
  router.push({
    name: "WeddingBySlug",
    params: { slug: entry.slug },
  });
}

/* =========================================================
   THANH TOÁN — chuyển tới trang kích hoạt thiệp
========================================================= */

function goPayment(entry) {
  router.push({
    name: "WeddingPayment",
    params: { slug: entry.slug },
  });
}

/* =========================================================
   STATUS CHIP
   Ưu tiên trạng thái xuất bản (PublishState) vì nó phản ánh
   đúng điều chủ thiệp quan tâm: khách mời có xem được không.
   Thiếu PublishState (API cũ) thì rơi về Status thô.
========================================================= */

function statusChipLabel(entry) {
  const state = entry?.publishState;

  if (state === "draft-local") return "Bản nháp";

  if (state === PUBLISH_STATE.DRAFT) return "Chưa xuất bản";

  if (state === PUBLISH_STATE.TRIAL) {
    return `Dùng thử còn ${entry.daysLeft} ngày`;
  }

  if (state === PUBLISH_STATE.EXPIRED) return "Hết hạn dùng thử";

  if (state === PUBLISH_STATE.ACTIVE) return "Đã kích hoạt";

  if (state === PUBLISH_STATE.LOCKED) return "Đã khóa";

  const status = entry?.status;

  if (status === "Active") return "Đã kích hoạt";

  if (status === "Locked") return "Đã khóa";

  return "Chờ duyệt";
}

function statusChipClass(entry) {
  const state = entry?.publishState;

  if (state === "draft-local") return "chip-pending";

  if (state === PUBLISH_STATE.TRIAL) return "chip-trial";

  if (state === PUBLISH_STATE.ACTIVE) return "chip-active";

  if (state === PUBLISH_STATE.EXPIRED) return "chip-locked";

  if (state === PUBLISH_STATE.LOCKED) return "chip-locked";

  if (state === PUBLISH_STATE.DRAFT) return "chip-pending";

  const status = entry?.status;

  if (status === "Active") return "chip-active";

  if (status === "Locked") return "chip-locked";

  return "chip-pending";
}

/* Chỉ thiệp còn là bản nháp mới cần nút "Xuất bản". */
function canPublish(entry) {
  return entry?.publishState === PUBLISH_STATE.DRAFT;
}

/* =========================================================
   XUẤT BẢN
========================================================= */

async function publishEntry(entry) {
  if (!entry?.slug || publishing.value) {
    return;
  }

  publishing.value = entry.slug;

  try {
    const response = await publishWeddingApi({ Slug: entry.slug });

    const result = response?.data;

    if (result?.status === "success") {
      showToast("Đã xuất bản thiệp — dùng thử 3 ngày");

      await loadEntries();
    } else {
      showToast(result?.message || "Không thể xuất bản thiệp");
    }
  } catch (error) {
    console.error("[Manage] publishWedding error:", error);

    showToast("Không thể xuất bản thiệp. Vui lòng thử lại.");
  } finally {
    publishing.value = "";
  }
}

/* =========================================================
   SHARE
========================================================= */

async function copyLink(entry) {
  /*
   * Link gửi khách mời trỏ vào BƯỚC 2 (/open) — khách bấm là
   * thấy phong bì và mở thiệp được ngay, không phải qua màn
   * giới thiệu dành cho người đang chọn mẫu.
   */
  const url = `${window.location.origin}/wedding/${entry.slug}/open`;

  try {
    await navigator.clipboard.writeText(url);

    /*
     * Chưa xuất bản thì link vẫn sao chép được, nhưng phải
     * nói rõ để chủ thiệp không gửi nhầm cho khách rồi tưởng hỏng.
     */
    if (canPublish(entry)) {
      showToast("Đã sao chép — nhưng thiệp chưa xuất bản nên khách mở sẽ không xem được");
    } else {
      showToast("Đã sao chép link thiệp");
    }
  } catch (error) {
    showToast("Không thể sao chép link");
  }
}

/* =========================================================
   DELETE
========================================================= */

function confirmDelete(entry) {
  deleteTarget.value = entry;
}

async function doDelete() {
  const target = deleteTarget.value;

  if (!target || deleting.value) {
    return;
  }

  deleting.value = target.slug;

  try {
    /*
     * Backend chưa có API xóa thiệp — chỉ xóa khỏi
     * danh sách đang hiển thị (server vẫn giữ thiệp).
     * Khi backend thêm deleteWedding thì gọi tại đây.
     */
    entries.value = entries.value.filter(
      (item) => item.slug !== target.slug
    );

    deleteTarget.value = null;

    showToast("Đã xóa thiệp khỏi danh sách");
  } finally {
    deleting.value = "";
  }
}

/* =========================================================
   GUESTS MANAGEMENT
========================================================= */

function showGuestsMessage(message, isError = false) {
  guestsMessage.value = message;
  guestsError.value = isError;

  window.clearTimeout(showGuestsMessage.timer);

  showGuestsMessage.timer = window.setTimeout(() => {
    guestsMessage.value = "";
    guestsError.value = false;
  }, 2800);
}

async function openGuests(entry) {
  guestsTarget.value = entry;
  guests.value = [];
  newGuestName.value = "";
  editingToken.value = "";
  editingName.value = "";
  guestsMessage.value = "";
  guestsError.value = false;

  guestsLoading.value = true;

  try {
    const response = await getRecipientsApi({ slug: entry.slug });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      guests.value = result.data;
    } else {
      showGuestsMessage(
        result?.message || "Không thể tải danh sách khách mời.",
        true
      );
    }
  } catch (error) {
    console.error("[Manage] getRecipients error:", error);

    showGuestsMessage(
      error?.response?.data?.message || "Không thể tải danh sách khách mời.",
      true
    );
  } finally {
    guestsLoading.value = false;
  }
}

function closeGuests() {
  if (guestsBusy.value || guestsLoading.value) {
    return;
  }

  guestsTarget.value = null;
}

function newGuestToken() {
  return Math.random().toString(36).substring(2, 11);
}

async function addGuest() {
  const target = guestsTarget.value;

  if (!target || guestsBusy.value || !newGuestName.value) {
    return;
  }

  guestsBusy.value = true;

  try {
    const response = await addRecipientApi({
      slug: target.slug,
      Token: newGuestToken(),
      Name: newGuestName.value,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      newGuestName.value = "";

      await reloadGuests(target.slug);

      showGuestsMessage("Đã thêm khách mời.");
    } else {
      showGuestsMessage(
        result?.message || "Không thể thêm khách mời.",
        true
      );
    }
  } catch (error) {
    console.error("[Manage] addRecipient error:", error);

    showGuestsMessage(
      error?.response?.data?.message || "Không thể thêm khách mời.",
      true
    );
  } finally {
    guestsBusy.value = false;
  }
}

async function reloadGuests(slug) {
  const response = await getRecipientsApi({ slug });

  const result = response?.data;

  if (result && result.status === "success" && Array.isArray(result.data)) {
    guests.value = result.data;
  }
}

function startGuestEdit(guest) {
  editingToken.value = guest.Token;
  editingName.value = guest.Name || "";
}

function cancelGuestEdit() {
  editingToken.value = "";
  editingName.value = "";
}

async function saveGuestEdit(guest) {
  const target = guestsTarget.value;

  if (!target || guestsBusy.value) {
    return;
  }

  const nextName = editingName.value;

  if ((nextName || "") === (guest.Name || "")) {
    cancelGuestEdit();

    return;
  }

  guestsBusy.value = true;

  try {
    const response = await updateRecipientApi({
      slug: target.slug,
      Token: guest.Token,
      Name: nextName,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      guest.Name = nextName;

      cancelGuestEdit();

      showGuestsMessage("Đã cập nhật tên khách mời.");
    } else {
      showGuestsMessage(
        result?.message || "Không thể cập nhật khách mời.",
        true
      );
    }
  } catch (error) {
    console.error("[Manage] updateRecipient error:", error);

    showGuestsMessage(
      error?.response?.data?.message || "Không thể cập nhật khách mời.",
      true
    );
  } finally {
    guestsBusy.value = false;
  }
}

async function removeGuest(guest) {
  const target = guestsTarget.value;

  if (!target || guestsBusy.value) {
    return;
  }

  guestsBusy.value = true;

  try {
    const response = await deleteRecipientApi({
      slug: target.slug,
      token: guest.Token,
    });

    const result = response?.data;

    if (result && result.status === "success") {
      guests.value = guests.value.filter((item) => item.Token !== guest.Token);

      showGuestsMessage("Đã xóa khách mời.");
    } else {
      showGuestsMessage(
        result?.message || "Không thể xóa khách mời.",
        true
      );
    }
  } catch (error) {
    console.error("[Manage] deleteRecipient error:", error);

    showGuestsMessage(
      error?.response?.data?.message || "Không thể xóa khách mời.",
      true
    );
  } finally {
    guestsBusy.value = false;
  }
}

async function copyGuestLink(guest) {
  const target = guestsTarget.value;

  if (!target || !guest.Token) {
    return;
  }

  const url = `${window.location.origin}/${target.slug}/${guest.Token}`;

  try {
    await navigator.clipboard.writeText(url);

    showToast(`Đã sao chép link của ${guest.Name || "khách mời"}`);
  } catch (error) {
    showToast("Không thể sao chép link");
  }
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {
  toast.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2500);
}
</script>

<style scoped>
/* ==================================================
   PAGE — chrome chung (page-glow, back-btn, page-hero,
   primary-btn, action-btn, status-chip, state-box,
   skeleton, modal, toast) đã gom vào app.css.
================================================== */

.manage-page {
  position: relative;

  min-height: 100vh;

  background: var(--studio-paper, #f7f1e6);

  overflow: hidden;
}

/* Hero gọn kiểu dashboard — không eyebrow, tiêu đề nhỏ hơn */
.manage-hero {
  padding: 40px 0 8px;
}

.manage-hero h1 {
  margin: 0 0 6px;

  font-size: clamp(24px, 3vw, 30px);
}

.manage-hero p {
  font-size: 14px;
}

.manage-hero .hero-actions {
  margin-top: 18px;
}

.manage-content {
  padding: 20px 0 80px;
}

/* ==================================================
   BANNER CHƯA ĐĂNG NHẬP — nháp chỉ nằm trên máy này
================================================== */

.guest-banner {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 22px;

  padding: 16px 18px;

  border: 1px solid rgba(185, 151, 91, 0.4);

  border-radius: 16px;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.12));

  color: var(--studio-ink, #2b2118);
}

.guest-banner > .v-icon {
  flex: 0 0 auto;

  color: var(--studio-foil, #b9975b);
}

.guest-banner-text {
  flex: 1;

  min-width: 0;
}

.guest-banner-text strong {
  display: block;

  font-size: 14.5px;
}

.guest-banner-text p {
  margin: 3px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;

  line-height: 1.5;
}

.guest-banner .primary-btn {
  flex: 0 0 auto;

  margin: 0;

  padding: 10px 18px;

  font-size: 13px;
}

/* ==================================================
   TAB LỌC — Tất cả / Xuất bản / Nháp
================================================== */

.filter-tabs {
  display: flex;

  gap: 2px;

  width: fit-content;

  max-width: 100%;

  margin-bottom: 18px;

  padding: 3px;

  border-radius: 12px;

  background: var(--studio-line, rgba(43, 33, 24, 0.08));

  overflow-x: auto;
}

.filter-tab {
  padding: 7px 14px;

  border: 0;

  border-radius: 9px;

  background: transparent;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12.5px;

  font-weight: 600;

  white-space: nowrap;

  cursor: pointer;

  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.filter-tab:hover {
  color: var(--studio-ink, #2b2118);
}

.filter-tab.active {
  background: var(--studio-card, #fffdf8);

  color: var(--studio-seal, #a63a2e);

  box-shadow: 0 2px 8px rgba(43, 33, 24, 0.1);
}

/* ==================================================
   GRID — thẻ compact kiểu dashboard (không ảnh lớn)
================================================== */

.manage-grid {
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));

  gap: 14px;

  align-items: stretch;
}

.manage-card {
  display: flex;

  flex-direction: column;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 18px;

  background: var(--studio-card, #fffdf8);

  overflow: hidden;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.manage-card:hover {
  transform: translateY(-3px);

  box-shadow: 0 18px 40px rgba(43, 33, 24, 0.12);
}

/* ==================================================
   CARD BODY
================================================== */

.card-body {
  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 10px;

  padding: 16px 18px;
}

.card-head {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 12px;
}

.card-head h3 {
  margin: 0;

  min-width: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: 18px;

  line-height: 1.3;
}

.card-open-hint {
  display: inline-flex;

  align-items: center;

  gap: 2px;

  flex: 0 0 auto;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  white-space: nowrap;
}

.card-chips {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 8px;
}

.card-theme {
  padding: 3px 10px;

  border-radius: 999px;

  background: var(--studio-line, rgba(43, 33, 24, 0.07));

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 11.5px;

  font-weight: 600;
}

.card-meta {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 4px 12px;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
}

/* ==================================================
   ACTION BAR — tách đáy thẻ, nút chia đều
================================================== */

.card-bar {
  display: flex;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.08));
}

.bar-btn {
  flex: 1;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 11px 6px;

  border: 0;

  background: transparent;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12px;

  font-weight: 600;

  white-space: nowrap;

  cursor: pointer;

  transition: background 0.15s ease, color 0.15s ease;
}

.bar-btn + .bar-btn {
  border-left: 1px solid var(--studio-line, rgba(43, 33, 24, 0.08));
}

.bar-btn:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.12));

  color: var(--studio-ink, #2b2118);
}

.bar-btn.primary {
  color: var(--studio-seal, #a63a2e);
}

.bar-btn.primary:hover {
  background: rgba(166, 58, 46, 0.07);

  color: var(--studio-seal, #a63a2e);
}

.bar-btn.publish {
  color: var(--app-gold-text, #8a6a2f);
}

.bar-btn.danger {
  color: var(--studio-ink-faint, #8a7a68);
}

.bar-btn.danger:hover {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.08));

  color: var(--app-danger, #a03030);
}

.bar-btn:disabled {
  opacity: 0.55;

  cursor: not-allowed;
}

/* Skeleton dòng nút đáy thẻ khi đang tải */
.bar-skeleton {
  width: 60%;

  margin: 12px auto;
}

/* ==================================================
   GUESTS MODAL
================================================== */

.guests-panel {
  display: flex;

  flex-direction: column;

  width: min(560px, 100%);

  max-height: min(640px, calc(100vh - 48px));

  padding: 26px 24px;

  border-radius: 22px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 30px 80px rgba(30, 20, 12, 0.3);

  overflow: hidden;
}

.guests-head {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 12px;

  margin-bottom: 16px;
}

.guests-eyebrow {
  display: block;

  margin-bottom: 4px;

  color: var(--app-gold-text, #8a6a2f);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.16em;

  text-transform: uppercase;
}

.guests-head h3 {
  margin: 0;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: 20px;
}

.guests-slug {
  margin: 2px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  font-family: monospace;
}

.guests-close {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  flex: 0 0 34px;

  border: 0;

  border-radius: 50%;

  background: var(--studio-paper-deep, #efe6d4);

  color: var(--studio-ink-soft, #5c4f43);

  cursor: pointer;

  transition: background 0.2s ease;
}

.guests-close:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

.guests-message {
  margin: 0 0 12px;

  padding: 9px 13px;

  border-radius: 10px;

  background: var(--app-ok-soft, rgba(46, 107, 63, 0.1));

  color: var(--app-ok, #2e6b3f);

  font-size: 13px;
}

.guests-message.error {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

  color: var(--app-danger, #a03030);
}

.guest-add-row {
  display: flex;

  gap: 8px;

  margin-bottom: 14px;
}

.guest-add-row input {
  flex: 1;

  min-width: 0;

  padding: 10px 14px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 12px;

  font-size: 13.5px;

  color: var(--studio-ink, #2b2118);

  outline: none;

  transition: border-color 0.2s ease;
}

.guest-add-row input:focus {
  border-color: var(--studio-foil, #b9975b);
}

.guests-loading {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 30px 0;

  color: var(--app-gold-text, #8a6a2f);

  font-size: 13.5px;
}

.guests-empty {
  padding: 26px 16px;

  border: 1px dashed var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  border-radius: 14px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  text-align: center;
}

.guests-list {
  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 8px;

  overflow-y: auto;

  padding-right: 2px;
}

.guest-row {
  display: flex;

  align-items: center;

  gap: 8px;

  padding: 10px 12px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 14px;

  background: var(--studio-paper, #f7f1e6);
}

.guest-info {
  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 2px;
}

.guest-info strong {
  color: var(--studio-ink, #2b2118);

  font-size: 14px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.guest-info code {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11px;

  font-family: monospace;
}

.guest-actions {
  display: flex;

  gap: 6px;

  flex: 0 0 auto;
}

.icon-btn {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 32px;

  height: 32px;

  border: 0;

  border-radius: 9px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  cursor: pointer;

  transition: background 0.2s ease, color 0.2s ease;
}

.icon-btn:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-ink, #2b2118);
}

.icon-btn.danger {
  color: var(--app-danger, #a03030);
}

.icon-btn.danger:hover {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));
}

.guest-edit-input {
  flex: 1;

  min-width: 0;

  padding: 8px 12px;

  border: 1px solid var(--studio-foil, #b9975b);

  border-radius: 10px;

  font-size: 13.5px;

  color: var(--studio-ink, #2b2118);

  outline: none;
}

.guests-hint {
  margin: 14px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  line-height: 1.6;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 600px) {
  .manage-grid {
    grid-template-columns: 1fr;
  }

  .guest-banner {
    flex-wrap: wrap;
  }

  .guest-banner .primary-btn {
    width: 100%;
  }

  .filter-tabs {
    width: 100%;
  }

  .filter-tab {
    flex: 1;

    text-align: center;
  }

  .card-bar {
    flex-wrap: wrap;
  }

  .bar-btn {
    flex: 1 1 33%;
  }

  .bar-btn + .bar-btn {
    border-left: 0;
  }

  .bar-btn:nth-child(n + 4) {
    border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.08));
  }

  .guests-panel {
    padding: 20px 16px;
  }

  .guest-add-row {
    flex-direction: column;
  }

  .guest-row {
    flex-wrap: wrap;
  }
}
</style>
