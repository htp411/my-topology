import Dagre from 'dagre';

export class TopologyLayout {
  constructor() {}

  static init(data) {
    const dagre = new Dagre.graphlib.Graph()
      .setGraph({
        rankdir: 'LR',
        align: 'UL',
        edgesep: 50,
        nodesep: 160,
        ranksep: 268,
      })
      .setDefaultEdgeLabel(function () {
        return {};
      });

    this.setNodes(dagre, data);
    this.setEdges(dagre, data);

    Dagre.layout(dagre);

    return dagre;
  }

  static setNodes(dagre, data) {
    Object.values(data).forEach((v) => {
      dagre.setNode(v.id, {
        id: v.id,
        label: v.label,
        width: v.width,
        height: v.height,
        image: v.image,
        type: v.type,
        rules: v.rules,
        line: v.line,
        ipAddr: v.device ? v.device.ipAddr : undefined,
        backTracingData: v.backTracingData,
        isBackTracingIndex: v.isBackTracingIndex,
        isReportIndex: v.isReportIndex,
        connFailInfo: v.connFailInfo,
        isFirstCluster: v.isFirstCluster,
      });
    });
  }

  static setEdges(dagre, data) {
    Object.values(data).forEach((v) => {
      const next = Array.isArray(v.next) ? v.next : [];
      next.forEach((n) => dagre.setEdge(v.id, n));
    });
  }

  static getNodesAndEdgess(topologyData) {
    const dagre = TopologyLayout.init(topologyData);
    const nodes = dagre.nodes().map((v) => dagre.node(v));

    const edges = dagre.edges().map((e) => {
      let src = nodes.find((_) => _.id === +e.v);
      if (src.type === 'device') {
        src = nodes.find((_) => _.id === +e.w);
      }
      const res = dagre.edge(e) || {};
      res.src = e.v;
      res.dst = e.w;
      res.type = src.type;
      res.line = src.line;
      res.deviceOrRuleId = src.id;
      return res;
    });
    // console.log({ nodes, edges, dagre });
    return { nodes, edges, dagre };
  }

  static getShareLinesInfo(ruleSize) {
    const maxSingleLineCount = 12;
    const needToShareLine = ruleSize > maxSingleLineCount;
    let lineCount = ruleSize;

    if (needToShareLine) {
      lineCount = Math.floor(ruleSize / 2) + (lineCount % 2);
    }

    return {
      needToShareLine,
      lineCount,
    };
  }
}
