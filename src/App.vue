<template>
  <div id="app">
    <div class="toolbar">
      <span>显示HTTP返回码：</span>
      <el-switch
        v-model="httpCodeBlockVisible"
        @change="updatedHttpCodeBlockVisibleStatus"
      ></el-switch>
    </div>

    <topology></topology>
  </div>
</template>

<script>
import Topology from './components/Topology.vue';

export default {
  name: 'App',
  components: {
    Topology,
  },

  data() {
    let httpCodeBlockVisible;

    const localeStr = window.localStorage.getItem('httpCodeBlockVisible');

    if (localeStr != null) {
      httpCodeBlockVisible = JSON.parse(localeStr).visible;
    }
    return {
      httpCodeBlockVisible,
    };
  },

  methods: {
    updatedHttpCodeBlockVisibleStatus() {
      const httpCodeBlockVisible = { visible: this.httpCodeBlockVisible };
      window.localStorage.setItem(
        'httpCodeBlockVisible',
        JSON.stringify(httpCodeBlockVisible)
      );

      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: rgba(56, 78, 111, 1);
  position: relative;
}
.toolbar {
  color: #a0a0a0;
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 99;
  display: flex;
  align-items: center;
}
.el-pagination__total {
  color: #afafaf !important;
}
.el-pagination button:disabled {
  background-color: rgba(200, 200, 200, 0.8) !important;
  color: #fff !important;
}
</style>
