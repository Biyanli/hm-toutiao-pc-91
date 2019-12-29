// 提供一个配置好的axios，导出，在main.js中使用
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import JSONBIGINT from 'json-bigint'

// 默认配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 配置头部的代码不能在此处定义。
// 这里的代码只会在刷新页面后执行一次
// axios.defaults.headers.Authorization = `Bearer ${store.getUser().token}`

axios.defaults.transformResponse = [(data) => {
  // data Json 格式的字符串
  // 当后端没有响应的时候，转换会报错，捕获这个错误
  // 处理：不去转换，直接返回
  try {
    return JSONBIGINT.parse(data)
  } catch (e) {
    return data
  }
}]

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${store.getUser().token}`
  return config
}, err => Promise.reject(err))

// 响应拦截器
axios.interceptors.response.use(res => res, err => {
  // 根据当前的响应状态码是不是401去跳转登录页面
  // err 对象包含 错误的时候响应对象 err.response
  // 状态码 err.response.status
  if (err.response && err.response.status === 401) {
    // 如果是vue组件中:this.$router.push('/login)
    // 如果在js模块中:导入创建好的实例对象调用push函数即可
    router.push('/login')
  }
  return Promise.reject(err)
})

export default axios
