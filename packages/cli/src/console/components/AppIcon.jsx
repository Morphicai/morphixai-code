import React from 'react';
import { IonIcon } from '@ionic/react';
import {
    apps,
    grid,
    briefcase,
    heart,
    documentText,
    checkmarkDone,
    list,
    clipboard,
    calendar,
    notifications,
    chatbubble,
    folder,
    settings,
    checkmark,
    playCircle
} from 'ionicons/icons';

export const AVAILABLE_ICONS = [
    'apps',
    'grid',
    'briefcase',
    'heart',
    'document-text',
    'checkmark-done',
    'list',
    'clipboard',
    'calendar',
    'notifications',
    'chatbubble',
    'folder',
    'settings',
    'checkmark',
];

export const THEME_COLORS = [
    '#007AFF', // Blue
    '#FF2D55', // Pink
    '#5856D6', // Purple
    '#FF9500', // Orange
    '#4CD964', // Green
    '#FF3B30', // Red
    '#5AC8FA', // Light Blue
    '#FFCC00', // Yellow
    '#34C759', // Mint
    '#AF52DE', // Violet
];

const NAME_TO_ICON = {
    // direct
    apps,
    grid,
    briefcase,
    heart,
    list,
    clipboard,
    calendar,
    notifications,
    chatbubble,
    folder,
    settings,
    checkmark,
    // kebab-case aliases
    'document-text': documentText,
    'checkmark-done': checkmarkDone,
    // camelCase
    documentText,
    checkmarkDone,
};

export default function AppIcon({ name = 'apps', color = '#6366f1', size = 48, className = '', background = true, iconColor = '#ffffff' }) {
    const containerStyle = {
        backgroundColor: background ? (color || '#6366f1') : 'transparent',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    };

    const iconStyle = {
        fontSize: `${Math.max(16, Math.floor(size * 0.55))}px`,
        color: iconColor || '#ffffff'
    };

    const icon = NAME_TO_ICON[name] || playCircle;

    return (
        <div style={containerStyle} className={className}>
            {/* 使用 IonIcon 渲染导入的 icon 对象 */}
            <IonIcon icon={icon} style={iconStyle} />
        </div>
    );
}


