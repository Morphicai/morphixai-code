import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import PhotoPoetry from './components/PhotoPoetry';
import styles from './styles/App.module.css';

/**
 * 主应用组件
 * 
 * 拍照写诗AI应用 - 使用AI技术根据照片和心情生成诗歌
 */
export default function App() {
    return (
        <IonPage>
            <IonContent className={styles.content} scrollY={true}>
                <PhotoPoetry />
            </IonContent>
        </IonPage>
    );
}