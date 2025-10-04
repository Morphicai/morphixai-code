/**
 * 计算是否为只读模式
 * 规则：
 * - 无用户或无创建者信息 → 只读
 * - 用户ID与创建者ID不一致 → 只读
 * - 其余情况可编辑
 */
export function computeReadOnly(app, user) {
  if (!app) return true;
  const creatorId = app?.user_id;
  const userId = user?.id;
  if (!creatorId || !userId) return true;
  return creatorId !== userId;
}


