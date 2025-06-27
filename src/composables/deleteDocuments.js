import { ref } from "vue"
import { writeBatch, collection, query, where, doc, getDocs } from "firebase/firestore"
import { db } from '../firebase/config'
import useStorage from './useStorage'

const deleteDocuments = () => {
  const batch = writeBatch(db);
  const error = ref(null);

  const { deleteImages } = useStorage();

  const deleteAnswer = async (id) => {
    const refA = doc(db, 'answers', id);
    const refR = query(collection(db, 'replies'), where('answerId', '==', id));
    try {
      // delete Images
      deleteImages('answers', id)

      batch.delete(refA);
      const querySnapshotR =  await getDocs(refR);
      querySnapshotR.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (err) {
      console.log(err.message);
    }
  }

  const deleteQuestion = async(id) => {
    const refQ = doc(db, 'questions', id);
    const refA = query(collection(db, 'answers'), where('questionId', '==', id));
    const refR = query(collection(db, 'replies'), where('questionId', '==', id));

    try {
      // delete Images
      deleteImages('questions', id)

      batch.delete(refQ);
      const querySnapshotA =  await getDocs(refA);
      querySnapshotA.forEach(doc => {
        // delete Images
        deleteImages('answers', doc.id)
        
        batch.delete(doc.ref);
      });
      const querySnapshotR =  await getDocs(refR);
      querySnapshotR.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.log(err.message);
    }
  }

  return { error, deleteAnswer, deleteQuestion }
}

export default deleteDocuments;