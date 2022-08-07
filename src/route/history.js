import {createHashHistory} from 'history'
import qs from 'query-string'
const myHistory = createHashHistory()

const getQuery = () => {
  return qs.parseUrl(myHistory.location.search)
}
myHistory.getQuery = getQuery

export default myHistory