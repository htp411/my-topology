<template>
  <g :transform="transform.device">
    <circle
      :r="device.radius"
      :height="device.height"
      fill="rgba(0,0,0,.3)"
    ></circle>
  </g>
</template>

<script>
import topologyConfig from '../config/topology';
export default {
  props: {
    node: Object,
    topologyData: Object,
  },

  computed: {
    deviceIndex() {
      return this.topologyData.findIndex((_) => this.node.id === _.id);
    },
    device() {
      return {
        width: topologyConfig.ruleBlockWidth,
        height: topologyConfig.ruleBlockHeight,
        radius: topologyConfig.ruleRadius,
      };
    },
    transform() {
      return {
        device: `translate(${this.node.x + this.device.radius}, ${
          this.node.y + this.device.height / 2 + 10
        })`,
      };
    },
  },
};
</script>

<style></style>
