import { ref } from "vue";

import { useWeddingStore } from "@/stores/wedding";

import { getWedding } from "@/api/weddingApi";

export function useWedding() {

    const store = useWeddingStore();

    const loading = ref(false);

    const loadWedding = async () => {

        loading.value = true;

        try {

            const res = await getWedding();

            store.setWedding(res.data ?? res);

        }

        catch (e) {

            console.warn("API Error");

        }

        finally {

            loading.value = false;

        }

    };

    return {

        loading,

        wedding: store.wedding,

        loadWedding

    };

}