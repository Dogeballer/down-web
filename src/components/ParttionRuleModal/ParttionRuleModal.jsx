import React, { useState, PureComponent, Fragment } from 'react'

import { Select, Modal, Button } from 'antd'

import { DICT_SET, SERVER_CONFIG } from '../../constant'
import dictionaryAPI from '../../api/dictionary'
import modelingAPI from '../../api/modeling'

const Option = Select.Option
function ParttionRuleModal (props = {}) {
  const {onOk, onCancel, tableId, fieldId, ...modalProps} = props
  const [rangePartitionInterval, setRangePartitionInterval] = useState(void 0)
  const [initSingleInterval, setInitSingleInterval] = useState(false)

  const handleOk = () => {
    typeof onOk === 'function' && onOk(rangePartitionInterval)
  }

  return (
    <Modal
      centered
      destroyOnClose
      title='自动分区'
      width={600}
      maskClosable={false}
      bodyStyle={{maxHeight: 450}}
      onCancel={onCancel}
      footer={<Fragment>
        <Button type='primary' onClick={onCancel}>取消</Button>
        {
          !initSingleInterval
            ? <Button type='primary' onClick={handleOk} style={{marginLeft: 16}}>确认</Button>
            : null
        }
      </Fragment>}
      {...modalProps}
    >
      <ParttionRule
        tableId={tableId}
        fieldId={fieldId}
        initSingleInterval={initSingleInterval}
        setInitSingleInterval={setInitSingleInterval}
        rangePartitionInterval={rangePartitionInterval}
        setRangePartitionInterval={setRangePartitionInterval}
      />
    </Modal>
  )
}

class ParttionRule extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount = () => {
    const {
      tableId,
      fieldId
    } = this.props
    this.getData({tableId, fieldId})
    this.getDictList(DICT_SET.MODELING_PARTITION_INTERVAL.dictCode)
  }

  getData = (params) => {
    modelingAPI.getPartitionInfo(params)
      .then(({data}) => {
        const rangePartitionInterval = data.partitionRule.rangePartitionInterval
        this.props.setRangePartitionInterval(rangePartitionInterval)
        if (rangePartitionInterval === 3) this.props.setInitSingleInterval(true)
      })
  }

  getDictList = (dictCode) => {
    this.setState({ loading: true })
    dictionaryAPI.getDictList(dictCode, SERVER_CONFIG.MODEL)
      .then(({data}) => {
        data.items.forEach(item => {
          item.value = item.dictNum
          item.name = item.dictName
        })
        this.setState({ data: data.items })
      })
  }

  render () {
    const { data } = this.state
    return (
      <div>
        <div style={{display: 'flex'}}>
          <span style={{width: 80, lineHeight: '32px'}}>分区规则</span>
          <Select
            allowClear
            placeholder='分区规则'
            value={this.props.rangePartitionInterval}
            onChange={(value) => this.props.setRangePartitionInterval(value)}
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          >
            {
              (data || []).map(item => <Option
                key={item.dictNum} value={item.dictNum}>
                {item.dictName}
              </Option>)
            }
          </Select>
        </div>
        {
          this.props.rangePartitionInterval !== 3
            ? <p style={{marginTop: 16, marginLeft: 64}}>仅对12个月后的分区生效</p>
            : null
        }
      </div>
    )
  }
}

export default ParttionRuleModal
