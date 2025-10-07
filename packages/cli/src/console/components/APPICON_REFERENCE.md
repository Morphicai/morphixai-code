# AppIcon 常用图标

AppIcon 组件支持 **68 个常用图标**，所有图标均来自 Ionicons 图标库。

## 原有图标
```
apps, grid, briefcase, heart, document-text, checkmark-done, list, clipboard, calendar, notifications, chatbubble, folder, settings, checkmark
```

## 导航类
```
home, arrow-back, arrow-forward, menu, close, chevron-down, chevron-up
```

## 操作类
```
add, remove, create, trash, search, refresh, share, download
```

## 文件类
```
folder, document, image, videocam, camera, musical-notes
```

## 通信类
```
mail, send, call, chatbubble, notifications, heart, star
```

## 用户类
```
person, people, person-circle, log-in, log-out, key
```

## 设置类
```
settings, help-circle, information-circle, warning, checkmark-circle
```

## 媒体类
```
play, pause, stop, volume-high, volume-low, volume-mute
```

## 工具类
```
calculator, calendar, time, qr-code, flashlight
```

## 运动健康类
```
eye, bicycle, barbell
```

---

## 使用示例

### 基本使用
```jsx
import AppIcon from './components/AppIcon';

// 使用默认样式
<AppIcon name="home" />

// 自定义颜色和大小
<AppIcon name="bicycle" color="#4CD964" size={64} />

// 无背景模式
<AppIcon name="barbell" background={false} iconColor="#FF3B30" />
```

### API 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | string | `'apps'` | 图标名称（必选） |
| `color` | string | `'#6366f1'` | 背景颜色 |
| `size` | number | `48` | 图标大小（px） |
| `className` | string | `''` | 自定义 CSS 类 |
| `background` | boolean | `true` | 是否显示背景 |
| `iconColor` | string | `'#ffffff'` | 图标颜色 |

### 主题色（10种）

```jsx
const THEME_COLORS = [
    '#007AFF', // 蓝色 - iOS 默认蓝
    '#FF2D55', // 粉色
    '#5856D6', // 紫色
    '#FF9500', // 橙色
    '#4CD964', // 绿色
    '#FF3B30', // 红色
    '#5AC8FA', // 浅蓝色
    '#FFCC00', // 黄色
    '#34C759', // 薄荷绿
    '#AF52DE', // 紫罗兰
];
```

### 实际场景示例

#### 健身应用
```jsx
<AppIcon name="barbell" color="#FF3B30" size={48} />
<AppIcon name="bicycle" color="#4CD964" size={48} />
<AppIcon name="eye" color="#007AFF" size={48} />
```

#### 导航菜单
```jsx
<AppIcon name="home" color="#007AFF" />
<AppIcon name="person" color="#5856D6" />
<AppIcon name="settings" color="#FF9500" />
```

#### 操作按钮
```jsx
<AppIcon name="add" color="#34C759" size={32} />
<AppIcon name="trash" color="#FF3B30" size={32} />
<AppIcon name="search" color="#5AC8FA" size={32} />
```

#### 媒体播放器
```jsx
<AppIcon name="play" color="#007AFF" size={40} />
<AppIcon name="pause" color="#007AFF" size={40} />
<AppIcon name="stop" color="#FF3B30" size={40} />
```

---

## 注意事项

1. **命名方式**：支持 kebab-case（如 `arrow-back`）和 camelCase（如 `arrowBack`）两种命名方式
2. **图标变体**：所有图标均使用默认填充样式（filled），需要 outline 或 sharp 样式请直接使用 IonIcon 组件
3. **尺寸建议**：
   - 小图标：24-32px
   - 中等图标：40-48px（默认）
   - 大图标：56-64px
4. **颜色建议**：使用 THEME_COLORS 中提供的主题色以保持应用视觉一致性

---

## 完整图标列表（按字母排序）

```
add, apps, arrow-back, arrow-forward, barbell, bicycle, briefcase, 
calculator, calendar, call, camera, chatbubble, checkmark, checkmark-circle, 
checkmark-done, chevron-down, chevron-up, clipboard, close, create, 
document, document-text, download, eye, flashlight, folder, grid, 
heart, help-circle, home, image, information-circle, key, list, 
log-in, log-out, mail, menu, musical-notes, notifications, pause, 
people, person, person-circle, play, qr-code, refresh, remove, 
search, send, settings, share, star, stop, time, trash, 
videocam, volume-high, volume-low, volume-mute, warning
```

**总计：68 个图标**
