import fs from 'fs-extra';
import path from 'path';

export function createConsoleMiddleware({ consoleDistPath, consolePath, userAppUrl }) {
  return (req, res, next) => {
    // 检查是否是控制台路由
    if (!req.url.startsWith(consolePath)) {
      return next();
    }
    
    try {
      // 移除控制台路径前缀，获取实际文件路径
      let filePath = req.url.replace(consolePath, '') || '/index.html';
      
      // 确保以 / 开头
      if (!filePath.startsWith('/')) {
        filePath = '/' + filePath;
      }
      
      // 默认文件
      if (filePath === '/') {
        filePath = '/index.html';
      }
      
      const fullPath = path.join(consoleDistPath, filePath);
      
      // 检查文件是否存在
      if (!fs.existsSync(fullPath)) {
        // 如果是 SPA 路由，返回 index.html
        const indexPath = path.join(consoleDistPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          return serveFile(indexPath, res, userAppUrl);
        } else {
          res.statusCode = 404;
          res.end('Console not found');
          return;
        }
      }
      
      return serveFile(fullPath, res, userAppUrl);
      
    } catch (error) {
      console.error('Console middleware error:', error);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  };
}

function serveFile(filePath, res, userAppUrl) {
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  
  const mimeType = mimeTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  
  let content = fs.readFileSync(filePath);
  
  // 如果是 HTML 文件，注入用户应用 URL
  if (ext === '.html') {
    let htmlContent = content.toString();
    htmlContent = htmlContent.replace(
      '<!-- USER_APP_URL -->',
      `<script>window.__USER_APP_URL__ = '${userAppUrl}';</script>`
    );
    content = htmlContent;
  }
  
  res.end(content);
}