import crypto from 'crypto';

export function generateProjectId() {
  // 生成一个基于时间戳和随机字符的项目 ID
  const timestamp = Date.now().toString(36);
  const randomBytes = crypto.randomBytes(8).toString('hex');
  return `morphix_${timestamp}_${randomBytes}`;
}

export function validateProjectId(id) {
  // 验证项目 ID 格式
  const pattern = /^morphix_[a-z0-9]+_[a-f0-9]{16}$/;
  return pattern.test(id);
}