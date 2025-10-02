import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useMemo,
    useImperativeHandle,
    forwardRef,
} from 'react';
import { IonLoading, IonToast } from '@ionic/react';
import styles from '../styles/AppShellIframe.module.css';
import initialAppFiles from '../app-files.js';
import { APP_SHELL_CONFIG } from '../config/appShellConfig.js';
import { createHostClientAsync } from '../lib/hostClient.ts';

/**
 * Simplified AppShell Iframe component
 * Core features:
 * 1. Embed iframe
 * 2. Basic messaging
 * 3. HostClient integration
 */
const AppShellIframe = forwardRef(function AppShellIframe(
    {
        appId = APP_SHELL_CONFIG.defaultAppId,
        isDev = true,
        onAppLoad,
        onAppError,
        onHostClientReady,
    },
    ref
) {
    const iframeRef = useRef(null);
    const hostClientRef = useRef(null);

    // Basic state
    const [error, setError] = useState(null);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [hostClientReady, setHostClientReady] = useState(false);
    const [appFiles, setAppFiles] = useState(initialAppFiles);
    // iframe URL
    const iframeUrl = useMemo(() => {
        const baseUrl = isDev
            ? APP_SHELL_CONFIG.devBaseUrl
            : APP_SHELL_CONFIG.baseUrl;
        return `${baseUrl}/app-runner/${appId}?t=${lastUpdateTime}`;
    }, [appId, isDev, lastUpdateTime]);

    // Initialize HostClient (simplified)
    const initializeHostClient = useCallback(async () => {
        if (!iframeRef.current || hostClientRef.current) return;

        try {
            console.log('HostClient initialization start:', iframeRef.current);
            const client = await createHostClientAsync(iframeRef.current);
            console.log('HostClient initialized successfully:', client);
            hostClientRef.current = client;
            setHostClientReady(true);
           
            onHostClientReady?.(client);
        } catch (error) {
            console.error('HostClient initialization failed:', error);
            setError(error.message);
        }
    }, [onHostClientReady]);

    // Destroy HostClient
    const destroyHostClient = useCallback(() => {
        if (hostClientRef.current) {
            hostClientRef.current.destroy();
            hostClientRef.current = null;
            setHostClientReady(false);
        }
    }, []);

    // Reload
    const handleReload = useCallback(() => {
        setError(null);
        destroyHostClient();
        setLastUpdateTime(Date.now());
    }, [destroyHostClient]);

    // Send file update message to iframe
    const sendFileUpdateMessage = useCallback(
        (targetAppId = '*') => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                const message = {
                    type: 'BAIBIAN_APP_FILE_UPDATE',
                    targetAppId: targetAppId,
                    timestamp: Date.now(),
                };

                const targetOrigin = isDev
                    ? APP_SHELL_CONFIG.devBaseUrl
                    : APP_SHELL_CONFIG.baseUrl;

                iframeRef.current.contentWindow.postMessage(
                    message,
                    targetOrigin
                );
                console.log('🔄 Sent file update message to iframe:', message);

                // 显示提示
                setToastMessage('Code updated, notifying app to reload...');
                setShowToast(true);
            }
        },
        [isDev]
    );
    // Message handling (simplified)
    const handleMessage = useCallback(
        (event) => {
            try {
                const data =
                    typeof event.data === 'string'
                        ? JSON.parse(event.data)
                        : event.data;
                const eventName = data.event || data.type;

                switch (eventName) {
                    case 'BAIBIAN_APP_READY':
                        setError(null);
                        onAppLoad?.(data);
                        break;
                    case 'BAIBIAN_APP_ERROR':
                        setError(data.error || data.message || 'Failed to load the app');
                        onAppError?.(data.error || data.message);
                        break;
                    case 'GET_APP_FILES_REQUEST':
                        // Return files directly
                        console.log('appFiles', appFiles);
                        if (event.source?.postMessage) {
                            event.source.postMessage(
                                {
                                    event: 'GET_APP_FILES_RESPONSE',
                                    files: appFiles,
                                    timestamp: Date.now(),
                                    source: 'morphixai-template',
                                },
                                event.origin
                            );
                        }
                        break;
                }
            } catch (err) {
                console.error('Message parsing error:', err);
            }
        },
        [onAppLoad, onAppError, appFiles]
    );

    // iframe load handling
    const handleIframeLoad = useCallback(() => {
        setError(null);
        // 简单延迟后初始化
        setTimeout(() => initializeHostClient(), 300);
    }, [initializeHostClient]);

    const handleIframeError = useCallback(() => {
        setError('Unable to load App Shell');
    }, []);

    // HMR support (simplified)
    useEffect(() => {
        let dispose;
        if (import.meta.hot) {
            dispose = import.meta.hot.accept('../app-files.js', (newModule) => {
                console.log('newModule', newModule);
                setAppFiles(newModule.default);
                sendFileUpdateMessage();
                // handleReload();
            });
        }
        return () => dispose?.();
    }, []);

    // Event listeners
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    // Cleanup on unmount
    useEffect(() => {
        return () => destroyHostClient();
    }, [destroyHostClient]);

    // Expose simplified API
    useImperativeHandle(
        ref,
        () => ({
            getHostClient: () => hostClientRef.current,
            isHostClientReady: () => hostClientReady,
            reload: handleReload,
            getIframe: () => iframeRef.current,
            // Basic API calls
            call: async (module, method, ...params) => {
                if (!hostClientRef.current) {
                    throw new Error('HostClient is not initialized');
                }
                return hostClientRef.current.call(module, method, ...params);
            },
        }),
        [hostClientReady, handleReload]
    );

    // 使用 useMemo 优化 iframe 渲染，避免不必要的重新渲染
    const iframeElement = useMemo(() => (
        <iframe
            ref={iframeRef}
            src={iframeUrl}
            className={styles.iframe}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={`MorphixAI App: ${appId}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-storage-access-by-user-activation"
            allow="camera; microphone; geolocation; clipboard-read; clipboard-write"
        />
    ), [iframeUrl, handleIframeLoad, handleIframeError, appId]);

    return (
        <div className={styles.container}>
            <div className={styles.iframeWrapper}>
                {iframeElement}



                {/* Simplified error display */}
                {error && (
                    <div className={styles.errorOverlay}>
                        <div className={styles.errorMessage}>
                            {error}
                            <button onClick={handleReload}>Retry</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast notification */}
            <IonToast
                isOpen={showToast}
                message={toastMessage}
                duration={2000}
                onDidDismiss={() => setShowToast(false)}
                position="top"
                color="primary"
            />
        </div>
    );
});

export default AppShellIframe;
