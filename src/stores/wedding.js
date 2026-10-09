import { t } from "@/lang";

import { defineStore } from "pinia";

import { GetWedding, GetWeddingForEdit } from "@/model/api";

/*
 * 26 mẫu demo (JSON) — import LAZY, không import tĩnh.
 *
 * Import tĩnh kéo cả file vào bundle chính: khách mời mở
 * link thiệp thật cũng phải tải 26 mẫu demo không bao giờ
 * dùng tới. Lazy thì JSON chỉ tải khi thật sự cần danh sách
 * mẫu (Home/Templates) hoặc khi thiệp API không tồn tại
 * (fallback demo).
 */
let weddingDataPromise = null;

function loadMockData() {
  if (!weddingDataPromise) {
    weddingDataPromise = import("./../mock/wedding.json").then(
      (module) => module.default
    );
  }

  return weddingDataPromise;
}

export const useWeddingStore = defineStore("wedding", {
  state: () => ({
    weddings: [],
    wedding: null,
    loading: false,
    error: null,
    cache: {},

    /*
     * Map slug → Promise đang bay của loadWedding(slug).
     * Editor (onMounted/onActivated) và Preview có thể gọi
     * loadWedding cùng slug gần như đồng thời — không gom
     * thì 2 request getWeddingForEdit bay song song.
     */
    inflight: {},
  }),

  getters: {
    weddingList: (state) => {
      return state.weddings;
    },

    currentWedding: (state) => {
      return state.wedding;
    },
  },

  actions: {
    /*
     * Cache LRU: mỗi thiệp đã mở chiếm bộ nhớ (gallery, story,
     * music...). Người dùng duyệt 10 thiệp liên tiếp thì 10 bản
     * nằm mãi trong cache. Giữ tối đa 5 bản gần nhất — bản cũ
     * nhất bị đẩy ra, lần sau mở lại thì gọi API (vài trăm ms,
     * chấp nhận được để đổi lấy bộ nhớ ổn định).
     */
    touchCache(slug) {
      const order = this._cacheOrder || (this._cacheOrder = []);

      const at = order.indexOf(slug);

      if (at >= 0) {
        order.splice(at, 1);
      }

      order.push(slug);

      while (order.length > 5) {
        const evict = order.shift();

        delete this.cache[evict];
      }
    },
    /*
     * Danh sách mẫu thiệp hiển thị ở Home / Templates.
     *
     * Backend hiện chưa có endpoint "lấy tất cả thiệp"
     * nên dùng mock làm danh sách mẫu.
     */
    async loadWeddings() {
      this.loading = true;
      this.error = null;

      try {
        const weddingData = await loadMockData();

        if (!Array.isArray(weddingData)) {
          throw new Error("wedding.json phải có dạng Array []");
        }

        this.weddings = weddingData.map((item) => {
          return {
            id: item.Id,

            slug: item.slug,

            theme: item.theme,

            language: item.language,

            weddingDate: item.weddingDate || item.WeddingDate,

            coverImage: item.coverImage,

            /*
             * Thông tin cô dâu chú rể
             */
            couple: {
              Bride: {
                Name: item.couple?.Bride?.Name || "",

                Nickname: item.couple?.Bride?.Nickname || "",

                Role: item.couple?.Bride?.Role || "Cô dâu",
              },

              Groom: {
                Name: item.couple?.Groom?.Name || "",

                Nickname: item.couple?.Groom?.Nickname || "",

                Role: item.couple?.Groom?.Role || "Chú rể",
              },
            },
          };
        });

        return this.weddings;
      } catch (error) {
        console.error("loadWeddings error:", error);

        this.error = error?.Message || t("wedding.loadListFailed");

        this.weddings = [];

        throw error;
      } finally {
        this.loading = false;
      }
    },

    /*
     * Load 1 thiệp theo slug — API TRƯỚC, mock sau.
     *
     * CHỈ dùng cho editor và /preview (chỉnh sửa thiệp thật lưu
     * trên server). Các trang /wedding/:slug* (giới thiệu + mở
     * mẫu demo) KHÔNG dùng hàm này — xem loadWeddingNoApi.
     *
     * Ưu tiên API thật (GetWedding), nếu API lỗi
     * (thiệp chưa lưu trên server) thì fallback về mock.
     */
    async loadWedding(slug) {
      if (!slug) {
        this.error = t("wedding.missingSlug");

        throw new Error(t("wedding.missingSlug"));
      }

      if (this.cache[slug]) {
        this.wedding = this.cache[slug];

        return this.wedding;
      }

      /*
       * Request cùng slug đang bay → trả lại chính Promise
       * đó. Caller thứ hai nhận cùng kết quả, không gây
       * request thứ hai nhân bản.
       */
      if (this.inflight[slug]) {
        return this.inflight[slug];
      }

      this.loading = true;
      this.error = null;

      const promise = this.fetchWeddingUncached(slug).finally(() => {
        delete this.inflight[slug];

        this.loading = false;
      });

      this.inflight[slug] = promise;

      return promise;
    },

    /*
     * Phần thân load thật — chỉ chạy MỘT lần cho mỗi slug
     * nhờ inflight map ở trên.
     */
    async fetchWeddingUncached(slug) {
      this.error = null;

      try {
        /*
         * Gọi API thật.
         *
         * 1. GetWeddingForEdit — endpoint cho CHỦ SỞ HỮU: bỏ qua
         *    cổng chặn publish/trial nên thiệp Draft (vừa lưu,
         *    chưa xuất bản) vẫn mở lại được để chỉnh sửa.
         *    Chỉ gọi khi có token đăng nhập (endpoint yêu cầu
         *    đăng nhập — khách chưa đăng nhập sẽ nhận 401).
         * 2. GetWedding — endpoint công khai cho khách mời:
         *    chỉ trả thiệp đã xuất bản / đã thanh toán.
         */
        const hasAuthToken = !!localStorage.getItem("token");

        if (hasAuthToken) {
          try {
            const editResponse = await GetWeddingForEdit(slug);

            const editResult = editResponse?.data;

            if (editResult && editResult.status === "success" && editResult.data) {
              const data = editResult.data;

              this.cache[slug] = data;

              this.touchCache(slug);

              this.wedding = data;

              return data;
            }
          } catch (editError) {
            console.warn(
              `[wedding store] getWeddingForEdit lỗi cho "${slug}", thử endpoint công khai.`,
              editError?.response?.status || editError?.message
            );
          }
        }

        try {
          const response = await GetWedding(slug);

          const result = response?.data;

          if (result && result.status === "success" && result.data) {
            const data = result.data;

            this.cache[slug] = data;

            this.touchCache(slug);

            this.wedding = data;

            return data;
          }
        } catch (apiError) {
          console.warn(
            `[wedding store] API không có thiệp "${slug}", fallback về mock.`,
            apiError?.response?.status || apiError?.message
          );
        }

        /*
         * Fallback về mock (mẫu thiệp demo).
         */
        const weddingData = await loadMockData();

        if (!Array.isArray(weddingData)) {
          throw new Error("wedding.json phải có dạng Array []");
        }

        const foundWedding = weddingData.find((item) => item?.slug === slug);

        if (!foundWedding) {
          throw new Error(t("wedding.notFoundSlug", { slug }));
        }

        const data = {
          ...structuredClone(foundWedding),
        };

        this.cache[slug] = data;

        this.touchCache(slug);

        this.wedding = data;

        return data;
      } catch (error) {
        console.error("loadWedding error:", error);

        this.error = error?.Message || t("wedding.loadFailed");

        this.wedding = null;

        throw error;
      }
    },

    /*
     * Load 1 thiệp theo slug — CHỈ đọc mock (wedding.json),
     * KHÔNG gọi API.
     *
     * Dùng cho các trang /wedding/:slug* (giới thiệu mẫu, mở
     * phong bì, xem mẫu): đây là luồng xem MẪU DEMO, dữ liệu có
     * sẵn trong bundle nên mở tức thì, không đợi server. Thiệp
     * thật của khách mời đi qua /:slug/:token (WeddingApi.vue)
     * và luôn load API.
     */
    async loadWeddingNoApi(slug) {
      this.loading = true;
      this.error = null;

      try {
        if (!slug) {
          throw new Error(t("wedding.missingSlug"));
        }

        if (this.cache[slug]) {
          this.wedding = this.cache[slug];

          return this.wedding;
        }

        /*
         * Fallback về mock (mẫu thiệp demo).
         */
        const weddingData = await loadMockData();

        if (!Array.isArray(weddingData)) {
          throw new Error("wedding.json phải có dạng Array []");
        }

        const foundWedding = weddingData.find((item) => item?.slug === slug);

        if (!foundWedding) {
          throw new Error(t("wedding.notFoundSlug", { slug }));
        }

        const data = {
          ...structuredClone(foundWedding),
        };

        this.cache[slug] = data;

        this.touchCache(slug);

        this.wedding = data;

        return data;
      } catch (error) {
        console.error("loadWedding error:", error);

        this.error = error?.Message || t("wedding.loadFailed");

        this.wedding = null;

        throw error;
      } finally {
        this.loading = false;
      }
    },

    setWedding(data) {
      this.wedding = {
        ...structuredClone(data),
      };
    },

    async reset() {
      const weddingData = await loadMockData();

      this.wedding = structuredClone(weddingData[0]);
    },

    clearCache() {
      this.cache = {};

      this._cacheOrder = [];
    },

    /*
     * Xoá cache của MỘT slug — gọi sau khi lưu thiệp thành công.
     *
     * loadWedding() trả cache[slug] TRƯỚC khi gọi API, nên nếu
     * không xoá thì lần sau mở lại editor sẽ nhận bản cũ (thiếu
     * nội dung vừa nhập, hoặc thiếu các mục API mới trả về).
     */
    invalidate(slug) {
      if (!slug) {
        this.clearCache();

        return;
      }

      delete this.cache[slug];

      if (Array.isArray(this._cacheOrder)) {
        this._cacheOrder = this._cacheOrder.filter((s) => s !== slug);
      }
    },
  },
});
