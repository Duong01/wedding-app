import { ref, computed } from "vue";

import { getWeddingStatus, publishWedding } from "@/model/api";
import { PUBLISH_STATE } from "@/model/weddingAdmin";

/*
 * Trạng thái xuất bản + dùng thử của thiệp đang mở trong editor.
 *
 * Tách khỏi Editor.vue (đã rất dài) và KHÔNG dùng Pinia: chỉ
 * editor cần dữ liệu này, còn /manage lấy cùng thông tin qua
 * getMyWeddings (server đã trả kèm PublishState/DaysLeft).
 *
 * @param wedding   Ref<Object|null> — thiệp đang sửa (để biết đã có slug chưa)
 * @param routeSlug Ref<string>      — slug trên URL
 */
export function useWeddingPublish(wedding, routeSlug) {
  /* WeddingStatusInfo thô từ server. */
  const state = ref(null);

  const loading = ref(false);
  const publishing = ref(false);

  const publishState = computed(
    () => state.value?.PublishState || PUBLISH_STATE.DRAFT
  );

  const daysLeft = computed(() => state.value?.DaysLeft || 0);

  const trialEndsAt = computed(() => state.value?.TrialEndsAt || null);

  const publishedAt = computed(() => state.value?.PublishedAt || null);

  /* Khách mời có đang xem được thiệp không. */
  const isPublished = computed(() =>
    [PUBLISH_STATE.TRIAL, PUBLISH_STATE.ACTIVE].includes(publishState.value)
  );

  /*
   * Link gửi cho khách mời — chỉ có ý nghĩa khi thiệp đã có slug.
   *
   * Trỏ vào BƯỚC 2 (/open) chứ không phải trang giới thiệu: khách
   * bấm vào là thấy phong bì và mở thiệp được ngay, không phải đi
   * qua màn giới thiệu dành cho người đang chọn mẫu.
   */
  const guestLink = computed(() => {
    const slug = routeSlug.value || wedding.value?.slug;

    return slug ? `${window.location.origin}/wedding/${slug}/open` : "";
  });

  /*
   * Đọc lại trạng thái từ server. Thiệp mới chưa có slug thì
   * giữ nguyên mặc định Draft, không gọi API.
   */
  function refresh() {
    const slug = routeSlug.value || wedding.value?.slug;

    if (!slug) {
      state.value = null;
      return Promise.resolve(null);
    }

    loading.value = true;

    return new Promise((resolve) => {
      getWeddingStatus(
        { slug },
        (res) => {
          loading.value = false;

          if (res?.status === "success" && res.data) {
            state.value = res.data;
          }

          resolve(state.value);
        },
        () => {
          loading.value = false;

          resolve(null);
        }
      );
    });
  }

  /*
   * Bấm "Xuất bản" — server bật thiệp và mở đồng hồ dùng thử.
   * Idempotent ở phía server: gọi lại không reset đồng hồ.
   *
   * @returns Promise<boolean> thành công hay không
   */
  function publish() {
    const slug = routeSlug.value || wedding.value?.slug;

    if (!slug) {
      return Promise.resolve(false);
    }

    publishing.value = true;

    return new Promise((resolve) => {
      publishWedding(
        { Slug: slug },
        (res) => {
          publishing.value = false;

          if (res?.status === "success") {
            /* Server trả luôn WeddingStatusInfo mới. */
            if (res.data) {
              state.value = res.data;
            } else {
              refresh();
            }

            resolve(true);
            return;
          }

          resolve(false);
        },
        () => {
          publishing.value = false;

          resolve(false);
        }
      );
    });
  }

  return {
    state,
    loading,
    publishing,
    publishState,
    daysLeft,
    trialEndsAt,
    publishedAt,
    isPublished,
    guestLink,
    refresh,
    publish,
  };
}
