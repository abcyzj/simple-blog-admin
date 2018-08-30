import axios from 'axios';
import store from '@/store';
import { Message } from 'element-ui';
import router from '@/router';

axios.interceptors.request.use((config) => {
    if (store.state.token) {
        config.headers.Authorization = store.state.token;
    }
    return config;
});

axios.interceptors.response.use((response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            Message({
                message: '请登录',
                type: 'error',
            });
            store.dispatch('logout');
            router.push('/login');
            return Promise.resolve();
        } else {
            return Promise.reject(error);
        }
    },
);
