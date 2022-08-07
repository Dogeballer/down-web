import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Spin } from 'antd'

import style from './style.scss'

class CommonLoading extends Component {
  static defaultProps = {
    delay: 0
  }

  state = {
    loading: false
  }

  open = () => {
    this.setState({
      loading: true
    })
  }

  close = () => {
    this.setState({
      loading: false
    })
  }

  render () {
    const {
      delay
    } = this.props
    const {
      loading
    } = this.state
    return (
      <div className={style['common-loading']} style={{zIndex: loading ? 9999 : -9999, display: loading ? 'block' : 'none'}}>
        <div className={style['common-loading-wrapper']}>
          <Spin
            size='large'
            tip='加载中...'
            delay={delay}
            spinning={loading}
          />
        </div>
      </div>
    )
  }
}

CommonLoading.instance = function loadingInstance (properties, callback) {
  const { getContainer, ...props } = properties || {}

  const div = document.createElement('div')

  if (getContainer) {
    const root = getContainer()
    root.appendChild(div)
  } else {
    document.body.appendChild(div)
  }

  let called = false

  function ref (commonLoading) {
    if (called) return

    called = true

    const commonloadingMethods = {
      open () {
        commonLoading.open()
      },
      close () {
        commonLoading.close()
      },
      component: commonLoading,
      destory () {
        ReactDOM.unmountComponentAtNode(div)
        div.parentNode.removeChild(div)
      }
    }

    callback(commonloadingMethods)
  }
  ReactDOM.render(<CommonLoading {...props} ref={ref} />, div)
}

export default CommonLoading
