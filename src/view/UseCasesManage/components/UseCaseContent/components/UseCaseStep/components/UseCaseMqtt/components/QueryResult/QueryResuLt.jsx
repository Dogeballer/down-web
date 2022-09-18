import React, { useContext, useEffect, useState } from 'react'
import { Table, TablePopconfirm, Input, Select, Form, Divider, message, Tooltip } from 'antd'
// import { Table } from '@fishballer/bui'
import { getNegativeUnique, isEmpty } from '../../../../../../../../../../lib/utils'
import utilities from '../../../../../../../../../../style/utilities.scss'
import IconFont from '../../../../../../../../../../components/Iconfont'
import store from '../UsecaseAssert/store'
import EllipsisText from '../../../../../../../../../../components/EllipsisText'
import style from '../UsecaseAssert/style.scss'

const QueryResult = (props) => {
  const [loading, setloading] = useState(props.loading)
  const [queryData, setQueryData] = useState([])
  const [columns, setColumns] = useState([])
  const [scrollObj, setScrollObj] = useState({ x: 0, y: 500 })

  useEffect(() => {
    setQueryData(props.queryData)
    columnsSet(props.columnsData)
  }, [props.queryData, props.columnsData])

  const columnsSet = (columnsData) => {
    let columnsList = [{
      title: '序号',
      width: 50,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => `${index + 1}`
    }]
    console.log(columnsData)
    if (!isEmpty(columnsData)) {
      columnsData.forEach((item) => {
        const column = {
          title: item,
          dataIndex: item,
          width: 150,
          align: 'center',
          render: (value) => <EllipsisText value={value} width={134}/>
        }
        columnsList.push(column)
      })
      setColumns(columnsList)
      setScrollObj({ x: 50 + 150 * columnsList.length, y: 500 })
    }
  }
  return (
    // <div className={style['es-hbase-table']}>
    <Table
      size={'small'}
      loading={loading}
      bordered
      dataSource={queryData}
      columns={columns}
      scroll={scrollObj}
      pagination={false}
      style={{ marginBottom: 10 }}
      rowKey={(r, i) => i}
    />
    // </div>
  )
}
export default QueryResult