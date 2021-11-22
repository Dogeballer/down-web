import React, { useState, useEffect } from 'react'

import { Form } from 'antd4'
import { Modal, Input, Button } from 'antd'
import { isEmpty } from '@cecdataFE/bui/dist/lib/utils'
import { getAppAssetDetailList } from '../../../../../api/appAssetDetail'
import { modalFromLayout } from '../../../../../constant'
import { FetchSelect } from '@cecdataFE/bui'

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
  const handleClick = () => {
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
              title={`${isEmpty(record) ? '添加' : '编辑'}账号`}
              onCancel={() => setModalVisible(false)}
              footer={(
                <>
                  <Button onClick={handleClick}>取消</Button>
                  <Button type='primary' onClick={handleOk}>确定</Button>
                </>
              )}
            >
              <Form className='smp-antd4-form' preserve={false} form={form} {...modalFromLayout.modal}>
                <Form.Item name='appAssetIp' noStyle>
                  <Input style={{ display: 'none' }} />
                </Form.Item>
                <Form.Item
                  label='账号名称'
                  name='appAssetUser'
                  rules={[{
                    required: true, message: '请输入账号名称'
                  }]}
                >
                  <Input maxLength={50} placeholder='请输入账号名称' />
                </Form.Item>
                <Form.Item
                  label='应用资产名称'
                  name='appAssetName'
                  rules={[{
                    required: true, message: '请输入应用资产名称'
                  }]}
                >
                  <FetchSelect
                    autoFetch
                    searchable
                    placeholder='应用资产名称'
                    fetch={getAppAssetDetailList}
                    style={{ width: '100%' }}
                    optionsGet={(response) => (response.data || []).map(
                      ({ appAssetIp, appAssetName }) => {
                        return {
                          ip: appAssetIp,
                          value: appAssetName,
                          title: appAssetName
                        }
                      })}
                    onChange={(value, option) => {
                      const { origin } = option.props
                      form.setFieldsValue({
                        appAssetIp: origin?.ip,
                        appAssetName: value
                      })
                    }}
                  />
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