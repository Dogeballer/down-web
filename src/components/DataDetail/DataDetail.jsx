import React, { PureComponent } from 'react'

import { Input } from 'antd'

import style from './style.scss'

class DataDetail extends PureComponent {
  renderSpanOrTextArea = (result, item) => {
    return <Input.TextArea
      readOnly
      value={result[item.dataIndex]}
      className={style['detail-data-text']}
      autoSize={{minRows: 1, maxRows: 5}}
    />
  }

  renderDetailData = (result, columns) => {
    return columns.map((item, index) => {
      if (item.dataIndex !== 'index' && item.dataIndex !== 'operate') {
        return <div key={index} className={style['data-detail-item']}>
          <span title={item.title} className={style['data-detail-title']}>
            {item.title}
          </span>
          { this.renderSpanOrTextArea(result, item) }
        </div>
      }
    })
  }

  render () {
    const {
      result,
      columns
    } = this.props
    return (
      <div className={style['data-detail']}>
        {this.renderDetailData(result, columns)}
      </div>
    )
  }
}

export default DataDetail
