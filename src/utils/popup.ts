import { Message } from 'element-ui';

export function showNetworkError() {
    Message({
        type: 'error',
        message: '网络错误',
    });
}
