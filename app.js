const stressMode = new URLSearchParams(window.location.search).has("stress");
const memberPlaceholderAvatar = "./assets/member-placeholder.png";
function formatReportDate(date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

const reportBaseDate = new Date();
const reportContext = {
  reportTimeLabel: `\u62a5\u544a\u65f6\u95f4\uff1a${formatReportDate(reportBaseDate)}`,
  annualTarget: 30000000,
  achieved: 10000000,
  teamRate: 10000000 / 30000000,
  revenueToday: 420000,
  revenueWeek: 1680000,
  revenueMonth: 3200000,
  newQualifiedLeads: 26,
  highRiskItems: 5,
  opportunityPool: 23000000,
  opportunityGap: 7000000,
  monthlyLostDeals: 10,
  requiredNewLeads: 20,
  overdueBLevelCustomers: 3,
  stalledOpportunities: 3,
  forecastPotential: 38000000,
  averageDailyTouches: 3,
  monthlyOutputPerPerson: 100000,
  focusMembers: ["Lina", "Joe"],
  nextPriorities: [
    "\u8865\u5145\u7ebf\u7d22\u6c60\uff0c\u672c\u6708\u5185\u65b0\u589e\u81f3\u5c11 20 \u4e2a\u6709\u6548\u7ebf\u7d22",
    "\u7531\u7ecf\u7406\u76f4\u63a5\u4ecb\u5165 3 \u4e2a\u505c\u6ede\u5546\u673a\uff0c\u91cd\u65b0\u63a8\u8fdb\u51b3\u7b56\u8282\u70b9",
    "\u5bf9 B \u7ea7\u5ba2\u6237\u8865\u8db3\u8ddf\u8fdb\u9891\u6b21\uff0c\u5148\u5904\u7406 3 \u4e2a\u8d85 15 \u5929\u672a\u8ddf\u8fdb\u5ba2\u6237",
    "\u9488\u5bf9 Lina \u548c Joe \u505a\u4e22\u5355\u590d\u76d8\uff0c\u8865\u5f3a\u4e2d\u540e\u671f\u5546\u673a\u8f6c\u5316",
    "\u63d0\u9ad8 A \u7ea7\u5ba2\u6237\u8d21\u732e\u5360\u6bd4\uff0c\u4f18\u5148\u6269\u5927\u9ad8\u8d28\u91cf\u5927\u5355",
  ],
};

const baseSalesTeam = [
  {
    name: "Ava",
    role: "\u5927\u5ba2\u6237\u8d1f\u8d23\u4eba",
    target: 12000000,
    achieved: 6200000,
    tagText: "\u8fdb\u5ea6\u9886\u8dd1",
    tagClass: "safe",
    dailySummary:
      "\u4e24\u4e2a A \u7ea7\u5546\u673a\u5df2\u8fdb\u5165\u5408\u540c\u786e\u8ba4\uff0c\u662f\u5f53\u524d\u56e2\u961f\u7684\u4e3b\u8981\u4e1a\u7ee9\u652f\u67f1\u3002",
    todayTasks: [
      "\u786e\u8ba4\u5408\u540c\u6761\u6b3e",
      "\u63a8\u8fdb\u56de\u6b3e\u8282\u70b9",
      "\u540c\u6b65\u51b3\u7b56\u94fe\u8def",
    ],
  },
  {
    name: "Mia",
    role: "\u884c\u4e1a\u9500\u552e",
    target: 6800000,
    achieved: 1750000,
    tagText: "\u7a33\u5b9a\u63a8\u8fdb",
    tagClass: "focus",
    dailySummary:
      "\u533b\u7597\u884c\u4e1a\u4e3b\u7ebf\u63a8\u8fdb\u7a33\u5b9a\uff0c\u4e0a\u5468\u65b0\u589e\u4e00\u7b14\u9ad8\u610f\u5411\u9700\u6c42\uff0c\u76ee\u524d\u5904\u4e8e\u65b9\u6848\u786e\u8ba4\u9636\u6bb5\u3002",
    todayTasks: [
      "\u5b8c\u6210\u4ea7\u54c1\u6f14\u793a",
      "\u8ddf\u8fdb\u91c7\u8d2d\u8282\u70b9",
      "\u540c\u6b65\u4ea4\u4ed8\u8303\u56f4",
    ],
  },
  {
    name: "Lina",
    role: "\u533a\u57df\u9500\u552e",
    target: 6200000,
    achieved: 1100000,
    tagText: "\u4e22\u5355\u504f\u591a",
    tagClass: "warn",
    dailySummary:
      "\u65b0\u7ebf\u7d22\u8fdb\u6765\u901f\u5ea6\u4e0d\u6162\uff0c\u4f46 B \u7ea7\u5ba2\u6237\u8ddf\u8fdb\u65ad\u6863\uff0c\u4e24\u4e2a\u5546\u673a\u505c\u5728\u9700\u6c42\u590d\u76d8\u9636\u6bb5\u3002",
    todayTasks: [
      "\u91cd\u65b0\u7ea6\u51b3\u7b56\u4eba",
      "\u8865\u9f50\u8ddf\u8fdb\u8bb0\u5f55",
      "\u590d\u76d8\u672c\u6708\u4e22\u5355",
    ],
  },
  {
    name: "Joe",
    role: "\u65b0\u5ba2\u9500\u552e",
    target: 5000000,
    achieved: 950000,
    tagText: "\u8ddf\u8fdb\u4e0d\u8db3",
    tagClass: "warn",
    dailySummary:
      "\u5546\u673a\u6c60\u504f\u8584\uff0c\u4e09\u4e2a\u4e2d\u540e\u671f\u6848\u5b50\u4e2d\u6709\u4e00\u4e2a\u5df2\u8d85 15 \u5929\u672a\u66f4\u65b0\uff0c\u4e1a\u7ee9\u8f6c\u5316\u538b\u529b\u8f83\u5927\u3002",
    todayTasks: [
      "\u8865\u8ddf\u8fdb B \u7ea7\u5ba2\u6237",
      "\u91cd\u65b0\u786e\u8ba4\u9884\u7b97",
      "\u63a8\u8fdb POC \u7ed3\u8bba",
    ],
  },
];

const baseCrmRecords = [
  {
    customer: "\u661f\u70ac\u5236\u9020",
    tier: "A \u7ea7",
    industry: "\u5236\u9020",
    owner: "Ava",
    opportunity: "\u667a\u9020\u534f\u540c\u5e73\u53f0\u4e8c\u671f",
    stage: "\u5408\u540c\u5ba1\u6279",
    estRevenue: 8000000,
    newRevenue: 180000,
    lastFollowup: "5 \u670831\u65e5 18:20 \u66f4\u65b0\u6761\u6b3e",
    followupStatus: "\u8ddf\u8fdb\u6b63\u5e38",
    contributionNote: "\u5f53\u524d\u6700\u5927\u8d21\u732e\u5ba2\u6237",
    opportunityStatus: "\u7b7e\u7ea6\u524d\u786e\u8ba4",
    risk: "\u4f4e",
    customerRisk: "\u5173\u7cfb\u7a33\u5b9a",
    opportunityRisk: "\u8fdb\u5ea6\u7a33\u5b9a",
  },
  {
    customer: "\u6cf0\u548c\u533b\u7597",
    tier: "A \u7ea7",
    industry: "\u533b\u7597",
    owner: "Mia",
    opportunity: "\u91cd\u70b9\u5ba2\u6237\u7ecf\u8425\u5e73\u53f0",
    stage: "\u65b9\u6848\u786e\u8ba4",
    estRevenue: 5000000,
    newRevenue: 120000,
    lastFollowup: "5 \u670831\u65e5 16:10 \u65b9\u6848\u6f14\u793a",
    followupStatus: "\u8ddf\u8fdb\u6b63\u5e38",
    contributionNote: "A \u7ea7\u5ba2\u6237\u4ecd\u9700\u63d0\u9ad8\u8d21\u732e",
    opportunityStatus: "\u7b49\u5f85\u91c7\u8d2d\u53cd\u9988",
    risk: "\u4e2d",
    customerRisk: "\u9884\u7b97\u786e\u8ba4\u4e2d",
    opportunityRisk: "\u9700\u76ef\u7d27\u91c7\u8d2d\u7a97\u53e3",
  },
  {
    customer: "\u6d77\u8fb0\u6559\u80b2",
    tier: "B \u7ea7",
    industry: "\u6559\u80b2",
    owner: "Joe",
    opportunity: "\u6821\u56ed\u62db\u91c7\u7cfb\u7edf",
    stage: "\u5546\u52a1\u8c08\u5224",
    estRevenue: 3500000,
    newRevenue: 0,
    lastFollowup: "5 \u670814\u65e5\u540e\u672a\u66f4\u65b0",
    followupStatus: "\u8d85 15 \u5929\u672a\u8ddf\u8fdb",
    contributionNote: "B \u7ea7\u5ba2\u6237\u9700\u7ecf\u7406\u534f\u540c",
    opportunityStatus: "\u63a8\u8fdb\u505c\u6ede",
    risk: "\u9ad8",
    customerRisk: "\u51b3\u7b56\u94fe\u8def\u4e0d\u7a33\u5b9a",
    opportunityRisk: "\u5546\u673a\u5df2\u505c\u6ede 18 \u5929",
  },
  {
    customer: "\u5317\u8fb0\u96f6\u552e",
    tier: "B \u7ea7",
    industry: "\u96f6\u552e",
    owner: "Lina",
    opportunity: "\u6e20\u9053\u4f1a\u5458\u7cfb\u7edf",
    stage: "\u9700\u6c42\u590d\u76d8",
    estRevenue: 2500000,
    newRevenue: 0,
    lastFollowup: "5 \u670815\u65e5\u540e\u672a\u66f4\u65b0",
    followupStatus: "\u8d85 15 \u5929\u672a\u8ddf\u8fdb",
    contributionNote: "\u672c\u6708\u4e22\u5355\u539f\u56e0\u5f85\u590d\u76d8",
    opportunityStatus: "\u63a8\u8fdb\u505c\u6ede",
    risk: "\u9ad8",
    customerRisk: "\u9700\u6c42\u8303\u56f4\u672a\u953b\u5b9a",
    opportunityRisk: "\u5546\u673a\u5df2\u505c\u6ede 16 \u5929",
  },
  {
    customer: "\u5c71\u5ddd\u7269\u6d41",
    tier: "B \u7ea7",
    industry: "\u7269\u6d41",
    owner: "Joe",
    opportunity: "\u8fd0\u8f93\u534f\u540c\u5e73\u53f0",
    stage: "POC \u9a8c\u8bc1",
    estRevenue: 2000000,
    newRevenue: 0,
    lastFollowup: "5 \u670813\u65e5\u540e\u672a\u66f4\u65b0",
    followupStatus: "\u8d85 15 \u5929\u672a\u8ddf\u8fdb",
    contributionNote: "\u4ecd\u5728\u7b49\u5f85\u5ba2\u6237\u56de\u4f20\u9a8c\u8bc1\u7ed3\u8bba",
    opportunityStatus: "\u63a8\u8fdb\u505c\u6ede",
    risk: "\u4e2d",
    customerRisk: "\u4e1a\u52a1\u65b9\u6ca1\u6709\u7ed9\u51fa\u4e0b\u4e00\u6b65\u65f6\u95f4",
    opportunityRisk: "\u9700\u7ecf\u7406\u4ecb\u5165\u63a8\u8fdb",
  },
  {
    customer: "\u4e91\u5cb3\u79d1\u6280",
    tier: "A \u7ea7",
    industry: "\u79d1\u6280",
    owner: "Lina",
    opportunity: "\u6d77\u5916\u5206\u9500\u7ba1\u7406\u9879\u76ee",
    stage: "\u521d\u6b65\u63a5\u89e6",
    estRevenue: 2000000,
    newRevenue: 120000,
    lastFollowup: "5 \u670831\u65e5 11:00 \u9996\u8f6e\u9700\u6c42\u6c9f\u901a",
    followupStatus: "\u65b0\u8fdb\u5546\u673a",
    contributionNote: "\u53ef\u4f5c\u4e3a 6 \u6708\u8865\u5145\u5546\u673a\u6c60",
    opportunityStatus: "\u65b0\u589e\u5132\u5907",
    risk: "\u4f4e",
    customerRisk: "\u4ecd\u5728\u5efa\u7acb\u5173\u7cfb",
    opportunityRisk: "\u672a\u8fdb\u5165\u4e2d\u540e\u671f",
  },
];

const salesTeam = stressMode
  ? baseSalesTeam.map((member, index) => ({
      ...member,
      name: `${member.name} 压测超长姓名 ${index + 1}`,
      role: `${member.role} / 压测超长职责描述 / 华东重点客户拓展负责人`,
      target: member.target * 100,
      achieved: member.achieved * 100 + 88888,
      dailySummary: `${member.dailySummary} 当前处于极限压测模式，用于验证长文本、长金额和多段信息在所有容器中的显示是否稳定。`,
      todayTasks: [...member.todayTasks, "追加长文本任务压测", "跨区域协同推进复核"],
    }))
  : baseSalesTeam;

const crmRecords = stressMode
  ? baseCrmRecords.map((record) => ({
      ...record,
      customer: `${record.customer} / 压测超长客户名称有限公司`,
      opportunity: `${record.opportunity} / 压测超长商机名称版本 / 多部门联合推进场景`,
      estRevenue: record.estRevenue * 100,
      lastFollowup: `${record.lastFollowup}，并补充了跨部门会签、预算复核与下一轮会议排期说明。`,
      opportunityRisk: `${record.opportunityRisk}，同时存在周期拉长与关键人反馈延迟。`,
    }))
  : baseCrmRecords;

const salesActivities = stressMode
  ? [
      {
        time: "09:12",
        tag: "合同回传",
        level: "safe",
        title: "Ava 推进星炬制造合同复核",
        body: "法务已回传修订版，补充了签署页与回款节点，预计今日完成最终确认。",
      },
      {
        time: "10:40",
        tag: "商机推进",
        level: "focus",
        title: "Mia 更新医疗行业方案演示",
        body: "客户侧已确认演示窗口，当前重点是把采购、业务和 IT 三方的关注点对齐。",
      },
      {
        time: "13:15",
        tag: "风险跟进",
        level: "warn",
        title: "Lina 重新激活两个停滞商机",
        body: "其中一个项目已超过 15 天未更新，已补充下一次会议时间和决策人名单。",
      },
      {
        time: "15:20",
        tag: "丢单复盘",
        level: "warn",
        title: "Joe 补充本月丢单原因记录",
        body: "主要集中在预算审批延迟和业务侧未明确下一步目标，已转入复盘列表。",
      },
    ]
  : [
      {
        time: "09:08",
        tag: "签约推进",
        level: "safe",
        title: "Ava 完成星炬制造条款确认",
        body: "客户已确认付款节点，法务版本进入最终审核，预计今天下午可完成回传。",
      },
      {
        time: "10:26",
        tag: "方案评审",
        level: "focus",
        title: "Mia 向泰和医疗补充演示材料",
        body: "采购与业务部门已参加评审，当前等待 IT 安全项补充说明。",
      },
      {
        time: "12:14",
        tag: "重点跟进",
        level: "warn",
        title: "Lina 更新北辰零售商机状态",
        body: "该项目已超过 15 天未更新，已补发会议纪要并锁定下次沟通时间。",
      },
      {
        time: "14:55",
        tag: "团队复盘",
        level: "focus",
        title: "Joe 提交渠道会员系统复盘",
        body: "本轮卡点集中在预算确认和回款节点，下一步改为先推进 POC 结果确认。",
      },
      {
        time: "16:40",
        tag: "日报同步",
        level: "safe",
        title: "团队完成今日销售简报更新",
        body: "客户商机、风险与跟进动作已同步到日报，便于晚间例会直接复盘。",
      },
    ];

const dashboardDocument = {
  title: "销售团队看板",
  ui: {
    heroTitle: "销售团队看板",
    dateCardLabel: "查看日期",
    datePickerAriaLabel: "选择日期",
    dateShortcutsAriaLabel: "快速切换日期",
    dateShortcuts: [
      { label: "昨天", offset: -1 },
      { label: "前天", offset: -2 },
      { label: "大前天", offset: -3 },
    ],
    chatFabLabel: "AI",
    chatFabAriaLabel: "打开 AI 助手",
    chatTitle: "AI 助手",
    chatCloseLabel: "×",
    chatCloseAriaLabel: "关闭 AI 助手",
    chatInputLabel: "输入问题",
    chatPlaceholder: "例如：今年目标还差多少？哪些 B 级客户超过 15 天未跟进？",
  },
  heroSummary: `年度达成 ${Math.round(reportContext.teamRate * 100)}% · 已完成 ${formatCompactCurrency(
    reportContext.achieved
  )} · 商机缺口 ${formatCompactCurrency(reportContext.opportunityGap)} · 风险项 ${reportContext.highRiskItems}`,
  sections: {
    overview: {
      heading: "综合统计",
      intro: "",
      metrics: [
        {
          prefix: "🎯",
          label: "年度达成",
          value: `${Math.round(reportContext.teamRate * 100)}%`,
          note: `目标 ${formatCompactCurrency(reportContext.annualTarget)}，已完成 ${formatCompactCurrency(
            reportContext.achieved
          )}`,
        },
        {
          prefix: "📉",
          label: "商机池缺口",
          value: formatCompactCurrency(reportContext.opportunityGap),
          note: `当前商机池 ${formatCompactCurrency(reportContext.opportunityPool)}`,
        },
        {
          prefix: "⚠️",
          label: "重点风险",
          value: `${reportContext.highRiskItems}`,
          note: `商机 ${reportContext.stalledOpportunities} / B 级客户 ${reportContext.overdueBLevelCustomers} / 头部依赖 1`,
        },
      ],
      cards: [
        {
          titlePrefix: "📊",
          title: "业绩达成",
          body: `**年度目标：** ${formatCompactCurrency(reportContext.annualTarget)} / 年。**当前达成：** ${formatCompactCurrency(
            reportContext.achieved
          )}。**达成率：** ${Math.round(reportContext.teamRate * 100)}%。`,
        },
        {
          titlePrefix: "🧭",
          title: "商机与线索",
          body: `**线索池：** ${reportContext.newQualifiedLeads} 个有效线索。**商机池：** 预计成交 ${formatCompactCurrency(
            reportContext.opportunityPool
          )}，仍缺口 ${formatCompactCurrency(reportContext.opportunityGap)}。**本月丢单：** ${reportContext.monthlyLostDeals} 单。`,
        },
        {
          titlePrefix: "👥",
          title: "客户与团队",
          body: `**A 级客户：** 跟进频率正常。**B 级客户：** ${reportContext.overdueBLevelCustomers} 个超 15 天未跟进。**团队强度：** 平均每人每天跟进 ${reportContext.averageDailyTouches} 次。**重点关注：** ${reportContext.focusMembers.join(" / ")}。`,
        },
        {
          titlePrefix: "✅",
          title: "下一步重点",
          body: `${reportContext.nextPriorities.slice(0, 3).map((item) => `- ${item}`).join("\n")}`,
        },
      ],
    },
    member: {
      heading: "成员业绩",
      intro: "",
    },
    risk: {
      heading: "风险预警",
      intro: "",
      cards: [
        {
          titlePrefix: "🚧",
          title: "商机风险",
          tag: "需要经理介入",
          level: "warn",
          summary: `目前有 ${reportContext.stalledOpportunities} 个商机推进停滞，总预计成交额 ${formatCompactCurrency(
            8000000
          )}，需要重新锁定决策时间和下一步节点。`,
        },
        {
          titlePrefix: "👥",
          title: "客户风险",
          tag: "A 级贡献偏低",
          level: "focus",
          summary:
            "A 级客户的业绩贡献比例仍然不够高，而 B 级客户中有 3 个超过 15 天未跟进，跟进节奏需要补齐。",
        },
        {
          titlePrefix: "⚖️",
          title: "团队风险",
          tag: "头部依赖",
          level: "warn",
          summary:
            "目前 1 人贡献超过 60%，团队头部依赖风险明显。Lina 和 Joe 的业绩进度低于平均值，且丢单偏多。",
        },
      ],
    },
    crm: {
      heading: "客户商机详情",
      intro: "",
      fullTitle: "全量客户与商机表",
      activityTitle: "销售动态",
      tables: [
        {
          id: "crmOverallTableHead",
          title: "客户商机总表",
          columns: ["客户", "客户分层", "所属销售", "当前商机", "阶段", "预计成交", "最近跟进", "风险"],
        },
        {
          id: "crmCustomerTableHead",
          title: "客户分表",
          columns: ["客户", "客户分层", "负责人", "当前状态", "最近跟进", "贡献情况"],
        },
        {
          id: "crmOpportunityTableHead",
          title: "商机分表",
          columns: ["商机", "客户", "所属销售", "阶段", "预计成交", "推进状态", "风险"],
        },
      ],
    },
  },
  chat: {
    greeting: `我是你的销售看板 AI 助手。${reportContext.reportTimeLabel}，当前年度目标已完成 ${Math.round(
      getStats().teamRate * 100
    )}%，商机池还差 ${formatCompactCurrency(
      reportContext.opportunityGap
    )}。你可以直接问我“Lina 和 Joe 为什么要重点关注？”或者“哪些 B 级客户超 15 天未跟进？”。`,
  },
};

const today = reportBaseDate;
const heroTitle = document.getElementById("heroTitle");
const todayLabel = document.getElementById("todayLabel");
const dateCardLabel = document.getElementById("dateCardLabel");
const datePicker = document.getElementById("datePicker");
const dateShortcuts = document.getElementById("dateShortcuts");
const dateShortcutButtons = document.querySelectorAll(".date-shortcut");
const heroSummary = document.getElementById("heroSummary");
const overviewHeading = document.getElementById("overviewHeading");
const memberHeading = document.getElementById("memberHeading");
const riskHeading = document.getElementById("riskHeading");
const crmHeading = document.getElementById("crmHeading");
const overviewMetrics = document.getElementById("overviewMetrics");
const teamDailyList = document.getElementById("teamDailyList");
const memberAlignedRows = document.getElementById("memberAlignedRows");
const riskBoard = document.getElementById("riskBoard");
const crmOverallTableHead = document.getElementById("crmOverallHead");
const crmCustomerTableHead = document.getElementById("crmCustomerHead");
const crmOpportunityTableHead = document.getElementById("crmOpportunityHead");
const crmOverallTitle = document.getElementById("crmOverallTitle");
const crmCustomerTitle = document.getElementById("crmCustomerTitle");
const crmOpportunityTitle = document.getElementById("crmOpportunityTitle");
const crmOverallTableBody = document.getElementById("crmOverallTableBody");
const crmCustomerTableBody = document.getElementById("crmCustomerTableBody");
const crmOpportunityTableBody = document.getElementById("crmOpportunityTableBody");
const pageTabButtons = document.querySelectorAll("[data-page-tab]");
const dashboardGrid = document.querySelector(".dashboard-grid");
const tablePage = document.getElementById("tablePage");
const activityPage = document.getElementById("activityPage");
const crmFullTitle = document.getElementById("crmFullTitle");
const crmFullHead = document.getElementById("crmFullHead");
const crmFullTableBody = document.getElementById("crmFullTableBody");
const salesActivityTitle = document.getElementById("salesActivityTitle");
const salesActivityFeed = document.getElementById("salesActivityFeed");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSubmit = document.getElementById("chatSubmit");
const chatWidget = document.getElementById("chatWidget");
const chatPanel = document.getElementById("chatPanel");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatWidgetTitle = document.getElementById("chatWidgetTitle");
const statusOverviewSection = document.getElementById("statusOverviewSection");
const overviewSection = document.getElementById("overviewSection");
const memberSection = document.getElementById("memberSection");
const riskSection = document.getElementById("riskSection");
const crmSection = document.getElementById("crmSection");
let activePageTab = "home";

const streamRevealQueue = [];
let streamRevealCounter = 0;
const typewriterQueue = [];
let typewriterCounter = 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function queueStreamReveal(element, delay = null) {
  if (!element) {
    return;
  }

  const streamDelay = delay ?? streamRevealCounter * 110;
  streamRevealCounter += 1;
  element.classList.add("stream-reveal");
  element.style.setProperty("--stream-delay", `${streamDelay}ms`);
  streamRevealQueue.push(element);
}

function playStreamReveal() {
  requestAnimationFrame(() => {
    streamRevealQueue.forEach((element) => {
      const delay = Number.parseFloat(element.style.getPropertyValue("--stream-delay")) || 0;
      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, delay);
    });
  });
}

function queueTypewriter(element, text, speed = 26, delay = null) {
  if (!element || !text) {
    return;
  }

  const startDelay = delay ?? typewriterCounter * 120;
  typewriterCounter += 1;
  typewriterQueue.push({ element, text: String(text), speed, delay: startDelay });
}

function typeText(element, text, speed = 26) {
  if (!element) {
    return;
  }

  const finalText = String(text);
  if (prefersReducedMotion) {
    element.textContent = finalText;
    return;
  }

  element.textContent = "";
  element.classList.add("typewriter-active");
  let index = 0;

  const tick = () => {
    index += 1;
    element.textContent = finalText.slice(0, index);
    if (index < finalText.length) {
      window.setTimeout(tick, speed);
    } else {
      element.classList.remove("typewriter-active");
    }
  };

  window.setTimeout(tick, speed);
}

function playTypewriter() {
  if (prefersReducedMotion) {
    typewriterQueue.forEach(({ element, text }) => {
      element.textContent = text;
    });
    return;
  }

  typewriterQueue.forEach(({ element, text, speed, delay }) => {
    window.setTimeout(() => {
      typeText(element, text, speed);
    }, delay);
  });
}

function formatCompactNumber(value) {
  if (Math.abs(value) >= 10000) {
    const tenThousands = value / 10000;
    const formatted = Number.isInteger(tenThousands)
      ? tenThousands.toLocaleString("zh-CN")
      : tenThousands.toLocaleString("zh-CN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        });
    return `${formatted}万`;
  }

  return value.toLocaleString("zh-CN", { maximumFractionDigits: 0 });
}

function formatCompactCurrency(value) {
  return `¥${formatCompactNumber(value)}`;
}

function formatDateLabel(date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (typeof text === "string") {
    element.textContent = text;
  }
  return element;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderMarkdownInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function createMarkdownBlock(className, text) {
  const element = document.createElement("div");
  if (className) {
    element.className = className;
  }

  const blocks = String(text)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    element.textContent = "";
    return element;
  }

  element.innerHTML = blocks
    .map((block) => {
      if (/^---+$/.test(block.replace(/\s+/g, ""))) {
        return "<hr>";
      }

      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length > 0) {
        const headingMatch = lines[0].match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
          const level = Math.min(headingMatch[1].length, 4);
          const heading = `<h${level}>${renderMarkdownInline(headingMatch[2])}</h${level}>`;
          const rest = lines.slice(1);

          if (rest.length === 0) {
            return heading;
          }

          if (rest.every((line) => /^[-*]\s+/.test(line))) {
            const items = rest
              .map((line) => line.replace(/^[-*]\s+/, ""))
              .map((line) => `<li>${renderMarkdownInline(line)}</li>`)
              .join("");
            return `${heading}<ul>${items}</ul>`;
          }

          return `${heading}<p>${renderMarkdownInline(rest.join(" "))}</p>`;
        }
      }

      if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
        const items = lines
          .map((line) => line.replace(/^[-*]\s+/, ""))
          .map((line) => `<li>${renderMarkdownInline(line)}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${renderMarkdownInline(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return element;
}

function renderMarkdownInto(target, markdown, className) {
  if (!target) {
    return;
  }

  target.replaceChildren(createMarkdownBlock(className, markdown));
}

function renderSectionNarrative(target, markdown, className = "section-richtext-prose card-markdown") {
  if (!target) {
    return;
  }

  if (!markdown || !String(markdown).trim()) {
    target.replaceChildren();
    target.className = "section-richtext is-empty";
    return;
  }

  target.className = "section-richtext";
  const card = createElement("article", "card-standard");
  card.appendChild(createMarkdownBlock(className, markdown));
  target.replaceChildren(card);
}

function formatDateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function shiftDate(baseDate, offsetDays) {
  const shifted = new Date(baseDate);
  shifted.setDate(shifted.getDate() + offsetDays);
  return shifted;
}

function syncDateShortcutState(offset) {
  if (!dateShortcuts) {
    return;
  }

  dateShortcuts.querySelectorAll(".date-shortcut").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.offset) === offset);
  });
}

function applySelectedDate(date, shortcutOffset = null) {
  const selectedDate = new Date(date);
  if (datePicker) {
    datePicker.value = formatDateInputValue(selectedDate);
  }
  syncDateShortcutState(shortcutOffset);
  renderHero(selectedDate);
}

function renderPageDocument() {
  if (heroTitle) {
    heroTitle.textContent = dashboardDocument.ui.heroTitle;
  }

  document.title = dashboardDocument.title;
  if (heroSummary) {
    heroSummary.textContent = "";
  }
  renderMarkdownInto(
    overviewHeading,
    dashboardDocument.sections.overview.heading
      ? `## ${dashboardDocument.sections.overview.heading}${dashboardDocument.sections.overview.intro ? `\n${dashboardDocument.sections.overview.intro}` : ""}`
      : dashboardDocument.sections.overview.intro,
    "panel-heading-prose card-markdown"
  );
  renderMarkdownInto(
    memberHeading,
    dashboardDocument.sections.member.heading
      ? `## ${dashboardDocument.sections.member.heading}${dashboardDocument.sections.member.intro ? `\n${dashboardDocument.sections.member.intro}` : ""}`
      : dashboardDocument.sections.member.intro,
    "panel-heading-prose card-markdown"
  );
  renderMarkdownInto(
    riskHeading,
    dashboardDocument.sections.risk.heading
      ? `## ${dashboardDocument.sections.risk.heading}${dashboardDocument.sections.risk.intro ? `\n${dashboardDocument.sections.risk.intro}` : ""}`
      : dashboardDocument.sections.risk.intro,
    "panel-heading-prose card-markdown"
  );
  renderMarkdownInto(
    crmHeading,
    dashboardDocument.sections.crm.heading
      ? `## ${dashboardDocument.sections.crm.heading}${dashboardDocument.sections.crm.intro ? `\n${dashboardDocument.sections.crm.intro}` : ""}`
      : dashboardDocument.sections.crm.intro,
    "panel-heading-prose card-markdown"
  );

  const heroTitleRow = document.querySelector(".hero-title-row");
  if (heroTitleRow && !heroTitleRow.querySelector(".hero-logo")) {
    const logo = document.createElement("img");
    logo.className = "hero-logo";
    logo.src = "./assets/site-logo.png";
    logo.alt = "网站 Logo";
    heroTitleRow.insertBefore(logo, heroTitleRow.firstChild);
  }

  if (dateShortcuts) {
    dateShortcuts.setAttribute("aria-label", dashboardDocument.ui.dateShortcutsAriaLabel);
  }

  if (dateCardLabel) {
    dateCardLabel.textContent = dashboardDocument.ui.dateCardLabel;
  }

  if (datePicker) {
    datePicker.setAttribute("aria-label", dashboardDocument.ui.datePickerAriaLabel);
  }

  dateShortcutButtons.forEach((button, index) => {
    const config = dashboardDocument.ui.dateShortcuts[index];
    if (!config) {
      return;
    }
    button.textContent = config.label;
    button.dataset.offset = config.offset;
  });

  if (chatToggle) {
    chatToggle.setAttribute("aria-label", dashboardDocument.ui.chatFabAriaLabel);
  }

  if (chatWidget) {
    chatWidget.setAttribute("aria-label", dashboardDocument.ui.chatTitle);
  }

  if (chatPanel) {
    chatPanel.setAttribute("aria-label", dashboardDocument.ui.chatTitle);
  }

  if (chatWidgetTitle) {
    chatWidgetTitle.textContent = dashboardDocument.ui.chatTitle;
  }

  if (chatClose) {
    chatClose.textContent = dashboardDocument.ui.chatCloseLabel;
    chatClose.setAttribute("aria-label", dashboardDocument.ui.chatCloseAriaLabel);
  }

  if (chatInput) {
    chatInput.setAttribute("placeholder", dashboardDocument.ui.chatPlaceholder);
  }

  if (chatForm) {
    const label = chatForm.querySelector("label[for='chatInput']");
    if (label) {
      label.textContent = dashboardDocument.ui.chatInputLabel;
    }
  }

  queueStreamReveal(statusOverviewSection, 0);
  queueStreamReveal(heroTitle?.closest(".hero-main"), 80);
  queueStreamReveal(document.querySelector(".hero-top-meta"), 180);
  queueStreamReveal(heroSummary, 280);
  queueStreamReveal(overviewSection, 380);
  queueStreamReveal(memberSection, 880);
  queueStreamReveal(riskSection, 1320);
  queueStreamReveal(crmSection, 1760);

  queueTypewriter(heroTitle, dashboardDocument.ui.heroTitle, 30, 160);
  queueTypewriter(heroSummary, dashboardDocument.heroSummary, 22, 420);
}

function getStats() {
  return {
    totalTarget: reportContext.annualTarget,
    totalAchieved: reportContext.achieved,
    totalNewRevenue: reportContext.revenueToday,
    totalNewRevenueWeek: reportContext.revenueWeek,
    totalNewRevenueMonth: reportContext.revenueMonth,
    highRiskCount: reportContext.highRiskItems,
    totalNewCustomers: 4,
    totalNewOpportunities: crmRecords.length,
    teamRate: reportContext.teamRate,
    opportunityPool: reportContext.opportunityPool,
    opportunityGap: reportContext.opportunityGap,
    newQualifiedLeads: reportContext.newQualifiedLeads,
  };
}

function renderHero(selectedDate) {
  todayLabel.textContent = formatDateLabel(selectedDate);
}

function createStandardCard({
  className = "",
  title = "",
  titlePrefix = "",
  subtitle = "",
  tagText = "",
  tagClass = "neutral",
  avatarSrc = "",
  avatarAlt = "",
  value = "",
  body = "",
  note = "",
  chartValue = "",
  chartRatio = null,
  chartLabel = "",
  chartClass = "neutral",
  supportMarkdown = "",
}) {
  const card = createElement(
    "article",
    ["card-standard", className].filter(Boolean).join(" ")
  );

  if (title || subtitle || tagText || avatarSrc) {
    const header = createElement("div", "card-header");
    const headerMain = createElement("div", "card-header-main");
    const text = createElement("div", "card-text");

    if (avatarSrc) {
      const avatar = document.createElement("img");
      avatar.className = "card-avatar";
      avatar.src = avatarSrc;
      avatar.alt = avatarAlt || title || "";
      headerMain.appendChild(avatar);
    }

    if (title) {
      const titleElement = createElement("h3", "card-title");
      if (titlePrefix) {
        titleElement.appendChild(createElement("span", "card-title-prefix", titlePrefix));
      }
      titleElement.appendChild(createElement("span", "card-title-text", title));
      text.appendChild(titleElement);
    }

    if (subtitle) {
      text.appendChild(createElement("p", "card-subtitle", subtitle));
    }

    if (text.childElementCount > 0) {
      headerMain.appendChild(text);
    }

    if (headerMain.childElementCount > 0) {
      header.appendChild(headerMain);
    }

    if (tagText) {
      header.appendChild(createElement("span", `tag ${tagClass}`, tagText));
    }

    if (header.childElementCount > 0) {
      card.appendChild(header);
    }
  }

  const hasChart = chartRatio !== null && chartRatio !== undefined && chartLabel;
  const hasValueContent = value || body || note;

  if (hasValueContent || hasChart) {
    const main = createElement("div", `card-main${hasChart ? "" : " is-single"}`);

    if (hasValueContent) {
      const valueStack = createElement("div", "card-value-stack");

      if (value) {
        valueStack.appendChild(createElement("strong", "card-value", value));
      }

      if (body) {
        valueStack.appendChild(createMarkdownBlock("card-body card-markdown", body));
      }

      if (note) {
        valueStack.appendChild(createMarkdownBlock("card-note card-markdown", note));
      }

      if (valueStack.childElementCount > 0) {
        main.appendChild(valueStack);
      }
    }

    if (hasChart) {
      const chartField = createElement("div", "card-chart-field");
      const ring = createElement("div", `card-ring ${chartClass}`);
      const ringContent = createElement("div", "card-ring-content");
      ring.style.setProperty("--ring-value", `${Math.min(Math.max(chartRatio, 0), 1)}`);
      ringContent.append(
        createElement("span", "card-ring-label", chartLabel),
        createElement("span", "card-ring-value", chartValue)
      );
      ring.appendChild(ringContent);
      chartField.append(ring);
      main.appendChild(chartField);
    }

    if (main.childElementCount > 0) {
      card.appendChild(main);
    }
  }

  if (supportMarkdown) {
    const support = createElement("div", "card-support");
    support.appendChild(createMarkdownBlock("card-body card-markdown", supportMarkdown));
    card.appendChild(support);
  }

  return card;
}

function renderMembersRefined() {
  const rankedMembers = [...salesTeam].sort(
    (a, b) => b.achieved / b.target - a.achieved / a.target
  );

  memberAlignedRows.replaceChildren();

  rankedMembers.forEach((member, index) => {
    const ratio = member.achieved / member.target;
    const gap = Math.max(member.target - member.achieved, 0);
    const card = createStandardCard({
      title: member.name,
      subtitle: member.role,
      tagText: member.tagText,
      tagClass: member.tagClass,
      avatarSrc: member.avatar || memberPlaceholderAvatar,
      avatarAlt: `${member.name} \u5934\u50cf`,
      value: formatCompactCurrency(member.achieved),
      note: `\u5e74\u5ea6\u76ee\u6807 ${formatCompactCurrency(
        member.target
      )}\uff0c\u76ee\u6807\u7f3a\u53e3 ${formatCompactCurrency(gap)}`,
      chartValue: `${Math.round(ratio * 100)}%`,
      chartRatio: ratio,
      chartLabel: "\u8fbe\u6210\u7387",
      chartClass: member.tagClass,
      supportMarkdown: `${member.dailySummary}\n\n**\u4eca\u65e5\u52a8\u4f5c**\n\n${member.todayTasks
        .map((task) => `- ${task}`)
        .join("\n")}`,
    });
    memberAlignedRows.appendChild(card);
    queueStreamReveal(card, 420 + index * 120);
  });
}

function renderRiskBoard() {
  riskBoard.replaceChildren();

  dashboardDocument.sections.risk.cards.forEach((risk, index) => {
    const card = createStandardCard({
      titlePrefix: risk.titlePrefix,
      title: risk.title,
      tagText: risk.tag,
      tagClass: risk.level,
      body: risk.summary,
    });
    riskBoard.appendChild(card);
    queueStreamReveal(card, 360 + index * 140);
  });
}

function renderCrmTable() {
  crmOverallTableBody.replaceChildren();
  crmCustomerTableBody.replaceChildren();
  crmOpportunityTableBody.replaceChildren();

  crmRecords.forEach((record) => {
    const overallRow = document.createElement("tr");

    [
      record.customer,
      record.tier,
      record.owner,
      record.opportunity,
      record.stage,
      formatCompactCurrency(record.estRevenue),
      record.lastFollowup,
    ].forEach((value) => {
      overallRow.appendChild(createElement("td", "", value));
    });

    overallRow.appendChild(
      createElement(
        "td",
        `risk-level ${
          record.risk === "高" ? "high" : record.risk === "中" ? "medium" : "low"
        }`,
        record.risk
      )
    );

    crmOverallTableBody.appendChild(overallRow);
    queueStreamReveal(overallRow);

    const customerRow = document.createElement("tr");
    [
      record.customer,
      record.tier,
      record.owner,
      record.followupStatus,
      record.lastFollowup,
      record.contributionNote,
    ].forEach((value) => {
      customerRow.appendChild(createElement("td", "", value));
    });
    crmCustomerTableBody.appendChild(customerRow);
    queueStreamReveal(customerRow);

    const opportunityRow = document.createElement("tr");
    [
      record.opportunity,
      record.customer,
      record.owner,
      record.stage,
      formatCompactCurrency(record.estRevenue),
      record.opportunityStatus,
    ].forEach((value) => {
      opportunityRow.appendChild(createElement("td", "", value));
    });
    opportunityRow.appendChild(
      createElement(
        "td",
        `risk-level ${
          record.risk === "高" ? "high" : record.risk === "中" ? "medium" : "low"
        }`,
        record.risk
      )
    );
    crmOpportunityTableBody.appendChild(opportunityRow);
    queueStreamReveal(opportunityRow);
  });
}

function answerQuestion(question) {
  const q = question.trim().toLowerCase();
  const rankedMembers = [...salesTeam].sort(
    (a, b) => b.achieved / b.target - a.achieved / a.target
  );

  if (!q) {
    return "\u53ef\u4ee5\u76f4\u63a5\u95ee\u6211\u5e74\u5ea6\u76ee\u6807\u7f3a\u53e3\u3001\u5546\u673a\u6c60\u3001Lina/Joe \u98ce\u9669\uff0c\u6216\u54ea\u4e9b B \u7ea7\u5ba2\u6237\u5df2\u8d85 15 \u5929\u672a\u8ddf\u8fdb\u3002";
  }

  if (q.includes("\u62a5\u544a") || q.includes("\u603b\u7ed3") || q.includes("\u6c47\u62a5")) {
    return `${reportContext.reportTimeLabel}\uff0c\u5e74\u5ea6\u76ee\u6807 ${formatCompactCurrency(
      reportContext.annualTarget
    )}\uff0c\u5df2\u5b8c\u6210 ${formatCompactCurrency(
      reportContext.achieved
    )}\uff0c\u9636\u6bb5\u8fbe\u6210 ${Math.round(
      reportContext.teamRate * 100
    )}%\u3002\u82e5\u5546\u673a\u6c60\u8865\u8db3\uff0c\u5168\u5e74\u6709\u671b\u51b2\u5230 ${formatCompactCurrency(
      reportContext.forecastPotential
    )}\u3002`;
  }

  if (
    q.includes("lina") ||
    q.includes("joe") ||
    q.includes("\u4f4e\u4e8e\u5e73\u5747") ||
    q.includes("\u98ce\u9669\u6210\u5458")
  ) {
    return `Lina \u548c Joe \u662f\u5f53\u524d\u9700\u8981\u91cd\u70b9\u5173\u6ce8\u7684\u6210\u5458\u3002Lina \u5df2\u5b8c\u6210 ${formatCompactCurrency(
      salesTeam.find((member) => member.name === "Lina").achieved
    )}\uff0cJoe \u5df2\u5b8c\u6210 ${formatCompactCurrency(
      salesTeam.find((member) => member.name === "Joe").achieved
    )}\uff0c\u4e24\u4eba\u90fd\u4f4e\u4e8e\u5f53\u524d\u56e2\u961f\u5e73\u5747\u6c34\u5e73\uff0c\u4e14\u4e22\u5355\u504f\u591a\u3002`;
  }

  if (q.includes("\u65b0\u589e\u6536\u5165") || q.includes("\u6536\u5165")) {
    return `\u65b0\u589e\u6536\u5165\u4e3a\u4eca\u65e5 ${formatCompactCurrency(
      reportContext.revenueToday
    )}\uff0c\u672c\u5468 ${formatCompactCurrency(
      reportContext.revenueWeek
    )}\uff0c\u672c\u6708 ${formatCompactCurrency(
      reportContext.revenueMonth
    )}\u3002Ava \u8d1f\u8d23\u7684 A \u7ea7\u5ba2\u6237\u4ecd\u662f\u4e3b\u8981\u6536\u5165\u6765\u6e90\u3002`;
  }

  if (q.includes("\u5546\u673a\u6c60") || q.includes("\u7f3a\u53e3") || q.includes("\u5e74\u5ea6\u76ee\u6807")) {
    return `\u5e74\u5ea6\u76ee\u6807 ${formatCompactCurrency(
      reportContext.annualTarget
    )}\uff0c\u5df2\u5b8c\u6210 ${formatCompactCurrency(
      reportContext.achieved
    )}\uff0c\u76ee\u524d\u5546\u673a\u6c60 ${formatCompactCurrency(
      reportContext.opportunityPool
    )}\uff0c\u8fd8\u5dee ${formatCompactCurrency(
      reportContext.opportunityGap
    )}\u624d\u80fd\u6258\u4f4f\u5e74\u5ea6\u8fbe\u6210\u3002`;
  }

  if (q.includes("\u9ad8\u98ce\u9669") || q.includes("\u505c\u6ede")) {
    const stalled = crmRecords
      .filter((record) => record.opportunityStatus.includes("\u505c\u6ede"))
      .map((record) => `${record.customer}\uff1a${record.opportunity}`)
      .join("\u3001");
    return `\u76ee\u524d\u9700\u8981\u91cd\u70b9\u5173\u6ce8\u7684\u9ad8\u98ce\u9669\u9879\u5171 ${reportContext.highRiskItems} \u4e2a\uff0c\u5176\u4e2d ${reportContext.stalledOpportunities} \u4e2a\u5546\u673a\u5df2\u7ecf\u505c\u6ede\uff0c\u5206\u522b\u662f ${stalled}\u3002`;
  }

  if (q.includes("15") || q.includes("b\u7ea7\u5ba2\u6237") || q.includes("\u5ba2\u6237")) {
    const overdueCustomers = crmRecords
      .filter((record) => record.followupStatus.includes("\u8d85 15 \u5929"))
      .map((record) => record.customer)
      .join("\u3001");
    return `B \u7ea7\u5ba2\u6237\u4e2d\u76ee\u524d\u6709 ${reportContext.overdueBLevelCustomers} \u4e2a\u8d85\u8fc7 15 \u5929\u672a\u8ddf\u8fdb\uff0c\u5206\u522b\u662f ${overdueCustomers}\u3002`;
  }

  if (q.includes("\u6392\u540d") || q.includes("\u8c01\u6700\u597d") || q.includes("top")) {
    return `\u5f53\u524d\u4e1a\u7ee9\u6392\u540d\u524d\u4e24\u4f4d\u662f ${rankedMembers[0].name} \u548c ${rankedMembers[1].name}\uff0c${rankedMembers[0].name} \u4e00\u4eba\u8d21\u732e\u4e86\u8d85\u8fc7 60% \u7684\u5df2\u5b8c\u6210\u4e1a\u7ee9\u3002`;
  }

  return "\u6211\u53ef\u4ee5\u57fa\u4e8e\u8fd9\u4e2a\u6a21\u62df\u9996\u9875\u56de\u7b54\u5e74\u5ea6\u76ee\u6807\u7f3a\u53e3\u3001\u7ebf\u7d22\u6c60\u3001Lina/Joe \u98ce\u9669\u3001B \u7ea7\u5ba2\u6237\u8ddf\u8fdb\u548c\u9ad8\u98ce\u9669\u5546\u673a\u7b49\u95ee\u9898\u3002";
}

function addMessage(role, content) {
  const wrapper = createElement("div", `message ${role}`);
  wrapper.appendChild(createElement("div", "message-content", content));
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderCrmHeaders() {
  const [overallTable, customerTable, opportunityTable] =
    dashboardDocument.sections.crm.tables;

  if (crmFullTitle) {
    crmFullTitle.textContent = dashboardDocument.sections.crm.fullTitle;
  }
  if (salesActivityTitle) {
    salesActivityTitle.textContent = dashboardDocument.sections.crm.activityTitle;
  }

  const headers = [
    [crmOverallTitle, overallTable.title, crmOverallTableHead, overallTable.columns],
    [crmCustomerTitle, customerTable.title, crmCustomerTableHead, customerTable.columns],
    [
      crmOpportunityTitle,
      opportunityTable.title,
      crmOpportunityTableHead,
      opportunityTable.columns,
    ],
  ];

  headers.forEach(([titleElement, titleText, target, columns], index) => {
    if (titleElement) {
      titleElement.textContent = titleText;
    }

    if (!target) {
      return;
    }

    target.replaceChildren();
    columns.forEach((column) => {
      target.appendChild(createElement("th", "", column));
    });
  });
}

function renderCrmFullTable() {
  if (!crmFullHead || !crmFullTableBody) {
    return;
  }

  crmFullHead.replaceChildren();
  [
    "客户",
    "商机",
    "负责人",
    "客户分层",
    "阶段",
    "跟进状态",
    "预计成交",
    "最近跟进",
    "风险",
    "备注",
  ].forEach((column) => {
    crmFullHead.appendChild(createElement("th", "", column));
  });

  crmFullTableBody.replaceChildren();
  crmRecords.forEach((record, index) => {
    const row = document.createElement("tr");
    [
      record.customer,
      record.opportunity,
      record.owner,
      record.tier,
      record.stage,
      record.followupStatus,
      formatCompactCurrency(record.estRevenue),
      record.lastFollowup,
      record.risk,
      `${record.customerRisk} / ${record.opportunityRisk}`,
    ].forEach((value, cellIndex) => {
      const cell = createElement("td", "", value);
      if (cellIndex === 8) {
        cell.className = `risk-level ${record.risk === "高" ? "high" : record.risk === "中" ? "medium" : "low"}`;
      }
      row.appendChild(cell);
    });
    crmFullTableBody.appendChild(row);
    queueStreamReveal(row, 160 + index * 110);
  });
}

function renderSalesActivities() {
  if (!salesActivityFeed) {
    return;
  }

  salesActivityFeed.replaceChildren();
  salesActivities.forEach((activity, index) => {
    const item = createElement("article", "activity-item card-standard");
    const meta = createElement("div", "activity-meta");
    meta.appendChild(createElement("span", "activity-time", activity.time));
    meta.appendChild(createElement("span", `activity-tag ${activity.level}`, activity.tag));

    const title = createElement("h4", "activity-title", activity.title);
    const body = createElement("p", "activity-body", activity.body);

    item.appendChild(meta);
    item.appendChild(title);
    item.appendChild(body);
    salesActivityFeed.appendChild(item);
    queueStreamReveal(item, 140 + index * 120);
  });
}

function syncPageTabState(tabName) {
  activePageTab = tabName;
  pageTabButtons.forEach((button) => {
    const isActive = button.dataset.pageTab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function setPageView(tabName) {
  const isHome = tabName === "home";
  if (dashboardGrid) {
    dashboardGrid.hidden = !isHome;
  }
  if (tablePage) {
    tablePage.hidden = tabName !== "table";
  }
  if (activityPage) {
    activityPage.hidden = tabName !== "activity";
  }
  syncPageTabState(tabName);
}

function setupPageTabs() {
  pageTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.pageTab || "home";
      setPageView(tabName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  setPageView(activePageTab);
}

function initializeDate() {
  applySelectedDate(today, null);

  if (dateShortcuts) {
    dateShortcuts.addEventListener("click", (event) => {
      const button = event.target.closest(".date-shortcut");
      if (!button) {
        return;
      }

      const offset = Number(button.dataset.offset || 0);
      applySelectedDate(shiftDate(today, offset), offset);
    });
  }

  datePicker.addEventListener("input", (event) => {
    if (!event.target.value) {
      return;
    }

    applySelectedDate(new Date(`${event.target.value}T12:00:00`), null);
  });
}

function setupChat() {
  const resizeChatInput = () => {
    if (!chatInput) {
      return;
    }

    chatInput.style.height = "48px";
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 120)}px`;
  };

  const syncChatSubmitState = () => {
    if (!chatSubmit || !chatInput) {
      return;
    }
    chatSubmit.disabled = !chatInput.value.trim();
  };

  const setChatOpen = (open) => {
    if (!chatPanel || !chatWidget || !chatToggle || !chatInput) {
      return;
    }

    chatPanel.hidden = !open;
    chatWidget.classList.toggle("is-open", open);
    chatToggle.setAttribute("aria-expanded", String(open));

    if (open) {
      resizeChatInput();
      chatInput.focus();
    }
  };

  if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = chatInput.value.trim();
      if (!question) {
        return;
      }

      addMessage("user", question);
      addMessage("assistant", answerQuestion(question));
      chatInput.value = "";
      resizeChatInput();
      syncChatSubmitState();
    });
  }

  if (chatInput) {
    chatInput.addEventListener("input", () => {
      resizeChatInput();
      syncChatSubmitState();
    });
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm?.requestSubmit();
      }
    });
  }

  if (chatToggle) {
    chatToggle.addEventListener("click", () => {
      setChatOpen(chatPanel?.hidden ?? true);
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      setChatOpen(false);
      chatToggle?.focus();
    });
  }

  resizeChatInput();
  syncChatSubmitState();
}

function renderOverviewRichtext() {
  const cards = dashboardDocument.sections.overview.metrics;

  overviewMetrics.replaceChildren();
  cards.forEach((metric, index) => {
    const card = createStandardCard({
      titlePrefix: metric.prefix,
      title: metric.label,
      value: metric.value,
      note: metric.note,
    });
    overviewMetrics.appendChild(card);
    queueStreamReveal(card, 420 + index * 100);
  });

  teamDailyList.replaceChildren();
  dashboardDocument.sections.overview.cards.forEach((cardData, index) => {
    const card = createStandardCard({
      titlePrefix: cardData.titlePrefix,
      title: cardData.title,
      body: cardData.body,
    });
    teamDailyList.appendChild(card);
    queueStreamReveal(card, 780 + index * 140);
  });
}

function initialize() {
  renderPageDocument();
  initializeDate();
  renderOverviewRichtext();
  renderMembersRefined();
  renderRiskBoard();
  renderCrmHeaders();
  renderCrmTable();
  renderCrmFullTable();
  renderSalesActivities();
  setupPageTabs();
  setupChat();
  playTypewriter();
  playStreamReveal();

  addMessage(
    "assistant",
    dashboardDocument.chat.greeting
  );
}

initialize();


