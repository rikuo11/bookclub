<template>
  <div v-if="noVote">
    <v-btn icon="mdi-thumb-up-outline" @click="like1"></v-btn>
    <span>{{ vote }}</span>
    <v-btn icon="mdi-thumb-down-outline" @click="dislike1"></v-btn>
  </div>
  <div v-if="voteYes">
    <v-btn icon="mdi-thumb-up" @click="like2"></v-btn>
    <span>{{ vote }}</span>
    <v-btn icon="mdi-thumb-down-outline" @click="dislike2"></v-btn>
  </div>
  <div v-if="voteAgainst">
    <v-btn icon="mdi-thumb-up-outline" @click="like3"></v-btn>
    <span>{{ vote }}</span>
    <v-btn icon="mdi-thumb-down" @click="dislike3"></v-btn>
  </div>
  
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
import { arrayUnion, arrayRemove, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/firebase/config';
export default {
  props: ['document', 'collectionName'],
  setup(props) {
    const snackbar = ref(false);
    const { user } = getUser();

    const vote = computed(() => {
      return props.document.like.length + -1*props.document.dislike.length
    });

    const voteYes = computed(() => {
      return props.document.like.includes(user.value?.uid);
    });

    const voteAgainst = computed(() => {
      return props.document.dislike.includes(user.value?.uid);
    });

    // this computed value is true if user does not login.
    const noVote = computed(() => {
      return !props.document.like.includes(user.value?.uid) && !props.document.dislike.includes(user.value?.uid);
    });

    const docRef = doc(db, props.collectionName, props.document.id);
    const error = ref(null)

    const like1 = async() => {
      if(user.value) {
        const batch = writeBatch(db);
        try {
          error.value = null
          batch.update(docRef, {
            like: arrayUnion(user.value.uid)
          });
          await batch.commit()
        } catch (error) {
          console.log(error.message);
          error.value = '投票に失敗しました';
        }
      } else { 
        snackbar.value = true;
      }
    }

    const dislike1 = async() => {
      if(user.value) {
        const batch = writeBatch(db);
        try {
          error.value = null
          batch.update(docRef, {
            dislike: arrayUnion(user.value.uid)
          })
          await batch.commit()
        } catch (error) {
          console.log(error.message);
          error.value = '投票に失敗しました';
        }
      } else { 
        snackbar.value = true;
      }
    }

    const like2 = async() => {
      const batch = writeBatch(db);
      try {
        error.value = null
        batch.update(docRef, {
          like: arrayRemove(user.value.uid)
        });
        await batch.commit()
      } catch (error) {
        console.log(error.message);
        error.value = '投票に失敗しました';
      }
      
    }

    const dislike2 = async() => {
      const batch = writeBatch(db);
      try {
        error.value = null
        batch.update(docRef, {
          like: arrayRemove(user.value.uid)
        });
        batch.update(docRef, {
          dislike: arrayUnion(user.value.uid)
        })
        await batch.commit()
      } catch (error) {
        console.log(error.message);
        error.value = '投票に失敗しました';
      } 
    }

    const like3 = async() => {
      const batch = writeBatch(db);
      try {
        error.value = null
        batch.update(docRef, {
          like: arrayUnion(user.value.uid)
        });
        batch.update(docRef, {
          dislike: arrayRemove(user.value.uid)
        })
        await batch.commit()
      } catch (error) {
        console.log(error.message);
        error.value = '投票に失敗しました';
      }
    }
    
    const dislike3 = async() => {
      const batch = writeBatch(db);
      try {
        error.value = null
        batch.update(docRef, {
          dislike: arrayRemove(user.value.uid)
        })
        await batch.commit()
      } catch (error) {
        console.log(error.message);
        error.value = '投票に失敗しました';
      }
    }



    return { user, vote, voteYes, voteAgainst, noVote, like1, dislike1, like2, dislike2, like3, dislike3, snackbar }
  }
}
</script>

<style>

</style>