import React, { Component } from 'react'

import moment from 'moment'
import { ConfigProvider } from 'antd'
import { ConfigProvider as ConfigProvider4 } from 'antd4'
import Routers from './route'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import zhCN4 from 'antd4/lib/locale/zh_CN'
import 'moment/locale/zh-cn'
import './style/index.g.scss'
import './style/global.g.scss'
import '@cecdataFE/bui/dist/style/index.css'

moment.locale('zh-cn')

class App extends Component {
  render () {
    return (
      <ConfigProvider locale={zhCN}>
        <ConfigProvider4 locale={zhCN4}>
          <Routers />
        </ConfigProvider4>
      </ConfigProvider>
    )
  }
}

export default App
