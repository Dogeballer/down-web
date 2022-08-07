import { Form, Input } from 'antd'
import React from 'react'

const FormItem = Form.Item
export const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

export const EditableFormRow = Form.create()(EditableRow)

export class EditableCell extends React.Component {
  save = (e) => {
    const key = this.props.dataIndex
    const { record, handleSave } = this.props
    this.form.validateFields([key], (error, values) => {
      if (error) return
      if (values[key] !== record[key]) {
        handleSave && handleSave({ ...record, ...values }, () => {
          this.form.setFieldsValue({[key]: record[key]})
        })
      }
    })
  }

  renderCell = (form) => {
    this.form = form
    const { dataIndex, record, editRender, rules } = this.props
    return (
      <FormItem style={{ margin: 0, padding: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          initialValue: record[dataIndex],
          rules: rules || []
        })(
          editRender ? editRender({
            record,
            onPressEnter: this.save,
            onBlur: this.save
          }) : (<Input {...{
            record,
            onPressEnter: this.save,
            onBlur: this.save

          }} />)
        )}
      </FormItem>
    )
  }

  render () {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      editRender,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {this.renderCell}
          </EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}
