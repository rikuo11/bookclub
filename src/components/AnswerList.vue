<template>
  <div class="answer-list">
    <!-- number of answers -->
    <div class="mb-3">
      <v-avatar class="mr-2 mb-1" color="info" rounded="sm" size="small">
        <span>A</span>
      </v-avatar>
      <div class="d-inline text-h6 font-weight-bold">回答（{{ answers.length }}件）</div>
    </div>

    <!-- anwers -->
    <v-row v-if="answers.length">
      <v-col v-for="answer in answers" :key="answer.id" cols="12">
        <AnswerDetails :answer="answer" :replies="replies"/>
      </v-col>
    </v-row>

    <!-- no answer -->
    <div v-if="!answers.length" class="mb-16">
      <p class="text-medium-emphasis">回答がありません。</p>
    </div>  
  </div>
</template>

<script>
import AnswerDetails from '../components/AnswerDetails.vue'
export default {
  props: ['answers', 'replies'],
  components: { AnswerDetails },
  setup() {

  }
}
</script>

<style>

</style>