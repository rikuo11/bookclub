<template>
  <div class="book-list">
    <v-row>
      <v-col cols="12" v-for="book in books" :key="book.isnb">
        <v-card class="d-fle">
          <v-container class="pa-3">
          <v-row class="justify-starts">
            <v-col cols="4" sm="3" lg="2">
              <div class="pa-1">
                <router-link :to="{ name: 'BookDetails', params: { isbn: book.isbn }}">
                  <img :src="book.largeImageUrl" style="width: 100%; object-fit: contain;"/>
                </router-link>
              </div>
            </v-col>
            <v-col cols="8">
              <div>
                <!-- title -->
                <div v-if="header" class="text-h6 py-1">{{ book.title }}</div>

                <div
                  v-if="!header"
                  @click="$router.push({ name: 'BookDetails', params: { isbn: book.isbn }})"
                  class="cursor-pointer text-primary"
                >{{ book.title }}</div>

                
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
              </div>
            </v-col>
          </v-row>
        </v-container>
          
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["books", 'header'],
  setup(props, context) {
  }
};
</script>

<style>
</style>