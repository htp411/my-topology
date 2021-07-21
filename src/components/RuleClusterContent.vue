<template>
  <svg>
    <g :transform="transform.group">
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
          :dur="animationDuration"
          fill="freeze"
          rotate="auto"
          repeatCount="indefinite"
        >
          <mpath :xlink:href="'#' + getLineId(index)"></mpath>
        </animateMotion>
      </circle>

      <rect
        :width="content.width"
        :height="content.height"
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
        :r="content.ruleRadius"
        fill="#227D51"
        :transform="`translate(${rule.x},${rule.y})`"
      ></circle>

      <circle
        v-for="(p, i) in gatherPoints"
        :key="'gather-point-' + i"
        :r="8"
        fill="rgba(127,127,127,1)"
        :transform="`translate(${p.x},${p.y})`"
      ></circle>
      <text
        v-for="(rule, index) of rules"
        :key="'text-' + index"
        fill="#fff"
        :transform="`translate(${rule.x - 25},${rule.y})`"
      >
        {{ rule.ruleInfo.id }}/{{ rule.alarm }}
      </text>
      <foreignObject
        :height="content.kpiTextBlockHeight"
        :width="content.kpiTextBlockWidth"
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
          :height="content.httpCodeBlockHeight"
          :width="content.httpCodeBlockWidth"
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
        :height="content.ruleNameBlockHeight"
        :width="content.ruleNameBlockWidth"
        v-for="(rule, index) of ruleNameList"
        :key="'rule-name-' + index"
        :transform="`translate(${rule.x}, ${rule.y})`"
      >
        <span class="foreign-object__root-item rule-name">{{ rule.name }}</span>
      </foreignObject>
    </g>
  </svg>
</template>

<script>
import topologyConfig from '../config/topology';
import * as d3 from 'd3';
import Generator from '../utils/genarator';

export default {
  name: 'RuleClusterContent',

  components: {},

  props: {
    ruleGroup: {
      type: Array,
      required: true,
    },
    line: {
      type: Object,
      required: true,
    },
    isFirstCluster: {
      type: Boolean,
      default: false,
    },
    rulePageSize: {
      type: [Number, String],
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
      contentId: Generator.randomString(),
      httpCodeBlockVisible,
    };
  },

  computed: {
    content() {
      return {
        padding: 10,
        ruleRadius: topologyConfig.ruleRadius,
        width: topologyConfig.clusterWidth,
        height: topologyConfig.getClusterHeight(this.ruleGroup.length),
        kpiTextBlockWidth: 200,
        kpiTextBlockHeight: 150,
        kpiTextBlockX: 88,
        clusterKpiTextBlockX: 288,
        httpCodeBlockHeight: 72,
        httpCodeBlockWidth: 220,
        ruleNameBlockWidth: 200,
        ruleNameBlockHeight: 36,
      };
    },
    ruleAxis() {
      return {
        x:
          this.content.kpiTextBlockX +
          this.content.kpiTextBlockWidth +
          this.content.ruleRadius * 3 +
          10,
        clusterX: 150,
      };
    },
    transform() {
      return {
        group: `translate(${2},${
          2 +
          (topologyConfig.getClusterHeight(this.rulePageSize) -
            this.content.height) /
            2
        })`,
      };
    },

    rules() {
      const ruleRadius = topologyConfig.ruleRadius;
      const ruleCount = this.ruleGroup.length;
      const blackSpaceCount = ruleCount + 1;
      const blackSpaceHeight =
        (this.content.height - ruleCount * ruleRadius * 2) / blackSpaceCount;

      return this.ruleGroup.map((rule, i) => ({
        ruleInfo: rule.ruleInfo,
        alarm: rule.alarm,
        x: this.isFirstCluster ? this.ruleAxis.clusterX : this.ruleAxis.x,
        y: blackSpaceHeight * (i + 1) + i * ruleRadius * 2 + ruleRadius,
      }));
    },

    gatherPoints() {
      const gatherPoints = ['', ''].map((d, i) => ({
        x: i === 0 ? 6 : topologyConfig.clusterWidth,
        y: this.content.height / 2 - 2,
      }));

      if (this.isFirstCluster) {
        gatherPoints.shift();
      }

      return gatherPoints;
    },

    linkLines() {
      const isSingleRule = this.rules.length === 1;

      const linkLines = this.rules.map((d) => {
        return {
          id: Math.random(),
          points: [
            { x: 8, y: this.gatherPoints[0].y },
            { x: 15, y: this.gatherPoints[0].y },
            { x: this.isFirstCluster ? 160 : 88, y: d.y },
            {
              x: this.isFirstCluster
                ? d.x +
                  this.content.kpiTextBlockWidth +
                  this.content.ruleRadius * 3.6
                : d.x + this.content.ruleRadius + this.content.ruleRadius * 1.6,
              y: d.y,
            },
            { x: this.content.width - 8, y: this.gatherPoints[0].y },
            { x: this.content.width, y: this.gatherPoints[0].y },
          ],
        };
      });

      if (isSingleRule) {
        linkLines.forEach((_) => {
          _.points.forEach((p) => (p.y = this.gatherPoints[0].y));
        });
      }

      if (this.isFirstCluster) {
        linkLines.forEach((_) => {
          _.points.splice(0, 2);
        });
      }

      return linkLines;
    },

    animationDuration() {
      const num1 = Math.floor(Math.random() * 5) + 6;
      const num2 = Math.floor(Math.random() * 10);

      return `${num1}.${num2}`;
    },

    kpiList() {
      return this.line.kpis || [];
    },

    kpiData() {
      const kpiList = [...this.kpiList];
      if (kpiList.length % 2 !== 0) {
        kpiList.unshift('');
      }
      return this.rules.map((rule) => ({
        x: this.isFirstCluster
          ? this.content.clusterKpiTextBlockX
          : this.content.kpiTextBlockX,
        y: rule.y - this.content.kpiTextBlockHeight / 2,
        kpiInfo: kpiList.map((_) => ({
          key: _,
          value: Math.floor(Math.random() * 50),
        })),
      }));
    },
    httpCOdeData() {
      return this.rules.map((rule) => ({
        x: rule.x - this.content.httpCodeBlockWidth / 2,
        y: rule.y - this.content.kpiTextBlockHeight / 1.32,
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
        x: d.x - this.content.ruleNameBlockWidth / 2,
        y: d.y + this.content.ruleRadius + this.content.padding / 3,
        name: d.ruleInfo.ruleInfo
          ? d.ruleInfo.ruleInfo.ruleName
          : d.ruleInfo.netLabelName,
      }));
    },
  },

  watch: {
    linkLines() {
      this.drawLine();
    },
    ruleGroup() {
      this.$nextTick(() => {
        this.drawLine();
      });
    },
  },

  methods: {
    getLineId(index) {
      return `${this.contentId.toString()}-${index}`;
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

<style lang="scss">
ul {
  list-style: none;
}
.foreign-object__root-item {
  height: 100%;
  width: 100%;
  color: #a0a0a0;
  &.kpi-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    span.kpi {
      padding: 5px;
      border: 1px solid lightgray;
      border-radius: 3px;
      margin: 3px 0;
      &.kpi-hidden {
        opacity: 0;
      }
    }
  }
  .http-code__list {
    display: flex;
    flex-direction: column;
    border: 1px solid #a0a0a0;
    border-radius: 3px;
    .http-code__item {
      display: flex;
      &:nth-child(odd) {
        border-bottom: 1px dashed #a0a0a0;
      }
      span {
        width: 50%;
        padding: 5px;
        &:last-child {
          border-left: 1px dashed darkgray;
        }
      }
    }
  }
}
.rule-name {
  text-align: center;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
