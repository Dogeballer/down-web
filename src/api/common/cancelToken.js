import axios from 'axios'

const CancelToken = axios.CancelToken

export default function (cb) {
  return new CancelToken(cb)
}
