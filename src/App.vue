<template>
  <div id="app">
    <topology></topology>
  </div>
</template>

<script>
import Topology from "./components/Topology.vue";

export default {
  name: "App",
  components: {
    Topology,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
