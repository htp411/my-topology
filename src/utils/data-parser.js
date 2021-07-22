import Vue from 'vue';
import * as d3 from 'd3';
import topologyConfig from '../config/topology';
import { TopologyLayout } from './init-layout';

export class DataParseUtil {
  /**
   * 拓扑数据转化，用于计算位置
   * @param {object} topologyData
   */
  static topology(topologyData) {
    let device, line, resultData;
    try {
      device = topologyData.nodes;
      line = topologyData.lines;
      resultData = [];
    } catch (e) {
      Vue.prototype.$message.error('拓扑数据异常');
      console.error(e);
    }

    if (device.length && line.length && device.length - line.length > 1) {
      console.error('拓扑上设备数量和链路数量不匹配，已截取匹配范围的拓扑');
      device = device.slice(0, line.length + 1);
    }

    const topologyModel = topologyConfig.pageModel.model;
    const isExpandFirstCluster = topologyConfig.pageModel.expandFirstCluster;
    const isShowAll = topologyModel === 'showAll';
    const ruleListLengthArray = line.map((l) => (l.targetList || []).length);
    const firstClusterRuleSize = ruleListLengthArray[0];
    let maxRuleSize = d3.max(ruleListLengthArray);
    const { needToShareLine, lineCount } = TopologyLayout.getShareLinesInfo(
      firstClusterRuleSize
    );

    let pageSize = topologyConfig.pageModel.pageSize;

    if (needToShareLine && maxRuleSize === firstClusterRuleSize) {
      maxRuleSize = d3.max(ruleListLengthArray.slice(1));
    }

    if (isShowAll) {
      pageSize = maxRuleSize;
    }

    device.forEach((d, index) => {
      const existsClusterOnFirstLine = !!(
        line[0].targetList && line[0].targetList.length
      );

      if (index === 0 && existsClusterOnFirstLine) {
        return;
      }

      const l = line[index - 1] ? line[index - 1] : {};
      const isCluster = (l.targetList || []).length > 1;
      const isEllipseCluster = index === 1 && isExpandFirstCluster;

      resultData.push({
        id: d.id,
        type: isCluster
          ? isEllipseCluster
            ? 'ellipseCluster'
            : 'ruleCluster'
          : 'device',
        label: d.name || '未命名设备',
        width: isCluster
          ? isEllipseCluster
            ? needToShareLine
              ? topologyConfig.shareLineEllipseClusterWidth
              : topologyConfig.ellipseClusterWidth
            : topologyConfig.clusterWidth
          : topologyConfig.blockWidth,
        height: isCluster
          ? topologyConfig.getClusterHeight(
              isEllipseCluster
                ? needToShareLine
                  ? lineCount
                  : firstClusterRuleSize
                : pageSize
            )
          : topologyConfig.blockHeight,
        next: device[index + 1] ? [device[index + 1].id] : [],
        rules: line[index - 1] ? line[index - 1].targetList || [] : [],
        device: d,
        line: l,
        isFirstCluster: index === 1 && existsClusterOnFirstLine,
        modelFlag: topologyData.model_flag,
      });
    });

    return { resultData, maxRuleSize };

    // const rules = line[0].targetList || [];

    // if (!appendRule) {
    //   return resultData;
    // }
    //
    // rules.forEach((rule) => {
    //   resultData.push({
    //     id: rule.id,
    //     type: 'rule',
    //     label: getRuleName(rule),
    //     width: topologyConfig.ruleBlockWidth,
    //     height: topologyConfig.ruleBlockHeight,
    //     next: device[1] ? [device[1].id] : [],
    //     rules: [rule],
    //     line: line[0],
    //     device: device[0],
    //     modelFlag: topologyData.model_flag,
    //   });
    // });
    //
    // return resultData;
  }

  /**
   * 接口、站点、vlan数据转化
   * @param result
   * @return {{instanceGroupOption: [], instanceData: []}}
   */
  static instance(result) {
    const instanceGroupOption = []; // 接口下拉框options
    const instanceData = []; // 拍平后的接口列表，包含接口、站点、vlan、规则列表

    // 接口列表数据扁平化，element-group对应格式option组装
    result.data.server.forEach((probe) => {
      const instanceOption = [];

      probe.inst.forEach((instance) => {
        instanceOption.push({
          id: instance.id,
          label: instance.name,
          value: instance.id,
        });

        // 拍平接口的规则列表,删除原有的rule
        const ruleListGroup = [];
        const ruleList = instance.rule.reduce((ruleList, currentRule) => {
          // 填充key、label用于穿梭框显示
          currentRule.ruleList.forEach((_) => {
            _.value = _.ruleid;
            _.label = _.name;
          });
          ruleListGroup.push({
            label: currentRule.group,
            options: currentRule.ruleList,
          });
          return ruleList.concat(currentRule.ruleList);
        }, []);

        // 统一转化成字符串
        instance.vlan.forEach((_) => (_.id += ''));

        instance.ruleList = ruleList;
        instance.ruleListGroup = ruleListGroup;
        delete instance.rule;

        instanceData.push(instance);
      });

      instanceGroupOption.push({
        label: probe.name,
        options: instanceOption,
        id: probe.id,
      });
    });

    return { instanceGroupOption, instanceData };
  }
}
