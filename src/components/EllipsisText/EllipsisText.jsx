import React from 'react'

import { Tooltip } from 'antd'

import utilities from '../../style/utilities.scss'

const EllipsisText = ({value, width, tooltip}) => (
  <Tooltip title={tooltip || (typeof value === 'string' ? value : void 0)}>
    <div style={{maxWidth: width}} className={utilities['text-ellipsis']}>
      {
        typeof value === 'function'
          ? value()
          : <span>{value !== undefined && value !== null ? `${value}` : '--'}</span>
      }
    </div>
  </Tooltip>
)

export default EllipsisText
