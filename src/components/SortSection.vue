<template>
  <div class="sort-section">
    <v-navigation-drawer
      expand-on-hover
      rail
      width="500"
      :permanent="true"
    >
      <v-list v-model:opened="open">
        <v-list-group value="genre">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              title="ジャンル"
              prepend-icon=" mdi-menu"
            ></v-list-item>
          </template>
          <v-list-group value="Users">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                title="語学・学習参考書"
              ></v-list-item>
            </template>
            <v-list-item
              title="語学学習"
              value="語学学習"
            ></v-list-item>
            <v-list-item
              title="語学辞書"
              value="語学辞書"
            ></v-list-item>
            <v-list-item
              title="辞典"
              value="辞典"
            ></v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const open = ref(['Users'])
    const drawer = ref(false)
    return { open, drawer }
  }
}
</script>

<style>

</style>