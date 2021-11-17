import React, { useState, useEffect, Fragment } from 'react'

import { Form } from 'antd4'
import { Modal, Input, Button, Select } from 'antd'
import { isEmpty } from "@cecdataFE/bui/dist/lib/utils";
import { modalFromLayout } from "../../../../../constant";

const Option = Select.Option
const AddEditModal = (props) => {
  const [ form ] = Form.useForm()
  const { visible, record, onSuccess } = props
  const [modalVisible, setModalVisible] = useState(visible)
  useEffect(() => {

  }, [])
  const handleClick = () => {
    setModalVisible(!modalVisible)
  }
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      typeof onSuccess === 'function' && onSuccess(values)
    } catch (error) {
      console.log('form commit failed:', error)
    }
  }
  return (
    <Fragment>
      {
        React.cloneElement(props.children, {
          onClick: handleClick
        })
      }
      {
        modalVisible
          ? (
            <Modal
              visible
              centered
              destroyOnClose
              width={500}
              title={`${isEmpty(record) ? '新增' : '编辑'}资产`}
              onCancel={() => setModalVisible(false)}
              footer={(
                <Fragment>
                  <Button type='primary' onClick={handleClick}>取消</Button>
                  <Button type='primary' onClick={handleOk}>确定</Button>
                </Fragment>
              )}
            >
              <Form form={form} {...modalFromLayout.modal}>
                <Form.Item
                  label='数据资产名称'
                  name='dataAssetName'
                  rules={[{
                    required: true, message: '请输入数据资产名称'
                  }]}
                >
                  <Input placeholder='请输入数据资产名称' />
                </Form.Item>
                <Form.Item
                  label='数据资产IP'
                  name='dataAssetIp'
                  rules={[{
                    required: true, message: '请输入数据资产IP'
                  }]}
                >
                  <Input placeholder='请输入数据资产IP' />
                </Form.Item>
                <Form.Item
                  label='目标端口'
                  name='dataAssetHost'
                  rules={[{
                    required: true, message: '请输入目标端口'
                  }]}
                >
                  <Input placeholder='请输入目标端口' />
                </Form.Item>
                <Form.Item
                  label='库实例名'
                  name='dataServerName'
                  rules={[{
                    required: true, message: '请输入库实例名'
                  }]}
                >
                  <Input placeholder='请输入库实例名' />
                </Form.Item>
                <Form.Item
                  label='资产类型'
                  name='dataStorageCode'
                  rules={[{
                    required: true, message: '请选择资产类型'
                  }]}
                >
                  <Select
                    allowClear
                    placeholder='请选择资产类型'
                  >
                    <Option value={1}>HIVE</Option>
                    <Option value={2}>KUDU</Option>
                    <Option value={3}>HBASE</Option>
                    <Option value={4}>ES</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label='资产等级'
                  name='dataLevel'
                  rules={[{
                    required: true, message: '请选择资产等级'
                  }]}
                >
                  <Select
                    allowClear
                    placeholder='请选择资产等级'
                  >
                    <Option value={1}>1级 公开数据</Option>
                    <Option value={2}>2级 受限数据</Option>
                    <Option value={3}>3级 敏感数据</Option>
                    <Option value={4}>4级 涉密数据</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label='状态'
                  name='status'
                  rules={[{
                    required: true, message: '请选择状态'
                  }]}
                >
                  <Select
                    allowClear
                    placeholder='请选择状态'
                  >
                    <Option value={1}>正常</Option>
                    <Option value={0}>禁用</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          )
          : null
      }
    </Fragment>
  )
}

export default AddEditModal
