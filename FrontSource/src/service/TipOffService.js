import axios from "./config/axios.default.config"
import defaultConfig from "@/config/config.default"
class TipOffService{
  async tipBlog(data){
    return axios.post(`${defaultConfig.baseApiUrl}/tipOff/article`,data)
  }
  async getTipOffData(args){
    return axios.get(`${defaultConfig.baseApiUrl}/tipOff/article`,{
      params:args
    })
  }
  async ignoreTipOffDataById(args){
    return axios.delete(`${defaultConfig.baseApiUrl}/tipOff/tipOffData/${args.tipOffId}`,)
  }
  async deleteTipOffDataById(args){
    return axios.delete(`${defaultConfig.baseApiUrl}/tipOff/article/${args.tipOffId}`,)
  }
}
export default new TipOffService()
