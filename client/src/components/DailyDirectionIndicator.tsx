import { TrendingDown, TrendingUp, Minus, Zap } from "lucide-react";

interface DailyDirectionIndicatorProps {
  direction: "long" | "short" | "neutral";
  confidence: number;
  lastUpdate: string;
}

export function DailyDirectionIndicator({
  direction,
  confidence,
  lastUpdate,
}: DailyDirectionIndicatorProps) {
  const directionConfig = {
    long: {
      label: "做多",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-gradient-to-r from-green-400/20 to-green-400/5",
      borderColor: "border-green-400/50",
      accentColor: "bg-green-400",
    },
    short: {
      label: "做空",
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-gradient-to-r from-destructive/20 to-destructive/5",
      borderColor: "border-destructive/50",
      accentColor: "bg-destructive",
    },
    neutral: {
      label: "震荡",
      icon: Minus,
      color: "text-yellow-400",
      bgColor: "bg-gradient-to-r from-yellow-400/20 to-yellow-400/5",
      borderColor: "border-yellow-400/50",
      accentColor: "bg-yellow-400",
    },
  };

  const config = directionConfig[direction];
  const Icon = config.icon;

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-8 mb-8`}>
      {/* 背景动画效果 */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-0 right-0 w-40 h-40 ${config.accentColor} rounded-full blur-3xl animate-pulse`}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">今日交易方向</p>
              <h2 className={`text-4xl font-bold ${config.color}`}>{config.label}</h2>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-5 h-5 ${config.color}`} />
              <span className={`text-3xl font-bold ${config.color}`}>{confidence}%</span>
            </div>
            <p className="text-xs text-muted-foreground">信心度</p>
          </div>
        </div>

        {/* 信息条 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground mb-2">操作建议</p>
            <p className={`text-lg font-bold ${config.color}`}>
              {direction === "long" ? "积极做多" : direction === "short" ? "坚决做空" : "区间交易"}
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground mb-2">风险等级</p>
            <p className={`text-lg font-bold ${confidence > 70 ? "text-green-400" : confidence > 50 ? "text-yellow-400" : "text-destructive"}`}>
              {confidence > 70 ? "低风险" : confidence > 50 ? "中等风险" : "高风险"}
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground mb-2">最后更新</p>
            <p className="text-lg font-bold text-accent">{lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* 顶部装饰线 */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accentColor}`}></div>
    </div>
  );
}
