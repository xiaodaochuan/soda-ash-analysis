import { useState } from "react";
import { AlertCircle, TrendingDown, TrendingUp, DollarSign, Target } from "lucide-react";
import { calculateRiskMetrics, calculateAccountStatus, generateAlerts, AccountInfo, TradeSetup, RiskMetrics } from "@/lib/riskManagement";

export function RiskManagementTool() {
  // 账户信息
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    totalCapital: 100000, // 默认 10 万元
    riskPercentage: 3, // 每笔交易风险 3%
    warningLevel: 10, // 亏损 10% 时预警
  });

  // 交易设置
  const [tradeSetup, setTradeSetup] = useState<TradeSetup>({
    entryPrice: 1207,
    stopLoss: 1225,
    takeProfit1: 1200,
    takeProfit2: 1190,
    takeProfit3: 1180,
    direction: "short",
  });

  // 当前价格（用于提醒）
  const [currentPrice, setCurrentPrice] = useState(1207);

  // 计算风险指标
  const riskMetrics = calculateRiskMetrics(accountInfo, tradeSetup);

  // 生成提醒
  const alerts = generateAlerts(currentPrice, tradeSetup, 10);

  return (
    <div className="space-y-6">
      {/* 账户信息输入 */}
      <div className="data-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">账户设置</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              账户总资金（元）
            </label>
            <input
              type="number"
              value={accountInfo.totalCapital || ""}
              onChange={(e) => {
                const value = e.target.value;
                setAccountInfo({ ...accountInfo, totalCapital: value === "" ? 0 : parseFloat(value) })
              }}
              placeholder="100000"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              单笔风险比例（%）
            </label>
            <input
              type="number"
              value={accountInfo.riskPercentage}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, riskPercentage: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              预警阈值（%）
            </label>
            <input
              type="number"
              value={accountInfo.warningLevel}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, warningLevel: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* 交易设置输入 */}
      <div className="data-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">交易设置</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              入场价格（元/吨）
            </label>
            <input
              type="number"
              value={tradeSetup.entryPrice}
              onChange={(e) =>
                setTradeSetup({ ...tradeSetup, entryPrice: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              止损价格（元/吨）
            </label>
            <input
              type="number"
              value={tradeSetup.stopLoss}
              onChange={(e) =>
                setTradeSetup({ ...tradeSetup, stopLoss: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-destructive/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              当前价格（元/吨）
            </label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              第一止盈（元/吨）
            </label>
            <input
              type="number"
              value={tradeSetup.takeProfit1}
              onChange={(e) =>
                setTradeSetup({ ...tradeSetup, takeProfit1: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-green-400/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              第二止盈（元/吨）
            </label>
            <input
              type="number"
              value={tradeSetup.takeProfit2}
              onChange={(e) =>
                setTradeSetup({ ...tradeSetup, takeProfit2: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-green-400/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              第三止盈（元/吨）
            </label>
            <input
              type="number"
              value={tradeSetup.takeProfit3}
              onChange={(e) =>
                setTradeSetup({ ...tradeSetup, takeProfit3: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-secondary border border-green-400/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      {/* 风险指标显示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 仓位建议 */}
        <div className="data-card p-6 border-2 border-accent/30">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">仓位建议</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">建议手数</p>
              <p className="text-3xl font-bold text-accent">{riskMetrics.recommendedLots}</p>
              <p className="text-xs text-muted-foreground mt-2">手（每手 50 吨）</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">每手风险</p>
              <p className="text-2xl font-bold text-foreground">{riskMetrics.riskPerContract.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-2">元</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">风险/收益比</p>
              <p className="text-2xl font-bold text-green-400">{riskMetrics.riskRewardRatio.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-2">越高越好</p>
            </div>
          </div>
        </div>

        {/* 最大亏损 */}
        <div className="data-card p-6 border-2 border-destructive/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">风险评估</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <p className="text-xs text-muted-foreground mb-1">最大亏损金额</p>
              <p className="text-3xl font-bold text-destructive">{riskMetrics.maxLoss.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-2">元</p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
              <p className="text-xs text-muted-foreground mb-1">最大亏损比例</p>
              <p className="text-2xl font-bold text-destructive">{riskMetrics.maxLossPercentage.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground mt-2">占账户比例</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">风险等级</p>
              <p className={`text-lg font-bold ${riskMetrics.maxLossPercentage > 5 ? "text-destructive" : "text-green-400"}`}>
                {riskMetrics.maxLossPercentage > 5 ? "⚠️ 风险较高" : "✅ 风险可控"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 止盈目标 */}
      <div className="data-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-foreground">止盈目标</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-400/10 rounded-lg p-4 border border-green-400/30">
            <p className="text-xs text-muted-foreground mb-2">第一目标</p>
            <p className="text-2xl font-bold text-green-400">{riskMetrics.profitTarget1.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">元 | {((riskMetrics.profitTarget1 / accountInfo.totalCapital) * 100).toFixed(2)}% 账户</p>
          </div>
          <div className="bg-green-400/10 rounded-lg p-4 border border-green-400/30">
            <p className="text-xs text-muted-foreground mb-2">第二目标</p>
            <p className="text-2xl font-bold text-green-400">{riskMetrics.profitTarget2.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">元 | {((riskMetrics.profitTarget2 / accountInfo.totalCapital) * 100).toFixed(2)}% 账户</p>
          </div>
          <div className="bg-green-400/10 rounded-lg p-4 border border-green-400/30">
            <p className="text-xs text-muted-foreground mb-2">第三目标</p>
            <p className="text-2xl font-bold text-green-400">{riskMetrics.profitTarget3.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">元 | {((riskMetrics.profitTarget3 / accountInfo.totalCapital) * 100).toFixed(2)}% 账户</p>
          </div>
        </div>
      </div>

      {/* 提醒信息 */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                alert.urgency === "high"
                  ? "bg-destructive/10 border-destructive/50"
                  : alert.urgency === "medium"
                    ? "bg-yellow-400/10 border-yellow-400/50"
                    : "bg-blue-400/10 border-blue-400/50"
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  alert.urgency === "high"
                    ? "text-destructive"
                    : alert.urgency === "medium"
                      ? "text-yellow-400"
                      : "text-blue-400"
                }`}
              />
              <p className="text-sm text-foreground">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* 风险提示 */}
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <p className="text-sm text-destructive font-semibold mb-2">⚠️ 重要提示</p>
        <p className="text-xs text-muted-foreground">
          本工具仅供参考，不构成投资建议。期货交易风险极高，请根据自身情况谨慎决策。建议在交易前咨询专业投资顾问。
        </p>
      </div>
    </div>
  );
}
