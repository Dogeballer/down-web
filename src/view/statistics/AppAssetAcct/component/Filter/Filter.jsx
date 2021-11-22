import React from 'react'

import { Form } from 'antd4'
import { Button, Input } from 'antd'

const Filter = (props) => {
  const { onSubmit, children } = props
  const [form] = Form.useForm()
  return (
    <Form
      form={form}
      layout='inline'
      className='smp-antd4-filter'
      onFinish={(values) => {
        typeof onSubmit === 'function' && onSubmit(values)
      }}
    >
      <Form.Item
        name='appAssetUser'
      >
        <Input
          allowClear
          placeholder='账号名称'
          style={{ width: 200 }}
          maxLength={50}
        />
      </Form.Item>
      <Form.Item
        name='appAssetName'
      >
        <Input
          allowClear
          placeholder='资产名称'
          style={{ width: 200 }}
          maxLength={50}
        />
      </Form.Item>
      <Form.Item>
        <Button
          icon='search'
          type='primary'
          htmlType='submit'
        >
          查询
        </Button>
      </Form.Item>
      {children}
    </Form>
  )
}

export default Filter