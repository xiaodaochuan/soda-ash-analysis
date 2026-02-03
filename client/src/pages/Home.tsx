import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { TradingAdviceCard } from "@/components/TradingAdviceCard";
import { DynamicTradingAdviceCard } from "@/components/DynamicTradingAdviceCard";
import { RiskManagementTool } from "@/components/RiskManagementTool";
import { generateTradingAdvices } from "@/lib/tradingAdvice";
import { generateDynamicAdvices, MarketData } from "@/lib/dynamicAdviceEngine";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 产量数据
const productionData = [
  { week: "第1周", total: 78.31, light: 36.20, heavy: 42.11 },
  { week: "第2周", total: 77.50, light: 35.95, heavy: 41.55 },
  { week: "第3周", total: 76.80, light: 35.70, heavy: 41.10 },
  { week: "第4周", total: 78.31, light: 36.20, heavy: 42.11 },
];

// 库存数据
const inventoryData = [
  { week: "1月22日", inventory: 150.12 },
  { week: "1月24日", inventory: 151.50 },
  { week: "1月27日", inventory: 152.12 },
  { week: "1月29日", inventory: 154.42 },
];

// 库存结构
const inventoryStructure = [
  { name: "轻质碱", value: 82.81, fill: "oklch(0.5 0.2 200)" },
  { name: "重质碱", value: 71.61, fill: "oklch(0.6 0.15 40)" },
];

// 价格走势
const priceData = [
  { date: "1月20日", price: 1220 },
  { date: "1月22日", price: 1215 },
  { date: "1月24日", price: 1210 },
  { date: "1月27日", price: 1205 },
  { date: "1月29日", price: 1204 },
  { date: "1月30日", price: 1204 },
  { date: "2月2日", price: 1207 },
];

export default function Home() {
  // 实时市场数据
  const [currentPrice, setCurrentPrice] = useState(1207);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // 市场数据状态
  const [marketData, setMarketData] = useState<MarketData>({
    currentPrice: 1207,
    previousPrice: 1207,
    weeklyProduction: 78.31,
    totalInventory: 154.42,
    lightInventory: 82.81,
    heavyInventory: 71.61,
    glassOpenRate: 75.64,
    exportVolume: 0.4,
  });

  const [previousMarketData, setPreviousMarketData] = useState<MarketData | undefined>();

  // 模拟每分钟更新数据
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      // 模拟市场数据变化
      const randomPriceChange = (Math.random() - 0.5) * 20;
      const newPrice = Math.max(1190, Math.min(1220, currentPrice + randomPriceChange));
      
      const randomInventoryChange = (Math.random() - 0.5) * 2;
      const newInventory = Math.max(145, Math.min(165, marketData.totalInventory + randomInventoryChange));
      
      const randomOpenRateChange = (Math.random() - 0.5) * 3;
      const newOpenRate = Math.max(65, Math.min(85, marketData.glassOpenRate + randomOpenRateChange));

      setPreviousMarketData(marketData);
      
      setCurrentPrice(newPrice);
      setMarketData(prev => ({
        ...prev,
        currentPrice: newPrice,
        previousPrice: currentPrice,
        totalInventory: newInventory,
        lightInventory: newInventory * 0.537,
        heavyInventory: newInventory * 0.463,
        glassOpenRate: newOpenRate,
      }));
      
      setLastUpdateTime(new Date());
      setIsUpdating(false);
    }, 60000); // 每 60 秒更新一次

    return () => clearInterval(interval);
  }, [currentPrice, marketData]);

  // 生成动态交易建议
  const dynamicAdvices = generateDynamicAdvices(marketData, previousMarketData);

  // 生成交易建议
  const tradingAdvices = generateTradingAdvices({
    currentPrice: 1207,
    weeklyProduction: 78.31,
    totalInventory: 154.42,
    lightInventory: 82.81,
    heavyInventory: 71.61,
    glassProductionRate: 75.64,
    photovoltaicCapacity: 60.87,
    priceChange: -0.25,
    inventoryChange: 1.52,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">纯碱期货分析看板</h1>
              <p className="text-sm text-muted-foreground mt-1">
                实时行情 · 基本面分析 · 激进交易建议
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">数据更新时间</p>
              <p className="text-sm font-semibold text-foreground">2026年2月3日</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Key Metrics Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">关键指标</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="主力合约价格"
              value="1207"
              unit="元/吨"
              description="SA2605 合约"
              change={{ value: 0.25, isPositive: false }}
            />
            <StatCard
              title="周产量"
              value="78.31"
              unit="万吨"
              description="环比增加 1.14 万吨"
              change={{ value: 1.47, isPositive: true }}
            />
            <StatCard
              title="厂家总库存"
              value="154.42"
              unit="万吨"
              description="较上周增加 2.30 万吨"
              change={{ value: 1.52, isPositive: false }}
            />
            <StatCard
              title="同比库存"
              value="-16.31"
              unit="%"
              description="较去年同期下降"
              change={{ value: 16.31, isPositive: true }}
            />
          </div>
        </section>

        {/* Dynamic Trading Advice Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">动态交易建议</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>最后更新：{lastUpdateTime.toLocaleTimeString("zh-CN")}</span>
              {isUpdating && <span className="animate-pulse">更新中...</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DynamicTradingAdviceCard
              timeframe="short"
              advice={dynamicAdvices.shortTerm}
              entryPrice={marketData.currentPrice}
              stopLoss={marketData.currentPrice + 20}
              takeProfit={marketData.currentPrice - 20}
            />
            <DynamicTradingAdviceCard
              timeframe="mid"
              advice={dynamicAdvices.midTerm}
              entryPrice={marketData.currentPrice}
              stopLoss={marketData.currentPrice + 35}
              takeProfit={marketData.currentPrice - 40}
            />
            <DynamicTradingAdviceCard
              timeframe="long"
              advice={dynamicAdvices.longTerm}
              entryPrice={marketData.currentPrice}
              stopLoss={marketData.currentPrice + 55}
              takeProfit={marketData.currentPrice - 60}
            />
          </div>
        </section>

        {/* Market Analysis Charts */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">市场分析</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Price Trend */}
            <ChartCard
              title="期货价格走势"
              description="SA2605 主力合约近期价格变化"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.02 280)" />
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.7 0.02 280)"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="oklch(0.7 0.02 280)"
                    style={{ fontSize: "12px" }}
                    domain={[1195, 1225]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0.015 280)",
                      border: "1px solid oklch(0.18 0.02 280)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.95 0.01 280)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="oklch(0.5 0.2 200)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.5 0.2 200)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Inventory Structure */}
            <ChartCard
              title="库存结构分析"
              description="轻质碱与重质碱库存占比"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inventoryStructure}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}万吨`}
                    outerRadius={80}
                    fill="oklch(0.5 0.2 200)"
                    dataKey="value"
                  >
                    {inventoryStructure.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0.015 280)",
                      border: "1px solid oklch(0.18 0.02 280)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.95 0.01 280)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Production Trend */}
          <ChartCard
            title="产量趋势分析"
            description="轻质碱与重质碱周产量变化"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.02 280)" />
                <XAxis
                  dataKey="week"
                  stroke="oklch(0.7 0.02 280)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="oklch(0.7 0.02 280)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.12 0.015 280)",
                    border: "1px solid oklch(0.18 0.02 280)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "oklch(0.95 0.01 280)" }}
                />
                <Legend wrapperStyle={{ color: "oklch(0.7 0.02 280)" }} />
                <Bar dataKey="light" fill="oklch(0.5 0.2 200)" name="轻质碱" />
                <Bar dataKey="heavy" fill="oklch(0.6 0.15 40)" name="重质碱" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Inventory Trend */}
          <ChartCard
            title="库存变化趋势"
            description="近期厂家总库存水平"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.02 280)" />
                <XAxis
                  dataKey="week"
                  stroke="oklch(0.7 0.02 280)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="oklch(0.7 0.02 280)"
                  style={{ fontSize: "12px" }}
                  domain={[148, 156]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.12 0.015 280)",
                    border: "1px solid oklch(0.18 0.02 280)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "oklch(0.95 0.01 280)" }}
                />
                <Line
                  type="monotone"
                  dataKey="inventory"
                  stroke="oklch(0.5 0.2 200)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.5 0.2 200)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* Risk Management Tool */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">风险管理工具</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>最后更新：{lastUpdateTime.toLocaleTimeString("zh-CN")}</span>
              {isUpdating && <span className="animate-pulse">更新中...</span>}
            </div>
          </div>
          <RiskManagementTool />
        </section>

        {/* Analysis Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">市场观点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="data-card p-6">
              <h3 className="text-lg font-semibold text-accent mb-4">供应端</h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>国内纯碱周产量 78.31 万吨，环比增加 1.47%</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>2026 年上半年无大规模新产能投放</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>现有产能利用率维持高位</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>行业供应过剩格局未改变</span>
                </li>
              </ul>
            </div>

            <div className="data-card p-6">
              <h3 className="text-lg font-semibold text-accent mb-4">需求端</h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>浮法玻璃步入消费淡季</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>下游以刚需采购为主，支撑有限</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>光伏玻璃需求表现相对韧性</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>节前备货节奏是近期关注重点</span>
                </li>
              </ul>
            </div>

            <div className="data-card p-6">
              <h3 className="text-lg font-semibold text-accent mb-4">库存情况</h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>厂家总库存 154.42 万吨，处于高位</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>轻质碱库存 82.81 万吨</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>重质碱库存 71.61 万吨</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>同比下降 16.31%，但绝对值仍高</span>
                </li>
              </ul>
            </div>

            <div className="data-card p-6">
              <h3 className="text-lg font-semibold text-accent mb-4">后市展望</h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>短期预计延续偏弱震荡运行</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>关注宏观及房地产政策变化</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>监测纯碱出口数据</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span>
                  <span>跟踪浮法玻璃产线冷修情况</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-12 text-center text-sm text-muted-foreground">
          <p>数据来源：华泰期货研究院、隆众资讯</p>
          <p className="mt-2">本分析仅供参考，不构成投资建议</p>
          <p className="mt-2 text-xs">更新周期：每分钟一次 | 最后更新：{lastUpdateTime.toLocaleString("zh-CN")}</p>
        </footer>
      </main>
    </div>
  );
}
