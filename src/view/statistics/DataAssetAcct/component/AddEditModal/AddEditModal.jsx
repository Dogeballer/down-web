import React, { useState, useEffect } from 'react'

import { Form } from 'antd4'
import { Modal, Input, Button } from 'antd'
import { FetchSelect } from '@cecdataFE/bui'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import { getDataAssetDetailList } from '../../../../../api/dataAssetDetail'
import { modalFromLayout } from '../../../../../constant'

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
              title={`${isEmpty(record) ? '添加' : '编辑'}账号`}
              onCancel={() => setModalVisible(false)}
              footer={(
                <>
                  <Button onClick={handleCancel}>取消</Button>
                  <Button type='primary' onClick={handleOk}>确定</Button>
                </>
              )}
            >
              <Form className='smp-antd4-form' preserve={false} form={form} {...modalFromLayout.modal}>
                <Form.Item name='dataAssetIp' noStyle>
                  <Input style={{ display: 'none' }} />
                </Form.Item>
                <Form.Item name='dataStorageName' noStyle>
                  <Input style={{ display: 'none' }} />
                </Form.Item>
                <Form.Item
                  label='账号名称'
                  name='userName'
                  rules={[{
                    required: true, message: '请输入账号名称'
                  }]}
                >
                  <Input maxLength={50} placeholder='请输入账号名称' />
                </Form.Item>
                <Form.Item
                  label='数据资产名称'
                  name='dataAssetName'
                  rules={[{
                    required: true, message: '请输入数据资产名称'
                  }]}
                >
                  <FetchSelect
                    autoFetch
                    searchable
                    placeholder='数据资产名称'
                    fetch={getDataAssetDetailList}
                    style={{ width: '100%' }}
                    optionsGet={(response) => (response.data || []).map(
                      ({ dataAssetIp, dataAssetName, dataStorageName }) => {
                        return {
                          ip: dataAssetIp,
                          value: dataAssetName,
                          title: dataAssetName,
                          storage: dataStorageName
                        }
                      })}
                    onChange={(value, { origin }) => {
                      form.setFieldsValue({
                        dataAssetIp: origin.ip,
                        dataAssetName: value,
                        dataStorageName: origin.storage
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='资产类型'
                  name='dataStorageName'
                  rules={[{
                    required: true, message: '请选择资产类型'
                  }]}
                >
                  <Input disabled />
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
