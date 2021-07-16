<template>
  <g :transform="transform.cluster">
    <rule-cluster-content
      v-for="(ruleGroup, index) of ruleGroupList"
      :key="index"
      :rule-group="ruleGroup"
      :line="node.line"
      :is-first-cluster="node.isFirstCluster"
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
          hide-on-single-page
          layout="total, prev, pager, next, slot"
          :small="false"
          :page-size="rulePageSize"
          :total="ruleList.length"
          :current-page.sync="currentPage"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </foreignObject>
  </g>
</template>

<script lang="js">
import topologyConfig from '../config/topology';
import RuleClusterContent from './RuleClusterContent';
export default {
  name: 'RuleCluster',

  components: {
    RuleClusterContent,
  },

  props: {
    node: Object,
  },

  data() {
    return {
      currentPage: 1,
      rulePageSize: this.node.isFirstCluster ? 6 : 4,
      ruleList: [],
    };
  },

  computed: {
    cluster() {
      return {
        width: this.node.width,
        height: this.node.height,
      };
    },
    transform() {
      return {
        cluster: `translate(${this.node?.x - topologyConfig.clusterWidth / 2 + topologyConfig.radius}, ${this.node?.y -
          topologyConfig.clusterHeight / 2 +
          topologyConfig.radius})`,
      };
    },

    ruleGroupList() {
      if (!this.ruleList.length) return [];

      const maxRuleCount = this.rulePageSize;
      const ruleGroupList = [];

      for (let i = 0; i < this.ruleList.length; i += maxRuleCount) {
        ruleGroupList.push(this.ruleList.slice(i, i + maxRuleCount));
      }

      return ruleGroupList;
    },
  },

  methods: {
    handlePageChange(pageNo) {
      this.currentPage = pageNo;
    },

    getRuleList() {
      return this.node.line.targetList.map((_) => ({
        ruleInfo: _,
        alarm: Math.floor(Math.random() * 30),
      })).sort((a, b) => b.alarm - a.alarm);
    },

    getPaginationTranslate() {
      if (!this.ruleList.length) {
        return `translate(-9999, -9999)`;
      }
      const pageSize = this.ruleGroupList[this.currentPage - 1].length;
      const contentHeight = topologyConfig.clusterHeightMapping[pageSize];
      const startHeight = (topologyConfig.clusterHeight - contentHeight) / 2
      return `translate(0, ${startHeight + contentHeight})`;
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
    }, 1000 * 10);
  }
};
</script>

<style lang="scss">
.rule-cluster__content {
  animation: fade 0.3s;
}
.rule-cluster__pagination {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
