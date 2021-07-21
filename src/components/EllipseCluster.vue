<template>
  <g :transform="transform.cluster">
    <svg :width="cluster.width" :height="cluster.height">
      <path
        v-for="(line, index) of linkLines"
        :key="line.id"
        fill="none"
        stroke="rgba(127,127,127,1)"
        :id="getLineId(index)"
        class="animation-line"
      ></path>

      <circle
        v-for="(line, index) of linkLines"
        :key="'animation' + index"
        :y="-5"
        :r="5"
        class="animation-circle"
        :fill="'url(#grey_blue)'"
      >
        <animateMotion
          :dur="getAnimationDuration()"
          fill="freeze"
          rotate="auto"
          repeatCount="indefinite"
        >
          <mpath :xlink:href="'#' + getLineId(index)"></mpath>
        </animateMotion>
      </circle>

      <rect
        v-if="false"
        :width="cluster.width"
        :height="cluster.height"
        rx="5"
        ry="5"
        fill="none"
        stroke-width="2"
        style="stroke-dasharray: 10"
        stroke="rgb(118, 168, 224)"
      ></rect>

      <circle
        v-for="(rule, index) of rules"
        :key="index"
        :r="cluster.ruleRadius"
        fill="#227D51"
        :transform="`translate(${rule.x},${rule.y})`"
      ></circle>
    </svg>
    <circle
      v-for="(p, i) in gatherPoints"
      :key="'gather-point-' + i"
      :r="20"
      fill="rgba(127,127,127,1)"
      :transform="`translate(${p.x - 20},${p.y})`"
    ></circle>
    <text
      fill="#fff"
      style="font-size: 20px"
      :transform="`translate(${gatherPoints[0].x - 25},${
        gatherPoints[0].y + 5
      })`"
      >1</text
    >

    <text
      v-for="(rule, index) of rules"
      :key="'text-' + index"
      fill="#fff"
      :transform="`translate(${rule.x - 25},${rule.y})`"
    >
      {{ rule.id }}/{{ rule.alarm }}
    </text>

    <foreignObject
      :height="cluster.kpiTextBlockHeight"
      :width="cluster.kpiTextBlockWidth"
      v-for="(ruleKpi, index) in kpiData"
      :key="'rule-kpi' + index"
      :transform="`translate(${ruleKpi.x}, ${ruleKpi.y})`"
    >
      <div class="foreign-object__root-item kpi-wrapper">
        <span
          v-for="kpi in ruleKpi.kpiInfo"
          :key="kpi.key"
          :class="['kpi', { 'kpi-hidden': !kpi.key }]"
          >{{ kpi.key ? `${kpi.key}: ${kpi.value}` : '请绑定KPI' }}</span
        >
      </div>
    </foreignObject>

    <template v-if="httpCodeBlockVisible">
      <foreignObject
        :height="cluster.httpCodeBlockHeight"
        :width="cluster.httpCodeBlockWidth"
        v-for="(httpCode, index) in httpCOdeData"
        :key="'http-code' + index"
        :transform="`translate(${httpCode.x},${httpCode.y})`"
      >
        <div class="foreign-object__root-item">
          <ul class="http-code__list">
            <li
              v-for="(code, index) in httpCode.httpCodeInfo"
              :key="'http-code-key' + index"
              class="http-code__item"
            >
              <span>{{ code.key }}数量: {{ code.value.baseline }}</span>
              <span>上周同期: {{ code.value.lastWeek }}</span>
            </li>
          </ul>
        </div>
      </foreignObject>
    </template>

    <foreignObject
      :height="cluster.ruleNameBlockHeight"
      :width="cluster.ruleNameBlockWidth"
      v-for="(rule, index) of ruleNameList"
      :key="'rule-name-' + index"
      :transform="`translate(${rule.x}, ${rule.y})`"
    >
      <span class="foreign-object__root-item rule-name">{{ rule.name }}</span>
    </foreignObject>
  </g>
</template>

<script>
import * as d3 from 'd3';

import topologyConfig from '../config/topology';
import Generator from '../utils/genarator';

export default {
  name: 'EllipseCluster',

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
      type: Number,
      required: true,
    },
  },

  data() {
    let httpCodeBlockVisible;

    const localeStr = window.localStorage.getItem('httpCodeBlockVisible');

    if (localeStr != null) {
      httpCodeBlockVisible = JSON.parse(localeStr).visible;
    }
    return {
      ruleList: [],
      httpCodeBlockVisible,
      contentId: Generator.randomString(),
      rulePageSize: this.node.line.targetList.length,
    };
  },

  computed: {
    deviceIndex() {
      return this.topologyData.findIndex((_) => this.node.id === _.id);
    },

    cluster() {
      return {
        padding: 10,
        width: this.node.width,
        height: this.node.height,
        ruleRadius: topologyConfig.ruleRadius,
        topBarHeight: 36,
        kpiTextBlockWidth: 200,
        kpiTextBlockHeight: 150,
        kpiTextBlockX: this.httpCodeBlockVisible ? 198 : 168,
        clusterKpiTextBlockX: 288,
        httpCodeBlockHeight: 72,
        httpCodeBlockWidth: 220,
        ruleNameBlockWidth: 200,
        ruleNameBlockHeight: 36,
      };
    },

    ruleAxis() {
      return {
        x: 50,
        clusterX: 66,
      };
    },

    transform() {
      return {
        cluster: `translate(${
          this.node?.x -
          topologyConfig.ellipseClusterWidth / 2 +
          topologyConfig.radius
        }, ${
          this.node?.y -
          topologyConfig.getClusterHeight(this.rulePageSize) / 2 +
          topologyConfig.radius
        })`,
      };
    },

    rules() {
      const ruleRadius = topologyConfig.ruleRadius;
      const ruleCount = this.node.line.targetList.length;
      const blackSpaceCount = ruleCount + 1;
      const blackSpaceHeight =
        (this.cluster.height - ruleCount * ruleRadius * 2) / blackSpaceCount;

      return this.node.line.targetList.map((rule, i) => ({
        id: rule.id,
        ruleInfo: rule.ruleInfo,
        alarm: Math.floor(Math.random() * 100),
        x: this.ruleAxis.clusterX,
        y: blackSpaceHeight * (i + 1) + i * ruleRadius * 2 + ruleRadius,
      }));
    },

    gatherPoints() {
      return [
        {
          x: topologyConfig.ellipseClusterWidth,
          y: this.cluster.height / 2,
        },
      ];
    },

    linkLines() {
      const isSingleRule = this.rules.length === 1;

      const linkLines = this.rules.map((d) => {
        console.log(this.httpCodeBlockVisible);
        return {
          id: Math.random(),
          points: [
            { x: this.ruleAxis.clusterX + this.cluster.ruleRadius / 2, y: d.y },
            {
              x:
                d.x +
                (this.httpCodeBlockVisible
                  ? this.cluster.clusterKpiTextBlockX + 68
                  : this.cluster.clusterKpiTextBlockX + 50),
              y: d.y,
            },
            { x: this.cluster.width - 8, y: this.gatherPoints[0].y },
            { x: this.cluster.width, y: this.gatherPoints[0].y },
          ],
        };
      });

      if (isSingleRule) {
        linkLines.forEach((_) => {
          _.points.forEach((p) => (p.y = this.gatherPoints[0].y));
        });
      }

      return linkLines;
    },

    kpiList() {
      return this.node.line.kpis || [];
    },

    kpiData() {
      const kpiList = [...this.kpiList];
      if (kpiList.length % 2 !== 0) {
        kpiList.unshift('');
      }
      return this.rules.map((rule) => ({
        x: this.isFirstCluster
          ? this.cluster.clusterKpiTextBlockX
          : this.cluster.kpiTextBlockX,
        y: rule.y - this.cluster.kpiTextBlockHeight / 2,
        kpiInfo: kpiList.map((_) => ({
          key: _,
          value: Math.floor(Math.random() * 50),
        })),
      }));
    },

    httpCOdeData() {
      return this.rules.map((rule) => ({
        x: rule.x - this.cluster.httpCodeBlockWidth / 2,
        y: rule.y - this.cluster.kpiTextBlockHeight / 1.32,
        httpCodeInfo: ['4XX', '5XX'].map((_) => ({
          key: _,
          value: {
            baseline: Math.floor(Math.random() * 20),
            lastWeek: Math.floor(Math.random() * 20),
          },
        })),
      }));
    },

    ruleNameList() {
      return this.rules.map((d) => ({
        x: d.x - this.cluster.ruleNameBlockWidth / 2,
        y: d.y + this.cluster.ruleRadius + this.cluster.padding / 3,
        name: d.ruleInfo ? d.ruleInfo.ruleName : d.netLabelName,
      }));
    },
  },

  methods: {
    getRuleList() {
      return this.node.line.targetList
        .map((_) => ({
          ruleInfo: _,
          alarm: Math.floor(Math.random() * 30),
        }))
        .sort((a, b) => b.alarm - a.alarm);
    },

    getLineId(index) {
      return `${this.contentId.toString()}-${index}`;
    },

    getAnimationDuration() {
      const num1 = Math.floor(Math.random() * 5) + 6;
      const num2 = Math.floor(Math.random() * 10);

      return `${num1}.${num2}`;
    },

    drawLine() {
      const line = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y);
      line.curve(d3.curveMonotoneX);

      this.linkLines.forEach(({ points }, i) => {
        d3.select(`#${this.getLineId(i)}`)
          .datum(points)
          .attr('d', line);
      });
    },
  },

  mounted() {
    this.drawLine();
  },
};
</script>

<style scoped></style>
