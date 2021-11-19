/**
 * 大屏接口
 */

import axios from 'axios'
import { API_VER } from '../constant'
export const getRisk = () => {
  return axios.get('/logs/getDsdStat')
}

export const getRiskTrend = () => {
  return axios.get('/logs/getDstStat')
}

export const getException = () => {
  return axios.get('/logs/getDafdStat')
}

export const getExceptionTrend = () => {
  return axios.get('/logs/getDaftStat')
}

export const getAppBug = () => {
  return axios.get('/logs/getAppVbStat')
}

export const getDatabaseBug = () => {
  return axios.get('/logs/getDbVbStat')
}


// -- 资产
/**
 * 数据分类分级标识量指标统计
 */
export const getDataClassAndGradeTagStat = () => {
  return axios.get('/assets/getDataClassAndGradeTagStat')
}

/**
 * 数据分类分级数指标统计
 */
export const getDataClassAndGradeStat = () => {
  return axios.get('/assets/getDataClassAndGradeStat')
}

/**
 * 数据资产数指标统计
 */
export const getDataAssetsStat = () => {
  return axios.get('/assets/getDataAssetsStat')
}

/**
 * 应用资产数指标统计
 */
export const getAppAssetsStat = () => {
  return axios.get('/assets/getAppAssetsStat')
}

/**
 * 账号资产数指标统计
 */
export const getAccountStat = () => {
  return axios.get('/assets/getAccountStat')
}