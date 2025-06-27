import { db } from '@/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { ref, watch, watchEffect } from 'vue'


const getDocument = (collection, id) => {
    const error = ref(null);
    const document = ref(null);

    const unsub = onSnapshot(doc(db, collection, id), doc => {
        if(doc.exists()) {
            document.value = { ...doc.data(), id: doc.id }
            error.value = null;
        } else {
            error.value = 'お探しのデータは存在しません';
            document.value = null;
        }     
    }, err => {
        error.value = 'アクセスに失敗しました。'
        console.log(err.message);
    })

    // unscribe realtime listener when a component is unmounted
    watchEffect(onInvalidate => {
        onInvalidate(() => unsub());
    })

    return { error, document }

}

export default getDocument;