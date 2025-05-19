import axios from "axios"
if (sessionStorage.getItem('Authorization')){
  axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization')
}
export default axios
