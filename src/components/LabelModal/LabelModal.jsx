import React, { PureComponent } from 'react'

import { Modal, Button } from 'antd'

import {Table} from '@fishballer/bui'

import moment from 'moment'
import modelingAPI from '../../api/modeling'
import utilities from '../../style/utilities.scss'

function LabelModal (props = {}) {
  const {onOk, ...modalProps} = props
  const handleOk = () => {
    typeof onOk === 'function' && onOk()
  }

  return (
    <Modal
      centered
      destroyOnClose
      title='标注记录'
      width={800}
      maskClosable={false}
      bodyStyle={{maxHeight: 500}}
      footer={<Button type='primary' onClick={handleOk}>关闭</Button>}
      {...modalProps}
    >
      <LabelTable />
    </Modal>
  )
}

class LabelTable extends PureComponent {
  state = {
    dataList: []
  }

  componentDidMount = () => {
    modelingAPI.getDataMarkLog()
      .then(({data}) => {
        this.setState({
          dataList: data.items
        })
      })
  }

  render () {
    const {
      dataList
    } = this.state
    const columns = [
      {
        title: '时间',
        key: 'logTime',
        dataIndex: 'logTime',
        render: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '标注者',
        key: 'marker',
        dataIndex: 'marker'
      },
      {
        title: '字段',
        key: 'column',
        dataIndex: 'column'
      },
      {
        title: '中文名(旧)',
        key: 'oldNameZh',
        dataIndex: 'oldNameZh'
      },
      {
        title: '中文名(新)',
        key: 'newNameZh',
        dataIndex: 'newNameZh'
      },
      {
        title: '审核者',
        key: 'auditor',
        dataIndex: 'auditor'
      }
    ]
    return (
      <div className={utilities['table-wrapper']} style={{padding: 0}}>
        <Table
          showCollapseBtn={false}
          bordered
          columns={columns}
          dataSource={dataList}
          pagination={false}
          scroll={{x: 1200}}
          rowKey={(record, index) => `key${index}`}
        />
      </div>
    )
  }
}

export default LabelModal
