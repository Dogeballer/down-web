import axios from 'axios'

const login = (body) => {
  return axios.post('/V1.0/user/login', body)
}

export default {
  login
}
