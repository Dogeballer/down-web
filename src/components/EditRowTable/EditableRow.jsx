import { Form, Input } from 'antd'
import React from 'react'

const FormItem = Form.Item
export const EditableContext = React.createContext()

const EditableTableRow = ({ form, children }) => (
  <EditableContext.Provider value={form}>
    {children}
  </EditableContext.Provider>
)

export const EditRowTable = Form.create()(EditableTableRow)

export class EditableCell extends React.Component {
  save = (e) => {
    const key = this.props.dataIndex
    const { record, handleSave } = this.props
    this.form.validateFields([key], (error, values) => {
      if (error) return
      if (values[key] !== record[key]) {
        handleSave && handleSave(key, { ...record, ...values }, () => {
          this.form.setFieldsValue({[key]: record[key]})
        })
      }
    })
  }

  renderCell = (form) => {
    this.form = form
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      rules,
      editRender,
      editable,
      handleSave,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editing && (dataIndex !== 'operate' && dataIndex !== 'index') ? (
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
        ) : (
          children
        )}
      </td>
    )
  }

  render () {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}
