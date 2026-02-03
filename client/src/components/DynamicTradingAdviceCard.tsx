import { TrendingDown, TrendingUp, Minus, AlertCircle, CheckCircle } from "lucide-react";
import { TradingDirection } from "@/lib/dynamicAdviceEngine";

interface DynamicTradingAdviceCardProps {
  timeframe: "short" | "mid" | "long";
  advice: TradingDirection;
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export function DynamicTradingAdviceCard({
  timeframe,
  advice,
  entryPrice,
  stopLoss,
  takeProfit,
}: DynamicTradingAdviceCardProps) {
  const timeframeLabel = {
    short: "日内交易 (1-2周)",
    mid: "中期交易 (1-3个月)",
    long: "长期交易 (3个月+)",
  };

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

  const config = directionConfig[advice.direction];
  const Icon = config.icon;

  return (
    <div className={`data-card p-6 border-2 ${config.borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{timeframeLabel[timeframe]}</p>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <h3 className={`text-2xl font-bold ${config.color}`}>{config.label}</h3>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}>
          <p className={`text-sm font-semibold ${config.color}`}>信心度 {advice.confidence}%</p>
        </div>
      </div>

      {/* 建议理由 */}
      <p className="text-sm text-foreground mb-4 leading-relaxed">{advice.reasoning}</p>

      {/* 交易参数 */}
      {entryPrice && stopLoss && takeProfit && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">入场点位</p>
            <p className="text-lg font-bold text-foreground">{entryPrice}</p>
            <p className="text-xs text-muted-foreground">元/吨</p>
          </div>
          <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/30">
            <p className="text-xs text-muted-foreground mb-1">止损点</p>
            <p className="text-lg font-bold text-destructive">{stopLoss}</p>
            <p className="text-xs text-destructive/70">风险 {Math.abs(stopLoss - entryPrice)} 元/吨</p>
          </div>
          <div className="bg-green-400/10 rounded-lg p-3 border border-green-400/30">
            <p className="text-xs text-muted-foreground mb-1">止盈点</p>
            <p className="text-lg font-bold text-green-400">{takeProfit}</p>
            <p className="text-xs text-green-400/70">目标 {Math.abs(takeProfit - entryPrice)} 元/吨</p>
          </div>
        </div>
      )}

      {/* 信号列表 */}
      {advice.signals.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-accent uppercase mb-2">交易信号</p>
          <div className="space-y-2">
            {advice.signals.map((signal, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 风险因素 */}
      {advice.riskFactors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-destructive uppercase mb-2">风险因素</p>
          <div className="space-y-2">
            {advice.riskFactors.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
