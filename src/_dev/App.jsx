import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { IonPage, IonContent, IonButton, IonText } from '@ionic/react';
import AppShellIframe from './components/AppShellIframe';
import DevControlPanel from './components/DevControlPanel.jsx';
import styles from './styles/App.module.css';
import { getProjectIdWithWarning } from './utils/projectId.js';
import { APP_SHELL_CONFIG } from './config/appShellConfig.js';

export default function App() {
    const [projectInfo, setProjectInfo] = useState({ id: 'loading...', hasWarning: false });
    const appShellRef = useRef(null);
    const [hostClient, setHostClient] = useState(null);
    const [hostClientReady, setHostClientReady] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(true);

    useEffect(() => {
        // 获取项目 ID
        async function loadProjectId() {
            const info = await getProjectIdWithWarning();
            setProjectInfo(info);
            
            if (info.hasWarning) {
                console.warn(info.warningMessage);
            } else {
                console.log('项目 ID:', info.id);
            }
        }
        
        loadProjectId();
    }, []);

    // App Shell 事件处理
    const handleAppLoad = (data) => {
        console.log('App loaded in iframe:', data);
    };

    const handleAppError = (error) => {
        console.error('App error in iframe:', error);
    };

    const handleAppUpdate = (data) => {
        console.log('App updated in iframe:', data);
    };

    const handleHostClientReady = useCallback((client) => {
        setHostClient(client);
        setHostClientReady(true);
    }, []);

    const getPreviewUrl = useCallback(() => {
        const baseUrl = true ? APP_SHELL_CONFIG.devBaseUrl : APP_SHELL_CONFIG.baseUrl;
        // 使用最新时间戳避免缓存
        return `${baseUrl}/app-runner/${projectInfo.id}?t=${Date.now()}`;
    }, [projectInfo.id]);

    // 如果有警告，显示提示界面
    if (projectInfo.hasWarning) {
        return (
            <IonPage>
                <IonContent className={styles.content}>
                    <div style={{ 
                        padding: '2rem', 
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '1rem'
                    }}>
                        <IonText color="warning">
                            <h2>⚠️ 项目 ID 未找到</h2>
                        </IonText>
                        <IonText>
                            <p>{projectInfo.warningMessage}</p>
                        </IonText>
                        <IonButton onClick={() => {
                            console.log('请在终端运行: npm run generate-id');
                            setTimeout(() => window.location.reload(), 100);
                        }} color="primary">
                            🔄 刷新检查
                        </IonButton>
                        <IonText color="medium">
                            <small>在终端运行 <code>npm run generate-id</code> 后点击刷新</small>
                        </IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonContent className={styles.content}>
                {/* 顶部项目ID显示 */}
                <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    fontSize: '12px', 
                    color: '#666',
                    zIndex: 1000,
                    background: 'rgba(255,255,255,0.9)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                }}>
                    项目 ID: {projectInfo.id}
                </div>

                {/* 桌面端：左右分栏；移动端：仅展示 iframe */}
                <div className={styles.splitLayout}>
                    {/* 左侧手机预览容器（桌面可见） */}
                    <div className={styles.devicePreview}>
                        <div className={styles.phoneFrame}>
                            <div className={styles.phoneScreen}>
                                <AppShellIframe
                                    ref={appShellRef}
                                    appId={projectInfo.id}
                                    isDev={true}
                                    onHostClientReady={handleHostClientReady}
                                    onAppLoad={handleAppLoad}
                                    onAppError={handleAppError}
                                    onAppUpdate={handleAppUpdate}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 右侧控制面板（桌面可见，始终展示） */}
                    <div className={styles.controlPanelWrapper}>
                        <DevControlPanel
                            appId={projectInfo.id}
                            isDev={true}
                            hostClient={hostClient}
                            hostClientReady={hostClientReady}
                            getPreviewUrl={getPreviewUrl}
                        />
                    </div>
                </div>


                {/* 移动端：全屏显示 iframe */}
                <div className={styles.mobileOnly}>
                    <AppShellIframe
                        appId={projectInfo.id}
                        isDev={true}
                        onHostClientReady={handleHostClientReady}
                        onAppLoad={handleAppLoad}
                        onAppError={handleAppError}
                        onAppUpdate={handleAppUpdate}
                    />
                </div>

                {/* 移动端：右侧可折叠控制面板（默认展开） */}
                <div className={styles.mobileDrawerOverlay}>
                    <div className={`${styles.mobileDrawer} ${isMobileDrawerOpen ? '' : 'hidden'}`}>
                        <div
                            className={styles.mobileDrawerHandle}
                            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                            role="button"
                            aria-label="Toggle control panel"
                        >
                            {isMobileDrawerOpen ? '>' : '<'}
                        </div>
                        <div style={{ padding: '12px' }}>
                            <DevControlPanel
                                appId={projectInfo.id}
                                isDev={true}
                                hostClient={hostClient}
                                hostClientReady={hostClientReady}
                                getPreviewUrl={getPreviewUrl}
                            />
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}
