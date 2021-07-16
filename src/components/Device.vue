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
  },

  computed: {
    device() {
      return {
        width: topologyConfig.blockWidth,
        height: topologyConfig.blockHeight,
        radius: topologyConfig.radius,
      };
    },
    transform() {
      return {
        device: `translate(${this.node?.x + this.device.radius}, ${
          this.node?.y + this.device.height / 2
        })`,
      };
    },
  },
};
</script>

<style></style>
