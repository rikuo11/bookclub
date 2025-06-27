<template>
  <div class="editor">
    <v-sheet border="sm" rounded="lg">
      <!-- tool bar -->
      <div class="d-flex flex-wrap border-b pa-1 ga-1">
        <v-btn variant="text" density="comfortable" icon="mdi-undo" @click="handleUndo" :disabled="!canUndo"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-redo" @click="handleRedo" :disabled="!canRedo"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-format-bold" @click="fontBold" :active="isBold"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-format-underline" @click="fontUnderline" :active="isUnderline"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-format-strikethrough" @click="fontStrike" :active="isStrike"></v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" density="comfortable" icon="mdi-format-size"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="changeSize(1)">
              <v-list-item-title>H1</v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeSize(2)">
              <v-list-item-title>H2</v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeSize(3)">
              <v-list-item-title>H3</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn variant="text" density="comfortable" icon="mdi-link" @click="dialog3 = true"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-format-quote-close" @click="fontQuote" :active="isQuoted"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-code-tags" @click="fontCode" :active="isCode"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-format-list-bulleted" @click="addBulletList" :active="isBulletList"></v-btn>
        <v-btn variant="text" density="comfortable" icon=" mdi-minus" @click="addHorizontalLine"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-function-variant" @click="dialog1 = true"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-image" @click="dialog2 = true"></v-btn>
        <v-btn variant="text" density="comfortable" icon="mdi-youtube" @click="dialog4 = true"></v-btn>
      </div>

      <!-- body -->
      <div class="pa-2 my-2">
        <EditorContent :editor="editor" />
      </div>
    </v-sheet>

    <!-- math editor -->
    <v-dialog
      v-model="dialog1"
      max-width="800"
      class="mx-auto"
    >
      <MathEditor @close="dialog1 = false" @submit-mathtext="submitMathText" />
    </v-dialog>

    <!-- upload image -->
    <v-dialog
      v-model="dialog2"
      max-width="500"
      class="mx-auto"
    >
      <SubmitImage @close="dialog2 = false" @submit-url="submitImage" />
    </v-dialog>

    <!-- set link -->
    <v-dialog
      v-model="dialog3"
      max-width="500"
      class="mx-auto"
    >
      <SetLink @close="dialog3 = false" @submit-url="createHyperLink" />
    </v-dialog>

    <!-- set link -->
    <v-dialog
      v-model="dialog4"
      max-width="500"
      class="mx-auto"
    >
      <SubmitVideoLink @close="dialog4 = false" @submit-url="setVideo" />
    </v-dialog>
    
    
  </div>
</template>

<script>
import MathEditor from '../components/MathEditor.vue'
import SubmitImage from '../components/SubmitImage.vue'
import SetLink from '../components/SetLink.vue'
import SubmitVideoLink from './SubmitVideoLink.vue'
import { Mathematics } from '@tiptap-pro/extension-mathematics'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import 'katex/dist/katex.min.css'
import { ref } from 'vue'

export default {
  props: ['size', 'text'],
  components: { EditorContent, MathEditor, SubmitImage, SetLink, SubmitVideoLink },
  setup(props, context) {
    // tiptap
    const editor = useEditor({
      content: '',
      editorProps: {
        attributes: {
          class: `${props.size}`,
        },
      },
      extensions: [
        StarterKit,
        Mathematics,
        Image,
        Underline,
        Link,
        Youtube.configure({
          controls: false,
          nocookie: true,
        }),
      ],
      onCreate({ editor }) {
        if(props.text) {
          editor.commands.insertContent(props.text);
        }
      },
      onSelectionUpdate({ editor, transaction }) {

        if(editor.isActive('bold')) {
          isBold.value = true;
        } else { 
          isBold.value = false;
        }

        if(editor.isActive('underline')) {
          isUnderline.value = true;
        } else { 
          isUnderline.value = false;
        }

        if(editor.isActive('strike')) {
          isStrike.value = true;
        } else { 
          isStrike.value = false;
        }

        if(editor.isActive('blockquote')) {
          isQuoted.value = true;
        } else { 
          isQuoted.value = false;
        }

        if(editor.isActive('codeBlock')) {
          isCode.value = true;
        } else { 
          isCode.value = false;
        }

        if(editor.isActive('bulletList')) {
          isBulletList.value = true;
        } else { 
          isBulletList.value = false;
        }

      },
      onUpdate({ editor }) {
        
        if(editor.can().undo()) {
          canUndo.value = true;
        } else { 
          canUndo.value = false;
        }

        if(editor.can().redo()) {
          canRedo.value = true;
        } else { 
          canRedo.value = false;
        }


        context.emit('emitContent', editor.getHTML())

      },

    });

    Image.configure({
      allowBase64: true,
      inline: true,
    });

    const isBold = ref(false);
    const isUnderline = ref(false);
    const isQuoted = ref(false);
    const isStrike = ref(false);
    const isCode = ref(false);
    const isBulletList = ref(false)
    const canUndo = ref(false);
    const canRedo = ref(false);
    const dialog1 = ref(false);
    const dialog2 = ref(false);
    const dialog3 = ref(false);
    const dialog4 = ref(false);

    const fontBold = () => {
      isBold.value = !isBold.value
      editor.value.chain().focus().toggleBold().run();
    }

    const fontUnderline = () => {
      isUnderline.value = !isUnderline.value
      editor.value.chain().focus().toggleUnderline().run();
    }

    const changeSize = (size) => {
      editor.value.chain().focus().toggleHeading({ level: size }).run();
    }

    const fontQuote = () => {
      isQuoted.value = !isQuoted.value;
      editor.value.chain().focus().toggleBlockquote().run();
    }

    const fontStrike = () => {
      isStrike.value = !isStrike.value;
      editor.value.chain().focus().toggleStrike().run();
    }

    const fontCode = () => {
      isCode.value = !isCode.value
      editor.value.chain().focus().toggleCodeBlock().run();
    }

    const addBulletList = () => {
      isBulletList.value = !isBulletList.value
      editor.value.chain().focus().toggleBulletList().run()
    }

    const addHorizontalLine = () => {
      editor.value.chain().focus().setHorizontalRule().run();
    }

    const handleUndo = () => {
      editor.value.chain().focus().undo().run();
    }

    const handleRedo = () => {
      editor.value.chain().focus().redo().run();
    }


    const submitMathText = (mathText) => {
      editor.value.commands.insertContent(mathText + ' ');
      dialog1.value = false;
    }

    const submitImage = (data) => {
      editor.value.chain().focus().setImage({ src: data.url, title: data.name }).run();
      dialog2.value = false;
    }

    const createHyperLink = (data) => {
      editor.value.chain().focus().setLink({ href: data.url }).insertContent(data.text).run();
      editor.value.chain().focus().setHardBreak().run();
      dialog3.value = false;
    }

    const setVideo = (url) => {
      editor.value.chain().focus().setYoutubeVideo({
        src: url,
        width: '60%',
        height: '60%'
      }).run();
      
      dialog4.value = false;
    }
    

    return { editor, fontBold, isBold, handleUndo, handleRedo, canUndo, canRedo, fontUnderline, isUnderline, changeSize, dialog1, dialog2, dialog3, submitMathText, submitImage, createHyperLink, fontQuote, isQuoted, fontCode, isCode, addHorizontalLine, isStrike, fontStrike, isBulletList, addBulletList, setVideo, dialog4 }
  }
}
</script>

<style>

</style>