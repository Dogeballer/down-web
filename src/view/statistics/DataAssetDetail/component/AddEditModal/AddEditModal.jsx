import React, { useState, useEffect } from 'react'

import { Form } from 'antd4'
import { Modal, Input, Button } from 'antd'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import { NumericalInput } from '@cecdataFE/bui'
import { DICT_SET, modalFromLayout } from '../../../../../constant'
import DictSelect from '../../../../../components/DictSelect'
import AssetGradeSelect from '../../../../../components/AssetGradeSelect'
import IPv4Input from '../../../../../components/IPv4Input'

const AddEditModal = (props) => {
  const [form] = Form.useForm()
  const { visible, record, onOk } = props
  const [modalVisible, setModalVisible] = useState(visible)
  useEffect(() => {
    setFieldsValue()
  }, [record])
  const handleVisibleChange = () => {
    setModalVisible(!modalVisible)
  }
  const handleCancel = () => {
    setFieldsValue()
    handleVisibleChange()
  }
  const setFieldsValue = () => {
    form.setFieldsValue({ ...(record || {}) })
  }
  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      typeof onOk === 'function' && onOk(values, record)
      handleVisibleChange()
    } catch (error) {
      console.log('form commit failed:', error)
    }
  }
  return (
    <>
      {
        React.cloneElement(props.children, {
          onClick: handleVisibleChange
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
              title={`${isEmpty(record) ? '添加' : '编辑'}资产`}
              onCancel={() => setModalVisible(false)}
              footer={(
                <>
                  <Button onClick={handleCancel}>取消</Button>
                  <Button type='primary' onClick={handleOk}>确定</Button>
                </>
              )}
            >
              <Form className='smp-antd4-form' preserve={false} form={form} {...modalFromLayout.modal}>
                <Form.Item
                  label='数据资产名称'
                  name='dataAssetName'
                  rules={[{
                    required: true, message: '请输入数据资产名称'
                  }]}
                >
                  <Input maxLength={50} placeholder='请输入数据资产名称' />
                </Form.Item>
                <Form.Item
                  label='数据资产IP'
                  name='dataAssetIp'
                  rules={[{
                    required: true, message: '请输入数据资产IP'
                  }]}
                >
                  <IPv4Input maxLength={50} placeholder='请输入数据资产IP' />
                </Form.Item>
                <Form.Item
                  label='目标端口'
                  name='dataAssetPort'
                  rules={[{
                    required: true, message: '请输入目标端口'
                  }]}
                >
                  <NumericalInput maxLength={10} placeholder='请输入目标端口' />
                </Form.Item>
                <Form.Item
                  label='库实例名'
                  name='dataServerName'
                  rules={[{
                    required: true, message: '请输入库实例名'
                  }]}
                >
                  <Input maxLength={50} placeholder='请输入库实例名' />
                </Form.Item>
                <Form.Item
                  label='资产类型'
                  name='dataStorageName'
                  rules={[{
                    required: true, message: '请选择资产类型'
                  }]}
                >
                  <DictSelect placeholder='请选择资产类型' options={DICT_SET.DATA_STORAGE_CODE} />
                </Form.Item>
                <Form.Item
                  label='资产等级'
                  name='dataLevel'
                  rules={[{
                    required: true, message: '请选择资产等级'
                  }]}
                >
                  <AssetGradeSelect placeholder='请选择资产等级' />
                </Form.Item>
                <Form.Item
                  label='是否ODS'
                  name='odsStatus'
                  rules={[{
                    required: true, message: '请选择是否ODS'
                  }]}
                >
                  <DictSelect placeholder='请选择是否ODS' options={DICT_SET.DATA_ODS_STATUS} />
                </Form.Item>
              </Form>
            </Modal>
            )
          : null
      }
    </>
  )
}

export default AddEditModal
