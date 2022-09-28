<template>
    <div class="container">
      <router-view v-slot="{ Component }">
          <component :is="Component"></component>
      </router-view>
    </div>
</template>

<script>

import { defineComponent} from "vue";

export default defineComponent({
  name: "App",
  setup() {

  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
