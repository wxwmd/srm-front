import axios from 'axios'
import router from '../router/router'

class Ajax {
  baseUrl = process.env.VUE_APP_API_URL
  constructor(){
    this.instance = axios.create({
      baseURL: this.baseUrl
    });

    let credential = 'jaezi-credential';

    // 请求拦截器，以每次发出请求前把SN带上
    this.instance.interceptors.request.use(
    config => {
      if (config.url !== '/login') {
        let token = localStorage.getItem(credential);
        if (token) {
          //在请求头加入token，名字要和后端接收请求头的token名字一样
          config.headers.credential = token;
        }
      }
      return config
    },
    err => {
      return Promise.reject(err)
    });
    // 响应拦截器，主要对错误的响应进行拦截并跳转
    this.instance.interceptors.response.use(
      response => {
        if (response.config.url === '/login') {
          localStorage.setItem(credential, response.headers.credential);
        }
        if (response.data.code === 401 || response.data.code === 412){
          router.push({
            path: '/login'
          });
        }
        if(response.config.url.indexOf("export") >= 0 || response.config.url.indexOf("import") >= 0 || response.config.url.indexOf("download") >= 0) { //判断url地址中是否包含export字符串
          return response
        } else {
          return response.data
        }
      },
      error => {
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              error.message = '请求错误';
              break;
            case 401:
              error.message = '未授权，请登录';
              router.push('/login');
              break;
            case 403:
              error.message = '拒绝访问';
              break;
            case 404:
              error.message = `请求地址出错: ${error.response.config.url}`;
              break;
            case 408:
              error.message = '请求超时';
              break;
            case 500:
              error.message = '服务器内部错误';
              break;
            case 501:
              error.message = '服务未实现';
              break;
            case 502:
              error.message = '网关错误';
              break;
            case 503:
              error.message = '服务不可用';
              break;
            case 504:
              error.message = '网关超时';
              break;
            case 505:
              error.message = 'HTTP版本不受支持';
              break;
            case 412:
              error.message = '您的账号已在别处登录！';
              router.push('/login');
              break;
            default:
          }
        }
        return Promise.reject(error)
      }
    );
  }

  post(url, data){
    return this.instance.post(url, data)
  }
  get(url, data){
    return this.instance.get(url, {params: data})
  }
  gets (url, responseType, params, a) {
    return new Promise((resolve, reject) => {
      this.instance.get(url, {
        responseType: responseType,
        params: params,
        a:a
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  posts (url ,data) {
    return new Promise((resolve, reject) => {
      this.instance({
        url: url,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data
      }).then(res => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        })
    })
  }
  put(url, data){
    return this.instance.put(url, data)
  }

  delete(url, data){
    return this.instance.delete(url, data)
  }
}

const ajax = new Ajax();

export default ajax

// export function ajaxPromise(config) {
//   return new Promise((resolve, reject) => {
//     const instance = axios.create({
//       baseURL: '',
//       withCredentials: true
//     })
//
//     instance(config).then(res => {
//       resolve(res)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }
