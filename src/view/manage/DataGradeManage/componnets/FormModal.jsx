import React, { useEffect } from 'react'
import { Input, Modal } from 'antd'
import Form from 'antd4/lib/form'
import { NumericalInput } from '@cecdataFE/bui'
import { dataGradeCreate, dataGradeUpdate } from '../../../../api/dataGradeList'
import DataClassSelect from '../../../../components/DataClassSelect/DataClassSelect'
import AssetGradeSelect from '../../../../components/AssetGradeSelect'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

function FormModal (props) {
  const { record, visible, onCancel, onOk, ...restProps } = props
  const [form] = Form.useForm()
  useEffect(() => {
    if (!visible) {
      return
    }
    if (record) {
      form.setFieldsValue(record)
    }
  }, [visible, record])
  const handleFinish = (values) => {
    (record?.assetClassName ? dataGradeUpdate(record.assetClassName, values) : dataGradeCreate(values))
      .then(res => {
        typeof onOk === 'function' && onOk()
        typeof onCancel === 'function' && onCancel()
      })
  }
  const handleOk = () => {
    form.submit()
  }
  // console.log(record)
  return (
    <Modal
      title={record?.assetClassName ? '编辑数据分类' : '添加数据分类'}
      destroyOnClose
      width={400}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      {...restProps}
    >
      <Form preserve={false} onFinish={handleFinish} form={form} {...layout}>
        <Form.Item
          name='parentAssetClass'
          label='上级分类'
          rules={[{ required: true, message: '请选择上级分类' }]}
        >
          <DataClassSelect hasRootNode />
        </Form.Item>
        <Form.Item
          name='assetClassName'
          label='分类名称'
          rules={[{ required: true, message: '分类名称不能为空' }]}
        >
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item name='assetClassCode' label='分类编码'>
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item name='dataLevel' label='数据分级'>
          <AssetGradeSelect />
        </Form.Item>
        <Form.Item name='sortNo' label='排序'>
          <NumericalInput maxLength={10} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FormModal
