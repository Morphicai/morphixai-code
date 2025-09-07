import React, { useState, useEffect } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText,
    IonNote,
    IonToast,
    IonList
} from '@ionic/react';
import {
    close,
    settings,
    checkmark,
    warning,
    information
} from 'ionicons/icons';
import {
    getCurrentModel,
    setCurrentModel,
    getAvailableModels,
    getTemperature,
    setTemperature,
    isAIServiceAvailable,
    getAIServiceStatus
} from '../services/aiService';
import styles from '../styles/AIConfig.module.css';
import { reportError } from '@morphixai/lib';

const AIConfig = ({ isOpen, onDidDismiss }) => {
    const [currentModel, setCurrentModelState] = useState('openai/gpt-4o');
    const [models, setModels] = useState([]);
    const [temperature, setTemperatureState] = useState(0.8);
    const [serviceStatus, setServiceStatus] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('success');

    useEffect(() => {
        if (isOpen) {
            try {
                // 获取当前配置
                const model = getCurrentModel();
                const temp = getTemperature();
                const status = getAIServiceStatus();
                const availableModels = getAvailableModels();
                
                setCurrentModelState(model);
                setTemperatureState(temp);
                setServiceStatus(status);
                setModels(availableModels);
            } catch (error) {
                reportError(error, 'JavaScriptError', {
                    component: 'AIConfig',
                    action: 'loadConfiguration'
                });
                showToastMessage('加载配置失败', 'danger');
            }
        }
    }, [isOpen]);

    const handleModelChange = (model) => {
        setCurrentModelState(model);
        setCurrentModel(model);
        showToastMessage('AI模型已更新', 'success');
    };

    const handleTemperatureChange = (temp) => {
        const temperature = parseFloat(temp);
        setTemperatureState(temperature);
        setTemperature(temperature);
        showToastMessage(`创造性已设置为 ${temperature}`, 'success');
    };

    const showToastMessage = (message, color = 'success') => {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    };

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>AI服务配置</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={onDidDismiss}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                
                <IonContent className={styles.content}>
                    {/* 服务状态 */}
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>AI服务状态</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonItem>
                                <IonIcon 
                                    icon={serviceStatus.available ? checkmark : warning} 
                                    color={serviceStatus.available ? 'success' : 'warning'} 
                                    slot="start"
                                />
                                <IonLabel>
                                    <h3>AppSDK AI服务</h3>
                                    <p>{serviceStatus.available ? '服务可用' : '服务不可用'}</p>
                                </IonLabel>
                            </IonItem>
                        </IonCardContent>
                    </IonCard>

                    {/* AI模型选择 */}
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>AI模型设置</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonItem>
                                <IonLabel>选择AI模型</IonLabel>
                                <IonSelect
                                    value={currentModel}
                                    onIonChange={e => handleModelChange(e.detail.value)}
                                >
                                    {models.map(model => (
                                        <IonSelectOption key={model.id} value={model.id}>
                                            {model.name} ({model.provider})
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            
                            <IonItem>
                                <IonLabel position="stacked">
                                    创造性 ({temperature})
                                    <p>控制AI回复的随机性，0-1之间，数值越高越有创意</p>
                                </IonLabel>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={temperature}
                                    onChange={e => handleTemperatureChange(e.target.value)}
                                    className={styles.temperatureSlider}
                                />
                            </IonItem>
                        </IonCardContent>
                    </IonCard>


                    {/* 使用说明 */}
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>关于AppSDK AI</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonText>
                                <p>• <strong>无需配置：</strong>使用MorphixAI平台内置的AI服务，无需额外配置API密钥</p>
                                <p>• <strong>多模型支持：</strong>支持GPT-4o和Claude 3.7等先进AI模型</p>
                                <p>• <strong>视觉理解：</strong>AI能够理解图片内容并结合心情生成诗歌</p>
                                <p>• <strong>安全可靠：</strong>所有AI调用都通过平台安全通道进行</p>
                                <p>• <strong>即时可用：</strong>AppSDK在任何环境中都可以直接使用</p>
                            </IonText>
                        </IonCardContent>
                    </IonCard>
                </IonContent>
            </IonModal>

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                color={toastColor}
                position="top"
            />
        </>
    );
};

export default AIConfig;
