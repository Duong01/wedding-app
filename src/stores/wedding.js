import { defineStore } from "pinia";

// import defaults from "./../utils/defaultData";
import weddingData from "./../mock/wedding.json";


export const useWeddingStore = defineStore("wedding", {

  state: () => ({

    /*
     * ============================================================
     * DANH SÁCH TẤT CẢ THIỆP
     * ============================================================
     *
     * Dùng cho Home
     */
    weddings: [],


    /*
     * ============================================================
     * THIỆP HIỆN TẠI
     * ============================================================
     *
     * Dùng cho WeddingDetail
     */
    wedding: null,


    /*
     * ============================================================
     * LOADING
     * ============================================================
     */
    loading: false,


    /*
     * ============================================================
     * ERROR
     * ============================================================
     */
    error: null,


    /*
     * ============================================================
     * CACHE
     * ============================================================
     *
     * cache theo slug
     *
     * Ví dụ:
     *
     * cache: {
     *   "ha-uyen-tran-hieu": {...},
     *   "minh-anh-quoc-huy": {...}
     * }
     */
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

          throw new Error(
            "wedding.json phải có dạng Array []"
          );

        }

        this.weddings = weddingData.map(
          (item) => {

            return {
              id: item.id,

              slug: item.slug,

              theme: item.theme,

              language: item.language,

              weddingDate:
                item.weddingDate,

              coverImage:
                item.coverImage,


              /*
               * Thông tin cô dâu chú rể
               */
              couple: {

                bride: {

                  name:
                    item.couple?.bride?.name ||
                    "",

                  nickname:
                    item.couple?.bride?.nickname ||
                    "",

                  role:
                    item.couple?.bride?.role ||
                    "Cô dâu",

                },


                groom: {

                  name:
                    item.couple?.groom?.name ||
                    "",

                  nickname:
                    item.couple?.groom?.nickname ||
                    "",

                  role:
                    item.couple?.groom?.role ||
                    "Chú rể",

                },

              },

            };

          }
        );


        console.log(
          "Danh sách thiệp:",
          this.weddings
        );


        return this.weddings;


      } catch (error) {

        console.error(
          "loadWeddings error:",
          error
        );


        this.error =
          error?.message ||
          "Không thể tải danh sách thiệp.";


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

          throw new Error(
            "Thiếu slug của thiệp cưới."
          );

        }

        if (this.cache[slug]) {

          console.log(
            "Lấy wedding từ cache:",
            slug
          );


          this.wedding =
            this.cache[slug];


          return this.wedding;

        }
        if (!Array.isArray(weddingData)) {

          throw new Error(
            "wedding.json phải có dạng Array []"
          );

        }

        const foundWedding =
          weddingData.find(
            (item) =>
              item?.slug === slug
          );

        if (!foundWedding) {

          throw new Error(
            `Không tìm thấy thiệp với slug: ${slug}`
          );

        }

        const data = {
          // ...structuredClone(defaults),

          ...structuredClone(foundWedding),

        };

        this.cache[slug] = data;

        this.wedding = data;


        console.log(
          "Wedding hiện tại:",
          this.wedding
        );


        return data;


      } catch (error) {

        console.error(
          "loadWedding error:",
          error
        );


        this.error =
          error?.message ||
          "Không thể tải thiệp cưới.";


        this.wedding = null;


        throw error;


      } finally {

        this.loading = false;

      }

    },


    setWedding(data) {

      this.wedding = {

        // ...structuredClone(defaults),

        ...structuredClone(data),

      };

    },


    reset() {

      this.wedding =
        // structuredClone(defaults);
        structuredClone(weddingData);

    },


    clearCache() {

      this.cache = {};

    },

  },

});