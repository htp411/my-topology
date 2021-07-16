<template>
  <svg
    id="main-graph"
    :width="svgWidth"
    :height="svgHeight"
    :transform="svgTransform"
  >
    <def-list></def-list>
    <g
      v-if="topologyVisible"
      class="topology-group"
      :transform="groupTransform"
    >
      <topology-line
        v-for="(line, index) in lines"
        :key="lineKeys[index]"
        :line="line"
        :index="index"
      ></topology-line>
      <component
        :is="getComponentsByType(node.type)"
        v-for="(node, index) in nodes"
        :key="index"
        :node="node"
      ></component>
    </g>
  </svg>
</template>

<script>
import { TopologyLayout } from '../utils/init-layout';
import topologyData from '../config/topology-data';
import { DataParseUtil } from '../utils/data-parser';
import Device from './Device.vue';
import Line from './Lines.vue';
import Rule from './Rule.vue';
import Defs from './Defs.vue';
import RuleCluster from './RuleCluster.vue';
import { zoom, select } from 'd3';
import Generator from '../utils/genarator';
import topologyConfig from '../config/topology';
export default {
  name: 'Topology',

  components: {
    Device,
    Rule,
    RuleCluster,
    DefList: Defs,
    TopologyLine: Line,
  },

  props: {
    msg: String,
  },

  data() {
    return {
      svgWidth: 200,
      svgHeight: 200,
      nodes: [],
      lines: [],
      groupScale: 0.9,
      groupTranslateX: 0,
      groupTranslateY: 0,
      svgScale: 1,
      svgTranslateX: 0,
      svgTranslateY: 0,
      topologyVisible: false,
    };
  },

  computed: {
    lineKeys() {
      return this.lines.map(() => Generator.randomString());
    },
    svgTransform() {
      let scale, translate;

      if (!isNaN(this.svgScale)) {
        scale = `scale(${this.svgScale})`;
      }

      if (!isNaN(this.svgTranslateX) && !isNaN(this.svgTranslateY)) {
        translate = `translate(${this.svgTranslateX},${this.svgTranslateY})`;
      }

      return `${scale ? scale : ''} ${translate ? translate : ''}`;
    },

    groupTransform() {
      let scale, translate;

      if (!isNaN(this.groupScale)) {
        scale = `scale(${this.groupScale})`;
      }

      if (!isNaN(this.groupTranslateX) && !isNaN(this.groupTranslateY)) {
        if (!this.isBackTracing) {
          translate = `translate(${this.groupTranslateX},${this.groupTranslateY})`;
        } else {
          translate = `translate(${this.groupTranslateX + 50},${
            this.groupTranslateY
          })`;
        }
      }

      return `${scale ? scale : ''} ${translate ? translate : ''}`;
    },
  },

  created() {
    this.getNodeAndLines();
  },

  methods: {
    getComponentsByType(type) {
      const componentsMapping = {
        device: 'device',
        rule: 'rule',
        ruleCluster: 'rule-cluster',
      };
      return componentsMapping[type];
    },

    getNodeAndLines() {
      console.log(DataParseUtil);
      const data = DataParseUtil.topology(topologyData);
      const { nodes, edges, dagre } = TopologyLayout.getNodesAndEdgess(data);
      this.nodes = nodes;
      this.lines = edges;
      this.svgWidth = dagre.graph().width;
      this.svgHeight = dagre.graph().height + topologyConfig.padding * 2;
      this.topologyVisible = true;
      this.$nextTick(() => {
        this.bindGraphZoom();
      });
    },

    updateGroupZoom(transform) {
      const { k, x, y } = transform;
      this.groupScale = k;
      this.groupTranslateX = x;
      this.groupTranslateY = y;
    },

    bindGraphZoom() {
      const z = zoom().scaleExtent([0.05, 3]);
      const svg = select(`#main-graph`);
      const zoomCall = svg.call(
        z.on('zoom', (e) => {
          const { transform } = e;
          this.updateGroupZoom(transform);
        })
      );

      zoomCall.on('dblclick.zoom', null);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.topology {
  span {
    color: red;
  }
}
</style>
