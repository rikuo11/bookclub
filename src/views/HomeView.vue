<template>
  <div class="home">
    <!-- header -->
    <v-parallax height="600" :src="require('@/assets/images/header-image/header.jpg')">
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <!-- title -->
        <h1 class="text-h3 text-sm-h2 font-weight-thin mb-6">
          BookClub
        </h1>

        <!-- search box -->
        <div style="width: 600px; max-width: 80%;" class="mb-8">
          <v-text-field
            v-model="keyword"
            variant="solo"
            density="comfortable"
            hide-details
            label="書籍検索"
            prepend-inner-icon="mdi-magnify"
            @click:prepend-inner="searchByKeyword"
            @keydown.enter="searchByKeyword"
          >
            <template v-slot:append-inner>
               <v-btn
                variant="tonal"
                rounded="xs"
                @click="genreDialog = true"
               >ジャンル選択</v-btn>
            </template>  
          </v-text-field>

          <!-- genre info -->
          <div class="mt-4" v-if="genreName">
            <span class="mr-2">ジャンル:</span>
            <!-- genre -->
            <v-chip
              class="mr-2"
              variant="flat"
              color="primary"
              v-if="genreName"
            >
              {{ genreName }}
            </v-chip>

            <!-- subgenre -->
            <span class="mr-2" v-if="subGenreName">/</span>
            <v-chip
              class="mr-3"
              variant="flat"
              color="info"
              v-if="subGenreName"
            >
              {{ subGenreName }}
            </v-chip>
            <div class="d-inline-flex my-4"></div>

            <!-- rest genre -->
            <v-btn
              variant="flat"
              density="comfortable"
              color="red-accent-3"
              append-icon="mdi-close"
              @click="resetGenre"
            >
              リセット
            </v-btn>
            <div class="d-inline-flex my-4"></div>
          </div>
        </div>

        <!-- subtitle -->
        <h4 class="text-h5 text-sm-h4">
          本を検索して質問しよう！
        </h4>
      </div>
    </v-parallax>
    
    <!-- main -->
    <v-container>
      <div class="mb-3">
        <v-avatar class="mr-3 mb-1" color="warning" rounded="sm" size="small">
          <span>Q</span>
        </v-avatar>
        <span class="text-h6 font-weight-bold">最新の質問</span>
      </div>
      <!-- tag -->
      <div class="mb-2">
        <span class="mr-2">タグ:</span>
        <v-chip
          v-if="$route.query.tag"
          class="mr-2"
          variant="outlined"
          color="warning"
          closable
          @click:close="deleteTag(tag)"
        >
          {{ $route.query.tag }}
        </v-chip>
        <v-btn
          v-if="!isEditing"
          class="my-2"
          variant="tonal"
          size="small"
          @click="isEditing = true"
        >
          タグの編集
        </v-btn>
        <v-btn
          v-if="isEditing"
          class="my-2"
          variant="tonal"
          size="small"
          color="error"
          @click="isEditing = false"
        >
          キャンセル
        </v-btn>
        <div
          class="mt-2"
          v-if="isEditing"
          style="max-width:400px;"
        >
          <v-text-field
            variant="outlined"
            density="compact"
            v-model="newTag"
            label="タグを入力"
            color="primary"
            append-inner-icon="mdi-tag-edit"
            @click:append-inner="addTag"
            @keydown.enter="addTag"
          ></v-text-field>
        </div>
      </div>
      <!-- questions  -->
      <HomeQuestionList :questions="pageItems" @change-tag="changeTag" />
      <v-pagination
        v-if="questions.length"
        v-model="currentPage"
        :length="paginationLength"
        @update:modelValue="clickPageNum"
        class="my-2"
      ></v-pagination>
    </v-container>


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
                    <v-list-item-title class="font-weight-bold" @click="setGenre(genre.genreId, genre.genreName, null)">
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
                @click="setGenre(item.id, genre.genreName, item.name)"
              ></v-list-item>
            </v-list-group>
          </v-list>
        </v-card-item>  
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useCollection from '@/composables/useCollection';
import useGenreList from '@/composables/useGenreList';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HomeQuestionList from '@/components/HomeQuestionList.vue';
export default {
  components: { HomeQuestionList },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const { documents: questions, error, getDocuments } = useCollection('questions');

    const sortedQuestions = computed(() => {
      // newest
      return questions.value.sort((doc1, doc2) => {
        return doc2.createAt - doc1.createAt
      })
    })

    // pagination
    const page = ref(0)
    const currentPage = ref(1)
    const pageItems = computed(() => {
      return sortedQuestions.value.slice(page.value, page.value + 10)
    })

    const paginationLength = computed(() => {
      return Math.ceil(questions.value.length/10)
    })

    const clickPageNum = (num) => {
      router.push({
        name: 'Home',
        query: { page: num, tag: route.query.tag }
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

    // tag
    const isEditing = ref(false)
    const newTag = ref('')
    const addTag = () => {
      const text = newTag.value.replace(/\s+/g, "");

      if(text) {
        router.push({
          name: 'Home',
          query: { tag: newTag.value }
        })
      }

      isEditing.value = false;
      newTag.value = ''
    }
    const deleteTag = () => {
      router.push({
        name: 'Home',
      })
      isEditing.value = false;
    }

    const changeTag = (tag) => {
      router.push({
        name: 'Home',
        query: { tag: tag }
      })
    }

    watch(() => route.query.tag, () => {
      if(route.query.tag){
        getDocuments(30, [ 'tags', 'array-contains', route.query.tag ])
      } else {
        getDocuments(30);
      }
    })

    onMounted(() => {
      // pagination
      if(route.query.page) {
        page.value = (route.query.page - 1)*10
        currentPage.value = Number(route.query.page)
      } else { 
        page.value = 0
        currentPage.value = 1
      }

      // tag
      if(route.query.tag){
        getDocuments(90, [ 'tags', 'array-contains', route.query.tag ])
      } else { 
        getDocuments(90);
      }
    });

    // genreList
    const { genreList } = useGenreList();

    // search
    const keyword = ref(null)
    const booksGenreId = ref('001')
    const genreName = ref(null)
    const subGenreName = ref(null)
    const genreDialog = ref(false)

    const setGenre = (id, name1, name2) => {
      booksGenreId.value = id
      genreName.value = name1
      subGenreName.value = name2
      genreDialog.value = false
    }

    const resetGenre = () => {
      booksGenreId.value = '001'
      genreName.value = null
      subGenreName.value = null
    }

    const searchByKeyword = () => {
      // sync search info
      context.emit('syncSearchInfo', {
        keyword: keyword.value,
        booksGenreId: booksGenreId.value
      })

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

    return { page, pageItems, currentPage, paginationLength, clickPageNum, questions, newTag, addTag, isEditing, deleteTag, changeTag, keyword, booksGenreId, searchByKeyword, genreDialog, genreList, genreName, setGenre, subGenreName, resetGenre }
  }
}
</script>

<style>

</style>