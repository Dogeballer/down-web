import React, { Component } from 'react'
import style from './style.scss'
import { Button } from 'antd'
import IconFont from '../Iconfont'

class PageHeader extends Component {
  render () {
    const {
      title,
      onClick,
      showBackBtn,
      heardStyle
    } = this.props
    return (
      <div className={style['page-header']} style={heardStyle}>
        <span className={style['page-title']}>{title}</span>
        {
          showBackBtn
            ? <Button type='primary' onClick={onClick}>
              <IconFont type={'icon-Return'} />
              {` 返回列表`}
            </Button>
            : null
        }
      </div>
    )
  }
}
export default PageHeader
