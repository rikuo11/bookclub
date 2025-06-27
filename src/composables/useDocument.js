import { db } from "@/firebase/config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref } from "vue"


const useDocument = (_collection, _id) => {
    const error = ref(null);
    const isPending = ref(false);

    const deleteDocument = async () => {
        error.value = null
        isPending.value = true;
        try {
            const res = await deleteDoc(doc(db, _collection, _id))
            isPending.value = false;
            return res
        } catch (err) {
            console.log(err.message);
            error.value = 'データの消去に失敗しました'
            isPending.value = false;
        }
    }

    const updateDocument = async (updates) => {
        error.value = null
        isPending.value = true;
        try {
            const res = await updateDoc(doc(db, _collection, _id), updates)
            isPending.value = false;
            return res
        } catch (err) {
            console.log(err.message);
            error.value = 'データの更新に失敗しました'
            isPending.value = false;
        }
    }

    return { error, deleteDocument, isPending, updateDocument }
}

export default useDocument 