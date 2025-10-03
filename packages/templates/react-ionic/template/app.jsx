import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Welcome from './components/Welcome';
import styles from './styles/App.module.css';

/**
 * 主应用组件
 * 
 * 当前使用 Welcome 组件作为演示页面
 * 在实际开发中，请替换 Welcome 组件为您的应用内容
 */
export default function App() {
    return (
        <IonPage>
            <IonContent className={styles.content}>
                <Welcome />
            </IonContent>
        </IonPage>
    );
}