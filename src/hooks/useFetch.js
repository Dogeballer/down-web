import React, { useState, useEffect, useCallback } from 'react'
import { INIT_PAGE } from '../constant';

export const useFetch = (fetcher, params, options = {}) => {
  const { onSuccess, onError } = options
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [pagination, setPagination] = useState({ ...INIT_PAGE })
  const request = useCallback( async () => {
    setLoading(true);
    try {
      // const data = await fetcher(params)
      const data = []
      typeof onSuccess === 'function' && onSuccess(data, params)
      setData(data)
      setPagination({
        ...pagination,
        total: data.total,
        page: params.page
      })
    } catch (error) {
      setIsError(true)
      typeof onError === 'function' && onError(error, params)
    }
    setLoading(false);
  }, [fetcher, ...Object.values(params)])
  useEffect(() => {
    request()
  }, Object.values(params))
  return { data, pagination, loading, setData, isError, request }
}
