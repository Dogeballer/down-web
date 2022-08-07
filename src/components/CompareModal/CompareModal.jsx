import React, { Component, Fragment } from 'react'
import { Modal, Empty, Tooltip } from 'antd'
import { isEmpty } from '@fishballer/bui/dist/lib/utils'
import style from './style.scss'

class CompareModal extends Component {
  constructor () {
    super()
    this.state = {
      visible: false,
      list: []
    }
  }

  componentDidMount () {
    this.props.onRef(this)
  }

  dataFetch (id) {
    this.props.dataFetch(id)
      .then(({data}) => {
        this.setState({ list: data.items })
      })
      .finally(() => {
        this.setState({ visible: true })
      })
  }

  showModal = (id) => {
    this.dataFetch(id)
  }

  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  renderListItem = (list) => (list || []).map((item, index) =>
    <div className={style['compare-item']} key={index}>
      <span className={style['compare-item-title']} title={item.changeFieldZh}>{item.changeFieldZh}</span>
      {
        !isEmpty(item.before) && <Fragment>
          <Tooltip placement='top' title={item.before}>
            <span className={style['compare-item-span']}>{item.before}</span>
          </Tooltip>
          <span className={style['compare-item-span']}>{`->`}</span>
        </Fragment>
      }
      <Tooltip placement='top' title={item.after}>
        <span className={style['compare-item-span']}>{item.after}</span>
      </Tooltip>
    </div>)

  render () {
    const { list, visible } = this.state
    return (
      <Modal
        width={800}
        title='修改内容详情'
        visible={visible}
        onCancel={this.handleCancel}
        bodyStyle={{maxHeight: 600, overflow: 'auto'}}
        footer={null}
      >
        <div className={style['compare-modal-wapper']}>
          { !list ? (<Empty />) : this.renderListItem(list) }
        </div>
      </Modal>
    )
  }
}

export default CompareModal
