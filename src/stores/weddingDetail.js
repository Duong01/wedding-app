import { defineStore } from "pinia";
import { GetWedding } from "@/model/api";

export const useWeddingDetailStore = defineStore("weddingDetail", {
  state: () => ({
    wedding: null,
    loading: false,
    error: null,
  }),

  actions: {
    loadWedding(slug, token) {
      this.loading = true;
      this.error = null;
      this.wedding = null;

      return new Promise((resolve, reject) => {
        GetWedding(
          {
            slug: slug,
            token: token,
          },

          // success
          (response) => {
            this.loading = false;

            if (
              response &&
              response.status === "success" &&
              response.data
            ) {
              this.wedding = response.data;

              resolve(response.data);
            } else {
              this.wedding = null;

              this.error =
                response?.Message ||
                "Không tìm thấy thiệp.";

              reject(new Error(this.error));
            }
          },

          // error
          (error) => {
            this.loading = false;
            this.wedding = null;

            this.error =
              error?.response?.data?.Message ||
              "Không thể tải thông tin thiệp.";

            reject(error);
          }
        );
      });
    },

    clearWedding() {
      this.wedding = null;
      this.loading = false;
      this.error = null;
    },
  },
});
