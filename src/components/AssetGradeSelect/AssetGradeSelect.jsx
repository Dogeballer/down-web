import React from 'react'

import { FetchSelect } from '@fishballer/bui'
import { getAssetGradeList } from '../../api/other'

const AssetGradeSelect = (props) => {
  return (
    <FetchSelect
      autoFetch
      fetch={getAssetGradeList}
      optionsGet={(response) => (response.data || []).map(
        ({ assetGradeName }) => {
          return {
            value: assetGradeName,
            title: assetGradeName
          }
        })}
      {...props}
    />
  )
}

export default AssetGradeSelect
