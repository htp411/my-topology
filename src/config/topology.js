const topologyModelStr = window.localStorage.getItem('topologyModel');
const defaultTopologyModel = {
  model: 'pagination',
  pageSize: 4,
};

export default {
  defaultTopologyModel,
  pageModel: topologyModelStr
    ? JSON.parse(topologyModelStr)
    : defaultTopologyModel,
  padding: 50,
  blockWidth: 110,
  blockHeight: 110,
  imageWidth: 32,
  imageHeight: 32,
  radius: 55,
  ruleBlockWidth: 80,
  ruleBlockHeight: 80,
  ruleImageHeight: 16,
  ruleImageWidth: 16,
  ruleRadius: 40,
  ruleGroupHeight: 75,
  ruleGroupCircleRadius: 25,
  maxTopologyLength: 9,
  minTopologyLength: 2,
  clusterWidth: 580,
  clusterHeight: 1800,
  getClusterHeight(ruleCount) {
    const defaultMapping = {
      1: 288,
      2: 510,
      3: 680,
      4: 888,
      6: 1280,
      8: 1520,
    };

    return defaultMapping[ruleCount] || 220 * ruleCount;
  },
};
