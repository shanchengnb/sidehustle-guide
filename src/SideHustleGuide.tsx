import { useState, useEffect } from 'react';

type TabType = 'overview' | 'investing' | 'ecommerce' | 'knowledge' | 'daily' | 'roadmap';

interface SidebarItem {
  id: TabType;
  label: string;
  icon: string;
  color: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'overview', label: '副业总览', icon: '🎯', color: 'bg-blue-500' },
  { id: 'investing', label: '股票基金', icon: '📈', color: 'bg-green-500' },
  { id: 'ecommerce', label: '跨境电商', icon: '🛒', color: 'bg-orange-500' },
  { id: 'knowledge', label: '知识付费', icon: '📚', color: 'bg-purple-500' },
  { id: 'daily', label: '每日推荐', icon: '🤖', color: 'bg-red-500' },
  { id: 'roadmap', label: '学习路径', icon: '🗺️', color: 'bg-teal-500' },
];

// 万晴API配置
const WQ_API_KEY = 'e6thjxhllw5rn8sikp36nj4xng7xxtbwaj29';
const WQ_API_ENDPOINT = '/api/generate';

async function callWanqingAPI(systemPrompt: string, userInput: string): Promise<string> {
  try {
    const response = await fetch(WQ_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt,
        userInput,
        apiKey: WQ_API_KEY
      })
    });

    const data = await response.json();
    if (data.success) {
      return data.content || data.raw || '生成失败';
    }
    return data.error || '请求失败';
  } catch (error) {
    return 'API调用失败: ' + (error as Error).message;
  }
}

function SideHustleGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 fixed h-screen overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">💰 副业致富指南</h1>
          <p className="text-xs text-gray-500 mt-1">AI产品经理的自我救赎</p>
        </div>

        <nav className="space-y-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeTab === item.id
                  ? 'bg-gray-100 border-l-4 border-gray-800 font-medium'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            ⚠️ <strong>免责声明</strong><br />
            本页面内容仅供学习参考，不构成投资建议。
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'investing' && <InvestingSection />}
        {activeTab === 'ecommerce' && <EcommerceSection />}
        {activeTab === 'knowledge' && <KnowledgeSection />}
        {activeTab === 'daily' && <DailyRecommendSection />}
        {activeTab === 'roadmap' && <RoadmapSection />}
      </main>
    </div>
  );
}

// ==================== 副业总览 ====================
function OverviewSection() {
  const sideHustles = [
    {
      title: '股票基金投资',
      icon: '📈',
      potential: '高',
      difficulty: '中高',
      time: '灵活',
      capital: '1万起',
      pros: ['被动收入', '复利效应', '时间自由'],
      cons: ['风险较高', '需要学习', '波动焦虑'],
      fit: '适合有一定积蓄、愿意学习、能承受波动的人',
    },
    {
      title: '跨境电商',
      icon: '🛒',
      potential: '中高',
      difficulty: '中',
      time: '需投入',
      capital: '3-5万起',
      pros: ['收入上限高', '可规模化', '时间自主'],
      cons: ['运营复杂', '竞争激烈', '需持续投入'],
      fit: '适合有执行力、愿意钻研、能承受前期亏损的人',
    },
    {
      title: '知识付费',
      icon: '📚',
      potential: '中',
      difficulty: '中低',
      time: '前期投入大',
      capital: '几乎零成本',
      pros: ['零库存', '可复利', '个人品牌'],
      cons: ['需积累影响力', '竞争激烈', '变现周期长'],
      fit: '适合有专业技能、善于表达、愿意持续输出的人',
    },
  ];

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🎯 副业总览与推荐</h2>
        <p className="text-gray-600 mt-2">作为AI产品经理，你的优势与各副业的匹配度分析</p>
      </header>

      {/* 你的优势分析 */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 你的核心优势</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '产品思维', desc: '用户洞察、需求分析' },
            { label: 'AI趋势', desc: '了解最新技术动态' },
            { label: '学习能力', desc: '快速掌握新领域' },
            { label: '行业人脉', desc: '技术社区资源' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-medium text-gray-900">{item.label}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 副业对比卡片 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 三大核心副业对比</h3>
        <div className="grid gap-6">
          {sideHustles.map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{item.fit}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">潜力:{item.potential}</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">难度:{item.difficulty}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">资金:{item.capital}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-green-600 font-medium">✅ 优势</span>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    {item.pros.map(pro => <li key={pro}>• {pro}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-sm text-red-600 font-medium">⚠️ 挑战</span>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    {item.cons.map(con => <li key={con}>• {con}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 推荐策略 */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 我给你的推荐策略</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">短期(0-6月)</span>
              知识付费 + 自媒体
            </div>
            <p className="text-sm text-gray-600 mt-2">
              利用你的AI产品经理身份，开始在小红书/公众号分享AI产品洞察，积累影响力，几乎零成本起步。
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">中期(6-18月)</span>
              基金定投 + AI工具开发
            </div>
            <p className="text-sm text-gray-600 mt-2">
              开启指数基金定投，同时开发一个小型AI工具/Agent，验证产品化能力，可能产生被动收入。
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">长期(18月+)</span>
              跨境电商 + 股票投资
            </div>
            <p className="text-sm text-gray-600 mt-2">
              如果自媒体积累了流量，可以尝试跨境电商；同时深入学习股票投资，配置核心资产。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==================== 股票基金详解 ====================
function InvestingSection() {
  const [activeLesson, setActiveLesson] = useState<string>('basics');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const lessonTabs = [
    { id: 'basics', label: '基础概念', icon: '📖' },
    { id: 'technical', label: '技术分析', icon: '📊' },
    { id: 'fundamental', label: '基本面分析', icon: '🏢' },
    { id: 'strategy', label: '投资策略', icon: '🎯' },
    { id: 'risk', label: '风险管理', icon: '🛡️' },
    { id: 'practice', label: '实操指南', icon: '🔧' },
  ];

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">📈 股票基金从入门到精通</h2>
        <p className="text-gray-600 mt-2">系统学习，从小白到投资者的蜕变之路</p>
      </header>

      {/* 课程导航 */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-4 border border-gray-200">
        {lessonTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveLesson(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLesson === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 课程内容 */}
      {activeLesson === 'basics' && <InvestingBasics />}
      {activeLesson === 'technical' && <TechnicalAnalysis expandedTopic={expandedTopic} setExpandedTopic={setExpandedTopic} />}
      {activeLesson === 'fundamental' && <FundamentalAnalysis />}
      {activeLesson === 'strategy' && <InvestingStrategy />}
      {activeLesson === 'risk' && <RiskManagement />}
      {activeLesson === 'practice' && <PracticeGuide />}
    </div>
  );
}

// 基础概念
function InvestingBasics() {
  const concepts = [
    {
      title: '什么是股票？',
      content: `
### 定义
股票是公司所有权的凭证。买入股票 = 成为公司的部分所有者（股东）。

### 股票分类
- **A股**：中国大陆上市，人民币交易
- **港股**：香港上市，港币交易
- **美股**：美国上市，美元交易

### 股票代码规则
- A股：600xxx、000xxx、300xxx（创业板）
- 港股：0xxxx、99xxx
- 美股：字母缩写（如AAPL、TSLA）

### 股票交易规则
- 交易时间：工作日 9:30-11:30, 13:00-15:00
- 涨跌停：主板±10%，创业板/科创板±20%
- T+1制度：当天买入，次日才能卖出
- 手续费：佣金（万分之二三）+印花税（千分之一，仅卖出）

### 如何赚钱？
1. **价差收益**：10元买，15元卖，赚5元/股
2. **分红收益**：公司盈利后分红给股东（如茅台每年分红）
      `,
    },
    {
      title: '什么是基金？',
      content: `
### 定义
基金 = 一篮子股票/债券，由专业经理管理。买基金 = 雇人帮你投资。

### 基金分类
| 类型 | 特点 | 风险 |
|------|------|------|
| 货币基金 | 类似余额宝，保本 | 极低 |
| 债券基金 | 主要投资债券 | 低 |
| 混合基金 | 股债结合 | 中 |
| 股票基金 | 80%以上买股票 | 高 |
| 指数基金 | 跟踪指数（推荐） | 中高 |

### 基金费用
- **申购费**：买入时收取（约1.5%，平台打折后0.1%）
- **管理费**：每年约1.5%（指数基金仅0.1-0.5%）
- **托管费**：每年约0.25%
- **赎回费**：卖出时收取（持有<7天1.5%，>2年通常0）

### 基金净值
- 单位净值 = 基金总资产/总份额
- 净值上涨 = 赚钱
- 累计净值 = 单位净值 + 历史分红

### ETF vs 场外基金
- **ETF**：交易所交易，像股票一样买卖，费率低
- **场外基金**：在支付宝/天天基金申购，按收盘净值成交
      `,
    },
    {
      title: '什么是指数？',
      content: `
### 定义
指数 = 一组股票的集合，反映整体市场表现。

### 重要指数
| 指数 | 包含 | 代表意义 |
|------|------|----------|
| 上证指数 | 上海全部股票 | A股大盘 |
| 深证成指 | 深圳40只龙头 | 深市表现 |
| 沪深300 | 最大的300家 | 核心资产 |
| 中证500 | 中小盘500家 | 成长股 |
| 创业板指 | 创业板龙头 | 新兴产业 |
| 科创50 | 科创板龙头 | 硬科技 |
| 恒生指数 | 港股龙头 | 香港市场 |
| 纳斯达克100 | 美国科技股 | 科技风向 |
| 标普500 | 美国大公司 | 美股大盘 |

### 指数基金优势
1. **费率低**：管理费仅0.1-0.5%
2. **分散风险**：买1个基金 = 买几百只股票
3. **透明**：持仓公开，不会跑路
4. **长期向上**：指数代表国运，长期必然上涨

### 巴菲特推荐
"对于绝大多数投资者，低成本的指数基金是最好的选择。"
      `,
    },
    {
      title: '什么是定投？',
      content: `
### 定义
定期定额投资 = 每月固定时间投入固定金额。

### 定投原理
- 跌时买的份额多
- 涨时买的份额少
- 平均成本低于平均价格

### 举例说明
假设每月投1000元：

| 月份 | 基金净值 | 买入份额 |
|------|----------|----------|
| 1月 | 1.0元 | 1000份 |
| 2月 | 0.8元 | 1250份 |
| 3月 | 0.5元 | 2000份 |
| 4月 | 1.0元 | 1000份 |

- 总投入：4000元
- 总份额：5250份
- 平均成本：4000/5250 = 0.76元
- 当前价值：5250 × 1.0 = 5250元
- 收益：(5250-4000)/4000 = 31.25%

### 定投优势
1. **摊薄成本**：不用择时，自动摊薄
2. **克服人性**：跌时敢买，涨时不追
3. **积少成多**：每月存钱，强制储蓄
4. **简单易行**：设置好后自动扣款

### 定投策略
- **时间**：每月固定日期（如发薪日）
- **金额**：收入的10-30%
- **品种**：宽基指数（沪深300、纳斯达克100）
- **期限**：坚持3-5年，不中断

### 定投止盈
- 目标收益率达到（如20%）可考虑止盈
- 分批止盈，不要一次性清仓
- 止盈后继续定投，滚雪球
      `,
    },
  ];

  return (
    <div className="space-y-6">
      {concepts.map((concept, idx) => (
        <details key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
          <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900 flex items-center justify-between">
            <span className="text-lg">{concept.title}</span>
            <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{concept.content}</div>
          </div>
        </details>
      ))}
    </div>
  );
}

// 技术分析（详细）
function TechnicalAnalysis({ expandedTopic, setExpandedTopic }: { expandedTopic: string | null, setExpandedTopic: (v: string | null) => void }) {
  const topics = [
    {
      id: 'kline',
      title: 'K线图详解',
      content: `
### 什么是K线？
K线（蜡烛图）是记录一段时间内价格变动的图表，由开盘价、收盘价、最高价、最低价组成。

### K线结构
\`\`\`
      │ 最高价
      │
  ┌───┴───┐
  │       │  上影线
  │       │
  ├───┬───┤ ← 收盘价（阳线）或开盘价（阴线）
  │   │   │
  │   │   │  实体
  │   │   │
  ├───┴───┤ ← 开盘价（阳线）或收盘价（阴线）
  │       │  下影线
  │       │
      │ 最低价
\`\`\`

### K线类型
| 名称 | 特征 | 市场含义 |
|------|------|----------|
| 大阳线 | 实体长，收盘远高于开盘 | 强势上涨 |
| 大阴线 | 实体长，收盘远低于开盘 | 强势下跌 |
| 小阳线 | 实体小，微涨 | 多头略占优 |
| 小阴线 | 实体小，微跌 | 空头略占优 |
| 十字星 | 开盘=收盘 | 多空平衡，可能反转 |
| 倒锤头 | 下影线长，实体小 | 见底信号 |
| 流星线 | 上影线长，实体小 | 见顶信号 |
| 锤子线 | 下影线长，实体小，位于下跌后 | 见底信号 |

### 重要K线组合
1. **早晨之星**（看涨）
   - 第一根：大阴线
   - 第二根：小实体（十字星）
   - 第三根：大阳线，突破第一根中点

2. **黄昏之星**（看跌）
   - 第一根：大阳线
   - 第二根：小实体（十字星）
   - 第三根：大阴线，跌破第一根中点

3. **红三兵**（看涨）
   - 连续三根阳线
   - 每根收盘逐步走高

4. **黑三鸦**（看跌）
   - 连续三根阴线
   - 每根收盘逐步走低

### K线周期
- 1分钟/5分钟/15分钟：短线交易
- 日K线：中短线分析
- 周K线/月K线：中长线趋势
      `,
    },
    {
      id: 'ma',
      title: '移动平均线（MA）',
      content: `
### 什么是均线？
均线（Moving Average）是一段时间内价格的平均值连线，用于判断趋势方向。

### 均线计算
- MA5 = 最近5天收盘价之和 / 5
- MA20 = 最近20天收盘价之和 / 20
- MA60 = 最近60天收盘价之和 / 60

### 常用均线
| 均线 | 别名 | 作用 |
|------|------|------|
| MA5 | 周线 | 短期趋势 |
| MA10 | 半月线 | 短线操作 |
| MA20 | 月线 | 中期趋势 |
| MA60 | 季线 | 中长期支撑 |
| MA120 | 半年线 | 长期趋势 |
| MA250 | 年线 | 牛熊分界 |

### 均线使用方法
1. **趋势判断**
   - 价格在均线上方：上升趋势
   - 价格在均线下方：下降趋势

2. **金叉/死叉**
   - 金叉：短期均线上穿长期均线 → 买入信号
   - 死叉：短期均线下穿长期均线 → 卖出信号

3. **支撑/压力**
   - 上升趋势中，均线是支撑位
   - 下降趋势中，均线是压力位

4. **多头/空头排列**
   - 多头排列：MA5>MA10>MA20>MA60，价格在均线上方
   - 空头排列：MA5<MA10<MA20<MA60，价格在均线下方

### 注意事项
- 均线是滞后指标
- 震荡市中容易失效
- 配合其他指标使用
      `,
    },
    {
      id: 'macd',
      title: 'MACD指标详解',
      content: `
### 什么是MACD？
MACD（异同移动平均线）是趋势类指标，由两线一柱组成。

### MACD组成
- **DIF线**（快线）：12日EMA - 26日EMA
- **DEA线**（慢线）：DIF的9日EMA
- **MACD柱**：(DIF - DEA) × 2

### MACD使用方法
1. **金叉/死叉**
   - 金叉：DIF上穿DEA → 买入信号
   - 死叉：DIF下穿DEA → 卖出信号
   - 0轴上方金叉更可靠
   - 0轴下方死叉更可靠

2. **柱线变化**
   - 红柱变长：多头力量增强
   - 红柱变短：多头力量减弱
   - 绿柱变长：空头力量增强
   - 绿柱变短：空头力量减弱

3. **背离**
   - 顶背离：价格创新高，MACD不创新高 → 见顶信号
   - 底背离：价格创新低，MACD不创新低 → 见底信号

### MACD参数
- 默认：(12, 26, 9)
- 短线：(6, 13, 5)
- 长线：(24, 52, 18)

### 实战技巧
- 零轴是多空分界线
- MACD在水上（零轴上方）运行时，金叉更可靠
- 背离是重要的反转信号
      `,
    },
    {
      id: 'rsi',
      title: 'RSI指标详解',
      content: `
### 什么是RSI？
RSI（相对强弱指数）衡量价格变动的速度和变化，判断超买超卖。

### RSI计算
RSI = 100 - 100/(1 + RS)
其中 RS = n日上涨幅度平均值 / n日下跌幅度平均值

### RSI数值含义
| RSI范围 | 状态 | 操作建议 |
|---------|------|----------|
| > 80 | 超买区 | 考虑卖出 |
| 60-80 | 强势区 | 持有 |
| 40-60 | 平衡区 | 观望 |
| 20-40 | 弱势区 | 等待 |
| < 20 | 超卖区 | 考虑买入 |

### RSI使用方法
1. **超买超卖**
   - RSI > 80：可能见顶，考虑卖出
   - RSI < 20：可能见底，考虑买入

2. **背离**
   - 顶背离：价格新高，RSI不新高 → 见顶
   - 底背离：价格新低，RSI不新低 → 见底

3. **中线支撑**
   - 上升趋势中，RSI在40-50有支撑
   - 下降趋势中，RSI在50-60有压力

### RSI参数
- 短线：RSI6
- 中线：RSI14（默认）
- 长线：RSI24
      `,
    },
    {
      id: 'volume',
      title: '成交量分析',
      content: `
### 什么是成交量？
成交量是一段时间内买卖达成的股数，反映市场活跃度。

### 成交量指标
- **VOL**：成交量柱状图
- **VMA**：成交量均线
- **OBV**：能量潮指标

### 量价关系
| 价格 | 成交量 | 含义 |
|------|--------|------|
| 上涨 | 放量 | 买盘积极，继续看好 |
| 上涨 | 缩量 | 买盘不足，可能回调 |
| 下跌 | 放量 | 卖盘涌出，继续看空 |
| 下跌 | 缩量 | 卖盘枯竭，可能见底 |

### 重要量价形态
1. **量增价升**
   - 健康上涨形态
   - 有量支撑，趋势延续

2. **量缩价升**
   - 上涨动力不足
   - 可能是诱多

3. **量增价跌**
   - 主力出货或恐慌盘
   - 注意风险

4. **量缩价跌**
   - 卖盘枯竭
   - 可能接近底部

5. **地量见地价**
   - 成交量创历史新低
   - 往往是底部信号

6. **天量见天价**
   - 成交量创历史新高
   - 往往是顶部信号

### 换手率
- 换手率 = 成交量 / 流通股本 × 100%
- < 3%：不活跃
- 3-7%：相对活跃
- 7-10%：高度活跃
- > 10%：极度活跃（注意风险）
      `,
    },
    {
      id: 'boll',
      title: '布林线（BOLL）',
      content: `
### 什么是布林线？
布林线由三条轨道组成，显示价格的波动区间。

### 布林线组成
- **中轨**：20日移动平均线
- **上轨**：中轨 + 2倍标准差
- **下轨**：中轨 - 2倍标准差

### 布林线使用方法
1. **通道突破**
   - 价格突破上轨：可能超买
   - 价格跌破下轨：可能超卖

2. **通道收窄**
   - 布林带收口：即将变盘
   - 收窄后突破，方向确定

3. **通道支撑压力**
   - 上升趋势中，下轨是支撑
   - 下降趋势中，上轨是压力

4. **波动率判断**
   - 带宽扩大：波动加剧
   - 带宽收窄：波动减小

### 布林线实战技巧
- 价格触及上轨，RSI也超买 → 卖出信号
- 价格触及下轨，RSI也超卖 → 买入信号
- 布林带收窄后的突破往往有效
- 配合成交量判断突破真伪
      `,
    },
    {
      id: 'pattern',
      title: '技术形态',
      content: `
### 反转形态
1. **头肩顶**（看跌）
   - 左肩-头部-右肩
   - 跌破颈线确认

2. **头肩底**（看涨）
   - 左肩-头部-右肩
   - 突破颈线确认

3. **双顶（M头）**（看跌）
   - 两个高点基本相等
   - 跌破颈线确认

4. **双底（W底）**（看涨）
   - 两个低点基本相等
   - 突破颈线确认

5. **圆弧底**（看涨）
   - 价格缓慢见底回升
   - 成交量先缩后放

### 持续形态
1. **三角形**
   - 上升三角形：看涨
   - 下降三角形：看跌
   - 对称三角形：方向待定

2. **旗形**
   - 上升旗形：看涨
   - 下降旗形：看跌

3. **楔形**
   - 上升楔形：看跌
   - 下降楔形：看涨

### 缺口形态
| 缺口类型 | 特征 | 意义 |
|----------|------|------|
| 普通缺口 | 很快回补 | 意义不大 |
| 突破缺口 | 成交量大 | 趋势确立 |
| 中继缺口 | 上涨中途 | 趋势延续 |
| 竭尽缺口 | 高位/低位 | 趋势结束 |
      `,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-green-800 mb-2">📊 技术分析学习路线</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          {['K线基础', '均线系统', 'MACD', 'RSI', '成交量', '布林线', '技术形态'].map((item, idx) => (
            <span key={item} className="flex items-center gap-1">
              <span className="px-2 py-1 bg-white rounded text-green-700">{item}</span>
              {idx < 6 && <span className="text-green-400">→</span>}
            </span>
          ))}
        </div>
      </div>

      {topics.map(topic => (
        <div key={topic.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900 text-lg">{topic.title}</span>
            <span className="text-gray-400 text-xl">{expandedTopic === topic.id ? '−' : '+'}</span>
          </button>
          {expandedTopic === topic.id && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
                {topic.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 基本面分析
function FundamentalAnalysis() {
  const metrics = [
    {
      title: '市盈率（PE）',
      formula: 'PE = 股价 / 每股收益',
      content: `
### 含义
买回本需要多少年。PE=10意味着10年回本。

### 使用方法
- PE越低越便宜（但不能只看这个）
- 同行业对比有意义
- 周期股PE低时反而要小心

### 参考标准
| PE范围 | 估值水平 |
|-------|----------|
| < 15 | 低估 |
| 15-25 | 合理 |
| 25-40 | 偏高 |
| > 40 | 高估 |

### 注意事项
- 不同行业PE差异大
- 银行股PE通常低（5-10）
- 科技股PE通常高（30-50）
- 亏损公司PE无意义
      `,
    },
    {
      title: '市净率（PB）',
      formula: 'PB = 股价 / 每股净资产',
      content: `
### 含义
股价是净资产的多少倍。

### 使用方法
- PB < 1：股价跌破净资产，可能低估
- PB > 3：估值可能偏高

### 适用场景
- 重资产行业（银行、钢铁、地产）
- 周期性行业

### 不适用场景
- 轻资产公司（互联网、科技）
- 无形资产占比高的公司

### 参考标准
| PB范围 | 估值水平 |
|--------|----------|
| < 1 | 低估（破净） |
| 1-2 | 合理 |
| 2-5 | 偏高 |
| > 5 | 高估 |
      `,
    },
    {
      title: '净资产收益率（ROE）',
      formula: 'ROE = 净利润 / 净资产 × 100%',
      content: `
### 含义
股东权益的回报率，衡量公司赚钱能力。

### 巴菲特标准
"如果只能选一个指标，我选ROE。"
——沃伦·巴菲特

### 参考标准
| ROE范围 | 评价 |
|---------|------|
| > 20% | 优秀 |
| 15-20% | 良好 |
| 10-15% | 一般 |
| < 10% | 较差 |

### 杜邦分析
ROE = 净利率 × 资产周转率 × 权益乘数

三个维度分析：
1. 净利率 → 盈利能力
2. 资产周转率 → 运营效率
3. 权益乘数 → 财务杠杆

### 高ROE来源
- 高净利率（品牌优势）
- 高周转（管理效率）
- 高杠杆（风险也高）

### 注意事项
- ROE过高可能用了财务杠杆
- 要看连续多年的ROE
- 与同行业对比
      `,
    },
    {
      title: '营收和利润增长',
      formula: '增长率 = (本期 - 上期) / 上期 × 100%',
      content: `
### 营收增长
- 反映市场份额扩张
- 持续增长是健康信号
- 注意增长来源（内生还是并购）

### 利润增长
- 净利润增长更关键
- 利润增速 > 营收增速 = 盈利改善
- 利润增速 < 营收增速 = 成本上升

### 增长标准
| 增长率 | 评价 |
|--------|------|
| > 30% | 高速增长 |
| 15-30% | 稳健增长 |
| 0-15% | 缓慢增长 |
| < 0 | 衰退 |

### 分析要点
1. 看连续3-5年增长趋势
2. 与行业对比
3. 分析增长质量
4. 关注增长是否可持续

### 警惕信号
- 营收增长但利润下降
- 利润增长但现金流恶化
- 应收账款大幅增加
      `,
    },
    {
      title: '现金流分析',
      formula: '经营现金流、投资现金流、筹资现金流',
      content: `
### 三大现金流
| 类型 | 含义 | 健康状态 |
|------|------|----------|
| 经营现金流 | 主业赚的钱 | 持续为正 |
| 投资现金流 | 投资/买设备 | 扩张期为负 |
| 筹资现金流 | 借钱/还钱 | 根据阶段判断 |

### 现金流组合
1. **+++**：成长期，融资扩张
2. **+--**：成熟期，健康稳定
3. **-+-**：快速扩张，需关注资金
4. **--+**：困难期，融资续命
5. **---**：危险期，资金枯竭
6. **-++**：初创期，烧钱扩张

### 重要指标
- **自由现金流** = 经营现金流 - 资本支出
- 持续为正 = 公司能自己造血
- 为负 = 需要外部融资

### 分析要点
- 经营现金流 > 净利润 → 利润质量高
- 经营现金流连续为负 → 危险
- 自由现金流持续为正 → 优质公司
      `,
    },
    {
      title: '负债率分析',
      formula: '资产负债率 = 总负债 / 总资产 × 100%',
      content: `
### 含义
公司资产中借来的钱占多少。

### 参考标准
| 负债率 | 风险等级 |
|--------|----------|
| < 40% | 低风险 |
| 40-60% | 适中 |
| 60-70% | 偏高 |
| > 70% | 高风险 |

### 行业差异
| 行业 | 合理负债率 |
|------|------------|
| 银行 | 90%+ |
| 地产 | 70-80% |
| 制造业 | 40-60% |
| 科技 | 20-40% |

### 分析要点
1. 有息负债 vs 无息负债
2. 短期负债 vs 长期负债
3. 流动比率（> 2为安全）
4. 速动比率（> 1为安全）

### 警惕信号
- 负债率持续上升
- 短期负债占比高
- 利息支出大幅增加
- 货币资金远低于短期负债
      `,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">🏢 基本面分析框架</h3>
        <p className="text-sm text-blue-700">通过财务数据判断公司内在价值，找出被低估的优质公司</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {metrics.map(metric => (
          <details key={metric.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
              <div>{metric.title}</div>
              <div className="text-xs text-gray-500 mt-1">{metric.formula}</div>
            </summary>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{metric.content}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// 投资策略
function InvestingStrategy() {
  const strategies = [
    {
      name: '指数基金定投',
      level: '入门级',
      time: '3-5年',
      return: '年化8-15%',
      steps: [
        '开设证券账户',
        '选择宽基指数（沪深300 + 纳斯达克100）',
        '每月固定日期投入固定金额',
        '设置自动定投',
        '持有不动，直到目标收益率',
        '达到目标后分批止盈',
      ],
      tips: ['不用择时', '不用看盘', '坚持最重要', '用闲钱投资'],
    },
    {
      name: '网格交易',
      level: '进阶级',
      time: '持续',
      return: '波动收益',
      steps: [
        '选择波动较大的ETF',
        '设置网格区间（如±20%）',
        '设置网格数量（如10格）',
        '每跌一格买入一份',
        '每涨一格卖出一份',
        '反复操作赚取波动',
      ],
      tips: ['适合震荡市', '单边行情会失效', '需要盯盘', '控制仓位'],
    },
    {
      name: '价值投资',
      level: '高级',
      time: '长期',
      return: '年化15-25%',
      steps: [
        '学习财务分析',
        '筛选优质公司',
        '计算内在价值',
        '等待安全边际买入',
        '长期持有',
        '公司基本面恶化时卖出',
      ],
      tips: ['需要大量学习', '耐心等待机会', '逆人性操作', '深入研究公司'],
    },
    {
      name: '趋势交易',
      level: '高级',
      time: '短线',
      return: '不确定',
      steps: [
        '学习技术分析',
        '识别趋势方向',
        '等待确认信号',
        '严格止损止盈',
        '顺势加仓',
        '趋势结束离场',
      ],
      tips: ['风险较高', '需要严格纪律', '小仓位练习', '心态很重要'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">🎯 新手推荐：指数基金定投</h3>
        <p className="text-sm text-yellow-700">最简单、最有效、最省心的策略，巴菲特力荐！</p>
      </div>

      {strategies.map(s => (
        <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-gray-900">{s.name}</h4>
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">{s.level}</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{s.time}</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{s.return}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">📋 操作步骤</div>
              <ol className="text-sm text-gray-600 space-y-1">
                {s.steps.map((step, idx) => (
                  <li key={step}>{idx + 1}. {step}</li>
                ))}
              </ol>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">💡 注意事项</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {s.tips.map(tip => <li key={tip}>• {tip}</li>)}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 风险管理
function RiskManagement() {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-red-800 mb-4">⚠️ 投资的三条铁律</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">第一条：不要亏钱</div>
            <p className="text-sm text-gray-600 mt-2">本金亏损50%，需要涨100%才能回本</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">第二条：不要亏钱</div>
            <p className="text-sm text-gray-600 mt-2">保住本金是第一要务，比赚钱更重要</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">第三条：记住前两条</div>
            <p className="text-sm text-gray-600 mt-2">时刻牢记风险，永远不要All-in</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🛡️ 风险管理四原则</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-medium text-blue-800">1. 分散投资</div>
              <p className="text-sm text-blue-700 mt-2">
                不要把鸡蛋放一个篮子里。配置多种资产：股票基金40% + 债券基金40% + 现金20%
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-medium text-green-800">2. 仓位控制</div>
              <p className="text-sm text-green-700 mt-2">
                单只基金不超过总仓位的20%，单个行业不超过40%
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="font-medium text-yellow-800">3. 定期再平衡</div>
              <p className="text-sm text-yellow-700 mt-2">
                每年调整一次仓位，涨多了的卖出，跌多了的买入，保持目标比例
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="font-medium text-purple-800">4. 止盈止损</div>
              <p className="text-sm text-purple-700 mt-2">
                定投不止损但要止盈。收益率达到20%-30%可考虑分批止盈
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🧘 投资心态</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '🌊', title: '接受波动', desc: '短期波动是正常的，学会与波动共处' },
            { icon: '⏰', title: '长期持有', desc: '不要每天看账户，坚持3-5年' },
            { icon: '💰', title: '用闲钱', desc: '只用3-5年不用的钱投资，不要借钱' },
            { icon: '📚', title: '持续学习', desc: '每天学一点，长期进步' },
            { icon: '😌', title: '心态平和', desc: '涨跌都淡定，不要追涨杀跌' },
            { icon: '🎯', title: '目标明确', desc: '知道为什么买，什么时候卖' },
          ].map(item => (
            <div key={item.title} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 实操指南
function PracticeGuide() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 新手实操七步走</h3>
        <div className="space-y-4">
          {[
            { step: '第一步', title: '开立证券账户', desc: '华泰证券、中信证券、招商证券任选一家，线上开户即可', time: '10分钟' },
            { step: '第二步', title: '完成风险测评', desc: '如实填写，系统会推荐适合的产品', time: '5分钟' },
            { step: '第三步', title: '绑定银行卡', desc: '用于出入金', time: '5分钟' },
            { step: '第四步', title: '选择指数基金', desc: '推荐：沪深300ETF(510300) + 纳斯达克ETF(513100)', time: '10分钟' },
            { step: '第五步', title: '设置定投计划', desc: '每月发薪日自动扣款，金额为收入的10-20%', time: '5分钟' },
            { step: '第六步', title: '设置止盈提醒', desc: '收益率达到20%提醒自己考虑止盈', time: '2分钟' },
            { step: '第七步', title: '定期复盘', desc: '每季度检查一次投资组合', time: '每季度' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white rounded-lg p-4">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 推荐工具</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">基金平台</h4>
            {[
              { name: '天天基金', url: 'https://fund.eastmoney.com/', desc: '最全基金数据' },
              { name: '支付宝基金', url: 'https://render.alipay.com/p/c/k2cx02b3', desc: '买基金最方便' },
              { name: '蛋卷基金', url: 'https://danjuanfunds.com/', desc: '指数基金定投首选' },
            ].map(t => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                 className="block bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </a>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">行情软件</h4>
            {[
              { name: '东方财富', url: 'https://www.eastmoney.com/', desc: '最全股票行情' },
              { name: '雪球', url: 'https://xueqiu.com/', desc: '投资社区' },
              { name: '同花顺', url: 'https://www.10jqka.com.cn/', desc: '专业交易软件' },
            ].map(t => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                 className="block bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                <div className="font-medium text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 推荐书单</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: '《小狗钱钱》', author: '博多·舍费尔', level: '启蒙', color: 'bg-green-100 text-green-700' },
            { name: '《富爸爸穷爸爸》', author: '罗伯特·清崎', level: '启蒙', color: 'bg-green-100 text-green-700' },
            { name: '《指数基金投资指南》', author: '银行螺丝钉', level: '入门', color: 'bg-blue-100 text-blue-700' },
            { name: '《漫步华尔街》', author: '伯顿·马尔基尔', level: '入门', color: 'bg-blue-100 text-blue-700' },
            { name: '《聪明的投资者》', author: '本杰明·格雷厄姆', level: '进阶', color: 'bg-purple-100 text-purple-700' },
            { name: '《巴菲特致股东的信》', author: '沃伦·巴菲特', level: '进阶', color: 'bg-purple-100 text-purple-700' },
          ].map(book => (
            <div key={book.name} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div>
                <div className="font-medium text-gray-900">{book.name}</div>
                <div className="text-xs text-gray-500">{book.author}</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${book.color}`}>{book.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== 跨境电商详解 ====================
function EcommerceSection() {
  const [activePlatform, setActivePlatform] = useState<string>('amazon');

  const platforms = {
    amazon: {
      name: 'Amazon亚马逊',
      logo: '📦',
      market: '北美/欧洲/日本',
      difficulty: '中高',
      capital: '3-10万',
      basics: `
### Amazon基础知识

#### 1. 卖家账户类型
- **个人卖家**：无月租，每件商品$0.99佣金
- **专业卖家**：$39.99/月，无单件佣金（推荐）

#### 2. FBA vs FBM
| 类型 | FBA（亚马逊配送） | FBM（卖家自发货） |
|------|------------------|------------------|
| 仓储 | 亚马逊仓库 | 自己仓库 |
| 配送 | 亚马逊负责 | 自己负责 |
| 时效 | 1-3天 | 7-30天 |
| 流量 | 有流量扶持 | 无流量扶持 |
| 费用 | 仓储费+配送费 | 较低 |

#### 3. 核心费用
- 销售佣金：8%-15%（按类目）
- FBA配送费：$2.5-$5/件
- 月租：$39.99/月
- 仓储费：$0.69/立方英尺/月

#### 4. 选品核心指标
- 月销量：300-1000件
- 价格：$20-$50
- 评分：4.0以下（有改进空间）
- Review数：50-200
      `,
      steps: [
        '准备营业执照（个体户或公司）',
        '注册卖家账户（sell.amazon.com）',
        '完成KYC审核（身份验证）',
        '添加收款账户（Payoneer/PingPong）',
        '使用工具进行选品调研',
        '1688找供应商，获取报价',
        '创建Listing，准备图片',
        '发货到FBA仓库',
        '开广告引流',
        '优化Review和排名',
      ],
    },
    temu: {
      name: 'Temu',
      logo: '🛍️',
      market: '北美/欧洲',
      difficulty: '低',
      capital: '5000-2万',
      basics: `
### Temu基础知识

#### 1. 平台特点
- 拼多多海外版，主打低价
- 全托管模式，平台负责运营
- 一件代发，无需囤货
- 门槛低，适合新手

#### 2. 合作模式
- **JIT模式**：接单后48小时内发货
- **VMI模式**：备货到Temu仓库
- **半托管**：商家自己发货（新）

#### 3. 核心费用
- 入驻费：免费
- 保证金：5000-10000元
- 平台扣点：10%-30%
- 无广告费（平台负责）

#### 4. 选品特点
- 价格低：$1-$20
- 适合：日用品、小百货、配饰
- 注意：利润薄，靠走量
      `,
      steps: [
        '注册Temu卖家账户',
        '完成实名认证',
        '缴纳保证金',
        '上传产品信息',
        '平台审核通过',
        '发货到国内集运仓',
        '等待平台定价上架',
        '接单后及时发货',
        '关注销量数据',
        '优化产品信息',
      ],
    },
    tiktok: {
      name: 'TikTok Shop',
      logo: '🎵',
      market: '东南亚/北美/英国',
      difficulty: '中',
      capital: '1-5万',
      basics: `
### TikTok Shop基础知识

#### 1. 平台特点
- 内容驱动，短视频/直播带货
- 年轻用户群体
- 流量红利期
- 需要内容能力

#### 2. 店铺类型
- **本土店**：当地公司注册，流量好
- **跨境店**：中国公司注册，需资质

#### 3. 核心费用
- 入驻费：免费
- 佣金：5%-8%
- 达人佣金：10%-20%
- 广告费：自主投入

#### 4. 运营方式
- 短视频带货
- 直播带货
- 达人合作
- 自有店铺运营
      `,
      steps: [
        '准备营业执照和身份证',
        '注册TikTok Shop卖家账户',
        '绑定TikTok账号',
        '上传产品',
        '制作短视频内容',
        '找达人合作推广',
        '开直播带货',
        '投广告引流',
        '订单履约发货',
        '分析数据优化',
      ],
    },
  };

  const selectionGuide = `
### 选品方法论

#### 1. 选品原则
- ✅ 需求大：搜索量高，有稳定需求
- ✅ 竞争小：避开红海，找细分市场
- ✅ 利润足：毛利至少30%，最好50%+
- ✅ 易运输：轻小、不易碎、无电池
- ✅ 合规性：无侵权风险，无需特殊认证

#### 2. 选品工具
| 工具 | 用途 | 价格 |
|------|------|------|
| Jungle Scout | 销量分析 | $49/月 |
| Helium10 | 关键词分析 | $99/月 |
| Google Trends | 趋势判断 | 免费 |
| 1688 | 找供应商 | 免费 |

#### 3. 选品方法
1. **Best Sellers扫描**
   - 查看类目Top100
   - 找评分4.0以下的产品
   - 分析差评，做改进版

2. **New Releases跟踪**
   - 关注新品榜
   - 发现上升期的爆款

3. **关键词挖掘**
   - 使用工具找长尾词
   - 发现隐藏需求

4. **社交趋势**
   - 关注TikTok/Instagram热门
   - 发现新兴产品趋势

#### 4. 避坑指南
- ❌ 带电产品（认证复杂）
- ❌ 大件家具（运费高）
- ❌ 服装（退货率高）
- ❌ 品牌产品（侵权风险）
- ❌ 季节性产品（库存风险）
- ❌ 易碎品（破损率高）
  `;

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🛒 跨境电商从0到1</h2>
        <p className="text-gray-600 mt-2">详解各平台玩法，系统学习路径</p>
      </header>

      {/* 平台切换 */}
      <div className="flex gap-3 mb-6">
        {Object.entries(platforms).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setActivePlatform(key)}
            className={`px-4 py-3 rounded-xl flex items-center gap-2 transition-all ${
              activePlatform === key
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300'
            }`}
          >
            <span className="text-xl">{p.logo}</span>
            <span className="font-medium">{p.name}</span>
          </button>
        ))}
      </div>

      {/* 平台详情 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{platforms[activePlatform as keyof typeof platforms].logo}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {platforms[activePlatform as keyof typeof platforms].name}
              </h3>
              <p className="text-sm text-gray-500">
                市场: {platforms[activePlatform as keyof typeof platforms].market} |
                难度: {platforms[activePlatform as keyof typeof platforms].difficulty} |
                资金: {platforms[activePlatform as keyof typeof platforms].capital}
              </p>
            </div>
          </div>
        </div>

        <details className="bg-orange-50 rounded-lg mb-4">
          <summary className="px-4 py-3 cursor-pointer font-medium text-orange-800">
            📖 平台基础知识
          </summary>
          <div className="px-4 pb-4 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {platforms[activePlatform as keyof typeof platforms].basics}
            </div>
          </div>
        </details>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">📋 入驻步骤</h4>
          <div className="grid md:grid-cols-2 gap-2">
            {platforms[activePlatform as keyof typeof platforms].steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 选品指南 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 选品方法论</h3>
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">{selectionGuide}</div>
        </div>
      </div>

      {/* 物流模式 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚚 物流模式对比</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { mode: 'FBA', desc: '亚马逊仓储配送', pros: '流量扶持、时效快', cons: '仓储费、需囤货' },
            { mode: 'FBM', desc: '卖家自发货', pros: '灵活、无仓储费', cons: '物流慢、无流量' },
            { mode: '海外仓', desc: '第三方海外仓库', pros: '时效好、成本适中', cons: '需提前备货' },
          ].map(item => (
            <div key={item.mode} className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold text-gray-900">{item.mode}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
              <div className="text-xs text-green-600 mt-2">{item.pros}</div>
              <div className="text-xs text-red-600">{item.cons}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== 知识付费详解 ====================
function KnowledgeSection() {
  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">📚 知识付费从0到变现</h2>
        <p className="text-gray-600 mt-2">把你的专业能力变成被动收入</p>
      </header>

      {/* 变现模式详解 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 六种变现模式详解</h3>
        <div className="grid gap-4">
          {[
            {
              type: '付费课程',
              icon: '🎓',
              desc: '录制系统课程，一次制作多次售卖',
              platforms: '小鹅通、得到、Udemy',
              revenue: '中高（9.9-999元/人）',
              howTo: `
1. 确定主题：选择你有专业积累的领域
2. 设计大纲：15-30节课，每节5-15分钟
3. 录制课程：推荐使用OBS + 剪辑
4. 平台上架：自建或入驻平台
5. 推广引流：自媒体 + 社群 + 广告
6. 持续迭代：根据反馈优化内容
              `,
            },
            {
              type: '付费社群',
              icon: '👥',
              desc: '建立专属社群，提供持续价值',
              platforms: '知识星球、微信群',
              revenue: '中（199-999元/年）',
              howTo: `
1. 确定主题：AI产品经理、副业交流等
2. 设计权益：每日资讯、答疑、资源
3. 定价策略：199-999元/年
4. 内容规划：每周固定内容输出
5. 社群运营：活跃度维护
6. 续费转化：老用户优惠续费
              `,
            },
            {
              type: '付费咨询',
              icon: '💬',
              desc: '一对一咨询服务，按小时收费',
              platforms: '在行、知乎咨询',
              revenue: '中（199-999元/小时）',
              howTo: `
1. 确定咨询方向：产品、职业规划等
2. 梳理咨询框架：标准化流程
3. 平台入驻：在行/知乎咨询
4. 积累评价：早期可低价获客
5. 提价策略：好评多后逐步提价
6. 转化其他产品：咨询转课程
              `,
            },
            {
              type: '付费文章',
              icon: '📝',
              desc: '深度内容付费阅读',
              platforms: '公众号付费、小报童',
              revenue: '低中（1-99元/篇）',
              howTo: `
1. 选择细分领域：行业洞察、技术深度
2. 确定付费模式：单篇或专栏订阅
3. 内容规划：每周1-2篇深度内容
4. 免费引流：部分内容免费试读
5. 建立专栏：小报童/公众号
6. 持续输出：建立付费习惯
              `,
            },
            {
              type: '电子书/资料包',
              icon: '📚',
              desc: '整理资料/模板，一次打包售卖',
              platforms: '淘宝、闲鱼、知识星球',
              revenue: '低（9.9-99元）',
              howTo: `
1. 整理你的资料：模板、清单、工具
2. 设计产品形态：PDF、Notion模板
3. 制作详情页：突出价值点
4. 定价策略：9.9-99元走量
5. 推广渠道：自媒体引流
6. 持续更新：增加复购价值
              `,
            },
            {
              type: '训练营',
              icon: '📺',
              desc: '直播授课或短期集中培训',
              platforms: '小鹅通、抖音、视频号',
              revenue: '高（1999-9999元/期）',
              howTo: `
1. 设计课程大纲：7-30天训练营
2. 规划直播时间：每周固定时间
3. 设计作业体系：作业+批改
4. 社群运营：学习氛围
5. 成果展示：毕业作品展示
6. 续报转化：高阶课程推荐
              `,
            },
          ].map(item => (
            <details key={item.type} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{item.type}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">收入: {item.revenue}</div>
                  <div className="text-xs text-gray-400">平台: {item.platforms}</div>
                </div>
              </summary>
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                <div className="font-medium text-gray-700 mb-2">📋 操作步骤</div>
                <div className="whitespace-pre-wrap text-sm text-gray-600">{item.howTo}</div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 冷启动策略 */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 冷启动策略（0-3个月）</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-purple-800 mb-2">第1月: 内容积累</div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 选定细分领域</li>
              <li>• 发布10篇以上干货</li>
              <li>• 加入相关社群</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-purple-800 mb-2">第2月: 流量增长</div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 研究爆款内容</li>
              <li>• 尝试短视频形式</li>
              <li>• 建立私域流量池</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-purple-800 mb-2">第3月: 首次变现</div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 推出低价产品</li>
              <li>• 尝试付费咨询</li>
              <li>• 收集用户反馈</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 内容创作 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✍️ 内容创作指南</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">📱 小红书运营</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 标题要吸引眼球（疑问、数字、对比）</li>
              <li>• 封面设计统一风格</li>
              <li>• 每天发布1-2条</li>
              <li>• 善用热门话题标签</li>
              <li>• 评论互动增加热度</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">📺 视频号运营</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 前3秒抓住注意力</li>
              <li>• 视频时长1-3分钟最佳</li>
              <li>• 固定更新时间</li>
              <li>• 引导点赞关注</li>
              <li>• 与公众号联动</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 平台推荐 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 知识付费平台推荐</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: '小鹅通', desc: '最全功能，适合课程', url: 'https://www.xiaoe-tech.com/' },
            { name: '知识星球', desc: '付费社群首选', url: 'https://www.zsxq.com/' },
            { name: '小报童', desc: '付费专栏工具', url: 'https://xiaobot.net/' },
            { name: '在行', desc: '付费咨询平台', url: 'https://www.zaih.com/' },
            { name: '得到', desc: '高质量课程平台', url: 'https://www.dedao.cn/' },
            { name: 'Udemy', desc: '国际课程平台', url: 'https://www.udemy.com/' },
          ].map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
               className="block bg-gray-50 rounded-lg p-4 hover:bg-purple-50 transition-colors">
              <div className="font-medium text-gray-900">{p.name}</div>
              <div className="text-xs text-gray-500 mt-1">{p.desc}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==================== 每日推荐（AI生成） ====================
function DailyRecommendSection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [input, setInput] = useState('');

  const generateDaily = async () => {
    setLoading(true);
    setResult('正在分析市场数据，请稍候...');

    const today = new Date().toLocaleDateString('zh-CN');
    const prompt = `你是一位专业的投资顾问和副业导师。请根据当前市场环境，为用户生成今日分析和建议。

日期：${today}

用户背景：AI产品经理，想通过副业实现财富自由，目前是投资和跨境电商新手。

请提供以下内容：
1. 【市场概览】简述当前A股、美股大盘走势（2-3句话）
2. 【基金定投建议】今天适合定投吗？如果适合，推荐哪类指数基金？
3. 【股票关注】推荐1-2个值得关注的行业或板块，说明理由
4. 【跨境电商动态】简述跨境电商行业近期动态或机会点
5. 【知识付费灵感】给用户一个今日可以执行的内容创作方向
6. 【行动清单】列出今日可执行的3件小事

注意：这是学习用途，不构成投资建议。请保持客观、有理有据。`;

    const response = await callWanqingAPI(
      '你是一位专业的投资顾问和副业导师，擅长给出实用、可执行的建议。',
      prompt
    );

    setResult(response);
    setLoading(false);
  };

  useEffect(() => {
    // 自动生成今日推荐
    generateDaily();
  }, []);

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🤖 AI每日智能推荐</h2>
        <p className="text-gray-600 mt-2">基于万晴大模型，为你生成个性化建议</p>
      </header>

      {/* 自定义输入 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💬 输入你的问题或需求（可选）
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：我有5万元想投资基金，应该怎么配置？跨境电商选品有什么建议？"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <button
          onClick={generateDaily}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading ? 'AI分析中...' : '🔄 重新生成'}
        </button>
      </div>

      {/* AI结果 */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
            🤖
          </div>
          <div>
            <div className="font-semibold text-gray-900">AI每日助手</div>
            <div className="text-xs text-gray-500">{new Date().toLocaleString('zh-CN')}</div>
          </div>
        </div>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-white/50 p-4 rounded-lg">
            {result || '加载中...'}
          </pre>
        </div>
      </div>

      {/* 免责声明 */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>重要提示</strong>：以上内容由AI生成，仅供参考学习，不构成任何投资建议。
          投资有风险，入市需谨慎。请根据自身情况独立判断决策。
        </p>
      </div>
    </div>
  );
}

// ==================== 学习路径 ====================
function RoadmapSection() {
  const timeline = [
    {
      month: '1-3月',
      phase: '基础建设',
      focus: '知识付费 + 基金定投',
      color: 'from-blue-500 to-cyan-500',
      tasks: [
        '阅读《小狗钱钱》《指数基金投资指南》',
        '开设证券账户，设置每月定投500-1000元',
        '确定知识付费细分方向',
        '发布20篇以上免费内容',
        '建立私域流量池（微信群）',
      ],
      milestone: '✅ 完成第一笔定投，积累500粉丝',
    },
    {
      month: '4-6月',
      phase: '验证变现',
      focus: '首次变现 + 选品调研',
      color: 'from-purple-500 to-pink-500',
      tasks: [
        '推出首个低价产品（资料包/小课）',
        '完成首次变现（目标：1000元）',
        '研究跨境电商选品方法论',
        '确定目标市场和平台',
        '继续定投，不要中断',
      ],
      milestone: '✅ 验证商业模式可行性',
    },
    {
      month: '7-12月',
      phase: '规模增长',
      focus: '课程升级 + 店铺启动',
      color: 'from-orange-500 to-red-500',
      tasks: [
        '开发中阶课程（299-599元）',
        '知识付费月收入稳定3000+',
        '启动跨境店铺，上架首批产品',
        '学习广告投放',
        '定投金额提高到2000元/月',
      ],
      milestone: '✅ 副业收入达到主业30%',
    },
    {
      month: '13-18月',
      phase: '多元布局',
      focus: '产品线扩展 + 投资升级',
      color: 'from-green-500 to-teal-500',
      tasks: [
        '开发高阶训练营',
        '跨境电商跑通盈利模型',
        '开始学习个股投资（小仓位）',
        '考虑AI工具产品化',
        '定投坚持，开始止盈',
      ],
      milestone: '✅ 副业收入超过主业',
    },
    {
      month: '18月+',
      phase: '财富自由',
      focus: '资产配置 + 被动收入',
      color: 'from-yellow-500 to-orange-500',
      tasks: [
        '多收入来源稳定',
        '投资组合产生分红',
        '考虑全职创业或财务自由',
        '资产配置多元化',
        '帮助他人实现财务自由',
      ],
      milestone: '✅ 实现财务自由',
    },
  ];

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🗺️ 从入门到精通的学习路径</h2>
        <p className="text-gray-600 mt-2">系统化的18个月副业发展计划</p>
      </header>

      {/* 时间线 */}
      <section className="relative">
        {timeline.map((phase, idx) => (
          <div key={phase.month} className="flex gap-6 mb-8">
            {/* 时间线 */}
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {idx + 1}
              </div>
              {idx < timeline.length - 1 && (
                <div className={`w-1 h-full bg-gradient-to-b ${phase.color} mt-2 rounded-full`} style={{ minHeight: '250px' }} />
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`px-3 py-1 bg-gradient-to-r ${phase.color} text-white rounded-full text-sm font-medium`}>
                    {phase.month}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2">{phase.phase}</h3>
                  <p className="text-sm text-gray-500">聚焦: {phase.focus}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">📋 关键任务</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {phase.tasks.map(task => <li key={task}>• {task}</li>)}
                  </ul>
                </div>
                <div className={`bg-gradient-to-br ${phase.color} bg-opacity-10 rounded-lg p-4`}>
                  <div className="text-sm font-medium text-gray-700 mb-2">🎯 里程碑</div>
                  <div className="text-sm text-gray-700">{phase.milestone}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 心态建议 */}
      <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 成功的关键心态</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: '🎯', title: '长期主义', desc: '不要追求快速致富，相信复利的力量，坚持3-5年' },
            { icon: '📚', title: '持续学习', desc: '每天进步一点点，18个月后你将完全不同' },
            { icon: '⚡', title: '执行优先', desc: '先行动，再完美，在过程中迭代，不要等准备好再开始' },
            { icon: '🧘', title: '心态平和', desc: '接受波动和失败，把它当学费，不要被短期涨跌影响心态' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SideHustleGuide;
