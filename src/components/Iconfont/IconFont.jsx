import React from 'react'

import { Icon } from '@fishballer/bui'

const IconFont = (props) => {
  const {
    title,
    type,
    style,
    position,
    ...otherProps
  } = props
  return (
    <span
      aria-label={title}
      data-balloon-pos={position === 0 ? 'down' : 'up'}
    >
      <Icon
        type={type}
        style={style}
        {...otherProps}
      />
    </span>
  )
}
export default IconFont
