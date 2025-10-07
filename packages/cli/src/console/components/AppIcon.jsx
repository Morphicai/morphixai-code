import React from 'react';
import { IonIcon } from '@ionic/react';
import {
    // 已有图标
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
    playCircle,
    eye,
    bicycle,
    barbell,
    // 导航类
    home,
    arrowBack,
    arrowForward,
    menu,
    close,
    chevronDown,
    chevronUp,
    // 操作类
    add,
    remove,
    create,
    trash,
    search,
    refresh,
    share,
    download,
    // 文件类
    document,
    image,
    videocam,
    camera,
    musicalNotes,
    // 通信类
    mail,
    send,
    call,
    star,
    // 用户类
    person,
    people,
    personCircle,
    logIn,
    logOut,
    key,
    // 设置类
    helpCircle,
    informationCircle,
    warning,
    checkmarkCircle,
    // 媒体类
    play,
    pause,
    stop,
    volumeHigh,
    volumeLow,
    volumeMute,
    // 工具类
    calculator,
    time,
    qrCode,
    flashlight
} from 'ionicons/icons';

export const AVAILABLE_ICONS = [
    // 原有图标
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
    'eye',
    'bicycle',
    'barbell',
    // 导航类
    'home',
    'arrow-back',
    'arrow-forward',
    'menu',
    'close',
    'chevron-down',
    'chevron-up',
    // 操作类
    'add',
    'remove',
    'create',
    'trash',
    'search',
    'refresh',
    'share',
    'download',
    // 文件类
    'document',
    'image',
    'videocam',
    'camera',
    'musical-notes',
    // 通信类
    'mail',
    'send',
    'call',
    'star',
    // 用户类
    'person',
    'people',
    'person-circle',
    'log-in',
    'log-out',
    'key',
    // 设置类
    'help-circle',
    'information-circle',
    'warning',
    'checkmark-circle',
    // 媒体类
    'play',
    'pause',
    'stop',
    'volume-high',
    'volume-low',
    'volume-mute',
    // 工具类
    'calculator',
    'time',
    'qr-code',
    'flashlight',
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
    // 原有图标 - direct
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
    eye,
    bicycle,
    barbell,
    // 导航类 - direct
    home,
    menu,
    close,
    // 操作类 - direct
    add,
    remove,
    create,
    trash,
    search,
    refresh,
    share,
    download,
    // 文件类 - direct
    document,
    image,
    videocam,
    camera,
    // 通信类 - direct
    mail,
    send,
    call,
    star,
    // 用户类 - direct
    person,
    people,
    key,
    // 设置类 - direct
    warning,
    // 媒体类 - direct
    play,
    pause,
    stop,
    // 工具类 - direct
    calculator,
    time,
    flashlight,
    // kebab-case aliases
    'document-text': documentText,
    'checkmark-done': checkmarkDone,
    'arrow-back': arrowBack,
    'arrow-forward': arrowForward,
    'chevron-down': chevronDown,
    'chevron-up': chevronUp,
    'musical-notes': musicalNotes,
    'person-circle': personCircle,
    'log-in': logIn,
    'log-out': logOut,
    'help-circle': helpCircle,
    'information-circle': informationCircle,
    'checkmark-circle': checkmarkCircle,
    'volume-high': volumeHigh,
    'volume-low': volumeLow,
    'volume-mute': volumeMute,
    'qr-code': qrCode,
    // camelCase
    documentText,
    checkmarkDone,
    arrowBack,
    arrowForward,
    chevronDown,
    chevronUp,
    musicalNotes,
    personCircle,
    logIn,
    logOut,
    helpCircle,
    informationCircle,
    checkmarkCircle,
    volumeHigh,
    volumeLow,
    volumeMute,
    qrCode,
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


