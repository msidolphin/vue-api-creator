import Axios from 'axios'

export function createAxios (config = {axios: {}}) {
  let axios = Axios.create({
    responseType: 'json',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    ...config.axios
  })
  try {
    axios.interceptors.response.use(resp => {
      return Promise.resolve(resp)
    })
  } catch(e) {
    // maybe throw error when run test case
     /* istanbul ignore next */
    console.error(e)
  }
  return axios
}
