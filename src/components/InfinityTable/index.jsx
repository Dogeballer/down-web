import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { bool, number, array, object, func } from 'prop-types'
import { Table } from '@fishballer/bui'

class InfinityTable extends PureComponent {
  componentDidMount () {
    this.init()
  }
  componentWillUnmount () {
    this.props.onScroll && this.refScroll.removeEventListener('scroll', this.props.onScroll)
    this.toggleObserver(false)
    this.io.disconnect()
  }

  init = () => {
    this.refScroll = ReactDOM.findDOMNode(this).getElementsByClassName('ant-table-body')[0]
    if (!this.refScroll) return
    this.refTable = this.refScroll.getElementsByTagName('tbody')[0]
    this.createUnderPlaceholder()
    this.props.onScroll && this.refScroll.addEventListener('scroll', this.props.onScroll)
    this.io = new IntersectionObserver(
      changes => {
        if (this.scrollTop && Math.abs(this.refScroll.scrollTop - this.scrollTop) < 20) return
        this.ioTargetState = changes.reduce((result, change) => {
          const ret = { ...result }
          switch (change.target) {
            case this.refUnderPlaceholder:
              ret.refUnderPlaceholder = change
              break
            case this.refTable:
              ret.refTable = change
              break
            default:
              console.warn('Miss match dom', change)
          }
          return ret
        }, this.ioTargetState)

        const {
          refUnderPlaceholder
        } = this.ioTargetState

        if (refUnderPlaceholder.intersectionRatio > 0) {
          this.props.onFetch()
        }
      },
      {
        rootMargin: '0px 0px 100px 0px',
        root: this.refScroll
      }
    )
    this.toggleObserver()
  }

  refScroll = null
  refTable = null
  refUnderPlaceholder = null

  ioTargetState = {
    refUnderPlaceholder: null,
    refTable: null
  }
  // 创建底部填充块
  createUnderPlaceholder () {
    const refUnderPlaceholder = document.createElement('div')
    refUnderPlaceholder.setAttribute('id', 'refUnderPlaceholder')
    this.refScroll.appendChild(refUnderPlaceholder)
    this.refUnderPlaceholder = refUnderPlaceholder
  }
  toggleObserver (condition = true) {
    if (condition) {
      this.io.observe(this.refUnderPlaceholder)
    } else {
      this.io.unobserve(this.refUnderPlaceholder)
      this.io.unobserve(this.refTable)
    }
  }

  render () {
    const {
      dataSource,
      pageSize,
      forwardedRef,
      loading,
      columns,
      ...rest
    } = this.props

    return (
      <Table
        {...rest}
        ref={forwardedRef}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
      />
    )
  }
}
InfinityTable.defaultProps = {
  onScroll: null, // 滚动事件
  onFetch: () => {}, // 滚动到低部触发Fetch方法
  sumData: null, // 合计行
  debug: false, // display console log for debug
  loading: false, // 是否loading状态
  pageSize: 30 // 真实DOM大小，Reality DOM row count
}

InfinityTable.propTypes = {
  onScroll: func, // 滚动事件
  onFetch: func, // 滚动到低部触发Fetch方法
  sumData: array, // 合计行
  dataSource: array.isRequired,
  columns: array.isRequired,
  forwardedRef: object,
  debug: bool,
  pageSize: number,
  loading: bool
}

export default React.forwardRef((props, ref) => (
  <InfinityTable {...props} forwardedRef={ref} />
))

export { InfinityTable }
