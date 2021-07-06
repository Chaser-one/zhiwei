import axios from "./config/axios.default.config"
import defaultConfig from "@/config/config.default"
class ImgFileService{
  async uploadImgFile(uploadData){
    console.log(uploadData)
    return axios.post(`${defaultConfig.baseApiUrl}/uploadImg`,uploadData)
  }
}
export default new ImgFileService()
