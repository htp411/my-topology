<template>
  <div id="app">
    <div class="toolbar">
      <div @click="dialogVisible = true" style="cursor: pointer">
        <i
          class="el-icon-setting"
          style="margin-right: 10px; font-size: 18px"
        ></i>
        <span>设置</span>
      </div>
    </div>
    <el-dialog title="修改拓扑配置" :visible.sync="dialogVisible" width="680px">
      <el-form ref="form" :model="form" label-suffix=":" label-width="100px">
        <el-form-item label="HTTP错误码">
          <el-switch
            v-model="form.httpCodeBlockVisible"
            active-text="显示"
            inactive-text="隐藏"
          ></el-switch>
        </el-form-item>
        <el-form-item label="首个节点集群">
          <el-switch
            v-model="form.expandFirstCluster"
            active-text="全部展开"
            inactive-text="跟随模式"
          ></el-switch>
        </el-form-item>
        <el-form-item prop="model" label="集群显示模式">
          <el-radio-group v-model="form.model">
            <el-radio label="showAll">显示全部</el-radio>
            <el-radio label="pagination">分页模式</el-radio>
            <el-radio label="hiddenRest">超出页面隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每页显示大小">
          <el-input
            v-model="form.pageSize"
            size="small"
            type="number"
            :disabled="form.model === 'showAll'"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateTopologyModel" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <topology></topology>
  </div>
</template>

<script>
import Topology from './components/Topology.vue';
import topologyConfig from './config/topology';

export default {
  name: 'App',
  components: {
    Topology,
  },

  data() {
    let httpCodeBlockVisible = false;
    let form = Object.assign({}, topologyConfig.defaultTopologyModel);

    const localeStr = window.localStorage.getItem('httpCodeBlockVisible');
    const topologyModelStr = window.localStorage.getItem('topologyModel');

    if (localeStr != null) {
      httpCodeBlockVisible = JSON.parse(localeStr).visible;
    }

    if (topologyModelStr != null) {
      form = JSON.parse(topologyModelStr);
    }

    form.httpCodeBlockVisible = httpCodeBlockVisible;

    return {
      dialogVisible: false,
      form,
    };
  },

  methods: {
    updatedHttpCodeBlockVisibleStatus() {
      const httpCodeBlockVisible = { visible: this.form.httpCodeBlockVisible };
      window.localStorage.setItem(
        'httpCodeBlockVisible',
        JSON.stringify(httpCodeBlockVisible)
      );
    },

    updateTopologyModel() {
      const { pageSize } = this.form;

      if (
        Number.isNaN(+pageSize) ||
        +pageSize === 0 ||
        pageSize.toString().includes('.')
      ) {
        this.$message.error('pageSize 必须为大于零的正整数');
      }

      this.form.pageSize = parseInt(this.form.pageSize.toString());
      window.localStorage.setItem('topologyModel', JSON.stringify(this.form));
      this.updatedHttpCodeBlockVisibleStatus();

      this.dialogVisible = false;
      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
  },
};
</script>

<style lang="scss">
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
  & > div {
    display: flex;
    align-items: center;
  }
}
.el-pagination__total {
  color: #afafaf !important;
}
.el-pagination button:disabled {
  background-color: rgba(200, 200, 200, 0.8) !important;
  color: #fff !important;
}
</style>
