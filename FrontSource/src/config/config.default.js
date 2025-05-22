
const defaultConfig = {}
const url = process.env.NODE_ENV === 'production' ? '43.136.65.70' : '127.0.0.1'
defaultConfig.baseApiUrl = `http://${url}:8888/api/v1`
defaultConfig.hostname = `http://${url}:8090`
defaultConfig.wssApiUrl = `ws://${url}:12581`
export default defaultConfig
