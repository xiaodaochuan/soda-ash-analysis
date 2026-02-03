/**
 * 动态智能建议引擎
 * 根据实时市场数据自动调整做多/做空/震荡方向
 */

export interface MarketData {
  currentPrice: number; // 当前价格
  previousPrice: number; // 前期价格
  weeklyProduction: number; // 周产量（万吨）
  totalInventory: number; // 总库存（万吨）
  lightInventory: number; // 轻质碱库存（万吨）
  heavyInventory: number; // 重质碱库存（万吨）
  glassOpenRate: number; // 浮法玻璃开工率（%）
  exportVolume: number; // 出口量（相对值）
}

export interface ScoringFactors {
  supplyScore: number; // 供应面评分（-100 到 100）
  inventoryScore: number; // 库存面评分（-100 到 100）
  technicalScore: number; // 技术面评分（-100 到 100）
  demandScore: number; // 需求面评分（-100 到 100）
  overallScore: number; // 综合评分（-100 到 100）
}

export interface TradingDirection {
  direction: "long" | "short" | "neutral"; // 交易方向
  confidence: number; // 信心度（0-100）
  reasoning: string; // 理由
  signals: string[]; // 信号列表
  riskFactors: string[]; // 风险因素
}

/**
 * 评估供应面
 * 产量高 → 负面（做空信号）
 * 产量低 → 正面（做多信号）
 */
function scoreSupply(data: MarketData, previousData?: MarketData): number {
  let score = 0;

  // 基准产量：75 万吨
  const baselineProduction = 75;
  const productionDiff = data.weeklyProduction - baselineProduction;

  // 产量偏离基准
  if (productionDiff > 5) {
    score -= 40; // 产量明显过高，做空信号
  } else if (productionDiff > 2) {
    score -= 20;
  } else if (productionDiff < -2) {
    score += 20; // 产量明显不足，做多信号
  } else if (productionDiff < -5) {
    score += 40;
  }

  // 产量趋势
  if (previousData) {
    const productionTrend = data.weeklyProduction - previousData.weeklyProduction;
    if (productionTrend > 1) {
      score -= 15; // 产量上升，做空
    } else if (productionTrend < -1) {
      score += 15; // 产量下降，做多
    }
  }

  return Math.max(-100, Math.min(100, score));
}

/**
 * 评估库存面
 * 库存高 → 负面（做空信号）
 * 库存低 → 正面（做多信号）
 */
function scoreInventory(data: MarketData, previousData?: MarketData): number {
  let score = 0;

  // 基准库存：150 万吨
  const baselineInventory = 150;
  const inventoryDiff = data.totalInventory - baselineInventory;

  // 库存绝对水平
  if (data.totalInventory > 160) {
    score -= 50; // 库存极高，强做空信号
  } else if (data.totalInventory > 155) {
    score -= 30; // 库存偏高
  } else if (data.totalInventory < 140) {
    score += 30; // 库存偏低，做多信号
  } else if (data.totalInventory < 135) {
    score += 50; // 库存极低，强做多信号
  }

  // 库存趋势
  if (previousData) {
    const inventoryTrend = data.totalInventory - previousData.totalInventory;
    if (inventoryTrend > 2) {
      score -= 25; // 库存快速上升，做空
    } else if (inventoryTrend < -2) {
      score += 25; // 库存快速下降，做多
    }
  }

  // 库存结构（轻质碱占比）
  const lightRatio = data.lightInventory / data.totalInventory;
  if (lightRatio > 0.55) {
    score -= 10; // 轻质碱过多，可能压制价格
  } else if (lightRatio < 0.50) {
    score += 10; // 轻质碱偏少，可能支撑价格
  }

  return Math.max(-100, Math.min(100, score));
}

/**
 * 评估技术面
 * 价格上升 → 正面（做多信号）
 * 价格下降 → 负面（做空信号）
 */
function scoreTechnical(data: MarketData, previousData?: MarketData): number {
  let score = 0;

  // 基准价格：1200 元/吨
  const baselinePrice = 1200;
  const priceDiff = data.currentPrice - baselinePrice;

  // 价格绝对水平
  if (data.currentPrice > 1220) {
    score += 30; // 价格高位，可能反弹
  } else if (data.currentPrice > 1210) {
    score += 15;
  } else if (data.currentPrice < 1180) {
    score -= 30; // 价格低位，可能继续下跌
  } else if (data.currentPrice < 1190) {
    score -= 15;
  }

  // 价格趋势
  if (previousData) {
    const priceTrend = data.currentPrice - previousData.currentPrice;
    if (priceTrend > 10) {
      score += 25; // 价格快速上升，做多信号
    } else if (priceTrend < -10) {
      score -= 25; // 价格快速下跌，做空信号
    }
  }

  // 支撑位和阻力位
  if (data.currentPrice > 1215) {
    score += 10; // 突破阻力位，做多
  } else if (data.currentPrice < 1195) {
    score -= 10; // 跌破支撑位，做空
  }

  return Math.max(-100, Math.min(100, score));
}

/**
 * 评估需求面
 * 玻璃开工率高 → 正面（做多信号）
 * 玻璃开工率低 → 负面（做空信号）
 */
function scoreDemand(data: MarketData, previousData?: MarketData): number {
  let score = 0;

  // 基准开工率：75%
  const baselineOpenRate = 75;
  const openRateDiff = data.glassOpenRate - baselineOpenRate;

  // 开工率绝对水平
  if (data.glassOpenRate > 80) {
    score += 40; // 开工率高，需求强，做多信号
  } else if (data.glassOpenRate > 77) {
    score += 20;
  } else if (data.glassOpenRate < 70) {
    score -= 40; // 开工率低，需求弱，做空信号
  } else if (data.glassOpenRate < 73) {
    score -= 20;
  }

  // 开工率趋势
  if (previousData) {
    const openRateTrend = data.glassOpenRate - previousData.glassOpenRate;
    if (openRateTrend > 2) {
      score += 20; // 开工率上升，做多
    } else if (openRateTrend < -2) {
      score -= 20; // 开工率下降，做空
    }
  }

  // 出口量
  if (data.exportVolume > 0.5) {
    score += 15; // 出口增加，做多
  } else if (data.exportVolume < 0.3) {
    score -= 15; // 出口减少，做空
  }

  return Math.max(-100, Math.min(100, score));
}

/**
 * 计算综合评分
 */
export function calculateScores(
  data: MarketData,
  previousData?: MarketData
): ScoringFactors {
  const supplyScore = scoreSupply(data, previousData);
  const inventoryScore = scoreInventory(data, previousData);
  const technicalScore = scoreTechnical(data, previousData);
  const demandScore = scoreDemand(data, previousData);

  // 权重分配
  // 库存面权重最高（40%），其次是需求面（30%），供应面（20%），技术面（10%）
  const overallScore =
    (inventoryScore * 0.4 +
      demandScore * 0.3 +
      supplyScore * 0.2 +
      technicalScore * 0.1) /
    1;

  return {
    supplyScore,
    inventoryScore,
    technicalScore,
    demandScore,
    overallScore,
  };
}

/**
 * 根据评分生成交易方向建议
 */
export function generateTradingDirection(
  scores: ScoringFactors,
  data: MarketData
): TradingDirection {
  const score = scores.overallScore;
  let direction: "long" | "short" | "neutral";
  let confidence: number;
  let reasoning: string;
  const signals: string[] = [];
  const riskFactors: string[] = [];

  // 判断方向
  if (score > 30) {
    direction = "long";
    confidence = Math.min(100, 50 + score);
    reasoning = "市场基本面偏好，库存压力缓解，需求相对稳定，建议做多";

    // 收集信号
    if (scores.demandScore > 20) signals.push("浮法玻璃开工率上升，需求改善");
    if (scores.inventoryScore > 20) signals.push("库存水平下降，压力缓解");
    if (scores.technicalScore > 20) signals.push("价格技术面走强，上升趋势明显");
    if (scores.supplyScore > 0) signals.push("产量保持稳定，供应压力不大");

    // 风险因素
    if (scores.inventoryScore < 0) riskFactors.push("库存仍处高位，可能限制上涨空间");
    if (scores.supplyScore < -20) riskFactors.push("产量过高，可能压制价格");
  } else if (score < -30) {
    direction = "short";
    confidence = Math.min(100, 50 - score);
    reasoning = "市场基本面偏弱，库存高企，需求疲软，建议做空";

    // 收集信号
    if (scores.inventoryScore < -20) signals.push("库存处于高位，供过于求明显");
    if (scores.demandScore < -20) signals.push("浮法玻璃开工率下降，需求不足");
    if (scores.technicalScore < -20) signals.push("价格技术面走弱，下跌趋势明显");
    if (scores.supplyScore < -20) signals.push("产量明显过高，供应压力巨大");

    // 风险因素
    if (scores.demandScore > 10) riskFactors.push("需求有所改善，可能反弹");
    if (scores.technicalScore > 20) riskFactors.push("技术面出现反弹信号，需要谨慎");
  } else {
    direction = "neutral";
    confidence = 50 - Math.abs(score);
    reasoning = "市场处于震荡区间，供需基本平衡，建议区间交易或观望";

    // 收集信号
    signals.push("供需基本平衡，市场缺乏明确方向");
    signals.push("建议在支撑位做多，阻力位做空");

    // 风险因素
    riskFactors.push("市场方向不明确，波动性可能增加");
    riskFactors.push("需要关注基本面变化，及时调整策略");
  }

  return {
    direction,
    confidence: Math.max(0, Math.min(100, confidence)),
    reasoning,
    signals: signals.slice(0, 4), // 最多显示 4 个信号
    riskFactors: riskFactors.slice(0, 3), // 最多显示 3 个风险因素
  };
}

/**
 * 生成动态交易建议（三个时间框架）
 */
export function generateDynamicAdvices(
  data: MarketData,
  previousData?: MarketData
): {
  shortTerm: TradingDirection;
  midTerm: TradingDirection;
  longTerm: TradingDirection;
  scores: ScoringFactors;
} {
  const scores = calculateScores(data, previousData);

  // 短期建议（更多依赖技术面和库存）
  const shortTermScores: ScoringFactors = {
    ...scores,
    overallScore:
      (scores.technicalScore * 0.4 +
        scores.inventoryScore * 0.4 +
        scores.demandScore * 0.2) /
      1,
  };

  // 中期建议（均衡各因素）
  const midTermScores = scores;

  // 长期建议（更多依赖供需和库存）
  const longTermScores: ScoringFactors = {
    ...scores,
    overallScore:
      (scores.supplyScore * 0.3 +
        scores.inventoryScore * 0.4 +
        scores.demandScore * 0.3) /
      1,
  };

  return {
    shortTerm: generateTradingDirection(shortTermScores, data),
    midTerm: generateTradingDirection(midTermScores, data),
    longTerm: generateTradingDirection(longTermScores, data),
    scores,
  };
}
