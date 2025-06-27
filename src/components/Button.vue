<template>
  <div>
    <!-- button -->
    <slot name="question-button" :handle-click="handleClick1"></slot>
    <slot name="answer-button" :handle-click="handleClick2"></slot>
    <slot name="reply-button" :handle-click="handleClick3"></slot>
    
    <!-- signin dialog -->
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
      >
        <v-card-item>
          <div>
            <v-icon icon="mdi-login" class="mr-3 mb-1" color="primary"></v-icon>
            <span class="text-h6">ログイン</span>
          </div>
          <v-divider class="mt-2 mb-4"></v-divider>
          <div>
            <span class="text-subtitle-2 text-medium-emphasis">続行することで、BookClubの利用規定とプライバシー規定に同意したものとみなされます。</span>
          </div>
        </v-card-item>
        <div class="mt-8 px-5 pb-12 d-flex justify-center">
          <v-btn
            @click="handleSignIn"     
            size="large"
            variant="tonal"
            width="300"
          >
            <v-img :src="require('@/assets/images/logo/google-logo.png')" width="25" class="mr-2"></v-img>
            <span class="text-capitalize">Googleでログイン</span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- snackbar -->
    <v-snackbar
      :timeout="2000"
      v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          color="error"
          variant="text"
          @click="snackbar = false"
          icon="mdi-close"
        ></v-btn>
      </template>
    </v-snackbar>

    <!-- notification dialog -->
    <v-dialog
      v-model="notificationDialog"
      width="auto"
    >
      <v-card
        max-width="400"
      >
        <v-card-item>
          <div>
            <v-icon icon="mdi-bell-ring" class="mr-3 mb-1" color="primary"></v-icon>
            <span class="text-h6">通知</span>
          </div>
          <v-divider class="mt-2 mb-4"></v-divider>
          <div>
            <span class="text-subtitle-2 text-medium-emphasis">通知をオンにすることで、新しい回答のお知らせをリアルタイムで受け取ることができます。</span>
          </div>
        </v-card-item>
        <div class="mt-8 px-5 pb-12 d-flex justify-center">
          <v-row>
            <v-col cols="12" sm="6" class="d-flex justify-center">
              <v-btn variant="tonal" color="info" width="150" @click="requestPermission">通知をON</v-btn>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-center">
              <v-btn variant="tonal" color="error" width="150" @click="notificationDialog = false">キャンセル</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { watch } from 'vue';
import getUser from '../composables/getUser'
import { auth, db, provider } from '../firebase/config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore";
import useCollection from '../composables/useCollection'
import { serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router';
import { getMessaging, getToken } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default {
  props:['user', 'isbn', 'title', 'questionId'],
  setup(props, context) {
    const router = useRouter()
    const { user } = getUser()

    const dialog = ref(false)
    const notificationDialog = ref(false)
    const snackbar = ref(false);
    const snackbarText = ref('');

    const { addDocument } = useCollection('users');

    const handleSignIn = async() => {
      dialog.value = false;

      try {
        const result = await signInWithPopup(auth, provider)
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        
        // send users info to firestore
        const docRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(docRef);
        
        if(!docSnap.exists()) {
          await addDocument({
            uid: result.user.uid,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createAt: serverTimestamp()
          }, result.user.uid);
        }

        // open dialog
        notificationDialog.value = true

        snackbarText.value = 'ログインしました'
        snackbar.value = true;
      } catch (error) {
        // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          
          snackbarText.value = 'ログインに失敗しました'
          snackbar.value = true;
      }
    }

    // request notification permission & send registration token to firestore
    const requestPermission = async () => {
      try {
        notificationDialog.value = false

        const res = await Notification.requestPermission()
        const messaging = getMessaging();
        let registrationToken = null

        if(res == 'granted') {
          registrationToken = await getToken(messaging, { vapidKey: 'BEZ5-G158ZnhpB0Xo7KhjEy54cn2s2bLopnCxfzl0AGNJo8W9KrKfkdxUPvM_FeBPc0mrVB4IMZDuhT24EEwyjI' })
        }
        
        if(registrationToken) {
          const functions = getFunctions()
          const saveToken = httpsCallable(functions, 'saveToken')
          await saveToken({
            uid: user.value.uid,
            token: registrationToken
          })
        }
      } catch (err) {
        console.log(err.message)
      }
    }

    const handleClick1 = () => {
      if(props.user) {
        router.push({ name: 'AskQuestion', params: { isbn: props.isbn, bookTitle: props.title }});
      } else if (!props.user) {
        dialog.value = true
      }
    }

    const handleClick2 = () => {
      if(props.user) {
        router.push({ name: 'AnswerQuestion', params:{ isbn: props.isbn, questionId: props.questionId, }})
      } else if (!props.user) {
        dialog.value = true
      }
    }

    const handleClick3 = () => {
      if(props.user) {
        context.emit('toggle-comment')
      } else if (!props.user) {
        dialog.value = true
      }
    }

    return { dialog, snackbar, snackbarText, handleSignIn, handleClick1, handleClick2, handleClick3, notificationDialog, requestPermission }
  }
}
</script>

<style>

</style>