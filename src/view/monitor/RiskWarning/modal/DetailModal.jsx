import React, {useState} from 'react'
import {Modal, Input} from 'antd'

const {TextArea} = Input

export default function DetailModal(props) {
  const [data, setData] = useState()
  const [visible, setVisible] = useState(props.visible)

  const openModal = () => {
    setVisible(true)
  }

  const onOk = () => {

  }

  const onCancel = () => {
    setVisible(false)
  }

  return (
    <>
      {
        props.children && React.cloneElement(React.Children.only(props.children), {onClick: openModal})
      }
      <Modal
        width={1000}
        title={props.title}
        visible={visible}
        destroyOnClose
        maskClosable={false}
        onOk={onOk}
        onCancel={onCancel}
      >
        <TextArea readOnly={props.readOnly} defaultValue={props.value} autoSize={{minRows: 18, maxRows: 30}}/>
      </Modal>
    </>
  )
}

DetailModal.defaultProps = {
  title: '原始日志',
  readOnly: true
}

// const {getFieldDecorator} = props.form

// const onSave = () => {
//   props.form.validateFieldsAndScroll((err, values) => {
//     if (err) return
//
//   })
// }

// export default Form.create()()
