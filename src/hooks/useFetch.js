import { useState, useEffect, useCallback } from 'react'

import { INIT_PAGE } from '../constant'

export const useFetch = (fetcher, params, options = {}) => {
  const { onSuccess, onError } = options
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ ...INIT_PAGE })
  const request = useCallback(async (params) => {
    setLoading(true)
    try {
      const response = await fetcher(params)
      const data = response?.data || {}
      typeof onSuccess === 'function' && onSuccess(data, params)
      setData(data.items || [])
      setPagination({
        ...pagination,
        total: data.total,
        page: params.page
      })
    } catch (error) {
      typeof onError === 'function' && onError(error, params)
    }
    setLoading(false)
  }, [fetcher])
  useEffect(() => {
    request(params)
  }, [])
  return { data, loading, pagination, request, setData }
}
