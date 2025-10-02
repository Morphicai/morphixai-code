/**
 * 文件监听和热重载工具
 * 用于监听 apps/ 目录下的文件变更，并触发应用重新加载
 */

class FileWatcher {
    constructor() {
        this.watchers = new Map();
        this.lastModified = new Map();
        this.callbacks = new Set();
        this.isWatching = false;
        this.watchInterval = null;
        
        // 默认配置
        this.config = {
            // 监听间隔（毫秒）
            interval: 1000,
            // 要监听的文件扩展名
            extensions: ['.jsx', '.js', '.css', '.json'],
            // 要监听的目录
            watchPaths: ['./src/app/'],
            // 忽略的文件/目录
            ignore: ['node_modules', '.git', 'dist', 'build']
        };
    }

    /**
     * 开始监听文件变更
     */
    startWatching() {
        if (this.isWatching) {
            console.log('File watcher is already running');
            return;
        }

        console.log('Starting file watcher...');
        this.isWatching = true;
        
        // 初始化文件时间戳
        this.initializeFileTimestamps();
        
        // 启动定时检查
        this.watchInterval = setInterval(() => {
            this.checkForChanges();
        }, this.config.interval);
        
        console.log(`File watcher started, checking every ${this.config.interval}ms`);
    }

    /**
     * 停止监听
     */
    stopWatching() {
        if (!this.isWatching) return;
        
        console.log('Stopping file watcher...');
        this.isWatching = false;
        
        if (this.watchInterval) {
            clearInterval(this.watchInterval);
            this.watchInterval = null;
        }
        
        console.log('File watcher stopped');
    }

    /**
     * 添加变更回调
     */
    addChangeCallback(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

    /**
     * 移除变更回调
     */
    removeChangeCallback(callback) {
        this.callbacks.delete(callback);
    }

    /**
     * 触发变更事件
     */
    triggerChange(changedFiles) {
        console.log('Files changed:', changedFiles);
        
        this.callbacks.forEach(callback => {
            try {
                callback(changedFiles);
            } catch (error) {
                console.error('Error in file change callback:', error);
            }
        });
    }

    /**
     * 初始化文件时间戳（模拟）
     * 在真实环境中，这里会读取实际的文件系统
     */
    async initializeFileTimestamps() {
        try {
            // 模拟获取文件列表和时间戳
            const files = await this.getWatchedFiles();
            
            for (const file of files) {
                this.lastModified.set(file, Date.now());
            }
            
            console.log(`Initialized timestamps for ${files.length} files`);
        } catch (error) {
            console.error('Error initializing file timestamps:', error);
        }
    }

    /**
     * 检查文件变更（模拟）
     * 在真实环境中，这里会检查实际的文件系统
     */
    async checkForChanges() {
        try {
            const files = await this.getWatchedFiles();
            const changedFiles = [];
            
            for (const file of files) {
                const currentTime = Date.now();
                const lastTime = this.lastModified.get(file) || 0;
                
                // 模拟文件变更检测
                // 在实际应用中，这里会检查文件的实际修改时间
                if (this.shouldSimulateChange(file)) {
                    changedFiles.push({
                        path: file,
                        lastModified: currentTime,
                        type: 'modified'
                    });
                    this.lastModified.set(file, currentTime);
                }
            }
            
            if (changedFiles.length > 0) {
                this.triggerChange(changedFiles);
            }
        } catch (error) {
            console.error('Error checking for file changes:', error);
        }
    }

    /**
     * 获取需要监听的文件列表（模拟）
     */
    async getWatchedFiles() {
        // 模拟文件列表
        return [
            'apps/app.jsx',
            'apps/components/SimpleCounter.jsx',
            'apps/styles/App.module.css',
            'apps/styles/SimpleCounter.module.css'
        ];
    }

    /**
     * 模拟文件变更（用于演示）
     */
    shouldSimulateChange(file) {
        // 随机模拟文件变更，用于演示
        // 在实际应用中，这个方法不需要
        return Math.random() < 0.01; // 1% 概率模拟变更
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('File watcher config updated:', this.config);
    }

    /**
     * 获取监听状态
     */
    getStatus() {
        return {
            isWatching: this.isWatching,
            watchedFiles: this.lastModified.size,
            callbacks: this.callbacks.size,
            config: this.config
        };
    }
}

// 创建全局实例
const fileWatcher = new FileWatcher();

// 导出实例和类
export default fileWatcher;
export { FileWatcher };

// 便捷的 Hook 用于 React 组件
export function useFileWatcher(callback, autoStart = true) {
    const callbackRef = React.useRef(callback);
    callbackRef.current = callback;
    
    React.useEffect(() => {
        const wrappedCallback = (...args) => callbackRef.current?.(...args);
        
        // 添加回调
        const removeCallback = fileWatcher.addChangeCallback(wrappedCallback);
        
        // 自动启动监听
        if (autoStart && !fileWatcher.isWatching) {
            fileWatcher.startWatching();
        }
        
        return () => {
            removeCallback();
            // 如果没有其他回调，停止监听
            if (fileWatcher.callbacks.size === 0) {
                fileWatcher.stopWatching();
            }
        };
    }, [autoStart]);
    
    return {
        start: () => fileWatcher.startWatching(),
        stop: () => fileWatcher.stopWatching(),
        status: fileWatcher.getStatus()
    };
}
