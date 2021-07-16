<template>
  <g :transform="lineTranslate" class="cursor-pointer">
    <path
      ref="lineRef"
      fill="none"
      stroke="rgba(0,0,0,.5)"
      :id="getLineId(index)"
    >
    </path>
    <circle :y="-5" :r="5" class="animation-circle" :fill="'url(#grey_blue)'">
      <animateMotion
        :dur="animationDuration"
        fill="freeze"
        rotate="auto"
        repeatCount="indefinite"
      >
        <mpath :xlink:href="'#' + getLineId(index)"></mpath>
      </animateMotion>
    </circle>
  </g>
</template>

<script>
import topologyConfig from '../config/topology';
import * as d3 from 'd3';

export default {
  props: {
    line: Object,
    index: Number,
  },

  computed: {
    lineTranslate() {
      const translateX = topologyConfig.blockWidth / 2;
      const translateY = topologyConfig.blockHeight / 2;
      return `translate(${translateX},${translateY})`;
    },
    x() {
      return this.line.points[0].x - topologyConfig.blockWidth / 3;
    },
    y() {
      return this.line.points[0].y - topologyConfig.blockHeight / 2;
    },
    targetListLength() {
      return (this.line.line.targetList || []).length;
    },
    animationDuration() {
      const num1 = Math.floor(Math.random() * 6) + 2;
      const num2 = Math.floor(Math.random() * 10);

      return `${num1}.${num2}`;
    },
  },

  mounted() {
    this.drawLine();
    console.log(233);
  },

  methods: {
    getLineId(index) {
      return `line-${index}`;
    },
    drawLine() {
      const p = this.line.points;
      const line = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y);

      line.curve(d3.curveNatural);
      d3.select(`#${this.getLineId(this.index)}`)
        .datum(p)
        .attr('d', line);
    },
  },
};
</script>

<style></style>
