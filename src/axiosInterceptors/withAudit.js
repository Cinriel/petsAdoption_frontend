// 需要用到权限的就用这个，不需要权限就直接使用原生axios

// 引入axios  
import axios from 'axios'
import {getCookie} from '../utils/index.js'
import {Message} from 'element-ui'
import router from '../router/router.js'

// 按照axios官方提示需要引入这两步
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
// 创建实例
let instance = axios.create({
  baseURL: 'http://192.168.124.71:8001',
})

// 全局拦截器
axios.defaults.withCredentials = true
axios.defaults.baseURL="http://192.168.124.71:8001";
instance.defaults.withCredentials = true
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 判断是否存在token，如果存在将每个页面header都添加token
    if (!getCookie("uid")) {
      // 请求头配置全局token
      config.cancelToken = source.token;
			// cancel函数可以不用传参，也可以传入取消后执行的操作，取消后可提示用户需要登录
      source.cancel(Message({message: '请先登录再执行操作', type: 'warning', center: true, duration: 1500}));
      // 定时器1.5s后自动跳转到登录页
      setTimeout(() => {router.push('/login')}, 1500);
    }
    return config
  },
  err => {
    // 对请求错误做些什么
    return Promise.reject(err)
  }
)
// 响应拦截器
// instance.interceptors.reponse.use(req=>{}, err=>{});


export default instance;