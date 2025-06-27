<template>
  <v-btn v-if="isfollowing" icon="mdi-bookmark-check" @click="unfollow"></v-btn>
  <v-btn v-else icon="mdi-bookmark-check-outline" @click="follow"></v-btn>
  <v-snackbar
      :timeout="2000"
      v-model="snackbar"
  >
    ログインしてください

    <template v-slot:actions>
      <v-btn
        color="error"
        variant="text"
        @click="snackbar = false"
        icon="mdi-close"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { computed, ref } from 'vue';
import getUser from '../composables/getUser'
import { arrayUnion, arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
export default {
  props: ['document', 'collectionName'],
  setup(props) {
    const error = ref(null);
    const snackbar = ref(false);

    const { user } = getUser();
    const docRef = doc(db, props.collectionName, props.document.id);

    const isfollowing = computed(() => {
      return props.document.followers.includes(user.value?.uid)
    })

    const follow = async() => {
      if(user.value) {
        try {
          error.value = null;
          await updateDoc(docRef, {
            followers: arrayUnion(user.value.uid)
          })
        } catch (error) {
          console.log(error.message);
          error.value = '保存に失敗しました'
        }
      } else {
        snackbar.value = true;
      }
    }

    const unfollow = async() => {
      if(user.value) {
        try {
          error.value = null;
          await updateDoc(docRef, {
            followers: arrayRemove(user.value.uid)
          })
        } catch (error) {
          console.log(error.value);
          error.value = '保存に失敗しました'
        }
      } else {
        snackbar.value = true;
      }
    }

    return { isfollowing, follow, unfollow, snackbar }
  }
}
</script>

<style>

</style>