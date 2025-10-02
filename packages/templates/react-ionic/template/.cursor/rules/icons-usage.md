# 图标使用规范

## 概述

本文档详细说明了 MorphixAI 应用开发中图标的使用规范。我们使用 Ionicons 7.4.0 作为主要图标库，提供统一、美观的图标体验。

## 基本使用

### 导入方式

```jsx
// 推荐的导入方式 - 按需导入具体图标
import { home, homeOutline, homeSharp } from 'ionicons/icons';

// 在组件中使用
import { IonIcon } from '@ionic/react';

<IonIcon icon={home} />
```

### 图标样式系统

Ionicons 提供三种样式变体，开发者应根据使用场景选择合适的样式：

| 样式 | 命名规则 | 使用场景 | 示例 |
|------|----------|----------|------|
| **默认 (Filled)** | `iconName` | 激活状态、选中状态、强调元素 | `home`, `heart`, `star` |
| **轮廓 (Outline)** | `iconNameOutline` | 未激活状态、默认状态、次要元素 | `homeOutline`, `heartOutline`, `starOutline` |
| **锐角 (Sharp)** | `iconNameSharp` | 现代风格、简洁设计、特殊强调 | `homeSharp`, `heartSharp`, `starSharp` |

## 完整图标列表

### 导航类图标
```jsx
// 主导航
import { 
  home, homeOutline, homeSharp,           // 首页
  search, searchOutline, searchSharp,     // 搜索
  menu, menuOutline, menuSharp,           // 菜单
  apps, appsOutline, appsSharp,           // 应用
  grid, gridOutline, gridSharp,           // 网格
  list, listOutline, listSharp,           // 列表
  library, libraryOutline, librarySharp,  // 图书馆/收藏
  bookmark, bookmarkOutline, bookmarkSharp, // 书签
  archive, archiveOutline, archiveSharp   // 归档
} from 'ionicons/icons';

// 方向导航
import {
  chevronBack, chevronBackOutline, chevronBackSharp,     // 返回
  chevronForward, chevronForwardOutline, chevronForwardSharp, // 前进
  chevronUp, chevronUpOutline, chevronUpSharp,           // 向上
  chevronDown, chevronDownOutline, chevronDownSharp,     // 向下
  arrowBack, arrowBackOutline, arrowBackSharp,           // 箭头返回
  arrowForward, arrowForwardOutline, arrowForwardSharp,  // 箭头前进
  arrowUp, arrowUpOutline, arrowUpSharp,                 // 箭头向上
  arrowDown, arrowDownOutline, arrowDownSharp            // 箭头向下
} from 'ionicons/icons';
```

### 用户与社交图标
```jsx
import {
  person, personOutline, personSharp,             // 用户
  people, peopleOutline, peopleSharp,             // 多用户
  personCircle, personCircleOutline, personCircleSharp, // 用户头像
  personAdd, personAddOutline, personAddSharp,    // 添加用户
  personRemove, personRemoveOutline, personRemoveSharp, // 移除用户
  heart, heartOutline, heartSharp,                // 喜欢/收藏
  thumbsUp, thumbsUpOutline, thumbsUpSharp,       // 点赞
  thumbsDown, thumbsDownOutline, thumbsDownSharp, // 点踩
  share, shareOutline, shareSharp,                // 分享
  chatbubble, chatbubbleOutline, chatbubbleSharp, // 聊天
  mail, mailOutline, mailSharp                    // 邮件
} from 'ionicons/icons';
```

### 媒体与文件图标
```jsx
import {
  camera, cameraOutline, cameraSharp,             // 相机
  image, imageOutline, imageSharp,                // 图片
  images, imagesOutline, imagesSharp,             // 多图片
  videocam, videocamOutline, videocamSharp,       // 视频录制
  film, filmOutline, filmSharp,                   // 电影/视频
  musicalNote, musicalNoteOutline, musicalNoteSharp, // 音乐
  play, playOutline, playSharp,                   // 播放
  pause, pauseOutline, pauseSharp,                // 暂停
  stop, stopOutline, stopSharp,                   // 停止
  playSkipBack, playSkipBackOutline, playSkipBackSharp, // 上一首
  playSkipForward, playSkipForwardOutline, playSkipForwardSharp, // 下一首
  volume, volumeOutline, volumeSharp,             // 音量
  volumeMute, volumeMuteOutline, volumeMuteSharp, // 静音
  document, documentOutline, documentSharp,       // 文档
  folder, folderOutline, folderSharp,             // 文件夹
  folderOpen, folderOpenOutline, folderOpenSharp  // 打开文件夹
} from 'ionicons/icons';
```

### 操作类图标
```jsx
import {
  add, addOutline, addSharp,                   // 添加
  remove, removeOutline, removeSharp,          // 移除
  close, closeOutline, closeSharp,             // 关闭
  checkmark, checkmarkOutline, checkmarkSharp, // 确认/完成
  create, createOutline, createSharp,          // 编辑/创建
  copy, copyOutline, copySharp,                // 复制
  cut, cutOutline, cutSharp,                   // 剪切
  trash, trashOutline, trashSharp,             // 删除
  save, saveOutline, saveSharp,                // 保存
  download, downloadOutline, downloadSharp,    // 下载
  upload, uploadOutline, uploadSharp,          // 上传
  refresh, refreshOutline, refreshSharp,       // 刷新
  sync, syncOutline, syncSharp,                // 同步
  swap, swapHorizontal, swapVertical,          // 交换
  resize, resizeOutline, resizeSharp           // 调整大小
} from 'ionicons/icons';
```

### 状态与通知图标
```jsx
import {
  notifications, notificationsOutline, notificationsSharp, // 通知
  notificationsOff, notificationsOffOutline, notificationsOffSharp, // 通知关闭
  alert, alertOutline, alertSharp,             // 警告
  alertCircle, alertCircleOutline, alertCircleSharp, // 警告圆圈
  warning, warningOutline, warningSharp,       // 警告
  information, informationOutline, informationSharp, // 信息
  informationCircle, informationCircleOutline, informationCircleSharp, // 信息圆圈
  checkmarkCircle, checkmarkCircleOutline, checkmarkCircleSharp, // 成功
  closeCircle, closeCircleOutline, closeCircleSharp, // 错误
  helpCircle, helpCircleOutline, helpCircleSharp, // 帮助
  star, starOutline, starSharp,                // 星星/评分
  starHalf, starHalfOutline, starHalfSharp     // 半星
} from 'ionicons/icons';
```

### 设置与工具图标
```jsx
import {
  settings, settingsOutline, settingsSharp,     // 设置
  cog, cogOutline, cogSharp,                    // 齿轮设置
  options, optionsOutline, optionsSharp,        // 选项
  filter, filterOutline, filterSharp,           // 筛选
  funnel, funnelOutline, funnelSharp,           // 漏斗筛选
  build, buildOutline, buildSharp,              // 构建/工具
  hammer, hammerOutline, hammerSharp,           // 锤子工具
  construct, constructOutline, constructSharp,  // 建设工具
  bug, bugOutline, bugSharp,                    // 调试
  code, codeOutline, codeSharp,                 // 代码
  terminal, terminalOutline, terminalSharp      // 终端
} from 'ionicons/icons';
```

### 时间与日期图标
```jsx
import {
  time, timeOutline, timeSharp,               // 时间
  alarm, alarmOutline, alarmSharp,           // 闹钟
  timer, timerOutline, timerSharp,           // 计时器
  stopwatch, stopwatchOutline, stopwatchSharp, // 秒表
  hourglass, hourglassOutline, hourglassSharp, // 沙漏
  calendar, calendarOutline, calendarSharp,   // 日历
  calendarClear, calendarClearOutline, calendarClearSharp, // 清空日历
  today, todayOutline, todaySharp             // 今天
} from 'ionicons/icons';
```

### 位置与地图图标
```jsx
import {
  location, locationOutline, locationSharp,     // 位置
  pin, pinOutline, pinSharp,                   // 标记点
  map, mapOutline, mapSharp,                   // 地图
  navigate, navigateOutline, navigateSharp,    // 导航
  compass, compassOutline, compassSharp,       // 指南针
  flag, flagOutline, flagSharp,                // 旗帜
  business, businessOutline, businessSharp,    // 商业/建筑
  storefront, storefrontOutline, storefrontSharp, // 店面
  restaurant, restaurantOutline, restaurantSharp, // 餐厅
  car, carOutline, carSharp,                   // 汽车
  bicycle, bicycleOutline, bicycleSharp,       // 自行车
  walk, walkOutline, walkSharp                 // 步行
} from 'ionicons/icons';
```

### 通信与连接图标
```jsx
import {
  call, callOutline, callSharp,               // 电话
  videocam, videocamOutline, videocamSharp,   // 视频通话
  mail, mailOutline, mailSharp,               // 邮件
  chatbubble, chatbubbleOutline, chatbubbleSharp, // 聊天
  chatbubbles, chatbubblesOutline, chatbubblesSharp, // 多聊天
  send, sendOutline, sendSharp,               // 发送
  wifi, wifiOutline, wifiSharp,               // WiFi
  bluetooth, bluetoothOutline, bluetoothSharp, // 蓝牙
  cellular, cellularOutline, cellularSharp,   // 移动网络
  radio, radioOutline, radioSharp,            // 无线电
  rss, rssOutline, rssSharp,                  // RSS订阅
  link, linkOutline, linkSharp                // 链接
} from 'ionicons/icons';
```

### 购物与商业图标
```jsx
import {
  cart, cartOutline, cartSharp,               // 购物车
  bag, bagOutline, bagSharp,                  // 购物袋
  basket, basketOutline, basketSharp,         // 购物篮
  storefront, storefrontOutline, storefrontSharp, // 店面
  card, cardOutline, cardSharp,               // 卡片/支付
  cash, cashOutline, cashSharp,               // 现金
  wallet, walletOutline, walletSharp,         // 钱包
  receipt, receiptOutline, receiptSharp,      // 收据
  pricetag, pricetagOutline, pricetagSharp,   // 价格标签
  pricetags, pricetagsOutline, pricetagsSharp, // 多价格标签
  gift, giftOutline, giftSharp,               // 礼物
  trophy, trophyOutline, trophySharp          // 奖杯
} from 'ionicons/icons';
```

### 设备与硬件图标
```jsx
import {
  phone, phonePortrait, phoneLandscape,       // 手机
  tablet, tabletPortrait, tabletLandscape,    // 平板
  desktop, desktopOutline, desktopSharp,      // 桌面电脑
  laptop, laptopOutline, laptopSharp,         // 笔记本电脑
  tv, tvOutline, tvSharp,                     // 电视
  watch, watchOutline, watchSharp,            // 手表
  headset, headsetOutline, headsetSharp,      // 耳机
  gameController, gameControllerOutline, gameControllerSharp, // 游戏手柄
  battery, batteryCharging, batteryDead,      // 电池状态
  flashlight, flashlightOutline, flashlightSharp, // 手电筒
  bulb, bulbOutline, bulbSharp                // 灯泡
} from 'ionicons/icons';
```

### 天气与自然图标
```jsx
import {
  sunny, sunnyOutline, sunnySharp,           // 晴天
  moon, moonOutline, moonSharp,              // 月亮
  cloudy, cloudyOutline, cloudySharp,        // 多云
  cloudyNight, cloudyNightOutline, cloudyNightSharp, // 夜间多云
  partlySunny, partlySunnyOutline, partlySunnySharp, // 部分晴朗
  rainy, rainyOutline, rainySharp,           // 雨天
  snow, snowOutline, snowSharp,              // 雪天
  thunderstorm, thunderstormOutline, thunderstormSharp, // 雷雨
  flash, flashOutline, flashSharp,           // 闪电
  umbrella, umbrellaOutline, umbrellaSharp,  // 雨伞
  leaf, leafOutline, leafSharp,              // 叶子
  flower, flowerOutline, flowerSharp         // 花朵
} from 'ionicons/icons';
```

### 科学与教育图标
```jsx
import {
  library, libraryOutline, librarySharp,     // 图书馆
  book, bookOutline, bookSharp,              // 书籍
  bookmarks, bookmarksOutline, bookmarksSharp, // 书签
  school, schoolOutline, schoolSharp,        // 学校
  calculator, calculatorOutline, calculatorSharp, // 计算器
  flask, flaskOutline, flaskSharp,           // 烧瓶/实验
  telescope, telescopeOutline, telescopeSharp, // 望远镜
  magnet, magnetOutline, magnetSharp,        // 磁铁
  bandage, bandageOutline, bandageSharp,     // 绷带/医疗
  fitness, fitnessOutline, fitnessSharp,     // 健身
  nutrition, nutritionOutline, nutritionSharp, // 营养
  pulse, pulseOutline, pulseSharp            // 脉搏/心跳
} from 'ionicons/icons';
```

### 安全与权限图标
```jsx
import {
  lockClosed, lockClosedOutline, lockClosedSharp, // 锁定
  lockOpen, lockOpenOutline, lockOpenSharp,   // 解锁
  key, keyOutline, keySharp,                  // 钥匙
  shield, shieldOutline, shieldSharp,         // 盾牌/保护
  shieldCheckmark, shieldCheckmarkOutline, shieldCheckmarkSharp, // 安全确认
  eye, eyeOutline, eyeSharp,                  // 查看
  eyeOff, eyeOffOutline, eyeOffSharp,         // 隐藏
  fingerPrint, fingerPrintOutline, fingerPrintSharp, // 指纹
  scan, scanOutline, scanSharp,               // 扫描
  barcode, barcodeOutline, barcodeSharp,      // 条形码
  qrCode, qrCodeOutline, qrCodeSharp          // 二维码
} from 'ionicons/icons';
```

## 使用规范

### 1. 状态切换规范
对于具有状态变化的组件，推荐使用以下模式：

```jsx
// Tab 导航状态切换
function TabButton({ isActive, icon, label }) {
  return (
    <IonTabButton>
      <IonIcon icon={isActive ? icon : `${icon}Outline`} />
      <span>{label}</span>
    </IonTabButton>
  );
}

// 收藏状态切换
function FavoriteButton({ isFavorited, onToggle }) {
  return (
    <IonButton fill="clear" onClick={onToggle}>
      <IonIcon icon={isFavorited ? heart : heartOutline} />
    </IonButton>
  );
}

// 通知状态
function NotificationBell({ hasNotifications }) {
  return (
    <IonIcon icon={hasNotifications ? notifications : notificationsOutline} />
  );
}
```

### 2. 尺寸规范
```jsx
// 默认尺寸 (24px)
<IonIcon icon={home} />

// 小尺寸 (16px) - 用于内联图标
<IonIcon icon={time} size="small" />

// 大尺寸 (32px) - 用于强调图标
<IonIcon icon={star} size="large" />

// 自定义尺寸
<IonIcon icon={settings} style={{ fontSize: '20px' }} />
```

### 3. 颜色规范
```jsx
// 使用 CSS 变量保持主题一致性
<IonIcon 
  icon={warning} 
  color="warning"  // 使用 Ionic 预定义颜色
/>

// 自定义颜色
<IonIcon 
  icon={heart} 
  style={{ color: '#ff6b6b' }}  // 仅在必要时使用
/>

// 继承父元素颜色（推荐）
<IonButton color="primary">
  <IonIcon icon={add} slot="start" />
  添加
</IonButton>
```

### 4. 布局规范
```jsx
// 按钮中的图标
<IonButton>
  <IonIcon icon={download} slot="start" />
  下载文件
</IonButton>

// 列表项中的图标
<IonItem>
  <IonIcon icon={document} slot="start" />
  <IonLabel>文档标题</IonLabel>
  <IonIcon icon={chevronForward} slot="end" />
</IonItem>

// 独立图标按钮
<IonButton fill="clear" shape="round">
  <IonIcon icon={more} />
</IonButton>
```

## 最佳实践

### 1. 语义化选择
- **选择有意义的图标**：确保图标能准确传达功能意图
- **保持一致性**：同类功能使用相同的图标系列
- **避免过度装饰**：优先选择简洁明了的图标

### 2. 无障碍设计
```jsx
// 为屏幕阅读器提供描述
<IonIcon 
  icon={settings} 
  aria-label="打开设置" 
/>

// 装饰性图标隐藏
<IonIcon 
  icon={star} 
  aria-hidden="true" 
/>
```

### 3. 性能优化
```jsx
// 推荐：按需导入
import { home, search, settings } from 'ionicons/icons';

// 避免：全量导入
// import * as icons from 'ionicons/icons';
```

### 4. 主题适配
图标会自动适配 Ionic 的主题系统，无需额外配置即可支持：
- 明暗主题切换
- 颜色主题变化
- 平台差异适配

## 错误示例

### 应避免的用法
```jsx
// ❌ 错误：混用不同样式
<IonTabButton>
  <IonIcon icon={home} />      // Filled
  <IonIcon icon={searchOutline} />  // Outline
</IonTabButton>

// ❌ 错误：图标与功能不匹配
<IonButton onClick={deleteItem}>
  <IonIcon icon={heart} />     // 应该用 trash
  删除
</IonButton>

// ❌ 错误：过度自定义样式
<IonIcon 
  icon={settings}
  style={{ 
    transform: 'rotate(45deg) scale(1.5)',
    color: '#rainbow',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  }}
/>
```

## 总结

遵循本规范可以确保：
1. **一致的用户体验**：统一的图标风格和使用模式
2. **良好的可维护性**：标准化的代码结构
3. **优秀的性能**：按需加载和主题优化
4. **无障碍友好**：支持屏幕阅读器和其他辅助技术

在选择和使用图标时，请始终考虑用户体验和设计一致性，优先使用本文档推荐的常用图标和使用模式。
