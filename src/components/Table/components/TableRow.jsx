import React from 'react'

function TableRow (props) {
  const {record, selectedRowKeys, className, ...restProps} = props
  // console.log(props['data-row-key'])
  // return (
  //   <React.Fragment>
  //     {
  //       useMemo(() => (
  //         <tr className={className} {...restProps} />
  //       ), [props['data-row-key'], className, ...record])
  //     }
  //   </React.Fragment>
  // )
  return (<tr className={className} {...restProps} />)
}

export default TableRow

// function in2Array (arr1 = [], arr2 = [], val) {
//   return (Array.isArray(arr1) ? arr1.includes(val) : false) ||
//     (Array.isArray(arr2) ? arr2.includes(val) : false)
// }
//
// export default memo(TableRow, (prevProps, nextProps) => {
//   console.log(
//     prevProps['data-row-key'] === nextProps['data-row-key'], // isSameKey
//     in2Array(prevProps.selectedRowKeys, nextProps.selectedRowKeys, prevProps['data-row-key']), //  isSelectRender
//     shallowEqualObjects(prevProps.record, nextProps.record) // && isSameValue
//   )
//   return prevProps['data-row-key'] === nextProps['data-row-key'] && // isSameKey
//     !in2Array(prevProps.selectedRowKeys, nextProps.selectedRowKeys, prevProps['data-row-key']) && //  isSelectRender
//     shallowEqualObjects(prevProps.record, nextProps.record) // && isSameValue
// })
