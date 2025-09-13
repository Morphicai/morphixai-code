# AppSdk API 文档

WebView 环境下的 React Native 原生能力调用接口文档。

### 1. 相机/图库模块（AppSdk.camera）

#### takePicture(options?)
调用相机拍照

**入参：**
```typescript
interface CameraOptions {
  quality?: number;        // 图片质量 0~1，默认 0.8
  aspect?: [number, number]; // 裁剪比例，默认 [4,3]
  exif?: boolean;          // 是否返回 exif，默认 false
  allowsMultipleSelection?: boolean; // 是否允许多选，默认 false
  mediaTypes?: ['images']; // 媒体类型，目前仅支持图片
}
```

**出参：**
```typescript
interface CameraResult {
  canceled: boolean;
  assets: {
    uri: string;           // 本地图片路径或base64数据URI
    width: number;         // 图片宽度
    height: number;        // 图片高度
    fileName?: string;     // 文件名
    fileSize?: number;     // 文件大小
    type?: 'image' | 'video'; // 文件类型
    base64: string;        // base64编码（始终返回）
    exif?: object;         // exif信息
  }[];
}
```

#### pickImage(options?)
从图库选择图片

**入参：** 同 `takePicture()`  
**出参：** 同 `takePicture()`

---

### 2. 地理位置模块（AppSdk.location）

#### getCurrentPosition(options?)
获取当前位置

**入参：**
```typescript
interface LocationOptions {
  accuracy?: number;       // 定位精度级别，1-6的数字，1为最低精度，6为最高精度，默认1
}
```

**出参：**
```typescript
interface Position {
  coords: {
    latitude: number;      // 纬度
    longitude: number;     // 经度
    accuracy: number | null; // 精度
    altitude: number | null; // 海拔
    altitudeAccuracy: number | null; // 海拔精度
    heading: number | null; // 方向
    speed: number | null;   // 速度
  };
  timestamp: number;       // 时间戳（毫秒）
  mocked?: boolean;        // 是否模拟（Android）
}
```

---

### 3. 提醒/通知模块（AppSdk.reminder）

#### createReminder(reminder)
创建提醒

**入参：**
```typescript
interface PluginReminder {
  message: string;         // 提醒内容（必填）
  start_time: number;      // 开始时间时间戳（必填）
  end_time?: number;       // 结束时间时间戳
  interval?: number;       // 重复间隔(毫秒)，0为不重复
  skip_dates?: number[];   // 跳过日期时间戳数组，最多100个
  title?: string;          // 标题
  sub_title?: string;      // 副标题
  page?: string;           // 跳转页面
  appid?: string;          // 应用ID
}
```

**出参：**
```typescript
interface PluginReminder {
  id: string;              // 唯一ID
  created_at: string;      // 创建时间
  // ... 其他字段同入参
}
```

#### getUserReminders()
获取所有提醒

**入参：** 无  
**出参：** `PluginReminder[]`

#### getReminder({id})
获取单个提醒

**入参：**
```typescript
{
  id: string               // 提醒ID
}
```

**出参：** `PluginReminder | null`

#### updateReminder(params)
更新提醒

**入参：**
```typescript
interface UpdateReminderParams {
  id: string;              // 提醒ID
  reminder: Partial<PluginReminder>; // 要更新的字段
}
```

**出参：** `PluginReminder | null`

#### updateSkipDates(params)
更新跳过日期

**入参：**
```typescript
interface UpdateSkipDatesParams {
  id: string;              // 提醒ID
  skipDates: number[];     // 跳过日期时间戳数组，最多100个
}
```

**出参：** `PluginReminder | null`

#### addSkipDate(params)
添加跳过日期

**入参：**
```typescript
interface AddSkipDateParams {
  id: string;              // 提醒ID
  skipDate: number;        // 跳过日期时间戳
}
```

**出参：** `PluginReminder | null`

#### removeSkipDate(params)
移除跳过日期

**入参：**
```typescript
interface RemoveSkipDateParams {
  id: string;              // 提醒ID
  skipDate: number;        // 跳过日期时间戳
}
```

**出参：** `PluginReminder | null`

#### deleteReminder({id})
删除提醒

**入参：**
```typescript
{
  id: string               // 提醒ID
}
```

**出参：** `boolean`

---

### 4. AI聊天模块（AppSdk.AI）

#### chat({messages, options})
与AI进行对话

**入参：**
```typescript
// 消息类型
interface LLMBaseMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: MessageContent;
  reasoning?: string;        // 推理过程（可选）
  tool_calls?: IToolCall[];  // 工具调用（可选）
  tool_results?: IToolResult[]; // 工具结果（可选）
}

// 内容类型支持多种格式
type MessageContent = string | ContentItem[];

interface ContentItem {
  type: 'text' | 'image_url' | 'file';
  // 文字内容
  text?: string;
  // 图片内容
  image_url?: {
    url: string;  // 支持data:image/...格式或http://...格式
  };
  // 文件内容
  file?: {
    filename: string;
    file_data: string;  // base64编码的文件内容
  };
}

// 聊天选项
interface ChatOptions {
  model?: 'openai/gpt-4o' | 'anthropic/claude-3.7-sonnet'; // 模型名称，默认'openai/gpt-4o'
  temperature?: number;      // 采样温度，0-1之间，控制回复随机性，默认0.7
}

{
  messages: LLMBaseMessage[]
  options?: ChatOptions
}
```

**出参：** AI回复内容（具体格式取决于配置）

**使用示例：**

```javascript
// 1. 基础文字对话（含系统提示词）
const response = await AppSdk.AI.chat({
  messages: [
    {role: "system", content: "你是一个友善的助手"},
    {role: "user", content: "你好"}
  ],
  options: {model: "openai/gpt-4o"}
});

// 2. 包含图片的对话
const imageResponse = await AppSdk.AI.chat({
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "请分析这张图片"},
      {
        type: "image_url",
        image_url: {url: "data:image/jpeg;base64,/9j/4AAQ..."}
      }
    ]
  }]
});

// 3. 包含文件附件的对话
const fileResponse = await AppSdk.AI.chat({
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "请帮我分析这个文档"},
      {
        type: "file",
        file: {
          filename: "report.pdf",
          file_data: "JVBERi0xLjQK..."  // base64编码的文件内容
        }
      }
    ]
  }]
});

// 4. 多轮对话示例
const multiTurnResponse = await AppSdk.AI.chat({
  messages: [
    {role: "system", content: "你是一个专业的代码助手"},
    {role: "user", content: "如何在JavaScript中实现深拷贝？"},
    {role: "assistant", content: "有几种方法可以实现深拷贝..."},
    {role: "user", content: "那么性能最好的方法是什么？"}
  ],
  options: {temperature: 0.7}
});

// 5. 指定模型和温度参数
const modelResponse = await AppSdk.AI.chat({
  messages: [
    {role: "user", content: "解释一下量子计算的基本原理"}
  ],
  options: {
    model: "anthropic/claude-3.7-sonnet",
    temperature: 0.3
  }
});
```

**消息角色说明：**
- `system`: 系统提示词，定义AI的行为和规则
- `user`: 用户消息，用户的问题或指令  
- `assistant`: AI助手的回复
- `tool`: 工具执行结果

**内容格式说明：**
- 纯文字: `content: "Hello world"`
- 文字对象: `{type: "text", text: "Hello"}`
- 图片对象: `{type: "image_url", image_url: {url: "data:image/..."}}`
- 文件对象: `{type: "file", file: {filename: "file.pdf", file_data: "base64..."}}`
- 混合内容: `[{type: "text", text: "描述"}, {type: "image_url", ...}]`

**ChatOptions 参数说明：**
- `model`: 支持 'openai/gpt-4o' 或 'anthropic/claude-3.7-sonnet'，默认 'openai/gpt-4o'
- `temperature`: 采样温度，0-1之间，控制回复随机性，默认 0.7

#### getAvailableModels(options?)
获取可用模型列表

**入参：**
```typescript
options?: any              // 可选扩展参数（预留，当前未使用）
```

**出参：**
```typescript
interface ModelGroup {
  tag: string;             // 分组标识
  name: string;            // 分组名称
  models: {
    tag: string;           // 模型标识
    name: string;          // 模型名称
    providerTag: string;   // 服务商标识
  }[];
}

ModelGroup[]
```

---

### 5. 应用数据模块（AppSdk.appData）

#### createData({collection, data})
创建数据

**入参：**
```typescript
{
  collection: string       // 集合名称
  data: {                  // 要保存的数据对象
    id?: string;           // 可选：需要生成特定记录（如 config）时传入固定 id
    [key: string]: any;    // 其他业务字段
  }
}
```

**出参：**
```typescript
{
  id: string;              // 自动生成的数据ID
  ...data                  // 原始数据对象的所有字段
}
```

**说明：**
- 如果传入 `data.id`，将使用该 `id` 创建该记录（用于需要固定主键的场景，如 `config`）。
- 如果不传 `id`，系统会自动生成唯一 `id` 并作为返回结果返回（适用于一个集合中存在多条数据的常规场景）。
- 如果使用已存在的 `id` 调用 `createData` 将会报错；如需修改已有记录，请使用 `updateData`。

**示例：**
```javascript
// 1) 需要固定ID（如 config）
await AppSdk.appData.createData({
  collection: 'settings',
  data: { id: 'config', theme: 'dark', lang: 'zh-CN' }
});

// 2) 常规多条数据，自动生成ID
const res = await AppSdk.appData.createData({
  collection: 'users',
  data: { name: 'Alice', age: 30 }
});
console.log(res.id); // 系统生成的唯一ID
```

#### getData({collection, id})
读取单个数据

**入参：**
```typescript
{
  collection: string       // 集合名称
  id: string               // 数据ID
}
```

**出参：** 数据对象 或 `null`（不存在时）

#### queryData({collection, query})
查询多个数据

**入参：**
```typescript
interface AppDataQueryFilterItem {
  key: string;             // 查询键，直接使用字段名
  value: string;           // 匹配值
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
}

{
  collection: string       // 集合名称
  query: AppDataQueryFilterItem[] // 查询条件数组
}
```

**出参：** 数据对象数组

**示例：**
```javascript
// 查询年龄大于25的用户
const adults = await AppSdk.appData.queryData({
  collection: 'users',
  query: [{ key: 'age', value: '25', operator: 'gt' }]
});
```

#### updateData({collection, id, data})
更新数据（合并策略）

**入参：**
```typescript
{
  collection: string       // 集合名称
  id: string               // 数据ID
  data: object             // 要更新的数据对象, 不包含id字段
}
```

**出参：** 更新后的完整数据对象

#### deleteData({collection, id})
删除数据

**入参：**
```typescript
{
  collection: string       // 集合名称
  id: string               // 数据ID
}
```

**出参：**
```typescript
{
  success: boolean;
  id: string;
}
```



---

### 6. 日历模块（AppSdk.calendar）

#### requestCalendarPermissions()
请求日历权限

**入参：** 无

**出参：**
```typescript
interface PermissionResult {
  status: 'granted' | 'denied' | 'undetermined'; // 权限状态
  granted: boolean;        // 是否已授权
}
```

#### getCalendars()
获取日历列表

**入参：** 无  
**出参：** 日历对象数组

#### createCalendar({title, color?, name?, ownerAccount?})
创建新日历

**入参：**
```typescript
{
  title: string;           // 日历标题（必填）
  color?: string;          // 日历颜色，默认'#2196F3'
  name?: string;           // 名称
  ownerAccount?: string;   // 所有者账号
}
```

**出参：**
```typescript
interface CreateResult {
  success: boolean;
  id: string;              // 新创建的日历ID
}
```

#### createEvent({calendarId, eventData})
创建日历事件

**入参：**
```typescript
{
  calendarId: string;      // 日历ID（必填）
  eventData: {
    title: string;         // 事件标题（必填）
    startDate: Date | string; // 开始时间（必填）
    endDate?: Date | string;  // 结束时间
    allDay?: boolean;      // 是否全天事件
    location?: string;     // 地点
    notes?: string;        // 备注
    timeZone?: string;     // 时区
  };
}
```

**出参：**
```typescript
interface CreateResult {
  success: boolean;
  id: string;              // 新创建的事件ID
}
```

#### getEvents({calendarIds, startDate, endDate})
获取日历事件

**入参：**
```typescript
{
  calendarIds: string[]    // 日历ID数组
  startDate: string        // 开始时间
  endDate: string          // 结束时间
}
```

**出参：** 事件对象数组

#### createEventWithUI({title, startDate, endDate?, allDay?, location?, notes?, timeZone?})
使用系统UI创建事件

**入参：**
```typescript
{
  title: string;           // 事件标题（必填）
  startDate: Date | string; // 开始时间（必填）
  endDate?: Date | string; // 结束时间（可选）
  allDay?: boolean;        // 是否全天事件（可选）
  location?: string;       // 地点（可选）
  notes?: string;          // 备注（可选）
  timeZone?: string;       // 时区（可选）
}
```

**出参：**
```typescript
interface UIResult {
  success: boolean;
}
```

---

### 7. 文件系统模块（AppSdk.fileSystem）

#### readFileBase64({fileUri})
读取文件内容（Base64编码）

**入参：**
```typescript
{
  fileUri: string          // 文件URI（支持相对路径）
}
```

**出参：** `string` (Base64编码的文件内容)

#### writeFileBase64({fileUri, base64Content})
写入文件（Base64编码）

**入参：**
```typescript
{
  fileUri: string          // 文件URI（支持相对路径）
  base64Content: string    // Base64编码的文件内容
}
```

**出参：**
```typescript
interface WriteResult {
  success: boolean;
  fileUri: string;
}
```

#### fileExists({fileUri})
检查文件是否存在

**入参：**
```typescript
{
  fileUri: string          // 文件URI（支持相对路径）
}
```

**出参：** `boolean`

#### deleteFile({fileUri})
删除文件

**入参：**
```typescript
{
  fileUri: string          // 文件URI（支持相对路径）
}
```

**出参：**
```typescript
interface DeleteResult {
  success: boolean;
}
```

#### pickDocument(options?)
选择文档

**入参：**
```typescript
interface PickDocumentOptions {
  type?: string | string[]; // 文档MIME类型，默认'*/*'
  copyToCacheDirectory?: boolean; // 是否复制到缓存目录，默认true
  multiple?: boolean;       // 是否允许多选，默认false
}

options?: PickDocumentOptions
```

**出参：**
```typescript
interface DocumentPickerResult {
  // 成功选择
  assets: {
    uri: string;           // 文件本地URI
    name: string;          // 文件名称
    mimeType?: string;     // MIME类型
    size?: number;         // 文件大小（字节）
    lastModified?: number; // 最后修改时间
  }[] | null;
  canceled: boolean;       // 是否取消
  output?: FileList;       // 仅Web平台可用
}
```

**入参：** 无  
**出参：** `string` (应用专属缓存目录路径)

#### saveImageToAlbum({base64Data, filename?})
保存图片到设备相册

**入参：**
```typescript
{
  base64Data: string       // Base64编码的图片数据（必填）
  filename?: string        // 可选的文件名，默认使用时间戳
}
```

**出参：**
```typescript
interface SaveImageResult {
  success: boolean;
  error?: string;          // 错误信息（失败时）
}
```

#### shareFile({fileUri, dialogTitle?, mimeType?})
分享文件

**入参：**
```typescript
{
  fileUri: string          // 文件URI（支持相对路径）（必填）
  dialogTitle?: string     // 分享对话框标题（可选）
  mimeType?: string        // 文件MIME类型（可选）
}
```

**出参：**
```typescript
interface ShareFileResult {
  success: boolean;
  error?: string;          // 错误信息（失败时）
}
```

**使用说明：**
- 使用系统内置的分享功能
- 支持所有常见文件类型
- 可以自定义分享对话框的标题
- 可以指定文件的MIME类型以优化分享体验
- 文件路径支持相对路径（相对于应用目录）

#### downloadFile({url, filename?})
下载文件并让用户选择保存位置

**入参：**
```typescript
{
  url: string              // 文件下载URL或Base64数据URI（必填）
  filename?: string        // 可选的文件名，默认从URL提取或生成
}
```

**出参：**
```typescript
interface DownloadResult {
  success: boolean;
  filePath?: string;       // 保存的文件路径（成功时）
  error?: string;          // 错误信息（失败时）
}
```

**支持的URL格式：**
- HTTP(S) URL: `https://example.com/file.pdf`
- Base64数据URI: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...`

**行为说明：**
1. **第一步：下载到应用目录** - 文件直接下载到应用专用目录，尽量使用传入的文件名
2. **第二步：用户选择保存位置** - 通过系统分享功能让用户选择保存位置
3. **结果处理** - 如果用户取消分享或分享功能不可用，返回失败结果

**特性：**
- 优先让用户选择保存位置，提供更好的用户体验
- 文件已下载到应用目录，即使分享失败也不会丢失
- 如果文件已存在会自动添加时间戳避免冲突
- Base64数据会自动解析并根据MIME类型生成合适的文件扩展名
- **智能去重**：同一个URL+filename组合只能同时运行一个下载任务，重复调用会返回同一个Promise

**使用示例：**
```javascript
// 基本下载
const result = await AppSdk.fileSystem.downloadFile({
  url: 'https://example.com/document.pdf',
  filename: 'important-document.pdf'
});

if (result.success) {
  console.log('文件已下载并分享成功:', result.filePath);
} else {
  console.warn('下载成功但分享失败:', result.error);
  // 注意：文件仍然保存在应用目录中，可以稍后再尝试分享
}

// 智能去重示例
const url = 'https://example.com/large-file.zip';

// 这两个调用会共享同一个下载任务
const [result1, result2] = await Promise.all([
  AppSdk.fileSystem.downloadFile({ url }),
  AppSdk.fileSystem.downloadFile({ url })  // 不会重复下载
]);

console.log('两个结果相同:', result1.filePath === result2.filePath);

// 处理分享失败的情况
const downloadResult = await AppSdk.fileSystem.downloadFile({
  url: 'https://example.com/file.pdf'
});

if (!downloadResult.success) {
  // 可以稍后手动分享文件
  const shareResult = await AppSdk.fileSystem.shareFile({
    fileUri: downloadResult.filePath,  // 文件已存在于应用目录
    dialogTitle: '分享文件'
  });
}
```



---

### 8. 文件上传模块（AppSdk.fileUpload）

#### uploadFile({fileInfo, compressionPreset?})
上传文件到云存储

**入参：**
```typescript
{
  fileInfo: {
    uri: string;           // 文件URI
    type: string;          // 文件MIME类型
    name: string;          // 文件名称
  };
  compressionPreset?: 'small' | 'medium' | 'large' | 'avatar' | 'thumbnail';
  // 可选的图片压缩预设：
  // - small: 800x800, 质量0.7 (适合聊天消息)
  // - medium: 1200x1200, 质量0.8 (适合一般显示) 
// - large: 1920x1920, 质量0.9 (适合高质量显示)
// - avatar: 300x300, 质量0.8 (适合用户头像)
// - thumbnail: 400x400, 质量0.6 (适合列表显示)
}
```

**出参：**
```typescript
interface UploadResult {
  success: boolean;
  publicUrl?: string;      // 文件的公共访问URL
  path?: string;           // 文件在存储桶中的路径
  size?: number;           // 文件大小（字节）
  width?: number;          // 图片宽度（仅图片文件）
  height?: number;         // 图片高度（仅图片文件）
  error?: string;          // 错误信息（失败时）
}
```

#### deleteFile({path})
删除云存储中的文件

**入参：**
```typescript
{
  path: string           // 文件在存储桶中的路径
}
```

**出参：**
```typescript
interface DeleteResult {
  success: boolean;
  error?: string;          // 错误信息（失败时）
}
```



---

## 错误处理

所有方法都返回Promise，统一使用try/catch处理错误：

```js
try {
  const result = await AppSdk.moduleName.methodName(params);
  // 处理成功结果
} catch (error) {
  console.error('操作失败:', error);
  // 处理错误逻辑
}
```

