<template>
  <div v-if="answer" class="edit-answer">
    <v-container>
      <div class="text-h6 font-weight-bold mb-2">回答編集</div>
      <v-card>
        <v-form @submit.prevent="handleSubmit">
          <v-card-text>
            <div class="text-subtitle-1 font-weight-bold my-2">回答内容</div>
            <Editor @emit-content="setContent" size="editor-md" :text="answer.content"/>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="$router.go(-1)">キャンセル</v-btn>
            <v-btn type="submit" :loading="isPending">編集する</v-btn>
          </v-card-actions>
          <div v-if="error" class="text-error my-2 pa-2 d-flex justify-end">回答の編集に失敗しました。</div>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import useDocument from '../composables/useDocument'
import getDocument from '../composables/getDocument'
import useStorage from "../composables/useStorage";
import { ref, watch } from 'vue'
import { serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import Editor from '../components/Editor.vue'
export default {
  props:['isbn', 'answerId'],
  components: { Editor },
  setup(props) {
    const content = ref('');
    const NewFilePaths = ref([]);
    const contentRules = ref([
      value => {
        if(value) return true;
        return '回答内容を入力してください'
      }
    ]);

    const router = useRouter();

    const { error, isPending, updateDocument } = useDocument('answers', props.answerId);
    const { document: answer } = getDocument('answers', props.answerId);
    const { uploadImage, deleteImage } = useStorage();

    watch(answer, () => {
      content.value = answer.value.content
    });

    const setContent = (text) => {
      content.value = text;
    }

    const handleSubmit = async () => {
      if (content.value) {
        // upload images
        let parser = new DOMParser();
        let dom = parser.parseFromString(content.value, "text/html");
        let imgTags = dom.getElementsByTagName('img');

        for(const element of Array.from(imgTags) ){
          if(element.src.startsWith('data:image')){
            // convert base64 to Blob
            // send Blob to firebase storage
            // change the image source
            element.title = Math.floor(Math.random()*100) + element.title;
            element.src = await uploadImage('answers', props.answerId, base64toBlob(element.src), element.title);
          }
        }

        content.value = dom.getElementsByTagName('body')[0].innerHTML;

        // deleteImage
        let NewImgTags = dom.getElementsByTagName('img');

        for(const element of Array.from(NewImgTags)){
          if(element.src.startsWith('https://firebasestorage')){
       
            NewFilePaths.value.push(element.title);
          }
        }

        answer.value.filePaths.forEach(fileName => {
          if(!NewFilePaths.value.includes(fileName)) {
            deleteImage('answers', props.answerId, fileName);
          }
        });

        const doc = {
          content: content.value,
          updateAt: serverTimestamp(),
          filePaths: NewFilePaths.value
        }

        const ref = await updateDocument(doc)

        if(!error.value) {
          router.push({ name: 'QuestionDetails', params: { isbn: props.isbn, id: answer.value.questionId }})
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
    

    return { content, handleSubmit, contentRules, error, isPending, answer, setContent }
  }
}
</script>

<style>

</style>