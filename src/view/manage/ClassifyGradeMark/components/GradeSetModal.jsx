import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import Form from 'antd4/lib/form'
import AssetGradeSelect from '../../../../components/AssetGradeSelect'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}

function GradeSetModal (props) {
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
        title='设置分级'
        destroyOnClose
        width={400}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
      >
        <Form preserve={false} onFinish={handleFinish} form={form} {...layout}>
          <Form.Item name='value' label='选择分级'>
            <AssetGradeSelect placeholder='请选择分级' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default GradeSetModal
