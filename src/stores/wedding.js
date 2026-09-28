import { defineStore } from "pinia";

import { GetWedding } from "@/model/api";

/*
 * 19 mẫu demo (144KB JSON) — import LAZY, không import tĩnh.
 *
 * Import tĩnh kéo cả file vào bundle chính: khách mời mở
 * link thiệp thật cũng phải tải 19 mẫu demo không bao giờ
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

        this.error = error?.Message || "Không thể tải danh sách thiệp.";

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
      this.loading = true;
      this.error = null;

      try {
        if (!slug) {
          throw new Error("Thiếu slug của thiệp cưới.");
        }

        if (this.cache[slug]) {
          this.wedding = this.cache[slug];

          return this.wedding;
        }

        /*
         * Gọi API thật.
         */
        try {
          const response = await GetWedding(slug);

          const result = response?.data;

          if (result && result.status === "success" && result.data) {
            const data = result.data;

            this.cache[slug] = data;

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
          throw new Error(`Không tìm thấy thiệp với slug: ${slug}`);
        }

        const data = {
          ...structuredClone(foundWedding),
        };

        this.cache[slug] = data;

        this.wedding = data;

        return data;
      } catch (error) {
        console.error("loadWedding error:", error);

        this.error = error?.Message || "Không thể tải thiệp cưới.";

        this.wedding = null;

        throw error;
      } finally {
        this.loading = false;
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
          throw new Error("Thiếu slug của thiệp cưới.");
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
          throw new Error(`Không tìm thấy thiệp với slug: ${slug}`);
        }

        const data = {
          ...structuredClone(foundWedding),
        };

        this.cache[slug] = data;

        this.wedding = data;

        return data;
      } catch (error) {
        console.error("loadWedding error:", error);

        this.error = error?.Message || "Không thể tải thiệp cưới.";

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
    },
  },
});
