<template>
  <div class="list-items">
    <!-- question/answer info-->
    <v-card
      class="d-flex pa-2 mb-2 mx-auto justify-space-evenly"
      width="300"
      color="primary"
      variant="outlined"
      v-if="tab != 'follow'"
    >
      <div>
        <v-icon class="mr-1" icon="mdi-chat-question-outline" color="info"></v-icon>
        <span>投稿数</span><br>
        <span>{{ documents.length }}</span>
      </div>
      <div>
        <v-icon class="mr-1" icon="mdi-thumb-up-outline" color="info"></v-icon>
        <span>評価</span><br>
        <span>{{ reputation }}</span>
      </div>
    </v-card>

    <!-- follow info-->
    <v-card
      class="d-flex pa-2 mb-2 mx-auto justify-center"
      width="200"
      color="primary"
      variant="outlined"
      v-if="tab == 'follow'"
    >
      <div>
        <v-icon class="mr-1" icon="mdi-bookmark-check-outline" color="info"></v-icon>
        <span>フォロー数</span><br>
        <span>{{ documents.length }}</span>
      </div>
    </v-card>

    <!-- sort toggle buttons -->
    <div class="d-flex justify-end mt-8 mb-2" v-if="documents.length">
      <v-btn-toggle
        v-model="toggle"
        color="primary"
        mandatory
        variant="outlined"
        rounded="md"
        density="compact"
        class="my-2"
      >
        <v-btn value="newest" @click="changeSortType('newest')">新しい順</v-btn>
        <v-btn value="oldest" @click="changeSortType('oldest')">古い順</v-btn>
        <v-btn value="bookTitle" @click="changeSortType('bookTitle')">書籍別</v-btn>
      </v-btn-toggle>
    </div>

    <v-row v-if="documents.length">
      <v-col cols="12" v-for="document in pageItems" :key="document.id">
        <v-card class="d-flex">
          <div class="align-self-center ml-4">
            <v-avatar v-if="!document.answerer" color="warning" rounded="sm" size="x-small">
              <span class="text-subtitle-2">Q</span>
            </v-avatar>
            <v-avatar v-if="document.answerer" color="info" rounded="sm" size="x-small">
              <span class="text-subtitle-2">A</span>
            </v-avatar>
          </div>
          <v-card-item style="max-width:90%;">
            <!-- question -->
            <div v-if="!document.answerer">
              <!-- title -->
              <div
                @click="$router.push({ name: 'QuestionDetails', params: { isbn: document.isbn, id: document.id }})"
                class="cursor-pointer text-primary py-2"
              >{{ document.title }}</div>

              <!-- book title -->
              <div class="text-primary text-subtitle-2">
                <v-icon icon="mdi-book-open-variant-outline" color="info" class="mr-1 mb-1"></v-icon>
                <router-link
                  :to="{ name: 'BookDetails', params: { isbn: document.isbn }}"
                >{{ document.bookTitle }}</router-link>
              </div>

              <!-- info -->
              <div class="mb-2 mt-1 text-subtitle-2 text-medium-emphasis">
                <v-icon icon="mdi-comment-processing-outline" color="info" class="mr-1"></v-icon>
                <span class="mr-2">{{ document.numberOfAnswers }}</span>
                <v-icon icon="mdi-thumb-up-outline" color="info" class="mr-1 mb-1"></v-icon>
                <span class="mr-2">{{ vote(document) }}</span>
                <router-link
                  class="mr-1 text-primary"
                  :to="{ name: 'UserInfo', params: { uid: document.questioner }}"
                >{{ document.displayName }}
                </router-link>
                <span>{{ formatTimestamp(document.createAt) }}</span>
              </div>
            </div>

            <!-- answer -->
            <div v-if="document.answerer">
              <!-- title -->
              <div
                @click="$router.push({ name: 'QuestionDetails', params: { isbn: document.isbn, id: document.questionId }})"
                class="cursor-pointer text-primary py-2"
              >{{ document.questionTitle }}</div>

              <!-- book title -->
              <div class="text-primary text-subtitle-2">
                <v-icon icon="mdi-book-open-variant-outline" color="info" class="mr-1 mb-1"></v-icon>
                <router-link
                  :to="{ name: 'BookDetails', params: { isbn: document.isbn }}"
                >{{ document.bookTitle }}</router-link>
              </div>

              <!-- info -->
              <div class="mb-2 mt-1 text-subtitle-2 text-medium-emphasis">
                <v-icon icon="mdi-comment-processing-outline" color="info" class="mr-1"></v-icon>
                <span class="mr-2">{{ document.numberOfReplies }}</span>
                <v-icon icon="mdi-thumb-up-outline" color="info" class="mr-1 mb-1"></v-icon>
                <span class="mr-2">{{ vote(document) }}</span>
                <router-link
                  class="mr-1 text-primary"
                  :to="{ name: 'UserInfo' , params: { uid: document.answerer }}"
                >{{ document.displayName }}
                </router-link>
                <span>{{ formatTimestamp(document.createAt) }}</span>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-pagination
      v-if="documents.length"
      v-model="currentPage"
      :length="paginationLength"
      @update:modelValue="clickPageNum"
      class="my-4"
    ></v-pagination>

    <!-- no documents -->
    <div v-if="!documents.length" class="mt-8 mb-16">
      <div v-if="tab == 'question'">
        <p class="text-medium-emphasis">質問がありません。</p>
      </div>
      <div v-if="tab == 'answer'">
        <p class="text-medium-emphasis">回答がありません。</p>
      </div>
      <div v-if="tab == 'follow'">
        <p class="text-medium-emphasis">フォローした投稿がありません。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  props:['documents', 'uid', 'tab'],
  setup(props) {
    const page = ref(0);
    const currentPage = ref(1);
    const route = useRoute();
    const router = useRouter();

    // page
    const pageItems = computed(() => {
      return sortedDocuments.value.slice(page.value, page.value + 10)
    })

    const paginationLength = computed(() => {
      return Math.ceil(props.documents.length/10)
    })

    const clickPageNum = (num) => {
      router.push({
        name: 'UserInfo',
        params: { uid: props.uid },
        query: { tab: props.tab, sort: sortType.value, page: num, },
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

    // sort
    const sortType = ref('newest')
    const toggle = ref('newest');

    watch(() => route.query.sort, () => {
      if(route.query.sort) {
        sortType.value = route.query.sort
        toggle.value = route.query.sort
      } else { 
        sortType.value = 'newest'
        toggle.value = 'newest'
      }
    })

    const changeSortType = (type) => {
      router.push({
        name: 'UserInfo',
        params: { uid: props.uid },
        query: { tab: props.tab, sort: type, page: 1 }})
    }

    const sortedDocuments = computed(() => {
      return props.documents.sort((doc1, doc2) => {
        switch (sortType.value) {
          case 'newest':
            return doc2.createAt - doc1.createAt
          case 'oldest':
            return doc1.createAt - doc2.createAt
          case 'bookTitle':
            return compareString(doc2.bookTitle, doc1.bookTitle)
          default:
            return doc1.createAt - doc2.createAt
        }
      })
    })

    const compareString = (str1, str2) => {
      if(str1 == str2) {
        return 0
      } else if (str1 > str2) {
        return 1
      } else {
        return -1
      }
    }

    onMounted(() => {
      if(route.query.page) {
        page.value = (route.query.page - 1)*10
        currentPage.value = Number(route.query.page)
      } else { 
        page.value = 0
        currentPage.value = 1
      }

      if(route.query.sort) {
        sortType.value = route.query.sort
        toggle.value = route.query.sort
      } else { 
        sortType.value = 'newest'
        toggle.value = 'newest'
      }
    })

    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    const vote = (document) => {
      return document.like.length + -1*document.dislike.length
    }

    const reputation = computed(() => {
      let num = 0

      props.documents.forEach(document => {
        num += vote(document)
      });
      return num
    })

    return { formatTimestamp, vote, currentPage, pageItems, clickPageNum, paginationLength, reputation, toggle, changeSortType }
  }
}
</script>

<style>

</style>