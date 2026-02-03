/**
 * 风险管理工具
 * 帮助交易者计算仓位、管理风险、设置止损止盈
 */

export interface AccountInfo {
  totalCapital: number; // 账户总资金（元）
  riskPercentage: number; // 单笔交易风险占账户比例（%）
  warningLevel: number; // 账户亏损预警阈值（%）
}

export interface TradeSetup {
  entryPrice: number; // 入场价格
  stopLoss: number; // 止损价格
  takeProfit1: number; // 第一止盈
  takeProfit2: number; // 第二止盈
  takeProfit3: number; // 第三止盈
  direction: "long" | "short" | "neutral"; // 交易方向
}

export interface RiskMetrics {
  riskPerContract: number; // 每手的风险金额（元）
  recommendedLots: number; // 建议手数
  maxLoss: number; // 最大亏损（元）
  maxLossPercentage: number; // 最大亏损占账户比例（%）
  riskRewardRatio: number; // 风险收益比（平均）
  profitTarget1: number; // 第一目标收益（元）
  profitTarget2: number; // 第二目标收益（元）
  profitTarget3: number; // 第三目标收益（元）
}

export interface AccountStatus {
  currentBalance: number; // 当前账户余额
  totalProfit: number; // 总盈亏
  totalProfitPercentage: number; // 总盈亏百分比
  usedMargin: number; // 已用保证金
  availableMargin: number; // 可用保证金
  riskLevel: "safe" | "warning" | "danger"; // 风险等级
  warningMessage: string; // 预警信息
}

/**
 * 计算交易的风险指标
 * 纯碱期货：1 手 = 50 吨，最小变动价位 = 1 元/吨
 */
export function calculateRiskMetrics(
  account: AccountInfo,
  trade: TradeSetup
): RiskMetrics {
  const contractSize = 50; // 纯碱期货每手 50 吨
  const minPriceTick = 1; // 最小变动价位 1 元/吨
  const marginRate = 0.08; // 保证金率 8%（假设）

  // 计算每手的风险金额
  const priceRisk = Math.abs(trade.entryPrice - trade.stopLoss);
  const riskPerContract = priceRisk * contractSize;

  // 计算建议手数（基于账户风险百分比）
  const maxRiskAmount = (account.totalCapital * account.riskPercentage) / 100;
  const recommendedLots = Math.floor(maxRiskAmount / riskPerContract);

  // 确保至少 1 手，最多不超过 10 手（激进交易）
  const finalLots = Math.max(1, Math.min(recommendedLots, 10));

  // 计算最大亏损
  const maxLoss = riskPerContract * finalLots;
  const maxLossPercentage = (maxLoss / account.totalCapital) * 100;

  // 计算止盈目标的收益
  const profitTarget1 = Math.abs(trade.takeProfit1 - trade.entryPrice) * contractSize * finalLots;
  const profitTarget2 = Math.abs(trade.takeProfit2 - trade.entryPrice) * contractSize * finalLots;
  const profitTarget3 = Math.abs(trade.takeProfit3 - trade.entryPrice) * contractSize * finalLots;

  // 计算平均风险收益比
  const avgProfit = (profitTarget1 + profitTarget2 + profitTarget3) / 3;
  const riskRewardRatio = avgProfit / maxLoss;

  return {
    riskPerContract,
    recommendedLots: finalLots,
    maxLoss,
    maxLossPercentage,
    riskRewardRatio,
    profitTarget1,
    profitTarget2,
    profitTarget3,
  };
}

/**
 * 计算账户状态
 */
export function calculateAccountStatus(
  account: AccountInfo,
  currentBalance: number,
  openPositions: Array<{
    entryPrice: number;
    currentPrice: number;
    lots: number;
    direction: "long" | "short";
  }>
): AccountStatus {
  const contractSize = 50;
  const marginRate = 0.08;

  // 计算开仓盈亏
  let totalProfit = 0;
  let usedMargin = 0;

  openPositions.forEach((pos) => {
    const priceDiff = pos.direction === "long" ? pos.currentPrice - pos.entryPrice : pos.entryPrice - pos.currentPrice;
    const positionProfit = priceDiff * contractSize * pos.lots;
    totalProfit += positionProfit;

    // 计算占用保证金
    usedMargin += pos.entryPrice * contractSize * pos.lots * marginRate;
  });

  const totalProfitPercentage = (totalProfit / account.totalCapital) * 100;
  const availableMargin = account.totalCapital - usedMargin;

  // 判断风险等级
  let riskLevel: "safe" | "warning" | "danger" = "safe";
  let warningMessage = "账户状态正常";

  if (totalProfitPercentage <= -account.warningLevel) {
    riskLevel = "danger";
    warningMessage = `⚠️ 危险：账户亏损 ${Math.abs(totalProfitPercentage).toFixed(2)}%，已超过预警阈值 ${account.warningLevel}%`;
  } else if (totalProfitPercentage <= -account.warningLevel * 0.5) {
    riskLevel = "warning";
    warningMessage = `⚠️ 警告：账户亏损 ${Math.abs(totalProfitPercentage).toFixed(2)}%，接近预警阈值`;
  }

  // 检查保证金是否充足
  if (availableMargin < 0) {
    riskLevel = "danger";
    warningMessage = "🚨 紧急：保证金不足，可能面临强制平仓！";
  }

  return {
    currentBalance: currentBalance + totalProfit,
    totalProfit,
    totalProfitPercentage,
    usedMargin,
    availableMargin,
    riskLevel,
    warningMessage,
  };
}

/**
 * 生成止损止盈提醒
 */
export function generateAlerts(
  currentPrice: number,
  trade: TradeSetup,
  alertThreshold: number = 10 // 距离止损/止盈 10 元时提醒
): Array<{
  type: "stop_loss" | "take_profit" | "none";
  message: string;
  urgency: "high" | "medium" | "low";
}> {
  const alerts: Array<{
    type: "stop_loss" | "take_profit" | "none";
    message: string;
    urgency: "high" | "medium" | "low";
  }> = [];

  // 检查止损
  const distanceToStopLoss = Math.abs(currentPrice - trade.stopLoss);
  if (distanceToStopLoss <= alertThreshold) {
    alerts.push({
      type: "stop_loss",
      message: `🚨 接近止损价 ${trade.stopLoss}，当前价格 ${currentPrice}，距离仅 ${distanceToStopLoss.toFixed(2)} 元`,
      urgency: distanceToStopLoss <= 5 ? "high" : "medium",
    });
  }

  // 检查止盈
  const distanceToTP1 = Math.abs(currentPrice - trade.takeProfit1);
  const distanceToTP2 = Math.abs(currentPrice - trade.takeProfit2);
  const distanceToTP3 = Math.abs(currentPrice - trade.takeProfit3);

  if (distanceToTP1 <= alertThreshold) {
    alerts.push({
      type: "take_profit",
      message: `✅ 接近第一止盈价 ${trade.takeProfit1}，当前价格 ${currentPrice}，距离 ${distanceToTP1.toFixed(2)} 元`,
      urgency: "medium",
    });
  }

  if (distanceToTP2 <= alertThreshold) {
    alerts.push({
      type: "take_profit",
      message: `✅ 接近第二止盈价 ${trade.takeProfit2}，当前价格 ${currentPrice}，距离 ${distanceToTP2.toFixed(2)} 元`,
      urgency: "medium",
    });
  }

  if (distanceToTP3 <= alertThreshold) {
    alerts.push({
      type: "take_profit",
      message: `✅ 接近第三止盈价 ${trade.takeProfit3}，当前价格 ${currentPrice}，距离 ${distanceToTP3.toFixed(2)} 元`,
      urgency: "low",
    });
  }

  return alerts;
}

/**
 * 计算最优仓位大小（Kelly 公式变种）
 * 这是一个更保守的仓位管理方法
 */
export function calculateOptimalPositionSize(
  account: AccountInfo,
  winRate: number, // 胜率（0-1）
  avgWin: number, // 平均赢利
  avgLoss: number // 平均亏损
): number {
  // Kelly 公式: f = (bp - q) / b
  // 其中 b = 赔率, p = 胜率, q = 败率
  const b = avgWin / avgLoss;
  const p = winRate;
  const q = 1 - winRate;

  const kellyFraction = (b * p - q) / b;

  // 为了安全，使用 Kelly 的一半（Half Kelly）
  const safeKellyFraction = kellyFraction / 2;

  // 确保在 0-10% 之间
  const positionSize = Math.max(0, Math.min(safeKellyFraction * 100, 10));

  return positionSize;
}
