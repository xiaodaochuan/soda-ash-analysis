import { TradingAdvice } from "@/lib/tradingAdvice";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";

interface TradingAdviceCardProps {
  advice: TradingAdvice;
}

export function TradingAdviceCard({ advice }: TradingAdviceCardProps) {
  const isLong = advice.direction === "long";
  const directionColor = isLong ? "text-green-400" : "text-red-400";
  const directionBgColor = isLong ? "bg-green-400/10" : "bg-red-400/10";
  const directionBorderColor = isLong ? "border-green-400/30" : "border-red-400/30";

  return (
    <div className={`data-card p-6 border-2 ${directionBorderColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {advice.timeframeLabel}
          </h3>
          <p className="text-xs text-muted-foreground">{advice.entryReason}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${directionBgColor}`}>
          {isLong ? (
            <TrendingUp className={`w-4 h-4 ${directionColor}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${directionColor}`} />
          )}
          <span className={`font-semibold text-sm ${directionColor}`}>
            {advice.directionLabel}
          </span>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-6 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">信心度</span>
          <span className="text-sm font-bold text-accent">{advice.confidence}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent h-full rounded-full transition-all duration-300"
            style={{ width: `${advice.confidence}%` }}
          />
        </div>
      </div>

      {/* Entry & Stop Loss */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">入场点位</p>
          <p className="text-2xl font-bold text-accent">{advice.entryPrice}</p>
          <p className="text-xs text-muted-foreground mt-2">元/吨</p>
        </div>
        <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/30">
          <p className="text-xs text-muted-foreground mb-1">止损点</p>
          <p className="text-2xl font-bold text-destructive">{advice.stopLoss}</p>
          <p className="text-xs text-muted-foreground mt-2">
            风险 {Math.abs(advice.entryPrice - advice.stopLoss)} 元/吨
          </p>
        </div>
      </div>

      {/* Targets */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">止盈目标</p>
        <div className="space-y-2">
          {advice.targets.map((target, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-secondary/30 rounded-lg p-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-xs font-bold text-accent">{target.level}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{target.price} 元/吨</span>
                  <span className="text-sm font-semibold text-green-400">
                    +{Math.abs(target.price - advice.entryPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{target.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk/Reward Ratio */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">风险/收益比</p>
          <p className="text-2xl font-bold text-accent">{advice.riskRewardRatio.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-2">越高越好</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">仓位建议</p>
          <p className="text-lg font-bold text-foreground capitalize">
            {advice.positionSize === "aggressive" && "激进"}
            {advice.positionSize === "moderate" && "中等"}
            {advice.positionSize === "conservative" && "保守"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {advice.positionSize === "aggressive" && "5-10% 账户"}
            {advice.positionSize === "moderate" && "2-5% 账户"}
            {advice.positionSize === "conservative" && "1-2% 账户"}
          </p>
        </div>
      </div>

      {/* Pyramiding */}
      {advice.pyramiding && advice.pyramiding.length > 0 && (
        <div className="mb-6 pb-6 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">加仓/减仓条件</p>
          <div className="space-y-2">
            {advice.pyramiding.map((pyr, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="px-2 py-1 rounded bg-accent/20 text-accent font-semibold whitespace-nowrap">
                  {pyr.action === "add" ? "加仓" : "减仓"}
                </span>
                <span className="text-muted-foreground flex-1">{pyr.trigger}</span>
                <span className="font-semibold text-foreground whitespace-nowrap">{pyr.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <p className="text-xs font-semibold text-muted-foreground uppercase">关键风险</p>
        </div>
        <ul className="space-y-1">
          {advice.risks.map((risk, idx) => (
            <li key={idx} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-destructive">•</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
