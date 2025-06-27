<template>
  <div class="author-details">
    <!-- navbar -->
    <div class="author-details-navbar pa-3">
      <nav>
        <v-avatar
          color="grey-lighten-2"
          class="mr-3"
          size="large"
        >
          <v-icon icon="mdi-account-circle-outline"></v-icon>
        </v-avatar>
        <span class="mr-3 font-weight-bold">{{ author }}</span>
        <v-btn-toggle
          v-model="toggle"
          rounded="0"
          color="primary"
          mandatory
        >
          <v-btn>本</v-btn>
          <v-btn>著者</v-btn>
        </v-btn-toggle>
      </nav>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- content -->
    <div class="author-details-content">
      <v-container class="pb-16">
        <!-- books -->
        <div v-show="toggle == 0">
          <div class="mb-3">
            <div>
              <span>著者名:</span>
              <span class="font-weight-bold text-primary mr-1">「{{ author }}」</span>
              <span>上位３０件の検索結果</span>
            </div>
          </div>
          <div v-if="error" class="text-error">{{ error }}</div>
          <BookList :books="books"/>
        </div>

        <!-- author info -->
        <div v-show="toggle == 1">
          <v-skeleton-loader
            v-show="isLoading"
            type="article"
          ></v-skeleton-loader>
          <div class="gemini-container" v-show="authorDetails" ref="detailsRef"></div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue';
import BookList from '../components/BookList.vue'
import { useRoute } from 'vue-router';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase/config.js'
export default {
  props: ['author'],
  components: { BookList },
  setup(props) {
    const authorDetails = ref('')
    const toggle = ref(0)
    const detailsRef = ref(null);
    const isLoading = ref(null);

    const books = ref([]);
    const error = ref(null);
    const route = useRoute();

    const searchByAuthor = async (author) => {
      const url = encodeURI(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=1002080273936278920&author=${author}&page=1`);

      try{
        error.value = null;
        const res = await axios.get(url);

        books.value = res.data.Items.map(data => {
          return {...data.Item, authorList: data.Item.author.split(/\/|、/).filter(Boolean)}
        });
      } catch (err) {
        console.log(err.message);
        switch (err.response.request.status) {
          case 400:
            error.value = 'キーワードを正しく入力してください。'
            break;
          case 429:
            error.value = 'しばらく時間を空けてご利用ください。'
            break;
          case 503: 
            error.value = 'しばらく時間を空けてご利用ください。'
            break;
          default:
            error.value = '予期せぬエラーが発生しました。'
        }
        books.value = [];
      }
    }

    // gemini
    const createText = httpsCallable(functions, 'createText')

    onMounted(async () => {
      searchByAuthor(props.author);

      // create text by gemini
      try {
        authorDetails.value = ''
        isLoading.value = true;

        const res = await createText({
          title: route.query.title,
          author: route.params.author
        })

        isLoading.value = false;
        authorDetails.value = res.data
        detailsRef.value.innerHTML = authorDetails.value
      } catch(err) {
        console.log(err.message)
        isLoading.value = false;
      }
    });

    watch([() => route.params.author, () => route.query.title], async () => {
      searchByAuthor(route.params.author);

      // create text by gemini
      try {
        authorDetails.value = ''
        isLoading.value = true;

        const res = await createText({
          title: route.query.title,
          author: route.params.author
        })

        isLoading.value = false;
        authorDetails.value = res.data
        detailsRef.value.innerHTML = authorDetails.value
      } catch(err) {
        console.log(err.message)
        isLoading.value = false;
      }
    });

    return { authorDetails, toggle, detailsRef, books, error, isLoading }
  }
}
</script>

<style scoped>
  .author-details-navbar nav {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>