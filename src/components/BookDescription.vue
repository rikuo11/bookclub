<template>
  <div class="book-description">
    <v-card>
      <v-container class="pa-3">
        <v-row class="justify-center ga-2">

          <v-col cols="6" sm="4" md="4" lg="3">
            <a class="text-h6" :href="book.itemUrl" target="_blank">
              <img :src="book.largeImageUrl" style="width: 100%; object-fit: contain;" class="py-4 px-1"/>
            </a>
          </v-col>

          <v-col cols="12" sm="7" md="7" lg="8" class="px-5 pb-5">
            <v-tabs
              v-model="tab"
              class="mb-8"
            >
              <v-tab :value="1">基本情報</v-tab>
              <v-tab :value="2">説明</v-tab>
            </v-tabs>

            <div v-show="tab == 1" class="mb-7">
              <!-- title -->
              <a :href="book.itemUrl" target="_blank">{{ book.title }}</a>

              <!-- info -->
              <div class="text-subtitle-2 text-medium-emphasis mt-2">
                <div v-if="book.authorList.length">
                  著者:
                  <div
                    v-for="author in book.authorList"
                    :key="author"
                    class="d-inline">
                    <router-link :to="{ name: 'AuthorDetails', params: { author: author }, query: { title: book.title }}">{{ author }}</router-link>
                    <span>,</span>
                  </div>
                </div>
                <div class="mt-1">出版社:{{ book.publisherName }}</div>
                <div class="mt-1">発売日:{{ book.salesDate }}</div>               
              </div>

              <!-- rating -->
              <div class="d-flex align-center">
                <span class="mt-2 mr-2">{{ book.reviewAverage }}</span>
                <v-rating
                  v-model="book.reviewAverage"
                  active-color="orange-lighten-1"
                  color="orange-lighten-1"
                  size="20"
                  :disabled="true"
                ></v-rating>
                
              </div>
              <a :href="book.itemUrl" target="_blank" class="text-subtitle-2">{{ book.reviewCount }}件のレビューを見る</a>
            </div>

            <!-- description -->
            <div v-show="tab == 2" class="mb-7">
              <v-skeleton-loader
                v-show="isLoading"
                type="article"
              ></v-skeleton-loader>
              <div v-show="authorDetails" ref="detailsRef"></div>
            </div>
          </v-col>
        </v-row>
      </v-container>    
    </v-card>
  </div>
</template>

<script>
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase/config.js'
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
export default {
  props: ['book'],
  setup(props) {
    const tab = ref(1)

    const authorDetails = ref('')
    const detailsRef = ref(null);
    const isLoading = ref(null);
    
    const route = useRoute()

    // gemini
    const createText = httpsCallable(functions, 'createText')

    onMounted(async () => {
      // create text by gemini
      try {
        authorDetails.value = ''
        isLoading.value = true;

        const res = await createText({
          title: props.book.title,
          author: props.book.author
        })

        isLoading.value = false;
        authorDetails.value = res.data
        detailsRef.value.innerHTML = authorDetails.value
      } catch(err) {
        console.log(err.message)
        isLoading.value = false;
      }
    });

    watch([() => route.params.isbn], async () => {
      // create text by gemini
      try {
        authorDetails.value = ''
        isLoading.value = true;

        const res = await createText({
          title: props.book.title,
          author: props.book.author
        })

        isLoading.value = false;
        authorDetails.value = res.data
        detailsRef.value.innerHTML = authorDetails.value
      } catch(err) {
        console.log(err.message)
        isLoading.value = false;
      }
    });


    return { tab, authorDetails, isLoading, detailsRef }
  }

}
</script>

<style>

</style>