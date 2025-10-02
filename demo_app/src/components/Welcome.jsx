import React from 'react';
import { IonIcon } from '@ionic/react';
import { downloadOutline, globeOutline, chatbubbleEllipsesOutline, sparklesOutline, deviceMobileOutline } from 'ionicons/icons';
import styles from '../styles/Welcome.module.css';

/**
 * 欢迎组件 - 仅用于演示
 * 
 * 这个组件用于展示 Morphix AI Code 的功能和界面设计
 * 在实际开发中，请删除此组件并创建您自己的应用界面
 * 
 * @component
 * @returns {JSX.Element} 欢迎页面组件
 */
export default function Welcome() {
    const openDownload = () => {
        window.open('https://baibian.app/mobile-download', '_blank');
    };

    const openWebsite = () => {
        window.open('https://baibian.app/', '_blank');
    };

    return (
        <div className={styles.welcomeContainer}>

            {/* 头部 */}
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img
                        src="https://app-shell.focusbe.com/Icon-60@3x.png"
                        alt="Morphix AI Logo"
                        className={styles.logoImage}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className={styles.logoGlow}></div>
                </div>

                <h1 className={styles.title}>
                    <span className={styles.titleGradient}>Morphix AI</span>
                    <span className={styles.titleSubtext}>Code</span>
                </h1>
                <p className={styles.subtitle}>Create your own app with AI</p>
            </div>

            {/* 三个步骤 */}
            <div className={styles.steps}>
                <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3>Describe</h3>
                        <p>Your app idea</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3>Generate</h3>
                        <p>AI builds a preview</p>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3>Launch</h3>
                        <p>Use in Morphix</p>
                    </div>
                </div>
            </div>

            {/* 行动按钮 */}
            <div className={styles.ctaSection}>
                <button 
                    className={styles.primaryBtn}
                    onClick={openDownload}
                >
                    <IonIcon icon={downloadOutline} />
                    Download Morphix AI
                </button>
                
                <button 
                    className={styles.secondaryBtn}
                    onClick={openWebsite}
                >
                    <IonIcon icon={globeOutline} />
                    Visit Website
                </button>
            </div>

            {/* 底部 */}
            <div className={styles.footer}>
                <p>2024 Morphix AI. Empowering everyone to create apps.</p>
            </div>
        </div>
    );
}
