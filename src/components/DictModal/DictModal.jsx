import React, { PureComponent } from 'react'

import { Button, Modal } from 'antd'

import {Table} from '@fishballer/bui'

import modelingAPI from '../../api/modeling'
import utilities from '../../style/utilities.scss'

function DictModal (props = {}) {
  const {onOk, fieldInfo, ...modalProps} = props
  const handleOk = () => {
    typeof onOk === 'function' && onOk()
  }

  return (
    <Modal
      centered
      destroyOnClose
      title='查看字典'
      width={600}
      maskClosable={false}
      bodyStyle={{maxHeight: 600}}
      footer={<Button type='primary' onClick={handleOk}>关闭</Button>}
      {...modalProps}
    >
      <DictDetail fieldInfo={fieldInfo} />
    </Modal>
  )
}

class DictDetail extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      data: []
    }
  }

  componentDidMount = () => {
    this.getDictList(this.props.fieldInfo)
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.fieldInfo === this.props.fieldInfo) return
    this.getDictList(nextProps.fieldInfo)
  }

  getDictList = (fieldInfo) => {
    this.setState({ loading: true })
    modelingAPI.getFieldDictList({dictTableId: fieldInfo.dictTableId, typeSql: fieldInfo.dictTableSql})
      .then(({data}) => {
        this.setState({ data: data.items })
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  render () {
    const {
      data,
      loading
    } = this.state
    const columns = [
      {
        title: '代码',
        key: 'dictCode',
        dataIndex: 'dictCode'
      },
      {
        title: '名称',
        key: 'dictName',
        dataIndex: 'dictName'
      }
    ]
    return (
      <div className={utilities['table-wrapper']} style={{padding: 0}}>
        <Table
          showCollapseBtn={false}
          bordered
          rowKey={'dictCode'}
          dataSource={data}
          columns={columns}
          loading={loading}
          pagination={false}
        />
      </div>
    )
  }
}

export default DictModal
