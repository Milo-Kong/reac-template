import axios, { AxiosRequestConfig, Method } from "axios";

const instance = axios.create({})
instance.defaults.timeout = 30000;
instance.defaults.baseURL = 'https://test-subgraph.intodevs.com/'

export async function getRequest(url:string) {
  return new Promise((resolut,reject)=>{
    instance.get(url).then((result:any)=>{
      console.log('get result=',result)
      if (result.status == 200){
        if (result.data && result.data.code == 200){
          resolut(result.data)
        }else {
          reject(result.data.code)
        }
      }else {
        reject()
      }
    }).catch((e:any)=>{
      console.log('get e===',e);
      reject(e)
    })
  })
}
export async function postRequest(url:string,params:any,config?:any) {
  return new Promise((resolut,reject)=>{
    instance.post(url,params,config).then((result:any)=>{
      console.log('post result=',result)
      if (result.status == 200){
        if (result.data){
          resolut(result.data)
        }else {
          if (result.data.code == 404){
            reject(result.data.code) // not bind
          }else {
            // notification.error({
            //   message:result.data.msg || 'Query failed, please try again later.'
            // })
            reject(result.data.code)
          }
        }
      }else {
        reject()
      }
    }).catch((e:any)=>{
      console.log('post e===',e);
      // notification.error({
      //   message:'Network error, please try again later'
      // })
      reject(e)
    })
  })
}