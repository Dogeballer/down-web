import React from 'react'

import { Form } from 'antd4'
import { Button, Input, Select } from 'antd'
import DictSelect from '../../../../../components/DictSelect'
import { DICT_SET } from '../../../../../constant'

const Option = Select.Option
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
        name='fileAssetName'
      >
        <Input
          allowClear
          placeholder='文件名称'
          style={{ width: 200 }}
          maxLength={50}
        />
      </Form.Item>
      <Form.Item
        name='fileServerIp'
      >
        <Input
          allowClear
          placeholder='资产IP'
          style={{ width: 200 }}
          maxLength={20}
        />
      </Form.Item>
      <Form.Item
        name='fileType'
      >
        <Select
          allowClear
          placeholder='文件类型'
          style={{ width: 150 }}
        >
          <Option value='数据文件'>数据文件</Option>
          <Option value='影像文件'>影像文件</Option>
        </Select>
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
