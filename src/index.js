import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { setDefaultUrl } from '@cecdataFE/bui/dist/components/IconSelect'
import './api/common/axiosInit'

setDefaultUrl(window.__smp_config.ICON_URL)

ReactDOM.render(
  <App />,
  window.document.getElementById('app')
)
