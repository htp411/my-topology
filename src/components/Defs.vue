<template>
  <defs>
    <marker
      :id="nameSpace + 'marker'"
      markerWidth="8"
      markerHeight="8"
      refX="0"
      refY="4"
      orient="auto"
    >
      <path
        d="M 0 0 4 4 0 8"
        style="fill: none; stroke: #369; stroke-width: 1"
      />
    </marker>
    <marker
      :id="nameSpace + 'marker1'"
      markerWidth="8"
      markerHeight="8"
      refX="0"
      refY="4"
      orient="auto"
    >
      <path
        d="M 0 0 4 4 0 8"
        style="fill: none; stroke: #369; stroke-width: 0"
      />
    </marker>
    <radialGradient
      :id="nameSpace + 'grey_blue'"
      cx="50%"
      cy="50%"
      r="50%"
      fx="50%"
      fy="50%"
    >
      <stop offset="0%" style="stop-color: #fff; stop-opacity: 0.8" />
      <stop offset="60%" style="stop-color: #a0d911; stop-opacity: 0.8" />
      <stop offset="100%" style="stop-color: #52c41a; stop-opacity: 0.8" />
    </radialGradient>
    <radialGradient
      :id="nameSpace + 'grey_blue1'"
      cx="50%"
      cy="50%"
      r="50%"
      fx="50%"
      fy="50%"
    >
      <stop
        offset="0%"
        style="stop-color: rgb(255, 255, 255); stop-opacity: 0.5"
      />
      <stop
        offset="100%"
        style="stop-color: rgba(255, 86, 64, 0.81); stop-opacity: 1"
      />
    </radialGradient>
    <radialGradient
      :id="nameSpace + 'grad1'"
      cx="50%"
      cy="50%"
      r="62%"
      fx="50%"
      fy="50%"
    >
      <stop offset="36%" style="stop-color: #fff; stop-opacity: 0.62" />
      <stop offset="100%" style="stop-color: #ffd200; stop-opacity: 1" />
    </radialGradient>
  </defs>
</template>

<script>
export default {
  props: {
    nameSpace: {
      type: String,
      default: '',
    },
  },
};
</script>

<style></style>
