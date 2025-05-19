import axios from "./config/axios.default.config"
import defaultConfig from "@/config/config.default"
class AuthorService{
  async registerUser(userData){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/registerUser`,userData)
  }
  async loginUser(userData){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/loginUser`,userData)
  }
  async checkPermission(){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/checkPermission`)
  }
  async updateUserInfo(data){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/updateUserInfo`,data)
  }
  async getUnapprovedUserList(args){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/unapprovedUser`,{
      params:args
    })
  }
  async getAllUserList(args){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/unAllUser`,{
      params:args
    })
  }
  async approvedUser(args){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/approvedUser`,args)
  }
  async unApprovedUser(args){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/unApprovedUser`,args)
  }
  async deleteUser(args){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/deleteUser`,args)
  }
  async setAdmin(args){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/setAdmin`,args)
  }
  async cancelAdmin(args){
    return axios.post(`${defaultConfig.baseApiUrl}/authentication/cancelAdmin`,args)
  }
  async getUserRegisterInfo(){
    return axios.get(`${defaultConfig.baseApiUrl}/authentication/userRegisterInfo`)
  }
}

export default new AuthorService()
