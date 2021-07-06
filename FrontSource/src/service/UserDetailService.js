import axios from "./config/axios.default.config"
import defaultConfig from "@/config/config.default"
class UserDetailService{
  async setLikes(args){
    return axios.post(`${defaultConfig.baseApiUrl}/userDetail/likes`,args)
  }
  async unLikes(args){
    return axios.delete(`${defaultConfig.baseApiUrl}/userDetail/likes/${args.blogId}`)
  }
  async setAttentions(args){
    return axios.post(`${defaultConfig.baseApiUrl}/userDetail/attention`,args)
  }
  async unAttentions(args){
    return axios.delete(`${defaultConfig.baseApiUrl}/userDetail/attention/${args.userName}`)
  }
  async setBlackList(args){
    return axios.post(`${defaultConfig.baseApiUrl}/userDetail/blacklist`,args)
  }
  async unBlackList(args){
    return axios.delete(`${defaultConfig.baseApiUrl}/userDetail/blacklist/${args.userName}`)
  }
  async getCommentList(args){
    return axios.get(`${defaultConfig.baseApiUrl}/userDetail/comment`,{
      params:args
    })
  }
  async getAttentionList(args){
    return axios.get(`${defaultConfig.baseApiUrl}/userDetail/attention`,{
      params:args
    })
  }
  async getBlackList(args){
    return axios.get(`${defaultConfig.baseApiUrl}/userDetail/blacklist`,{
      params:args
    })
  }
}
export default new UserDetailService()
