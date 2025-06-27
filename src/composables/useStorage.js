import { storage } from "@/firebase/config";
import { deleteObject, getDownloadURL, listAll, ref as storageRef, uploadBytes } from "firebase/storage"
import { ref } from 'vue'
import getUser from "./getUser";

const { user } = getUser();

const useStorage = () => {
  const error = ref(null);
  const filePath = ref(null);

  const uploadImage = async (collectionName, documentId, file, fileName) => {
    error.value = null
    filePath.value = `${collectionName}/images/${documentId}/${fileName}`
    const imageRef = storageRef(storage, filePath.value);
    try {
      const res = await uploadBytes(imageRef, file);
      return await getDownloadURL(res.ref);
    } catch (err) {
      console.log(err.message);
    }
  }

  const deleteImages = async (collectionName, documentId) => {
    error.value = null;
    try {
      const listRef = storageRef(storage, `${collectionName}/images/${documentId}/`);
      const res = await listAll(listRef);
      res.items.forEach(itemRef => {
        deleteObject(itemRef);
      });
    } catch (err) {
      error.value = err.message;
      console.log(err.message);
    }
  }

  const deleteImage = async (collectionName, documentId, fileName) => {
    error.value = null
    try {
      const imageRef = storageRef(storage, `${collectionName}/images/${documentId}/${fileName}`);
      const res = await deleteObject(imageRef);
      return res;
    } catch (err) {
      error.value = err.message;
      console.log(err.message);
    }
  }
  
  return { uploadImage, filePath, deleteImages, deleteImage, error }
}

export default useStorage

