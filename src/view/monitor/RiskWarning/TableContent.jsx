import React, {useState, useEffect, Fragment, useRef} from 'react'
import Table from '@cecdataFE/bui/dist/components/Ant4Table'
import * as api from '../../../api/logs'
import DetailModal from './modal/DetailModal'
import moment from "moment";
import {INIT_PAGE} from "../../../constant"
import {HeightKeepWrapper} from "@cecdataFE/bui";

const mainKey = 'logId'
export default function (props) {
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState()
  const [total, setTotal] = useState(0)
  const queryRef = useRef({page: 1, size: 20, ...props.query})
  const q = queryRef.current

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    api.getLogs(queryRef.current).then(res => {
      setDataSource(res.data.list)
      setTotal(res.data.total)
    }).finally(() => {
      setLoading(false)
    })
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
      dataIndex: mainKey,
      width: 60,
      onCell: record => ({
        tooltip: () => record[mainKey]
      })
    },
    {
      title: '用户',
      dataIndex: 'userName'
    },
    {
      title: '操作类型',
      dataIndex: 'eventType',
      width: 80,
      align: 'center',
    },
    {
      title: '事件信息',
      dataIndex: 'eventInfo',
      render: v => <div className='flex-center-v'>
        <span className='text-ellipsis-1 flex1' title={v}>{v}</span>
        <DetailModal title='事件信息' value={v}>
          <a>详情</a>
        </DetailModal>
      </div>
    },
    {
      title: '操作IP',
      dataIndex: 'opIp',
      width: 128,
    },
    {
      title: '操作应用',
      dataIndex: 'opApp',
    },
    {
      title: '应用IP',
      dataIndex: 'appIp',
      width: 128,
    },
    {
      title: '资产IP',
      dataIndex: 'assetsIp',
      width: 128,
    },
    {
      title: '目标端口',
      dataIndex: 'targetPort',
      width: 80,
      align: 'center',
    },
    {
      title: '资产名称',
      dataIndex: 'assetsName'
    },
    {
      title: '资产类型',
      dataIndex: 'assetsType',
      width: 80,
      align: 'center',
      onCell: record => ({
        tooltip: () => record.assetsType
      })
    },
    {
      title: '资产等级',
      dataIndex: 'assetsLevel',
      width: 80,
      align: 'center'
    },
    {
      title: '控制方法',
      dataIndex: 'ctlType',
      width: 80,
      align: 'center',
    },
    {
      title: '协议类型',
      dataIndex: 'protocolType',
      width: 80,
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'opTime',
      render: v => v ? moment(v).format('YYYY-MM-DD HH:mm:ss') : '',
      width: 180,
      align: 'center',
    },
    {
      title: '原始日志',
      dataIndex: 'originalLog',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (v, r) => <DetailModal value={v}><a>详情</a></DetailModal>
    }
  ]

  return (
    <div style={{height: 'calc(100vh - 726px)', minHeight: 246, paddingBottom: 16}}>
      <HeightKeepWrapper>
        {
          scrollY => <Table
            scroll={{x: 2048, y: scrollY}}
            bordered
            rowKey={mainKey}
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            onChange={handleTableChange}
            pagination={{
              ...INIT_PAGE,
              showQuickJumper: false,
              total,
              current: q.page,
              pageSize: q.size,
            }}
          />
        }
      </HeightKeepWrapper>
    </div>
  )
}
