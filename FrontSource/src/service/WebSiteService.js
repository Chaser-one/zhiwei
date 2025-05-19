import axios from "./config/axios.default.config"
import defaultConfig from "@/config/config.default"
class WebSiteService{
  async getWebSiteData(args){
    return axios.get(`${defaultConfig.baseApiUrl}/websiteData/websiteData`,{
      params:args
    })
  }
}

export default new WebSiteService()
