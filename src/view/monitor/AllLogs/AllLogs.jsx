import React, {useEffect, useRef, useState} from 'react'
import cx from 'classnames'
import style from './style.scss'
import {Button, Input, Pagination, Select} from 'antd'
import { FixHeaderWrapper } from '@cecdataFE/bui'
import * as api from "../../../api/logs";
import DetailModal from "../RiskWarning/modal/DetailModal";
import Table from "@cecdataFE/bui/dist/components/Ant4Table";
import thousandComma from "@cecdataFE/bui/dist/lib/thousandComma"

const { Option } = Select
export default function (props) {
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState()
  const [total, setTotal] = useState(0)
  const queryRef = useRef({ page: 1, size: 20, isProvideService: 0 })
  const q = queryRef.current

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    api.getLogs(queryRef.current).then(res => {
      setDataSource(res.data.items)
      setTotal(res.data.total)
    }).finally(() => {
      setLoading(false)
    })
  }

  const onChange = key => e => {
    let value = e
    if (e?.target) {
      value = e.target.value
    }
    queryRef.current = { ...queryRef.current, [key]: value }
  }

  const search = () => {
    queryRef.current = { ...queryRef.current, page: 1 }
    fetchData()
  }

  const handleTableChange = ({current, pageSize}) => {
    queryRef.current.page = current
    if (queryRef.current.size !== pageSize) {
      queryRef.current.page = 1
    }
    queryRef.current.size = pageSize
    fetchData()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: '1'
    },
    {
      title: '用户',
      dataIndex: '1'
    },
    {
      title: '操作类型',
      dataIndex: '1'
    },
    {
      title: '事件信息',
      dataIndex: '1'
    },
    {
      title: '操作IP',
      dataIndex: '1'
    },
    {
      title: '操作应用',
      dataIndex: '1'
    },
    {
      title: '应用IP',
      dataIndex: '1'
    },
    {
      title: '资产ip',
      dataIndex: '1'
    },
    {
      title: '资产名称',
      dataIndex: '1'
    },
    {
      title: '资产类型',
      dataIndex: '1'
    },
    {
      title: '资产等级',
      dataIndex: '1'
    },
    {
      title: '控制方式',
      dataIndex: '1'
    },
    {
      title: '协议类型',
      dataIndex: '1'
    },
    {
      title: '操作时间',
      dataIndex: '1'
    },
    {
      title: '原始日志',
      dataIndex: 'op',
      align: 'center',
      fixed: 'right',
      render: (v, r) => <DetailModal><a>详情</a></DetailModal>
    }
  ]

  return (
    <div className='page-wrapper'>
      <div className={style.filters}>
        <Input onBlur={onChange('name')} placeholder='用户' allowClear style={{ width: 138 }} />
        <Input onBlur={onChange('ip')} placeholder='操作IP' allowClear style={{ width: 138 }} />
        <Select onChange={onChange('ip')} placeholder='操作类型' allowClear style={{ width: 138 }} dropdownMatchSelectWidth={false}>
          {
            [].map((v,i) => <Option key={i} value={v}>{v.label}</Option>)
          }
        </Select>
        <Select onChange={onChange('ip')} placeholder='应用' allowClear style={{ width: 138 }} dropdownMatchSelectWidth={false}>
          {
            [].map((v,i) => <Option key={i} value={v}>{v.label}</Option>)
          }
        </Select>
        <Select onChange={onChange('ip')} placeholder='资产类型' allowClear style={{ width: 138 }} dropdownMatchSelectWidth={false}>
          {
            [].map((v,i) => <Option key={i} value={v}>{v.label}</Option>)
          }
        </Select>
        <Select onChange={onChange('ip')} placeholder='资产等级' allowClear style={{ width: 138 }} dropdownMatchSelectWidth={false}>
          {
            [].map((v,i) => <Option key={i} value={v}>{v.label}</Option>)
          }
        </Select>
        <Select onChange={onChange('ip')} placeholder='控制方法' allowClear style={{ width: 138 }} dropdownMatchSelectWidth={false}>
          {
            [].map((v,i) => <Option key={i} value={v}>{v.label}</Option>)
          }
        </Select>
        <Button type='primary' onMouseUp={search}>查询</Button>
        <Button type='primary' onMouseUp={search}>导出</Button>
      </div>
      <FixHeaderWrapper siblingsHeight={96}>
        {
          (scrollY) => <Table
            sticky
            scroll={{ x: 2046, y: scrollY }}
            bordered
            rowKey='id'
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            onChange={handleTableChange}
            pagination={{
              showSizeChanger: true,
              total,
              showTotal: total => `总共 ${thousandComma(total)} 条数据`,
              pageSizeOptions: ['20', '30', '50', '100'],
              current: q.page,
              pageSize: q.size,
            }}
          />
        }
      </FixHeaderWrapper>
    </div>
  )
}
