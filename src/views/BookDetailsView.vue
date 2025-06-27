<template>
  <div class="book-details" v-if="books.length">
    <v-container>
      <!-- description -->
      <BookDescription :book="books[0]" />
      
      <!-- button -->
      <Button :user="user" :isbn="books[0].isbn" :title="books[0].title">
        <template v-slot:question-button="{ handleClick }">
          <div class="d-flex justify-center pa-1 my-7">
            <v-btn
              size="x-large"
              width="350"
              rounded="md"
              density="comfortable"
              prepend-icon="mdi-chat-question"
              @click="handleClick"
            >質問する</v-btn>
          </div>
        </template>
      </Button>

      <!-- number of questions -->
      <div class="mb-3">
        <v-avatar class="mr-2 mb-1" color="warning" rounded="sm" size="small">
          <span>Q</span>
        </v-avatar>
        <div class="d-inline text-h6 font-weight-bold">質問（{{ questions.length }}件）</div>
      </div>

      <!-- questions -->
      <QuestionList :questions="pageItems" />
      
      <v-pagination
        v-if="questions.length"
        v-model="currentPage"
        :length="paginationLength"
        @update:modelValue="clickPageNum"
        class="my-2"
      ></v-pagination>

    </v-container>

  </div>
</template>

<script>
import getCollection from '@/composables/getCollection';
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue';
import BookDescription from '@/components/BookDescription.vue'
import Button from '@/components/Button.vue';
import QuestionList from '@/components/QuestionList.vue';
import { useRoute, useRouter } from 'vue-router';
import getUser from '@/composables/getUser';
export default {
  props:['isbn'],
  components: { BookDescription, QuestionList, Button },
  setup(props, context) {
    const books = ref([]);
    const searchError = ref(null);
    const route = useRoute(); 
    const router = useRouter();

    const { documents: questions } = getCollection('questions', ['isbn', '==', props.isbn]);
    const { user } = getUser()

    const searchByIsbn = async (author) => {
      const url = encodeURI(`https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?applicationId=1002080273936278920&isbn=${props.isbn}`);

      try{
        searchError.value = null;
        const res = await axios.get(url);

        books.value = res.data.Items.map(data => {
          return {...data.Item, authorList: data.Item.author.split(/\/|、/).filter(Boolean)}
        });
      } catch (err) {
        console.log(err.message);
        switch (err.response.request.status) {
          case 400:
            searchError.value = '図書番号を正しく入力してください。'
            break;
          case 429:
            searchError.value = 'しばらく時間を空けてご利用ください。'
            break;
          case 503: 
            searchError.value = 'しばらく時間を空けてご利用ください。'
            break;
          default:
            searchError.value = '予期せぬエラーが発生しました。'
        }

        books.value = [];
      }
    }

    watch(() => route.params.isbn, () => {
      context.emit('key-change');
    });
    
    // pagination
    const page = ref(0)
    const currentPage = ref(1)
    const pageItems = computed(() => {
      return questions.value.slice(page.value, page.value + 10)
    })

    const paginationLength = computed(() => {
      return Math.ceil(questions.value.length/10)
    })

    const clickPageNum = (num) => {
      router.push({
        name: 'BookDetails',
        params: { isbn: props.isbn },
        query: { page: num }
      })
    }

    watch(() => route.query.page, () => {
      if(route.query.page) {
        page.value = (route.query.page - 1)*10
        currentPage.value = Number(route.query.page)
      } else { 
        page.value = 0
        currentPage.value = 1
      }
    });

    onMounted(() => {
      searchByIsbn(props.isbn);
      if(route.query.page) {
        page.value = (route.query.page - 1)*10
        currentPage.value = Number(route.query.page)
      } else { 
        page.value = 0
        currentPage.value = 1
      }
    });
    
    return { books, searchError, questions, paginationLength, pageItems, page, clickPageNum, currentPage, user }
  }
}
</script>

<style>

</style>