import React, {useEffect, useState} from 'react'
import {debounce} from '@fishballer/bui'

/**
 * @author 郭建强
 * @description 计算表格滚动高度
 * @param children
 * @param onTableHeight 改变窗口，监听高度
 * @param form 表单dom
 * @returns {*}
 * @constructor
 */
const TableContainer = ({children, onResize, form, refreshKey}) => {
  const [height, setHeight] = useState(400)
  // height = windowHeight - header - tab - containerPadding - tablePaddingTop - formMargin - tableHeader - pagination - formHeight
  const y = window.document.body.offsetHeight - (60 + 40 + 32 + 16 + 16 + 64 + 48 + 56 + 24) - (form?.offsetHeight || 0)
  useEffect(() => {
    const debounceGetHeight = debounce(onResize, 1000)
    window.addEventListener('resize', debounceGetHeight)
    return () => {
      window.removeEventListener('resize', debounceGetHeight)
    }
  },[])
  useEffect(() => {
    setHeight(y)
  }, [refreshKey])
  useEffect(() => {
    setHeight(y)
  }, [form])
  return typeof children === 'function' ? children(height) : null
}

TableContainer.defaultProps = {
  onResize: () => {},
  refreshKey: 0
}

export default TableContainer