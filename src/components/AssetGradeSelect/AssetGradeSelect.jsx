import React from 'react'

import { FetchSelect } from '@cecdataFE/bui'
import { getAssetGradeList } from '../../api/other'

const AssetGradeSelect = (props) => {
  return (
    <FetchSelect
      autoFetch
      searchable
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
