<script setup lang="ts">
import { RouterView } from 'vue-router';

defineOptions({
  name: 'App'
});
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f0f0f0;
}

#app {
  min-height: 100vh;
}
</style>
