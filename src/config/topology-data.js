import topologyConfig from './topology';

const topologyModelStr = window.localStorage.getItem('topologyModel');

const firstClusterCount = +(topologyModelStr
  ? Object.assign(
      topologyConfig.defaultTopologyModel,
      JSON.parse(topologyModelStr)
    ).firstClusterCount
  : topologyConfig.defaultTopologyModel.firstClusterCount);

export default {
  nodes: [
    {
      id: 162,
      name: '客户端',
      associationId: 50,
      nodeType: 'CLIENT',
      src: {
        srcIp: false,
        srcPort: false,
      },
      tcp: {
        tcpSeq: false,
        ipId: false,
      },
      http: {
        xfp: false,
        xff: false,
      },
      httpTrace: {
        xB3TraceId: false,
      },
      enableConnFailAnalysis: false,
    },
    {
      id: 163,
      name: '2333erttt',
      ipAddr: '233.233.233.233',
      associationId: 50,
      nodeType: 'FIREWALL',
      src: {
        srcIp: false,
        srcPort: false,
      },
      tcp: {
        tcpSeq: false,
        ipId: false,
      },
      http: {
        xfp: true,
        xff: true,
      },
      httpTrace: {
        xB3TraceId: false,
      },
      enableConnFailAnalysis: true,
    },
    {
      id: 164,
      name: 'Web服务器233333',
      ipAddr: '3.3.3.3',
      associationId: 50,
      nodeType: 'WAF',
      src: {
        srcIp: false,
        srcPort: false,
      },
      tcp: {
        tcpSeq: false,
        ipId: false,
      },
      http: {
        xfp: true,
        xff: true,
      },
      httpTrace: {
        xB3TraceId: false,
      },
      enableConnFailAnalysis: false,
    },
    {
      id: 165,
      name: 'SSL233666',
      ipAddr: '',
      associationId: 50,
      nodeType: 'SSL',
      src: {
        srcIp: true,
        srcPort: true,
      },
      tcp: {
        tcpSeq: false,
        ipId: false,
      },
      http: {
        xfp: false,
        xff: false,
      },
      httpTrace: {
        xB3TraceId: false,
      },
      enableConnFailAnalysis: false,
    },
    {
      id: 166,
      name: '外联网FW',
      ipAddr: '',
      associationId: 50,
      nodeType: 'FIREWALL',
      src: {
        srcIp: true,
        srcPort: true,
      },
      tcp: {
        tcpSeq: true,
        ipId: true,
      },
      http: {
        xfp: false,
        xff: false,
      },
      httpTrace: {
        xB3TraceId: false,
      },
      enableConnFailAnalysis: false,
    },
    {
      id: 1334,
      name: '未命名设备2',
      associationId: 50,
      nodeType: 'SERVER',
      src: {
        srcIp: false,
        srcPort: false,
      },
      tcp: {
        tcpSeq: false,
        ipId: false,
      },
      http: {
        xfp: false,
        xff: false,
      },
      httpTrace: {
        xB3TraceId: true,
      },
      enableConnFailAnalysis: false,
    },
    {
      id: 1444,
      name: '未命名设备',
      ipAddr: '1.1.1.1',
      associationId: 50,
      nodeType: 'APP_SERVER_CLUSTER',
      src: {
        srcIp: false,
        srcPort: false,
      },
      tcp: {
        tcpSeq: false,
        ipId: false,
      },
      http: {
        xfp: false,
        xff: false,
      },
      httpTrace: {
        xB3TraceId: false,
      },
      enableConnFailAnalysis: false,
    },
  ],
  lines: [
    {
      id: 124,
      srcNodeId: 162,
      dstNodeId: 163,
      associationId: 50,
      kpis: [
        'totalClientBytes',
        'totalServerPkts',
        'valleyTransRespTime',
        'bytesRate',
      ],
      targetList: Array(firstClusterCount).fill({
        id: 1948,
        lineId: 124,
        instanceId: 17,
        linkLabelType: 1,
        linkLabel: 77,
        netLabelType: 4,
        netLabel: 20,
        ruleId: 2093,
        ruleInfo: {
          ruleName: 'buy.ccb.com_公网入口_电信_80',
          dstIpAddr: '59.111.0.0/16',
          dstPort: '80-80',
          ruleType: 'http',
          instFlag: '2886731275_inst0',
        },
      }),
      //   [
      //   {
      //     id: 1948,
      //     lineId: 124,
      //     instanceId: 17,
      //     linkLabelType: 1,
      //     linkLabel: 77,
      //     netLabelType: 4,
      //     netLabel: 20,
      //     ruleId: 2093,
      //     ruleInfo: {
      //       ruleName: 'buy.ccb.com_公网入口_电信_80',
      //       dstIpAddr: '59.111.0.0/16',
      //       dstPort: '80-80',
      //       ruleType: 'http',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      //   {
      //     id: 1949,
      //     lineId: 124,
      //     instanceId: 17,
      //     netLabelType: 4,
      //     netLabel: 20,
      //     ruleId: 2093,
      //     ruleInfo: {
      //       ruleName: 'buy.ccb.com_公网入口_电信_80',
      //       dstIpAddr: '59.111.0.0/16',
      //       dstPort: '80-80',
      //       ruleType: 'http',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      //   {
      //     id: 1950,
      //     lineId: 124,
      //     instanceId: 17,
      //     ruleId: 2112,
      //     ruleInfo: {
      //       ruleName: '多段关联_203(TCP_IP)',
      //       dstIpAddr: '172.22.203.133',
      //       dstPort: '0-65535',
      //       ruleType: 'http',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      //   {
      //     id: 1951,
      //     lineId: 124,
      //     instanceId: 17,
      //     ruleId: 2505,
      //     ruleInfo: {
      //       ruleName: 'APP2_CCB_APP1_SSL',
      //       dstIpAddr: '114.251.28.140',
      //       dstPort: '443',
      //       ruleType: 'ssl',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      //   {
      //     id: 1952,
      //     lineId: 124,
      //     instanceId: 17,
      //     netLabelType: 4,
      //     netLabel: 2439,
      //     ruleId: 822,
      //     ruleInfo: {
      //       ruleName: 'mongo_27019',
      //       dstIpAddr: '0.0.0.0/0',
      //       dstPort: '27019-27019',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      //   {
      //     id: 1953,
      //     lineId: 124,
      //     instanceId: 17,
      //     ruleId: 822,
      //     ruleInfo: {
      //       ruleName: 'mongo_27019',
      //       dstIpAddr: '0.0.0.0/0',
      //       dstPort: '27019-27019',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      //   {
      //     id: 1954,
      //     lineId: 124,
      //     instanceId: 17,
      //     ruleId: 1828,
      //     ruleInfo: {
      //       ruleName: 'httpV6',
      //       dstIpAddr: '::-ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      //       dstPort: '80-80',
      //       instFlag: '2886731275_inst0',
      //     },
      //   },
      // ],
      commonNode: true,
    },
    {
      id: 125,
      srcNodeId: 163,
      dstNodeId: 164,
      associationId: 50,
      kpis: [
        'totalClientBytes',
        'totalServerPkts',
        'valleyTransRespTime',
        'bytesRate',
      ],
      targetList: [
        {
          id: 1996,
          lineId: 125,
          instanceId: 17,
          ruleId: 215,
          ruleInfo: {
            ruleName: 'H.323',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '1720-1720,1731-1731',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 1997,
          lineId: 125,
          instanceId: 17,
          netLabelType: 4,
          netLabel: 20,
          netLabelName: '电信',
        },
        {
          id: 1998,
          lineId: 125,
          instanceId: 17,
          ruleId: 213,
          ruleInfo: {
            ruleName: 'DHCP',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '67-67',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 1999,
          lineId: 125,
          instanceId: 17,
          ruleId: 1829,
          ruleInfo: {
            ruleName: 'SIPv6',
            dstIpAddr: '::-ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
            dstPort: '52-52',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 2000,
          lineId: 125,
          instanceId: 17,
          ruleId: 2504,
          ruleInfo: {
            ruleName: 'APP1_ccb_app_206',
            dstIpAddr: '172.16.206.88',
            dstPort: '8080',
            ruleType: 'http',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 2001,
          lineId: 125,
          instanceId: 17,
          ruleId: 2512,
          ruleInfo: {
            ruleName: 'APP2_ccb_app_205',
            dstIpAddr: '172.16.205.188',
            dstPort: '8080',
            ruleType: 'http',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 2002,
          lineId: 125,
          instanceId: 17,
          ruleId: 2093,
          ruleInfo: {
            ruleName: 'buy.ccb.com_公网入口_电信_80',
            dstIpAddr: '59.111.0.0/16',
            dstPort: '80-80',
            ruleType: 'http',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 2003,
          lineId: 125,
          instanceId: 17,
          ruleId: 2093,
          ruleInfo: {
            ruleName: 'buy.ccb.com_公网入口_电信_80',
            dstIpAddr: '59.111.0.0/16',
            dstPort: '80-80',
            ruleType: 'http',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 2004,
          lineId: 125,
          instanceId: 17,
          ruleId: 2093,
          ruleInfo: {
            ruleName: 'buy.ccb.com_公网入口_电信_80',
            dstIpAddr: '59.111.0.0/16',
            dstPort: '80-80',
            ruleType: 'http',
            instFlag: '2886731275_inst0',
          },
        },
      ],
      commonNode: false,
    },
    {
      id: 126,
      srcNodeId: 164,
      dstNodeId: 165,
      associationId: 50,
      kpis: [
        'totalClientBytes',
        'totalServerPkts',
        'valleyTransRespTime',
        'bytesRate',
      ],
      targetList: [
        {
          id: 1982,
          lineId: 126,
          instanceId: 17,
          ruleId: 214,
          ruleInfo: {
            ruleName: 'DHCP_SRV',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '0-65535',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 1980,
          lineId: 126,
          instanceId: 17,
          ruleId: 214,
          ruleInfo: {
            ruleName: 'DHCP_SRV',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '0-65535',
            instFlag: '2886731275_inst0',
          },
        },
        {
          id: 1983,
          lineId: 126,
          instanceId: 17,
          ruleId: 822,
          ruleInfo: {
            ruleName: 'mongo_27019',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '27019-27019',
            instFlag: '2886731275_inst0',
          },
        },
      ],
      commonNode: false,
    },
    {
      id: 127,
      srcNodeId: 165,
      dstNodeId: 166,
      associationId: 50,
      kpis: [
        'totalClientBytes',
        'totalServerPkts',
        'valleyTransRespTime',
        'bytesRate',
      ],
      targetList: [
        {
          id: 1989,
          lineId: 127,
          instanceId: 17,
          ruleId: 2093,
          ruleInfo: {
            ruleName: 'buy.ccb.com_公网入口_电信_80',
            dstIpAddr: '59.111.0.0/16',
            dstPort: '80-80',
            ruleType: 'http',
            instFlag: '2886731275_inst0',
          },
        },
      ],
      commonNode: false,
    },
    {
      id: 1171,
      srcNodeId: 166,
      dstNodeId: 1334,
      associationId: 50,
      kpis: [
        'totalClientBytes',
        'totalServerPkts',
        'valleyTransRespTime',
        'bytesRate',
      ],
      targetList: [
        {
          id: 1705,
          lineId: 1171,
          instanceId: 17,
          ruleId: 214,
          ruleInfo: {
            ruleName: 'DHCP_SRV',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '0-65535',
            instFlag: '2886731275_inst0',
          },
        },
      ],
      commonNode: false,
    },
    {
      id: 1200,
      srcNodeId: 1334,
      dstNodeId: 1444,
      associationId: 50,
      kpis: [
        'totalClientBytes',
        'totalServerPkts',
        'valleyTransRespTime',
        'bytesRate',
      ],
      targetList: [
        {
          id: 1924,
          lineId: 1200,
          instanceId: 17,
          ruleId: 215,
          ruleInfo: {
            ruleName: 'H.323',
            dstIpAddr: '0.0.0.0/0',
            dstPort: '1720-1720,1731-1731',
            instFlag: '2886731275_inst0',
          },
        },
      ],
      commonNode: false,
    },
  ],
};
