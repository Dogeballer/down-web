import React, { useState, Fragment } from 'react'

import { Button, Modal } from 'antd'
import SQLInput from '../SQLInput/SQLInput'

const SqlViewer = (props = {}) => {
  const [visible, setVisible] = useState(false)
  const {
    type,
    name,
    handleClick,
    sqlInfo,
    modalTitle,
    modalWidth,
    modalHeight,
    ...restProps
  } = props
  return (
    <Fragment>
      <Button
        type={type || 'primary'}
        onClick={() => {
          if (handleClick) {
            handleClick(() => setVisible(true))
          } else {
            setVisible(true)
          }
        }}
        {...restProps}
      >
        {name || '按钮'}
      </Button>
      {
        visible
          ? <Modal
            visible
            centered
            destroyOnClose
            title={modalTitle || name || '模态框'}
            width={modalWidth || 600}
            maskClosable={false}
            bodyStyle={{ height: modalHeight || 600 }}
            onCancel={() => setVisible(false)}
            footer={<Button
              type='primary'
              onClick={() => setVisible(false)}
            >
              关闭
            </Button>}
          >
            <SQLInput height='100%' value={sqlInfo} />
          </Modal>
          : null
      }
    </Fragment>
  )
}

export default SqlViewer
