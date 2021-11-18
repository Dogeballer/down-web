/**
 * 大屏接口
 */

import axios from 'axios'
import { API_VER } from '../constant'
export const getRisk = () => {
    return Promise.resolve()
    return axios.get(`/logs/getDsdStat`)
}

export const getRiskTrend = () => {
    return Promise.resolve()
    return axios.get(`/logs/getDstStat`)
}

export const getException = () => {
    return Promise.resolve()
    return axios.get(`/logs/getDafdStat`)
}

export const getExceptionTrend = () => {
    return Promise.resolve()
    return axios.get(`/logs/getDaftStat`)
}

// todo
export const getAppBug = () => {
    return Promise.resolve()
    return axios.get(``)
}

export const getDatabaseBug = () => {
    return Promise.resolve()
    return axios.get(``)
}