<template>
  <div class="ask-question">
    <v-container>
      <div class="text-h6 font-weight-bold mb-2">質問投稿</div>
      <v-card>
          <v-form @submit.prevent="handleSubmit" @keydown.enter="$event.preventDefault()">
            <v-card-text>
              <div class="text-subtitle-1 font-weight-bold my-2">タイトル</div>
              <v-text-field
                variant="outlined"
                :rules="titleRules"
                v-model="title"
              ></v-text-field>
              <div class="text-subtitle-1 font-weight-bold my-2">タグ</div>
              <div class="my-2">
                <v-chip
                  v-for="tag in tags" :key="tag"
                  class="mr-2"
                  color="warning"
                  variant="outlined"
                  closable
                  @click:close="deleteTag(tag)"
                >{{ tag }}</v-chip>
              </div>
              <v-text-field
                variant="outlined"
                v-model="tag"
                append-inner-icon="mdi-plus-circle-outline"
                @click:append-inner="addTag"
                @keydown.enter="addTag"
              ></v-text-field>
              <div class="text-subtitle-1 font-weight-bold my-2">質問内容</div>
              <Editor @emit-content="setContent" size="editor-md"/>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn @click="$router.go(-1)">キャンセル</v-btn>
              <v-btn type="submit" :loading="isPending">質問する</v-btn>
            </v-card-actions>
            <div v-if="error" class="text-error my-2 pa-2 d-flex justify-end">質問の投稿に失敗しました。</div>
          </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import useCollection from '../composables/useCollection'
import getUser from '../composables/getUser'
import useStorage from '../composables/useStorage'
import { ref } from 'vue'
import { serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import Editor from '../components/Editor.vue'
import { v4 as uuidv4 } from 'uuid';
export default {
  props:['isbn', 'bookTitle'],
  components: { Editor },
  setup(props) {
    const router = useRouter();

    const { error, addDocument, isPending } = useCollection('questions');
    const { user } = getUser();
    const { uploadImage } = useStorage();
    
    // title
    const title = ref('');
    const titleRules = ref([
      value => {
        if(value) return true;
        return 'タイトルを入力してください'
      }
    ]);

    // tag
    const tag = ref('')
    const tags = ref([])

    const addTag = () => {
      let text = tag.value.replace(/\s+/g, "");
      if(text && !tags.value.includes(text)) {
        tags.value.push(text);
        tag.value = ''
      } else {
        tag.value = ''
      }
    }

    const deleteTag = (text) => {
      tags.value = tags.value.filter((tag) => {
        return tag != text
      })
    }
    
    // content
    const content = ref('');
    const filePaths = ref([]);

    const setContent = (text) => {
      content.value = text;
    }

    // submit
    const handleSubmit = async () => {

      if (title.value && content.value) {
        // generate uuid
        const documentId = uuidv4();

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
            element.src = await uploadImage('questions', documentId, base64toBlob(element.src), element.title);
            filePaths.value.push(element.title);
          }
        }

        content.value = dom.getElementsByTagName('body')[0].innerHTML;
        
        const doc = {
          isbn: props.isbn,
          bookTitle: props.bookTitle,
          questioner: user.value.uid,
          displayName: user.value.displayName,
          title: title.value,
          content: content.value,
          followers:[],
          like:[],
          dislike:[],
          createAt: serverTimestamp(),
          updateAt: null,
          filePaths: filePaths.value,
          numberOfAnswers: 0,
          tags: tags.value
        }

        const ref = await addDocument(doc, documentId)

        if(!error.value) {
          router.push({ name: 'QuestionDetails', params: { isbn: props.isbn, id: documentId }})
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
    
    return { title, content, handleSubmit, titleRules, error, isPending, setContent, tag, tags, addTag, deleteTag }
  }
}
</script>

<style>

</style>