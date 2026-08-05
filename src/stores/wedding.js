import { defineStore } from "pinia";

import defaults from "./../utils/defaultData";
import weddingData from "./../mock/wedding.json";

export const useWeddingStore = defineStore("wedding", {

    state: () => ({

        loading: false,

        // wedding: structuredClone(defaults)
        wedding: {},
    }),

    actions: {

        setWedding(data) {

            this.wedding = {

                ...structuredClone(defaults),

                ...data

            };

        },

        reset() {

            this.wedding = structuredClone(defaults);

        },

        async loadWedding() {

            this.loading = true;

            // sau này thay bằng axios

            this.wedding = weddingData;

            this.loading = false;

        }

    }

});