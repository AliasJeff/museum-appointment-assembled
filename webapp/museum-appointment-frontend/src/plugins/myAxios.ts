import axios, {AxiosInstance} from "axios";
import {Notify, Toast} from "vant";

const isDev = process.env.NODE_ENV === 'development';

const myAxios: AxiosInstance = axios.create({
    baseURL: isDev ? 'http://localhost:8101/api' : 'http://localhost:8101/api',
});

myAxios.defaults.withCredentials = true;

// Add a request interceptor
myAxios.interceptors.request.use(function (config) {
    console.log('send request: ', config)
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
myAxios.interceptors.response.use(function (response) {
    // 未登录则跳转到登录页
    // if (response?.data?.code === 40100) {
    //     const redirectUrl = window.location.href;
    //     window.location.href = `/user/login?redirect=${redirectUrl}`;
    // }
    console.log('response: ', response)
    if (response?.data?.code !== 0) {
        Notify({
            message: response?.data?.message,
            duration: 1500,
            background: '#e25749'
        });
    }
    // Do something with response data
    return response.data;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

export default myAxios;
