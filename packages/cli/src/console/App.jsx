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

    useEffect(() => {
        // Get project ID
        async function loadProjectId() {
            const info = await getProjectIdWithWarning();
            setProjectInfo(info);
            
            if (info.hasWarning) {
                console.warn(info.warningMessage);
            } else {
                console.log('Project ID:', info.id);
            }
        }
        
        loadProjectId();
    }, []);

    // App Shell event handlers
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

    // If there's a warning, show guidance UI
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
                            <h2>⚠️ Project ID Not Found</h2>
                        </IonText>
                        <IonText>
                            <p>{projectInfo.warningMessage}</p>
                        </IonText>
                        <IonButton onClick={() => {
                            console.log('Please run in terminal: npm run generate-id');
                            setTimeout(() => window.location.reload(), 100);
                        }} color="primary">
                            🔄 Refresh & Check
                        </IonButton>
                        <IonText color="medium">
                            <small>Run <code>npm run generate-id</code> in terminal, then click refresh</small>
                        </IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    // 创建单一的 AppShellIframe 实例，避免重复创建
    const appShellIframe = useMemo(() => (
        <AppShellIframe
            ref={appShellRef}
            appId={projectInfo.id}
            isDev={true}
            onHostClientReady={handleHostClientReady}
            onAppLoad={handleAppLoad}
            onAppError={handleAppError}
            onAppUpdate={handleAppUpdate}
        />
    ), [projectInfo.id, handleHostClientReady]);

    return (
        <IonPage>
            <IonContent className={styles.content}>

                {/* Desktop: split layout */}
                <div className={styles.splitLayout}>
                    {/* Left: phone preview */}
                    <div className={styles.devicePreview}>
                        <div className={styles.phoneFrame}>
                            <div className={styles.phoneScreen}>
                                {appShellIframe}
                            </div>
                        </div>
                    </div>

                    {/* Right: control panel */}
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
            </IonContent>
        </IonPage>
    );
}
