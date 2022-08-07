import AceEditor from 'react-ace'
import React, { Component } from 'react'

import 'brace/mode/sql'
import 'brace/theme/xcode'
import { throttle } from '../../lib/throttle'

class SQLInput extends Component {
  componentDidMount = () => {
    setTimeout(this.resizeAceEditor, 100)
    window.addEventListener('resize', this.resizeAceEditor)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resizeAceEditor)
  }

  resizeAceEditor = throttle(() => {
    if (this.ace) this.ace.editor.resize()
  })

  render () {
    const {
      style,
      ...props
    } = this.props
    return (
      <AceEditor
        mode='sql'
        theme='xcode'
        width={'100%'}
        showPrintMargin={false}
        style={{border: '1px solid #e8e8e8', ...style}}
        ref={ref => { this.ace = ref }}
        {...props}
      />
    )
  }
}

export default SQLInput
