<template>
  <div class="math-editor">
    <v-card>
      <v-toolbar class="border-b bg-primary" density="compact">
        <v-slide-group
          show-arrows
        >
          <v-slide-group-item v-for="item in menu" :key="item.id">
            <v-btn @click="id = item.id">{{ item.title }}</v-btn>
          </v-slide-group-item>
        </v-slide-group>
      </v-toolbar>
      
      <div class="border-b bg-grey-lighten-4 px-1 py-2">
        <div
          v-for="item in menu" :key="item.id"
        >
          <v-slide-group
            show-arrows
            v-if="id == item.id"
          >
            <v-slide-group-item
              v-for="value in item.content" :key="value.name"
            >
              <v-sheet
                class="d-flex justify-center align-center px-4 py-2 cursor-pointer border-e-sm border-s-sm"
                v-ripple
                @click="value.function"
              >
                <img :src="value.src">
              </v-sheet>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </div>
      <div class="my-1 px-4 d-flex justify-start align-center">
        <v-btn 
          variant="text" 
          @click="changeType('display')" 
          :active="type == 'display'"
          rounded="sm"
        >ディスプレイ</v-btn>
        <span class="mx-2">/</span>
        <v-btn
          variant="text"
          @click="changeType('text')"
          :active="type == 'text'"
          rounded="sm"
        >テキスト</v-btn>
      </div>
      <v-card-text class="py-1">
        <v-textarea
          variant="outlined"
          v-model="text"
          ref="textarea"
        ></v-textarea>
      </v-card-text>
      <ShowEditorContent :content="mathText" size="editor-sm"/>
      <v-card-actions class="d-flex justify-end py-1">
        <v-btn @click="$emit('submit-mathtext', mathText)">追加</v-btn>
        <v-btn @click="$emit('close')">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import ShowEditorContent from './ShowEditorContent.vue'
export default {
  components: { ShowEditorContent },
  setup() {
    // math editor
    const text = ref('');
    const textarea = ref(null);
    const type = ref('display');
    const id = ref(0);

    const mathText = computed(() => {
      if(type.value == 'display') {
        return '$' + '\\displaystyle' + ' ' + text.value + '$'
      } else if (type.value == 'text') {
        return '$' + '\\textstyle' + ' ' + text.value + '$'
      }
    });

    const changeType = (text) => {
      type.value = text
    }
    
    // integral
    const integral = ref([
      { 
        name: 'indefinite-integral',
        function: () => {
        textarea.value.focus();
        document.execCommand('insertText', false, "\\int");
        },
        src: require('../assets/images/math-symbols/integrals/indefinite-integral.png')
      },
      {
        name: 'definite-integral',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\int_{a}^{b}");
        },
        src: require('../assets/images/math-symbols/integrals/definite-integral.png')
      },
      {
        name: 'riemann-integral',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\int_S");
        },
        src: require('../assets/images/math-symbols/integrals/riemann-integral.png')
      },
      {
        name: 'bouble-integral',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\iint_V");
        },
        src: require('../assets/images/math-symbols/integrals/double-integral.png')
      },
      {
        name: 'line-integral',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\oint_V");
        },
        src: require('../assets/images/math-symbols/integrals/line-integral.png')
      },           
    ])

    // limit
    const limit = ref([
      {
        name: 'limit-of-sequence',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\lim_{n \\to \\infty}");
        },
        src: require('../assets/images/math-symbols/limits/limit-of-sequence.png')
      },
      {
        name: 'limit-to-point',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\lim_{x \\to a}");
        },
        src: require('../assets/images/math-symbols/limits/limit-to-point.png')
      },
      {
        name: 'limit-to-infinity',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\lim_{x \\to \\infty}");
        },
        src: require('../assets/images/math-symbols/limits/limit-to-infinity.png')
      },
      {
        name: 'left-hand-limit',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\lim_{x \\to a^+}");
        },
        src: require('../assets/images/math-symbols/limits/left-hand-limit.png')
      },
      {
        name: 'right-hand-limit',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\lim_{x \\to a^-}");
        },
        src: require('../assets/images/math-symbols/limits/right-hand-limit.png')
      },
    ])

    // sum
    const sum = ref([
      {
        name: 'series',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sum_{n=1}^{\\infty}");
        },
        src: require('../assets/images/math-symbols/sums-and-series/series.png')
      },
      {
        name: 'sum',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sum_{n=1}^{m}");
        },
        src: require('../assets/images/math-symbols/sums-and-series/sum.png')
      },
    ]);

    // numbers
    const numbers = ref([
      {
        name: 'fraction',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\frac{a}{b}");
        },
        src: require('../assets/images/math-symbols/binary-operators/fraction.png')
      },
      {
        name: 'root',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sqrt{a}");
        },
        src: require('../assets/images/math-symbols/root/root.png')
      },
      {
        name: 'nth-root',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sqrt[n]{a}");
        },
        src: require('../assets/images/math-symbols/root/nth-root.png')
      },
      {
        name: 'exponentiation',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "{a}^{b}");
        },
        src: require('../assets/images/math-symbols/exponentiation/exponentiation.png')
      },
      {
        name: 'absolute-value',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\lvert a \\right\\rvert");
        },
        src: require('../assets/images/math-symbols/numbers/absolute-value.png')
      },
      {
        name: 'floor',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "[a]");
        },
        src: require('../assets/images/math-symbols/numbers/floor.png')
      },
      {
        name: 'pi',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\pi");
        },
        src: require('../assets/images/math-symbols/numbers/pi.png')
      },
      {
        name: 'infinity',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\infty");
        },
        src: require('../assets/images/math-symbols/numbers/infinity.png')
      },
      {
        name: 'conjugate',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\bar{z}");
        },
        src: require('../assets/images/math-symbols/numbers/conjugate.png')
      },
    ]);

    // relations
    const relations = ref([
      {
        name: 'not-equal',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\ne");
        },
        src: require('../assets/images/math-symbols/relations/not-equal.png')
      },
      {
        name: 'less-than-or-equal',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\leqq");
        },
        src: require('../assets/images/math-symbols/relations/less-than-or-equal.png')
      },
      {
        name: 'greater-than-or-equal',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\geqq");
        },
        src: require('../assets/images/math-symbols/relations/greater-than-or-equal.png')
      },
      {
        name: 'less-than',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "<");
        },
        src: require('../assets/images/math-symbols/relations/less-than.png')
      },
      {
        name: 'greater-than',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, ">");
        },
        src: require('../assets/images/math-symbols/relations/greater-than.png')
      },
      {
        name: 'equivalent-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\equiv");
        },
        src: require('../assets/images/math-symbols/relations/equivalent-to.png')
      },
      {
        name: 'not-equivalent-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\not\\equiv");
        },
        src: require('../assets/images/math-symbols/relations/not-equivalent-to.png')
      },
    ]);

    // functions
    const functions = ref([
      {
        name: 'fraction-function',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\frac{1}{x}");
        },
        src: require('../assets/images/math-symbols/functions/fraction-function.png'),
      },
      {
        name: 'root-function',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sqrt{x}");
        },
        src: require('../assets/images/math-symbols/functions/root-function.png'),
      },
      {
        name: 'sine',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sin");
        },
        src: require('../assets/images/math-symbols/functions/sine.png'),
      },
      {
        name: 'cosine',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\cos");
        },
        src: require('../assets/images/math-symbols/functions/cosine.png')
      },
      {
        name: 'tangent',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\tan");
        },
        src: require('../assets/images/math-symbols/functions/tangent.png'),
        text: 'tan'
      },
      {
        name: 'exponential',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "e^{x}");
        },
        src: require('../assets/images/math-symbols/functions/exponential.png'),
      },
      {
        name: 'logarithm',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\log x");
        },
        src: require('../assets/images/math-symbols/functions/logarithm-1.png'),
      },
      {
        name: 'logarithm-function',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\log_a x");
        },
        src: require('../assets/images/math-symbols/functions/logarithm-2.png'),
      },
      {
        name: 'cosecant',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\csc");
        },
        src: require('../assets/images/math-symbols/functions/cosecant.png'),
      },
      {
        name: 'secant',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sec");
        },
        src: require('../assets/images/math-symbols/functions/secant.png'),
      },
      {
        name: 'cotangent',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\cot");
        },
        src: require('../assets/images/math-symbols/functions/cotangent.png'),
      },
      {
        name: 'arcsine',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\arcsin");
        },
        src: require('../assets/images/math-symbols/functions/arcsine.png'),
      },
      {
        name: 'arccosine',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\arccos");
        },
        src: require('../assets/images/math-symbols/functions/arccosine.png'),
      },
      {
        name: 'arctangent',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\arctan");
        },
        src: require('../assets/images/math-symbols/functions/arctangent.png'),
      },
      {
        name: 'hyperbolic-sine',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sinh");
        },
        src: require('../assets/images/math-symbols/functions/hyperbolic-sine.png'),
      },
      {
        name: 'hyperbolic-cosine',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\cosh");
        },
        src: require('../assets/images/math-symbols/functions/hyperbolic-cosine.png'),
      },
      {
        name: 'hyperbolic-tangent',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\tanh");
        },
        src: require('../assets/images/math-symbols/functions/hyperbolic-tangent.png'),
      },
    ]);

    const combinatorics = ref([
      {
        name: 'factirial',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "n!");
        },
        src: require('../assets/images/math-symbols/combinatorics/factorial.png')
      },
      {
        name: 'permutaion',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "{}_n P_r");
        },
        src: require('../assets/images/math-symbols/combinatorics/permutation.png')
      },
      {
        name: 'combination',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "{}_n C_r");
        },
        src: require('../assets/images/math-symbols/combinatorics/combination.png')
      },
      {
        name: 'permutaion-with-repitition',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "{}_n \\Pi_r");
        },
        src: require('../assets/images/math-symbols/combinatorics/permutation-with-repitition.png')
      },
      {
        name: 'combinaion-with-repitition',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "{}_n H_r");
        },
        src: require('../assets/images/math-symbols/combinatorics/combination-with-repitition.png')
      },
    ]);

    const geometry = ref([
      {
        name: 'triangle',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\triangle {ABC}");
        },
        src: require('../assets/images/math-symbols/geometry/triangle.png')
      },
      {
        name: 'angle',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\angle A");
        },
        src: require('../assets/images/math-symbols/geometry/angle.png')
      },
      {
        name: 'degree',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "90^{ \\circ }");
        },
        src: require('../assets/images/math-symbols/geometry/degree.png')
      },
      {
        name: 'length',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\overline{AB}");
        },
        src: require('../assets/images/math-symbols/geometry/length.png')
      },
      {
        name: 'arc',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\stackrel{\\huge\\frown}{AB}");
        },
        src: require('../assets/images/math-symbols/geometry/arc.png')
      },
      {
        name: 'perpendicular-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\perp");
        },
        src: require('../assets/images/math-symbols/geometry/perpendicular-to.png')
      },
      {
        name: 'parallel-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\parallel");
        },
        src: require('../assets/images/math-symbols/geometry/parallel-to.png')
      },
      {
        name: 'equivalent-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\equiv");
        },
        src: require('../assets/images/math-symbols/relations/equivalent-to.png')
      },
      {
        name: 'not-equivalent-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\not\\equiv");
        },
        src: require('../assets/images/math-symbols/relations/not-equivalent-to.png')
      },
      {
        name: 'similar-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\sim");
        },
        src: require('../assets/images/math-symbols/relations/similar-to.png')
      },
      {
        name: 'not-similar-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\nsim");
        },
        src: require('../assets/images/math-symbols/relations/not-similar-to.png')
      },
      {
        name: 'congruent-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\cong");
        },
        src: require('../assets/images/math-symbols/relations/congruent-to.png')
      },
      {
        name: 'not-congruent-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\ncong");
        },
        src: require('../assets/images/math-symbols/relations/not-congruent-to.png')
      },    
    ]);

    const vector = ref([
      {
        name: 'vector',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\vec{a}");
        },
        src: require('../assets/images/math-symbols/algebra/vector.png')
      },
      {
        name: 'directed-line-segment',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\overrightarrow{AB}");
        },
        src: require('../assets/images/math-symbols/algebra/directed-line-segment.png')
      },
      {
        name: 'row-vector',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "( a_1, a_2, a_3 )");
        },
        src: require('../assets/images/math-symbols/algebra/row-vector.png')
      },
      {
        name: 'norm-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mid \\vec{a} \\mid");
        },
        src: require('../assets/images/math-symbols/algebra/norm-1.png')
      },
      {
        name: 'norm-2',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\| \\vec{a} \\|");
        },
        src: require('../assets/images/math-symbols/algebra/norm-2.png')
      },
      {
        name: 'dot-product',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\vec{a} \\cdot \\vec{b}");
        },
        src: require('../assets/images/math-symbols/algebra/dot-product.png')
      },
      {
        name: 'cross-product',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\vec{a} \\times \\vec{b}");
        },
        src: require('../assets/images/math-symbols/algebra/cross-product.png')
      },
      {
        name: 'perpendicular-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\perp");
        },
        src: require('../assets/images/math-symbols/geometry/perpendicular-to.png')
      },
      {
        name: 'parallel-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\parallel");
        },
        src: require('../assets/images/math-symbols/geometry/parallel-to.png')
      },
    ]);

    // matrix
    const matrix = ref([
      {
        name: 'matrix-22',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}");
        },
        src: require('../assets/images/math-symbols/algebra/matrix-22.png')
      },
      {
        name: 'column-vector-2',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\begin{pmatrix} a \\\\ b \\end{pmatrix} ");
        },
        src: require('../assets/images/math-symbols/algebra/column-vector-2.png')
      },
      {
        name: 'row-vector-2',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "( a, b )");
        },
        src: require('../assets/images/math-symbols/algebra/row-vector-2.png')
      },
      {
        name: 'determinant-22',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\begin{vmatrix} a & b  \\\\ c & d \\end{vmatrix}");
        },
        src: require('../assets/images/math-symbols/algebra/determinant-22.png')
      },
      {
        name: 'matrix-33',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}");
        },
        src: require('../assets/images/math-symbols/algebra/matrix-33.png')
      },
      {
        name: 'column-vector-3',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\begin{pmatrix} a \\\\ b \\\\ c \\end{pmatrix} ");
        },
        src: require('../assets/images/math-symbols/algebra/column-vector-3.png')
      },
      {
        name: 'row-vector-3',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "( a, b, c )");
        },
        src: require('../assets/images/math-symbols/algebra/row-vector-3.png')
      },
      {
        name: 'determinant-33',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\begin{vmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{vmatrix}");
        },
        src: require('../assets/images/math-symbols/algebra/determinant-33.png')
      },
      {
        name: 'determinant',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathrm{ det }A");
        },
        src: require('../assets/images/math-symbols/algebra/determinant.png')
      },
      {
        name: 'dimension',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\dim");
        },
        src: require('../assets/images/math-symbols/algebra/dimension.png')
      },
      {
        name: 'rank',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathrm{ rank } A");
        },
        src: require('../assets/images/math-symbols/algebra/rank.png')
      },
      {
        name: 'transpose',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "{}^t \\! A");
        },
        src: require('../assets/images/math-symbols/algebra/transpose.png')
      },
      {
        name: 'trace',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathrm{ Tr } A");
        },
        src: require('../assets/images/math-symbols/algebra/trace.png')
      },
    ]);

    // set-theory
    const setTheory = ref([
      {
        name: 'empty-set',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\emptyset");
        },
        src: require('../assets/images/math-symbols/set-theory/empty-set.png')
      },
      {
        name: 'curly-brackets',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\{  \\right\\}");
        },
        src: require('../assets/images/math-symbols/set-theory/curly-brackets.png')
      },
      {
        name: 'vartical-line',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\middle|");
        },
        src: require('../assets/images/math-symbols/set-theory/vartical-line.png')
      },
      {
        name: 'natural-numbers',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathbb{ N }");
        },
        src: require('../assets/images/math-symbols/set-theory/natural-numbers.png')
      },
      {
        name: 'integers',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathbb{ Z }");
        },
        src: require('../assets/images/math-symbols/set-theory/integers.png')
      },
      {
        name: 'rational-numbers',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathbb{ Q }");
        },
        src: require('../assets/images/math-symbols/set-theory/rational-numbers.png')
      },
      {
        name: 'real-numbers',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathbb{ R }");
        },
        src: require('../assets/images/math-symbols/set-theory/real-numbers.png')
      },
      {
        name: 'complex-numbers',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\mathbb{ C }");
        },
        src: require('../assets/images/math-symbols/set-theory/complex-numbers.png')
      },
      {
        name: 'belong-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "a \\in A");
        },
        src: require('../assets/images/math-symbols/set-theory/belong-to.png')
      },
      {
        name: 'not-belong-to',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "a \\notin A");
        },
        src: require('../assets/images/math-symbols/set-theory/not-belong-to.png')
      },
      {
        name: 'subset-of',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\subseteqq B");
        },
        src: require('../assets/images/math-symbols/set-theory/subset-of.png')
      },
      {
        name: 'superset-of',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\supseteqq B");
        },
        src: require('../assets/images/math-symbols/set-theory/superset-of.png')
      },
      {
        name: 'proper-subset-of',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\subset B");
        },
        src: require('../assets/images/math-symbols/set-theory/proper-subset-of.png')
      },
      {
        name: 'proper-superset-of',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\supset B");
        },
        src: require('../assets/images/math-symbols/set-theory/proper-superset-of.png')
      },
      {
        name: 'union',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\cup B");
        },
        src: require('../assets/images/math-symbols/set-theory/union.png')
      },
      {
        name: 'intersection',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\cap B");
        },
        src: require('../assets/images/math-symbols/set-theory/intersection.png')
      },
      {
        name: 'complement-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A^c");
        },
        src: require('../assets/images/math-symbols/set-theory/complement-1.png')
      },
      {
        name: 'complement-2',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\overline{ A }");
        },
        src: require('../assets/images/math-symbols/set-theory/complement-2.png')
      },
      {
        name: 'difference',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "A \\setminus B");
        },
        src: require('../assets/images/math-symbols/set-theory/difference.png')
      },
      {
        name: 'finite-union',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\bigcup_{i=1}^{n}S_{i}");
        },
        src: require('../assets/images/math-symbols/set-theory/finite-union.png')
      },
      {
        name: 'finite-intersection',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\bigcap_{i=1}^{n}S_{i}");
        },
        src: require('../assets/images/math-symbols/set-theory/finite-intersection.png')
      },
      {
        name: 'union-of-family',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\bigcup_{i \\in I}S_{i}");
        },
        src: require('../assets/images/math-symbols/set-theory/union-of-family.png')
      },
      {
        name: 'intersection-of-family',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\bigcap_{i \\in I}S_{i}");
        },
        src: require('../assets/images/math-symbols/set-theory/intersection-of-family.png')
      },
    ]);

    // bracket
    const bracket = ref([
      {
        name: 'bracket-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left( a \\right)");
        },
        src: require('../assets/images/math-symbols/bracket/bracket-1.png')
      },
      {
        name: 'bracket-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\lbrack a \\right\\rbrack");
        },
        src: require('../assets/images/math-symbols/bracket/bracket-2.png')
      },
      {
        name: 'bracket-3',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\lbrace a \\right\\rbrace");
        },
        src: require('../assets/images/math-symbols/bracket/bracket-3.png')
      },
      {
        name: 'bracket-4',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\langle a \\right\\rangle");
        },
        src: require('../assets/images/math-symbols/bracket/bracket-4.png')
      },
    ]);

    // system of linear equations
    const systemOfLinearEquations = ref([
      {
        name: 'system-of-linear-equations-2',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\{ \\begin{array}{l} {condition1} \\\\ {condition2} \\end{array} \\right.");
        },
        src: require('../assets/images/math-symbols/system-of-linear-equations/system-of-linear-equations-2.png')
      },
      {
        name: 'system-of-linear-equations-3',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\left\\{ \\begin{array}{l} {condition1} \\\\ {condition2} \\\\ {condition3} \\end{array} \\right.");
        },
        src: require('../assets/images/math-symbols/system-of-linear-equations/system-of-linear-equations-3.png')
      },
    ]);

    const derivative = ref([
      {
        name: 'dash-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "f'");
        },
        src: require('../assets/images/math-symbols/derivative/dash-1.png')
      },
      {
        name: 'dash-2',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "f^{\\prime\\prime}");
        },
        src: require('../assets/images/math-symbols/derivative/dash-2.png')
      },
      {
        name: 'dash-n',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "f^{ ( n ) }");
        },
        src: require('../assets/images/math-symbols/derivative/dash-n.png')
      },
      {
        name: 'derivative-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\frac{ df }{ dx }");
        },
        src: require('../assets/images/math-symbols/derivative/derivative-1.png')
      },
      {
        name: 'derivative-n',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\frac{ d^n f }{ dx^n }");
        },
        src: require('../assets/images/math-symbols/derivative/derivative-n.png')
      },
      {
        name: 'partial-derivative-1',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\frac{ \\partial f }{ \\partial x }");
        },
        src: require('../assets/images/math-symbols/derivative/partial-derivative-1.png')
      },
      {
        name: 'partial-derivative-n',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\frac{ \\partial^n f}{ \\partial x^n }");
        },
        src: require('../assets/images/math-symbols/derivative/partial-derivative-n.png')
      },
    ]);

    const logic = ref([
      {
        name: 'iff',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "P \\implies Q");
        },
        src: require('../assets/images/math-symbols/logic/imply.png')
      },
      {
        name: 'imply',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "P \\iff Q");
        },
        src: require('../assets/images/math-symbols/logic/iff.png')
      },
      {
        name: 'for-all',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\forall x");
        },
        src: require('../assets/images/math-symbols/logic/for-all.png')
      },
      {
        name: 'for-some',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\exists x");
        },
        src: require('../assets/images/math-symbols/logic/for-some.png')
      },
      {
        name: 'for-some',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\exists x");
        },
        src: require('../assets/images/math-symbols/logic/for-some.png')
      },
      {
        name: 'and',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "P \\land Q");
        },
        src: require('../assets/images/math-symbols/logic/and.png')
      },
      {
        name: 'or',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "P \\lor Q");
        },
        src: require('../assets/images/math-symbols/logic/or.png')
      },
      {
        name: 'not',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\lnot P");
        },
        src: require('../assets/images/math-symbols/logic/not.png')
      },
    ]);

    // sequence 
    const sequence = ref([
      {
        name: 'nth-term',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "x_n");
        },
        src: require('../assets/images/math-symbols/sequence/nth-term.png')
      },
      {
        name: 'sequence',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\{ x_n \\}_{ n=1 }^\\infty");
        },
        src: require('../assets/images/math-symbols/sequence/sequence.png')
      },
      {
        name: 'family',
        function: () => {
          textarea.value.focus();
          document.execCommand('insertText', false, "\\{ S_i \\}_{ i \\in I }");
        },
        src: require('../assets/images/math-symbols/sequence/family.png')
      }
    ]);


    const menu = ref([
      {
        title: '積分',
        content: integral.value,
        id: 0
      },
      {
        title: '微分',
        content: derivative.value,
        id: 1
      },
      {
        title: '極限',
        content: limit.value,
        id: 2
      },
      {
        title: '和・級数',
        content: sum.value,
        id: 3
      },
      {
        title: '数',
        content: numbers.value,
        id: 4
      },
      {
        title: '数列・族',
        content: sequence.value,
        id: 5
      },
      {
        title: '等号・不等号',
        content: relations.value,
        id: 6
      },
      {
        title: '括弧',
        content: bracket.value,
        id: 7
      },
      {
        title: '連立方程式',
        content: systemOfLinearEquations.value,
        id: 8
      },
      {
        title: '関数',
        content: functions.value,
        id: 9
      },
      {
        title: '幾何',
        content: geometry.value,
        id: 10
      },
      {
        title: 'ベクトル',
        content: vector.value,
        id: 11
      },
      {
        title: '行列',
        content: matrix.value,
        id: 12
      },
      {
        title: '集合',
        content: setTheory.value,
        id: 13
      },
      {
        title: '論理',
        content: logic.value,
        id: 14
      },
      {
        title: '順列・組合わせ',
        content: combinatorics.value,
        id: 15
      }      
      
    ]);
    

    return { mathText, text, textarea, id, menu, integral, limit, sum, numbers, relations, functions, combinatorics, geometry, vector, matrix, setTheory, bracket, systemOfLinearEquations, derivative, logic, sequence, type, changeType }

  }
}
</script>

<style>

</style>