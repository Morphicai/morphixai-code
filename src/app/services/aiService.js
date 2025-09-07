/**
 * AI服务配置和调用 - 使用AppSDK AI模块
 */

// 引入AppSDK和错误处理
import AppSdk from '@morphixai/app-sdk';
import { reportError } from '@morphixai/lib';

// 将base64图片上传到云存储
const uploadImageToCloud = async (base64Data) => {
    try {
        // 将base64转换为blob
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        // 创建文件信息
        const fileInfo = {
            uri: base64Data, // AppSDK会处理base64数据
            type: 'image/jpeg',
            name: `poetry_image_${Date.now()}.jpg`
        };
        
        // 上传到云存储，使用medium压缩预设
        const uploadResult = await AppSdk.fileUpload.uploadFile({
            fileInfo,
            compressionPreset: 'medium' // 1200x1200, 质量0.8
        });
        
        if (uploadResult.success && uploadResult.publicUrl) {
            return uploadResult.publicUrl;
        } else {
            throw new Error(uploadResult.error || '上传失败');
        }
    } catch (error) {
        await reportError(error, 'JavaScriptError', {
            component: 'AIService',
            action: 'uploadImageToCloud'
        });
        throw new Error(`图片上传失败: ${error.message}`);
    }
};

// AppSDK AI 模块支持的模型
const AVAILABLE_MODELS = [
    {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        description: '最新的GPT-4模型，支持视觉和文本理解',
        provider: 'OpenAI'
    },
    {
        id: 'anthropic/claude-3.7-sonnet',
        name: 'Claude 3.7 Sonnet',
        description: 'Anthropic的高性能AI模型',
        provider: 'Anthropic'
    }
];

// 获取当前AI模型
export const getCurrentModel = () => {
    return localStorage.getItem('ai_model') || 'openai/gpt-4o';
};

// 设置AI模型
export const setCurrentModel = (model) => {
    localStorage.setItem('ai_model', model);
};

// 获取AI温度设置
export const getTemperature = () => {
    const temp = localStorage.getItem('ai_temperature');
    return temp ? parseFloat(temp) : 0.8;
};

// 设置AI温度
export const setTemperature = (temperature) => {
    localStorage.setItem('ai_temperature', temperature.toString());
};

// 直接使用导入的AppSdk
const getAppSDK = () => {
    return AppSdk;
};

// 构建诗歌生成提示词
const buildPoetryPrompt = (mood, moodLabel) => {
    const moodPrompts = {
        happy: '请根据这张图片，写一首表达快乐、欢愉心情的中文诗歌。诗歌应该积极向上，充满生机活力。',
        sad: '请根据这张图片，写一首表达忧伤、惆怅心情的中文诗歌。诗歌应该深沉内敛，富有感情。',
        romantic: '请根据这张图片，写一首表达浪漫、温馨心情的中文诗歌。诗歌应该温柔甜蜜，充满爱意。',
        peaceful: '请根据这张图片，写一首表达宁静、安详心情的中文诗歌。诗歌应该平和淡雅，意境深远。',
        energetic: '请根据这张图片，写一首表达活力、奋进心情的中文诗歌。诗歌应该充满动力，激昂向上。',
        mysterious: '请根据这张图片，写一首表达神秘、深邃心情的中文诗歌。诗歌应该意境朦胧，富有想象。'
    };
    
    return `${moodPrompts[mood] || moodPrompts.peaceful}

要求：
1. 诗歌为中文，4句话，每句7-10个字
2. 要有韵律感和意境美
3. 结合图片内容和${moodLabel}的心情
4. 语言优美，朗朗上口
5. 只返回诗歌内容，不要其他解释

请直接返回诗歌：`;
};


// 主要的AI诗歌生成函数 - 先上传图片再调用AI
export const generatePoetryWithAI = async (imageUrl, mood, moodLabel, onUploadProgress) => {
    try {
        const AppSdk = getAppSDK();
        const currentModel = getCurrentModel();
        const temperature = getTemperature();
        
        // 构建提示词
        const prompt = buildPoetryPrompt(mood, moodLabel);
        
        let finalImageUrl = imageUrl;
        
        // 如果是base64数据，先上传到云存储
        if (imageUrl.startsWith('data:image/')) {
            if (onUploadProgress) {
                onUploadProgress('正在上传图片到云存储...');
            }
            
            finalImageUrl = await uploadImageToCloud(imageUrl);
            
            if (onUploadProgress) {
                onUploadProgress('图片上传完成，正在生成诗歌...');
            }
        }
        
        // 构建消息内容，使用云存储URL
        const messages = [
            {
                role: 'system',
                content: '你是一位才华横溢的诗人，擅长根据图片和情感创作优美的中文诗歌。请创作4句话的诗歌，每句7-10个字，要有韵律感和意境美。'
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: prompt
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: finalImageUrl // 使用云存储URL
                        }
                    }
                ]
            }
        ];
        
        // 调用AppSDK AI模块
        const response = await AppSdk.AI.chat({
            messages,
            options: {
                model: currentModel,
                temperature: temperature
            }
        });
        
        // 处理响应
        if (typeof response === 'string') {
            return response.trim();
        } else if (response && response.content) {
            return response.content.trim();
        } else {
            throw new Error('AI返回格式异常');
        }
        
    } catch (error) {
        // 使用标准错误处理
        await reportError(error, 'JavaScriptError', {
            component: 'AIService',
            action: 'generatePoetryWithAI'
        });
        throw new Error(`AI生成失败: ${error.message}`);
    }
};

// 获取可用的AI模型列表
export const getAvailableModels = () => {
    return AVAILABLE_MODELS.map(model => ({
        ...model,
        isAvailable: true // AppSDK在任何环境都可用
    }));
};

// 检查AI服务是否可用
export const isAIServiceAvailable = () => {
    try {
        return !!(AppSdk && AppSdk.AI);
    } catch (error) {
        console.warn('AppSDK检查失败:', error);
        return false;
    }
};

// 获取AI服务状态
export const getAIServiceStatus = () => {
    const available = isAIServiceAvailable();
    const currentModel = getCurrentModel();
    const temperature = getTemperature();
    
    return {
        available,
        currentModel,
        temperature,
        models: AVAILABLE_MODELS
    };
};

// 兼容性函数 - 保持与之前版本的兼容
export const getCurrentProvider = () => {
    // 将模型映射为提供商
    const model = getCurrentModel();
    if (model.startsWith('openai/')) return 'openai';
    if (model.startsWith('anthropic/')) return 'anthropic';
    return 'openai';
};

export const getAvailableProviders = () => {
    return [
        {
            id: 'appsdk',
            name: 'AppSDK AI',
            hasApiKey: isAIServiceAvailable()
        }
    ];
};
