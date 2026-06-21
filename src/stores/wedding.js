import { defineStore } from "pinia";

import defaults from "@/utils/defaultData";

export const useWeddingStore = defineStore("wedding", {

    state: () => ({

        loading: false,

        wedding: structuredClone(defaults)

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

        }

    }

});