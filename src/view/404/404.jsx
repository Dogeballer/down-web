import React, { Component } from 'react'

import { Button } from 'antd'

import style from './style.scss'

import { history } from '@cecdataFE/bui'

class NotFoundedPage extends Component {
  goBack = () => {
    history.goBack()
  }
  goHome = () => {
    history.push('/')
  }
  render () {
    return (
      <div className={style['nopage']}>
        <div className={style['nopage-content']}>
          <i className={style['nopage-img']} />
          <p className={style['nopage-text']}>抱歉，你访问的页面没有找到。</p>
          <div className={style['nopage-back']}>
            <div className={style['nopage-back-btn']}>
              <Button type='primary' onClick={this.goBack}>返回上一页</Button>
            </div>
            <div className={style['nopage-back-btn']}>
              <Button type='primary' onClick={this.goHome}>首页</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NotFoundedPage
