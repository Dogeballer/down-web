import React, {Component} from 'react'
import { message } from 'antd'
import InfinityTable from '../InfinityTable'
import utilities from '../../style/utilities.scss'
import { toBlank } from '../../lib/utils'

const Table = InfinityTable

const PAGE_SIZE = 20

class ScrollTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollY: 300,
      loading: false,
      dataSource: [],
      hasMore: true
    }
    this.divRef = null
    this.topRef = null
  }

  componentDidMount = () => {
    if (this.props.autoFetch) this.getData()
    this.handleHeight()
    window.addEventListener('resize', this.handleHeight)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleHeight)
  }

  handleHeight = () => {
    if (!this.divRef) return
    const {
      height
    } = this.props
    let scrollY
    if (height) {
      scrollY = height
    } else {
      scrollY = this.divRef.clientHeight - this.topRef.clientHeight - 24 // padding
      const thead = this.divRef.querySelector('table > thead') // thead高度
      if (thead) scrollY = scrollY - thead.clientHeight
    }
    this.setState({ scrollY })
  }

  getData = (values) => {
    this.setState({loading: true})
    this.props.dataFetch({...this.props.params, pageSize: 20, ...values})
      .then(response => {
        if (response.code === 0) {
          const {dataList, operationHandle, hasMoreRows} = response.data
          this.setState({
            dataSource: dataList,
            operationHandle: operationHandle,
            hasMoreRows: hasMoreRows
          })
          this.props.onload && this.props.onload(response.data)
        }
      }).finally(() => {
        this.setState({loading: false})
      })
  }

  handleFetch = () => {
    const { field } = this.props
    const {operationHandle, hasMoreRows, dataSource} = this.state
    if (operationHandle === void 0 || hasMoreRows === void 0) return
    if (hasMoreRows === false) return message.success('数据已下载完毕')
    this.setState({loading: true})
    this.props.loadMore({pageSize: PAGE_SIZE, ...operationHandle, field})
      .then(response => {
        if (response.code === 0) {
          const dataList = response.data.dataList
          this.setState({
            dataSource: [...dataSource, ...dataList],
            operationHandle: response.data.operationHandle,
            hasMoreRows: response.data.hasMoreRows
          })
        }
      }).finally(() => {
        this.setState({loading: false})
      })
  }

  render () {
    const { dataSource, loading, scrollY } = this.state
    const { style, className, tableProps } = this.props
    const { rowKey, columns, scrollX, ...otherProps } = tableProps
    return (
      <div
        ref={ref => { this.divRef = ref }}
        className={`${utilities['table-wrapper']} ${toBlank(className)}`}
        style={style}
      >
        <div ref={ref => { this.topRef = ref }}>{this.props.top}</div>
        <Table
          bordered
          rowKey={rowKey}
          loading={loading}
          columns={columns}
          pageSize={PAGE_SIZE}
          onFetch={this.handleFetch}
          dataSource={dataSource}
          {...otherProps}
          scroll={{ x: scrollX, y: scrollY }}
          pagination={false}
        />
      </div>

    )
  }
}

export default ScrollTable
