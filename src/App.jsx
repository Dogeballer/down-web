import React, { Component } from 'react'

import moment from 'moment'
import { ConfigProvider } from 'antd'
import Routers from './route'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import './style/index.g.scss'
import './style/global.g.scss'
import '@cecdataFE/bui/dist/style/index.css'

moment.locale('zh-cn')

class App extends Component {
  render () {
    return (
      <ConfigProvider locale={zhCN}>
        <Routers />
      </ConfigProvider>
    )
  }
}

export default App
