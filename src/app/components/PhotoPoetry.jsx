import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonSelect, 
    IonSelectOption,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonAlert,
    IonFab,
    IonFabButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonActionSheet
} from '@ionic/react';
import { 
    camera, 
    heart, 
    happy, 
    sad, 
    thunderstorm, 
    sunny, 
    leaf,
    time,
    bookmarks,
    close,
    refresh,
    images,
    cameraOutline,
    imagesOutline,
    settings,
    warning
} from 'ionicons/icons';
import styles from '../styles/PhotoPoetry.module.css';
import AIConfig from './AIConfig';
import { generatePoetryWithAI, isAIServiceAvailable } from '../services/aiService';
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';

const PhotoPoetry = () => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [selectedMood, setSelectedMood] = useState('');
    const [generatedPoem, setGeneratedPoem] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showAIConfig, setShowAIConfig] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasValidApiKey, setHasValidApiKey] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // 检测深色模式
    useEffect(() => {
        const checkDarkMode = () => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const ionicDark = document.body.classList.contains('dark');
            setIsDarkMode(prefersDark || ionicDark);
        };
        
        checkDarkMode();
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkDarkMode);
        
        // 监听Ionic的深色模式变化
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        
        return () => {
            mediaQuery.removeEventListener('change', checkDarkMode);
            observer.disconnect();
        };
    }, []);

    // 检查AI服务是否可用
    useEffect(() => {
        const checkAIService = () => {
            const available = isAIServiceAvailable();
            setHasValidApiKey(available);
        };
        
        checkAIService();
        
        // 定期检查服务状态
        const interval = setInterval(checkAIService, 5000);
        
        return () => clearInterval(interval);
    }, [showAIConfig]); // 当AI配置窗口关闭时重新检查

    // 心情选项
    const moodOptions = [
        { value: 'happy', label: '快乐', icon: happy, color: '#ffd700' },
        { value: 'sad', label: '忧伤', icon: sad, color: '#4682b4' },
        { value: 'romantic', label: '浪漫', icon: heart, color: '#ff69b4' },
        { value: 'peaceful', label: '宁静', icon: leaf, color: '#32cd32' },
        { value: 'energetic', label: '活力', icon: sunny, color: '#ff4500' },
        { value: 'mysterious', label: '神秘', icon: thunderstorm, color: '#9370db' }
    ];

    // 显示选择操作表
    const handleImageSelection = useCallback(() => {
        setShowActionSheet(true);
    }, []);

    // 拍照功能 - 使用AppSDK
    const handleTakePhoto = useCallback(async () => {
        setShowActionSheet(false);
        try {
            const result = await AppSdk.camera.takePicture({
                quality: 0.8,
                aspect: [4, 3],
                allowsMultipleSelection: false,
                mediaTypes: ['images']
            });
            
            if (!result.canceled && result.assets.length > 0) {
                const image = result.assets[0];
                // AppSDK始终返回base64，直接使用
                setCapturedImage(`data:image/jpeg;base64,${image.base64}`);
            }
        } catch (error) {
            await reportError(error, 'JavaScriptError', {
                component: 'PhotoPoetry',
                action: 'handleTakePhoto'
            });
            setAlertMessage('拍照失败，请重试');
            setShowAlert(true);
        }
    }, []);

    // 从相册选择 - 使用AppSDK
    const handleSelectFromGallery = useCallback(async () => {
        setShowActionSheet(false);
        try {
            const result = await AppSdk.camera.pickImage({
                quality: 0.8,
                aspect: [4, 3],
                allowsMultipleSelection: false,
                mediaTypes: ['images']
            });
            
            if (!result.canceled && result.assets.length > 0) {
                const image = result.assets[0];
                // AppSDK始终返回base64，直接使用
                setCapturedImage(`data:image/jpeg;base64,${image.base64}`);
            }
        } catch (error) {
            await reportError(error, 'JavaScriptError', {
                component: 'PhotoPoetry',
                action: 'handleSelectFromGallery'
            });
            setAlertMessage('选择图片失败，请重试');
            setShowAlert(true);
        }
    }, []);

    // 备用文件选择（如果AppSDK不可用时的降级方案）
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 生成诗歌
    const generatePoem = async () => {
        if (!capturedImage || !selectedMood) {
            setAlertMessage('请先拍照并选择心情！');
            setShowAlert(true);
            return;
        }

        // 检查AI服务是否可用
        if (!hasValidApiKey) {
            setAlertMessage('AI服务暂时不可用，请稍后重试。');
            setShowAlert(true);
            return;
        }

        setIsGenerating(true);
        setUploadProgress('');
        
        try {
            const moodInfo = getMoodInfo(selectedMood);
            
            // 传入进度回调函数
            const generatedPoem = await generatePoetryWithAI(
                capturedImage, 
                selectedMood, 
                moodInfo?.label || '平静',
                (progress) => setUploadProgress(progress)
            );
            
            setGeneratedPoem(generatedPoem);
            
            // 保存到历史记录
            const newRecord = {
                id: Date.now(),
                image: capturedImage,
                mood: selectedMood,
                poem: generatedPoem,
                timestamp: new Date().toLocaleString('zh-CN'),
                aiGenerated: true
            };
            setHistory(prev => [newRecord, ...prev]);
            
        } catch (error) {
            await reportError(error, 'JavaScriptError', {
                component: 'PhotoPoetry',
                action: 'generatePoem'
            });
            setAlertMessage(`AI生成失败: ${error.message}`);
            setShowAlert(true);
        } finally {
            setIsGenerating(false);
            setUploadProgress('');
        }
    };

    // 重新开始
    const resetApp = () => {
        setCapturedImage(null);
        setSelectedMood('');
        setGeneratedPoem('');
    };

    // 获取心情选项的详细信息
    const getMoodInfo = (moodValue) => {
        return moodOptions.find(option => option.value === moodValue);
    };

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>📸 AI诗歌相机</h1>
                <p className={styles.subtitle}>拍照片，选心情，让AI为你写诗</p>
                
                {/* AI配置按钮 */}
                <div className={styles.configButton}>
                    <IonButton 
                        fill="clear" 
                        size="small"
                        onClick={() => setShowAIConfig(true)}
                    >
                        <IonIcon icon={settings} />
                        AI设置
                        {!hasValidApiKey && <IonIcon icon={warning} color="warning" />}
                    </IonButton>
                </div>
                
                {/* AI服务状态提示 */}
                {!hasValidApiKey && (
                    <div className={styles.apiKeyWarning}>
                        <IonIcon icon={warning} />
                        <span>AI服务暂时不可用</span>
                    </div>
                )}
            </div>

            {/* 拍照区域 */}
            <IonCard className={styles.photoCard}>
                <IonCardContent>
                    {!capturedImage ? (
                        <div className={styles.photoPlaceholder} onClick={handleImageSelection}>
                            <IonIcon icon={camera} className={styles.cameraIcon} />
                            <p>选择图片</p>
                            <small>点击选择拍照或从相册选择</small>
                        </div>
                    ) : (
                        <div className={styles.imageContainer}>
                            <img src={capturedImage} alt="拍摄的照片" className={styles.capturedImage} />
                            <IonButton 
                                fill="clear" 
                                className={styles.retakeButton}
                                onClick={handleImageSelection}
                            >
                                <IonIcon icon={refresh} />
                                重新选择
                            </IonButton>
                        </div>
                    )}
                </IonCardContent>
            </IonCard>

            {/* 心情选择 */}
            {capturedImage && (
                <IonCard className={styles.moodCard}>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>选择心情</IonLabel>
                            <IonSelect
                                value={selectedMood}
                                placeholder="请选择心情"
                                onIonChange={e => setSelectedMood(e.detail.value)}
                            >
                                {moodOptions.map(mood => (
                                    <IonSelectOption key={mood.value} value={mood.value}>
                                        {mood.label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        
                        {selectedMood && (
                            <div className={styles.selectedMood}>
                                <IonIcon 
                                    icon={getMoodInfo(selectedMood)?.icon} 
                                    style={{ color: getMoodInfo(selectedMood)?.color }}
                                />
                                <span>{getMoodInfo(selectedMood)?.label}</span>
                            </div>
                        )}
                    </IonCardContent>
                </IonCard>
            )}

            {/* 生成诗歌按钮 */}
            {capturedImage && selectedMood && (
                <IonButton
                    expand="block"
                    className={styles.generateButton}
                    onClick={generatePoem}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <IonSpinner name="crescent" />
                            <span className={styles.buttonText}>
                                {uploadProgress || 'AI正在创作中...'}
                            </span>
                        </>
                    ) : (
                        '✨ 生成诗歌'
                    )}
                </IonButton>
            )}

            {/* 生成的诗歌 */}
            {generatedPoem && (
                <IonCard className={styles.poemCard}>
                    <IonCardContent>
                        <h3 className={styles.poemTitle}>🎭 AI创作的诗歌</h3>
                        <div className={styles.poemContent}>
                            {generatedPoem.split('\n').map((line, index) => (
                                <p key={index} className={styles.poemLine}>{line}</p>
                            ))}
                        </div>
                        <div className={styles.poemMeta}>
                            <span>心情: {getMoodInfo(selectedMood)?.label}</span>
                            <span>创作时间: {new Date().toLocaleString('zh-CN')}</span>
                        </div>
                    </IonCardContent>
                </IonCard>
            )}

            {/* 操作按钮 */}
            {generatedPoem && (
                <div className={styles.actionButtons}>
                    <IonButton 
                        fill="outline" 
                        onClick={resetApp}
                        className={styles.actionButton}
                    >
                        🔄 重新开始
                    </IonButton>
                </div>
            )}

            {/* 历史记录浮动按钮 */}
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={() => setShowHistory(true)}>
                    <IonIcon icon={bookmarks} />
                </IonFabButton>
            </IonFab>

            {/* 历史记录模态框 */}
            <IonModal isOpen={showHistory} onDidDismiss={() => setShowHistory(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>历史记录</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowHistory(false)}>
                                <IonIcon icon={close} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {history.length === 0 ? (
                        <div className={styles.emptyHistory}>
                            <IonIcon icon={time} className={styles.emptyIcon} />
                            <p>还没有历史记录</p>
                        </div>
                    ) : (
                        <div className={styles.historyList}>
                            {history.map(record => (
                                <IonCard key={record.id} className={styles.historyCard}>
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="4">
                                                    <img 
                                                        src={record.image} 
                                                        alt="历史照片" 
                                                        className={styles.historyImage}
                                                    />
                                                </IonCol>
                                                <IonCol size="8">
                                                    <div className={styles.historyContent}>
                                                        <div className={styles.historyMood}>
                                                            <IonIcon 
                                                                icon={getMoodInfo(record.mood)?.icon}
                                                                style={{ color: getMoodInfo(record.mood)?.color }}
                                                            />
                                                            <span>{getMoodInfo(record.mood)?.label}</span>
                                                        </div>
                                                        <div className={styles.historyPoem}>
                                                            {record.poem.split('\n').map((line, index) => (
                                                                <p key={index}>{line}</p>
                                                            ))}
                                                        </div>
                                                        <div className={styles.historyTime}>
                                                            {record.timestamp}
                                                        </div>
                                                    </div>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </div>
                    )}
                </IonContent>
            </IonModal>

            {/* 图片选择操作表 */}
            <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                buttons={[
                    {
                        text: '拍照',
                        icon: cameraOutline,
                        handler: handleTakePhoto
                    },
                    {
                        text: '从相册选择',
                        icon: imagesOutline,
                        handler: handleSelectFromGallery
                    },
                    {
                        text: '取消',
                        role: 'cancel',
                        icon: close
                    }
                ]}
            />

            {/* 隐藏的文件输入 */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />

            {/* AI配置模态框 */}
            <AIConfig
                isOpen={showAIConfig}
                onDidDismiss={() => setShowAIConfig(false)}
            />

            {/* 提示框 */}
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="提示"
                message={alertMessage}
                buttons={['确定']}
            />
        </div>
    );
};

export default PhotoPoetry;
