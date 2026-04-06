import { useState } from 'react';

type TabType = 'overview' | 'investing' | 'ecommerce' | 'knowledge' | 'roadmap';

const SIDEBAR_ITEMS = [
  { id: 'overview' as TabType, label: '副业总览', icon: '🎯' },
  { id: 'investing' as TabType, label: '股票基金', icon: '📈' },
  { id: 'ecommerce' as TabType, label: '跨境电商', icon: '🛒' },
  { id: 'knowledge' as TabType, label: '知识付费', icon: '📚' },
  { id: 'roadmap' as TabType, label: '学习路径', icon: '🗺️' },
];

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
        {activeTab === 'roadmap' && <RoadmapSection />}
      </main>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🎯 副业总览与推荐</h2>
        <p className="text-gray-600 mt-2">作为AI产品经理，你的优势与各副业的匹配度分析</p>
      </header>

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

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 三大核心副业对比</h3>
        <div className="grid gap-6">
          {[
            {
              title: '股票基金投资',
              icon: '📈',
              potential: '高',
              difficulty: '中高',
              capital: '1万起',
              pros: ['被动收入', '复利效应', '时间自由'],
              cons: ['风险较高', '需要学习', '波动焦虑'],
            },
            {
              title: '跨境电商',
              icon: '🛒',
              potential: '中高',
              difficulty: '中',
              capital: '3-5万起',
              pros: ['收入上限高', '可规模化', '时间自主'],
              cons: ['运营复杂', '竞争激烈', '需持续投入'],
            },
            {
              title: '知识付费',
              icon: '📚',
              potential: '中',
              difficulty: '中低',
              capital: '几乎零成本',
              pros: ['零库存', '可复利', '个人品牌'],
              cons: ['需积累影响力', '竞争激烈', '变现周期长'],
            },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{item.icon}</span>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{item.title}</h4>
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
    </div>
  );
}

function InvestingSection() {
  const [activeLesson, setActiveLesson] = useState('basics');

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">📈 股票基金从入门到精通</h2>
        <p className="text-gray-600 mt-2">系统学习，从小白到投资者</p>
      </header>

      <div className="flex gap-2 mb-6 bg-white rounded-xl p-4 border border-gray-200">
        {[
          { id: 'basics', label: '基础概念', icon: '📖' },
          { id: 'technical', label: 'K线技术', icon: '📊' },
          { id: 'strategy', label: '投资策略', icon: '🎯' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveLesson(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLesson === tab.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {activeLesson === 'basics' && (
        <div className="space-y-4">
          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group" open>
            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
              第1课: 什么是股票？
            </summary>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 prose prose-sm max-w-none">
              <p className="text-gray-700"><strong>定义：</strong>股票是公司所有权的凭证。买入股票 = 成为公司的部分所有者（股东）。</p>
              <p className="text-gray-700 mt-2"><strong>如何赚钱？</strong></p>
              <ul className="text-gray-600">
                <li>价差收益：10元买，15元卖，赚5元/股</li>
                <li>分红收益：公司盈利后分红给股东</li>
              </ul>
            </div>
          </details>

          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
              第2课: 什么是基金？
            </summary>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 prose prose-sm max-w-none">
              <p className="text-gray-700"><strong>定义：</strong>基金 = 一篮子股票/债券，由专业经理管理。买基金 = 雇人帮你投资。</p>
              <p className="text-gray-700 mt-2"><strong>基金类型：</strong></p>
              <ul className="text-gray-600">
                <li>货币基金：类似余额宝，保本（风险极低）</li>
                <li>指数基金：跟踪指数（推荐新手，费率低）</li>
                <li>股票基金：80%以上买股票（风险高）</li>
              </ul>
            </div>
          </details>

          <details className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900">
              第3课: 什么是定投？
            </summary>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 prose prose-sm max-w-none">
              <p className="text-gray-700"><strong>定义：</strong>定期定额投资 = 每月固定时间投入固定金额。</p>
              <p className="text-gray-700 mt-2"><strong>定投优势：</strong></p>
              <ul className="text-gray-600">
                <li>摊薄成本：跌时多买，涨时少买</li>
                <li>克服人性：不用择时，避免追涨杀跌</li>
                <li>积少成多：每月存钱，强制储蓄</li>
              </ul>
            </div>
          </details>
        </div>
      )}

      {activeLesson === 'technical' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 K线图详解</h3>
          <p className="text-gray-600 mb-4">K线（蜡烛图）记录价格变动，由开盘价、收盘价、最高价、最低价组成。</p>
          <p className="text-gray-700"><strong>K线类型：</strong></p>
          <ul className="text-gray-600 mt-2 space-y-1">
            <li>• 大阳线（红色）：收盘远高于开盘，强势上涨</li>
            <li>• 大阴线（绿色）：收盘远低于开盘，强势下跌</li>
            <li>• 十字星：开盘=收盘，多空平衡</li>
            <li>• 锤子线：下影线长，可能见底</li>
          </ul>
        </div>
      )}

      {activeLesson === 'strategy' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 新手推荐：指数基金定投</h3>
          <p className="text-gray-600 mb-4">巴菲特力荐的普通人投资方式。</p>
          <p className="text-gray-700"><strong>操作步骤：</strong></p>
          <ol className="text-gray-600 mt-2 space-y-1 list-decimal list-inside">
            <li>开立证券账户（华泰/中信/招商等）</li>
            <li>选择宽基指数（沪深300 + 纳斯达克100）</li>
            <li>每月发薪日定投收入的10-20%</li>
            <li>坚持3-5年，不要中断</li>
            <li>收益率达到20%时考虑分批止盈</li>
          </ol>
        </div>
      )}
    </div>
  );
}

function EcommerceSection() {
  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🛒 跨境电商从0到1</h2>
        <p className="text-gray-600 mt-2">详解各平台玩法</p>
      </header>

      <div className="grid gap-4">
        {[
          { name: 'Amazon', logo: '📦', market: '北美/欧洲/日本', difficulty: '中高', capital: '3-10万' },
          { name: 'Temu', logo: '🛍️', market: '北美/欧洲', difficulty: '低', capital: '5000-2万' },
          { name: 'TikTok Shop', logo: '🎵', market: '东南亚/北美', difficulty: '中', capital: '1-5万' },
        ].map(p => (
          <div key={p.name} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{p.logo}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.market}</div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div><span className="text-orange-600">难度:</span> {p.difficulty}</div>
                <div><span className="text-blue-600">资金:</span> {p.capital}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeSection() {
  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">📚 知识付费从0到变现</h2>
        <p className="text-gray-600 mt-2">把你的专业能力变成被动收入</p>
      </header>

      <div className="grid gap-4">
        {[
          { type: '付费课程', icon: '🎓', desc: '录制系统课程，一次制作多次售卖' },
          { type: '付费社群', icon: '👥', desc: '建立专属社群，提供持续价值' },
          { type: '付费咨询', icon: '💬', desc: '一对一咨询服务，按小时收费' },
        ].map(item => (
          <div key={item.type} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">{item.type}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">🗺️ 学习路径</h2>
        <p className="text-gray-600 mt-2">系统化的副业发展计划</p>
      </header>

      <div className="space-y-6">
        {[
          { month: '1-3月', phase: '基础建设', tasks: ['阅读《小狗钱钱》', '开设证券账户', '确定知识付费方向'] },
          { month: '4-6月', phase: '验证变现', tasks: ['推出首个低价产品', '研究跨境电商'] },
          { month: '7-12月', phase: '规模增长', tasks: ['开发中阶课程', '启动跨境店铺'] },
        ].map((phase, idx) => (
          <div key={phase.month} className="flex gap-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {idx + 1}
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{phase.month}</span>
                <span className="font-semibold text-gray-900">{phase.phase}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                {phase.tasks.map(t => <li key={t}>• {t}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideHustleGuide;
