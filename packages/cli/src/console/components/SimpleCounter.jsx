import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import styles from '../styles/SimpleCounter.module.css';

export default function SimpleCounter() {
    const [count, setCount] = useState(0);
    
    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(0);
    
    return (
        <IonCard className={styles.counterCard}>
            <IonCardHeader>
                <IonCardTitle className={styles.title}>🔢 Simple Counter</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <div className={styles.counterDisplay}>
                    <span className={styles.countValue}>{count}</span>
                </div>
                
                <div className={styles.buttonGroup}>
                    <IonButton 
                        fill="outline" 
                        onClick={decrement}
                        disabled={count <= 0}
                        className={styles.actionButton}
                    >
                        <IonIcon icon={remove} slot="icon-only" />
                    </IonButton>
                    
                    <IonButton 
                        fill="solid" 
                        onClick={reset}
                        className={styles.resetButton}
                    >
                        Reset
                    </IonButton>
                    
                    <IonButton 
                        fill="outline" 
                        onClick={increment}
                        className={styles.actionButton}
                    >
                        <IonIcon icon={add} slot="icon-only" />
                    </IonButton>
                </div>
                
                <div className={styles.info}>
                    <p>This component demonstrates:</p>
                    <ul>
                        <li>React state management with hooks</li>
                        <li>Event handling</li>
                        <li>Conditional rendering (disabled state)</li>
                        <li>CSS Modules for styling</li>
                    </ul>
                </div>
            </IonCardContent>
        </IonCard>
    );
}
