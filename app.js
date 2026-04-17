const stressMode = new URLSearchParams(window.location.search).has("stress");
const memberPlaceholderAvatar = "./assets/member-placeholder.png";
const DASHBOARD_PROMPT_STORAGE_KEY = "sales-dashboard-generation-prompt";
const DEFAULT_DASHBOARD_GENERATION_PROMPT =
  "生成一份销售团队看板，突出当前统计周期的新增收入、年度达成、商机推进、重点风险和下一步动作，整体语气专业、简洁、偏经营复盘。";
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

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

const crmBoardRows = [
  {
    customer: "星河制造",
    status: "新增",
    level: "S级",
    entityType: "company",
    tags: ["S级", "制造", "张三"],
    opportunities: [
      {
        title: "协同平台二期",
        tags: ["方案对齐", "4月", "500万"],
      },
    ],
    winBlocks: [
      {
        rate: 50,
        summary: "POC 已过，预算待对齐。",
      },
    ],
    recentFollowup: {
      time: "3天前",
      note: "已对齐验收口径。",
    },
    nextFollowups: [
      {
        time: "明天 9:00",
        note: "发结果说明。",
      },
      {
        time: "本周三 10:00",
        note: "补一次答疑。",
      },
    ],
    updatedAt: "2026-04-14T09:10:00",
  },
  {
    customer: "智联医疗",
    status: "新增",
    level: "A级",
    entityType: "company",
    tags: ["A级", "医疗", "李四"],
    opportunities: [
      {
        title: "质检 AI 平台",
        tags: ["合同对齐", "4月", "500万"],
      },
    ],
    winBlocks: [
      {
        rate: 80,
        summary: "法务已收口，交付边界待确认。",
      },
    ],
    recentFollowup: {
      time: "10天前",
      note: "已确认评审窗口。",
    },
    nextFollowups: [
      {
        time: "明天 9:00",
        note: "发测试计划。",
      },
      {
        time: "本周四 14:00",
        note: "补技术答疑。",
      },
      {
        time: "本周五 10:00",
        note: "发测试结论。",
        done: true,
      },
    ],
    updatedAt: "2026-04-13T17:30:00",
  },
  {
    customer: "李琳",
    status: "",
    level: "A级",
    entityType: "person",
    tags: ["A级", "个人客户"],
    opportunities: [
      {
        title: "资产配置方案",
        tags: ["方案对齐", "4月", "500万"],
      },
    ],
    winBlocks: [
      {
        rate: 50,
        summary: "客户在意回撤，继续推进沟通。",
      },
    ],
    recentFollowup: {
      time: "1天前",
      note: "已沟通近期走势。",
    },
    nextFollowups: [
      {
        time: "后天 9:00",
        note: "发业绩摘要。",
      },
    ],
    updatedAt: "2026-04-12T19:40:00",
  },
  {
    customer: "云图装备",
    status: "",
    level: "B级",
    entityType: "company",
    tags: ["B级", "制造", "李五"],
    opportunities: [
      {
        title: "物联监控平台",
        tags: ["需求确认", "4月", "500万"],
      },
    ],
    winBlocks: [
      {
        rate: 50,
        summary: "需求已确认，审批还差一轮。",
      },
    ],
    recentFollowup: {
      time: "3天前",
      note: "已对齐测试结果。",
    },
    nextFollowups: [
      {
        time: "下周三",
        note: "确认评审时间。",
      },
    ],
    updatedAt: "2026-04-11T15:10:00",
  },
  {
    customer: "陈昊",
    status: "",
    level: "C级",
    entityType: "person",
    tags: ["C级", "个人客户"],
    opportunities: [],
    winBlocks: [],
    recentFollowup: null,
    nextFollowups: [
      {
        time: "逾期5天",
        note: "补发资料，确认是否继续。",
        overdue: true,
      },
    ],
    updatedAt: "2026-04-10T10:05:00",
  },
  {
    customer: "星辰科技",
    status: "",
    level: "D级",
    entityType: "company",
    tags: ["D级"],
    opportunities: [],
    winBlocks: [],
    recentFollowup: null,
    nextFollowups: [],
    updatedAt: "2026-04-09T08:35:00",
  },
].map((row) => ({
  ...row,
  searchText: [
    row.customer,
    row.status,
    row.level,
    row.tags.join(" "),
    row.opportunities.map((item) => `${item.title} ${item.tags.join(" ")} ${item.moreLabel || ""}`).join(" "),
    row.winBlocks.map((item) => item.summary).join(" "),
    row.recentFollowup ? `${row.recentFollowup.time} ${row.recentFollowup.note}` : "",
    row.nextFollowups.map((item) => `${item.time} ${item.note}`).join(" "),
  ]
    .join(" ")
    .toLowerCase(),
}));

const salesActivities = stressMode
  ? [
      { date: "2026-04-14", time: "18:22", person: "Ava", target: "星河制造 / 协同平台二期", action: "修改状态：法务版已回传。" },
      { date: "2026-04-14", time: "17:36", person: "Mia", target: "智联医疗 / 质检 AI 平台", action: "新建跟进：确认了演示窗口。" },
      { date: "2026-04-14", time: "16:48", person: "Lina", target: "云图装备 / 物联监控平台", action: "修改状态：补了下次会议时间。" },
      { date: "2026-04-14", time: "15:32", person: "Joe", target: "陈昊 / 资产配置方案", action: "完成跟进：记录待确认事项。" },
      { date: "2026-04-13", time: "14:05", person: "Ava", target: "星河制造 / 协同平台二期", action: "上传文件：补了会议纪要。" },
      { date: "2026-04-13", time: "12:44", person: "Mia", target: "智联医疗 / 质检 AI 平台", action: "修改状态：材料已更新。" },
      { date: "2026-04-13", time: "11:18", person: "Lina", target: "云图装备 / 物联监控平台", action: "新建跟进：补录上周纪要。" },
      { date: "2026-04-13", time: "09:06", person: "Joe", target: "陈昊 / 资产配置方案", action: "修改状态：更新今日待办。" },
      { date: "2026-04-12", time: "18:18", person: "Ava", target: "星河制造 / 协同平台二期", action: "完成跟进：已确认付款节点。" },
      { date: "2026-04-12", time: "16:20", person: "Mia", target: "智联医疗 / 质检 AI 平台", action: "上传文件：补了材料最新版。" },
      { date: "2026-04-11", time: "15:46", person: "Lina", target: "云图装备 / 物联监控平台", action: "修改状态：锁定了评审时间。" },
      { date: "2026-04-11", time: "10:12", person: "Joe", target: "陈昊 / 资产配置方案", action: "新建跟进：待办已同步。" },
    ]
  : [
      { date: "2026-04-14", time: "18:11", person: "Ava", target: "星河制造 / 协同平台二期", action: "修改状态：付款节点已确认。" },
      { date: "2026-04-14", time: "17:40", person: "Mia", target: "智联医疗 / 质检 AI 平台", action: "上传文件：补了材料最新版。" },
      { date: "2026-04-14", time: "16:28", person: "Lina", target: "云图装备 / 物联监控平台", action: "完成跟进：锁定下次沟通时间。" },
      { date: "2026-04-14", time: "15:19", person: "Joe", target: "陈昊 / 资产配置方案", action: "修改状态：卡点已记录。" },
      { date: "2026-04-13", time: "13:52", person: "Ava", target: "星河制造 / 协同平台二期", action: "新建跟进：回款计划已同步。" },
      { date: "2026-04-13", time: "12:37", person: "Mia", target: "智联医疗 / 质检 AI 平台", action: "上传文件：补了采购关注点。" },
      { date: "2026-04-13", time: "11:06", person: "Lina", target: "云图装备 / 物联监控平台", action: "修改状态：补录了上周纪要。" },
      { date: "2026-04-13", time: "09:14", person: "Joe", target: "陈昊 / 资产配置方案", action: "新建跟进：待办已同步。" },
      { date: "2026-04-12", time: "18:05", person: "Ava", target: "星河制造 / 协同平台二期", action: "完成跟进：整理了客户反馈。" },
      { date: "2026-04-12", time: "15:56", person: "Mia", target: "智联医疗 / 质检 AI 平台", action: "修改状态：材料已更新。" },
      { date: "2026-04-11", time: "14:22", person: "Lina", target: "云图装备 / 物联监控平台", action: "上传文件：发了演示录屏。" },
      { date: "2026-04-10", time: "10:03", person: "Joe", target: "陈昊 / 资产配置方案", action: "新建跟进：补录了回访要点。" },
    ];

let adminAccounts = [
  {
    id: "ava",
    name: "Ava",
    username: "Ava Chen",
    contactType: "phone",
    contactValue: "13800138001",
    points: 286,
    lastActive: "今天 09:12",
  },
  {
    id: "mia",
    name: "Mia",
    username: "Mia Liu",
    contactType: "email",
    contactValue: "mia@company.com",
    points: 248,
    lastActive: "今天 08:48",
  },
  {
    id: "lina",
    name: "Lina",
    username: "Lina Zhang",
    contactType: "phone",
    contactValue: "13900139001",
    points: 214,
    lastActive: "昨天 18:07",
  },
  {
    id: "joe",
    name: "Joe",
    username: "Joe Wu",
    contactType: "email",
    contactValue: "joe@company.com",
    points: 176,
    lastActive: "昨天 16:21",
  },
  {
    id: "sara",
    name: "Sara",
    username: "Sara Wang",
    contactType: "phone",
    contactValue: "13700137001",
    points: 198,
    lastActive: "今天 11:05",
  },
];

const ADMIN_ACCOUNT_LIMIT = 8;

const dashboardDocument = {
  title: "销售团队看板",
  ui: {
    rangeStartLabel: "开始日期",
    rangeEndLabel: "结束日期",
      rangeApplyLabel: "确认",
      rangeCancelLabel: "取消",
    chatFabLabel: "AI",
    chatFabAriaLabel: "打开 AI 助手",
    chatTitle: "AI 助手",
    chatCloseLabel: "×",
    chatCloseAriaLabel: "关闭 AI 助手",
    chatInputLabel: "输入问题",
    chatPlaceholder: "例如：今年目标还差多少？哪些 B 级客户超过 15 天未跟进？",
  },
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
      fullTitle: "客户商机表",
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
let selectedRangeStart = new Date(today);
let selectedRangeEnd = new Date(today);
let activeTimeScope = "day";
let customRangeOpen = false;
let customRangeTarget = "report";
let customRangeAllowFallback = true;
let salesActivitySortDescending = true;
let salesActivitySearchTerm = "";
let salesActivityRangeStart = null;
let salesActivityRangeEnd = null;
let crmBoardRangeStart = null;
let crmBoardRangeEnd = null;
let crmBoardDraftRangeStart = null;
let crmBoardDraftRangeEnd = null;
let crmBoardPickerMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const clearRangeButton = document.getElementById("clearRangeButton");
const cancelRangeButton = document.getElementById("cancelRangeButton");
const applyRangeButton = document.getElementById("applyRangeButton");
const boardRangePicker = document.getElementById("boardRangePicker");
const customRangeTitle = document.getElementById("customRangeTitle");
const boardRangeMonthLabel = document.getElementById("boardRangeMonthLabel");
const boardRangeWeekdays = document.getElementById("boardRangeWeekdays");
const boardRangeGrid = document.getElementById("boardRangeGrid");
const boardRangePrevMonth = document.getElementById("boardRangePrevMonth");
const boardRangeNextMonth = document.getElementById("boardRangeNextMonth");
const customRangeModal = document.getElementById("customRangeModal");
const customRangeDialog = document.getElementById("customRangeDialog");
const customRangeBackdrop = document.getElementById("customRangeBackdrop");
const customRangeCloseButton = document.getElementById("customRangeClose");
const customRangeButton = document.querySelector('[data-time-scope="custom"]');
const timeScopeSwitcher = document.getElementById("timeScopeSwitcher");
const timeScopePrevButton = document.getElementById("timeScopePrev");
const timeScopeNextButton = document.getElementById("timeScopeNext");
const timeScopeButtons = document.querySelectorAll("[data-time-scope]");
const promptSettingsButton = document.getElementById("promptSettingsButton");
const promptMoreButton = document.getElementById("promptMoreButton");
const promptMoreMenu = document.getElementById("promptMoreMenu");
const exportWordButton = document.getElementById("exportWordButton");
const regeneratePageButton = document.getElementById("regeneratePageButton");
const promptSettingsModal = document.getElementById("promptSettingsModal");
const promptSettingsBackdrop = document.getElementById("promptSettingsBackdrop");
const promptSettingsClose = document.getElementById("promptSettingsClose");
const promptSettingsInput = document.getElementById("promptSettingsInput");
const promptSettingsCancel = document.getElementById("promptSettingsCancel");
const promptSettingsSave = document.getElementById("promptSettingsSave");
const periodNote = document.getElementById("periodNote");
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
const crmFullHead = document.getElementById("crmFullHead");
const crmFullTableBody = document.getElementById("crmFullTableBody");
const crmBoardSortButton = document.getElementById("crmBoardSortButton");
const crmBoardSearchInput = document.getElementById("crmBoardSearchInput");
const crmBoardMoreButton = document.getElementById("crmBoardMoreButton");
const crmBoardDateButton = document.getElementById("crmBoardDateButton");
const salesActivitySortButton = document.getElementById("salesActivitySortButton");
const salesActivityDateButton = document.getElementById("salesActivityDateButton");
const salesActivitySearchInput = document.getElementById("salesActivitySearchInput");
const salesActivityMoreButton = document.getElementById("salesActivityMoreButton");
const salesActivityFeed = document.getElementById("salesActivityFeed");
const salesActivityHead = document.getElementById("salesActivityHead");
const adminPanelButton = document.getElementById("adminPanelButton");
const adminModal = document.getElementById("adminModal");
const adminModalBackdrop = document.getElementById("adminModalBackdrop");
const adminModalClose = document.getElementById("adminModalClose");
const adminTableBody = document.getElementById("adminTableBody");
const adminAccountSummary = document.getElementById("adminAccountSummary");
const adminAddUserButton = document.getElementById("adminAddUserButton");
const adminEditModal = document.getElementById("adminEditModal");
const adminEditBackdrop = document.getElementById("adminEditBackdrop");
const adminEditClose = document.getElementById("adminEditClose");
const adminEditTitle = document.getElementById("adminEditTitle");
const adminEditTypeGroup = document.getElementById("adminEditTypeGroup");
const adminEditUsernameInput = document.getElementById("adminEditUsernameInput");
const adminEditContactInput = document.getElementById("adminEditContactInput");
const adminSendInviteButton = document.getElementById("adminSendInviteButton");
const adminInviteHint = document.getElementById("adminInviteHint");
const adminInviteCodeInput = document.getElementById("adminInviteCodeInput");
const adminEditDeleteButton = document.getElementById("adminEditDeleteButton");
const adminEditCancelButton = document.getElementById("adminEditCancelButton");
const adminEditConfirmButton = document.getElementById("adminEditConfirmButton");
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
const generateNowButton = document.getElementById("generateNowButton");
let activePageTab = "team";
let dashboardGenerated = false;
let crmBoardSortDescending = true;
let crmBoardSearchTerm = "";
let adminModalOpen = false;
let adminEditModalOpen = false;
let promptSettingsOpen = false;
let promptMoreOpen = false;
let adminEditMode = "edit";
let adminEditingAccountId = "";
let adminEditContactType = "phone";
let adminEditDraftContactValue = "";
let adminEditDraftUsernameValue = "";
let adminEditGeneratedCode = "";
let adminEditInviteSent = false;
let dashboardGenerationPrompt = "";

const streamRevealQueue = [];
let streamRevealCounter = 0;
let streamRevealStarted = false;
const typewriterQueue = [];
let typewriterCounter = 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function queueStreamReveal(element, delay = null) {
  if (!element) {
    return;
  }

  if (streamRevealStarted) {
    element.classList.add("is-visible");
    return;
  }

  const streamDelay = delay ?? streamRevealCounter * 110;
  streamRevealCounter += 1;
  element.classList.add("stream-reveal");
  element.style.setProperty("--stream-delay", `${streamDelay}ms`);
  streamRevealQueue.push(element);
}

function playStreamReveal() {
  streamRevealStarted = true;
  requestAnimationFrame(() => {
    streamRevealQueue.forEach((element) => {
      const delay = Number.parseFloat(element.style.getPropertyValue("--stream-delay")) || 0;
      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, delay);
    });
  });
}

function resetStreamRevealState() {
  streamRevealQueue.length = 0;
  streamRevealCounter = 0;
  streamRevealStarted = false;
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

function formatRangeLabel(startDate, endDate) {
  const start = startDate.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  });
  const end = endDate.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  });
  return `${start} - ${end}`;
}

function formatShortDateLabel(date) {
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  });
}

function getCustomRangeButtonLabel() {
  const range = getRangeLabel(selectedRangeStart, selectedRangeEnd);
  return range || "自定义";
}

function getScopeTooltip(scope) {
  const range = getScopeRangeForDate(selectedRangeEnd || today, scope);
  const currentLabel = getRangeLabel(range.start, range.end);

  if (scope === "day") {
    const comparison = shiftDate(range.start, -1);
    return `今日 ${currentLabel} · 上期 ${formatShortDateLabel(comparison)}`;
  }

  if (scope === "week") {
    const comparisonStart = shiftDate(range.start, -7);
    const comparisonEnd = shiftDate(range.end, -7);
    return `本周 ${currentLabel} · 上期 ${formatRangeLabel(comparisonStart, comparisonEnd)}`;
  }

  if (scope === "month") {
    const comparisonEnd = new Date(range.start);
    comparisonEnd.setDate(0);
    const comparisonStart = new Date(comparisonEnd.getFullYear(), comparisonEnd.getMonth(), 1);
    return `本月 ${currentLabel} · 上期 ${formatRangeLabel(comparisonStart, comparisonEnd)}`;
  }

  return "自定义区间";
}

function getWeekRange(date) {
  const start = new Date(date);
  const dayIndex = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dayIndex);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

function getMonthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

function getScopeLabel(scope) {
  if (scope === "week") {
    return "本周";
  }
  if (scope === "month") {
    return "本月";
  }
  if (scope === "custom") {
    return "自定义区间";
  }
  return "今日";
}

function isSameRange(left, right) {
  return (
    left &&
    right &&
    formatDateInputValue(left.start) === formatDateInputValue(right.start) &&
    formatDateInputValue(left.end) === formatDateInputValue(right.end)
  );
}

function getScopeDisplayLabel(scope) {
  if (scope === "custom") {
    return "自定义区间";
  }

  const currentRange = getCurrentRange();

  if (scope === "day") {
    const dayDiff = Math.round((currentRange.start - getScopeRangeForDate(today, "day").start) / 86400000);
    if (dayDiff === 0) {
      return "今日";
    }
    if (dayDiff === -1) {
      return "昨天";
    }
    if (dayDiff === 1) {
      return "明天";
    }
    return "";
  }

  const todayRange = getScopeRangeForDate(today, scope);

  if (scope === "week") {
    const diffWeeks = Math.round((currentRange.start - todayRange.start) / 86400000 / 7);
    if (diffWeeks === 0) {
      return "本周";
    }
    if (diffWeeks === -1) {
      return "上周";
    }
    if (diffWeeks === 1) {
      return "下周";
    }
    return "";
  }

  if (scope === "month") {
    const diffMonths =
      (currentRange.start.getFullYear() - todayRange.start.getFullYear()) * 12 +
      (currentRange.start.getMonth() - todayRange.start.getMonth());
    if (diffMonths === 0) {
      return "本月";
    }
    if (diffMonths === -1) {
      return "上月";
    }
    if (diffMonths === 1) {
      return "下月";
    }
    return "";
  }

  return getScopeLabel(scope);
}

function getScopeRevenue(scope) {
  if (scope === "week") {
    return reportContext.revenueWeek;
  }
  if (scope === "month") {
    return reportContext.revenueMonth;
  }
  if (scope === "custom") {
    const days = Math.max(Math.round((selectedRangeEnd - selectedRangeStart) / 86400000) + 1, 1);
    return Math.round((reportContext.revenueWeek / 7) * days);
  }
  return reportContext.revenueToday;
}

function getRangeLabel(start, end) {
  if (!start || !end) {
    return "";
  }

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return formatRangeLabel(start, end);
}

function getScopeRangeForDate(date, scope) {
  if (scope === "week") {
    return getWeekRange(date);
  }

  if (scope === "month") {
    return getMonthRange(date);
  }

  return { start: new Date(date), end: new Date(date) };
}

function getCurrentRange() {
  if (activeTimeScope === "custom") {
    return { start: selectedRangeStart, end: selectedRangeEnd };
  }

  return getScopeRangeForDate(selectedRangeEnd, activeTimeScope);
}

function getComparisonRange() {
  const currentRange = getCurrentRange();
  const currentDays = Math.max(Math.round((currentRange.end - currentRange.start) / 86400000) + 1, 1);

  if (activeTimeScope === "day") {
    const prev = shiftDate(currentRange.start, -1);
    return { start: prev, end: prev };
  }

  if (activeTimeScope === "week") {
    return {
      start: shiftDate(currentRange.start, -7),
      end: shiftDate(currentRange.end, -7),
    };
  }

  if (activeTimeScope === "month") {
    const prevMonthEnd = new Date(currentRange.start);
    prevMonthEnd.setDate(0);
    const prevMonthStart = new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), 1);
    return { start: prevMonthStart, end: prevMonthEnd };
  }

  return {
    start: shiftDate(currentRange.start, -currentDays),
    end: shiftDate(currentRange.end, -currentDays),
  };
}

function getComparisonLabel() {
  const range = getComparisonRange();
  return getRangeLabel(range.start, range.end);
}

function getCurrentRevenue() {
  if (activeTimeScope === "custom") {
    const currentRange = getCurrentRange();
    const days = Math.max(Math.round((currentRange.end - currentRange.start) / 86400000) + 1, 1);
    return Math.round((reportContext.revenueWeek / 7) * days);
  }

  return getScopeRevenue(activeTimeScope);
}

function getComparisonRevenue() {
  if (activeTimeScope === "day") {
    return Math.round(reportContext.revenueToday * 0.88);
  }

  if (activeTimeScope === "week") {
    return Math.round(reportContext.revenueWeek * 0.9);
  }

  if (activeTimeScope === "month") {
    return Math.round(reportContext.revenueMonth * 0.92);
  }

  const comparisonRange = getComparisonRange();
  const days = Math.max(Math.round((comparisonRange.end - comparisonRange.start) / 86400000) + 1, 1);
  return Math.round((reportContext.revenueWeek / 7) * days * 0.92);
}

function shiftScopeRange(direction) {
  const currentRange = getCurrentRange();

  if (activeTimeScope === "day") {
    const shifted = shiftDate(currentRange.end, direction);
    selectedRangeStart = new Date(shifted);
    selectedRangeEnd = new Date(shifted);
    return;
  }

  if (activeTimeScope === "week") {
    selectedRangeStart = shiftDate(currentRange.start, direction * 7);
    selectedRangeEnd = shiftDate(currentRange.end, direction * 7);
    return;
  }

  if (activeTimeScope === "month") {
    selectedRangeStart = new Date(currentRange.start);
    selectedRangeStart.setMonth(selectedRangeStart.getMonth() + direction);
    selectedRangeStart.setDate(1);
    selectedRangeEnd = new Date(selectedRangeStart.getFullYear(), selectedRangeStart.getMonth() + 1, 0);
    return;
  }

  const days = Math.max(Math.round((currentRange.end - currentRange.start) / 86400000) + 1, 1);
  selectedRangeStart = shiftDate(currentRange.start, direction * days);
  selectedRangeEnd = shiftDate(currentRange.end, direction * days);
}

function applyScopeShift(direction) {
  shiftScopeRange(direction);
  syncRangeInputs();
  syncCustomRangeVisibility();
  renderHero();
  invalidateDashboardGeneration();
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

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

function shiftDate(baseDate, offsetDays) {
  const shifted = new Date(baseDate);
  shifted.setDate(shifted.getDate() + offsetDays);
  return shifted;
}

function syncTimeScopeState(scope) {
  timeScopeButtons.forEach((button) => {
    const isActive = button.dataset.timeScope === scope;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    const buttonScope = button.dataset.timeScope || "day";
    button.title = getScopeTooltip(buttonScope);
    if (buttonScope === "day") {
      button.textContent = "日统计";
    } else if (buttonScope === "week") {
      button.textContent = "周统计";
    } else if (buttonScope === "month") {
      button.textContent = "月统计";
    } else if (buttonScope === "custom") {
      button.textContent = isActive ? getCustomRangeButtonLabel() : "自定义";
    }
  });
}

function setTimeScope(scope) {
  activeTimeScope = scope;
  if (scope !== "custom") {
    customRangeOpen = false;
    customRangeTarget = "report";
    const referenceDate = selectedRangeEnd || today;
    const range = getScopeRangeForDate(referenceDate, scope);
    selectedRangeStart = range.start;
    selectedRangeEnd = range.end;
  }
  syncTimeScopeState(scope);
  syncRangeInputs();
  syncCustomRangeVisibility();
  renderHero();
  invalidateDashboardGeneration();
}

function applySelectedRange(start, end, scope = "custom") {
  selectedRangeStart = new Date(start);
  selectedRangeEnd = new Date(end);
  if (selectedRangeEnd < selectedRangeStart) {
    const swap = selectedRangeStart;
    selectedRangeStart = selectedRangeEnd;
    selectedRangeEnd = swap;
  }
  activeTimeScope = scope;
  customRangeOpen = false;
  customRangeTarget = "report";
  syncTimeScopeState(scope);
  syncRangeInputs();
  syncCustomRangeVisibility();
  renderHero();
  invalidateDashboardGeneration();
}

function syncRangeInputs() {
  syncBoardRangePickerState();
}

function getTargetRange(target) {
  if (target === "activity") {
    return { start: salesActivityRangeStart, end: salesActivityRangeEnd };
  }
  if (target === "board") {
    return { start: crmBoardRangeStart, end: crmBoardRangeEnd };
  }
  return { start: selectedRangeStart, end: selectedRangeEnd };
}

function syncBoardRangePickerState() {
  if (!boardRangePicker || !customRangePicker) {
    return;
  }

  boardRangePicker.hidden = false;
  customRangePicker.classList.add("is-board-mode");
  customRangeDialog?.classList.add("is-board-mode");

  const activeRange = getTargetRange(customRangeTarget);
  const displayStart = crmBoardDraftRangeStart || (customRangeAllowFallback ? activeRange.start : null);
  const displayEnd = crmBoardDraftRangeEnd || (customRangeAllowFallback ? activeRange.end : null);
  if (customRangeTitle) {
    customRangeTitle.textContent = displayStart
      ? displayEnd
        ? `日期范围 · ${formatRangeLabel(displayStart, displayEnd)}`
        : `日期范围 · ${formatShortDateLabel(displayStart)}`
      : "日期范围";
  }

  if (boardRangeMonthLabel) {
    boardRangeMonthLabel.textContent = `${crmBoardPickerMonth.getFullYear()}年${crmBoardPickerMonth.getMonth() + 1}月`;
  }

  if (boardRangeWeekdays && !boardRangeWeekdays.childElementCount) {
    ["一", "二", "三", "四", "五", "六", "日"].forEach((day) => {
      boardRangeWeekdays.appendChild(createElement("span", "", day));
    });
  }

  if (!boardRangeGrid) {
    return;
  }

  boardRangeGrid.replaceChildren();
  const monthStart = new Date(crmBoardPickerMonth.getFullYear(), crmBoardPickerMonth.getMonth(), 1);
  const gridStart = shiftDate(monthStart, -((monthStart.getDay() + 6) % 7));
  const draftStart = crmBoardDraftRangeStart ? normalizeDate(crmBoardDraftRangeStart) : null;
  const draftEnd = crmBoardDraftRangeEnd ? normalizeDate(crmBoardDraftRangeEnd) : null;

  for (let index = 0; index < 42; index += 1) {
    const day = normalizeDate(shiftDate(gridStart, index));
    const button = createElement("button", "date-range-board-day", String(day.getDate()));
    button.type = "button";
    if (day.getMonth() !== crmBoardPickerMonth.getMonth()) {
      button.classList.add("is-muted");
    }

    const inRange = draftStart && draftEnd && day >= draftStart && day <= draftEnd;
    const isEdge =
      (draftStart && formatDateInputValue(day) === formatDateInputValue(draftStart)) ||
      (draftEnd && formatDateInputValue(day) === formatDateInputValue(draftEnd));

    if (inRange) {
      button.classList.add("is-range");
    }
    if (isEdge) {
      button.classList.add("is-edge");
    }

    button.addEventListener("click", () => {
      if (!crmBoardDraftRangeStart || (crmBoardDraftRangeStart && crmBoardDraftRangeEnd)) {
        crmBoardDraftRangeStart = day;
        crmBoardDraftRangeEnd = null;
      } else if (day < crmBoardDraftRangeStart) {
        crmBoardDraftRangeEnd = crmBoardDraftRangeStart;
        crmBoardDraftRangeStart = day;
      } else {
        crmBoardDraftRangeEnd = day;
      }
      syncBoardRangePickerState();
    });
    boardRangeGrid.appendChild(button);
  }
}

function syncCustomRangeVisibility() {
  if (!customRangeModal) {
    return;
  }
  customRangeModal.hidden = !customRangeOpen;
}

function openCustomRangePicker(target = "report", options = {}) {
  if (!customRangeModal) {
    return;
  }

  const { fresh = false } = options;
  customRangeTarget = target;
  customRangeAllowFallback = !(target === "report" && fresh);
  const activeRange = getTargetRange(target);
  const shouldResetDraft = target === "report" && fresh;
  crmBoardDraftRangeStart = shouldResetDraft ? null : activeRange.start ? new Date(activeRange.start) : null;
  crmBoardDraftRangeEnd = shouldResetDraft ? null : activeRange.end ? new Date(activeRange.end) : null;
  const referenceDate = crmBoardDraftRangeStart || activeRange.start || today;
  crmBoardPickerMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  customRangeOpen = true;
  syncRangeInputs();
  syncCustomRangeVisibility();
  if (boardRangeGrid) {
    window.setTimeout(() => boardRangeGrid.focus?.(), 0);
  }
}

function closeCustomRangePicker() {
  customRangeOpen = false;
  customRangeTarget = "report";
  customRangeAllowFallback = true;
  syncCustomRangeVisibility();
}

function clearSelectedRange() {
  if (customRangeTarget === "board") {
    crmBoardRangeStart = null;
    crmBoardRangeEnd = null;
    crmBoardDraftRangeStart = null;
    crmBoardDraftRangeEnd = null;
    closeCustomRangePicker();
    syncCrmBoardToolbar();
    renderCrmFullTable();
    return;
  }

  if (customRangeTarget === "activity") {
    salesActivityRangeStart = null;
    salesActivityRangeEnd = null;
    crmBoardDraftRangeStart = null;
    crmBoardDraftRangeEnd = null;
    closeCustomRangePicker();
    syncSalesActivityToolbar();
    renderSalesActivities();
    return;
  }

  crmBoardDraftRangeStart = null;
  crmBoardDraftRangeEnd = null;
  closeCustomRangePicker();
  setTimeScope("day");
}

function syncAdminModalVisibility() {
  if (!adminModal) {
    return;
  }
  adminModal.hidden = !adminModalOpen;
}

function syncPromptSettingsVisibility() {
  if (!promptSettingsModal) {
    return;
  }
  promptSettingsModal.hidden = !promptSettingsOpen;
}

function syncPromptMoreVisibility() {
  if (!promptMoreMenu || !promptMoreButton) {
    return;
  }
  promptMoreMenu.hidden = !promptMoreOpen;
  promptMoreButton.setAttribute("aria-expanded", String(promptMoreOpen));
}

function loadDashboardGenerationPrompt() {
  try {
    dashboardGenerationPrompt =
      window.localStorage.getItem(DASHBOARD_PROMPT_STORAGE_KEY) || DEFAULT_DASHBOARD_GENERATION_PROMPT;
  } catch {
    dashboardGenerationPrompt = DEFAULT_DASHBOARD_GENERATION_PROMPT;
  }
}

function saveDashboardGenerationPrompt(value) {
  dashboardGenerationPrompt = value.trim();
  try {
    if (dashboardGenerationPrompt) {
      window.localStorage.setItem(DASHBOARD_PROMPT_STORAGE_KEY, dashboardGenerationPrompt);
    } else {
      window.localStorage.removeItem(DASHBOARD_PROMPT_STORAGE_KEY);
    }
  } catch {
    // Ignore local storage failures.
  }
}

function openPromptSettingsModal() {
  if (!promptSettingsModal) {
    return;
  }
  promptMoreOpen = false;
  syncPromptMoreVisibility();
  promptSettingsOpen = true;
  syncPromptSettingsVisibility();
  if (promptSettingsInput) {
    promptSettingsInput.value = dashboardGenerationPrompt;
    window.setTimeout(() => promptSettingsInput.focus(), 0);
  }
}

function closePromptSettingsModal() {
  promptSettingsOpen = false;
  syncPromptSettingsVisibility();
}

function togglePromptMoreMenu(forceOpen = null) {
  promptMoreOpen = typeof forceOpen === "boolean" ? forceOpen : !promptMoreOpen;
  syncPromptMoreVisibility();
}

function confirmPromptSettings() {
  const nextPrompt = promptSettingsInput?.value || "";
  const previousPrompt = dashboardGenerationPrompt;
  saveDashboardGenerationPrompt(nextPrompt);
  closePromptSettingsModal();
  if (dashboardGenerationPrompt !== previousPrompt) {
    invalidateDashboardGeneration();
  }
}

function exportDashboardAsWord() {
  const currentRange = getCurrentRange();
  const comparisonRange = getComparisonRange();
  const title = `销售团队看板 ${getRangeLabel(currentRange.start, currentRange.end)}`;
  const content = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <p>统计周期：${getRangeLabel(currentRange.start, currentRange.end)}</p>
        <p>对比周期：${getRangeLabel(comparisonRange.start, comparisonRange.end)}</p>
        <p>生成提示词：${dashboardGenerationPrompt || DEFAULT_DASHBOARD_GENERATION_PROMPT}</p>
      </body>
    </html>
  `;
  const blob = new Blob(["\ufeff", content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title}.doc`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function syncAdminEditModalVisibility() {
  if (!adminEditModal) {
    return;
  }
  adminEditModal.hidden = !adminEditModalOpen;
}

function getAdminAccountById(accountId) {
  return adminAccounts.find((account) => account.id === accountId) || null;
}

function canCreateAdminAccount() {
  return adminAccounts.length < ADMIN_ACCOUNT_LIMIT;
}

function getAdminContactLabel(type) {
  return type === "email" ? "邮箱" : "手机号";
}

function formatAdminContact(account) {
  return `${getAdminContactLabel(account.contactType)} ${account.contactValue}`;
}

function isValidAdminContact(type, value) {
  const trimmed = value.trim();
  if (type === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }

  return /^1\d{10}$/.test(trimmed);
}

function generateInviteCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function updateAdminEditTypeButtons() {
  if (!adminEditTypeGroup) {
    return;
  }

  const radios = adminEditTypeGroup.querySelectorAll('input[name="admin-edit-contact-type"]');
  radios.forEach((radio) => {
    radio.checked = radio.value === adminEditContactType;
  });
}

function renderAdminEditModal() {
  const account = adminEditMode === "edit" ? getAdminAccountById(adminEditingAccountId) : null;
  if (
    !adminEditContactInput ||
    !adminInviteCodeInput ||
    !adminEditUsernameInput
  ) {
    return;
  }

  if (adminEditTitle) {
    adminEditTitle.textContent = adminEditMode === "create" ? "新增用户" : "修改用户";
  }

  adminEditUsernameInput.value = adminEditDraftUsernameValue;
  adminEditContactInput.placeholder = adminEditContactType === "email" ? "输入邮箱" : "输入手机号";
  adminEditContactInput.value = adminEditDraftContactValue;
  if (!adminEditInviteSent) {
    adminInviteCodeInput.value = "";
    if (adminInviteHint && !adminInviteHint.dataset.locked) {
      adminInviteHint.textContent = "";
    }
  } else if (adminInviteHint) {
    adminInviteHint.textContent = `验证码已发送：${adminEditGeneratedCode}`;
  }

  updateAdminEditTypeButtons();

  if (adminSendInviteButton) {
    adminSendInviteButton.textContent = adminEditInviteSent ? "重新发送" : "发送验证码";
  }

  if (adminEditConfirmButton) {
    const isCodeMatch = adminEditInviteSent && adminInviteCodeInput.value.trim() === adminEditGeneratedCode;
    const isContactValid = isValidAdminContact(adminEditContactType, adminEditContactInput.value);
    const isUsernameValid = adminEditUsernameInput.value.trim().length > 0;
    adminEditConfirmButton.disabled = !(isCodeMatch && isContactValid && isUsernameValid);
    adminEditConfirmButton.textContent = adminEditMode === "create" ? "完成注册" : "确认修改";
  }

  if (adminEditDeleteButton) {
    adminEditDeleteButton.hidden = adminEditMode === "create";
    adminEditDeleteButton.disabled = adminEditMode === "create" || !account;
  }
}

function openAdminEditModal(accountId) {
  const account = getAdminAccountById(accountId);
  if (!account || !adminEditModal) {
    return;
  }

  adminEditMode = "edit";
  adminEditingAccountId = account.id;
  adminEditContactType = account.contactType || "phone";
  adminEditDraftContactValue = account.contactValue;
  adminEditDraftUsernameValue = account.username || "";
  adminEditGeneratedCode = "";
  adminEditInviteSent = false;
  if (adminInviteHint) {
    delete adminInviteHint.dataset.locked;
  }
  adminEditModalOpen = true;
  syncAdminEditModalVisibility();
  renderAdminEditModal();
  window.setTimeout(() => {
    adminEditClose?.focus();
    adminEditContactInput?.focus();
    adminEditContactInput?.select?.();
  }, 0);
}

function openAdminCreateModal() {
  if (!adminEditModal || !canCreateAdminAccount()) {
    return;
  }

  adminEditMode = "create";
  adminEditingAccountId = "";
  adminEditContactType = "phone";
  adminEditDraftContactValue = "";
  adminEditDraftUsernameValue = "";
  adminEditGeneratedCode = "";
  adminEditInviteSent = false;
  if (adminInviteHint) {
    delete adminInviteHint.dataset.locked;
    adminInviteHint.textContent = "";
  }
  adminEditModalOpen = true;
  syncAdminEditModalVisibility();
  renderAdminEditModal();
  window.setTimeout(() => {
    adminEditClose?.focus();
    adminEditUsernameInput?.focus();
  }, 0);
}

function closeAdminEditModal() {
  adminEditModalOpen = false;
  adminEditMode = "edit";
  adminEditingAccountId = "";
  adminEditDraftContactValue = "";
  adminEditDraftUsernameValue = "";
  adminEditGeneratedCode = "";
  adminEditInviteSent = false;
  if (adminInviteHint) {
    delete adminInviteHint.dataset.locked;
  }
  syncAdminEditModalVisibility();
}

function deleteActiveAdminAccount() {
  const account = getAdminAccountById(adminEditingAccountId);
  if (!account) {
    return;
  }

  const confirmed = window.confirm(`确认删除用户 ${account.username} 吗？`);
  if (!confirmed) {
    return;
  }

  deleteAdminAccount(account.id);
}

function sendAdminInviteCode() {
  if (!adminEditContactInput || !adminInviteHint) {
    return;
  }

  const value = adminEditContactInput.value.trim();
  if (!isValidAdminContact(adminEditContactType, value)) {
    adminInviteHint.textContent =
      adminEditContactType === "email" ? "请输入正确的邮箱地址" : "请输入 11 位手机号";
    return;
  }

  adminEditGeneratedCode = generateInviteCode();
  adminEditInviteSent = true;
  adminEditDraftContactValue = value;
  adminInviteCodeInput.value = "";
  adminInviteHint.textContent = `验证码已发送：${adminEditGeneratedCode}`;
  renderAdminEditModal();
  adminInviteCodeInput?.focus();
}

function confirmAdminEdit() {
  const account = adminEditMode === "edit" ? getAdminAccountById(adminEditingAccountId) : null;
  if (
    !adminEditUsernameInput ||
    !adminEditContactInput ||
    !adminInviteCodeInput ||
    !adminInviteHint
  ) {
    return;
  }

  const username = adminEditUsernameInput.value.trim();
  const value = adminEditContactInput.value.trim();
  const inviteCode = adminInviteCodeInput.value.trim();

  if (!username) {
    adminInviteHint.dataset.locked = "1";
    adminInviteHint.textContent = "请输入用户名";
    return;
  }

  if (!isValidAdminContact(adminEditContactType, value)) {
    adminInviteHint.dataset.locked = "1";
    adminInviteHint.textContent =
      adminEditContactType === "email" ? "请输入正确的邮箱地址" : "请输入 11 位手机号";
    return;
  }

  if (!adminEditInviteSent) {
    adminInviteHint.dataset.locked = "1";
    adminInviteHint.textContent = "请先发送验证码";
    return;
  }

  if (inviteCode !== adminEditGeneratedCode) {
    adminInviteHint.dataset.locked = "1";
    adminInviteHint.textContent = "验证码不正确";
    return;
  }

  if (adminEditMode === "create") {
    if (!canCreateAdminAccount()) {
      adminInviteHint.dataset.locked = "1";
      adminInviteHint.textContent = "已达到用户上限";
      return;
    }

    adminAccounts = [
      {
        id: `user-${Date.now()}`,
        name: username,
        username,
        contactType: adminEditContactType,
        contactValue: value,
        points: 0,
        lastActive: "刚刚",
      },
      ...adminAccounts,
    ];
  } else if (account) {
    account.username = username;
    account.contactType = adminEditContactType;
    account.contactValue = value;
    account.lastActive = "刚刚";
  } else {
    return;
  }

  delete adminInviteHint.dataset.locked;
  renderAdminTable();
  closeAdminEditModal();
}

function deleteAdminAccount(accountId) {
  const account = getAdminAccountById(accountId);
  if (!account) {
    return;
  }

  const confirmed = window.confirm(`确认删除用户 ${account.username} 吗？`);
  if (!confirmed) {
    return;
  }

  adminAccounts = adminAccounts.filter((item) => item.id !== accountId);
  if (adminEditingAccountId === accountId) {
    closeAdminEditModal();
  }
  renderAdminTable();
}

function openAdminModal() {
  if (!adminModal) {
    return;
  }
  adminModalOpen = true;
  syncAdminModalVisibility();
  renderAdminTable();
  window.setTimeout(() => {
    adminModalClose?.focus();
  }, 0);
}

function closeAdminModal() {
  adminModalOpen = false;
  syncAdminModalVisibility();
  closeAdminEditModal();
}

function renderAdminTable() {
  if (!adminTableBody) {
    return;
  }

  const totalPoints = adminAccounts.reduce((sum, account) => sum + account.points, 0);
  const remainingSlots = Math.max(ADMIN_ACCOUNT_LIMIT - adminAccounts.length, 0);
  if (adminAccountSummary) {
    adminAccountSummary.textContent = `${adminAccounts.length}/${ADMIN_ACCOUNT_LIMIT} 个用户 · 剩余名额 ${remainingSlots} · 总剩余积分 ${totalPoints.toLocaleString("zh-CN")}`;
  }

  if (adminAddUserButton) {
    adminAddUserButton.disabled = remainingSlots === 0;
    adminAddUserButton.textContent = remainingSlots === 0 ? "名额已满" : "新增用户";
  }

  adminTableBody.replaceChildren();

  adminAccounts.forEach((account) => {
    const row = document.createElement("tr");

    const accountCell = createElement("td");
    const accountButton = createElement("button", "admin-account-link", account.username);
    accountButton.type = "button";
    accountButton.dataset.accountId = account.id;
    accountButton.dataset.adminAction = "edit";
    accountCell.append(accountButton);

    const contactCell = createElement("td");
    contactCell.appendChild(createElement("div", "admin-account-contact", formatAdminContact(account)));

    const pointsCell = createElement("td");
    pointsCell.appendChild(createElement("div", "admin-points", account.points.toLocaleString("zh-CN")));

    const lastActiveCell = createElement("td");
    lastActiveCell.appendChild(createElement("div", "admin-account-meta", account.lastActive));

    const actionCell = createElement("td");
    const actionWrap = createElement("div", "admin-row-actions");
    const editButton = createElement("button", "admin-row-action", "修改");
    editButton.type = "button";
    editButton.dataset.adminAction = "edit";
    editButton.dataset.accountId = account.id;
    actionWrap.append(editButton);
    actionCell.appendChild(actionWrap);

    row.append(accountCell, contactCell, pointsCell, lastActiveCell, actionCell);
    adminTableBody.appendChild(row);
  });
}

function renderPageDocument() {
  document.title = dashboardDocument.title;
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

  if (applyRangeButton) {
    applyRangeButton.textContent = dashboardDocument.ui.rangeApplyLabel;
  }

  if (cancelRangeButton) {
    cancelRangeButton.textContent = dashboardDocument.ui.rangeCancelLabel;
  }

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

  syncCrmBoardToolbar();
  renderCrmFullTable();
  renderSalesActivities();
}

function setupCrmBoardControls() {
  if (crmBoardSortButton) {
    crmBoardSortButton.addEventListener("click", () => {
      crmBoardSortDescending = !crmBoardSortDescending;
      syncCrmBoardToolbar();
      renderCrmFullTable();
    });
  }

  if (crmBoardSearchInput) {
    crmBoardSearchInput.addEventListener("input", () => {
      crmBoardSearchTerm = crmBoardSearchInput.value || "";
      renderCrmFullTable();
    });
  }

  if (crmBoardMoreButton) {
    crmBoardMoreButton.addEventListener("click", () => {
      crmBoardSearchInput?.focus();
    });
  }

  if (crmBoardDateButton) {
    crmBoardDateButton.addEventListener("click", () => {
      openCustomRangePicker("board");
    });
  }

  syncCrmBoardToolbar();
}

function clearDashboardContent() {
  overviewMetrics.replaceChildren();
  teamDailyList.replaceChildren();
  memberAlignedRows.replaceChildren();
  riskBoard.replaceChildren();
  crmOverallTableBody.replaceChildren();
  crmCustomerTableBody.replaceChildren();
  crmOpportunityTableBody.replaceChildren();
  crmOverallTableHead?.replaceChildren();
  crmCustomerTableHead?.replaceChildren();
  crmOpportunityTableHead?.replaceChildren();
}

function setDashboardGenerationState(generated) {
  dashboardGenerated = generated;
  document.body.dataset.dashboardState = generated ? "generated" : "empty";
}

function invalidateDashboardGeneration() {
  resetStreamRevealState();
  clearDashboardContent();
  setDashboardGenerationState(false);
}

function generateDashboardContent() {
  clearDashboardContent();
  resetStreamRevealState();
  setDashboardGenerationState(true);
  renderOverviewRichtext();
  renderMembersRefined();
  renderRiskBoard();
  renderCrmHeaders();
  renderCrmTable();
  renderCrmFullTable();
  renderSalesActivities();
  playStreamReveal();
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

function renderHero() {
  const currentRange = getCurrentRange();
  const currentRangeLabel = getRangeLabel(currentRange.start, currentRange.end);
  if (periodNote) {
    const scopeDisplayLabel = getScopeDisplayLabel(activeTimeScope);
    periodNote.textContent =
      activeTimeScope === "day"
        ? scopeDisplayLabel
          ? `${scopeDisplayLabel} ${currentRangeLabel}`
          : currentRangeLabel
        : scopeDisplayLabel
          ? `${scopeDisplayLabel} ${currentRangeLabel}`
          : currentRangeLabel;
  }
  syncTimeScopeState(activeTimeScope);
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
    return `${getScopeDisplayLabel(activeTimeScope)}（${getRangeLabel(
      getCurrentRange().start,
      getCurrentRange().end
    )}）\uff0c\u5bf9\u6bd4 ${getComparisonLabel()}\uff0c\u5e74\u5ea6\u76ee\u6807 ${formatCompactCurrency(
      reportContext.annualTarget
    )}\uff0c\u5df2\u5b8c\u6210 ${formatCompactCurrency(
      reportContext.achieved
    )}\uff0c\u9636\u6bb5\u8fbe\u6210 ${Math.round(
      reportContext.teamRate * 100
    )}%\u3002\u672c\u671f\u65b0\u589e\u6536\u5165 ${formatCompactCurrency(
      getCurrentRevenue()
    )}\uff0c\u82e5\u5546\u673a\u6c60\u8865\u8db3\uff0c\u5168\u5e74\u6709\u671b\u51b2\u5230 ${formatCompactCurrency(
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
    return `\u5f53\u524d${getScopeDisplayLabel(activeTimeScope)}\u65b0\u589e\u6536\u5165 ${formatCompactCurrency(
      getCurrentRevenue()
    )}\uff0c\u540c\u65f6\u53ef\u53c2\u8003\u4eca\u65e5 ${formatCompactCurrency(
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

function createSvgIcon(viewBox, paths, className = "") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  if (className) {
    svg.classList.add(...className.split(/\s+/).filter(Boolean));
  }

  paths.forEach((pathDef) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (pathDef.d) {
      path.setAttribute("d", pathDef.d);
    }
    if (pathDef.fill) {
      path.setAttribute("fill", pathDef.fill);
    }
    if (pathDef.stroke) {
      path.setAttribute("stroke", pathDef.stroke);
    }
    if (pathDef.strokeWidth) {
      path.setAttribute("stroke-width", pathDef.strokeWidth);
    }
    if (pathDef.strokeLinecap) {
      path.setAttribute("stroke-linecap", pathDef.strokeLinecap);
    }
    if (pathDef.strokeLinejoin) {
      path.setAttribute("stroke-linejoin", pathDef.strokeLinejoin);
    }
    svg.appendChild(path);
  });

  return svg;
}

function createCrmBoardIcon(entityType) {
  if (entityType === "person") {
    return createSvgIcon("0 0 24 24", [
      {
        d: "M12 5.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
        fill: "currentColor",
      },
      {
        d: "M5.5 18.5c.62-3.02 3.16-5 6.5-5s5.88 1.98 6.5 5",
        stroke: "currentColor",
        strokeWidth: "1.7",
        strokeLinecap: "round",
      },
    ], "crm-board-icon is-person");
  }

  return createSvgIcon("0 0 24 24", [
    {
      d: "M4.5 20.5V7.5L12 3l7.5 4.5v13H4.5Z",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinejoin: "round",
    },
    {
      d: "M8 10.25h2.6M8 13.5h2.6M13.4 10.25H16M13.4 13.5H16",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
    },
  ], "crm-board-icon is-company");
}

function createCrmBoardTag(text, className = "") {
  return createElement("span", `crm-board-tag ${className}`.trim(), text);
}

function createCrmBoardChip(text, className = "") {
  return createElement("span", `crm-board-chip ${className}`.trim(), text);
}

function createCrmBoardHeaderCell(label, isActive = false) {
  const cell = createElement("div", `crm-board-head-cell${isActive ? " is-active" : ""}`);
  cell.appendChild(createElement("span", "crm-board-head-label", label));
  return cell;
}

function createCrmBoardOpportunityBlock(opportunity, index) {
  const block = createElement("div", "crm-board-opportunity");
  const head = createElement("div", "crm-board-opportunity-head");
  const title = createElement("div", "crm-board-opportunity-title");
  title.appendChild(createSvgIcon("0 0 24 24", [
    {
      d: "M6.5 7.5h11v9H6.5z",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinejoin: "round",
    },
    {
      d: "M8.5 7.5V6.2C8.5 5.2 9.2 4.5 10.2 4.5h3.6c1 0 1.7.7 1.7 1.7v1.3",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
    },
  ], "crm-board-mini-icon"));
  title.appendChild(createElement("span", "", opportunity.title));
  head.appendChild(title);
  if (opportunity.moreLabel) {
    head.appendChild(createElement("span", "crm-board-opportunity-more", opportunity.moreLabel));
  }
  block.appendChild(head);

  if (opportunity.tags?.length) {
    const tags = createElement("div", "crm-board-opportunity-tags");
    opportunity.tags.forEach((tag, tagIndex) => {
      const tone = tagIndex === 0 ? "tone-warm" : tagIndex === 1 ? "tone-neutral" : "tone-cool";
      tags.appendChild(createCrmBoardChip(tag, tone));
    });
    block.appendChild(tags);
  }

  return block;
}

function createCrmBoardWinBlock(winBlock) {
  const block = createElement("div", "crm-board-win");
  const head = createElement("div", "crm-board-win-head");
  head.appendChild(createElement("span", "crm-board-win-trend", "↗"));
  head.appendChild(createElement("strong", "crm-board-win-label", `赢率 ${winBlock.rate}%`));
  block.appendChild(head);

  const progress = createElement("div", "crm-board-progress");
  const fill = createElement("div", "crm-board-progress-fill");
  fill.style.width = `${Math.max(0, Math.min(winBlock.rate, 100))}%`;
  progress.appendChild(fill);
  block.appendChild(progress);

  if (winBlock.summary) {
    block.appendChild(createElement("div", "crm-board-risk-note", winBlock.summary));
  }

  return block;
}

function createCrmBoardRecentBlock(recentFollowup) {
  const block = createElement("div", "crm-board-followup-card");
  const head = createElement("div", "crm-board-followup-head");
  const time = createElement("div", "crm-board-followup-time", recentFollowup.time);
  head.appendChild(time);
  head.appendChild(createElement("span", "crm-board-followup-more", "更多跟进 >"));
  block.appendChild(head);
  block.appendChild(createElement("div", "crm-board-followup-body", recentFollowup.note));
  return block;
}

function createCrmBoardNextItem(nextFollowup) {
  const item = createElement(
    "div",
    `crm-board-next-item${nextFollowup.done ? " is-done" : ""}${nextFollowup.overdue ? " is-overdue" : ""}`
  );
  item.appendChild(createElement("span", "crm-board-next-dot"));

  const copy = createElement("div", "crm-board-next-copy");
  copy.appendChild(createElement("div", "crm-board-next-time", nextFollowup.time));
  copy.appendChild(createElement("div", "crm-board-next-body", nextFollowup.note));
  item.appendChild(copy);
  return item;
}

function buildCrmBoardCustomerCell(record) {
  const cell = createElement("div", "crm-board-cell crm-board-cell-customer");
  const entity = createElement("div", "crm-board-entity");
  entity.appendChild(createCrmBoardIcon(record.entityType));

  const copy = createElement("div", "crm-board-entity-copy");
  const top = createElement("div", "crm-board-name-row");
  top.appendChild(createElement("strong", "crm-board-name", record.customer));
  if (record.status) {
    top.appendChild(createElement("span", "crm-board-status", `（${record.status}）`));
  }
  copy.appendChild(top);

  const tags = createElement("div", "crm-board-tags");
  record.tags.forEach((tag, tagIndex) => {
    const tone = tagIndex === 0 ? "tone-warm" : tagIndex === 1 ? "tone-cool" : "tone-neutral";
    tags.appendChild(createCrmBoardTag(tag, tone));
  });
  copy.appendChild(tags);

  entity.appendChild(copy);
  cell.appendChild(entity);
  return cell;
}

function buildCrmBoardOpportunityCell(record) {
  const cell = createElement("div", "crm-board-cell crm-board-cell-opportunity");
  const opportunity = record.opportunities[0];
  if (!opportunity) {
    return cell;
  }

  cell.appendChild(createCrmBoardOpportunityBlock(opportunity, 0));
  return cell;
}

function buildCrmBoardWinCell(record) {
  const cell = createElement("div", "crm-board-cell crm-board-cell-win");
  const winBlock = record.winBlocks[0];
  if (!winBlock) {
    return cell;
  }

  cell.appendChild(createCrmBoardWinBlock(winBlock));
  return cell;
}

function buildCrmBoardRecentCell(record) {
  const cell = createElement("div", "crm-board-cell crm-board-cell-recent");
  if (!record.recentFollowup) {
    return cell;
  }

  cell.appendChild(createCrmBoardRecentBlock(record.recentFollowup));
  return cell;
}

function buildCrmBoardNextCell(record) {
  const cell = createElement("div", "crm-board-cell crm-board-cell-next");
  if (record.nextFollowups.length === 0) {
    return cell;
  }

  const list = createElement("div", "crm-board-next-list");
  record.nextFollowups.forEach((nextFollowup) => {
    list.appendChild(createCrmBoardNextItem(nextFollowup));
  });
  cell.appendChild(list);
  return cell;
}

function getFilteredCrmBoardRows() {
  const term = crmBoardSearchTerm.trim().toLowerCase();
  const rows = crmBoardRows.filter((row) => {
    const matchesTerm = !term || row.searchText.includes(term);
    const matchesRange = !crmBoardRangeStart || !crmBoardRangeEnd
      ? true
      : new Date(`${row.updatedAt.slice(0, 10)}T12:00:00`) >= crmBoardRangeStart &&
        new Date(`${row.updatedAt.slice(0, 10)}T12:00:00`) <= crmBoardRangeEnd;
    return matchesTerm && matchesRange;
  });
  rows.sort((a, b) => {
    const left = new Date(a.updatedAt).getTime();
    const right = new Date(b.updatedAt).getTime();
    return crmBoardSortDescending ? right - left : left - right;
  });
  return rows;
}

function syncCrmBoardToolbar() {
  if (crmBoardSortButton) {
    crmBoardSortButton.classList.toggle("is-desc", crmBoardSortDescending);
    crmBoardSortButton.classList.toggle("is-asc", !crmBoardSortDescending);
    crmBoardSortButton.setAttribute(
      "aria-label",
      crmBoardSortDescending ? "切换为最早更新时间排序" : "切换为最新更新时间排序"
    );
  }

  if (crmBoardSearchInput && crmBoardSearchInput.value !== crmBoardSearchTerm) {
    crmBoardSearchInput.value = crmBoardSearchTerm;
  }

  if (crmBoardDateButton) {
    crmBoardDateButton.textContent = formatCrmBoardDateButtonLabel();
  }
}

function renderCrmHeaders() {
  const [overallTable, customerTable, opportunityTable] =
    dashboardDocument.sections.crm.tables;

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
    "客户信息",
    "活跃商机",
    "赢率与风险",
    "最近跟进",
    "下次跟进",
  ].forEach((column) => {
    crmFullHead.appendChild(createCrmBoardHeaderCell(column));
  });

  crmFullTableBody.replaceChildren();
  getFilteredCrmBoardRows().forEach((record) => {
    const row = createElement("div", "crm-board-row");
    row.appendChild(buildCrmBoardCustomerCell(record));
    row.appendChild(buildCrmBoardOpportunityCell(record));
    row.appendChild(buildCrmBoardWinCell(record));
    row.appendChild(buildCrmBoardRecentCell(record));
    row.appendChild(buildCrmBoardNextCell(record));
    crmFullTableBody.appendChild(row);
  });
}

function renderSalesActivities() {
  if (!salesActivityFeed || !salesActivityHead) {
    return;
  }

  syncSalesActivityToolbar();
  salesActivityHead.replaceChildren();
  ["时间", "人员", "客户/商机", "操作日志"].forEach((column) => {
    salesActivityHead.appendChild(createElement("th", "", column));
  });

  salesActivityFeed.replaceChildren();
  const rows = getFilteredSalesActivities();
  if (rows.length === 0) {
    const row = document.createElement("tr");
    row.className = "activity-empty-row";
    const emptyCell = createElement("td", "activity-empty", "暂无匹配记录");
    emptyCell.setAttribute("colspan", "4");
    row.appendChild(emptyCell);
    salesActivityFeed.appendChild(row);
    return;
  }

  rows.forEach((activity) => {
    const row = document.createElement("tr");
    row.appendChild(createElement("td", "activity-time", activity.time));
    row.appendChild(createElement("td", "activity-person", activity.person || ""));
    row.appendChild(createElement("td", "activity-subject", activity.target || ""));
    row.appendChild(createElement("td", "activity-log", activity.action || ""));
    salesActivityFeed.appendChild(row);
  });
}

function parseActivityTimestamp(activity) {
  if (!activity?.date || !activity?.time) {
    return 0;
  }

  const timestamp = new Date(`${activity.date}T${activity.time}:00`).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function isActivityInRange(activity, start, end) {
  if (!start || !end) {
    return true;
  }

  const activityDate = new Date(`${activity.date}T12:00:00`);
  return activityDate >= start && activityDate <= end;
}

function formatActivityDateButtonLabel() {
  if (!salesActivityRangeStart || !salesActivityRangeEnd) {
    return "日期筛选";
  }

  const sameDay =
    formatDateInputValue(salesActivityRangeStart) === formatDateInputValue(salesActivityRangeEnd);
  return sameDay
    ? formatShortDateLabel(salesActivityRangeStart)
    : formatRangeLabel(salesActivityRangeStart, salesActivityRangeEnd);
}

function getFilteredSalesActivities() {
  const term = salesActivitySearchTerm.trim().toLowerCase();
  const rows = salesActivities.filter((activity) => {
    const searchable = [
      activity.date,
      activity.time,
      activity.person,
      activity.target,
      activity.action,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesTerm = !term || searchable.includes(term);
    const matchesRange = isActivityInRange(activity, salesActivityRangeStart, salesActivityRangeEnd);
    return matchesTerm && matchesRange;
  });

  rows.sort((left, right) => {
    const leftTime = parseActivityTimestamp(left);
    const rightTime = parseActivityTimestamp(right);
    return salesActivitySortDescending ? rightTime - leftTime : leftTime - rightTime;
  });

  return rows;
}

function syncSalesActivityToolbar() {
  if (salesActivitySortButton) {
    salesActivitySortButton.classList.toggle("is-desc", salesActivitySortDescending);
    salesActivitySortButton.classList.toggle("is-asc", !salesActivitySortDescending);
    salesActivitySortButton.setAttribute(
      "aria-label",
      salesActivitySortDescending ? "切换为最早时间排序" : "切换为最新时间排序"
    );
  }

  if (salesActivitySearchInput && salesActivitySearchInput.value !== salesActivitySearchTerm) {
    salesActivitySearchInput.value = salesActivitySearchTerm;
  }

  if (salesActivityDateButton) {
    salesActivityDateButton.textContent = formatActivityDateButtonLabel();
  }
}

function formatCrmBoardDateButtonLabel() {
  if (!crmBoardRangeStart || !crmBoardRangeEnd) {
    return "日期筛选";
  }

  const sameDay =
    formatDateInputValue(crmBoardRangeStart) === formatDateInputValue(crmBoardRangeEnd);
  return sameDay
    ? formatShortDateLabel(crmBoardRangeStart)
    : formatRangeLabel(crmBoardRangeStart, crmBoardRangeEnd);
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
  document.body.dataset.pageView = tabName;
  syncPageTabState(tabName);
}

function setupPageTabs() {
  pageTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.pageTab || "team";
      closeAdminModal();
      setPageView(tabName);
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  });

  setPageView(activePageTab);
}

function setupAdminPanel() {
  if (adminPanelButton) {
    adminPanelButton.addEventListener("click", openAdminModal);
  }

  if (adminAddUserButton) {
    adminAddUserButton.addEventListener("click", openAdminCreateModal);
  }

  if (adminModalBackdrop) {
    adminModalBackdrop.addEventListener("click", closeAdminModal);
  }

  if (adminModalClose) {
    adminModalClose.addEventListener("click", closeAdminModal);
  }

  if (adminEditBackdrop) {
    adminEditBackdrop.addEventListener("click", closeAdminEditModal);
  }

  if (adminEditClose) {
    adminEditClose.addEventListener("click", closeAdminEditModal);
  }

  if (adminEditCancelButton) {
    adminEditCancelButton.addEventListener("click", closeAdminEditModal);
  }

  if (adminEditDeleteButton) {
    adminEditDeleteButton.addEventListener("click", deleteActiveAdminAccount);
  }

  if (adminEditTypeGroup) {
    adminEditTypeGroup.addEventListener("change", (event) => {
      const input = event.target.closest('input[name="admin-edit-contact-type"]');
      if (!input) {
        return;
      }

      const nextType = input.value || "phone";
      if (nextType === adminEditContactType) {
        return;
      }

      adminEditContactType = nextType;
      adminEditInviteSent = false;
      adminEditGeneratedCode = "";
      adminEditDraftContactValue = "";
      if (adminInviteHint) {
        delete adminInviteHint.dataset.locked;
        adminInviteHint.textContent = "";
      }
      if (adminInviteCodeInput) {
        adminInviteCodeInput.value = "";
      }
      renderAdminEditModal();
      adminEditContactInput?.focus();
    });
  }

  if (adminEditUsernameInput) {
    adminEditUsernameInput.addEventListener("input", () => {
      adminEditDraftUsernameValue = adminEditUsernameInput.value;
      if (adminInviteHint) {
        delete adminInviteHint.dataset.locked;
        adminInviteHint.textContent = "";
      }
      renderAdminEditModal();
    });
  }

  if (adminEditContactInput) {
    adminEditContactInput.addEventListener("input", () => {
      adminEditDraftContactValue = adminEditContactInput.value;
      if (adminInviteHint) {
        delete adminInviteHint.dataset.locked;
        adminInviteHint.textContent = "";
      }
      if (adminEditInviteSent) {
        adminEditInviteSent = false;
        adminEditGeneratedCode = "";
        if (adminInviteCodeInput) {
          adminInviteCodeInput.value = "";
        }
        if (adminInviteHint) {
          adminInviteHint.textContent = "重新填写后再次发送验证码";
        }
      }
      renderAdminEditModal();
    });
  }

  if (adminSendInviteButton) {
    adminSendInviteButton.addEventListener("click", sendAdminInviteCode);
  }

  if (adminInviteCodeInput) {
    adminInviteCodeInput.addEventListener("input", renderAdminEditModal);
  }

  if (adminEditConfirmButton) {
    adminEditConfirmButton.addEventListener("click", confirmAdminEdit);
  }

  if (adminTableBody) {
    adminTableBody.addEventListener("click", (event) => {
      const editButton = event.target.closest('[data-admin-action="edit"]');
      if (editButton) {
        openAdminEditModal(editButton.dataset.accountId || "");
        return;
      }
    });
  }

  syncAdminModalVisibility();
  syncAdminEditModalVisibility();
}

function setupPromptSettings() {
  loadDashboardGenerationPrompt();
  syncPromptSettingsVisibility();
  syncPromptMoreVisibility();

  if (promptSettingsButton) {
    promptSettingsButton.addEventListener("click", openPromptSettingsModal);
  }

  if (promptMoreButton) {
    promptMoreButton.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePromptMoreMenu();
    });
  }

  if (exportWordButton) {
    exportWordButton.addEventListener("click", () => {
      togglePromptMoreMenu(false);
      exportDashboardAsWord();
    });
  }

  if (regeneratePageButton) {
    regeneratePageButton.addEventListener("click", () => {
      togglePromptMoreMenu(false);
      invalidateDashboardGeneration();
      generateDashboardContent();
    });
  }

  if (promptSettingsBackdrop) {
    promptSettingsBackdrop.addEventListener("click", closePromptSettingsModal);
  }

  if (promptSettingsClose) {
    promptSettingsClose.addEventListener("click", closePromptSettingsModal);
  }

  if (promptSettingsCancel) {
    promptSettingsCancel.addEventListener("click", closePromptSettingsModal);
  }

  if (promptSettingsSave) {
    promptSettingsSave.addEventListener("click", confirmPromptSettings);
  }

  document.addEventListener("click", (event) => {
    if (!promptMoreOpen) {
      return;
    }
    const target = event.target;
    if (
      target instanceof Node &&
      (promptMoreButton?.contains(target) || promptMoreMenu?.contains(target))
    ) {
      return;
    }
    togglePromptMoreMenu(false);
  });
}

function initializeDate() {
  applySelectedRange(today, today, "day");

  syncTimeScopeState(activeTimeScope);
  syncRangeInputs();
  syncCustomRangeVisibility();

  timeScopeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scope = button.dataset.timeScope || "day";
      if (scope === "custom") {
        openCustomRangePicker("report", { fresh: activeTimeScope !== "custom" });
        return;
      }
      setTimeScope(scope);
    });
  });

  if (timeScopePrevButton) {
    timeScopePrevButton.addEventListener("click", () => {
      applyScopeShift(-1);
    });
  }

  if (timeScopeNextButton) {
    timeScopeNextButton.addEventListener("click", () => {
      applyScopeShift(1);
    });
  }

  if (applyRangeButton) {
    applyRangeButton.addEventListener("click", () => {
      if (!crmBoardDraftRangeStart || !crmBoardDraftRangeEnd) {
        return;
      }

      const start = new Date(crmBoardDraftRangeStart);
      const end = new Date(crmBoardDraftRangeEnd);

      if (customRangeTarget === "activity") {
        salesActivityRangeStart = start;
        salesActivityRangeEnd = end;
        if (salesActivityRangeEnd < salesActivityRangeStart) {
          const swap = salesActivityRangeStart;
          salesActivityRangeStart = salesActivityRangeEnd;
          salesActivityRangeEnd = swap;
        }
        customRangeOpen = false;
        customRangeTarget = "report";
        syncCustomRangeVisibility();
        renderSalesActivities();
        return;
      }

      if (customRangeTarget === "board") {
        crmBoardRangeStart = start;
        crmBoardRangeEnd = end;
        if (crmBoardRangeEnd < crmBoardRangeStart) {
          const swap = crmBoardRangeStart;
          crmBoardRangeStart = crmBoardRangeEnd;
          crmBoardRangeEnd = swap;
        }
        customRangeOpen = false;
        customRangeTarget = "report";
        syncCustomRangeVisibility();
        syncCrmBoardToolbar();
        renderCrmFullTable();
        return;
      }

      applySelectedRange(start, end, "custom");
    });
  }

  if (clearRangeButton) {
    clearRangeButton.addEventListener("click", clearSelectedRange);
  }

  if (cancelRangeButton) {
    cancelRangeButton.addEventListener("click", closeCustomRangePicker);
  }

  if (customRangeBackdrop) {
    customRangeBackdrop.addEventListener("click", closeCustomRangePicker);
  }

  if (customRangeCloseButton) {
    customRangeCloseButton.addEventListener("click", closeCustomRangePicker);
  }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (adminEditModalOpen) {
          closeAdminEditModal();
        } else if (promptSettingsOpen) {
          closePromptSettingsModal();
        } else if (promptMoreOpen) {
          togglePromptMoreMenu(false);
        } else if (adminModalOpen) {
          closeAdminModal();
        } else if (customRangeOpen) {
        closeCustomRangePicker();
      }
    }
  });

  if (boardRangePrevMonth) {
    boardRangePrevMonth.addEventListener("click", () => {
      crmBoardPickerMonth = new Date(crmBoardPickerMonth.getFullYear(), crmBoardPickerMonth.getMonth() - 1, 1);
      syncBoardRangePickerState();
    });
  }

  if (boardRangeNextMonth) {
    boardRangeNextMonth.addEventListener("click", () => {
      crmBoardPickerMonth = new Date(crmBoardPickerMonth.getFullYear(), crmBoardPickerMonth.getMonth() + 1, 1);
      syncBoardRangePickerState();
    });
  }

  if (salesActivitySortButton) {
    salesActivitySortButton.addEventListener("click", () => {
      salesActivitySortDescending = !salesActivitySortDescending;
      syncSalesActivityToolbar();
      renderSalesActivities();
    });
  }

  if (salesActivitySearchInput) {
    salesActivitySearchInput.addEventListener("input", () => {
      salesActivitySearchTerm = salesActivitySearchInput.value || "";
      renderSalesActivities();
    });
  }

  if (salesActivityDateButton) {
    salesActivityDateButton.addEventListener("click", () => {
      openCustomRangePicker("activity");
    });
  }

  if (salesActivityMoreButton) {
    salesActivityMoreButton.addEventListener("click", () => {
      salesActivitySearchInput?.focus();
    });
  }

  window.scrollTo({ top: 0, behavior: "auto" });
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
  const scopeLabel = getScopeDisplayLabel(activeTimeScope);
  const currentRange = getCurrentRange();
  const currentRangeLabel = getRangeLabel(currentRange.start, currentRange.end);
  const comparisonRevenue = getComparisonRevenue();
  const currentRevenue = getCurrentRevenue();
  const comparisonRangeLabel = getComparisonLabel();
  const comparisonRange = getComparisonRange();
  const comparisonRangeText = getRangeLabel(comparisonRange.start, comparisonRange.end);
  const cards = [
    {
      prefix: "🎯",
      label: "年度达成",
      value: `${Math.round(reportContext.teamRate * 100)}%`,
      note: `目标 ${formatCompactCurrency(reportContext.annualTarget)}，已完成 ${formatCompactCurrency(
        reportContext.achieved
      )}`,
    },
    {
      prefix: "📈",
      label: `${scopeLabel}收入`,
      value: formatCompactCurrency(currentRevenue),
      note: `对比 ${formatCompactCurrency(comparisonRevenue)} / ${comparisonRangeText}`,
    },
    {
      prefix: "⚠️",
      label: "重点风险",
      value: `${reportContext.highRiskItems}`,
      note: `商机 ${reportContext.stalledOpportunities} / B 级客户 ${reportContext.overdueBLevelCustomers} / 头部依赖 1`,
    },
  ];

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
  [
    {
      titlePrefix: "📊",
      title: "业绩达成",
      body: `**当前周期：** ${scopeLabel}（${currentRangeLabel}）。**对比周期：** ${comparisonRangeLabel}。**年度目标：** ${formatCompactCurrency(
        reportContext.annualTarget
      )} / 年。**本期新增收入：** ${formatCompactCurrency(currentRevenue)}。**对比收入：** ${formatCompactCurrency(
        comparisonRevenue
      )}。**年度达成：** ${Math.round(
        reportContext.teamRate * 100
      )}%。`,
    },
    {
      titlePrefix: "🧭",
      title: "商机与线索",
      body: `**线索池：** ${reportContext.newQualifiedLeads} 个有效线索。**商机池：** 预计成交 ${formatCompactCurrency(
        reportContext.opportunityPool
      )}，仍缺口 ${formatCompactCurrency(reportContext.opportunityGap)}。**对比周期：** 商机变化需结合 CRM 表查看。**本月丢单：** ${reportContext.monthlyLostDeals} 单。`,
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
  ].forEach((cardData, index) => {
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
  setupPromptSettings();
  initializeDate();
  setupCrmBoardControls();
  setupPageTabs();
  setupAdminPanel();
  setupChat();
  playTypewriter();

  if (generateNowButton) {
    generateNowButton.addEventListener("click", generateDashboardContent);
  }

  addMessage(
    "assistant",
    dashboardDocument.chat.greeting
  );
}

initialize();


