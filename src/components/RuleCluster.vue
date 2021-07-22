<template>
  <g
    :transform="transform.cluster"
    class="cluster__wrapper"
    @mouseenter="showTopBarOperation"
    @mouseleave="hiddenTopBarOperation"
  >
    <!--    顶部的操作栏-->
    <foreignObject
      :height="cluster.topBarHeight"
      :width="cluster.width"
      :transform="getTopBarTranslate()"
    >
      <div class="foreign-object__root-item cluster__top-bar">
        <div
          class="cluster-operating__wrapper"
          v-show="clusterOperatingVisible || ruleFilterInputVisible"
        >
          <i class="el-icon-tickets"></i>
          <i class="el-icon-document"></i>
          <i class="el-icon-s-tools"></i>
          <i class="el-icon-delete"></i>
          <i
            class="el-icon-search"
            @click="ruleFilterInputVisible = !ruleFilterInputVisible"
          ></i>
          <template v-if="ruleFilterInputVisible">
            <el-input
              clearable
              v-model="ruleFilterText"
              style="margin-left: 40px"
              placeholder="请输入规则名称、IP、或端口"
              @clear="handleFilterRule"
              @keyup.native.enter="handleFilterRule"
            >
            </el-input>
            <el-button type="primary" @click="handleFilterRule">搜索</el-button>
          </template>
        </div>
        <div class="cluster-index__wrapper" v-show="!clusterOperatingVisible">
          <i>{{ deviceIndex + 1 }}</i>
        </div>
      </div>
    </foreignObject>

    <!-- 未搜索到对应规则的提示 -->
    <template v-if="ruleList.length === 0">
      <rect
        :width="cluster.width"
        :height="cluster.height"
        rx="5"
        ry="5"
        fill="none"
        stroke-width="2"
        style="stroke-dasharray: 10"
        stroke="rgb(118, 168, 224)"
      ></rect>
      <foreignObject :height="cluster.height" :width="cluster.width">
        <div class="foreign-object__root-item rule-list__no-data">
          <span>未搜索到指定内容</span
          ><el-button type="primary" @click="resetRuleFilter"
            >重置搜索</el-button
          >
        </div>
      </foreignObject>
    </template>

    <!-- 集群分页组件 -->
    <rule-cluster-content
      v-for="(ruleGroup, index) of ruleGroupList"
      :key="index"
      :rule-group="ruleGroup"
      :line="node.line"
      :is-first-cluster="node.isFirstCluster"
      :rule-page-size="rulePageSize"
      v-show="index + 1 === currentPage"
      class="rule-cluster__content"
    >
    </rule-cluster-content>

    <!-- 底部分页 -->
    <foreignObject
      :width="cluster.width"
      :height="60"
      :transform="getPaginationTranslate()"
    >
      <div class="rule-cluster__pagination">
        <el-pagination
          v-if="!hiddenRest"
          hide-on-single-page
          layout="total, prev, pager, next, slot"
          :small="false"
          :page-size="+rulePageSize"
          :total="ruleList.length"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
        >
        </el-pagination>
        <div v-if="hiddenRest && ruleList.length > rulePageSize">
          当前集群共有{{ ruleList.length }}个规则，剩余的{{
            ruleList.length - rulePageSize
          }}个已隐藏，如需显示请切换到<strong>显示全部</strong>或<strong
            >分页模式</strong
          >
        </div>
      </div>
    </foreignObject>
  </g>
</template>

<script>
import topologyConfig from '../config/topology';
import RuleClusterContent from './RuleClusterContent';
export default {
  name: 'RuleCluster',

  components: {
    RuleClusterContent,
  },

  props: {
    node: Object,
    index: {
      type: Number,
      default: 1,
    },
    topologyData: {
      type: Array,
    },
    maxRuleSize: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {
      ruleFilterText: '',
      currentPage: 1,
      rulePageSize:
        topologyConfig.pageModel.model === 'showAll'
          ? this.maxRuleSize
          : topologyConfig.pageModel.pageSize,
      ruleList: [],
      hiddenTopBarTimeout: undefined,
      clusterOperatingVisible: false,
      ruleFilterInputVisible: false,
    };
  },

  computed: {
    deviceIndex() {
      return this.topologyData.findIndex((_) => this.node.id === _.id);
    },
    hiddenRest() {
      return topologyConfig.pageModel.model === 'hiddenRest';
    },
    cluster() {
      return {
        width: this.node.width,
        height: this.node.height,
        topBarHeight: 36,
      };
    },
    transform() {
      return {
        cluster: `translate(${
          this.node?.x - topologyConfig.clusterWidth / 2 + topologyConfig.radius
        }, ${
          this.node?.y -
          topologyConfig.getClusterHeight(this.rulePageSize) / 2 +
          topologyConfig.radius
        })`,
      };
    },

    ruleGroupList() {
      if (!this.ruleList.length) return [];

      const maxRuleCount = +this.rulePageSize;
      const ruleGroupList = [];

      for (let i = 0; i < this.ruleList.length; i += maxRuleCount) {
        ruleGroupList.push(this.ruleList.slice(i, i + maxRuleCount));
      }

      if (this.hiddenRest) {
        return ruleGroupList.slice(0, 1);
      }
      return ruleGroupList;
    },
  },

  methods: {
    showTopBarOperation() {
      this.clusterOperatingVisible = true;
      window.clearTimeout(this.hiddenTopBarTimeout);
    },

    hiddenTopBarOperation() {
      this.hiddenTopBarTimeout = window.setTimeout(() => {
        this.clusterOperatingVisible = false;
        this.ruleFilterInputVisible = false;
      }, 16880000);
    },

    handlePageChange(pageNo) {
      this.currentPage = pageNo;
    },

    getRuleList() {
      const ruleList = this.node.line.targetList
        .map((_) => ({
          ruleInfo: _,
          alarm: Math.floor(Math.random() * 30),
        }))
        .sort((a, b) => b.alarm - a.alarm);

      if (this.ruleFilterText.trim()) {
        const text = this.ruleFilterText;
        return ruleList.filter((rule) => {
          const {
            ruleInfo: {
              ruleInfo: { ipAddr = '', dstPort = '', ruleName = '' } = {},
            } = {},
          } = rule;

          return (
            ipAddr.includes(text) ||
            dstPort.includes(text) ||
            ruleName.includes(text)
          );
        });
      }

      return ruleList;
    },

    getPaginationTranslate() {
      if (!this.ruleList.length) {
        return `translate(-9999, -9999)`;
      }
      let pageSize;
      try {
        pageSize = this.ruleGroupList[this.currentPage - 1].length;
      } catch (e) {
        console.warn(this.ruleGroupList, 'c', this.currentPage);
      }
      const contentHeight = topologyConfig.getClusterHeight(pageSize);
      const startHeight =
        (topologyConfig.getClusterHeight(this.rulePageSize) - contentHeight) /
        2;
      return `translate(0, ${startHeight + contentHeight})`;
    },

    getTopBarTranslate() {
      if (!this.ruleList.length) {
        return `translate(-9999, -9999)`;
      }
      const pageSize = this.ruleGroupList[this.currentPage - 1].length;
      const contentHeight = topologyConfig.getClusterHeight(pageSize);
      const startHeight =
        (topologyConfig.getClusterHeight(this.rulePageSize) - contentHeight) /
        2;
      return `translate(0, ${startHeight - this.cluster.topBarHeight - 10})`;
    },

    updateRuleListAlarm() {
      this.ruleList = this.getRuleList();
    },

    handleFilterRule() {
      this.currentPage = 1;
      this.updateRuleListAlarm();
    },

    resetRuleFilter() {
      this.ruleFilterText = '';
      this.updateRuleListAlarm();
    },
  },

  created() {
    this.ruleList = this.getRuleList();
  },

  mounted() {
    setInterval(() => {
      this.updateRuleListAlarm();
      this.currentPage = 1;
    }, 36000 * 10);
  },
};
</script>

<style lang="scss">
.rule-list__no-data {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rule-cluster__content {
  animation: fade 0.3s;
}
.cluster__top-bar {
  position: relative;
  .el-input__inner {
    background-color: rgba(56, 68, 98, 1) !important;
    border: 1px solid rgba(56, 68, 98, 1) !important;
    border-radius: 4px 0 0 4px !important;
    border-right-widthw: 0;
    ::placeholder {
      color: rgba(56, 68, 98, 0.5);
    }
    &::-webkit-input-placeholder {
      /* WebKit browsers */
      color: rgba(200, 200, 200, 0.5);
    }
  }
  .el-button {
    border-radius: 0 4px 4px 0;
  }
}
.cluster-operating__wrapper,
.cluster-index__wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: operating-animation 0.3s;
}
@keyframes operating-animation {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.cluster-operating__wrapper > [class^='el-icon'] {
  font-size: 18px;
  margin: 0 5px;
}
.cluster-index__wrapper {
}
.rule-cluster__pagination {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #a0a0a0;
  strong {
    color: #dfdfdf;
  }
}
@keyframes fade {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  80% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  90% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
}
</style>
