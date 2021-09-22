import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  timeout: 1000,
  baseURL: 'http://localhost:5000'
})

//请求拦截
http.interceptors.request.use((config: AxiosRequestConfig) => {
  let token = localStorage.getItem('token')
  if (token) {
    // headers属性是后端约定的
    config.headers['Authorization'] = token
  }
  return config
}, (err: AxiosError) => {
  return Promise.reject(err)
})

//响应拦截
http.interceptors.response.use((res: any) => {
  return res.data
}, (err: AxiosError) => {
  let status: number = err.response! && err.response!.status
  switch (status) {
    case 400:
      ElMessage.error('参数错误')
      break;
    case 401:
      ElMessage.error('登录时间过长,请重新登录')
     setTimeout(()=>{
      window.location.pathname='/login'
     },1000)
      break;
    case 403:
      ElMessage.error('没有权限')
      break
    case 404:
      ElMessage.error('路径错误')
      break
    case 500:
      ElMessage.error('服务器错误')
      break
    case 503:
      ElMessage.error('服务器维护')
      break;
  }
  return Promise.reject(err)
})


export default http