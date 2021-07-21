<template>
  <g
    :transform="transform.cluster"
    class="cluster__wrapper"
    @mouseenter="showTopBarOperation"
    @mouseleave="hiddenTopBarOperation"
  >
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
    <foreignObject
      :height="cluster.topBarHeight"
      :width="cluster.width"
      :transform="getTopBarTranslate()"
    >
      <div class="foreign-object__root-item cluster__top-bar">
        <div
          class="cluster-operating__wrapper"
          v-show="clusterOperatingVisible"
        >
          <i class="el-icon-tickets"></i>
          <i class="el-icon-document"></i>
          <i class="el-icon-s-tools"></i>
          <i class="el-icon-delete"></i>
        </div>
        <div class="cluster-index__wrapper" v-show="!clusterOperatingVisible">
          <i>{{ deviceIndex + 1 }}</i>
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
      currentPage: 1,
      rulePageSize:
        topologyConfig.pageModel.model === 'showAll'
          ? this.maxRuleSize
          : topologyConfig.pageModel.pageSize,
      ruleList: [],
      hiddenTopBarTimeout: undefined,
      clusterOperatingVisible: false,
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
      }, 1500);
    },

    handlePageChange(pageNo) {
      this.currentPage = pageNo;
    },

    getRuleList() {
      return this.node.line.targetList
        .map((_) => ({
          ruleInfo: _,
          alarm: Math.floor(Math.random() * 30),
        }))
        .sort((a, b) => b.alarm - a.alarm);
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
      return `translate(0, ${startHeight - this.cluster.topBarHeight})`;
    },

    updateRuleListAlarm() {
      this.ruleList = this.getRuleList();
    },
  },

  created() {
    this.ruleList = this.getRuleList();
  },

  mounted() {
    setInterval(() => {
      this.updateRuleListAlarm();
      this.currentPage = 1;
    }, 3600 * 10);
  },
};
</script>

<style lang="scss">
.rule-cluster__content {
  animation: fade 0.3s;
}
.cluster__top-bar {
  position: relative;
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
  justify-content: center;
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
