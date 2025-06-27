<template>
  <div class="search-result">
    <v-container>
      <div v-if="searchInfo" class="mb-3">
        <!-- keyword & genre -->
        <div class="mb-3">
          <div>
            <span class="mr-2">ジャンル:</span>
            <v-chip variant="outlined" color="primary" v-if="genre.parent">{{ genre.parent }}</v-chip>
            <span class="mx-2" v-if="genre.parent">/</span>
            <v-chip class="mr-3" variant="outlined" color="info" v-if="genre.name">{{ genre.name }}</v-chip>
            <div class="d-inline-flex my-4"></div>
            <v-btn class=" my-4" size="small" variant="tonal" @click="$emit('change-genre')">ジャンルを変更する</v-btn>
            <div class="d-inline-flex my-4"></div>
          </div>
          <div>
            <span class="mr-2">キーワード:</span>
            <span class="font-weight-bold text-primary">{{ $route.query.keyword }}</span>
          </div>
        </div>

        <!-- count -->
        <div>
          <span>{{ searchInfo.first }}件～{{ searchInfo.last }}件 (全 {{ searchInfo.count }}件)</span>
        </div>

        <!-- sort toggle buttons -->
        <div class="d-flex justify-end mt-8 mb-2">
          <v-btn-toggle
            v-model="toggle"
            color="primary"
            mandatory
            variant="outlined"
            rounded="md"
            density="compact"
            class="my-2"
          >
            <v-btn value="standard" @click="changeSortType('standard')">おすすめ順</v-btn>
            <v-btn value="-releaseDate" @click="changeSortType('-releaseDate')">新しい順</v-btn>
            <v-btn value="reviewAverage" @click="changeSortType('reviewAverage')">評価順</v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <!-- error message -->
      <div v-if="error" class="text-error">{{ error }}</div>

      <!-- book list -->
      <BookList :books="books"/>
      
      <v-pagination
        v-if="books.length"
        :length="searchInfo.pageCount"
        v-model="currentPage"
        @update:modelValue="clickPageNum"
        class="my-2"
      ></v-pagination>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import BookList from '../components/BookList.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: { BookList },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const books = ref([]);
    const error = ref(null);
    const searchInfo = ref(null);
    const currentPage = ref(null);


    const searchBooks = async (keyword, booksGenreId, page, sortType) => {
      let url = encodeURI(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=1002080273936278920&keyword=${keyword}&booksGenreId=${booksGenreId}&sort=${sortType}&page=${page}`);

      if(!keyword) {
        url = encodeURI(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?applicationId=1002080273936278920&booksGenreId=${booksGenreId}&sort=${sortType}&page=${page}`);
      }

      try{
        error.value = null;
        const res = await axios.get(url);

        books.value = res.data.Items.map(data => {
          return {...data.Item, authorList: data.Item.author.split(/\/|、/).filter(Boolean)}
        });

        searchInfo.value = res.data
        currentPage.value = res.data.page

        if(!res.data.hits) {
          error.value = 'キーワード・ジャンルを変更して再度検索してみてください。'
        }
        
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
        searchInfo.value = null;
        currentPage.value = null;
      }
    }

    const genre = computed(() => {
      switch (route.query.booksGenreId) {
        // 全ジャンル
        case '001':
          return { name: null, parent: null }
        // 語学・学習参考書
        case '001002':
          return { name: '語学・学習参考書', parent: null }
        case '001002001':
          return { name: '語学学習', parent: '語学・学習参考書' }
        case '001002002':
          return { name: '語学辞書', parent: '語学・学習参考書' }
        case '001002003':
          return { name: '辞典', parent: '語学・学習参考書' }
        case '001002005':
          return { name: '語学関係資格', parent: '語学・学習参考書' }
        case '001002006':
          return { name: '学習参考書・問題集', parent: '語学・学習参考書' }
        case '001002007':
          return { name: 'その他', parent: '語学・学習参考書' }
        case '001002008':
          return { name: '図鑑・資料集', parent: '語学・学習参考書' }
        // 科学・技術
        case '001012':
          return { name: '科学・技術', parent: null }
        case '001012001':
          return { name: '自然科学全般', parent: '科学・技術' }
        case '001012002':
          return { name: '数学', parent: '科学・技術' }
        case '001012003':
          return { name: '物理学', parent: '科学・技術' }
        case '001012004':
          return { name: '化学', parent: '科学・技術' }
        case '001012005':
          return { name: '地学・天文学', parent: '科学・技術' }
        case '001012006':
          return { name: '生物学', parent: '科学・技術' }
        case '001012007':
          return { name: '植物学', parent: '科学・技術' }
        case '001012008':
          return { name: '動物学', parent: '科学・技術' }
        case '001012010':
          return { name: '工学', parent: '科学・技術' }
        case '001012011':
          return { name: '建築学', parent: '科学・技術' }
        case '001012016':
          return { name: 'その他', parent: '科学・技術' }
        // 医学・薬学・看護学・歯科学
        case '001028':
          return { name: '医学・薬学・看護学・歯科学', parent: null }
        case '001028001':
          return { name: '基礎医学', parent: '医学・薬学・看護学・歯科学' }
        case '001028002':
          return { name: '臨床医学一般', parent: '医学・薬学・看護学・歯科学' }
        case '001028003':
          return { name: '臨床医学内科系', parent: '医学・薬学・看護学・歯科学' }
        case '001028004':
          return { name: '臨床医学外科系', parent: '医学・薬学・看護学・歯科学' }
        case '001028005':
          return { name: '臨床医学専門科別', parent: '医学・薬学・看護学・歯科学' }
        case '001028006':
          return { name: '医学一般・社会医学', parent: '医学・薬学・看護学・歯科学' }
        case '001028007':
          return { name: '基礎看護学', parent: '医学・薬学・看護学・歯科学' }
        case '001028008':
          return { name: '臨床成人看護', parent: '医学・薬学・看護学・歯科学' }
        case '001028009':
          return { name: '臨床看護専門科別', parent: '医学・薬学・看護学・歯科学' }
        case '001028010':
          return { name: '臨床看護一般', parent: '医学・薬学・看護学・歯科学' }
        case '001028011':
          return { name: '看護学生向け', parent: '医学・薬学・看護学・歯科学' }
        case '001028012':
          return { name: '保健・助産', parent: '医学・薬学・看護学・歯科学' }
        case '001028013':
          return { name: '医療関連科学・技術', parent: '医学・薬学・看護学・歯科学' }
        case '001028014':
          return { name: '伝統医学・東洋医学', parent: '医学・薬学・看護学・歯科学' }
        case '001028015':
          return { name: '薬学', parent: '医学・薬学・看護学・歯科学' }
        case '001028016':
          return { name: '歯科医学', parent: '医学・薬学・看護学・歯科学' }
        case '001028017':
          return { name: '試験対策(資格試験別)', parent: '医学・薬学・看護学・歯科学' }
        case '001028018':
          return { name: '辞事典・白書・語学', parent: '医学・薬学・看護学・歯科学' }
        case '001028019':
          return { name: 'その他', parent: '医学・薬学・看護学・歯科学' }
        // 資格・検定
        case '001016':
          return { name: '資格・検定', parent: null }
        case '001016001':
          return { name: '看護・医療関係資格', parent: '資格・検定' }
        case '001016002':
          return { name: '法律関係資格', parent: '資格・検定' }
        case '001016003':
          return { name: 'ビジネス関係資格', parent: '資格・検定' }
        case '001016004':
          return { name: '宅建・不動産関係資格', parent: '資格・検定' }
        case '001016005':
          return { name: '食品・調理関係資格', parent: '資格・検定' }
        case '001016006':
          return { name: '教育・心理関係資格', parent: '資格・検定' }
        case '001016007':
          return { name: 'インテリア関係資格', parent: '資格・検定' }
        case '001016008':
          return { name: '介護・福祉関係資格', parent: '資格・検定' }
        case '001016009':
          return { name: '技術・建築関係資格', parent: '資格・検定' }
        case '001016010':
          return { name: '語学関係資格', parent: '資格・検定' }
        case '001016011':
          return { name: 'パソコン関係資格', parent: '資格・検定' }
        case '001016012':
          return { name: '旅行主任者', parent: '資格・検定' }
        case '001016013':
          return { name: 'カラーコーディネーター・色彩検定', parent: '資格・検定' }
        case '001016014':
          return { name: '数学検定', parent: '資格・検定' }
        case '001016015':
          return { name: '公務員試験', parent: '資格・検定' }
        case '001016016':
          return { name: '自動車免許', parent: '資格・検定' }
        case '001016017':
          return { name: 'その他', parent: '資格・検定' }
        // パソコン・システム開発
        case '001005':
          return { name: 'パソコン・システム開発', parent: null }
        case '001005001':
          return { name: 'ハードウェア', parent: 'パソコン・システム開発' }
        case '001005002':
          return { name: '入門書', parent: 'パソコン・システム開発' }
        case '001005003':
          return { name: 'インターネット・WEBデザイン', parent: 'パソコン・システム開発' }
        case '001005004':
          return { name: 'ネットワーク', parent: 'パソコン・システム開発' }
        case '001005005':
          return { name: 'プログラミング', parent: 'パソコン・システム開発' }
        case '001005006':
          return { name: 'アプリケーション', parent: 'パソコン・システム開発' }
        case '001005007':
          return { name: 'OS', parent: 'パソコン・システム開発' }
        case '001005008':
          return { name: 'デザイン・グラフィックス', parent: 'パソコン・システム開発' }
        case '001005009':
          return { name: 'ITパスポート', parent: 'パソコン・システム開発' }
        case '001005010':
          return { name: 'MOUS・MOT', parent: 'パソコン・システム開発' }
        case '001005011':
          return { name: 'パソコン検定', parent: 'パソコン・システム開発' }
        case '001005013':
          return { name: 'IT・eコマース', parent: 'パソコン・システム開発' }
        case '001005017':
          return { name: 'その他', parent: 'パソコン・システム開発' }
      }
    });

    // sort
    const toggle = ref('standard');

    const changeSortType = (SortType) => {
      router.push({
        name: 'SearchResult',
        query: {
          booksGenreId: route.query.booksGenreId,
          keyword: route.query.keyword,
          page: 1,
          sortType: SortType
        }
      })
    }

    onMounted(() => {
      searchBooks(route.query.keyword, route.query.booksGenreId, route.query.page, route.query.sortType);
      toggle.value = route.query.sortType
    });
    
    watch([() => route.query.booksGenreId, () => route.query.keyword,  () => route.query.page, () => route.query.sortType], () => {
      searchBooks(route.query.keyword, route.query.booksGenreId, route.query.page, route.query.sortType);
      toggle.value = route.query.sortType
    });

    onUnmounted(() => {
      context.emit('resetGenre')
    })

    const clickPageNum = (page) => {
      router.push({
        name: 'SearchResult',
        query: {
          booksGenreId: route.query.booksGenreId,
          keyword: route.query.keyword,
          page: page,
          sortType: route.query.sortType
        }
      });
    }

    return { books, searchInfo, error, currentPage, clickPageNum, genre, toggle, changeSortType }
  }
}
</script>

<style>

</style>