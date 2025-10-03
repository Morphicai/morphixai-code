import crypto from 'crypto';

export function generateProjectId() {
  // 生成 UUID v4 作为项目 ID
  return crypto.randomUUID();
}

export function validateProjectId(id) {
  // 验证项目 ID 格式（UUID v4）
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(id);
}