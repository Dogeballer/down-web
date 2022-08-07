import React, { Component } from 'react'
// import style from './style.scss'
import TableTransfer from './TableTransfer'
import {
  Switch, Modal
} from 'antd'

class ReferenceModal extends Component {

    state = {
      targetKeys: [],
      disabled: false,
      showSearch: false
    }

      onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys })
      }

      triggerDisable = disabled => {
        this.setState({ disabled })
      }

      triggerShowSearch = showSearch => {
        this.setState({ showSearch })
      }
      render () {
        const { targetKeys, disabled, showSearch } = this.state
        const {
        //   onOk,
          onCancel,
          ...restProps
        } = this.props
        return (
          <Modal
            centered
            destroyOnClose
            width={800}
            maskClosable={false}
            onCancel={onCancel}
            title={'引用模型'}
            {...restProps}
          >
            <div>
              {/* className={style['reference-modal-wrapper']}> */}
              <TableTransfer
                dataSource={[]}
                targetKeys={targetKeys}
                disabled={disabled}
                showSearch={showSearch}
                onChange={this.onChange}
                filterOption={(inputValue, item) =>
                  item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
                }
                leftColumns={[]}
                rightColumns={[]}
              />
              <Switch
                unCheckedChildren='disabled'
                checkedChildren='disabled'
                checked={disabled}
                onChange={this.triggerDisable}
                style={{ marginTop: 16 }}
              />
              <Switch
                unCheckedChildren='showSearch'
                checkedChildren='showSearch'
                checked={showSearch}
                onChange={this.triggerShowSearch}
                style={{ marginTop: 16 }}
              />
            </div>
          </Modal>
        )
      }
}

export default ReferenceModal
