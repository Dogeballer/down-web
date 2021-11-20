import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import Form from 'antd4/lib/form'
import DataClassSelect from '../../../../components/DataClassSelect/DataClassSelect'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

function ClassifySetModal (props) {
  const { children, onOk, ...restProps } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const handleClick = () => {
    setVisible(true)
  }
  const handleFinish = (values) => {
    const promise = onOk(values.value)
    if (typeof promise.then === 'function') {
      setLoading(true)
      promise.then(res => {
        setLoading(false)
        setVisible(false)
      })
    }
  }
  return (
    <>
      <Button onClick={handleClick} type='primary' {...restProps}>
        {children}
      </Button>
      <Modal
        title='设置分类'
        destroyOnClose
        width={400}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form preserve={false} onFinish={handleFinish} form={form} {...layout}>
          <Form.Item name='value' label='选择分类'>
            <DataClassSelect placeholder='请选择分类' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ClassifySetModal
