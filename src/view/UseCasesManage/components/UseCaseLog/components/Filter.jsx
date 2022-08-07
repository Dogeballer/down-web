import React, { Component } from 'react'
import moment from 'moment'
import { Button, Form, DatePicker } from 'antd'
import utilities from '../../../../../style/utilities.scss'

const style = { marginLeft: 16, maxWidth: 180 }

class ExcuseLogFilterForm extends Component {
  submit () {
    if (typeof this.props.onSubmit === 'function') {
      this.timePromise.then(() => {
        const values = this.props.form.getFieldsValue()
        for (let key in values) {
          if (values[key] instanceof moment) {
            if (key === 'taskStartTime') {
              values[key] = values[key].startOf('day').valueOf()
            } else {
              values[key] = values[key].endOf('day').valueOf()
            }
          }
        }
        this.props.onSubmit(values)
      })
    }
  }

  timePromise = null

  componentWillMount () {
    this.timePromise = timestampGet(SERVER_CONFIG.ETL)
  }

  componentDidMount () {
    this.timePromise.then((response) => {
      const time = response.data.currentTimeMillis
      this.props.form.setFieldsValue({
        taskStartTime: moment(time).add(-6, 'days'),
        taskEndTime: moment(time)
      })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        className={utilities['query-wrapper']}
        layout='inline'
        style={{ marginBottom: 0 }}
        onSubmit={(e) => {
          e.preventDefault()
          this.submit()
        }}
      >
        {getFieldDecorator('taskStartTime')(
          <DatePicker
            style={style}
            placeholder={'开始时间'}
          />
        )}
        {getFieldDecorator('taskEndTime')(
          <DatePicker
            style={style}
            placeholder={'结束时间'}
          />
        )}
        {getFieldDecorator('executeStatus')(
          <DictSelect
            allowClear
            autoFetch={false}
            style={style}
            placeholder={'执行状态'}
            dictCode={DICT_SET.ETL_EXE_STATUS.dictCode}
            serverName={SERVER_CONFIG.ETL}
          />
        )}
        <Form.Item>
          <Button
            type='primary'
            htmlType={'submit'}>
            查询
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const ExcuseLogFilter = Form.create({ name: 'ControlColForm' })(ExcuseLogFilterForm)

export default ExcuseLogFilter
