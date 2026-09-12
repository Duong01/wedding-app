import { defineStore } from "pinia";
import { GetWedding } from "@/model/api";

export const useWeddingDetailStore = defineStore("weddingDetail", {
  state: () => ({
    wedding: null,
    loading: false,
    error: null,
  }),

  actions: {
    /*
     * GetWedding(slug, token) — positional args.
     * Promise trả về axios response; data thật nằm ở response.data.
     */
    async loadWedding(slug, token) {
      this.loading = true;
      this.error = null;
      this.wedding = null;

      try {
        const response = await GetWedding(
          slug,
          typeof token === "string" && token.trim() ? token : ""
        );

        const result = response?.data;

        if (result && result.status === "success" && result.data) {
          this.wedding = result.data;

          return this.wedding;
        }

        this.wedding = null;

        this.error =
          result?.message ||
          result?.Message ||
          "Không tìm thấy thiệp.";

        throw new Error(this.error);
      } catch (error) {
        this.loading = false;
        this.wedding = null;

        this.error =
          error?.response?.data?.message ||
          error?.response?.data?.Message ||
          error?.message ||
          "Không thể tải thông tin thiệp.";

        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearWedding() {
      this.wedding = null;
      this.loading = false;
      this.error = null;
    },
  },
});
