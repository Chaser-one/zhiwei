import axios from "axios"
// if (sessionStorage.getItem('Authorization')){
//   axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization')
// }
axios.interceptors.request.use(config => {
  if(sessionStorage.getItem('Authorization')){
    config.headers.Authorization = sessionStorage.getItem('Authorization')
  }
  return config
})
export default axios
