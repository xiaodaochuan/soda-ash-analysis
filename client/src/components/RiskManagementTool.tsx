import { useState } from "react";
import { AlertCircle, TrendingDown, TrendingUp, Minus, DollarSign, Target } from "lucide-react";
import { calculateRiskMetrics, calculateAccountStatus, generateAlerts, AccountInfo, TradeSetup, RiskMetrics } from "@/lib/riskManagement";

export function RiskManagementTool() {
  // 账户信息
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    totalCapital: 100000, // 默认 10 万元
    riskPercentage: 3, // 每笔交易风险 3%
    warningLevel: 10, // 亏损 10% 时预警
  });

  // 交易方向
  const [tradeDirection, setTradeDirection] = useState<"long" | "short" | "neutral">("short");

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

  // 根据交易方向更新交易设置
  const handleDirectionChange = (direction: "long" | "short" | "neutral") => {
    setTradeDirection(direction);
    setTradeSetup({ ...tradeSetup, direction });

    // 根据方向自动调整默认参数
    if (direction === "long") {
      // 做多：入场低，止损更低，止盈更高
      setTradeSetup({
        entryPrice: 1200,
        stopLoss: 1190,
        takeProfit1: 1210,
        takeProfit2: 1220,
        takeProfit3: 1230,
        direction: "long",
      });
    } else if (direction === "short") {
      // 做空：入场高，止损更高，止盈更低
      setTradeSetup({
        entryPrice: 1207,
        stopLoss: 1225,
        takeProfit1: 1200,
        takeProfit2: 1190,
        takeProfit3: 1180,
        direction: "short",
      });
    } else {
      // 震荡：区间交易
      setTradeSetup({
        entryPrice: 1207,
        stopLoss: 1220,
        takeProfit1: 1195,
        takeProfit2: 1185,
        takeProfit3: 1175,
        direction: "neutral",
      });
    }
  };

  // 计算风险指标
  const riskMetrics = calculateRiskMetrics(accountInfo, tradeSetup);

  // 生成提醒
  const alerts = generateAlerts(currentPrice, tradeSetup, 10);

  // 方向配置
  const directionConfig = {
    long: {
      label: "做多",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/30",
    },
    short: {
      label: "做空",
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
    },
    neutral: {
      label: "震荡",
      icon: Minus,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/30",
    },
  };

  const currentConfig = directionConfig[tradeDirection];
  const DirectionIcon = currentConfig.icon;

  return (
    <div className="space-y-6">
      {/* 交易方向选择 */}
      <div className="data-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">交易方向选择</h3>
        <div className="grid grid-cols-3 gap-4">
          {(["long", "short", "neutral"] as const).map((direction) => {
            const config = directionConfig[direction];
            const Icon = config.icon;
            const isSelected = tradeDirection === direction;
            return (
              <button
                key={direction}
                onClick={() => handleDirectionChange(direction)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${config.bgColor} ${config.borderColor} ring-2 ring-accent`
                    : "bg-secondary/50 border-border hover:border-accent/50"
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? config.color : "text-muted-foreground"}`} />
                <p className={`font-semibold text-sm ${isSelected ? config.color : "text-foreground"}`}>
                  {config.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 账户信息输入 */}
      <div className="data-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">账户设置</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">
              账户总资金（元）
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={accountInfo.totalCapital === 0 ? "" : accountInfo.totalCapital}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setAccountInfo({ ...accountInfo, totalCapital: 0 });
                } else if (/^\d+$/.test(value)) {
                  setAccountInfo({ ...accountInfo, totalCapital: parseInt(value, 10) });
                }
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
      <div className={`data-card p-6 border-2 ${currentConfig.borderColor}`}>
        <div className="flex items-center gap-2 mb-4">
          <DirectionIcon className={`w-5 h-5 ${currentConfig.color}`} />
          <h3 className={`text-lg font-semibold ${currentConfig.color}`}>
            {currentConfig.label}交易设置
          </h3>
        </div>
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

      {/* 风险评估 */}
      <div className="data-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">风险评估</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">最大亏损金额</p>
            <p className="text-2xl font-bold text-destructive">{riskMetrics.maxLoss.toFixed(0)}元</p>
            <p className="text-xs text-destructive/70 mt-1">占账户 {riskMetrics.maxLossPercentage.toFixed(2)}%</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">建议仓位</p>
            <p className="text-2xl font-bold text-accent">{riskMetrics.recommendedLots}手</p>
            <p className="text-xs text-accent/70 mt-1">基于 {accountInfo.riskPercentage}% 风险</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">风险收益比</p>
            <p className="text-2xl font-bold text-green-400">{riskMetrics.riskRewardRatio.toFixed(2)}</p>
            <p className="text-xs text-green-400/70 mt-1">收益 / 风险</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">账户状态</p>
            <p className={`text-2xl font-bold ${riskMetrics.maxLossPercentage > accountInfo.warningLevel ? "text-destructive" : "text-green-400"}`}>
              {riskMetrics.maxLossPercentage > accountInfo.warningLevel ? "⚠️ 预警" : "✓ 安全"}
            </p>
          </div>
        </div>
      </div>

      {/* 提醒信息 */}
      {alerts.length > 0 && (
        <div className="data-card p-6 border-2 border-yellow-400/30 bg-yellow-400/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-400 mb-2">实时提醒</h3>
              <div className="space-y-1">
                {alerts.map((alert, idx) => (
                  <p key={idx} className="text-sm text-foreground">
                    {alert.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
