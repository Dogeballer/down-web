import React, {useState} from 'react'
import {Modal, Select, DatePicker, message} from 'antd'
import { Form } from 'antd4'
import {DICT_SET} from "../../../../constant";
import * as api from "../../../../api/logs";
import moment from "moment";

const {Option} = Select


export default function (props) {
  const [visible, setVisible] = useState(props.visible)
  const [form] = Form.useForm()

  const openModal = () => {
    setVisible(true)
  }

  const onOk = () => {
    form.validateFields().then(values => {
      if (values.startDate.isAfter(values.endDate) || values.startDate.format('YYYYMMDD') === values.endDate.format('YYYYMMDD')) {
        return message.warn('开始时间不能大于等于结束时间')
      }
      window.open(api.getExportLogByDateUrl({
        ...values,
        startDate: values.startDate.format('YYYYMMDD'),
        endDate: values.endDate.format('YYYYMMDD'),
      }), '_blank')
    })
  }

  const onCancel = () => {
    setVisible(false)
  }

  return (
    <React.Fragment>
      {
        props.children && React.cloneElement(React.Children.only(props.children), {onClick: openModal})
      }
      <Modal
        title='导出日志'
        visible={visible}
        destroyOnClose
        maskClosable={false}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ logType: 0, startDate: moment().subtract(6, 'days'), endDate: moment() }}
          autoComplete="off"
        >
          <Form.Item
            label="日志类型"
            name="logType"
            rules={[{ required: true}]}
          >
            <Select>
              <Option value={0}>不限类型</Option>
              {
                DICT_SET.LOG_TYPES.map(v =><Option value={v.value} key={v.value}>{v.text}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="开始时间"
            name="startDate"
            rules={[{ required: true}]}
          >
            <DatePicker style={{width: '100%'}} placeholder='开始时间' allowClear={false} />
          </Form.Item>
          <Form.Item
            label="结束时间"
            name="endDate"
            rules={[{ required: true}]}
          >
            <DatePicker style={{width: '100%'}} placeholder='结束时间' allowClear={false} />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}