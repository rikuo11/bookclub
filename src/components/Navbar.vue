<template>
  <div>
    <v-app-bar
      color="white"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
          class="d-none d-sm-flex"
        ></v-app-bar-nav-icon>
        <div class="d-none d-sm-flex align-center ga-2 mx-4 cursor-pointer" @click="toHome">
          <v-img
            :width="40"
            aspect-ratio="1/1"
            :src="require('@/assets/images/logo/logo3.png')"
          ></v-img>
          <div class="font-weight-bold text-h6">BookClub</div>
        </div>

        <!-- for mobile phone -->
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
          class="d-sm-none"
          v-if="toggle == false"
        ></v-app-bar-nav-icon>
        <div
          class="d-flex d-sm-none align-center ga-2 mx-4 cursor-pointer"
          v-if="toggle == false"
          @click="toHome">
          <v-img
            :width="40"
            aspect-ratio="1/1"
            :src="require('@/assets/images/logo/logo3.png')"
          ></v-img>
          <div class="font-weight-bold text-h6">BookClub</div>
        </div>
      </template>

      <!-- search box -->
      <div style="width: 700px; margin: auto;" class="d-none d-sm-flex">
        <v-text-field
          variant="outlined"
          density="compact"
          hide-details
          v-model="keyword"
          label="書籍検索"
          append-inner-icon="mdi-magnify"
          @click:append-inner="searchByKeyword"
          @keydown.enter="searchByKeyword">
        </v-text-field>
      </div>

      <!-- search box for mobile phone -->
      <v-btn
        variant="tonal"
        icon="mdi-arrow-right"
        size="small"
        class="mr-3 d-sm-none"
        @click="toggle = false"
        v-if="toggle"
      ></v-btn>
      <div style="width: 500px; margin: auto;" class="d-sm-none" v-if="toggle">
        <v-text-field
          variant="outlined"
          density="compact"
          hide-details
          v-model="keyword"
          label="書籍検索"
          append-inner-icon="mdi-magnify"
          @click:append-inner="searchByKeyword"
          @keydown.enter="searchByKeyword">
        </v-text-field>
      </div>

      <template v-slot:append>
        <div v-if="user" class="mx-6 d-flex">
          <!-- toggle button for search box -->
          <v-btn
            variant="tonal"
            icon="mdi-magnify"
            size="small"
            class="mr-3 d-sm-none"
            @click="toggle = true"
            v-if="toggle == false"
          ></v-btn>

          <!-- user menu -->
          <v-menu transition="slide-y-transition">
            <template v-slot:activator="{ props }">
              <v-badge color="red-accent-4" :content="notificationsNum" v-model="badge">
                <v-avatar v-bind="props" class="cursor-pointer">
                  <v-img :src="user.photoURL"></v-img>
                </v-avatar>
              </v-badge>
            </template>

            <v-card min-width="280" rounded="true">
              <v-list>
                <v-list-item
                  :title="user.displayName"
                >
                  <template v-slot:prepend>
                    <v-avatar>
                      <v-img :src="user.photoURL"></v-img>
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item :to="{ name: 'UserInfo', params: { uid: user.uid }}">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-account"></v-icon>
                  </template>
                  <v-list-item-title>マイページ</v-list-item-title>
                </v-list-item>
                <v-list-item @click="notificationsDialog = true">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-bell-ring"></v-icon>
                  </template>
                  <v-list-item-title>通知</v-list-item-title> 
                  <template v-slot:append>
                    <v-badge
                      color="red-accent-4"
                      :content="notificationsNum"
                      v-model="badge"
                      inline
                    ></v-badge>
                  </template>
                </v-list-item>
                <v-list-item @click="handleLogOut">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-logout"></v-icon>
                  </template>
                  <v-list-item-title>ログアウト</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>

        <div v-if="!user" class="mx-6 d-flex">
          <!-- toggle button for search box -->
          <v-btn
            variant="tonal"
            icon="mdi-magnify"
            size="small"
            class="mr-3 d-sm-none"
            @click="toggle = true"
            v-if="toggle == false"
          ></v-btn>

          <!-- login button -->
          <v-btn
            variant="tonal"
            icon="mdi-login"
            size="small"
            @click="dialog = true"
          ></v-btn>
        </div>
      </template>

    </v-app-bar>
    
    <!-- navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="true"
    > 
      <v-list>
        <v-list-item :to="{ name: 'Home' }">
          <template v-slot:prepend>
            <v-icon icon="mdi-home"></v-icon>
          </template>
          <v-list-item-title>ホーム</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-if="user">
        <v-list-subheader>アカウント</v-list-subheader>
        <v-list-item :to="{ name: 'UserInfo', params: { uid: user.uid }}">
          <template v-slot:prepend>
            <v-icon icon="mdi-account"></v-icon>
          </template>
          <v-list-item-title>マイページ</v-list-item-title>
        </v-list-item>
        <v-list-item @click="notificationsDialog = true">
          <template v-slot:prepend>
            <v-icon icon="mdi-bell-ring"></v-icon>
          </template>
          <v-list-item-title>通知</v-list-item-title> 
          <template v-slot:append>
            <v-badge
              color="red-accent-4"
              :content="notificationsNum"
              v-model="badge"
              inline
            ></v-badge>
          </template>
        </v-list-item>
      </v-list>
      <!-- <v-list>
        <v-list-subheader>ランキング</v-list-subheader>
        <v-list-item link title="日間"></v-list-item>
        <v-list-item link title="週間"></v-list-item>
        <v-list-item link title="月間"></v-list-item>
      </v-list> -->
    </v-navigation-drawer>

    <!-- genre dialog -->
    <v-dialog
      v-model="genreDialog"
      width="auto"
    >
      <v-card>
        <v-card-item>
          <div style="width: 600px;">
            <v-icon icon="mdi-bookshelf" class="mr-3 mb-1" color="primary"></v-icon>
            <span class="text-h6">ジャンル変更</span>
          </div>

          <v-divider class="mt-2 mb-4"></v-divider>

          <v-list density="compact">
            <v-list-subheader>本のジャンル</v-list-subheader>
            <v-list-group v-for="genre in genreList" :key="genre.genreId" :value="genre.genreId">
              <template v-slot:activator="{ props, isOpen }">
                <v-list-item>
                  <template v-slot:default>
                    <v-list-item-title class="font-weight-bold" @click="searchByGenre(genre.genreId)">
                      {{ genre.genreName }}
                    </v-list-item-title>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      v-bind="props"
                      color="grey-lighten-1"
                      :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                      variant="text"
                    ></v-btn>
                  </template>
                </v-list-item>
              </template>
              <v-list-item
                v-for="item in genre.subGenres" :key="item.id"
                :title="item.name"
                :value="item.id"
                @click="searchByGenre(item.id)"
              ></v-list-item>
            </v-list-group>
          </v-list>
        </v-card-item>  
      </v-card>
    </v-dialog>

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

    <!-- notifications permission dialog -->
    <v-dialog
      v-model="notificationsPermissionDialog"
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
              <v-btn variant="tonal" color="error" width="150" @click="notificationsPermissionDialog = false">キャンセル</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>

    <!-- notifications dialog -->
    <v-dialog
      v-model="notificationsDialog"
      width="auto"
    >
      <v-card max-width="600">
        <v-card-item>
          <div style="width: 500px;">
            <v-icon icon="mdi-bell-ring" class="mr-3 mb-1" color="primary"></v-icon>
            <span class="text-h6">通知</span>
          </div>
          <v-divider class="mt-2 mb-4"></v-divider>
          <v-list v-if="notifications.length" class="mb-2">
            <v-list-item
              v-for="notification in notifications" :key="notification.id"
              :to="{ name: 'QuestionDetails', params: { isbn: notification.isbn, id: notification.documentId }}"
              @click="clickNotification(notification.id, notification.isNotified)"
              class="pa-3 mb-1"
            >
              <template v-slot:append>
                <v-badge v-if="notification.isNotified == false" dot color="success"></v-badge>
              </template>
              <div class="text-body-2 mb-1 font-weight-medium">{{ notification.title }}</div>
              <div class="text-body-2 mb-2">{{ notification.answererName }}さんが回答しました</div>
              <div class="text-subtitle-2 text-medium-emphasis">{{ timeDistanceFromNow(notification.createAt) }}前</div>
            </v-list-item>
          </v-list>
          <div v-else class="my-5 d-flex flex-column ga-3 align-center">
            <v-img :width="200" :src="require('@/assets/images/icons/no-notification.png')"></v-img>
            <div>
              <span class="text-h6 text-medium-emphasis my-3">通知はありません</span>
            </div>
            <v-img></v-img>
          </div>
        </v-card-item>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import getUser from '../composables/getUser'
import useCollection from '../composables/useCollection'
import useGenreList from '@/composables/useGenreList'
import { auth, provider, db } from '../firebase/config'
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { serverTimestamp } from 'firebase/firestore'
import { getMessaging, getToken } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
export default {
  setup(props, context) {
    const { user } = getUser()
    const router = useRouter()

    // app bar
    const booksGenreId = ref('001')
    const keyword = ref(null)

    const searchByKeyword = () => {
      const encodedKeyword = encodeURIComponent(keyword.value);
      router.push({
        name: 'SearchResult',
        query: {
          booksGenreId: booksGenreId.value,
          keyword: keyword.value,
          page: 1,
          sortType: 'standard'
        }
      })
    }
    
    const searchByGenre = (id) => {
      booksGenreId.value = id
      const encodedKeyword = encodeURIComponent(keyword.value);
      router.push({
        name: 'SearchResult',
        query: {
          booksGenreId: booksGenreId.value,
          keyword: keyword.value,
          page: 1,
          sortType: 'standard'
        }
      })
      genreDialog.value = false
    }

    // navigation drawer
    const drawer = ref(false)
    const open = ref(['001002'])

    // genreList
    const { genreList } = useGenreList();

    // sigin in
    const dialog = ref(false);
    const notificationsPermissionDialog = ref(false)
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
        notificationsPermissionDialog.value = true

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

    // sigin out
    const handleLogOut = async () => {
      try {
        await signOut(auth)
        snackbarText.value = 'ログアウトしました'
        snackbar.value = true;

        // delete token saved in firestore
        const messaging = getMessaging();
        let registrationToken = null
        registrationToken = await getToken(messaging, { vapidKey: 'BEZ5-G158ZnhpB0Xo7KhjEy54cn2s2bLopnCxfzl0AGNJo8W9KrKfkdxUPvM_FeBPc0mrVB4IMZDuhT24EEwyjI' })

        if(registrationToken) {
          const functions = getFunctions()
          const deleteToken = httpsCallable(functions, 'deleteToken')
          await deleteToken({
            token: registrationToken
          })
        }

        router.push({ name: 'Home' })
      } catch (err) {
        console.log(err.message);
        router.push({ name: 'Home' })
      }    
    }

    // request notification permission & send registration token to firestore
    const requestPermission = async () => {
      try {
        notificationsPermissionDialog.value = false

        const res = await Notification.requestPermission()
        const messaging = getMessaging();
        let registrationToken = null

        if(res == 'granted') {
          registrationToken = await getToken(messaging, {
            vapidKey: 'BEZ5-G158ZnhpB0Xo7KhjEy54cn2s2bLopnCxfzl0AGNJo8W9KrKfkdxUPvM_FeBPc0mrVB4IMZDuhT24EEwyjI'
          })
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

    // notification in the foreground
    const notifications = ref([])
    let unsub = () => {}
    let q

    watch(
      user, 
      () => {
        if(user.value) {
          q = query(collection(db, 'notifications'), where('uid', '==', user.value.uid), orderBy('createAt'))
          unsub = onSnapshot(q, snap => {
            let results = [];
            snap.docs.forEach(doc => {
                doc.data().createAt && results.push({ ...doc.data(), id: doc.id })
            })

            notifications.value = results
          }, err => {
              console.log(err.message);
              notifications.value = [];
          })
        } else {
          notifications.value = []
          unsub()
          q = null
        }
      },
      { immediate: true }
    )

    const notificationsNum = computed(() => {
      let num = 0
      notifications.value.forEach(doc => {
        if(!doc.isNotified) {
          num += 1
        }
      });
      return num
    })

    const badge = ref(false)

    watch(
      notificationsNum, 
      () => {
        if(notificationsNum.value == 0) {
          badge.value = false
        } else {
          badge.value =  true
        }
      },
      { immediate: true }
    )

    // notifications list
    const notificationsDialog = ref(false)
    const clickNotification = async (id, isNotified) => {
      if(isNotified == false){
        try {
          await updateDoc(doc(db, 'notifications', id), { isNotified: true })
        } catch(err) {
          console.log(err)
        }
      }
      notificationsDialog.value = false
    }

    // date
    const timeDistanceFromNow = (timestamp) => {
      return formatDistanceToNow(timestamp.toDate(), { locale: ja })  
    }

    // search box for mobile phone 
    const toggle = ref(false);

    const toHome = () => {
      router.push({ name: 'Home' })
    }

    // genre dialog
    const genreDialog = ref(false)


    return { keyword, booksGenreId, searchByKeyword, user, handleLogOut, handleSignIn, dialog, snackbar, snackbarText, drawer, open, searchByGenre, genreList, toHome, toggle, notificationsPermissionDialog, requestPermission, notifications, notificationsNum, badge, notificationsDialog, timeDistanceFromNow, clickNotification, genreDialog }
  }
}
</script>

<style>
  nav {
    max-width: 1200px;
    margin: 0 auto;
  }
  .v-toolbar__prepend {
    margin-inline: 10px 10px;
  }
</style>