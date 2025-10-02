import React, { useRef, useState, useCallback } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList } from '@ionic/react';
import AppShellIframe from '../components/AppShellIframe.jsx';

/**
 * HostClient example component
 * Demonstrates using AppShellIframe integrated with HostClient
 */
export default function HostClientExample() {
    const appShellRef = useRef(null);
    const [hostClient, setHostClient] = useState(null);
    const [capabilities, setCapabilities] = useState({});
    const [callResults, setCallResults] = useState([]);

    // Callback when HostClient is ready
    const handleHostClientReady = useCallback((client) => {
        console.log('🎉 HostClient is ready!');
        setHostClient(client);
        setCapabilities(client.getCapabilities());
    }, []);

    // Example: call a method in iframe
    const callIframeMethod = useCallback(async (method, ...params) => {
        if (!hostClient) {
            alert('HostClient is not ready');
            return;
        }

        try {
            console.log(`📤 Calling method: ${method}`, params);
            const result = await hostClient.call(method, ...params);
            console.log(`📥 Result:`, result);
            
            // 记录调用结果
            setCallResults(prev => [{
                method,
                params,
                result,
                timestamp: new Date().toLocaleTimeString(),
                success: true
            }, ...prev.slice(0, 9)]); // 保留最近 10 条记录
            
            return result;
        } catch (error) {
            console.error(`❌ Call failed:`, error);
            
            // 记录错误
            setCallResults(prev => [{
                method,
                params,
                error: error.message,
                timestamp: new Date().toLocaleTimeString(),
                success: false
            }, ...prev.slice(0, 9)]);
            
            alert(`Call failed: ${error.message}`);
        }
    }, [hostClient]);

    // Example method calls
    const exampleCalls = [
        {
            name: 'Get App Info',
            method: 'getAppInfo',
            params: []
        },
        {
            name: 'Get User Data',
            method: 'getUserData',
            params: []
        },
        {
            name: 'Set Theme',
            method: 'setTheme',
            params: ['dark']
        },
        {
            name: 'Show Toast',
            method: 'showToast',
            params: ['Hello from Host!', 'success']
        },
        {
            name: 'Get Device Info',
            method: 'getDeviceInfo',
            params: []
        }
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Control panel */}
            <div style={{ 
                position: 'fixed', 
                top: '20px', 
                left: '20px', 
                zIndex: 1002, 
                width: '400px',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>HostClient Control Panel</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {/* Connection status */}
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Status: </strong>
                            <span style={{ 
                                color: hostClient ? '#22c55e' : '#ef4444',
                                fontWeight: 'bold'
                            }}>
                                {hostClient ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        {/* Capabilities */}
                        {Object.keys(capabilities).length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Capabilities:</strong>
                                <pre style={{ 
                                    fontSize: '11px', 
                                    background: '#f5f5f5', 
                                    padding: '8px', 
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    maxHeight: '100px'
                                }}>
                                    {JSON.stringify(capabilities, null, 2)}
                                </pre>
                            </div>
                        )}

                        {/* Example method calls */}
                        <div style={{ marginBottom: '16px' }}>
                            <strong>Examples:</strong>
                            <div style={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
                                {exampleCalls.map((call, index) => (
                                    <IonButton
                                        key={index}
                                        size="small"
                                        fill="outline"
                                        disabled={!hostClient}
                                        onClick={() => callIframeMethod(call.method, ...call.params)}
                                    >
                                        {call.name}
                                    </IonButton>
                                ))}
                            </div>
                        </div>

                        {/* Call history */}
                        {callResults.length > 0 && (
                            <div>
                                <strong>Call History:</strong>
                                <IonList style={{ marginTop: '8px' }}>
                                    {callResults.map((result, index) => (
                                        <IonItem key={index}>
                                            <IonLabel>
                                                <h3 style={{ 
                                                    color: result.success ? '#22c55e' : '#ef4444',
                                                    fontSize: '12px'
                                                }}>
                                                    {result.method}
                                                    <span style={{ 
                                                        color: '#666', 
                                                        fontSize: '10px',
                                                        marginLeft: '8px'
                                                    }}>
                                                        {result.timestamp}
                                                    </span>
                                                </h3>
                                                <pre style={{ 
                                                    fontSize: '10px',
                                                    margin: '4px 0 0 0',
                                                    color: '#666',
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-all'
                                                }}>
                                                    {result.success 
                                                        ? `✅ ${JSON.stringify(result.result)}` 
                                                        : `❌ ${result.error}`
                                                    }
                                                </pre>
                                            </IonLabel>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </div>
                        )}

                        {/* Manual actions */}
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                            <IonButton
                                size="small"
                                fill="clear"
                                onClick={() => {
                                    if (appShellRef.current) {
                                        appShellRef.current.reload();
                                    }
                                }}
                            >
                                Reload iframe
                            </IonButton>
                            
                            <IonButton
                                size="small"
                                fill="clear"
                                onClick={() => {
                                    setCallResults([]);
                                }}
                            >
                                Clear history
                            </IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>

            {/* AppShell Iframe */}
            <AppShellIframe
                ref={appShellRef}
                appId="demo-app"
                isDev={true}
                onHostClientReady={handleHostClientReady}
                onAppLoad={(data) => {
                    console.log('📱 App loaded:', data);
                }}
                onAppError={(error) => {
                    console.error('❌ App load error:', error);
                }}
            />
        </div>
    );
}
