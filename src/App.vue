<template>
  <v-app>
    <!-- app bar -->
    <Navbar ref="nav" />

    <!-- main -->
    <v-main>
      <router-view
        @key-change="changeKey"
        :key="componentKey"
        @reset-genre="resetGenre"
        @change-genre="changeGenre"
        @sync-search-info="syncSearchInfo"
       />
    </v-main>

    <!-- footer -->
    <v-footer class="bg-primary" absolute app>
      <div class="text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Book Club</strong>
      </div>
    </v-footer>
  </v-app>
</template>
<script>
import { onMounted, ref, watch } from 'vue';
import Navbar from './components/Navbar.vue'
import getUser from './composables/getUser';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
export default {
  components: { Navbar },
  setup() {
    const { user } = getUser()

    // main
    const componentKey = ref(0);
    const changeKey = () => {
      componentKey.value += 1
    }

    // navbar
    const nav = ref(null);
    const changeGenre = () => {
      nav.value.genreDialog = true
    }
    const resetGenre = () => {
      nav.value.keyword = null
      nav.value.booksGenreId = '001'
    }
    const syncSearchInfo = (data) => {
      nav.value.keyword = data.keyword
      nav.value.booksGenreId = data.booksGenreId
    }

    // firebase messaging
    const messaging = getMessaging();

    getToken(messaging, { vapidKey: 'BEZ5-G158ZnhpB0Xo7KhjEy54cn2s2bLopnCxfzl0AGNJo8W9KrKfkdxUPvM_FeBPc0mrVB4IMZDuhT24EEwyjI' })
    .then(currentToken => {
      console.log(currentToken)
    })
    .catch(err => {
      console.log(err.message)
    })
  
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });


    return { changeKey, componentKey, nav, changeGenre, resetGenre, syncSearchInfo }
  },
}
</script>
<style lang="scss">
  // editor
  .tiptap {
    > * + * {
      margin-top: 0.75em;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 4px solid rgba(103, 80, 164, 0.7);
    }

    ul, ol {
      padding: 0 1rem;
    }

    pre {
      background: #0D0D0D;
      color: #FFF;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }

    }
    iframe {
      border: 8px solid #000;
      border-radius: 4px;
      min-width: 200px;
      min-height: 200px;
      display: block;
      outline: 0px solid transparent;
      aspect-ratio: 4 / 3;
    }

    div[data-youtube-video] {
      cursor: move;
      padding-right: 24px;
    }
  }
  .ProseMirror:focus {
    outline: none;
  }
  /* Basic editor styles */
  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
    }

    .Tiptap-mathematics-editor {
      background: #202020;
      color: #fff;
      font-family: monospace;
      padding: 0.2rem 0.5rem;
    }

    .Tiptap-mathematics-render {
      cursor: pointer;
      padding: 0 0.25rem;
      transition: background 0.2s;
      max-width: 100%;
      overflow-y: hidden;
      overflow-x: auto;

      &:hover {
        background: #eee;
      }
    }

    .Tiptap-mathematics-editor,
    .Tiptap-mathematics-render {
      border-radius: 0.25rem;
      display: inline-block;
    }
  }
  .editor-md {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    min-height: 200px;
  }
  .editor-sm {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    min-height: 150px;
    word-break: break-all;
  }
</style>
