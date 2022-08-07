import useHeightKeep from '../hooks/useHeightKeep'
import React, { useRef } from 'react'
import '../../style/common.g.scss'

function HeightKeepWrapper (props) {
  const { children, minus, ...restProps } = props
  const wrapperRef = useRef()
  const height = useHeightKeep(wrapperRef)

  return (
    <div ref={wrapperRef} className={'etl-height-100'} {...restProps} style={{ overflow: 'auto' }}>
      {children(height > minus ? height - minus : height)}
    </div>
  )
}

export default HeightKeepWrapper
