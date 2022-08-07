import React, { Component } from 'react'

import { message } from 'antd'
import Editor from 'react-ace'
import 'brace/mode/json'
import 'brace/mode/xml'
import 'brace/mode/sql'
import 'brace/mode/python'
import 'brace/mode/html'
import 'brace/theme/xcode'
import 'brace/theme/monokai'
import 'brace/ext/language_tools'
import { throttle } from '../../lib/throttle'

class AceEditor extends Component {
  componentDidMount = () => {
    window.addEventListener('resize', this.resizeAceEditor)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resizeAceEditor)
  }

  resizeAceEditor = throttle(() => {
    if (this.ace) this.ace.editor.resize()
  })

  onBlur = (event, e) => {
    const value = e.getValue()
    if (value.replace(/^\s+|\s+$/g, '').length !== 0 &&
    e.getSession().getAnnotations().length !== 0) { // 判断代码格式是否有误
      message.error('必须输入正确格式字符串！')
    }
  }

  render () {
    const {
      style,
      ...props
    } = this.props
    return (
      <Editor
        mode='json' // 模式
        theme='xcode' // 主题
        width='100%'
        showPrintMargin={false}
        enableBasicAutocompletion // 允许自动补全选项
        enableLiveAutocompletion
        // onBlur={this.onBlur}
        ref={ref => { this.ace = ref }}
        style={{border: '1px solid #e8e8e8', ...style}}
        {...props}
      />
    )
  }
}

export default AceEditor
