/**
 * 纯碱期货交易建议数据模型
 * 基于激进交易策略，提供日内、中期、长期三个时间框架的完整交易方案
 */

export interface TradingAdvice {
  timeframe: "intraday" | "medium" | "long";
  timeframeLabel: string;
  direction: "long" | "short";
  directionLabel: string;
  confidence: number; // 0-100，信心度
  
  // 入场
  entryPrice: number;
  entryReason: string;
  
  // 止损
  stopLoss: number;
  stopLossReason: string;
  
  // 止盈目标
  targets: {
    level: number;
    price: number;
    reason: string;
  }[];
  
  // 风险收益比
  riskRewardRatio: number;
  
  // 仓位建议
  positionSize: "aggressive" | "moderate" | "conservative";
  
  // 加仓/减仓条件
  pyramiding?: {
    trigger: string;
    action: "add" | "reduce";
    price: number;
  }[];
  
  // 关键风险因素
  risks: string[];
  
  // 更新时间
  updatedAt: string;
}

/**
 * 生成纯碱期货交易建议
 * 基于当前市场数据和基本面分析
 */
export function generateTradingAdvices(currentData: {
  currentPrice: number;
  weeklyProduction: number;
  totalInventory: number;
  lightInventory: number;
  heavyInventory: number;
  glassProductionRate: number;
  photovoltaicCapacity: number;
  priceChange: number; // 周环比变化
  inventoryChange: number; // 库存环比变化
}): TradingAdvice[] {
  const advices: TradingAdvice[] = [];
  
  // 基本面分析
  const isOversupply = currentData.weeklyProduction > 77 && currentData.totalInventory > 150;
  const isDemandWeak = currentData.glassProductionRate < 76;
  const isInventoryHigh = currentData.totalInventory > 152;
  const isPriceLow = currentData.currentPrice < 1210;
  
  // ==================== 日内交易建议 ====================
  // 日内交易基于技术面和短期情绪
  advices.push({
    timeframe: "intraday",
    timeframeLabel: "日内交易 (1-2周)",
    direction: "short",
    directionLabel: "做空",
    confidence: 75,
    
    entryPrice: currentData.currentPrice,
    entryReason: "价格在 1200-1210 区间震荡，库存高位压制，短期缺乏上升动力。建议在反弹至 1215-1220 时做空。",
    
    stopLoss: 1225,
    stopLossReason: "突破 1225 表示短期反弹力度超预期，止损点应设在此上方。",
    
    targets: [
      {
        level: 1,
        price: 1200,
        reason: "第一目标：回到支撑位 1200，获利 15-25 元/吨"
      },
      {
        level: 2,
        price: 1190,
        reason: "第二目标：进一步下探至 1190，获利 25-35 元/吨"
      },
      {
        level: 3,
        price: 1180,
        reason: "第三目标：激进目标 1180，获利 35-45 元/吨"
      }
    ],
    
    riskRewardRatio: 2.5, // 风险 25 元，收益最多 45 元
    
    positionSize: "aggressive",
    
    pyramiding: [
      {
        trigger: "价格跌破 1200",
        action: "add",
        price: 1200
      },
      {
        trigger: "价格反弹至 1210",
        action: "reduce",
        price: 1210
      }
    ],
    
    risks: [
      "浮法玻璃产线复产超预期，需求反弹",
      "政策面出现利好消息",
      "技术面出现强势反弹信号"
    ],
    
    updatedAt: new Date().toISOString()
  });
  
  // ==================== 中期交易建议 ====================
  // 中期交易基于基本面和库存周期
  advices.push({
    timeframe: "medium",
    timeframeLabel: "中期交易 (1-3个月)",
    direction: "short",
    directionLabel: "做空",
    confidence: 70,
    
    entryPrice: currentData.currentPrice,
    entryReason: "供应过剩、库存高位、需求疲软的三重压制。浮法玻璃进入消费淡季，对纯碱需求支撑有限。中期看空。",
    
    stopLoss: 1240,
    stopLossReason: "如果价格突破 1240，表示基本面出现重大改善或政策面利好，需要止损。",
    
    targets: [
      {
        level: 1,
        price: 1170,
        reason: "第一目标：1170，基于历史支撑位"
      },
      {
        level: 2,
        price: 1150,
        reason: "第二目标：1150，进一步压力释放"
      },
      {
        level: 3,
        price: 1130,
        reason: "第三目标：1130，激进目标（需要库存继续累积）"
      }
    ],
    
    riskRewardRatio: 3.0, // 风险 30 元，收益最多 70-80 元
    
    positionSize: "aggressive",
    
    pyramiding: [
      {
        trigger: "库存突破 160 万吨",
        action: "add",
        price: 1200
      },
      {
        trigger: "浮法玻璃开工率跌破 75%",
        action: "add",
        price: 1195
      },
      {
        trigger: "价格反弹至 1220",
        action: "reduce",
        price: 1220
      }
    ],
    
    risks: [
      "浮法玻璃产线大幅冷修，需求反弹",
      "纯碱出口数据好转，库存去化加速",
      "宏观政策出现刺激措施，房地产回暖",
      "新产能延期投放预期改变"
    ],
    
    updatedAt: new Date().toISOString()
  });
  
  // ==================== 长期交易建议 ====================
  // 长期交易基于供需格局和政策预期
  advices.push({
    timeframe: "long",
    timeframeLabel: "长期交易 (3个月+)",
    direction: "short",
    directionLabel: "做空",
    confidence: 65,
    
    entryPrice: currentData.currentPrice,
    entryReason: "2026 年上半年无新产能投放，但现有产能利用率高。需求端取决于房地产和玻璃行业复苏。短期内供应过剩格局难以改变，长期看空。",
    
    stopLoss: 1260,
    stopLossReason: "如果价格突破 1260，表示需求端出现重大改善或供应端出现重大收缩，长期看法需要调整。",
    
    targets: [
      {
        level: 1,
        price: 1100,
        reason: "第一目标：1100，基于供需平衡点"
      },
      {
        level: 2,
        price: 1050,
        reason: "第二目标：1050，历史低位参考"
      },
      {
        level: 3,
        price: 1000,
        reason: "第三目标：1000，激进目标（需要供应过剩持续恶化）"
      }
    ],
    
    riskRewardRatio: 4.0, // 风险 50 元，收益最多 200+ 元
    
    positionSize: "aggressive",
    
    pyramiding: [
      {
        trigger: "库存突破 165 万吨",
        action: "add",
        price: 1200
      },
      {
        trigger: "房地产政策继续宽松",
        action: "reduce",
        price: 1180
      },
      {
        trigger: "新产能投放延期确认",
        action: "add",
        price: 1190
      }
    ],
    
    risks: [
      "房地产政策出现重大转变，需求大幅反弹",
      "纯碱新产能提前投放",
      "出口市场需求好转，库存快速去化",
      "全球经济复苏超预期，玻璃需求反弹"
    ],
    
    updatedAt: new Date().toISOString()
  });
  
  return advices;
}

/**
 * 计算交易的风险/收益指标
 */
export function calculateTradeMetrics(advice: TradingAdvice) {
  const riskAmount = Math.abs(advice.entryPrice - advice.stopLoss);
  const maxReward = Math.abs(advice.targets[advice.targets.length - 1].price - advice.entryPrice);
  
  return {
    riskAmount,
    maxReward,
    riskRewardRatio: maxReward / riskAmount,
    profitFactor: (maxReward / riskAmount) * (advice.confidence / 100)
  };
}
