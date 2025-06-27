<template>
  <div class="answer-question">
    <v-container>
      <div class="text-h6 font-weight-bold mb-2">回答投稿</div>
      <v-card>
          <v-form @submit.prevent="handleSubmit">
            <v-card-text>
              <div class="text-subtitle-1 font-weight-bold my-2">回答内容</div>
              <Editor @emit-content="setContent" size="editor-md"/>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn @click="$router.go(-1)">キャンセル</v-btn>
              <v-btn type="submit" :loading="isPending">回答する</v-btn>
            </v-card-actions>
            <div v-if="error" class="text-error my-2 pa-2 d-flex justify-end">回答の投稿に失敗しました。</div>
          </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import useCollection from '../composables/useCollection'
import getDocument from '../composables/getDocument'
import getUser from '../composables/getUser'
import useDocument from '../composables/useDocument'
import useStorage from '../composables/useStorage'
import { v4 as uuidv4 } from 'uuid';
import Editor from '../components/Editor.vue'
import { ref } from 'vue'
import { increment, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { getFunctions, httpsCallable } from 'firebase/functions';
export default {
  props:['isbn', 'questionId'],
  components: { Editor },
  setup(props) {
    const content = ref('');
    const filePaths = ref([]);
    const contentRules = ref([
      value => {
        if(value) return true;
        return '回答内容を入力してください'
      }
    ]);

    const router = useRouter();

    const { error, addDocument, isPending } = useCollection('answers');
    const { document: question } = getDocument('questions', props.questionId);
    const { user } = getUser();
    const { uploadImage } = useStorage();
    const { updateDocument } = useDocument('questions', props.questionId)

    const setContent = (text) => {
      content.value = text;
    }

    const handleSubmit = async () => {

      if (content.value) {
        // generate uuid
        const documentId = uuidv4();

        // upload Images
        let parser = new DOMParser();
        let dom = parser.parseFromString(content.value, "text/html");
        let imgTags = dom.getElementsByTagName('img');

        for(const element of Array.from(imgTags) ){
          if(element.src.startsWith('data:image')){
            // convert base64 to Blob
            // send Blob to firebase storage
            // change the image source
            element.title = Math.floor(Math.random()*100) + element.title; 
            element.src = await uploadImage('answers', documentId, base64toBlob(element.src), element.title);
            filePaths.value.push(element.title);
          }
        }

        content.value = dom.getElementsByTagName('body')[0].innerHTML;

        const doc = {
          questionId: props.questionId,
          isbn: props.isbn,
          bookTitle: question.value.bookTitle,
          answerer: user.value.uid,
          questioner: question.value.questioner,
          questionTitle: question.value.title,
          displayName: user.value.displayName,
          content: content.value,
          followers:[],
          like:[],
          dislike:[],
          createAt: serverTimestamp(),
          updateAt: null,
          filePaths: filePaths.value
        }

        const ref = await addDocument(doc, documentId)

        await updateDocument({
          numberOfAnswers: increment(1)
        })

        // send notification to questioner
        const functions = getFunctions()
        const notificationToQuestioner = httpsCallable(functions, 'notificationToQuestioner')
        await notificationToQuestioner({
          uid: question.value.questioner,
          questionTitle: question.value.title,
          isbn: question.value.isbn,
          documentId: question.value.id
        })



        if(!error.value) {
          router.push({ name: 'QuestionDetails', params: { isbn: props.isbn, id: props.questionId }})
        }
      }
    }

    const base64toBlob = (base64) => {
    const bin = atob(base64.replace(/^.*,/, ""));
    const buffer = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
      try {
        return new Blob([buffer.buffer], {
          type: "image/jpeg",
        });
      } catch (e) {
        return false;
      }
    }

    return { content, handleSubmit, contentRules, error, isPending, setContent }
  }
}
</script>

<style>

</style>