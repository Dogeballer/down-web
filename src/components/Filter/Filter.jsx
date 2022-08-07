import React, { Component } from 'react'
import InputField from './components/InputField'
import SelectField from './components/SelectField'
import DatePickerField from './components/DatePickerField'
import DictSelect from '../DictSelect'
import utilities from '../../style/utilities.scss'
import { Form, Button } from 'antd'

class Filter extends Component {
  handleSubmit = e => {
    e.preventDefault()
    const {
      onSubmit,
      form
    } = this.props
    if (typeof onSubmit === 'function') onSubmit(form.getFieldsValue())
  }

  render () {
    const {
      fields
    } = this.props

    const {
      getFieldDecorator
    } = this.props.form

    return (
      <Form
        layout='inline'
        className={utilities['filter-wrapper']}
        onSubmit={this.handleSubmit}>
        {
          fields.map((field) => {
            const FieldComponent = field.type === 'input' ? InputField
              : field.type === 'select' ? SelectField : DatePickerField
            const {
              type,
              config,
              ...fieldProps
            } = field
            return (
              <Form.Item key={fieldProps.name}>
                {
                  getFieldDecorator(fieldProps.name, {
                    ...config
                  })(
                    <FieldComponent {...fieldProps.attr} />
                  )
                }
              </Form.Item>
            )
          })
        }
        <Form.Item>
          <Button
            htmlType='submit'
            type='primary'
            icon='search'>
            查询
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(Filter)
