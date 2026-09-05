import { defineStore } from "pinia";

import weddingData from "./../mock/wedding.json";

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
    async loadWeddings() {
      this.loading = true;
      this.error = null;

      try {
        if (!Array.isArray(weddingData)) {
          throw new Error("wedding.json phải có dạng Array []");
        }

        this.weddings = weddingData.map((item) => {
          return {
            id: item.Id,

            slug: item.slug,

            theme: item.theme,

            language: item.language,

            weddingDate: item.weddingDate,

            coverImage: item.coverImage,

            /*
             * Thông tin cô dâu chú rể
             */
            couple: {
              Bride: {
                Name: item.couple?.Bride?.Name || "",

                Nickname: item.couple?.Bride?.Nickname || "",

                Rle: item.couple?.Bride?.Role || "Cô dâu",
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

        console.log("Wedding hiện tại:", this.wedding);

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

    reset() {
      this.wedding = structuredClone(weddingData);
    },

    clearCache() {
      this.cache = {};
    },
  },
});
