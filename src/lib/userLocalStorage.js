let userInfo

const localStorage = window.localStorage
const localKey = '__management_cockpit_userInfo__'

export const getUserInfo = () => {
  if (userInfo) return userInfo
  let localValue = localStorage.getItem(localKey)
  if (localValue) {
    try {
      userInfo = JSON.parse(localValue)
    } catch (e) {
    }
  }
  return userInfo
}

export const updateUserInfo = newUserInfo => {
  let curUserInfo = getUserInfo()
  userInfo = {...curUserInfo, ...newUserInfo}
  localStorage.setItem(localKey, JSON.stringify(userInfo))
}

export const isLogin = () => {
  return !!getUserInfo()
}


export const clear = () => {
  // localStorage.removeItem(localKey)
  // localStorage.removeItem(localKey)
  localStorage.clear()
  userInfo = undefined
}
