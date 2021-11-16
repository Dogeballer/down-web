/**
 * @author 陆海鹍
 * @date 2020-07-15 15:26:18
 * @description 描述 本地缓存
 * @email luhaikun@cecdat.com
 * @copyright Copyright 2018 CEC(Fujian) Healthcare Big Data Operation Service Co., Ltd. All rights reserved.
 */
const ls = window.localStorage
const UAC_LS_KEY = 'cecdata_user'

const get = function (key) {
  return ls.getItem(key)
}

const set = function (key, value) {
  ls.setItem(key, value)
}

const remove = function (key) {
  ls.removeItem(key)
}

const clear = function () {
  ls.clear()
}

/**
 * 是否登录
 */
export const isLogin = () => {
  return !!getUserData()
}

/**
 * 获取用户信息
 */
export const getUserData = () => {
  let userData = null
  try {
    userData = JSON.parse(get(UAC_LS_KEY))
  } catch (e) {
    userData = null
  }
  if (!userData) return null
  return { ...userData }
}

/**
 * 设置用户信息，局部更新
 */
export const setUserData = (data) => {
  let userData = null
  try {
    userData = JSON.parse(get(UAC_LS_KEY))
  } catch (e) {
    userData = null
  }
  userData = { ...userData, ...data }

  set(UAC_LS_KEY, JSON.stringify(userData))
}

/**
 * 登出
 * @param {string} loginToken - 登录令牌
 * @returns {promise}
 * @memberof Uac
 */
export const logout = () => {
  clear()
  return Promise.resolve()
}

export default {
  remove,
  logout,
  isLogin,
  getUserData,
  setUserData
}
