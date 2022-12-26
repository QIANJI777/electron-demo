const transmission = [
  {
    modleName: "绝缘子自爆",
    Detect_type: "insulatorBurst"
  },
  {
    modleName: "防震锤脱落",
    Detect_type: "shockHammerFallOff"
  },
  {
    modleName: "标识牌模糊",
    Detect_type: "signfuzzy"
  },
  {
    modleName: "鸟巢",
    Detect_type: "nest"
  }
];
const substation = [
  {
    modleName: "变电场景(箱门、硅胶、表计)",
    Detect_type: "bdcj"
  },
  {
    modleName: "硅胶变色",
    Detect_type: "silicone"
  },
  {
    modleName: "箱门闭合异常",
    Detect_type: "doorAbnormal"
  },
  {
    modleName: "表计异常",
    Detect_type: "meterAbnormal"
  },
  {
    modleName: "挂空悬浮物",
    Detect_type: "gkxfw"
  },
  {
    modleName: "压板状态",
    Detect_type: "platen"
  },
  {
    modleName: "呼吸器",
    Detect_type: "breath"
  }
];
const anjian = [
  {
    modleName: "未佩戴安全帽*",
    Detect_type: "aqm"
  },
  {
    modleName: "未戴安全带*",
    Detect_type: "aqd"
  },
  {
    modleName: "警戒区闯入*",
    Detect_type: "jjqcr"
  },
  {
    modleName: "作业无监护*",
    Detect_type: "zywjh"
  },
  {
    modleName: "作业现场无人*",
    Detect_type: "zyxcwr"
  },
  {
    modleName: "规范着装*",
    Detect_type: "gz"
  },
  {
    modleName: "现场吸烟*",
    Detect_type: "xy"
  },
  {
    modleName: "登高*",
    Detect_type: "dg"
  },
  {
    modleName: "现场作业安全管控*",
    Detect_type: "all"
  }
];
export default {
  transmission,
  substation,
  anjian
};
