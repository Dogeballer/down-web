import React from 'react'
import { Button, Modal } from 'antd'
import './style.g.scss'

function DeleteButton (props) {
  const {
    handleDelete,
    onDeleted,
    type = 'link',
    title = '提示',
    content = '确定要删除吗',
    children,
    ...restProps
  } = props
  const handleClick = () => {
    Modal.confirm({
      title,
      content,
      confirmLoading: true,
      onOk: () => {
        return handleDelete()
          .then(() => {
            typeof onDeleted === 'function' && onDeleted()
          })
      }
    })
  }
  return (
    <Button
      className={type === 'link' ? 'btn-link-danger' : null}
      type={type}
      onClick={handleClick}
      {...restProps}
    >
      {children || '删除'}
    </Button>
  )
}

export default DeleteButton
