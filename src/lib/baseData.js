/**
 * @author 翁旺
 * @date 2018-09-18 16:00:47
 * @description 存储基础信息（临时）
 * @email wengwang@cecdat.com
 * @copyright Copyright 2018 CEC(Fujian) Healthcare Big Data Operation Service Co., Ltd. All rights reserved.
 */
const ls = window.localStorage

const CECDATA_USER = 'cecdata_user'

const get = function () {
  const data = ls.getItem(CECDATA_USER)
  return JSON.parse(data)
}

const set = function (data) {
  try {
    data = JSON.stringify(data)
  } catch (e) {
    data = ''
  }
  ls.setItem(CECDATA_USER, data)
}

const remove = function () {
  ls.removeItem(CECDATA_USER)
}

export default {
  get,
  set,
  remove
}
