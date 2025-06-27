import { db } from "@/firebase/config"
import { addDoc, collection, doc, setDoc, query, where, limit, orderBy, getDocs } from "firebase/firestore"
import { ref } from "vue"


const useCollection = (_collection) => {
    const documents = ref([])
    const error = ref(null);
    const isPending = ref(false);

    const addDocument = async(_doc, _id) => {
        error.value = null;
        isPending.value = true
        try {
            let res

            if(_id) {
                // specify document id
                res = await setDoc(doc(db, _collection, _id), _doc);
                isPending.value = false
                return res;
            } else {
                // create random document id
                res = await addDoc(collection(db, _collection), _doc);
                isPending.value = false
                return res;
            }
        } catch (err) {
            error.value = err.message;
            console.log(err.message);
            isPending.value = false
        }
    }

    const getDocuments = async (_limit, _query) => {
        let q = query(collection(db, _collection), orderBy("createAt"), limit(_limit));

        if(_query) {
            q = query(collection(db, _collection), where(..._query), orderBy("createAt"), limit(_limit));
        }

        error.value = null;
        isPending.value = true;

        try{
            
            const querySnapshot = await getDocs(q);
            let results = []
            
            querySnapshot.forEach((doc) => {
                doc.data().createAt && results.push({ ...doc.data(), id: doc.id })
            });

            documents.value = results

            isPending.value = false;
        } catch(err) {
            console.log(err.message);
            error.value = 'データを取得できませんでした'
            isPending.value = false;
        }
    }
    
    return { error, addDocument, getDocuments, isPending, documents }
}

export default useCollection