import React, {useEffect, useState} from 'react'
import * as api from '../../../api/screen'

export const useScreenFetch = () => {
  const [data, setData] = useState({})
  useEffect(() => {
    Promise.all([
      api.getDataClassAndGradeTagStat(),
      api.getDataClassAndGradeStat(),
      api.getDataAssetsStat(),
      api.getAppAssetsStat(),
      api.getAccountStat()
    ]).then(res => {
      setData({
        res0: res[0].data,
        res1: res[1].data,
        res2: res[2].data,
        res3: res[3].data,
        res4: res[4].data,
      })
    })
  }, [])

  return data
}