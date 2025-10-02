# HostClient - Standalone Usage Guide

## 📦 Copy as a Single File

The `HostClient.ts` file can be copied directly into other projects. It contains everything you need:

- ✅ Standard message protocol definitions (`HOST_SDK_EVENT`, `HostRequest`, `HostResponse`)
- ✅ Complete type definitions (`TypedHostClient`, `AuthStatus`, `UserInfo`, etc.)
- ✅ Core client implementation (`HostClient` class)
- ✅ Proxy and factory helpers (`createHostClient`, `createHostClientAsync`)
- ✅ Debug tools and version info

## 🚀 Quick Start

### 1) Copy the file

```bash
# Only this one file is required
cp HostClient.ts your-project/lib/
```

### 2) Basic usage

```typescript
import { createHostClient, TypedHostClient } from './lib/HostClient';

// Create client instance
const iframe = document.getElementById('app-iframe') as HTMLIFrameElement;
const client: TypedHostClient = createHostClient(iframe);

// Wait for initialization
await client.readyPromise;

// Modular API (recommended)
const version = await client.base.getVersion();
const authStatus = await client.auth.getAuthStatus();
const appsList = await client.apps.getAppsList({ page: 1, limit: 10 });

// Or manual calls
const userInfo = await client.call('auth', 'getUserInfo');
const app = await client.call('apps', 'getAppById', 'app-id-123');
```

### 3) Security

```typescript
// Specify a trusted origin to prevent cross-origin issues
const client = createHostClient(iframe, 'https://trusted-app-domain.com');
```

### 4) Error handling

```typescript
try {
  // Auth
  const result = await client.auth.triggerLogin();
  if (result.success) {
    console.log('Login successful');
  } else {
    console.error('Login failed:', result.error);
  }

  // App management
  const createResult = await client.apps.createApp({
    name: 'My App',
    code: 'console.log("Hello World");',
    version: '1.0.0',
    unique_id: crypto.randomUUID()
  });

  if (createResult.success) {
    console.log('App created:', createResult.data);
  } else {
    console.error('App creation failed:', createResult.message);
  }
} catch (error) {
  console.error('Call failed:', error);
}
```

### 5) Status check

```typescript
// Check if client is ready
if (client.isClientReady()) {
  // Verify HostSDK initialization
  const initStatus = await client.checkSDKInitialization();
  if (initStatus.initialized) {
    console.log('SDK version:', initStatus.version);
  } else {
    console.error('SDK not initialized:', initStatus.error);
  }
}
```

### 6) Cleanup

```typescript
// Clean up on unmount or page leave
client.destroy();
```

## 🔧 API Options

### createHostClient(iframe, targetOrigin?)

- `iframe`: target iframe element
- `targetOrigin` (optional): expected origin, default `'*'`

### createHostClientAsync(iframe, targetOrigin?)

- Async version returning a Promise
- Resolves after initialization completes

## 📋 Available APIs

### Base (client.base)

- `getVersion()`: get SDK version

### Auth (client.auth)

- `getAuthStatus()`: get auth status
- `getUserInfo()`: get current user info
- `triggerLogin()`: trigger login flow
- `logout()`: logout
- `getAppState()`: get aggregated app state

### Apps (client.apps)

- `createApp(request)`: create app
- `getAppById(appId, isFork?)`: get app by ID
- `getAppByUniqueId(uniqueId)`: get app by unique_id
- `updateApp(appId, request)`: update app
- `getAppCode(appId)`: get app source code
- `getAppBuildCode(appId)`: get app build code
- `deleteApp(appId)`: delete app
- `getAppsList(request?)`: list apps
- `validateCreateAppRequest(request)`: validate create request

### Client methods

- `call(module, method, ...params)`: manual call
- `isClientReady()`: ready state
- `checkSDKInitialization()`: check SDK init status
- `getCapabilities()`: get available capabilities
- `destroy()`: destroy client

## 🛡️ Security Notes

1. Set `targetOrigin` instead of using `'*'` in production
2. Validate response formats and contents
3. Handle network errors and timeouts
4. Always clean up by calling `destroy()`

## 🐛 Debugging

In development, HostClient registers debug helpers:

```javascript
// In the browser console
window.__HOST_CLIENT__.createHostClient(iframe);
window.__HOST_CLIENT__.HOST_SDK_EVENT; // protocol event name
window.__HOST_CLIENT__.HOST_CLIENT_VERSION; // client version
```

## 📄 Version Compatibility

- **HostClient**: v1.0.0+
- **HostSDK**: v1.0.0+
- **TypeScript**: v4.0.0+
- **Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## 🚀 Full Example

### End-to-end app management

```typescript
import { createHostClient, TypedHostClient } from './lib/HostClient';

async function appManagementExample() {
  // 1. Create client
  const iframe = document.getElementById('app-iframe') as HTMLIFrameElement;
  const client: TypedHostClient = createHostClient(iframe, 'https://trusted-domain.com');

  // 2. Wait for init
  await client.readyPromise;

  try {
    // 3. Create app
    const createResult = await client.apps.createApp({
      name: 'Sample App',
      code: 'console.log("Hello from my app!");',
      version: '1.0.0',
      unique_id: crypto.randomUUID(),
      desc: 'This is a sample app',
      visible: true,
      icon: 'https://example.com/icon.png',
      color: '#007bff'
    });

    if (!createResult.success) {
      throw new Error(createResult.message);
    }

    const appId = createResult.data!.id;
    console.log('App created:', appId);

    // 4. Get app info
    const appInfo = await client.apps.getAppById(appId);
    console.log('App info:', appInfo.data);

    // 5. Update app
    const updateResult = await client.apps.updateApp(appId, {
      desc: 'Updated description',
      version: '1.0.1'
    });
    console.log('Update result:', updateResult);

    // 6. Get app code
    const codeResult = await client.apps.getAppCode(appId);
    console.log('App code:', codeResult.data?.code);

    // 7. List apps
    const listResult = await client.apps.getAppsList({
      page: 1,
      limit: 10,
      visible: true,
      search: 'sample'
    });
    console.log('Apps:', listResult.data);
    console.log('Pagination:', listResult.pagination);

    // 8. Validation example
    const validation = await client.apps.validateCreateAppRequest({
      name: 'Test App',
      code: 'console.log("test");',
      version: '1.0.0',
      unique_id: 'invalid-uuid' // will fail
    });

    if (!validation.valid) {
      console.log('Validation failed:', validation.errors);
    }

  } catch (error) {
    console.error('App management failed:', error);
  } finally {
    // 9. Cleanup
    client.destroy();
  }
}

// Run example
appManagementExample();
```

### Auth + App management

```typescript
async function authAndAppExample() {
  const client = createHostClient(iframe);
  await client.readyPromise;

  // Check auth
  const authStatus = await client.auth.getAuthStatus();
  if (!authStatus.isAuthenticated) {
    const loginResult = await client.auth.triggerLogin();
    if (!loginResult.success) {
      console.error('Login failed');
      return;
    }
  }

  // Get user info
  const userInfo = await client.auth.getUserInfo();
  console.log('Current user:', userInfo);

  // Get user apps
  const userApps = await client.apps.getAppsList({
    page: 1,
    limit: 20
  });

  console.log(`Apps of ${userInfo?.email}:`, userApps.data);
}
```

## 🔗 Protocol

HostClient uses the standard `postMessage` protocol to communicate with the embedded app:

- **Event name**: `'HOSTSDK_MESSAGE'`
- **Message format**: includes `requestId`, `module`, `method`, `params`, etc.
- **Timeout**: 30 seconds
- **Retry**: up to 5 times when establishing connection

### Supported modules

- **base**: base capabilities
- **auth**: authentication
- **apps**: app management
