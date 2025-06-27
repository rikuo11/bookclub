import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { ref, watchEffect } from "vue"


const getCollection = (_collection, _query) => {
    const error = ref(null);
    const documents = ref([]);

    let q = query(collection(db, _collection), orderBy('createAt'));

    if(_query) {
        q = query(collection(db, _collection), where(..._query), orderBy('createAt'));
    }


    const unsub = onSnapshot(q, snap => {
        let results = [];
        snap.docs.forEach(doc => {
            doc.data().createAt && results.push({ ...doc.data(), id: doc.id })
        })

        documents.value = results
        error.value = null;
    }, err => {
        error.value = 'エラーが発生しました';
        console.log(err);
        documents.value = [];
    })

    watchEffect(onInvalidate => {
        onInvalidate(() => unsub());
    })

    return { error, documents, unsub }
}

export default getCollection