/**
 * HostClient - 宿主环境使用的客户端 SDK
 * 
 * 使用 Proxy 方式调用嵌入页面的能力，支持 iframe 通信机制
 * 
 * 🚀 使用示例：
 * ```typescript
 * // 创建客户端
 * const client = createHostClient(iframe, 'https://trusted-domain.com');
 * 
 * // 等待初始化完成
 * await client.readyPromise;
 * 
 * // 使用模块化API
 * const version = await client.base.getVersion();
 * const authStatus = await client.auth.getAuthStatus();
 * const appsList = await client.apps.getAppsList({ page: 1, limit: 10 });
 * 
 * // 创建应用
 * const createResult = await client.apps.createApp({
 *     name: '我的应用',
 *     code: 'console.log("Hello World");',
 *     version: '1.0.0',
 *     unique_id: crypto.randomUUID()
 * });
 * 
 * // 或使用手动调用
 * const userInfo = await client.call('auth', 'getUserInfo');
 * const app = await client.call('apps', 'getAppById', 'app-id-123');
 * 
 * // 检查状态
 * const isReady = client.isClientReady();
 * const initStatus = await client.checkSDKInitialization();
 * 
 * // 清理资源
 * client.destroy();
 * ```
 * 
 * 📦 独立使用：
 * 此文件可以独立复制到其他项目中使用，包含了所有必要的类型定义和协议。
 */

// =============================================================================
// 基础类型定义 - 独立实现，便于复制到其他项目
// =============================================================================
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** 认证状态类型 */
export interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** 用户信息类型 */
export interface UserInfo {
  id: string;
  email?: string;
  isAnonymous: boolean;
  userData?: Record<string, unknown>;
}

/** 操作结果类型 */
export interface OperationResult {
  success: boolean;
  error?: string;
}

/** 创建应用请求参数 */
export interface CreateAppRequest {
  name: string;           // 必填 - 应用名称
  code: string;           // 必填 - 应用代码
  version: string;        // 必填 - 应用版本
  unique_id: string;      // 必填 - 唯一标识符（UUID格式）
  build_code?: string;    // 可选 - 构建代码
  desc?: string;          // 可选 - 应用描述
  visible?: boolean;      // 可选 - 是否可见
  icon?: string;          // 可选 - 应用图标
  color?: string;         // 可选 - 应用颜色
  prd?: string;           // 可选 - PRD内容
}

/** 更新应用请求参数 */
export interface UpdateAppRequest {
  name?: string;          // 可选 - 应用名称
  code?: string;          // 可选 - 应用代码
  version?: string;       // 可选 - 应用版本（更新代码时必需）
  build_code?: string;    // 可选 - 构建代码
  desc?: string;          // 可选 - 应用描述
  visible?: boolean;      // 可选 - 是否可见
  icon?: string;          // 可选 - 应用图标
  color?: string;         // 可选 - 应用颜色
  prd?: string;           // 可选 - PRD内容
}

/** 应用列表查询参数 */
export interface GetAppsListRequest {
  page?: number;          // 页码，默认1
  limit?: number;         // 每页数量，默认20，最大100
  visible?: boolean;      // 是否只显示可见应用
  search?: string;        // 搜索关键词
}

/** 应用对象 */
export interface App {
  id: string;
  name: string;
  code?: string;
  build_code?: string;
  version: string;
  desc?: string;
  visible: boolean;
  icon?: string;
  color?: string;
  unique_id: string;
  prd?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

/** 分页信息 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** API响应格式 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination; // 仅在列表接口中存在
}

/** 参数验证结果 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

// 客户端SDK版本号
export const HOST_CLIENT_VERSION = '1.0.0';

/** HostClient 基础接口 */
export interface IHostClient {
  /** 销毁客户端 */
  destroy(): void;
  /** 检查是否已准备就绪 */
  isClientReady(): boolean;
  /** 获取可用的能力列表 */
  getCapabilities(): Record<string, string[]>;
  /** 通过版本号检测 SDK 初始化状态 */
  checkSDKInitialization(): Promise<{
      initialized: boolean;
      version?: string;
      error?: string;
  }>;
  /** 手动调用方法 */
  call<T = unknown>(module: string, method: string, ...params: unknown[]): Promise<T>;
}

/** 模块化的能力接口 */
export interface ModuleCapabilities {
  /** 基础能力模块 */
  base: {
      /** 获取SDK版本号 */
      getVersion(): Promise<string>;
  };
  
  /** 认证能力模块 */
  auth: {
      /** 获取认证状态 */
      getAuthStatus(): Promise<AuthStatus>;
      /** 获取用户信息 */
      getUserInfo(): Promise<UserInfo | null>;
      /** 触发登录流程 */
      triggerLogin(): Promise<OperationResult>;
      /** 执行登出操作 */
      logout(): Promise<OperationResult>;
      /** 获取完整的应用状态 */
      getAppState(): Promise<{
          auth: AuthStatus;
          user: UserInfo | null;
          timestamp: number;
      }>;
  };

  /** 应用管理能力模块 */
  apps: {
      /** 创建应用 */
      createApp(request: CreateAppRequest): Promise<ApiResponse<App>>;
      /** 根据ID获取应用 */
      getAppById(appId: string, isFork?: boolean): Promise<ApiResponse<App>>;
      /** 根据unique_id获取应用 */
      getAppByUniqueId(uniqueId: string): Promise<ApiResponse<App>>;
      /** 更新应用 */
      updateApp(appId: string, request: UpdateAppRequest): Promise<ApiResponse<App>>;
      /** 获取应用代码 */
      getAppCode(appId: string): Promise<ApiResponse<{ code: string }>>;
      /** 获取应用构建代码 */
      getAppBuildCode(appId: string): Promise<ApiResponse<{ build_code: string }>>;
      /** 删除应用 */
      deleteApp(appId: string): Promise<ApiResponse<void>>;
      /** 获取应用列表 */
      getAppsList(request?: GetAppsListRequest): Promise<ApiResponse<App[]>>;
      /** 验证创建应用参数 */
      validateCreateAppRequest(request: CreateAppRequest): Promise<ValidationResult>;
  };
}

/** 带类型约束的 HostClient 接口 */
export interface TypedHostClient extends IHostClient, ModuleCapabilities {
  // 继承基础客户端接口和模块化能力
}

// 请求超时时间
const REQUEST_TIMEOUT = 30000; // 30秒

// 请求ID生成器
let requestId = 0;
function generateRequestId(): string {
  return `client_${Date.now()}_${++requestId}`;
}

// =============================================================================
// 标准消息协议定义 - 独立实现，便于复制到其他项目
// =============================================================================

/** HostSDK 标准事件名称 */
export const HOST_SDK_EVENT = 'HOSTSDK_MESSAGE';

/** 请求消息类型 */
export interface HostRequest {
  requestId: string;
  module: string;      // 能力名称 (如: 'auth', 'base')
  method: string;     // 方法名称 (如: 'getAuthStatus', 'getVersion')
  params?: unknown[];
  timestamp: number;
  sdkVersion: string;
}

/** 响应消息类型 */
export interface HostResponse<T = unknown> {
  requestId: string;
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  sdkVersion: string;
}

/** 标准消息包装器 */
export interface HostMessage {
  event: typeof HOST_SDK_EVENT;
  type: 'request' | 'response';
  data: HostRequest | HostResponse;
  timestamp: number;
  source: 'hostSDK' | 'hostClient';
}

/**
* HostClient 核心类
*/
export class HostClient {
  private iframe: HTMLIFrameElement;
  private pendingRequests = new Map<string, {
      resolve: (value: unknown) => void;
      reject: (error: Error) => void;
      timeout: ReturnType<typeof setTimeout>;
  }>();
  private messageListener: ((event: MessageEvent) => void) | null = null;
  private isReady = false;
  private targetOrigin: string = '*'; // 可配置的目标域
  public readyPromise: Promise<void>;

  constructor(iframe: HTMLIFrameElement, targetOrigin: string = '*') {
      this.iframe = iframe;
      this.targetOrigin = targetOrigin;
      this.readyPromise = this.initialize();
  }

  /**
   * 初始化客户端
   */
  private async initialize(): Promise<void> {
      // 添加消息监听器
      this.messageListener = (event: MessageEvent) => {
          this.handleMessage(event);
      };
      window.addEventListener('message', this.messageListener);
      
      // 等待 iframe 加载完成
      // await Promise.all([this.waitForIframeLoad(), sleep(5000)]);
      
      // 尝试与 HostSDK 建立连接
      await this.establishConnection();
      
      this.isReady = true;
      console.log('✅ HostClient initialized');
  }

  /**
   * 等待 iframe 加载完成
   */
  private async waitForIframeLoad(): Promise<void> {
      console.log('Waiting for iframe to load');
      console.log(this.iframe.contentDocument?.readyState);
      if (this.iframe.contentDocument?.readyState === 'complete') {
          return;
      }
      return new Promise((resolve) => {
          if (this.iframe.contentDocument?.readyState === 'complete') {
              resolve();
              return;
          }
          
          const onLoad = () => {
              this.iframe.removeEventListener('load', onLoad);
              resolve();
          };
          
          this.iframe.addEventListener('load', onLoad);
      });
  }

  /**
   * 建立与 HostSDK 的连接
   */
  private async establishConnection(): Promise<void> {
      const maxRetries = 5;
      const retryDelay = 200;
      
      for (let i = 0; i < maxRetries; i++) {
          try {
              await this.call('base', 'getVersion');
              console.log('🤝 HostClient connected to HostSDK successfully');
              return;
          } catch {
              if (i === maxRetries - 1) {
                  console.warn('⚠️ HostClient cannot connect to HostSDK; continuing initialization with limited features');
                  return;
              }
              await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
      }
  }

  /**
   * 处理来自嵌入页面的消息
   */
  private handleMessage(event: MessageEvent): void {
      // 确保消息来自目标 iframe
      if (event.source !== this.iframe.contentWindow) {
          return;
      }

      // 如果配置了特定域，检查来源
      if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) {
          console.warn(`HostClient: Message from ${event.origin} rejected, expected origin: ${this.targetOrigin}`);
          return;
      }

      try {
          let data: unknown;
          
          // 处理不同格式的消息
          if (typeof event.data === 'string') {
              try {
                  data = JSON.parse(event.data);
              } catch {
                  return;
              }
          } else {
              data = event.data;
          }

          // 检查是否是标准的 HostSDK 消息
          if (!data || typeof data !== 'object' || !('event' in data)) {
              return;
          }

          const hostMessage = data as HostMessage;
          
          // 只处理 HostSDK 标准事件
          if (hostMessage.event !== HOST_SDK_EVENT) {
              return;
          }

          // 只处理响应类型的消息
          if (hostMessage.type === 'response') {
              const response = hostMessage.data as HostResponse;
              this.handleResponse(response);
          }
      } catch (error) {
          console.error('HostClient: error handling message:', error);
      }
  }

  /**
   * 处理响应
   */
  private handleResponse(response: HostResponse): void {
      const pendingRequest = this.pendingRequests.get(response.requestId);
      if (!pendingRequest) {
          return;
      }

      // 清理请求
      clearTimeout(pendingRequest.timeout);
      this.pendingRequests.delete(response.requestId);

      // 处理响应
      if (response.success) {
          pendingRequest.resolve(response.data);
      } else {
          pendingRequest.reject(new Error(response.error || 'Unknown error'));
      }
  }



  /**
   * 发送请求到嵌入页面
   * @param module 能力模块名称
   * @param method 方法名称
   * @param params 参数数组
   */
  private async sendRequest<T = unknown>(module: string, method: string, params: unknown[] = []): Promise<T> {
      return new Promise<T>((resolve, reject) => {
          const requestId = generateRequestId();
          
          // 设置超时
          const timeout = setTimeout(() => {
              this.pendingRequests.delete(requestId);
              reject(new Error(`Request to ${module}.${method} timed out`));
          }, REQUEST_TIMEOUT);

          // 存储请求
          this.pendingRequests.set(requestId, {
              resolve: resolve as (value: unknown) => void,
              reject,
              timeout
          });

          // 构造请求
          const request: HostRequest = {
              requestId,
              module,
              method,
              params,
              timestamp: Date.now(),
              sdkVersion: HOST_CLIENT_VERSION
          };

          // 构造标准消息
          const message: HostMessage = {
              event: HOST_SDK_EVENT,
              type: 'request',
              data: request,
              timestamp: Date.now(),
              source: 'hostClient'
          };

          if (this.iframe.contentWindow) {
              this.iframe.contentWindow.postMessage(message, this.targetOrigin);
          } else {
              this.pendingRequests.delete(requestId);
              clearTimeout(timeout);
              reject(new Error('iframe not available'));
          }
      });
  }

  /**
   * 销毁客户端
   */
  destroy(): void {
      // 清理所有待处理的请求
      for (const [, request] of this.pendingRequests.entries()) {
          clearTimeout(request.timeout);
          request.reject(new Error('HostClient destroyed'));
      }
      this.pendingRequests.clear();

      // 移除消息监听器
      if (this.messageListener) {
          window.removeEventListener('message', this.messageListener);
          this.messageListener = null;
      }

      this.isReady = false;
      console.log('🧹 HostClient destroyed');
  }

  /**
   * 检查是否已准备就绪
   */
  isClientReady(): boolean {
      return this.isReady;
  }

  /**
   * 获取可用的能力列表
   */
  getCapabilities(): Record<string, string[]> {
      // Placeholder implementation; should fetch from embedded page
      console.warn('getCapabilities() should fetch capabilities from the embedded page HostSDK');
      return {};
  }

  /**
   * 检测 HostSDK 是否已正确初始化
   */
  async checkSDKInitialization(): Promise<{
      initialized: boolean;
      version?: string;
      error?: string;
  }> {
      try {
          const version = await this.call('base', 'getVersion') as string;
          return {
              initialized: true,
              version
          };
      } catch (error) {
          return {
              initialized: false,
              error: error instanceof Error ? error.message : String(error)
          };
      }
  }



  /**
   * 手动调用方法
   * @param module 能力模块名称
   * @param method 方法名称
   * @param params 参数
   */
  async call<T = unknown>(module: string, method: string, ...params: unknown[]): Promise<T> {
      return this.sendRequest<T>(module, method, params);
  }
}

// 移除了 isValidCapability 验证函数，直接发送所有请求

/**
* 创建代理对象，支持按模块调用嵌入页面的方法
* 优化版本：缓存模块代理，避免重复创建
*/
function createProxy(client: HostClient): TypedHostClient {
  const moduleProxyCache = new Map<string, Record<string, (...args: unknown[]) => Promise<unknown>>>();

  return new Proxy(client, {
      get(target, prop: string | symbol) {
          // 如果是 HostClient 自己的方法，直接返回
          if (typeof prop === 'string' && prop in target) {
              const value = target[prop as keyof HostClient];
              if (typeof value === 'function') {
                  return value.bind(target);
              }
              return value;
          }

          // 对于模块属性，返回缓存的模块代理
          if (typeof prop === 'string' && !prop.startsWith('_')) {
              const moduleName = prop;
              
              if (!moduleProxyCache.has(moduleName)) {
                  const moduleProxy = new Proxy({}, {
                      get(_, methodProp: string | symbol) {
                          if (typeof methodProp === 'string') {
                              return async (...args: unknown[]) => {
                                  return target.call(moduleName, methodProp, ...args);
                              };
                          }
                          return undefined;
                      }
                  });
                  moduleProxyCache.set(moduleName, moduleProxy as Record<string, (...args: unknown[]) => Promise<unknown>>);
              }
              
              return moduleProxyCache.get(moduleName);
          }

          return undefined;
      }
  }) as unknown as TypedHostClient;
}

/**
* 创建 HostClient 实例
* @param iframe 目标 iframe 元素
* @param targetOrigin 目标域（可选，默认为 '*'）
* @returns 带类型约束的客户端实例
*/
export function createHostClient(iframe: HTMLIFrameElement, targetOrigin?: string): TypedHostClient {
  const client = new HostClient(iframe, targetOrigin);
  return createProxy(client);
}

/**
* 异步创建客户端
* @param iframe 目标 iframe 元素
* @param targetOrigin 目标域（可选，默认为 '*'）
* @returns Promise<带类型约束的客户端实例>
*/
export async function createHostClientAsync(iframe: HTMLIFrameElement, targetOrigin?: string): Promise<TypedHostClient> {
  const client = new HostClient(iframe, targetOrigin);
  // 等待初始化完成
  await client.readyPromise;
  return createProxy(client);
}

// =============================================================================
// 开发工具和调试信息
// =============================================================================

// 在开发环境中添加调试工具
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  (window as unknown as { __HOST_CLIENT__: unknown }).__HOST_CLIENT__ = {
      createHostClient,
      createHostClientAsync,
      HostClient,
      HOST_SDK_EVENT,
      HOST_CLIENT_VERSION
  };
  
  console.log(
      '%c HostClient %c v' + HOST_CLIENT_VERSION + '\n' +
      'Use window.__HOST_CLIENT__.createHostClient(iframe) to create client\n' +
      'Protocol event: ' + HOST_SDK_EVENT,
      'background:#2196F3;color:white;padding:4px;border-radius:4px;',
      'font-weight:bold;'
  );
}

// =============================================================================
// 版本和兼容性信息
// =============================================================================

/**
* HostClient 版本信息
*/
export const VERSION_INFO = {
  clientVersion: HOST_CLIENT_VERSION,
  protocolEvent: HOST_SDK_EVENT,
  compatible: {
      hostSDK: '1.0.0+',
      typescript: '4.0.0+',
      browsers: ['Chrome 80+', 'Firefox 75+', 'Safari 13+', 'Edge 80+']
  }
} as const;
