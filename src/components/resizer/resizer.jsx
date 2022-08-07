import style from './style.scss'
import React, { Component } from 'react'
import {
  Icon as IconFont
} from '@fishballer/bui'
import { toBlank } from '../../lib/utils'

const MAX_RISIZER_WIDTH = 500
const MIN_RISIZER_WIDTH = 200

/**
 * @constructor Resizer
 * @description 拖动改变大小控件
 * @author 谢文通
 * @param props
 * @param {Node|Component} props.left - 左边组件
 * @param {Node|Component} props.right - 右边组件
 * @param {function} props.onResize - 改变大小的事件
 * @param {function} props.onResize - 改变大小的事件
 * @param {boolean} props.resizeRight - 缩放右边区域
 * @param {number} props.margin - 两个控件之间的间距
 */
class Resizer extends Component {
  state = {
    resizerWidth: this.props.initwidth || 275
  }

  resize (resizerWidth) {
    this.setState({resizerWidth})
  }

  componentDidMount () {
    this.clickLine.addEventListener('mousedown', this.onMouseDownHandler)
  }

  componentWillUnmount () {
    this.clickLine.removeEventListener('mousedown', this.onMouseDownHandler)
  }

  isRealClick = true;
  onMouseDownHandler = e => {
    const x1 = e.clientX
    const originWidth = this.props.resizeRight ? this.right.offsetWidth : this.left.offsetWidth
    const firstTime = Date.now()
    // 给可视区域添加鼠标的移动事件
    let moveHandler = (ev) => {
      // 获取鼠标移动时的坐标
      const x2 = ev.clientX
      // 计算出鼠标的移动距离
      let width = this.props.resizeRight ? (originWidth - (x2 - x1)) : (x2 - x1 + originWidth)

      if (width < MIN_RISIZER_WIDTH) {
        width = MIN_RISIZER_WIDTH
      } else if (width > MAX_RISIZER_WIDTH) {
        width = MAX_RISIZER_WIDTH
      }
      // 得出元素的新高度
      this.resize(width)

      typeof this.props.onResize === 'function' && this.props.onResize()
    }

    let upHandler = () => {
      document.removeEventListener('mousemove', moveHandler)
      document.removeEventListener('mouseup', upHandler)
      document.body.style.userSelect = 'auto'

      this.isRealClick = Date.now() - firstTime < 300
    }

    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', upHandler)
  }

  lastWidth = 0;
  onClickHandler = () => {
    if (!this.isRealClick) {
      return
    }
    const {resizerWidth} = this.state
    if (resizerWidth === 0) {
      this.clickLine.addEventListener('mousedown', this.onMouseDownHandler)
      this.setState({
        resizerWidth: this.lastWidth
      })
    } else {
      this.clickLine.removeEventListener('mousedown', this.onMouseDownHandler)
      this.lastWidth = resizerWidth
      this.setState({
        resizerWidth: 0
      })
    }
    typeof this.props.onResize === 'function' && this.props.onResize()
  }

  render () {
    const {resizerWidth} = this.state
    const {resizeRight, onResize, left, right, margin, className, ...props} = this.props || {}
    const leftStyle = {
      marginRight: `${resizerWidth ? (margin || 16) : 0}px`,
      width: resizeRight ? `calc(100% - ${resizerWidth + margin}px)` : `${resizerWidth}px`
    }
    return (
      <div
        className={style['resizer'] + ' ' + toBlank(className)}
        {...props}
      >
        <div
          style={leftStyle}
          className={`${style['resizer-box']}`}
          ref={ref => { this.left = ref }}
        >
          {left}
        </div>
        <div
          ref={ref => { this.clickLine = ref }}
          style={{
            display: `${resizeRight ? 'none' : 'block'}`,
            [resizeRight ? 'right' : 'left']: `${resizerWidth - 8}px`,
            transform: resizeRight ? 'rotate(180deg)' : ''}}
          className={style['resizer-line'] + (resizerWidth === 0 ? ' close' : '')}
          onClick={this.onClickHandler}
        >
          <IconFont type={'icon-ResizeLeft'} style={{color: '#C0C0C0'}} />
        </div>
        <div
          className={`${style['resizer-box']} right`}
          ref={ref => { this.right = ref }}
        >
          {right}
        </div>
      </div>
    )
  }
}

export default Resizer
